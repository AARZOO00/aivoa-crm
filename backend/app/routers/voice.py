import os
import tempfile
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from app.services.auth_service import get_current_user
from app.models.user import User
from app.config import settings
from app.services.groq_service import call_groq

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/voice", tags=["Voice"])

SUPPORTED_FORMATS = {"audio/webm", "audio/wav", "audio/mp3", "audio/mpeg",
                     "audio/ogg", "audio/m4a", "audio/mp4", "audio/flac"}


@router.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """
    Transcribe audio to text using Groq's Whisper endpoint.
    Falls back to OpenAI Whisper if OPENAI_API_KEY is set.
    """
    try:
        audio_bytes = await file.read()
        if len(audio_bytes) > 25 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="Audio file too large (max 25MB)")

        # Try Groq Whisper first (faster, free)
        try:
            from groq import Groq
            client = Groq(api_key=settings.GROQ_API_KEY)
            suffix = _get_suffix(file.content_type, file.filename)
            with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
                tmp.write(audio_bytes)
                tmp_path = tmp.name

            with open(tmp_path, "rb") as audio_file:
                transcription = client.audio.transcriptions.create(
                    model="whisper-large-v3",
                    file=audio_file,
                    response_format="text",
                )
            os.unlink(tmp_path)
            transcript_text = transcription if isinstance(transcription, str) else transcription.text

        except Exception as groq_err:
            logger.warning(f"Groq Whisper failed: {groq_err}, trying OpenAI...")
            if not settings.OPENAI_API_KEY:
                raise HTTPException(status_code=503, detail="Transcription service unavailable")
            from openai import AsyncOpenAI
            oai = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            suffix = _get_suffix(file.content_type, file.filename)
            with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
                tmp.write(audio_bytes)
                tmp_path = tmp.name
            with open(tmp_path, "rb") as af:
                result = await oai.audio.transcriptions.create(model="whisper-1", file=af)
            os.unlink(tmp_path)
            transcript_text = result.text

        # Use Groq to structure the transcript into interaction fields
        structured = await call_groq(
            system_prompt="""You are a medical CRM assistant. Extract structured HCP interaction data from this voice transcript.
Return ONLY valid JSON with these fields (null if not mentioned):
{
  "topics_discussed": "string",
  "sentiment": "Positive|Neutral|Negative|null",
  "outcomes": "string|null",
  "follow_up_actions": "string|null",
  "attendees": ["list"],
  "materials_shared": ["list"],
  "ai_summary": "1-2 sentence summary"
}""",
            user_message=f"Voice transcript:\n{transcript_text}",
        )

        import json
        try:
            clean = structured.strip().lstrip("```json").lstrip("```").rstrip("```")
            parsed = json.loads(clean)
        except Exception:
            parsed = {}

        return {
            "transcript": transcript_text,
            "structured_data": parsed,
            "word_count": len(transcript_text.split()),
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Transcription error: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")


def _get_suffix(content_type: str, filename: str) -> str:
    ext_map = {
        "audio/webm": ".webm", "audio/wav": ".wav", "audio/mp3": ".mp3",
        "audio/mpeg": ".mp3", "audio/ogg": ".ogg", "audio/m4a": ".m4a",
        "audio/mp4": ".mp4", "audio/flac": ".flac",
    }
    if content_type in ext_map:
        return ext_map[content_type]
    if filename and "." in filename:
        return "." + filename.rsplit(".", 1)[-1]
    return ".webm"
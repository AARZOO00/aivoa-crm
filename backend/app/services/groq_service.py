from groq import Groq
from app.config import settings
import logging

logger = logging.getLogger(__name__)

PRIMARY_MODEL = "gemma2-9b-it"
FALLBACK_MODEL = "llama-3.3-70b-versatile"

_client = None


def get_groq_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client


async def call_groq(system_prompt: str, user_message: str, model: str = PRIMARY_MODEL) -> str:
    """
    Call Groq API with given system prompt and user message.
    Falls back to FALLBACK_MODEL if primary fails.
    """
    client = get_groq_client()
    
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.3,
            max_tokens=2048,
        )
        return response.choices[0].message.content or ""
    except Exception as e:
        logger.warning(f"Primary model {model} failed: {e}. Trying fallback.")
        if model != FALLBACK_MODEL:
            try:
                response = client.chat.completions.create(
                    model=FALLBACK_MODEL,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message},
                    ],
                    temperature=0.3,
                    max_tokens=2048,
                )
                return response.choices[0].message.content or ""
            except Exception as fallback_err:
                logger.error(f"Fallback model also failed: {fallback_err}")
                raise fallback_err
        raise e

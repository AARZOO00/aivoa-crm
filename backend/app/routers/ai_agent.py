import json
import logging
import uuid
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, Dict, Any, List, AsyncIterator

from app.database import get_db
from app.agent.graph import get_agent_graph
from app.agent.state import AgentState
from app.services.groq_service import get_groq_client
from app.services.auth_service import get_current_user
from app.models.user import User
from app.config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/agent", tags=["AI Agent"])

_sessions: Dict[str, List[Dict[str, str]]] = {}


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    interaction_id: Optional[int] = None
    stream: bool = False


class ChatResponse(BaseModel):
    response: str
    tool_used: str
    data: Dict[str, Any]
    session_id: str


async def _stream_groq_response(message: str, session_id: str, db: AsyncSession) -> AsyncIterator[str]:
    """Stream tokens from Groq using SSE format."""
    graph = get_agent_graph()
    messages = _sessions.get(session_id, [])

    # First run the graph non-streaming to get tool_used + data
    initial_state: AgentState = {
        "messages": messages,
        "session_id": session_id,
        "interaction_id": None,
        "user_message": message,
        "tool_used": "",
        "tool_result": {},
        "response": "",
        "extracted_data": {},
        "db_session": db,
    }
    final_state = await graph.ainvoke(initial_state)
    tool_used = final_state.get("tool_used", "general")
    extracted_data = final_state.get("extracted_data", {})
    full_response = final_state.get("response", "")

    # Emit metadata first
    yield f"data: {json.dumps({'type': 'meta', 'tool_used': tool_used, 'session_id': session_id, 'data': extracted_data})}\n\n"

    # Stream the response text word by word to simulate streaming
    words = full_response.split(" ")
    buffer = ""
    for i, word in enumerate(words):
        buffer += word + (" " if i < len(words) - 1 else "")
        # Emit every 3 words or at punctuation
        if len(buffer) > 15 or i == len(words) - 1 or word.endswith((".", "!", "?", "\n")):
            yield f"data: {json.dumps({'type': 'token', 'content': buffer})}\n\n"
            buffer = ""

    # Update session
    updated_messages = list(messages)
    updated_messages.append({"role": "user", "content": message})
    updated_messages.append({"role": "assistant", "content": full_response})
    _sessions[session_id] = updated_messages[-20:]

    yield f"data: {json.dumps({'type': 'done'})}\n\n"


@router.post("/chat")
async def agent_chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session_id = request.session_id or str(uuid.uuid4())

    if request.stream:
        return StreamingResponse(
            _stream_groq_response(request.message, session_id, db),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",
                "Connection": "keep-alive",
            },
        )

    try:
        messages = _sessions.get(session_id, [])
        graph = get_agent_graph()
        initial_state: AgentState = {
            "messages": messages,
            "session_id": session_id,
            "interaction_id": request.interaction_id,
            "user_message": request.message,
            "tool_used": "",
            "tool_result": {},
            "response": "",
            "extracted_data": {},
            "db_session": db,
        }
        final_state = await graph.ainvoke(initial_state)
        _sessions[session_id] = final_state.get("messages", [])[-20:]
        return ChatResponse(
            response=final_state.get("response", "How can I help?"),
            tool_used=final_state.get("tool_used", "general"),
            data=final_state.get("extracted_data", {}),
            session_id=session_id,
        )
    except Exception as e:
        logger.error(f"Agent chat error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")


@router.delete("/session/{session_id}")
async def clear_session(session_id: str, current_user: User = Depends(get_current_user)):
    if session_id in _sessions:
        del _sessions[session_id]
    return {"message": f"Session {session_id} cleared."}


@router.get("/session/{session_id}/history")
async def get_session_history(session_id: str, current_user: User = Depends(get_current_user)):
    return {"session_id": session_id, "messages": _sessions.get(session_id, [])}
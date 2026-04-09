from typing import TypedDict, List, Optional, Any, Dict


class AgentState(TypedDict):
    messages: List[Dict[str, str]]
    session_id: str
    interaction_id: Optional[int]
    user_message: str
    tool_used: str
    tool_result: Any
    response: str
    extracted_data: Dict[str, Any]

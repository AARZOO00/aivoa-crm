import logging
from typing import Any, Dict
from langgraph.graph import StateGraph, END
from app.agent.state import AgentState
from app.agent.prompts import ROUTER_SYSTEM_PROMPT, GENERAL_RESPONSE_SYSTEM_PROMPT
from app.agent.tools.log_interaction import log_interaction_tool
from app.agent.tools.edit_interaction import edit_interaction_tool
from app.agent.tools.search_hcp import search_hcp_tool
from app.agent.tools.suggest_followup import suggest_followup_tool
from app.agent.tools.analyze_sentiment import analyze_sentiment_tool
from app.services.groq_service import call_groq

logger = logging.getLogger(__name__)

VALID_TOOLS = {"log_interaction", "edit_interaction", "search_hcp", "suggest_followup", "analyze_sentiment", "general"}


async def router_node(state: AgentState) -> AgentState:
    """Classify user intent and route to appropriate tool."""
    try:
        user_message = state["user_message"]
        history_text = ""
        if state.get("messages"):
            recent = state["messages"][-4:]
            history_text = "\n".join([f"{m['role']}: {m['content']}" for m in recent])
            full_message = f"Conversation history:\n{history_text}\n\nCurrent message: {user_message}"
        else:
            full_message = user_message

        tool_name = await call_groq(
            system_prompt=ROUTER_SYSTEM_PROMPT,
            user_message=full_message,
        )
        tool_name = tool_name.strip().lower().split()[0] if tool_name.strip() else "general"

        if tool_name not in VALID_TOOLS:
            tool_name = "general"

        return {**state, "tool_used": tool_name}
    except Exception as e:
        logger.error(f"Router node error: {e}")
        return {**state, "tool_used": "general"}


async def log_interaction_node(state: AgentState) -> AgentState:
    """Handle log interaction requests."""
    try:
        result = await log_interaction_tool(
            user_message=state["user_message"],
            db_session=state.get("db_session"),
        )
        return {**state, "tool_result": result, "extracted_data": result.get("data", {})}
    except Exception as e:
        logger.error(f"Log interaction node error: {e}")
        return {**state, "tool_result": {"success": False, "message": str(e)}, "extracted_data": {}}


async def edit_interaction_node(state: AgentState) -> AgentState:
    """Handle edit interaction requests."""
    try:
        interaction_id = state.get("interaction_id")
        if not interaction_id:
            return {
                **state,
                "tool_result": {
                    "success": False,
                    "message": "Please specify which interaction to edit. Provide an interaction ID.",
                },
                "extracted_data": {},
            }
        result = await edit_interaction_tool(
            interaction_id=interaction_id,
            user_message=state["user_message"],
            db_session=state.get("db_session"),
        )
        return {**state, "tool_result": result, "extracted_data": result.get("data", {})}
    except Exception as e:
        logger.error(f"Edit interaction node error: {e}")
        return {**state, "tool_result": {"success": False, "message": str(e)}, "extracted_data": {}}


async def search_hcp_node(state: AgentState) -> AgentState:
    """Handle HCP search requests."""
    try:
        user_message = state["user_message"]
        # Extract search query from message
        query = user_message
        for prefix in ["search for", "find hcp", "search hcp", "look up", "find doctor", "search"]:
            if prefix in user_message.lower():
                query = user_message.lower().replace(prefix, "").strip()
                break

        result = await search_hcp_tool(
            query=query,
            db_session=state.get("db_session"),
        )
        return {**state, "tool_result": result, "extracted_data": {"hcps": result.get("data", [])}}
    except Exception as e:
        logger.error(f"Search HCP node error: {e}")
        return {**state, "tool_result": {"success": False, "message": str(e)}, "extracted_data": {}}


async def suggest_followup_node(state: AgentState) -> AgentState:
    """Handle follow-up suggestion requests."""
    try:
        result = await suggest_followup_tool(
            interaction_summary=state["user_message"],
        )
        return {**state, "tool_result": result, "extracted_data": result.get("data", {})}
    except Exception as e:
        logger.error(f"Suggest followup node error: {e}")
        return {**state, "tool_result": {"success": False, "message": str(e)}, "extracted_data": {}}


async def analyze_sentiment_node(state: AgentState) -> AgentState:
    """Handle sentiment analysis requests."""
    try:
        result = await analyze_sentiment_tool(
            interaction_notes=state["user_message"],
        )
        return {**state, "tool_result": result, "extracted_data": result.get("data", {})}
    except Exception as e:
        logger.error(f"Analyze sentiment node error: {e}")
        return {**state, "tool_result": {"success": False, "message": str(e)}, "extracted_data": {}}


async def general_node(state: AgentState) -> AgentState:
    """Handle general queries."""
    try:
        response = await call_groq(
            system_prompt=GENERAL_RESPONSE_SYSTEM_PROMPT,
            user_message=state["user_message"],
        )
        return {
            **state,
            "tool_result": {"success": True, "message": response},
            "extracted_data": {},
        }
    except Exception as e:
        logger.error(f"General node error: {e}")
        return {
            **state,
            "tool_result": {
                "success": True,
                "message": "Hello! I'm AIVOA AI Assistant. I can help you log HCP interactions, search for doctors, analyze sentiment, and suggest follow-up actions. How can I help?",
            },
            "extracted_data": {},
        }


async def response_node(state: AgentState) -> AgentState:
    """Format the final response from tool results."""
    tool_result = state.get("tool_result", {})
    tool_used = state.get("tool_used", "general")

    if tool_used == "general":
        response_text = tool_result.get("message", "How can I help you?")
    else:
        message = tool_result.get("message", "")
        data = tool_result.get("data", {})

        if tool_used == "log_interaction" and tool_result.get("success"):
            hcp = data.get("hcp_name", "Unknown HCP")
            summary = data.get("ai_summary", "")
            response_text = f"✅ {message}"
            if summary:
                response_text += f"\n\n**Summary:** {summary}"
            response_text += "\n\nThe form has been auto-filled with the extracted data. Please review and submit."

        elif tool_used == "search_hcp" and tool_result.get("success"):
            hcps = data if isinstance(data, list) else data.get("hcps", [])
            if hcps:
                hcp_list = "\n".join([f"• **{h['name']}** — {h.get('specialty', 'N/A')} at {h.get('hospital', 'N/A')}" for h in hcps[:5]])
                response_text = f"🔍 {message}\n\n{hcp_list}"
            else:
                response_text = f"🔍 {message}"

        elif tool_used == "suggest_followup" and tool_result.get("success"):
            suggestions = data.get("suggestions", [])
            if suggestions:
                sugg_list = "\n".join([f"{i+1}. {s}" for i, s in enumerate(suggestions)])
                response_text = f"💡 **Suggested Follow-up Actions:**\n\n{sugg_list}"
            else:
                response_text = message

        elif tool_used == "analyze_sentiment" and tool_result.get("success"):
            sentiment = data.get("sentiment", "Neutral")
            confidence = data.get("confidence", 0.5)
            reasoning = data.get("reasoning", "")
            indicators = data.get("key_indicators", [])
            emoji = {"Positive": "😊", "Neutral": "😐", "Negative": "😟"}.get(sentiment, "😐")
            response_text = f"{emoji} **Sentiment: {sentiment}** ({confidence:.0%} confidence)\n\n{reasoning}"
            if indicators:
                ind_text = ", ".join(indicators[:3])
                response_text += f"\n\n**Key indicators:** {ind_text}"

        elif tool_used == "edit_interaction" and tool_result.get("success"):
            response_text = f"✏️ {message}"
        else:
            response_text = message or "Operation completed."

    # Update message history
    messages = list(state.get("messages", []))
    messages.append({"role": "user", "content": state["user_message"]})
    messages.append({"role": "assistant", "content": response_text})

    return {**state, "response": response_text, "messages": messages}


def route_to_tool(state: AgentState) -> str:
    """Conditional edge: route based on tool_used."""
    return state.get("tool_used", "general")


def build_agent_graph() -> StateGraph:
    """Build and compile the LangGraph StateGraph."""
    graph = StateGraph(AgentState)

    # Add nodes
    graph.add_node("router", router_node)
    graph.add_node("log_interaction", log_interaction_node)
    graph.add_node("edit_interaction", edit_interaction_node)
    graph.add_node("search_hcp", search_hcp_node)
    graph.add_node("suggest_followup", suggest_followup_node)
    graph.add_node("analyze_sentiment", analyze_sentiment_node)
    graph.add_node("general", general_node)
    graph.add_node("response", response_node)

    # Set entry point
    graph.set_entry_point("router")

    # Add conditional edges from router to tool nodes
    graph.add_conditional_edges(
        "router",
        route_to_tool,
        {
            "log_interaction": "log_interaction",
            "edit_interaction": "edit_interaction",
            "search_hcp": "search_hcp",
            "suggest_followup": "suggest_followup",
            "analyze_sentiment": "analyze_sentiment",
            "general": "general",
        },
    )

    # All tool nodes go to response node
    for tool in ["log_interaction", "edit_interaction", "search_hcp", "suggest_followup", "analyze_sentiment", "general"]:
        graph.add_edge(tool, "response")

    # Response goes to END
    graph.add_edge("response", END)

    return graph.compile()


# Singleton compiled graph
_compiled_graph = None


def get_agent_graph():
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = build_agent_graph()
    return _compiled_graph

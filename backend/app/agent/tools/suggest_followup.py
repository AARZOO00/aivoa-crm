import json
import logging
from typing import Dict, Any, List
from app.services.groq_service import call_groq
from app.agent.prompts import FOLLOWUP_SYSTEM_PROMPT

logger = logging.getLogger(__name__)


async def suggest_followup_tool(
    interaction_summary: str,
) -> Dict[str, Any]:
    """
    Generate 3 specific follow-up action suggestions based on interaction summary.
    """
    try:
        raw_response = await call_groq(
            system_prompt=FOLLOWUP_SYSTEM_PROMPT,
            user_message=f"Generate follow-up suggestions for this HCP interaction:\n{interaction_summary}",
        )

        clean = raw_response.strip()
        if clean.startswith("```"):
            lines = clean.split("\n")
            clean = "\n".join(lines[1:-1]) if len(lines) > 2 else clean

        suggestions: List[str] = json.loads(clean)

        if not isinstance(suggestions, list):
            suggestions = [str(suggestions)]

        # Ensure exactly 3 suggestions
        suggestions = suggestions[:3]
        while len(suggestions) < 3:
            suggestions.append("Schedule a follow-up meeting to discuss next steps")

        return {
            "success": True,
            "data": {"suggestions": suggestions},
            "message": f"Generated {len(suggestions)} follow-up suggestions.",
        }

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error in suggest_followup: {e}")
        # Fallback suggestions
        return {
            "success": True,
            "data": {
                "suggestions": [
                    "Schedule a follow-up meeting within 2 weeks",
                    "Send updated product efficacy data",
                    "Invite HCP to upcoming medical symposium",
                ]
            },
            "message": "Generated follow-up suggestions (fallback).",
        }
    except Exception as e:
        logger.error(f"Error in suggest_followup tool: {e}")
        return {
            "success": False,
            "data": {"suggestions": []},
            "message": f"Error generating suggestions: {str(e)}",
        }

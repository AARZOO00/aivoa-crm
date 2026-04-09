import json
import logging
from typing import Any, Dict, Optional
from app.services.groq_service import call_groq
from app.agent.prompts import EDIT_EXTRACTION_SYSTEM_PROMPT

logger = logging.getLogger(__name__)


async def edit_interaction_tool(
    interaction_id: int,
    user_message: str,
    fields: Optional[Dict[str, Any]] = None,
    db_session=None,
) -> Dict[str, Any]:
    """
    Edit an existing interaction record. Accepts either structured fields
    or a natural language instruction parsed by Groq.
    """
    try:
        if not db_session:
            return {"success": False, "data": {}, "message": "Database session required"}

        from app.models.interaction import Interaction, InteractionType, SentimentType
        from sqlalchemy import select

        stmt = select(Interaction).where(Interaction.id == interaction_id)
        result = await db_session.execute(stmt)
        interaction = result.scalar_one_or_none()

        if not interaction:
            return {
                "success": False,
                "data": {},
                "message": f"Interaction with ID {interaction_id} not found.",
            }

        # If no structured fields provided, parse from natural language
        update_fields = fields or {}
        if not update_fields and user_message:
            raw_response = await call_groq(
                system_prompt=EDIT_EXTRACTION_SYSTEM_PROMPT,
                user_message=user_message,
            )
            clean = raw_response.strip()
            if clean.startswith("```"):
                lines = clean.split("\n")
                clean = "\n".join(lines[1:-1]) if len(lines) > 2 else clean
            update_fields = json.loads(clean)

        # Apply updates
        for field, value in update_fields.items():
            if value is None:
                continue
            if field == "interaction_type":
                try:
                    setattr(interaction, field, InteractionType(value))
                except ValueError:
                    pass
            elif field == "sentiment":
                try:
                    setattr(interaction, field, SentimentType(value))
                except ValueError:
                    pass
            elif hasattr(interaction, field):
                setattr(interaction, field, value)

        await db_session.flush()
        await db_session.refresh(interaction)

        return {
            "success": True,
            "data": update_fields,
            "message": f"Interaction {interaction_id} updated successfully.",
        }

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error in edit_interaction: {e}")
        return {
            "success": False,
            "data": {},
            "message": "Could not parse update instructions.",
        }
    except Exception as e:
        logger.error(f"Error in edit_interaction tool: {e}")
        return {
            "success": False,
            "data": {},
            "message": f"Error updating interaction: {str(e)}",
        }

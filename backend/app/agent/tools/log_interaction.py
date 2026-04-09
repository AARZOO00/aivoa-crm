import json
import logging
from typing import Any, Dict, Optional
from app.services.groq_service import call_groq
from app.agent.prompts import ENTITY_EXTRACTION_SYSTEM_PROMPT

logger = logging.getLogger(__name__)


async def log_interaction_tool(
    user_message: str,
    db_session=None,
    form_data: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Extract structured interaction data from natural language using Groq,
    then save to the database.
    """
    try:
        # Use Groq to extract structured data
        raw_response = await call_groq(
            system_prompt=ENTITY_EXTRACTION_SYSTEM_PROMPT,
            user_message=user_message,
        )

        # Clean JSON response
        clean = raw_response.strip()
        if clean.startswith("```"):
            lines = clean.split("\n")
            clean = "\n".join(lines[1:-1]) if len(lines) > 2 else clean

        extracted = json.loads(clean)

        # If form_data provided, merge (form_data takes priority)
        if form_data:
            for key, value in form_data.items():
                if value is not None and value != "" and value != []:
                    extracted[key] = value

        # Save to DB if session provided
        if db_session:
            from app.models.interaction import Interaction, InteractionType, SentimentType
            from app.models.hcp import HCP
            from sqlalchemy import select

            hcp_id = None
            if extracted.get("hcp_name"):
                stmt = select(HCP).where(HCP.name.ilike(f"%{extracted['hcp_name']}%"))
                result = await db_session.execute(stmt)
                hcp = result.scalar_one_or_none()
                if hcp:
                    hcp_id = hcp.id

            interaction_type_str = extracted.get("interaction_type") or "Meeting"
            try:
                itype = InteractionType(interaction_type_str)
            except ValueError:
                itype = InteractionType.Meeting

            sentiment_str = extracted.get("sentiment") or "Neutral"
            try:
                stype = SentimentType(sentiment_str)
            except ValueError:
                stype = SentimentType.Neutral

            interaction = Interaction(
                hcp_id=hcp_id,
                interaction_type=itype,
                date=extracted.get("date"),
                time=extracted.get("time"),
                attendees=extracted.get("attendees", []),
                topics_discussed=extracted.get("topics_discussed"),
                materials_shared=extracted.get("materials_shared", []),
                samples_distributed=extracted.get("samples_distributed", []),
                sentiment=stype,
                outcomes=extracted.get("outcomes"),
                follow_up_actions=extracted.get("follow_up_actions"),
                ai_summary=extracted.get("ai_summary"),
            )
            db_session.add(interaction)
            await db_session.flush()
            await db_session.refresh(interaction)
            extracted["id"] = interaction.id

        return {
            "success": True,
            "data": extracted,
            "message": f"Interaction logged successfully. Extracted data for HCP: {extracted.get('hcp_name', 'Unknown')}",
        }

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error in log_interaction: {e}")
        return {
            "success": False,
            "data": {},
            "message": "Could not parse interaction data. Please provide more details.",
        }
    except Exception as e:
        logger.error(f"Error in log_interaction tool: {e}")
        return {
            "success": False,
            "data": {},
            "message": f"Error logging interaction: {str(e)}",
        }

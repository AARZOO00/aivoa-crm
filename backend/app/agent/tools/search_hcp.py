import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)


async def search_hcp_tool(
    query: str,
    db_session=None,
) -> Dict[str, Any]:
    """
    Search for HCPs by name or specialty using PostgreSQL ILIKE search.
    """
    try:
        if not db_session:
            return {"success": False, "data": [], "message": "Database session required"}

        from app.models.hcp import HCP
        from sqlalchemy import select, or_

        stmt = select(HCP).where(
            or_(
                HCP.name.ilike(f"%{query}%"),
                HCP.specialty.ilike(f"%{query}%"),
                HCP.hospital.ilike(f"%{query}%"),
            )
        ).limit(10)

        result = await db_session.execute(stmt)
        hcps = result.scalars().all()

        hcp_list: List[Dict[str, Any]] = [
            {
                "id": hcp.id,
                "name": hcp.name,
                "specialty": hcp.specialty,
                "hospital": hcp.hospital,
                "territory": hcp.territory,
                "email": hcp.email,
                "phone": hcp.phone,
            }
            for hcp in hcps
        ]

        if hcp_list:
            message = f"Found {len(hcp_list)} HCP(s) matching '{query}'."
        else:
            message = f"No HCPs found matching '{query}'. Try a different search term."

        return {
            "success": True,
            "data": hcp_list,
            "message": message,
        }

    except Exception as e:
        logger.error(f"Error in search_hcp tool: {e}")
        return {
            "success": False,
            "data": [],
            "message": f"Error searching HCPs: {str(e)}",
        }

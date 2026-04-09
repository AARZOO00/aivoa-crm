from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case
from typing import Optional
from app.database import get_db
from app.models.interaction import Interaction, InteractionType, SentimentType
from app.models.hcp import HCP
from app.services.auth_service import get_current_user
from app.models.user import User
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/dashboard")
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Full analytics dashboard — summary cards, trends, breakdowns."""
    try:
        # Total interactions
        total_q = await db.execute(select(func.count()).select_from(Interaction))
        total = total_q.scalar() or 0

        # Sentiment distribution
        sent_q = await db.execute(
            select(Interaction.sentiment, func.count().label("count"))
            .group_by(Interaction.sentiment)
        )
        sentiment_dist = {r.sentiment: r.count for r in sent_q.all() if r.sentiment}

        # Interaction type breakdown
        type_q = await db.execute(
            select(Interaction.interaction_type, func.count().label("count"))
            .group_by(Interaction.interaction_type)
        )
        type_dist = {str(r.interaction_type): r.count for r in type_q.all() if r.interaction_type}

        # Interactions per month (last 6 months)
        monthly_q = await db.execute(
            select(
                func.to_char(Interaction.created_at, "YYYY-MM").label("month"),
                func.count().label("count"),
            )
            .where(Interaction.created_at >= func.now() - func.cast("6 months", type_=None))
            .group_by(func.to_char(Interaction.created_at, "YYYY-MM"))
            .order_by(func.to_char(Interaction.created_at, "YYYY-MM"))
        )
        monthly = [{"month": r.month, "count": r.count} for r in monthly_q.all()]

        # Top HCPs by interaction count
        top_hcp_q = await db.execute(
            select(HCP.name, HCP.specialty, func.count(Interaction.id).label("count"))
            .join(Interaction, Interaction.hcp_id == HCP.id, isouter=True)
            .group_by(HCP.id, HCP.name, HCP.specialty)
            .order_by(func.count(Interaction.id).desc())
            .limit(5)
        )
        top_hcps = [
            {"name": r.name, "specialty": r.specialty, "interactions": r.count}
            for r in top_hcp_q.all()
        ]

        # Positive sentiment rate
        positive_count = sentiment_dist.get("Positive", 0)
        positive_rate = round((positive_count / total * 100), 1) if total > 0 else 0

        # Total unique HCPs engaged
        hcp_q = await db.execute(
            select(func.count(func.distinct(Interaction.hcp_id)))
            .where(Interaction.hcp_id.isnot(None))
        )
        unique_hcps = hcp_q.scalar() or 0

        # Recent interactions (last 5)
        recent_q = await db.execute(
            select(Interaction, HCP.name.label("hcp_name"))
            .join(HCP, HCP.id == Interaction.hcp_id, isouter=True)
            .order_by(Interaction.created_at.desc())
            .limit(5)
        )
        recent_rows = recent_q.all()
        recent = [
            {
                "id": row.Interaction.id,
                "hcp_name": row.hcp_name or "Unknown",
                "interaction_type": str(row.Interaction.interaction_type),
                "sentiment": str(row.Interaction.sentiment),
                "date": row.Interaction.date,
                "created_at": row.Interaction.created_at.isoformat() if row.Interaction.created_at else None,
            }
            for row in recent_rows
        ]

        return {
            "summary": {
                "total_interactions": total,
                "unique_hcps_engaged": unique_hcps,
                "positive_sentiment_rate": positive_rate,
                "avg_interactions_per_month": round(total / 6, 1) if monthly else 0,
            },
            "sentiment_distribution": sentiment_dist,
            "interaction_type_distribution": type_dist,
            "monthly_trend": monthly,
            "top_hcps": top_hcps,
            "recent_interactions": recent,
        }

    except Exception as e:
        logger.error(f"Analytics error: {e}", exc_info=True)
        return {
            "summary": {"total_interactions": 0, "unique_hcps_engaged": 0,
                        "positive_sentiment_rate": 0, "avg_interactions_per_month": 0},
            "sentiment_distribution": {},
            "interaction_type_distribution": {},
            "monthly_trend": [],
            "top_hcps": [],
            "recent_interactions": [],
        }


@router.get("/hcp/{hcp_id}/timeline")
async def get_hcp_timeline(
    hcp_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Full interaction timeline for a single HCP."""
    hcp_q = await db.execute(select(HCP).where(HCP.id == hcp_id))
    hcp = hcp_q.scalar_one_or_none()
    if not hcp:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="HCP not found")

    interactions_q = await db.execute(
        select(Interaction)
        .where(Interaction.hcp_id == hcp_id)
        .order_by(Interaction.created_at.desc())
    )
    interactions = interactions_q.scalars().all()

    # Sentiment trend
    sentiment_counts = {"Positive": 0, "Neutral": 0, "Negative": 0}
    for i in interactions:
        s = str(i.sentiment) if i.sentiment else "Neutral"
        sentiment_counts[s] = sentiment_counts.get(s, 0) + 1

    return {
        "hcp": {
            "id": hcp.id, "name": hcp.name, "specialty": hcp.specialty,
            "hospital": hcp.hospital, "territory": hcp.territory,
            "email": hcp.email, "phone": hcp.phone,
        },
        "stats": {
            "total_interactions": len(interactions),
            "sentiment_breakdown": sentiment_counts,
            "last_contact": interactions[0].created_at.isoformat() if interactions else None,
        },
        "interactions": [
            {
                "id": i.id,
                "interaction_type": str(i.interaction_type),
                "date": i.date,
                "time": i.time,
                "attendees": i.attendees or [],
                "topics_discussed": i.topics_discussed,
                "materials_shared": i.materials_shared or [],
                "samples_distributed": i.samples_distributed or [],
                "sentiment": str(i.sentiment),
                "outcomes": i.outcomes,
                "follow_up_actions": i.follow_up_actions,
                "ai_summary": i.ai_summary,
                "created_at": i.created_at.isoformat() if i.created_at else None,
            }
            for i in interactions
        ],
    }
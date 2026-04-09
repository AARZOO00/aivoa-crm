from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models.interaction import Interaction, InteractionType, SentimentType
from app.schemas.interaction import InteractionCreate, InteractionRead, InteractionUpdate

router = APIRouter(prefix="/api/interactions", tags=["Interactions"])


@router.get("/", response_model=List[InteractionRead])
async def list_interactions(
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """List all interactions with pagination."""
    try:
        stmt = select(Interaction).offset(skip).limit(limit).order_by(Interaction.created_at.desc())
        result = await db.execute(stmt)
        return result.scalars().all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching interactions: {str(e)}")


@router.get("/{interaction_id}", response_model=InteractionRead)
async def get_interaction(interaction_id: int, db: AsyncSession = Depends(get_db)):
    """Get a single interaction by ID."""
    stmt = select(Interaction).where(Interaction.id == interaction_id)
    result = await db.execute(stmt)
    interaction = result.scalar_one_or_none()
    if not interaction:
        raise HTTPException(status_code=404, detail=f"Interaction {interaction_id} not found")
    return interaction


@router.post("/", response_model=InteractionRead, status_code=201)
async def create_interaction(payload: InteractionCreate, db: AsyncSession = Depends(get_db)):
    """Create a new interaction record."""
    try:
        interaction = Interaction(**payload.model_dump())
        db.add(interaction)
        await db.flush()
        await db.refresh(interaction)
        return interaction
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating interaction: {str(e)}")


@router.put("/{interaction_id}", response_model=InteractionRead)
async def update_interaction(
    interaction_id: int,
    payload: InteractionUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing interaction."""
    stmt = select(Interaction).where(Interaction.id == interaction_id)
    result = await db.execute(stmt)
    interaction = result.scalar_one_or_none()
    if not interaction:
        raise HTTPException(status_code=404, detail=f"Interaction {interaction_id} not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(interaction, field, value)

    await db.flush()
    await db.refresh(interaction)
    return interaction


@router.delete("/{interaction_id}", status_code=204)
async def delete_interaction(interaction_id: int, db: AsyncSession = Depends(get_db)):
    """Delete an interaction by ID."""
    stmt = select(Interaction).where(Interaction.id == interaction_id)
    result = await db.execute(stmt)
    interaction = result.scalar_one_or_none()
    if not interaction:
        raise HTTPException(status_code=404, detail=f"Interaction {interaction_id} not found")
    await db.delete(interaction)

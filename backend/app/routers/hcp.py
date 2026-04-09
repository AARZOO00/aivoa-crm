from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from typing import List
from app.database import get_db
from app.models.hcp import HCP
from app.schemas.hcp import HCPCreate, HCPRead, HCPUpdate

router = APIRouter(prefix="/api/hcp", tags=["HCP"])


@router.get("/", response_model=List[HCPRead])
async def list_hcps(
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """List all HCPs with pagination."""
    try:
        stmt = select(HCP).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching HCPs: {str(e)}")


@router.get("/search", response_model=List[HCPRead])
async def search_hcps(
    q: str = Query(..., min_length=1, description="Search query for name, specialty, or hospital"),
    db: AsyncSession = Depends(get_db),
):
    """Search HCPs by name, specialty, or hospital."""
    try:
        stmt = select(HCP).where(
            or_(
                HCP.name.ilike(f"%{q}%"),
                HCP.specialty.ilike(f"%{q}%"),
                HCP.hospital.ilike(f"%{q}%"),
            )
        ).limit(20)
        result = await db.execute(stmt)
        return result.scalars().all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching HCPs: {str(e)}")


@router.get("/{hcp_id}", response_model=HCPRead)
async def get_hcp(hcp_id: int, db: AsyncSession = Depends(get_db)):
    """Get a single HCP by ID."""
    stmt = select(HCP).where(HCP.id == hcp_id)
    result = await db.execute(stmt)
    hcp = result.scalar_one_or_none()
    if not hcp:
        raise HTTPException(status_code=404, detail=f"HCP with ID {hcp_id} not found")
    return hcp


@router.post("/", response_model=HCPRead, status_code=201)
async def create_hcp(payload: HCPCreate, db: AsyncSession = Depends(get_db)):
    """Create a new HCP."""
    try:
        hcp = HCP(**payload.model_dump())
        db.add(hcp)
        await db.flush()
        await db.refresh(hcp)
        return hcp
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating HCP: {str(e)}")


@router.put("/{hcp_id}", response_model=HCPRead)
async def update_hcp(hcp_id: int, payload: HCPUpdate, db: AsyncSession = Depends(get_db)):
    """Update an existing HCP."""
    stmt = select(HCP).where(HCP.id == hcp_id)
    result = await db.execute(stmt)
    hcp = result.scalar_one_or_none()
    if not hcp:
        raise HTTPException(status_code=404, detail=f"HCP with ID {hcp_id} not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(hcp, field, value)

    await db.flush()
    await db.refresh(hcp)
    return hcp


@router.delete("/{hcp_id}", status_code=204)
async def delete_hcp(hcp_id: int, db: AsyncSession = Depends(get_db)):
    """Delete an HCP by ID."""
    stmt = select(HCP).where(HCP.id == hcp_id)
    result = await db.execute(stmt)
    hcp = result.scalar_one_or_none()
    if not hcp:
        raise HTTPException(status_code=404, detail=f"HCP with ID {hcp_id} not found")
    await db.delete(hcp)

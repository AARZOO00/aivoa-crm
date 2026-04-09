from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime
from app.models.interaction import InteractionType, SentimentType


class InteractionBase(BaseModel):
    hcp_id: Optional[int] = None
    interaction_type: Optional[InteractionType] = InteractionType.Meeting
    date: Optional[str] = None
    time: Optional[str] = None
    attendees: Optional[List[str]] = []
    topics_discussed: Optional[str] = None
    materials_shared: Optional[List[Any]] = []
    samples_distributed: Optional[List[Any]] = []
    sentiment: Optional[SentimentType] = SentimentType.Neutral
    outcomes: Optional[str] = None
    follow_up_actions: Optional[str] = None
    ai_summary: Optional[str] = None


class InteractionCreate(InteractionBase):
    pass


class InteractionUpdate(BaseModel):
    hcp_id: Optional[int] = None
    interaction_type: Optional[InteractionType] = None
    date: Optional[str] = None
    time: Optional[str] = None
    attendees: Optional[List[str]] = None
    topics_discussed: Optional[str] = None
    materials_shared: Optional[List[Any]] = None
    samples_distributed: Optional[List[Any]] = None
    sentiment: Optional[SentimentType] = None
    outcomes: Optional[str] = None
    follow_up_actions: Optional[str] = None
    ai_summary: Optional[str] = None


class InteractionRead(InteractionBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

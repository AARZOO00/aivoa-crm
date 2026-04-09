from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON, Enum as SAEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class InteractionType(str, enum.Enum):
    Meeting = "Meeting"
    Call = "Call"
    Email = "Email"
    Conference = "Conference"
    CME = "CME"


class SentimentType(str, enum.Enum):
    Positive = "Positive"
    Neutral = "Neutral"
    Negative = "Negative"


class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_id = Column(Integer, ForeignKey("hcps.id"), nullable=True, index=True)
    interaction_type = Column(
        SAEnum(InteractionType, name="interaction_type_enum"),
        nullable=False,
        default=InteractionType.Meeting,
    )
    date = Column(String(20), nullable=True)
    time = Column(String(10), nullable=True)
    attendees = Column(JSON, nullable=True, default=list)
    topics_discussed = Column(Text, nullable=True)
    materials_shared = Column(JSON, nullable=True, default=list)
    samples_distributed = Column(JSON, nullable=True, default=list)
    sentiment = Column(
        SAEnum(SentimentType, name="sentiment_type_enum"),
        nullable=True,
        default=SentimentType.Neutral,
    )
    outcomes = Column(Text, nullable=True)
    follow_up_actions = Column(Text, nullable=True)
    ai_summary = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    hcp = relationship("HCP", back_populates="interactions")

    def __repr__(self):
        return f"<Interaction(id={self.id}, hcp_id={self.hcp_id}, type={self.interaction_type})>"

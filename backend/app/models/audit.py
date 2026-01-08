"""Audit event model for custody trail."""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func

from app.core.database import Base


class AuditEvent(Base):
    """Immutable audit event for custody actions."""
    
    __tablename__ = "audit_events"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    actor_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)  # CHECK_OUT, CHECK_IN, TRANSFER, INVENTORY_CLOSE
    decision = Column(String, nullable=False)  # ALLOW, DENY, STEP_UP
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=True)
    target_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # For transfers
    approval_id = Column(Integer, ForeignKey("approval_requests.id"), nullable=True)
    verification_summary = Column(Text, nullable=True)  # JSON string with verification results
    prev_hash = Column(String(64), nullable=True)  # SHA256 of previous event
    hash = Column(String(64), nullable=False)  # SHA256 of this event

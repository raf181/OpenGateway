"""Approval request model for step-up actions."""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
import enum

from app.core.database import Base


class ApprovalStatus(str, enum.Enum):
    """Approval request status."""
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class ApprovalRequest(Base):
    """Approval request for step-up policy decisions."""
    
    __tablename__ = "approval_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Request details
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)  # The action that triggered step-up
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=True)
    target_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # For transfers
    
    # Verification context
    verification_summary = Column(Text, nullable=True)  # JSON with why step-up was needed
    reason = Column(String, nullable=True)  # Human-readable reason
    
    # Resolution
    status = Column(String, nullable=False, default=ApprovalStatus.PENDING.value)
    resolved_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    resolution_note = Column(String, nullable=True)

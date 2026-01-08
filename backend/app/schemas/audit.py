"""Audit schemas."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AuditEventResponse(BaseModel):
    """Schema for audit event response."""
    id: int
    timestamp: datetime
    asset_id: int
    asset_name: Optional[str] = None
    asset_tag_id: Optional[str] = None
    actor_user_id: int
    actor_name: Optional[str] = None
    action: str
    decision: str
    site_id: Optional[int] = None
    site_name: Optional[str] = None
    target_user_id: Optional[int] = None
    target_user_name: Optional[str] = None
    approval_id: Optional[int] = None
    verification_summary: Optional[str] = None
    hash: str

    class Config:
        from_attributes = True


class ChainVerificationResult(BaseModel):
    """Result of chain verification."""
    valid: bool
    total_events: int
    verified_events: int
    first_broken_id: Optional[int] = None
    message: str

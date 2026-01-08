"""Approval schemas."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ApprovalRequestResponse(BaseModel):
    """Schema for approval request response."""
    id: int
    created_at: datetime
    asset_id: int
    asset_name: Optional[str] = None
    asset_tag_id: Optional[str] = None
    requester_id: int
    requester_name: Optional[str] = None
    action: str
    site_id: Optional[int] = None
    site_name: Optional[str] = None
    target_user_id: Optional[int] = None
    target_user_name: Optional[str] = None
    verification_summary: Optional[str] = None
    reason: Optional[str] = None
    status: str
    resolved_by_id: Optional[int] = None
    resolved_at: Optional[datetime] = None
    resolution_note: Optional[str] = None

    class Config:
        from_attributes = True


class ApprovalAction(BaseModel):
    """Schema for approve/reject action."""
    note: Optional[str] = None

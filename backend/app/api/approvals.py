"""Approval management API endpoints."""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_role
from app.models.user import User
from app.models.approval import ApprovalRequest, ApprovalStatus
from app.models.asset import Asset
from app.models.site import Site
from app.schemas.approval import ApprovalAction
from app.schemas.custody import CustodyActionResponse
from app.services.custody_service import CustodyService

router = APIRouter(prefix="/approvals", tags=["Approvals"])


@router.get("")
async def list_approvals(
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN", "MANAGER"]))
):
    """List approval requests (Manager/Admin only)."""
    query = db.query(ApprovalRequest)
    
    if status_filter:
        query = query.filter(ApprovalRequest.status == status_filter)
    
    approvals = query.order_by(ApprovalRequest.created_at.desc()).all()
    result = []
    
    for approval in approvals:
        asset = db.query(Asset).filter(Asset.id == approval.asset_id).first()
        requester = db.query(User).filter(User.id == approval.requester_id).first()
        site = db.query(Site).filter(Site.id == approval.site_id).first() if approval.site_id else None
        target_user = db.query(User).filter(User.id == approval.target_user_id).first() if approval.target_user_id else None
        
        result.append({
            "id": approval.id,
            "created_at": approval.created_at.isoformat(),
            "requested_action": approval.action,
            "justification": approval.reason,
            "status": approval.status,
            "resolved_at": approval.resolved_at.isoformat() if approval.resolved_at else None,
            "asset": {
                "id": asset.id,
                "name": asset.name,
                "tag_id": asset.tag_id,
                "sensitivity_level": asset.sensitivity_level
            } if asset else None,
            "requester": {
                "id": requester.id,
                "full_name": requester.full_name
            } if requester else None,
            "site": {
                "id": site.id,
                "name": site.name
            } if site else None,
            "target_user": {
                "id": target_user.id,
                "full_name": target_user.full_name
            } if target_user else None
        })
    
    return result


@router.get("/{approval_id}")
async def get_approval(
    approval_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN", "MANAGER"]))
):
    """Get approval request by ID."""
    approval = db.query(ApprovalRequest).filter(ApprovalRequest.id == approval_id).first()
    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval request not found"
        )
    
    asset = db.query(Asset).filter(Asset.id == approval.asset_id).first()
    requester = db.query(User).filter(User.id == approval.requester_id).first()
    site = db.query(Site).filter(Site.id == approval.site_id).first() if approval.site_id else None
    target_user = db.query(User).filter(User.id == approval.target_user_id).first() if approval.target_user_id else None
    
    return {
        "id": approval.id,
        "created_at": approval.created_at.isoformat(),
        "requested_action": approval.action,
        "justification": approval.reason,
        "status": approval.status,
        "resolved_at": approval.resolved_at.isoformat() if approval.resolved_at else None,
        "verification_summary": approval.verification_summary,
        "asset": {
            "id": asset.id,
            "name": asset.name,
            "tag_id": asset.tag_id,
            "sensitivity_level": asset.sensitivity_level
        } if asset else None,
        "requester": {
            "id": requester.id,
            "full_name": requester.full_name
        } if requester else None,
        "site": {
            "id": site.id,
            "name": site.name
        } if site else None,
        "target_user": {
            "id": target_user.id,
            "full_name": target_user.full_name
        } if target_user else None
    }


from pydantic import BaseModel
from typing import Optional

class ProcessApprovalRequest(BaseModel):
    action: str  # 'APPROVED' or 'REJECTED'
    note: Optional[str] = None


@router.post("/{approval_id}", response_model=CustodyActionResponse)
async def process_approval(
    approval_id: int,
    request: ProcessApprovalRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN", "MANAGER"]))
):
    """Process (approve or reject) an approval request."""
    try:
        service = CustodyService(db)
        approved = request.action == 'APPROVED'
        return service.process_approval(
            approval_id=approval_id,
            manager=current_user,
            approved=approved,
            note=request.note
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/{approval_id}/approve", response_model=CustodyActionResponse)
async def approve_request(
    approval_id: int,
    action: ApprovalAction = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN", "MANAGER"]))
):
    """Approve an approval request."""
    try:
        service = CustodyService(db)
        note = action.note if action else None
        return service.process_approval(
            approval_id=approval_id,
            manager=current_user,
            approved=True,
            note=note
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/{approval_id}/reject", response_model=CustodyActionResponse)
async def reject_request(
    approval_id: int,
    action: ApprovalAction = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN", "MANAGER"]))
):
    """Reject an approval request."""
    try:
        service = CustodyService(db)
        note = action.note if action else None
        return service.process_approval(
            approval_id=approval_id,
            manager=current_user,
            approved=False,
            note=note
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

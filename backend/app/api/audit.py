"""Audit trail API endpoints."""
from typing import List, Optional
import json
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.asset import Asset
from app.models.site import Site
from app.models.audit import AuditEvent
from app.schemas.audit import ChainVerificationResult
from app.services.audit_service import AuditService

router = APIRouter(prefix="/audit", tags=["Audit"])


@router.get("/events")
async def list_audit_events(
    asset_id: Optional[int] = Query(None, description="Filter by asset ID"),
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    event_type: Optional[str] = Query(None, description="Filter by event type"),
    decision: Optional[str] = Query(None, description="Filter by decision"),
    limit: int = Query(100, description="Maximum number of events to return"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List audit events with optional filters."""
    query = db.query(AuditEvent)
    
    if asset_id:
        query = query.filter(AuditEvent.asset_id == asset_id)
    if user_id:
        query = query.filter(AuditEvent.actor_user_id == user_id)
    if event_type:
        query = query.filter(AuditEvent.action == event_type)
    if decision:
        query = query.filter(AuditEvent.decision == decision)
    
    events = query.order_by(AuditEvent.timestamp.desc()).limit(limit).all()
    
    result = []
    for event in events:
        asset = db.query(Asset).filter(Asset.id == event.asset_id).first()
        actor = db.query(User).filter(User.id == event.actor_user_id).first()
        site = db.query(Site).filter(Site.id == event.site_id).first() if event.site_id else None
        target = db.query(User).filter(User.id == event.target_user_id).first() if event.target_user_id else None
        
        # Parse verification summary
        verification_results = {}
        if event.verification_summary:
            try:
                verification_results = json.loads(event.verification_summary)
            except:
                pass
        
        result.append({
            "id": event.id,
            "timestamp": event.timestamp.isoformat(),
            "event_type": event.action,
            "decision": event.decision,
            "asset": {
                "id": asset.id if asset else None,
                "name": asset.name if asset else "Unknown",
                "tag_id": asset.tag_id if asset else None
            } if asset else None,
            "actor": {
                "id": actor.id if actor else None,
                "full_name": actor.full_name if actor else "System"
            } if actor else None,
            "target_user": {
                "id": target.id,
                "full_name": target.full_name
            } if target else None,
            "site": {
                "id": site.id,
                "name": site.name
            } if site else None,
            "verification_results": verification_results,
            "event_hash": event.hash,
            "prev_hash": event.prev_hash
        })
    
    return result


@router.get("/verify-chain", response_model=ChainVerificationResult)
async def verify_audit_chain(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Verify the integrity of the audit chain."""
    service = AuditService(db)
    result = service.verify_chain()
    
    return ChainVerificationResult(**result)

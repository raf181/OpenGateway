"""Audit service for tamper-evident event logging.

This module handles the creation and verification of audit events
with a hash chain for tamper detection.
"""
import hashlib
import json
from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session

from app.models.audit import AuditEvent
from app.models.asset import Asset
from app.models.user import User
from app.models.site import Site


def compute_event_hash(
    prev_hash: Optional[str],
    timestamp: datetime,
    asset_id: int,
    actor_user_id: int,
    action: str,
    decision: str,
    site_id: Optional[int],
    target_user_id: Optional[int],
    approval_id: Optional[int],
    verification_summary: Optional[str]
) -> str:
    """
    Compute SHA256 hash for an audit event.
    
    The hash is computed from a canonical JSON representation of the event
    fields concatenated with the previous event's hash.
    """
    # Create canonical representation
    canonical_data = {
        "prev_hash": prev_hash or "",
        "timestamp": timestamp.isoformat(),
        "asset_id": asset_id,
        "actor_user_id": actor_user_id,
        "action": action,
        "decision": decision,
        "site_id": site_id,
        "target_user_id": target_user_id,
        "approval_id": approval_id,
        "verification_summary": verification_summary or ""
    }
    
    # Sort keys for consistent ordering
    canonical_json = json.dumps(canonical_data, sort_keys=True, separators=(',', ':'))
    
    # Compute SHA256
    return hashlib.sha256(canonical_json.encode('utf-8')).hexdigest()


class AuditService:
    """Service for managing audit events with hash chain integrity."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_last_event(self) -> Optional[AuditEvent]:
        """Get the most recent audit event."""
        return self.db.query(AuditEvent).order_by(AuditEvent.id.desc()).first()
    
    def create_event(
        self,
        asset_id: int,
        actor_user_id: int,
        action: str,
        decision: str,
        site_id: Optional[int] = None,
        target_user_id: Optional[int] = None,
        approval_id: Optional[int] = None,
        verification_summary: Optional[dict] = None
    ) -> AuditEvent:
        """
        Create a new audit event with hash chain linkage.
        
        The event is appended to the chain with a hash that includes
        the previous event's hash for tamper detection.
        """
        # Get previous hash
        last_event = self.get_last_event()
        prev_hash = last_event.hash if last_event else None
        
        # Current timestamp
        timestamp = datetime.utcnow()
        
        # Serialize verification summary
        verification_json = json.dumps(verification_summary) if verification_summary else None
        
        # Compute hash
        event_hash = compute_event_hash(
            prev_hash=prev_hash,
            timestamp=timestamp,
            asset_id=asset_id,
            actor_user_id=actor_user_id,
            action=action,
            decision=decision,
            site_id=site_id,
            target_user_id=target_user_id,
            approval_id=approval_id,
            verification_summary=verification_json
        )
        
        # Create event
        event = AuditEvent(
            timestamp=timestamp,
            asset_id=asset_id,
            actor_user_id=actor_user_id,
            action=action,
            decision=decision,
            site_id=site_id,
            target_user_id=target_user_id,
            approval_id=approval_id,
            verification_summary=verification_json,
            prev_hash=prev_hash,
            hash=event_hash
        )
        
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        
        return event
    
    def get_events(
        self,
        asset_id: Optional[int] = None,
        user_id: Optional[int] = None,
        limit: int = 100
    ) -> List[AuditEvent]:
        """Get audit events with optional filters."""
        query = self.db.query(AuditEvent)
        
        if asset_id:
            query = query.filter(AuditEvent.asset_id == asset_id)
        if user_id:
            query = query.filter(AuditEvent.actor_user_id == user_id)
        
        return query.order_by(AuditEvent.timestamp.desc()).limit(limit).all()
    
    def get_events_with_details(
        self,
        asset_id: Optional[int] = None,
        user_id: Optional[int] = None,
        limit: int = 100
    ) -> List[dict]:
        """Get audit events with related entity names."""
        events = self.get_events(asset_id, user_id, limit)
        result = []
        
        for event in events:
            # Get related entities
            asset = self.db.query(Asset).filter(Asset.id == event.asset_id).first()
            actor = self.db.query(User).filter(User.id == event.actor_user_id).first()
            site = self.db.query(Site).filter(Site.id == event.site_id).first() if event.site_id else None
            target_user = self.db.query(User).filter(User.id == event.target_user_id).first() if event.target_user_id else None
            
            result.append({
                "id": event.id,
                "timestamp": event.timestamp,
                "asset_id": event.asset_id,
                "asset_name": asset.name if asset else None,
                "asset_tag_id": asset.tag_id if asset else None,
                "actor_user_id": event.actor_user_id,
                "actor_name": actor.name if actor else None,
                "action": event.action,
                "decision": event.decision,
                "site_id": event.site_id,
                "site_name": site.name if site else None,
                "target_user_id": event.target_user_id,
                "target_user_name": target_user.name if target_user else None,
                "approval_id": event.approval_id,
                "verification_summary": event.verification_summary,
                "hash": event.hash
            })
        
        return result
    
    def verify_chain(self) -> dict:
        """
        Verify the integrity of the entire audit chain.
        
        Returns a result indicating whether the chain is valid and,
        if not, the ID of the first broken link.
        """
        events = self.db.query(AuditEvent).order_by(AuditEvent.id.asc()).all()
        
        if not events:
            return {
                "valid": True,
                "total_events": 0,
                "verified_events": 0,
                "first_broken_id": None,
                "message": "No events in audit trail."
            }
        
        prev_hash = None
        
        for i, event in enumerate(events):
            # Verify prev_hash matches
            if event.prev_hash != prev_hash:
                return {
                    "valid": False,
                    "total_events": len(events),
                    "verified_events": i,
                    "first_broken_id": event.id,
                    "message": f"Chain broken at event {event.id}: prev_hash mismatch."
                }
            
            # Recompute hash and verify
            expected_hash = compute_event_hash(
                prev_hash=event.prev_hash,
                timestamp=event.timestamp,
                asset_id=event.asset_id,
                actor_user_id=event.actor_user_id,
                action=event.action,
                decision=event.decision,
                site_id=event.site_id,
                target_user_id=event.target_user_id,
                approval_id=event.approval_id,
                verification_summary=event.verification_summary
            )
            
            if event.hash != expected_hash:
                return {
                    "valid": False,
                    "total_events": len(events),
                    "verified_events": i,
                    "first_broken_id": event.id,
                    "message": f"Chain broken at event {event.id}: hash mismatch (data may have been tampered)."
                }
            
            prev_hash = event.hash
        
        return {
            "valid": True,
            "total_events": len(events),
            "verified_events": len(events),
            "first_broken_id": None,
            "message": "Audit chain integrity verified. All events are valid."
        }

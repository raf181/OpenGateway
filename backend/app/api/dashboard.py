"""Dashboard/stats API endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.core.security import require_role, get_current_user
from app.models.user import User
from app.models.asset import Asset, AssetStatus
from app.models.site import Site
from app.models.approval import ApprovalRequest, ApprovalStatus
from app.models.audit import AuditEvent

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("")
async def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get basic dashboard data for any authenticated user."""
    # Asset counts
    total_assets = db.query(func.count(Asset.id)).scalar()
    available_assets = db.query(func.count(Asset.id)).filter(
        Asset.status == AssetStatus.AVAILABLE.value
    ).scalar()
    checked_out_assets = db.query(func.count(Asset.id)).filter(
        Asset.status == AssetStatus.CHECKED_OUT.value
    ).scalar()
    
    return {
        "total_assets": total_assets,
        "available_assets": available_assets,
        "checked_out_assets": checked_out_assets
    }


@router.get("/stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN", "MANAGER"]))
):
    """Get dashboard statistics."""
    # Asset counts
    total_assets = db.query(func.count(Asset.id)).scalar()
    available_assets = db.query(func.count(Asset.id)).filter(
        Asset.status == AssetStatus.AVAILABLE.value
    ).scalar()
    checked_out_assets = db.query(func.count(Asset.id)).filter(
        Asset.status == AssetStatus.CHECKED_OUT.value
    ).scalar()
    
    # User counts
    total_users = db.query(func.count(User.id)).scalar()
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar()
    
    # Site count
    total_sites = db.query(func.count(Site.id)).filter(Site.is_active == True).scalar()
    
    # Pending approvals
    pending_approvals = db.query(func.count(ApprovalRequest.id)).filter(
        ApprovalRequest.status == ApprovalStatus.PENDING.value
    ).scalar()
    
    # Recent events count (last 24 hours)
    from datetime import datetime, timedelta
    yesterday = datetime.utcnow() - timedelta(hours=24)
    recent_events = db.query(func.count(AuditEvent.id)).filter(
        AuditEvent.timestamp >= yesterday
    ).scalar()
    
    # Asset sensitivity breakdown
    high_sensitivity = db.query(func.count(Asset.id)).filter(Asset.sensitivity_level == "HIGH").scalar()
    medium_sensitivity = db.query(func.count(Asset.id)).filter(Asset.sensitivity_level == "MEDIUM").scalar()
    low_sensitivity = db.query(func.count(Asset.id)).filter(Asset.sensitivity_level == "LOW").scalar()
    
    return {
        "assets": {
            "total": total_assets,
            "available": available_assets,
            "checked_out": checked_out_assets,
            "by_sensitivity": {
                "high": high_sensitivity,
                "medium": medium_sensitivity,
                "low": low_sensitivity
            }
        },
        "users": {
            "total": total_users,
            "active": active_users
        },
        "sites": {
            "total": total_sites
        },
        "approvals": {
            "pending": pending_approvals
        },
        "events": {
            "last_24h": recent_events
        }
    }

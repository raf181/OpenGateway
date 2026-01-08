"""Asset management API endpoints."""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_role, get_current_user
from app.models.asset import Asset
from app.models.site import Site
from app.models.user import User
from app.models.audit import AuditEvent
from app.schemas.asset import AssetCreate, AssetUpdate

router = APIRouter(prefix="/assets", tags=["Assets"])


def asset_to_dict(asset: Asset, site: Site = None, custodian: User = None) -> dict:
    """Convert asset to dictionary."""
    return {
        "id": asset.id,
        "tag_id": asset.tag_id,
        "name": asset.name,
        "description": asset.description,
        "sensitivity_level": asset.sensitivity_level,
        "status": asset.status,
        "site_id": asset.site_id,
        "current_custodian_id": asset.current_custodian_id,
        "site": {"id": site.id, "name": site.name} if site else None,
        "current_custodian": {"id": custodian.id, "full_name": custodian.full_name} if custodian else None,
        "created_at": asset.created_at.isoformat() if asset.created_at else None
    }


@router.get("")
async def list_assets(
    site_id: Optional[int] = Query(None, description="Filter by site ID"),
    q: Optional[str] = Query(None, description="Search query"),
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    sensitivity: Optional[str] = Query(None, description="Filter by sensitivity"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all assets with optional filters."""
    query = db.query(Asset)
    
    if site_id:
        query = query.filter(Asset.site_id == site_id)
    
    if status_filter:
        query = query.filter(Asset.status == status_filter)
    
    if sensitivity:
        query = query.filter(Asset.sensitivity_level == sensitivity)
    
    if q:
        search = f"%{q}%"
        query = query.filter(
            (Asset.name.ilike(search)) |
            (Asset.tag_id.ilike(search)) |
            (Asset.description.ilike(search))
        )
    
    assets = query.all()
    result = []
    
    for asset in assets:
        site = db.query(Site).filter(Site.id == asset.site_id).first() if asset.site_id else None
        custodian = db.query(User).filter(User.id == asset.current_custodian_id).first() if asset.current_custodian_id else None
        result.append(asset_to_dict(asset, site, custodian))
    
    return result


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_asset(
    asset_data: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"]))
):
    """Create a new asset (Admin only)."""
    # Check if tag_id already exists
    existing = db.query(Asset).filter(Asset.tag_id == asset_data.tag_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tag ID already exists"
        )
    
    # Validate sensitivity
    if asset_data.sensitivity_level not in ["LOW", "MEDIUM", "HIGH"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid sensitivity. Must be LOW, MEDIUM, or HIGH"
        )
    
    asset = Asset(
        tag_id=asset_data.tag_id,
        name=asset_data.name,
        description=asset_data.description,
        sensitivity_level=asset_data.sensitivity_level,
        site_id=asset_data.site_id
    )
    
    db.add(asset)
    db.commit()
    db.refresh(asset)
    
    return asset_to_dict(asset)


@router.get("/{asset_id}")
async def get_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get asset by ID."""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
    
    site = db.query(Site).filter(Site.id == asset.site_id).first() if asset.site_id else None
    custodian = db.query(User).filter(User.id == asset.current_custodian_id).first() if asset.current_custodian_id else None
    
    return asset_to_dict(asset, site, custodian)


@router.get("/{asset_id}/history")
async def get_asset_history(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get asset custody history from audit events."""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
    
    events = db.query(AuditEvent).filter(AuditEvent.asset_id == asset_id).order_by(AuditEvent.timestamp.desc()).limit(50).all()
    
    result = []
    for event in events:
        actor = db.query(User).filter(User.id == event.actor_user_id).first()
        target = db.query(User).filter(User.id == event.target_user_id).first() if event.target_user_id else None
        site = db.query(Site).filter(Site.id == event.site_id).first() if event.site_id else None
        
        result.append({
            "id": event.id,
            "event_type": event.action,
            "decision": event.decision,
            "timestamp": event.timestamp.isoformat(),
            "actor": {"id": actor.id, "full_name": actor.full_name} if actor else None,
            "target_user": {"id": target.id, "full_name": target.full_name} if target else None,
            "site": {"id": site.id, "name": site.name} if site else None
        })
    
    return result


@router.get("/tag/{tag_id}")
async def get_asset_by_tag(
    tag_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get asset by tag ID (for scanning)."""
    asset = db.query(Asset).filter(Asset.tag_id == tag_id).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
    
    site = db.query(Site).filter(Site.id == asset.site_id).first() if asset.site_id else None
    custodian = db.query(User).filter(User.id == asset.current_custodian_id).first() if asset.current_custodian_id else None
    
    return asset_to_dict(asset, site, custodian)


@router.put("/{asset_id}")
async def update_asset(
    asset_id: int,
    asset_data: AssetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"]))
):
    """Update an asset (Admin only)."""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
    
    update_data = asset_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(asset, key, value)
    
    db.commit()
    db.refresh(asset)
    
    return asset_to_dict(asset)


@router.delete("/{asset_id}")
async def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"]))
):
    """Delete an asset (Admin only)."""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
    
    db.delete(asset)
    db.commit()
    
    return {"message": "Asset deleted"}

"""Site management API endpoints."""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_role, get_current_user
from app.models.site import Site
from app.models.user import User
from app.models.asset import Asset

router = APIRouter(prefix="/sites", tags=["Sites"])


def site_to_dict(site: Site) -> dict:
    """Convert site to dictionary."""
    return {
        "id": site.id,
        "name": site.name,
        "address": site.address,
        "latitude": site.latitude,
        "longitude": site.longitude,
        "geofence_radius_m": site.geofence_radius_m,
        "requires_onsite": site.requires_onsite,
        "is_active": site.is_active,
        "created_at": site.created_at.isoformat() if site.created_at else None
    }


@router.get("")
async def list_sites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all sites."""
    sites = db.query(Site).filter(Site.is_active == True).all()
    result = []
    for site in sites:
        site_dict = site_to_dict(site)
        # Count assets at this site
        site_dict["asset_count"] = db.query(Asset).filter(Asset.site_id == site.id).count()
        # Count users with this as home site
        site_dict["user_count"] = db.query(User).filter(User.home_site_id == site.id).count()
        result.append(site_dict)
    return result


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_site(
    site_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"]))
):
    """Create a new site (Admin only)."""
    site = Site(
        name=site_data.get("name"),
        address=site_data.get("address"),
        latitude=site_data.get("latitude"),
        longitude=site_data.get("longitude"),
        geofence_radius_m=site_data.get("geofence_radius_m", 100),
        requires_onsite=site_data.get("requires_onsite", True)
    )
    
    db.add(site)
    db.commit()
    db.refresh(site)
    
    return site_to_dict(site)


@router.get("/{site_id}")
async def get_site(
    site_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get site by ID."""
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found"
        )
    
    site_dict = site_to_dict(site)
    site_dict["asset_count"] = db.query(Asset).filter(Asset.site_id == site.id).count()
    site_dict["user_count"] = db.query(User).filter(User.home_site_id == site.id).count()
    return site_dict


@router.put("/{site_id}")
async def update_site(
    site_id: int,
    site_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"]))
):
    """Update a site (Admin only)."""
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found"
        )
    
    for key in ["name", "address", "latitude", "longitude", "geofence_radius_m", "requires_onsite"]:
        if key in site_data:
            setattr(site, key, site_data[key])
    
    db.commit()
    db.refresh(site)
    
    return site_to_dict(site)


@router.delete("/{site_id}")
async def delete_site(
    site_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"]))
):
    """Delete a site (Admin only)."""
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found"
        )
    
    # Soft delete
    site.is_active = False
    db.commit()
    
    return {"message": "Site deleted"}

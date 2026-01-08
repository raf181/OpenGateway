"""Site schemas for request/response validation."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SiteBase(BaseModel):
    """Base site schema."""
    name: str
    address: Optional[str] = None
    latitude: float
    longitude: float
    geofence_radius_m: float = 100.0
    requires_onsite: bool = True


class SiteCreate(SiteBase):
    """Schema for creating a site."""
    pass


class SiteUpdate(BaseModel):
    """Schema for updating a site."""
    name: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    geofence_radius_m: Optional[float] = None
    requires_onsite: Optional[bool] = None
    is_active: Optional[bool] = None


class SiteResponse(SiteBase):
    """Schema for site response."""
    id: int
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

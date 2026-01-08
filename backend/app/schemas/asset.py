"""Asset schemas for request/response validation."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AssetBase(BaseModel):
    """Base asset schema."""
    tag_id: str
    name: str
    description: Optional[str] = None
    sensitivity_level: str = "LOW"
    site_id: Optional[int] = None


class AssetCreate(AssetBase):
    """Schema for creating an asset."""
    pass


class AssetUpdate(BaseModel):
    """Schema for updating an asset."""
    tag_id: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    sensitivity_level: Optional[str] = None
    status: Optional[str] = None
    site_id: Optional[int] = None

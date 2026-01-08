"""Site model for geofences."""
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Site(Base):
    """Site model representing a geofenced location."""
    
    __tablename__ = "sites"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    geofence_radius_m = Column(Float, nullable=False, default=100.0)
    is_active = Column(Boolean, default=True)
    requires_onsite = Column(Boolean, default=True)  # Whether actions require being on-site
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    users = relationship("User", back_populates="home_site", foreign_keys="User.home_site_id")
    assets = relationship("Asset", back_populates="site", foreign_keys="Asset.site_id")

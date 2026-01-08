"""Asset model."""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base


class AssetSensitivity(str, enum.Enum):
    """Asset sensitivity levels."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class AssetStatus(str, enum.Enum):
    """Asset status values."""
    AVAILABLE = "AVAILABLE"
    CHECKED_OUT = "CHECKED_OUT"
    MAINTENANCE = "MAINTENANCE"
    RETIRED = "RETIRED"


class Asset(Base):
    """Asset model for inventory items."""
    
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    tag_id = Column(String, unique=True, index=True, nullable=False)  # QR/NFC tag ID
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    sensitivity_level = Column(String, nullable=False, default=AssetSensitivity.LOW.value)
    status = Column(String, nullable=False, default=AssetStatus.AVAILABLE.value)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=True)
    current_custodian_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    site = relationship("Site", back_populates="assets", foreign_keys=[site_id])
    current_custodian = relationship("User", foreign_keys=[current_custodian_id])

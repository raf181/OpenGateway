"""Custody action schemas."""
from pydantic import BaseModel
from typing import Optional


class MockNetworkContext(BaseModel):
    """Mock network context from frontend panel."""
    claimed_phone: Optional[str] = None
    network_phone: Optional[str] = None
    network_lat: Optional[float] = None
    network_lon: Optional[float] = None
    sim_swap_recent: bool = False
    device_swap_recent: bool = False


class CustodyActionRequest(BaseModel):
    """Base schema for custody actions."""
    asset_id: int
    site_id: int
    mock_context: Optional[MockNetworkContext] = None


class CheckoutRequest(CustodyActionRequest):
    """Schema for checkout request."""
    pass


class ReturnRequest(CustodyActionRequest):
    """Schema for return request."""
    pass


class TransferRequest(CustodyActionRequest):
    """Schema for transfer request."""
    target_user_id: int


class InventoryCloseRequest(BaseModel):
    """Schema for inventory close request."""
    asset_id: int
    site_id: int
    mock_context: Optional[MockNetworkContext] = None


class VerificationResult(BaseModel):
    """Result of verification checks."""
    number_verified: bool
    geofence_verified: bool
    inside_geofence: bool
    sim_swap_detected: bool
    device_swap_detected: bool
    details: dict


class PolicyDecision(BaseModel):
    """Policy engine decision."""
    decision: str  # ALLOW, DENY, STEP_UP
    reason: str
    verification: VerificationResult


class CustodyActionResponse(BaseModel):
    """Response for custody actions."""
    success: bool
    decision: str
    reason: str
    verification: VerificationResult
    event_id: Optional[int] = None
    approval_id: Optional[int] = None
    message: str

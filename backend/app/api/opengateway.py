"""Telefónica Open Gateway API endpoints.

This module exposes the Telefonica Open Gateway APIs:
- Number Verification
- Device Location Verification  
- SIM Swap Check/Retrieve
- Device Swap Check/Retrieve
- Roaming Status
- Quality on Demand (QoD) Sessions
"""
import asyncio
import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User
from app.services.telefonica_gateway import (
    TelefonicaGateway, 
    GatewayMode, 
    TelefonicaGatewayError,
    NumberVerificationResult,
    LocationVerificationResult,
    SimSwapResult,
    DeviceSwapResult,
    RoamingStatusResult,
    QoSProfile,
    QoDSessionResult,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/opengateway", tags=["Open Gateway"])


# ==================== Request/Response Models ====================

class GatewayStatusResponse(BaseModel):
    """Gateway status response."""
    mode: str
    base_url: Optional[str]
    has_credentials: bool
    available_apis: List[str]


class NumberVerifyRequest(BaseModel):
    """Number verification request."""
    phone_number: str = Field(..., description="Phone number in E.164 format (e.g., +34666666666)")


class NumberVerifyResponse(BaseModel):
    """Number verification response."""
    device_phone_number_verified: bool
    message: Optional[str] = None


class LocationVerifyRequest(BaseModel):
    """Location verification request."""
    phone_number: str = Field(..., description="Phone number in E.164 format")
    latitude: float = Field(..., description="Latitude of the area center")
    longitude: float = Field(..., description="Longitude of the area center")
    radius: float = Field(..., description="Radius in meters")
    max_age: int = Field(60, description="Maximum age of location data in seconds")


class LocationVerifyResponse(BaseModel):
    """Location verification response."""
    verification_result: str  # TRUE, FALSE, PARTIAL, UNDETERMINED
    match_rate: Optional[int] = None
    last_location_time: Optional[str] = None


class SimSwapRequest(BaseModel):
    """SIM swap check request."""
    phone_number: str = Field(..., description="Phone number in E.164 format")
    max_age_hours: int = Field(72, description="Maximum age to check for swap in hours")


class SimSwapResponse(BaseModel):
    """SIM swap response."""
    swapped: bool
    latest_sim_change: Optional[str] = None


class DeviceSwapRequest(BaseModel):
    """Device swap check request."""
    phone_number: str = Field(..., description="Phone number in E.164 format")
    max_age_hours: int = Field(72, description="Maximum age to check for swap in hours")


class DeviceSwapResponse(BaseModel):
    """Device swap response."""
    swapped: bool
    latest_device_change: Optional[str] = None


class RoamingStatusRequest(BaseModel):
    """Roaming status request."""
    phone_number: str = Field(..., description="Phone number in E.164 format")


class RoamingStatusResponse(BaseModel):
    """Roaming status response."""
    roaming: bool
    country_code: Optional[int] = None
    country_name: Optional[str] = None


class QoSProfileResponse(BaseModel):
    """QoS profile response."""
    name: str
    description: Optional[str] = None
    status: Optional[str] = None


class QoDSessionRequest(BaseModel):
    """QoD session creation request."""
    phone_number: str = Field(..., description="Phone number in E.164 format")
    qos_profile: str = Field("QOS_E", description="QoS profile (QOS_E, QOS_S, QOS_M, QOS_L)")
    duration: int = Field(300, description="Session duration in seconds")
    device_ipv4: Optional[str] = Field(None, description="Device IPv4 address")
    device_ipv6: Optional[str] = Field(None, description="Device IPv6 address")
    application_server_ipv4: Optional[str] = Field(None, description="Application server IPv4")
    webhook_url: Optional[str] = Field(None, description="Webhook URL for notifications")


class QoDSessionResponse(BaseModel):
    """QoD session response."""
    session_id: str
    qos_status: str  # REQUESTED, AVAILABLE, UNAVAILABLE
    qos_profile: str
    device_phone_number: Optional[str] = None
    device_ipv4: Optional[str] = None
    started_at: Optional[str] = None
    expires_at: Optional[str] = None
    duration: Optional[int] = None
    message: Optional[str] = None


class QoDExtendRequest(BaseModel):
    """QoD session extend request."""
    additional_duration: int = Field(300, description="Additional duration in seconds")


class FullVerificationRequest(BaseModel):
    """Full verification request."""
    phone_number: str = Field(..., description="Phone number in E.164 format")
    latitude: float = Field(..., description="Site latitude")
    longitude: float = Field(..., description="Site longitude") 
    radius: float = Field(100.0, description="Geofence radius in meters")


class FullVerificationResponse(BaseModel):
    """Full verification response."""
    number_verification: dict
    location_verification: dict
    risk_signals: dict
    gateway_mode: str


# ==================== Helper Functions ====================

def get_gateway() -> TelefonicaGateway:
    """Get a configured gateway instance."""
    mode = GatewayMode(settings.GATEWAY_MODE or "mock")
    return TelefonicaGateway(mode=mode)


def run_async(coro):
    """Run an async coroutine in a sync context."""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()


# ==================== API Endpoints ====================

@router.get("/status", response_model=GatewayStatusResponse)
async def get_gateway_status():
    """Get the current Open Gateway configuration status (public endpoint)."""
    mode = settings.GATEWAY_MODE or "mock"
    gateway = get_gateway()
    
    return GatewayStatusResponse(
        mode=mode,
        base_url=gateway.base_url,
        has_credentials=bool(settings.GATEWAY_CLIENT_ID and settings.GATEWAY_CLIENT_SECRET),
        available_apis=[
            "number_verification",
            "location_verification", 
            "sim_swap",
            "device_swap",
            "roaming_status",
            "qod_mobile"
        ]
    )


@router.post("/number-verification/verify", response_model=NumberVerifyResponse)
async def verify_number(
    request: NumberVerifyRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Verify if the specified phone number matches the network-identified number.
    
    Uses Telefonica Open Gateway Number Verification API.
    """
    gateway = get_gateway()
    
    try:
        if gateway.mode == GatewayMode.MOCK:
            result = gateway._mock_verify_number()
        else:
            result = run_async(gateway.verify_number(phone_number=request.phone_number))
        
        return NumberVerifyResponse(
            device_phone_number_verified=result.device_phone_number_verified,
            message=result.message
        )
    except TelefonicaGatewayError as e:
        logger.error(f"Number verification error: {e.message}")
        raise HTTPException(status_code=502, detail=f"Gateway error: {e.message}")


@router.post("/location/verify", response_model=LocationVerifyResponse)
async def verify_location(
    request: LocationVerifyRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Verify if a device is within the specified location area.
    
    Uses Telefonica Open Gateway Device Location Verification API.
    """
    gateway = get_gateway()
    
    try:
        if gateway.mode == GatewayMode.MOCK:
            result = gateway._mock_verify_location(
                request.latitude, request.longitude, request.radius
            )
        else:
            result = run_async(gateway.verify_location(
                latitude=request.latitude,
                longitude=request.longitude,
                radius=request.radius,
                phone_number=request.phone_number,
                max_age=request.max_age
            ))
        
        return LocationVerifyResponse(
            verification_result=result.verification_result,
            match_rate=result.match_rate,
            last_location_time=str(result.last_location_time) if result.last_location_time else None
        )
    except TelefonicaGatewayError as e:
        logger.error(f"Location verification error: {e.message}")
        raise HTTPException(status_code=502, detail=f"Gateway error: {e.message}")


@router.post("/sim-swap/check", response_model=SimSwapResponse)
async def check_sim_swap(
    request: SimSwapRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Check if a SIM swap has occurred recently.
    
    Uses Telefonica Open Gateway SIM Swap API.
    """
    gateway = get_gateway()
    
    try:
        if gateway.mode == GatewayMode.MOCK:
            result = gateway._mock_check_sim_swap()
        else:
            result = run_async(gateway.check_sim_swap(
                phone_number=request.phone_number,
                max_age_hours=request.max_age_hours
            ))
        
        return SimSwapResponse(
            swapped=result.swapped,
            latest_sim_change=result.latest_sim_change.isoformat() if result.latest_sim_change else None
        )
    except TelefonicaGatewayError as e:
        logger.error(f"SIM swap check error: {e.message}")
        raise HTTPException(status_code=502, detail=f"Gateway error: {e.message}")


@router.post("/sim-swap/retrieve-date", response_model=SimSwapResponse)
async def retrieve_sim_swap_date(
    request: SimSwapRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve the latest SIM swap date.
    
    Uses Telefonica Open Gateway SIM Swap API.
    """
    gateway = get_gateway()
    
    try:
        if gateway.mode == GatewayMode.MOCK:
            result = gateway._mock_check_sim_swap()
        else:
            result = run_async(gateway.retrieve_sim_swap_date(phone_number=request.phone_number))
        
        return SimSwapResponse(
            swapped=result.swapped,
            latest_sim_change=result.latest_sim_change.isoformat() if result.latest_sim_change else None
        )
    except TelefonicaGatewayError as e:
        logger.error(f"SIM swap retrieve error: {e.message}")
        raise HTTPException(status_code=502, detail=f"Gateway error: {e.message}")


@router.post("/device-swap/check", response_model=DeviceSwapResponse)
async def check_device_swap(
    request: DeviceSwapRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Check if a device swap has occurred recently.
    
    Uses Telefonica Open Gateway Device Swap API.
    """
    gateway = get_gateway()
    
    try:
        if gateway.mode == GatewayMode.MOCK:
            result = gateway._mock_check_device_swap()
        else:
            result = run_async(gateway.check_device_swap(
                phone_number=request.phone_number,
                max_age_hours=request.max_age_hours
            ))
        
        return DeviceSwapResponse(
            swapped=result.swapped,
            latest_device_change=result.latest_device_change.isoformat() if result.latest_device_change else None
        )
    except TelefonicaGatewayError as e:
        logger.error(f"Device swap check error: {e.message}")
        raise HTTPException(status_code=502, detail=f"Gateway error: {e.message}")


@router.post("/device-swap/retrieve-date", response_model=DeviceSwapResponse)
async def retrieve_device_swap_date(
    request: DeviceSwapRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve the latest device swap date.
    
    Uses Telefonica Open Gateway Device Swap API.
    """
    gateway = get_gateway()
    
    try:
        if gateway.mode == GatewayMode.MOCK:
            result = gateway._mock_check_device_swap()
        else:
            result = run_async(gateway.retrieve_device_swap_date(phone_number=request.phone_number))
        
        return DeviceSwapResponse(
            swapped=result.swapped,
            latest_device_change=result.latest_device_change.isoformat() if result.latest_device_change else None
        )
    except TelefonicaGatewayError as e:
        logger.error(f"Device swap retrieve error: {e.message}")
        raise HTTPException(status_code=502, detail=f"Gateway error: {e.message}")


@router.post("/device-status/roaming", response_model=RoamingStatusResponse)
async def check_roaming_status(
    request: RoamingStatusRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Check if a device is currently roaming.
    
    Uses Telefonica Open Gateway Device Status API.
    """
    gateway = get_gateway()
    
    try:
        if gateway.mode == GatewayMode.MOCK:
            result = gateway._mock_check_roaming()
        else:
            result = run_async(gateway.check_roaming_status(phone_number=request.phone_number))
        
        return RoamingStatusResponse(
            roaming=result.roaming,
            country_code=result.country_code,
            country_name=result.country_name
        )
    except TelefonicaGatewayError as e:
        logger.error(f"Roaming status check error: {e.message}")
        raise HTTPException(status_code=502, detail=f"Gateway error: {e.message}")


# ==================== QoD Mobile Endpoints ====================

@router.get("/qod/profiles", response_model=List[QoSProfileResponse])
async def get_qos_profiles(
    phone_number: str = Query(..., description="Phone number for authentication"),
    current_user: User = Depends(get_current_user)
):
    """
    Get available QoS profiles.
    
    Uses Telefonica Open Gateway Quality on Demand API.
    """
    gateway = get_gateway()
    
    try:
        if gateway.mode == GatewayMode.MOCK:
            profiles = gateway._mock_get_qos_profiles()
        else:
            profiles = run_async(gateway.get_qos_profiles(phone_number=phone_number))
        
        return [
            QoSProfileResponse(
                name=p.name,
                description=p.description,
                status=p.status
            )
            for p in profiles
        ]
    except TelefonicaGatewayError as e:
        logger.error(f"QoS profiles error: {e.message}")
        raise HTTPException(status_code=502, detail=f"Gateway error: {e.message}")


@router.post("/qod/sessions", response_model=QoDSessionResponse)
async def create_qod_session(
    request: QoDSessionRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Create a new QoD session to optimize network quality.
    
    Uses Telefonica Open Gateway Quality on Demand API.
    
    QoS Profiles:
    - QOS_E: Enhanced communication - low latency
    - QOS_S: Standard communication
    - QOS_M: Medium bandwidth
    - QOS_L: Large bandwidth
    """
    gateway = get_gateway()
    
    try:
        if gateway.mode == GatewayMode.MOCK:
            result = gateway._mock_create_qod_session(
                request.phone_number,
                request.qos_profile,
                request.duration
            )
        else:
            result = run_async(gateway.create_qod_session(
                phone_number=request.phone_number,
                qos_profile=request.qos_profile,
                duration=request.duration,
                device_ipv4=request.device_ipv4,
                device_ipv6=request.device_ipv6,
                application_server_ipv4=request.application_server_ipv4,
                webhook_url=request.webhook_url
            ))
        
        return QoDSessionResponse(
            session_id=result.session_id,
            qos_status=result.qos_status,
            qos_profile=result.qos_profile,
            device_phone_number=result.device_phone_number,
            device_ipv4=result.device_ipv4,
            started_at=result.started_at.isoformat() if result.started_at else None,
            expires_at=result.expires_at.isoformat() if result.expires_at else None,
            duration=result.duration,
            message=result.message
        )
    except TelefonicaGatewayError as e:
        logger.error(f"QoD session creation error: {e.message}")
        raise HTTPException(status_code=502, detail=f"Gateway error: {e.message}")


@router.get("/qod/sessions/{session_id}", response_model=QoDSessionResponse)
async def get_qod_session(
    session_id: str,
    phone_number: str = Query(..., description="Phone number for authentication"),
    current_user: User = Depends(get_current_user)
):
    """
    Get information about an existing QoD session.
    
    Uses Telefonica Open Gateway Quality on Demand API.
    """
    gateway = get_gateway()
    
    try:
        if gateway.mode == GatewayMode.MOCK:
            result = QoDSessionResult(
                session_id=session_id,
                qos_status="AVAILABLE",
                qos_profile="QOS_E",
                device_phone_number=phone_number,
                duration=300
            )
        else:
            result = run_async(gateway.get_qod_session(
                session_id=session_id,
                phone_number=phone_number
            ))
        
        return QoDSessionResponse(
            session_id=result.session_id,
            qos_status=result.qos_status,
            qos_profile=result.qos_profile,
            device_phone_number=result.device_phone_number,
            device_ipv4=result.device_ipv4,
            started_at=result.started_at.isoformat() if result.started_at else None,
            expires_at=result.expires_at.isoformat() if result.expires_at else None,
            duration=result.duration,
            message=result.message
        )
    except TelefonicaGatewayError as e:
        logger.error(f"QoD session get error: {e.message}")
        raise HTTPException(status_code=502, detail=f"Gateway error: {e.message}")


@router.post("/qod/sessions/{session_id}/extend", response_model=QoDSessionResponse)
async def extend_qod_session(
    session_id: str,
    request: QoDExtendRequest,
    phone_number: str = Query(..., description="Phone number for authentication"),
    current_user: User = Depends(get_current_user)
):
    """
    Extend an existing QoD session.
    
    Uses Telefonica Open Gateway Quality on Demand API.
    """
    gateway = get_gateway()
    
    try:
        if gateway.mode == GatewayMode.MOCK:
            from datetime import datetime, timedelta
            result = QoDSessionResult(
                session_id=session_id,
                qos_status="AVAILABLE",
                qos_profile="QOS_E",
                device_phone_number=phone_number,
                duration=request.additional_duration,
                expires_at=datetime.utcnow() + timedelta(seconds=request.additional_duration)
            )
        else:
            result = run_async(gateway.extend_qod_session(
                session_id=session_id,
                phone_number=phone_number,
                additional_duration=request.additional_duration
            ))
        
        return QoDSessionResponse(
            session_id=result.session_id,
            qos_status=result.qos_status,
            qos_profile=result.qos_profile,
            device_phone_number=result.device_phone_number,
            device_ipv4=result.device_ipv4,
            started_at=result.started_at.isoformat() if result.started_at else None,
            expires_at=result.expires_at.isoformat() if result.expires_at else None,
            duration=result.duration,
            message=result.message
        )
    except TelefonicaGatewayError as e:
        logger.error(f"QoD session extend error: {e.message}")
        raise HTTPException(status_code=502, detail=f"Gateway error: {e.message}")


@router.delete("/qod/sessions/{session_id}")
async def delete_qod_session(
    session_id: str,
    phone_number: str = Query(..., description="Phone number for authentication"),
    current_user: User = Depends(get_current_user)
):
    """
    Delete/terminate a QoD session.
    
    Uses Telefonica Open Gateway Quality on Demand API.
    """
    gateway = get_gateway()
    
    try:
        if gateway.mode == GatewayMode.MOCK:
            success = True
        else:
            success = run_async(gateway.delete_qod_session(
                session_id=session_id,
                phone_number=phone_number
            ))
        
        return {"deleted": success, "session_id": session_id}
    except TelefonicaGatewayError as e:
        logger.error(f"QoD session delete error: {e.message}")
        raise HTTPException(status_code=502, detail=f"Gateway error: {e.message}")


# ==================== Combined Verification ====================

@router.post("/verify/full", response_model=FullVerificationResponse)
async def perform_full_verification(
    request: FullVerificationRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Perform a full verification including:
    - Number verification
    - Location verification
    - SIM swap check
    - Device swap check
    
    Uses multiple Telefonica Open Gateway APIs.
    """
    gateway = get_gateway()
    
    try:
        if gateway.mode == GatewayMode.MOCK:
            result = gateway.perform_full_verification_sync(
                phone_number=request.phone_number,
                site_latitude=request.latitude,
                site_longitude=request.longitude,
                site_radius=request.radius
            )
        else:
            result = run_async(gateway.perform_full_verification(
                phone_number=request.phone_number,
                site_latitude=request.latitude,
                site_longitude=request.longitude,
                site_radius=request.radius
            ))
        
        return FullVerificationResponse(
            number_verification=result.get("number_verification", {}),
            location_verification=result.get("location_verification", {}),
            risk_signals=result.get("risk_signals", {}),
            gateway_mode=gateway.mode.value
        )
    except TelefonicaGatewayError as e:
        logger.error(f"Full verification error: {e.message}")
        raise HTTPException(status_code=502, detail=f"Gateway error: {e.message}")

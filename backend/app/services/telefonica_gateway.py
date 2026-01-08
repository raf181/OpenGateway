"""Telefónica Open Gateway API Client.

This module implements the actual Telefónica Open Gateway API calls.
It supports both sandbox/mock mode and production mode.

API Documentation: https://developers.opengateway.telefonica.com/reference
"""
import os
import math
import httpx
from typing import Optional
from dataclasses import dataclass
from datetime import datetime, timedelta
from enum import Enum

from app.core.config import settings


class GatewayMode(str, Enum):
    """Gateway operation mode."""
    MOCK = "mock"  # Use local mock (frontend controls responses)
    SANDBOX = "sandbox"  # Use Telefónica sandbox APIs
    PRODUCTION = "production"  # Use Telefónica production APIs


@dataclass
class NumberVerificationResult:
    """Result of number verification check."""
    device_phone_number_verified: bool
    message: Optional[str] = None


@dataclass
class LocationVerificationResult:
    """Result of device location verification."""
    verification_result: str  # TRUE, FALSE, PARTIAL, UNDETERMINED
    last_location_time: Optional[datetime] = None
    match_rate: Optional[int] = None


@dataclass
class SimSwapResult:
    """Result of SIM swap check."""
    swapped: bool
    latest_sim_change: Optional[datetime] = None


@dataclass
class DeviceSwapResult:
    """Result of device swap check."""
    swapped: bool
    latest_device_change: Optional[datetime] = None


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points in meters using Haversine formula."""
    R = 6371000  # Earth's radius in meters
    
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    a = (math.sin(delta_phi / 2) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c


class TelefonicaGateway:
    """
    Telefónica Open Gateway API client.
    
    Supports three modes:
    - MOCK: Uses local mock data (controlled by frontend mock panel)
    - SANDBOX: Calls Telefónica sandbox APIs with mock_sandbox_access_token
    - PRODUCTION: Calls Telefónica production APIs with real OAuth tokens
    
    Environment variables:
    - GATEWAY_MODE: "mock", "sandbox", or "production"
    - GATEWAY_CLIENT_ID: OAuth client ID for production
    - GATEWAY_CLIENT_SECRET: OAuth client secret for production
    - GATEWAY_BASE_URL: Base URL override (defaults based on mode)
    """
    
    SANDBOX_URL = "https://sandbox.opengateway.telefonica.com/apigateway"
    PRODUCTION_URL = "https://opengateway.telefonica.com/apigateway"
    SANDBOX_TOKEN = "mock_sandbox_access_token"
    
    # API Endpoints
    ENDPOINTS = {
        "number_verify": "/number-verification/v0/verify",
        "location_verify": "/location/v0/verify",
        "sim_swap_check": "/sim-swap/v0/check",
        "sim_swap_retrieve": "/sim-swap/v0/retrieve-date",
        "device_swap_check": "/device-swap/v0.1/check",
        "device_swap_retrieve": "/device-swap/v0.1/retrieve-date",
        "roaming_status": "/device-status/v0/roaming",
    }
    
    # OAuth Scopes
    SCOPES = {
        "number_verify": "dpv:FraudPreventionAndDetection#number-verification-verify-read",
        "location_verify": "dpv:FraudPreventionAndDetection#device-location-read",
        "sim_swap": "dpv:FraudPreventionAndDetection#sim-swap",
        "device_swap": "dpv:FraudPreventionAndDetection#device-swap",
        "roaming": "dpv:FraudPreventionAndDetection#device-status-roaming-read",
    }
    
    def __init__(
        self,
        mode: Optional[GatewayMode] = None,
        access_token: Optional[str] = None,
        mock_context: Optional[dict] = None
    ):
        """
        Initialize the gateway client.
        
        Args:
            mode: Operation mode (mock/sandbox/production). Defaults to env var or mock.
            access_token: OAuth access token for production mode.
            mock_context: Mock response data for mock mode (from frontend panel).
        """
        self.mode = mode or GatewayMode(os.getenv("GATEWAY_MODE", "mock"))
        self.access_token = access_token
        self.mock_context = mock_context or {}
        
        # Set base URL based on mode
        if self.mode == GatewayMode.SANDBOX:
            self.base_url = os.getenv("GATEWAY_BASE_URL", self.SANDBOX_URL)
            self.access_token = self.access_token or self.SANDBOX_TOKEN
        elif self.mode == GatewayMode.PRODUCTION:
            self.base_url = os.getenv("GATEWAY_BASE_URL", self.PRODUCTION_URL)
        else:
            self.base_url = None  # Mock mode doesn't need URL
    
    async def _make_request(
        self,
        endpoint: str,
        method: str = "POST",
        json_data: Optional[dict] = None
    ) -> dict:
        """Make an HTTP request to the Telefónica API."""
        if self.mode == GatewayMode.MOCK:
            raise ValueError("Cannot make HTTP requests in mock mode")
        
        url = f"{self.base_url}{endpoint}"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        
        async with httpx.AsyncClient() as client:
            if method == "POST":
                response = await client.post(url, json=json_data, headers=headers)
            else:
                response = await client.get(url, headers=headers)
            
            response.raise_for_status()
            return response.json()
    
    # ==================== Number Verification ====================
    
    async def verify_number(
        self,
        phone_number: Optional[str] = None,
        hashed_phone_number: Optional[str] = None
    ) -> NumberVerificationResult:
        """
        Verify if the specified phone number matches the one associated with the access token.
        
        API: POST /number-verification/v0/verify
        Scope: dpv:FraudPreventionAndDetection#number-verification-verify-read
        
        Args:
            phone_number: Phone number in E.164 format (e.g., +34600000001)
            hashed_phone_number: SHA-256 hashed phone number (alternative to plain text)
        
        Returns:
            NumberVerificationResult with devicePhoneNumberVerified boolean
        """
        if self.mode == GatewayMode.MOCK:
            return self._mock_verify_number()
        
        # Build request body
        body = {}
        if phone_number:
            body["phoneNumber"] = phone_number
        elif hashed_phone_number:
            body["hashedPhoneNumber"] = hashed_phone_number
        
        response = await self._make_request(
            self.ENDPOINTS["number_verify"],
            json_data=body
        )
        
        return NumberVerificationResult(
            device_phone_number_verified=response.get("devicePhoneNumberVerified", False)
        )
    
    def _mock_verify_number(self) -> NumberVerificationResult:
        """Mock number verification using frontend panel data."""
        claimed = self.mock_context.get("claimed_phone")
        network = self.mock_context.get("network_phone")
        
        # If not configured, default to verified
        if not claimed or not network:
            return NumberVerificationResult(device_phone_number_verified=True)
        
        return NumberVerificationResult(
            device_phone_number_verified=(claimed == network)
        )
    
    # ==================== Location Verification ====================
    
    async def verify_location(
        self,
        latitude: float,
        longitude: float,
        radius: float,
        phone_number: Optional[str] = None,
        max_age: int = 60
    ) -> LocationVerificationResult:
        """
        Verify if the device is within the specified location area.
        
        API: POST /location/v0/verify
        Scope: dpv:FraudPreventionAndDetection#device-location-read
        
        Args:
            latitude: Center latitude of the area
            longitude: Center longitude of the area
            radius: Radius in meters
            phone_number: Phone number to verify (optional if using access token auth)
            max_age: Maximum age of location data in seconds (default 60)
        
        Returns:
            LocationVerificationResult with verification_result (TRUE/FALSE/PARTIAL/UNDETERMINED)
        """
        if self.mode == GatewayMode.MOCK:
            return self._mock_verify_location(latitude, longitude, radius)
        
        body = {
            "device": {},
            "area": {
                "areaType": "CIRCLE",
                "center": {
                    "latitude": latitude,
                    "longitude": longitude
                },
                "radius": radius
            },
            "maxAge": max_age
        }
        
        if phone_number:
            body["device"]["phoneNumber"] = phone_number
        
        response = await self._make_request(
            self.ENDPOINTS["location_verify"],
            json_data=body
        )
        
        return LocationVerificationResult(
            verification_result=response.get("verificationResult", "UNDETERMINED"),
            last_location_time=response.get("lastLocationTime"),
            match_rate=response.get("matchRate")
        )
    
    def _mock_verify_location(
        self,
        site_lat: float,
        site_lon: float,
        site_radius: float
    ) -> LocationVerificationResult:
        """Mock location verification using frontend panel data."""
        network_lat = self.mock_context.get("network_lat")
        network_lon = self.mock_context.get("network_lon")
        
        # If not configured, default to inside
        if network_lat is None or network_lon is None:
            return LocationVerificationResult(
                verification_result="TRUE",
                match_rate=100
            )
        
        # Calculate distance
        distance = haversine_distance(network_lat, network_lon, site_lat, site_lon)
        inside = distance <= site_radius
        
        return LocationVerificationResult(
            verification_result="TRUE" if inside else "FALSE",
            match_rate=100 if inside else 0
        )
    
    # ==================== SIM Swap ====================
    
    async def check_sim_swap(
        self,
        phone_number: str,
        max_age_hours: int = 72
    ) -> SimSwapResult:
        """
        Check if SIM swap has been performed during a past period.
        
        API: POST /sim-swap/v0/check
        Scope: dpv:FraudPreventionAndDetection#sim-swap
        
        Args:
            phone_number: Phone number in E.164 format
            max_age_hours: Maximum age to check for swap (default 72 hours)
        
        Returns:
            SimSwapResult with swapped boolean
        """
        if self.mode == GatewayMode.MOCK:
            return self._mock_check_sim_swap()
        
        body = {
            "phoneNumber": phone_number,
            "maxAge": max_age_hours
        }
        
        response = await self._make_request(
            self.ENDPOINTS["sim_swap_check"],
            json_data=body
        )
        
        return SimSwapResult(
            swapped=response.get("swapped", False)
        )
    
    async def retrieve_sim_swap_date(self, phone_number: str) -> SimSwapResult:
        """
        Retrieve the latest SIM swap date for a phone number.
        
        API: POST /sim-swap/v0/retrieve-date
        Scope: dpv:FraudPreventionAndDetection#sim-swap
        """
        if self.mode == GatewayMode.MOCK:
            return self._mock_check_sim_swap()
        
        body = {"phoneNumber": phone_number}
        
        response = await self._make_request(
            self.ENDPOINTS["sim_swap_retrieve"],
            json_data=body
        )
        
        latest_change = response.get("latestSimChange")
        return SimSwapResult(
            swapped=latest_change is not None,
            latest_sim_change=datetime.fromisoformat(latest_change) if latest_change else None
        )
    
    def _mock_check_sim_swap(self) -> SimSwapResult:
        """Mock SIM swap check using frontend panel data."""
        swapped = self.mock_context.get("sim_swap_recent", False)
        return SimSwapResult(
            swapped=swapped,
            latest_sim_change=datetime.utcnow() - timedelta(hours=24) if swapped else None
        )
    
    # ==================== Device Swap ====================
    
    async def check_device_swap(
        self,
        phone_number: str,
        max_age_hours: int = 72
    ) -> DeviceSwapResult:
        """
        Check if device swap has been performed during a past period.
        
        API: POST /device-swap/v0.1/check
        Scope: dpv:FraudPreventionAndDetection#device-swap
        
        Args:
            phone_number: Phone number in E.164 format
            max_age_hours: Maximum age to check for swap (default 72 hours)
        
        Returns:
            DeviceSwapResult with swapped boolean
        """
        if self.mode == GatewayMode.MOCK:
            return self._mock_check_device_swap()
        
        body = {
            "phoneNumber": phone_number,
            "maxAge": max_age_hours
        }
        
        response = await self._make_request(
            self.ENDPOINTS["device_swap_check"],
            json_data=body
        )
        
        return DeviceSwapResult(
            swapped=response.get("swapped", False)
        )
    
    async def retrieve_device_swap_date(self, phone_number: str) -> DeviceSwapResult:
        """
        Retrieve the latest device swap date for a phone number.
        
        API: POST /device-swap/v0.1/retrieve-date
        Scope: dpv:FraudPreventionAndDetection#device-swap
        """
        if self.mode == GatewayMode.MOCK:
            return self._mock_check_device_swap()
        
        body = {"phoneNumber": phone_number}
        
        response = await self._make_request(
            self.ENDPOINTS["device_swap_retrieve"],
            json_data=body
        )
        
        latest_change = response.get("latestDeviceChange")
        return DeviceSwapResult(
            swapped=latest_change is not None,
            latest_device_change=datetime.fromisoformat(latest_change) if latest_change else None
        )
    
    def _mock_check_device_swap(self) -> DeviceSwapResult:
        """Mock device swap check using frontend panel data."""
        swapped = self.mock_context.get("device_swap_recent", False)
        return DeviceSwapResult(
            swapped=swapped,
            latest_device_change=datetime.utcnow() - timedelta(hours=24) if swapped else None
        )
    
    # ==================== Combined Verification ====================
    
    async def perform_full_verification(
        self,
        phone_number: str,
        site_latitude: float,
        site_longitude: float,
        site_radius: float
    ) -> dict:
        """
        Perform all verification checks and return combined results.
        
        This is a convenience method that calls all verification APIs
        and returns a summary suitable for storing in audit events.
        """
        # Number verification
        number_result = await self.verify_number(phone_number=phone_number)
        
        # Location verification
        location_result = await self.verify_location(
            latitude=site_latitude,
            longitude=site_longitude,
            radius=site_radius,
            phone_number=phone_number
        )
        
        # SIM swap check
        sim_result = await self.check_sim_swap(phone_number=phone_number)
        
        # Device swap check
        device_result = await self.check_device_swap(phone_number=phone_number)
        
        return {
            "number_verification": {
                "verified": True,
                "match": number_result.device_phone_number_verified
            },
            "location_verification": {
                "verified": True,
                "verification_result": location_result.verification_result,
                "inside_geofence": location_result.verification_result == "TRUE",
                "match_rate": location_result.match_rate
            },
            "risk_signals": {
                "sim_swap_recent": sim_result.swapped,
                "device_swap_recent": device_result.swapped,
                "latest_sim_change": sim_result.latest_sim_change.isoformat() if sim_result.latest_sim_change else None,
                "latest_device_change": device_result.latest_device_change.isoformat() if device_result.latest_device_change else None
            }
        }
    
    def perform_full_verification_sync(
        self,
        phone_number: str,
        site_latitude: float,
        site_longitude: float,
        site_radius: float
    ) -> dict:
        """
        Synchronous version of full verification (for mock mode only).
        """
        if self.mode != GatewayMode.MOCK:
            raise ValueError("Sync verification only supported in mock mode")
        
        number_result = self._mock_verify_number()
        location_result = self._mock_verify_location(site_latitude, site_longitude, site_radius)
        sim_result = self._mock_check_sim_swap()
        device_result = self._mock_check_device_swap()
        
        return {
            "number_verification": {
                "verified": True,
                "match": number_result.device_phone_number_verified
            },
            "location_verification": {
                "verified": True,
                "verification_result": location_result.verification_result,
                "inside_geofence": location_result.verification_result == "TRUE",
                "match_rate": location_result.match_rate
            },
            "risk_signals": {
                "sim_swap_recent": sim_result.swapped,
                "device_swap_recent": device_result.swapped,
                "latest_sim_change": sim_result.latest_sim_change.isoformat() if sim_result.latest_sim_change else None,
                "latest_device_change": device_result.latest_device_change.isoformat() if device_result.latest_device_change else None
            }
        }

"""Telefónica Open Gateway API Client.

This module implements the actual Telefónica Open Gateway API calls.
It supports both sandbox/mock mode and production mode.

API Documentation: https://developers.opengateway.telefonica.com/reference

Authorization Flow (CIBA - Client-Initiated Backchannel Authentication):
1. POST /bc-authorize with login_hint (phone number) and scope
2. POST /token with auth_req_id to get access token
3. Use access token for API calls
"""
import os
import math
import httpx
import base64
import logging
from typing import Optional, Dict, Any
from dataclasses import dataclass
from datetime import datetime, timedelta
from enum import Enum

from app.core.config import settings

# Configure logging
logger = logging.getLogger(__name__)


class GatewayMode(str, Enum):
    """Gateway operation mode."""
    MOCK = "mock"  # Use local mock (frontend controls responses)
    SANDBOX = "sandbox"  # Use Telefónica sandbox APIs with CIBA OAuth
    PRODUCTION = "production"  # Use Telefónica production APIs with CIBA OAuth


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


@dataclass 
class RoamingStatusResult:
    """Result of roaming status check."""
    roaming: bool
    country_code: Optional[int] = None
    country_name: Optional[str] = None


@dataclass
class QoSProfile:
    """Quality of Service profile."""
    name: str
    description: Optional[str] = None
    status: Optional[str] = None


@dataclass
class QoDSessionResult:
    """Result of QoD session creation."""
    session_id: str
    qos_status: str  # REQUESTED, AVAILABLE, UNAVAILABLE
    qos_profile: str
    device_phone_number: Optional[str] = None
    device_ipv4: Optional[str] = None
    started_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    duration: Optional[int] = None
    message: Optional[str] = None


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


class TelefonicaGatewayError(Exception):
    """Custom exception for Telefonica Gateway errors."""
    def __init__(self, message: str, status_code: int = None, details: dict = None):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class TelefonicaGateway:
    """
    Telefónica Open Gateway API client.
    
    Supports three modes:
    - MOCK: Uses local mock data (controlled by frontend mock panel)
    - SANDBOX: Calls Telefónica sandbox APIs with CIBA OAuth flow
    - PRODUCTION: Calls Telefónica production APIs with CIBA OAuth flow
    
    Environment variables:
    - GATEWAY_MODE: "mock", "sandbox", or "production"
    - GATEWAY_CLIENT_ID: OAuth client ID (required for sandbox/production)
    - GATEWAY_CLIENT_SECRET: OAuth client secret (required for sandbox/production)
    - GATEWAY_BASE_URL: Base URL override (defaults based on mode)
    
    Authorization Flow (CIBA):
    1. POST /bc-authorize with login_hint=tel:+<phone> and scope
    2. POST /token with grant_type=urn:openid:params:grant-type:ciba and auth_req_id
    3. Use Bearer token for API calls
    """
    
    SANDBOX_URL = "https://sandbox.opengateway.telefonica.com/apigateway"
    PRODUCTION_URL = "https://opengateway.telefonica.com/apigateway"
    
    # API Endpoints
    ENDPOINTS = {
        "bc_authorize": "/bc-authorize",
        "token": "/token",
        "number_verify": "/number-verification/v0/verify",
        "location_verify": "/location/v0/verify",
        "sim_swap_check": "/sim-swap/v0/check",
        "sim_swap_retrieve": "/sim-swap/v0/retrieve-date",
        "device_swap_check": "/device-swap/v0.1/check",
        "device_swap_retrieve": "/device-swap/v0.1/retrieve-date",
        "roaming_status": "/device-status/v0/roaming",
        # QoD Mobile endpoints
        "qod_profiles": "/qod/v0/qos-profiles",
        "qod_sessions": "/qod/v0/sessions",
        "qod_session": "/qod/v0/sessions/{sessionId}",
        "qod_extend": "/qod/v0/sessions/{sessionId}/extend",
    }
    
    # OAuth Scopes for different APIs
    # Note: Telefonica uses "dpv:" prefix for CAMARA scopes
    SCOPES = {
        "number_verify": "dpv:FraudPreventionAndDetection#number-verification-verify-read",
        "location_verify": "dpv:FraudPreventionAndDetection#device-location-read",
        "sim_swap": "dpv:FraudPreventionAndDetection#sim-swap",
        "device_swap": "dpv:FraudPreventionAndDetection#device-swap",
        "roaming": "dpv:FraudPreventionAndDetection#device-status-roaming-read",
        "qod": "dpv:RequestedServiceProvision#qod",
    }
    
    # QoS Profile Constants
    QOS_PROFILES = {
        "QOS_E": "Enhanced communication profile - low latency",
        "QOS_S": "Standard communication profile",
        "QOS_M": "Medium bandwidth profile",
        "QOS_L": "Large bandwidth profile",
    }
    
    def __init__(
        self,
        mode: Optional[GatewayMode] = None,
        client_id: Optional[str] = None,
        client_secret: Optional[str] = None,
        mock_context: Optional[dict] = None
    ):
        """
        Initialize the gateway client.
        
        Args:
            mode: Operation mode (mock/sandbox/production). Defaults to env var or mock.
            client_id: OAuth client ID. Defaults to env var GATEWAY_CLIENT_ID.
            client_secret: OAuth client secret. Defaults to env var GATEWAY_CLIENT_SECRET.
            mock_context: Mock response data for mock mode (from frontend panel).
        """
        self.mode = mode or GatewayMode(settings.GATEWAY_MODE or "mock")
        self.client_id = client_id or settings.GATEWAY_CLIENT_ID
        self.client_secret = client_secret or settings.GATEWAY_CLIENT_SECRET
        self.mock_context = mock_context or {}
        
        # Token cache: {scope: {token, expires_at, phone_number}}
        self._token_cache: Dict[str, Dict[str, Any]] = {}
        
        # Set base URL based on mode
        if self.mode == GatewayMode.SANDBOX:
            self.base_url = settings.GATEWAY_BASE_URL or self.SANDBOX_URL
        elif self.mode == GatewayMode.PRODUCTION:
            self.base_url = settings.GATEWAY_BASE_URL or self.PRODUCTION_URL
        else:
            self.base_url = None  # Mock mode doesn't need URL
        
        # Validate credentials for non-mock modes
        if self.mode != GatewayMode.MOCK:
            if not self.client_id or not self.client_secret:
                raise TelefonicaGatewayError(
                    f"GATEWAY_CLIENT_ID and GATEWAY_CLIENT_SECRET are required for {self.mode.value} mode"
                )
        
        logger.info(f"TelefonicaGateway initialized in {self.mode.value} mode")
    
    def _get_basic_auth_header(self) -> str:
        """Get Basic Auth header value for OAuth requests."""
        credentials = f"{self.client_id}:{self.client_secret}"
        encoded = base64.b64encode(credentials.encode()).decode()
        return f"Basic {encoded}"
    
    async def _get_access_token(self, phone_number: str, scope: str) -> str:
        """
        Get an access token using CIBA (Client-Initiated Backchannel Authentication) flow.
        
        This implements the Telefonica OpenGateway OAuth flow:
        1. POST /bc-authorize with login_hint and scope
        2. POST /token with auth_req_id to get access token
        
        Args:
            phone_number: Phone number in E.164 format (e.g., +34666666666)
            scope: The API scope to request
            
        Returns:
            Access token string
        """
        # Check cache first
        cache_key = f"{phone_number}:{scope}"
        if cache_key in self._token_cache:
            cached = self._token_cache[cache_key]
            if datetime.utcnow() < cached["expires_at"]:
                logger.debug(f"Using cached token for {cache_key}")
                return cached["token"]
            else:
                del self._token_cache[cache_key]
        
        # Ensure phone number starts with +
        if not phone_number.startswith("+"):
            phone_number = f"+{phone_number}"
        
        login_hint = f"tel:{phone_number}"
        
        logger.info(f"Requesting CIBA authorization for {phone_number} with scope {scope}")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Step 1: Authorization request (bc-authorize)
            auth_url = f"{self.base_url}{self.ENDPOINTS['bc_authorize']}"
            auth_headers = {
                "Authorization": self._get_basic_auth_header(),
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            }
            auth_data = {
                "login_hint": login_hint,
                "scope": scope,
            }
            
            logger.debug(f"CIBA auth request to {auth_url}")
            auth_response = await client.post(auth_url, data=auth_data, headers=auth_headers)
            
            if auth_response.status_code != 200:
                error_detail = auth_response.text
                logger.error(f"CIBA auth failed: {auth_response.status_code} - {error_detail}")
                raise TelefonicaGatewayError(
                    f"Authorization request failed: {error_detail}",
                    status_code=auth_response.status_code,
                    details={"endpoint": "bc-authorize", "response": error_detail}
                )
            
            auth_result = auth_response.json()
            auth_req_id = auth_result.get("auth_req_id")
            
            if not auth_req_id:
                raise TelefonicaGatewayError(
                    "No auth_req_id in authorization response",
                    details={"response": auth_result}
                )
            
            logger.debug(f"Got auth_req_id: {auth_req_id[:20]}...")
            
            # Step 2: Token request
            token_url = f"{self.base_url}{self.ENDPOINTS['token']}"
            token_headers = {
                "Authorization": self._get_basic_auth_header(),
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            }
            token_data = {
                "grant_type": "urn:openid:params:grant-type:ciba",
                "auth_req_id": auth_req_id,
            }
            
            logger.debug(f"Token request to {token_url}")
            token_response = await client.post(token_url, data=token_data, headers=token_headers)
            
            if token_response.status_code != 200:
                error_detail = token_response.text
                logger.error(f"Token request failed: {token_response.status_code} - {error_detail}")
                raise TelefonicaGatewayError(
                    f"Token request failed: {error_detail}",
                    status_code=token_response.status_code,
                    details={"endpoint": "token", "response": error_detail}
                )
            
            token_result = token_response.json()
            access_token = token_result.get("access_token")
            expires_in = token_result.get("expires_in", 3600)
            
            if not access_token:
                raise TelefonicaGatewayError(
                    "No access_token in token response",
                    details={"response": token_result}
                )
            
            # Cache the token
            self._token_cache[cache_key] = {
                "token": access_token,
                "expires_at": datetime.utcnow() + timedelta(seconds=expires_in - 60),  # 60s buffer
                "phone_number": phone_number,
            }
            
            logger.info(f"Successfully obtained access token for {phone_number}")
            return access_token
    
    async def _make_request(
        self,
        endpoint: str,
        phone_number: str,
        scope: str,
        method: str = "POST",
        json_data: Optional[dict] = None
    ) -> dict:
        """
        Make an authenticated HTTP request to the Telefónica API.
        
        Args:
            endpoint: API endpoint path
            phone_number: Phone number for CIBA auth
            scope: OAuth scope for the API
            method: HTTP method (POST/GET)
            json_data: Request body for POST requests
            
        Returns:
            Response JSON as dict
        """
        if self.mode == GatewayMode.MOCK:
            raise ValueError("Cannot make HTTP requests in mock mode")
        
        # Get access token via CIBA flow
        access_token = await self._get_access_token(phone_number, scope)
        
        url = f"{self.base_url}{endpoint}"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        
        logger.debug(f"API request to {url}")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            if method == "POST":
                response = await client.post(url, json=json_data, headers=headers)
            else:
                response = await client.get(url, headers=headers)
            
            if response.status_code != 200:
                error_detail = response.text
                logger.error(f"API request failed: {response.status_code} - {error_detail}")
                raise TelefonicaGatewayError(
                    f"API request to {endpoint} failed: {error_detail}",
                    status_code=response.status_code,
                    details={"endpoint": endpoint, "response": error_detail}
                )
            
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
        
        if not phone_number and not hashed_phone_number:
            raise TelefonicaGatewayError("Either phone_number or hashed_phone_number is required")
        
        # Build request body
        body = {}
        if phone_number:
            body["phoneNumber"] = phone_number
        elif hashed_phone_number:
            body["hashedPhoneNumber"] = hashed_phone_number
        
        try:
            response = await self._make_request(
                self.ENDPOINTS["number_verify"],
                phone_number=phone_number or "",  # Use phone for auth
                scope=self.SCOPES["number_verify"],
                json_data=body
            )
            
            return NumberVerificationResult(
                device_phone_number_verified=response.get("devicePhoneNumberVerified", False)
            )
        except TelefonicaGatewayError as e:
            logger.error(f"Number verification failed: {e.message}")
            return NumberVerificationResult(
                device_phone_number_verified=False,
                message=f"Verification error: {e.message}"
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
        
        API: POST /device-location/v0/verify
        Scope: dpv:FraudPreventionAndDetection#device-location-read
        
        Args:
            latitude: Center latitude of the area
            longitude: Center longitude of the area
            radius: Radius in meters
            phone_number: Phone number to verify (required for CIBA auth)
            max_age: Maximum age of location data in seconds (default 60)
        
        Returns:
            LocationVerificationResult with verification_result (TRUE/FALSE/PARTIAL/UNDETERMINED)
        """
        if self.mode == GatewayMode.MOCK:
            return self._mock_verify_location(latitude, longitude, radius)
        
        if not phone_number:
            raise TelefonicaGatewayError("phone_number is required for location verification")
        
        # Telefonica sandbox uses a flat format with ueId, latitude, longitude, accuracy
        body = {
            "ueId": {
                "msisdn": phone_number
            },
            "latitude": latitude,
            "longitude": longitude,
            "accuracy": radius
        }
        
        try:
            response = await self._make_request(
                self.ENDPOINTS["location_verify"],
                phone_number=phone_number,
                scope=self.SCOPES["location_verify"],
                json_data=body
            )
            
            return LocationVerificationResult(
                verification_result=response.get("verificationResult", "UNDETERMINED"),
                last_location_time=response.get("lastLocationTime"),
                match_rate=response.get("matchRate")
            )
        except TelefonicaGatewayError as e:
            logger.error(f"Location verification failed: {e.message}")
            return LocationVerificationResult(
                verification_result="UNDETERMINED",
                match_rate=0
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
        
        try:
            response = await self._make_request(
                self.ENDPOINTS["sim_swap_check"],
                phone_number=phone_number,
                scope=self.SCOPES["sim_swap"],
                json_data=body
            )
            
            return SimSwapResult(
                swapped=response.get("swapped", False)
            )
        except TelefonicaGatewayError as e:
            logger.error(f"SIM swap check failed: {e.message}")
            return SimSwapResult(swapped=False)
    
    async def retrieve_sim_swap_date(self, phone_number: str) -> SimSwapResult:
        """
        Retrieve the latest SIM swap date for a phone number.
        
        API: POST /sim-swap/v0/retrieve-date
        Scope: dpv:FraudPreventionAndDetection#sim-swap
        """
        if self.mode == GatewayMode.MOCK:
            return self._mock_check_sim_swap()
        
        body = {"phoneNumber": phone_number}
        
        try:
            response = await self._make_request(
                self.ENDPOINTS["sim_swap_retrieve"],
                phone_number=phone_number,
                scope=self.SCOPES["sim_swap"],
                json_data=body
            )
            
            latest_change = response.get("latestSimChange")
            return SimSwapResult(
                swapped=latest_change is not None,
                latest_sim_change=datetime.fromisoformat(latest_change.replace('Z', '+00:00')) if latest_change else None
            )
        except TelefonicaGatewayError as e:
            logger.error(f"SIM swap retrieve failed: {e.message}")
            return SimSwapResult(swapped=False)
    
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
        
        try:
            response = await self._make_request(
                self.ENDPOINTS["device_swap_check"],
                phone_number=phone_number,
                scope=self.SCOPES["device_swap"],
                json_data=body
            )
            
            return DeviceSwapResult(
                swapped=response.get("swapped", False)
            )
        except TelefonicaGatewayError as e:
            logger.error(f"Device swap check failed: {e.message}")
            return DeviceSwapResult(swapped=False)
    
    async def retrieve_device_swap_date(self, phone_number: str) -> DeviceSwapResult:
        """
        Retrieve the latest device swap date for a phone number.
        
        API: POST /device-swap/v0.1/retrieve-date
        Scope: dpv:FraudPreventionAndDetection#device-swap
        """
        if self.mode == GatewayMode.MOCK:
            return self._mock_check_device_swap()
        
        body = {"phoneNumber": phone_number}
        
        try:
            response = await self._make_request(
                self.ENDPOINTS["device_swap_retrieve"],
                phone_number=phone_number,
                scope=self.SCOPES["device_swap"],
                json_data=body
            )
            
            latest_change = response.get("latestDeviceChange")
            return DeviceSwapResult(
                swapped=latest_change is not None,
                latest_device_change=datetime.fromisoformat(latest_change.replace('Z', '+00:00')) if latest_change else None
            )
        except TelefonicaGatewayError as e:
            logger.error(f"Device swap retrieve failed: {e.message}")
            return DeviceSwapResult(swapped=False)
    
    def _mock_check_device_swap(self) -> DeviceSwapResult:
        """Mock device swap check using frontend panel data."""
        swapped = self.mock_context.get("device_swap_recent", False)
        return DeviceSwapResult(
            swapped=swapped,
            latest_device_change=datetime.utcnow() - timedelta(hours=24) if swapped else None
        )
    
    # ==================== Roaming Status ====================
    
    async def check_roaming_status(self, phone_number: str) -> RoamingStatusResult:
        """
        Check if the device is currently roaming.
        
        API: POST /device-status/v0/roaming
        Scope: dpv:FraudPreventionAndDetection#device-status-roaming-read
        
        Args:
            phone_number: Phone number in E.164 format
            
        Returns:
            RoamingStatusResult with roaming status and country info
        """
        if self.mode == GatewayMode.MOCK:
            return self._mock_check_roaming()
        
        body = {
            "device": {
                "phoneNumber": phone_number
            }
        }
        
        try:
            response = await self._make_request(
                self.ENDPOINTS["roaming_status"],
                phone_number=phone_number,
                scope=self.SCOPES["roaming"],
                json_data=body
            )
            
            return RoamingStatusResult(
                roaming=response.get("roaming", False),
                country_code=response.get("countryCode"),
                country_name=response.get("countryName")
            )
        except TelefonicaGatewayError as e:
            logger.error(f"Roaming status check failed: {e.message}")
            return RoamingStatusResult(roaming=False)
    
    def _mock_check_roaming(self) -> RoamingStatusResult:
        """Mock roaming status check using frontend panel data."""
        roaming = self.mock_context.get("roaming", False)
        return RoamingStatusResult(
            roaming=roaming,
            country_code=34 if not roaming else 1,
            country_name="Spain" if not roaming else "United States"
        )
    
    # ==================== Quality on Demand (QoD) ====================
    
    async def get_qos_profiles(self, phone_number: str) -> list[QoSProfile]:
        """
        Get available QoS profiles.
        
        API: GET /qod/v0/qos-profiles
        Scope: dpv:RequestedServiceProvision#qod
        
        Args:
            phone_number: Phone number for CIBA auth
            
        Returns:
            List of available QoS profiles
        """
        if self.mode == GatewayMode.MOCK:
            return self._mock_get_qos_profiles()
        
        try:
            # Get access token via CIBA flow
            access_token = await self._get_access_token(phone_number, self.SCOPES["qod"])
            
            url = f"{self.base_url}{self.ENDPOINTS['qod_profiles']}"
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json",
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, headers=headers)
                
                if response.status_code != 200:
                    error_detail = response.text
                    logger.error(f"QoS profiles request failed: {response.status_code} - {error_detail}")
                    raise TelefonicaGatewayError(
                        f"QoS profiles request failed: {error_detail}",
                        status_code=response.status_code
                    )
                
                profiles_data = response.json()
                return [
                    QoSProfile(
                        name=p.get("name", ""),
                        description=p.get("description"),
                        status=p.get("status")
                    )
                    for p in profiles_data
                ]
        except TelefonicaGatewayError:
            raise
        except Exception as e:
            logger.error(f"QoS profiles request failed: {str(e)}")
            return self._mock_get_qos_profiles()
    
    def _mock_get_qos_profiles(self) -> list[QoSProfile]:
        """Mock QoS profiles."""
        return [
            QoSProfile(name="QOS_E", description="Enhanced communication - low latency", status="ACTIVE"),
            QoSProfile(name="QOS_S", description="Standard communication", status="ACTIVE"),
            QoSProfile(name="QOS_M", description="Medium bandwidth", status="ACTIVE"),
            QoSProfile(name="QOS_L", description="Large bandwidth", status="ACTIVE"),
        ]
    
    async def create_qod_session(
        self,
        phone_number: str,
        qos_profile: str = "QOS_E",
        duration: int = 300,
        device_ipv4: Optional[str] = None,
        device_ipv6: Optional[str] = None,
        application_server_ipv4: Optional[str] = None,
        webhook_url: Optional[str] = None
    ) -> QoDSessionResult:
        """
        Create a QoD session to optimize network quality for a device.
        
        API: POST /qod/v0/sessions
        Scope: dpv:RequestedServiceProvision#qod
        
        Args:
            phone_number: Phone number in E.164 format for the device
            qos_profile: QoS profile name (QOS_E, QOS_S, QOS_M, QOS_L)
            duration: Session duration in seconds (default 300 = 5 minutes)
            device_ipv4: Device IPv4 address (optional)
            device_ipv6: Device IPv6 address (optional)
            application_server_ipv4: Application server IPv4 (optional)
            webhook_url: Webhook URL for session notifications (optional)
            
        Returns:
            QoDSessionResult with session details
        """
        if self.mode == GatewayMode.MOCK:
            return self._mock_create_qod_session(phone_number, qos_profile, duration)
        
        # Build request body
        body = {
            "qosProfile": qos_profile,
            "duration": duration,
            "device": {}
        }
        
        # Device identification - at least one identifier required
        if phone_number:
            body["device"]["phoneNumber"] = phone_number
        if device_ipv4:
            body["device"]["ipv4Address"] = {"publicAddress": device_ipv4}
        if device_ipv6:
            body["device"]["ipv6Address"] = device_ipv6
        
        # Optional application server
        if application_server_ipv4:
            body["applicationServer"] = {"ipv4Address": application_server_ipv4}
        
        # Optional webhook for notifications
        if webhook_url:
            body["webhook"] = {
                "notificationUrl": webhook_url
            }
        
        try:
            response = await self._make_request(
                self.ENDPOINTS["qod_sessions"],
                phone_number=phone_number,
                scope=self.SCOPES["qod"],
                json_data=body
            )
            
            started_at = None
            expires_at = None
            if response.get("startedAt"):
                started_at = datetime.fromisoformat(response["startedAt"].replace('Z', '+00:00'))
            if response.get("expiresAt"):
                expires_at = datetime.fromisoformat(response["expiresAt"].replace('Z', '+00:00'))
            
            return QoDSessionResult(
                session_id=response.get("sessionId", ""),
                qos_status=response.get("qosStatus", "REQUESTED"),
                qos_profile=response.get("qosProfile", qos_profile),
                device_phone_number=phone_number,
                device_ipv4=device_ipv4,
                started_at=started_at,
                expires_at=expires_at,
                duration=response.get("duration", duration)
            )
        except TelefonicaGatewayError as e:
            logger.error(f"QoD session creation failed: {e.message}")
            return QoDSessionResult(
                session_id="",
                qos_status="UNAVAILABLE",
                qos_profile=qos_profile,
                message=f"Session creation failed: {e.message}"
            )
    
    def _mock_create_qod_session(
        self,
        phone_number: str,
        qos_profile: str,
        duration: int
    ) -> QoDSessionResult:
        """Mock QoD session creation."""
        import uuid
        session_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        return QoDSessionResult(
            session_id=session_id,
            qos_status="AVAILABLE",
            qos_profile=qos_profile,
            device_phone_number=phone_number,
            started_at=now,
            expires_at=now + timedelta(seconds=duration),
            duration=duration
        )
    
    async def get_qod_session(self, session_id: str, phone_number: str) -> QoDSessionResult:
        """
        Get information about an existing QoD session.
        
        API: GET /qod/v0/sessions/{sessionId}
        Scope: dpv:RequestedServiceProvision#qod
        
        Args:
            session_id: The session ID to retrieve
            phone_number: Phone number for CIBA auth
            
        Returns:
            QoDSessionResult with session details
        """
        if self.mode == GatewayMode.MOCK:
            return QoDSessionResult(
                session_id=session_id,
                qos_status="AVAILABLE",
                qos_profile="QOS_E",
                device_phone_number=phone_number,
                duration=300
            )
        
        try:
            # Get access token via CIBA flow
            access_token = await self._get_access_token(phone_number, self.SCOPES["qod"])
            
            endpoint = self.ENDPOINTS["qod_session"].format(sessionId=session_id)
            url = f"{self.base_url}{endpoint}"
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json",
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, headers=headers)
                
                if response.status_code != 200:
                    error_detail = response.text
                    logger.error(f"QoD session get failed: {response.status_code} - {error_detail}")
                    raise TelefonicaGatewayError(
                        f"QoD session get failed: {error_detail}",
                        status_code=response.status_code
                    )
                
                data = response.json()
                
                started_at = None
                expires_at = None
                if data.get("startedAt"):
                    started_at = datetime.fromisoformat(data["startedAt"].replace('Z', '+00:00'))
                if data.get("expiresAt"):
                    expires_at = datetime.fromisoformat(data["expiresAt"].replace('Z', '+00:00'))
                
                return QoDSessionResult(
                    session_id=data.get("sessionId", session_id),
                    qos_status=data.get("qosStatus", "UNKNOWN"),
                    qos_profile=data.get("qosProfile", ""),
                    started_at=started_at,
                    expires_at=expires_at,
                    duration=data.get("duration")
                )
        except TelefonicaGatewayError:
            raise
        except Exception as e:
            logger.error(f"QoD session get failed: {str(e)}")
            raise TelefonicaGatewayError(f"Failed to get QoD session: {str(e)}")
    
    async def extend_qod_session(
        self,
        session_id: str,
        phone_number: str,
        additional_duration: int = 300
    ) -> QoDSessionResult:
        """
        Extend an existing QoD session.
        
        API: POST /qod/v0/sessions/{sessionId}/extend
        Scope: dpv:RequestedServiceProvision#qod
        
        Args:
            session_id: The session ID to extend
            phone_number: Phone number for CIBA auth
            additional_duration: Additional duration in seconds
            
        Returns:
            QoDSessionResult with updated session details
        """
        if self.mode == GatewayMode.MOCK:
            return QoDSessionResult(
                session_id=session_id,
                qos_status="AVAILABLE",
                qos_profile="QOS_E",
                device_phone_number=phone_number,
                duration=additional_duration,
                expires_at=datetime.utcnow() + timedelta(seconds=additional_duration)
            )
        
        try:
            # Get access token via CIBA flow
            access_token = await self._get_access_token(phone_number, self.SCOPES["qod"])
            
            endpoint = self.ENDPOINTS["qod_extend"].format(sessionId=session_id)
            url = f"{self.base_url}{endpoint}"
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
            body = {
                "requestedAdditionalDuration": additional_duration
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, json=body, headers=headers)
                
                if response.status_code != 200:
                    error_detail = response.text
                    logger.error(f"QoD session extend failed: {response.status_code} - {error_detail}")
                    raise TelefonicaGatewayError(
                        f"QoD session extend failed: {error_detail}",
                        status_code=response.status_code
                    )
                
                data = response.json()
                
                expires_at = None
                if data.get("expiresAt"):
                    expires_at = datetime.fromisoformat(data["expiresAt"].replace('Z', '+00:00'))
                
                return QoDSessionResult(
                    session_id=data.get("sessionId", session_id),
                    qos_status=data.get("qosStatus", "AVAILABLE"),
                    qos_profile=data.get("qosProfile", ""),
                    expires_at=expires_at,
                    duration=data.get("duration")
                )
        except TelefonicaGatewayError:
            raise
        except Exception as e:
            logger.error(f"QoD session extend failed: {str(e)}")
            raise TelefonicaGatewayError(f"Failed to extend QoD session: {str(e)}")
    
    async def delete_qod_session(self, session_id: str, phone_number: str) -> bool:
        """
        Delete/terminate a QoD session.
        
        API: DELETE /qod/v0/sessions/{sessionId}
        Scope: dpv:RequestedServiceProvision#qod
        
        Args:
            session_id: The session ID to delete
            phone_number: Phone number for CIBA auth
            
        Returns:
            True if session was deleted successfully
        """
        if self.mode == GatewayMode.MOCK:
            return True
        
        try:
            # Get access token via CIBA flow
            access_token = await self._get_access_token(phone_number, self.SCOPES["qod"])
            
            endpoint = self.ENDPOINTS["qod_session"].format(sessionId=session_id)
            url = f"{self.base_url}{endpoint}"
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json",
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.delete(url, headers=headers)
                
                if response.status_code not in [200, 204]:
                    error_detail = response.text
                    logger.error(f"QoD session delete failed: {response.status_code} - {error_detail}")
                    raise TelefonicaGatewayError(
                        f"QoD session delete failed: {error_detail}",
                        status_code=response.status_code
                    )
                
                return True
        except TelefonicaGatewayError:
            raise
        except Exception as e:
            logger.error(f"QoD session delete failed: {str(e)}")
            raise TelefonicaGatewayError(f"Failed to delete QoD session: {str(e)}")
    
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
        
        Note: Number Verification is skipped in sandbox/production mode
        because it requires mobile network authentication (frontend auth code flow)
        and cannot be done via backend CIBA. It only works in mock mode.
        """
        # Number verification - only works in mock mode
        # In sandbox/production, this API requires the user to authenticate
        # via their mobile network (auth code flow), not backend CIBA
        if self.mode == GatewayMode.MOCK:
            number_result = self._mock_verify_number()
            number_match = number_result.device_phone_number_verified
        else:
            # Skip number verification in sandbox/production - assume verified
            # This would need to be done via frontend auth code flow
            logger.info("Skipping Number Verification (requires mobile network auth, not available via CIBA)")
            number_match = True  # Assume verified when using CIBA
        
        # Location verification - clamp radius to max 200m for sandbox
        location_radius = min(site_radius, 200) if self.mode == GatewayMode.SANDBOX else site_radius
        location_result = await self.verify_location(
            latitude=site_latitude,
            longitude=site_longitude,
            radius=location_radius,
            phone_number=phone_number
        )
        
        # SIM swap check
        sim_result = await self.check_sim_swap(phone_number=phone_number)
        
        # Device swap check
        device_result = await self.check_device_swap(phone_number=phone_number)
        
        return {
            "number_verification": {
                "verified": True,
                "match": number_match,
                "note": "Skipped in sandbox (requires mobile network auth)" if self.mode != GatewayMode.MOCK else None
            },
            "location_verification": {
                "verified": True,
                "verification_result": location_result.verification_result,
                "inside_geofence": location_result.verification_result in ["TRUE", "True", True],
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

"""Mock Telefónica Open Gateway provider.

This module simulates the Open Gateway APIs for local demo purposes.
It uses mock context provided by the frontend to simulate network responses.
"""
import math
from typing import Optional
from dataclasses import dataclass

from app.schemas.custody import MockNetworkContext


@dataclass
class NumberVerificationResult:
    """Result of number verification check."""
    verified: bool
    claimed_number: Optional[str]
    network_number: Optional[str]
    match: bool


@dataclass
class LocationVerificationResult:
    """Result of device location verification."""
    verified: bool
    inside_geofence: bool
    network_lat: Optional[float]
    network_lon: Optional[float]
    site_lat: float
    site_lon: float
    site_radius: float
    distance_meters: Optional[float]


@dataclass
class RiskSignals:
    """Risk signals from SIM/Device swap detection."""
    sim_swap_recent: bool
    device_swap_recent: bool


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


class OpenGatewayMock:
    """Mock implementation of Telefónica Open Gateway APIs."""
    
    def __init__(self, mock_context: Optional[MockNetworkContext] = None):
        """Initialize with optional mock context from frontend."""
        self.mock_context = mock_context or MockNetworkContext()
    
    def verify_number(self, claimed_phone: Optional[str] = None) -> NumberVerificationResult:
        """
        Mock Number Verification API.
        
        Compares the claimed phone number against the "network" phone number.
        In production, this would query the actual network for the device's number.
        """
        # Use claimed phone from context if not provided
        claimed = claimed_phone or self.mock_context.claimed_phone
        network = self.mock_context.network_phone
        
        # If no mock data provided, default to matching
        if not claimed and not network:
            return NumberVerificationResult(
                verified=True,
                claimed_number=None,
                network_number=None,
                match=True
            )
        
        # Check if numbers match
        match = claimed == network if (claimed and network) else False
        
        return NumberVerificationResult(
            verified=True,
            claimed_number=claimed,
            network_number=network,
            match=match if (claimed and network) else True  # Default to match if not configured
        )
    
    def verify_location(
        self,
        site_lat: float,
        site_lon: float,
        site_radius: float
    ) -> LocationVerificationResult:
        """
        Mock Device Location Verification API.
        
        Checks if the device's network-reported location is within the site geofence.
        In production, this would query the network for device location.
        """
        network_lat = self.mock_context.network_lat
        network_lon = self.mock_context.network_lon
        
        # If no location provided, default to inside geofence
        if network_lat is None or network_lon is None:
            return LocationVerificationResult(
                verified=True,
                inside_geofence=True,
                network_lat=None,
                network_lon=None,
                site_lat=site_lat,
                site_lon=site_lon,
                site_radius=site_radius,
                distance_meters=None
            )
        
        # Calculate distance from site center
        distance = haversine_distance(network_lat, network_lon, site_lat, site_lon)
        inside = distance <= site_radius
        
        return LocationVerificationResult(
            verified=True,
            inside_geofence=inside,
            network_lat=network_lat,
            network_lon=network_lon,
            site_lat=site_lat,
            site_lon=site_lon,
            site_radius=site_radius,
            distance_meters=distance
        )
    
    def get_risk_signals(self) -> RiskSignals:
        """
        Mock SIM Swap and Device Swap detection APIs.
        
        Returns risk signals indicating recent SIM or device changes.
        In production, this would query fraud detection APIs.
        """
        return RiskSignals(
            sim_swap_recent=self.mock_context.sim_swap_recent,
            device_swap_recent=self.mock_context.device_swap_recent
        )
    
    def perform_full_verification(
        self,
        claimed_phone: Optional[str],
        site_lat: float,
        site_lon: float,
        site_radius: float
    ) -> dict:
        """
        Perform all verification checks and return combined results.
        
        Returns a dictionary suitable for storing as verification_summary.
        """
        number_result = self.verify_number(claimed_phone)
        location_result = self.verify_location(site_lat, site_lon, site_radius)
        risk_signals = self.get_risk_signals()
        
        return {
            "number_verification": {
                "verified": number_result.verified,
                "match": number_result.match,
                "claimed_number": number_result.claimed_number,
                "network_number": number_result.network_number
            },
            "location_verification": {
                "verified": location_result.verified,
                "inside_geofence": location_result.inside_geofence,
                "network_lat": location_result.network_lat,
                "network_lon": location_result.network_lon,
                "distance_meters": location_result.distance_meters
            },
            "risk_signals": {
                "sim_swap_recent": risk_signals.sim_swap_recent,
                "device_swap_recent": risk_signals.device_swap_recent
            }
        }

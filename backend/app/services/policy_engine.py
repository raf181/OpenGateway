"""Policy engine for custody authorization decisions.

This module implements the policy rules that determine whether a custody
action should be ALLOWED, DENIED, or require STEP_UP approval.

Policy Rules:
1. If number mismatch -> DENY
2. If outside geofence for on-site required actions -> DENY (or STEP_UP for LOW sensitivity)
3. If HIGH sensitivity and any risk signal -> STEP_UP
4. If MEDIUM sensitivity and sim_swap_recent -> STEP_UP
5. Otherwise -> ALLOW
"""
from dataclasses import dataclass
from typing import Optional
from enum import Enum


class PolicyDecision(str, Enum):
    """Policy decision outcomes."""
    ALLOW = "ALLOW"
    DENY = "DENY"
    STEP_UP = "STEP_UP"


class CustodyAction(str, Enum):
    """Types of custody actions."""
    CHECK_OUT = "CHECK_OUT"
    CHECK_IN = "CHECK_IN"
    TRANSFER = "TRANSFER"
    INVENTORY_CLOSE = "INVENTORY_CLOSE"


class AssetSensitivity(str, Enum):
    """Asset sensitivity levels."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


@dataclass
class PolicyInput:
    """Input data for policy evaluation."""
    action: str
    asset_sensitivity: str
    user_role: str
    site_requires_onsite: bool
    number_match: bool
    inside_geofence: bool
    sim_swap_recent: bool
    device_swap_recent: bool


@dataclass
class PolicyResult:
    """Result of policy evaluation."""
    decision: PolicyDecision
    reason: str
    rule_triggered: str


class PolicyEngine:
    """
    Policy engine for custody action authorization.
    
    Evaluates verification results and asset properties to determine
    whether an action should be allowed, denied, or require approval.
    """
    
    # Actions that require being on-site
    ONSITE_REQUIRED_ACTIONS = {
        CustodyAction.CHECK_OUT.value,
        CustodyAction.CHECK_IN.value,
        CustodyAction.TRANSFER.value,
        CustodyAction.INVENTORY_CLOSE.value
    }
    
    def evaluate(self, policy_input: PolicyInput) -> PolicyResult:
        """
        Evaluate policy rules and return a decision.
        
        Rules are evaluated in order of priority:
        1. Number verification (highest priority)
        2. Geofence verification
        3. Risk signals based on sensitivity
        4. Default allow
        """
        # Rule 1: Number mismatch -> DENY
        if not policy_input.number_match:
            return PolicyResult(
                decision=PolicyDecision.DENY,
                reason="Phone number verification failed. The claimed number does not match the network-verified number.",
                rule_triggered="NUMBER_MISMATCH"
            )
        
        # Rule 2: Geofence check for on-site actions
        if (policy_input.site_requires_onsite and 
            policy_input.action in self.ONSITE_REQUIRED_ACTIONS and
            not policy_input.inside_geofence):
            
            # For LOW sensitivity, allow step-up approval
            if policy_input.asset_sensitivity == AssetSensitivity.LOW.value:
                return PolicyResult(
                    decision=PolicyDecision.STEP_UP,
                    reason="Device is outside the authorized geofence. Manager approval required for low-sensitivity assets.",
                    rule_triggered="GEOFENCE_OUTSIDE_LOW_SENSITIVITY"
                )
            else:
                # For MEDIUM and HIGH sensitivity, deny outright
                return PolicyResult(
                    decision=PolicyDecision.DENY,
                    reason="Device is outside the authorized geofence. On-site presence required for this action.",
                    rule_triggered="GEOFENCE_OUTSIDE"
                )
        
        # Rule 3: HIGH sensitivity with any risk signal -> STEP_UP
        if policy_input.asset_sensitivity == AssetSensitivity.HIGH.value:
            if policy_input.sim_swap_recent or policy_input.device_swap_recent:
                signals = []
                if policy_input.sim_swap_recent:
                    signals.append("SIM swap")
                if policy_input.device_swap_recent:
                    signals.append("device swap")
                return PolicyResult(
                    decision=PolicyDecision.STEP_UP,
                    reason=f"High-sensitivity asset with risk signals detected: {', '.join(signals)}. Manager approval required.",
                    rule_triggered="HIGH_SENSITIVITY_RISK_SIGNALS"
                )
        
        # Rule 4: MEDIUM sensitivity with SIM swap -> STEP_UP
        if policy_input.asset_sensitivity == AssetSensitivity.MEDIUM.value:
            if policy_input.sim_swap_recent:
                return PolicyResult(
                    decision=PolicyDecision.STEP_UP,
                    reason="Medium-sensitivity asset with recent SIM swap detected. Manager approval required.",
                    rule_triggered="MEDIUM_SENSITIVITY_SIM_SWAP"
                )
        
        # Rule 5: Default allow
        return PolicyResult(
            decision=PolicyDecision.ALLOW,
            reason="All verification checks passed. Action authorized.",
            rule_triggered="DEFAULT_ALLOW"
        )
    
    def evaluate_from_verification(
        self,
        action: str,
        asset_sensitivity: str,
        user_role: str,
        site_requires_onsite: bool,
        verification_summary: dict
    ) -> PolicyResult:
        """
        Convenience method to evaluate policy from verification summary dict.
        """
        number_verification = verification_summary.get("number_verification", {})
        location_verification = verification_summary.get("location_verification", {})
        risk_signals = verification_summary.get("risk_signals", {})
        
        policy_input = PolicyInput(
            action=action,
            asset_sensitivity=asset_sensitivity,
            user_role=user_role,
            site_requires_onsite=site_requires_onsite,
            number_match=number_verification.get("match", True),
            inside_geofence=location_verification.get("inside_geofence", True),
            sim_swap_recent=risk_signals.get("sim_swap_recent", False),
            device_swap_recent=risk_signals.get("device_swap_recent", False)
        )
        
        return self.evaluate(policy_input)


# Singleton instance
policy_engine = PolicyEngine()

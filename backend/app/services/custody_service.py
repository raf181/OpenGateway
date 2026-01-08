"""Custody service for managing asset custody transactions."""
import json
from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.asset import Asset, AssetStatus
from app.models.site import Site
from app.models.user import User
from app.models.approval import ApprovalRequest, ApprovalStatus
from app.schemas.custody import MockNetworkContext, VerificationResult, CustodyActionResponse
from app.services.open_gateway_mock import OpenGatewayMock
from app.services.policy_engine import policy_engine, PolicyDecision
from app.services.audit_service import AuditService


class CustodyService:
    """Service for handling custody transactions."""
    
    def __init__(self, db: Session):
        self.db = db
        self.audit_service = AuditService(db)
    
    def _get_asset(self, asset_id: int) -> Asset:
        """Get asset by ID or raise error."""
        asset = self.db.query(Asset).filter(Asset.id == asset_id).first()
        if not asset:
            raise ValueError(f"Asset with ID {asset_id} not found")
        return asset
    
    def _get_site(self, site_id: int) -> Site:
        """Get site by ID or raise error."""
        site = self.db.query(Site).filter(Site.id == site_id).first()
        if not site:
            raise ValueError(f"Site with ID {site_id} not found")
        return site
    
    def _get_user(self, user_id: int) -> User:
        """Get user by ID or raise error."""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError(f"User with ID {user_id} not found")
        return user
    
    def _perform_verification(
        self,
        user: User,
        site: Site,
        mock_context: Optional[MockNetworkContext]
    ) -> dict:
        """Perform Open Gateway verification checks."""
        gateway = OpenGatewayMock(mock_context)
        
        return gateway.perform_full_verification(
            claimed_phone=user.phone_number,
            site_lat=site.latitude,
            site_lon=site.longitude,
            site_radius=site.geofence_radius_m
        )
    
    def _create_verification_result(self, verification_summary: dict) -> VerificationResult:
        """Create VerificationResult from summary dict."""
        number_v = verification_summary.get("number_verification", {})
        location_v = verification_summary.get("location_verification", {})
        risk_s = verification_summary.get("risk_signals", {})
        
        return VerificationResult(
            number_verified=number_v.get("verified", True),
            geofence_verified=location_v.get("verified", True),
            inside_geofence=location_v.get("inside_geofence", True),
            sim_swap_detected=risk_s.get("sim_swap_recent", False),
            device_swap_detected=risk_s.get("device_swap_recent", False),
            details=verification_summary
        )
    
    def _create_approval_request(
        self,
        asset: Asset,
        user: User,
        action: str,
        site_id: int,
        verification_summary: dict,
        reason: str,
        target_user_id: Optional[int] = None
    ) -> ApprovalRequest:
        """Create a step-up approval request."""
        approval = ApprovalRequest(
            asset_id=asset.id,
            requester_id=user.id,
            action=action,
            site_id=site_id,
            target_user_id=target_user_id,
            verification_summary=json.dumps(verification_summary),
            reason=reason,
            status=ApprovalStatus.PENDING.value
        )
        self.db.add(approval)
        self.db.commit()
        self.db.refresh(approval)
        return approval
    
    def checkout(
        self,
        asset_id: int,
        site_id: int,
        user: User,
        mock_context: Optional[MockNetworkContext] = None
    ) -> CustodyActionResponse:
        """
        Check out an asset to a user.
        
        The asset must be AVAILABLE. Verification is performed and policy
        is evaluated to determine if the action is allowed.
        """
        asset = self._get_asset(asset_id)
        site = self._get_site(site_id)
        
        # Validate asset status
        if asset.status != AssetStatus.AVAILABLE.value:
            return CustodyActionResponse(
                success=False,
                decision="DENY",
                reason=f"Asset is not available for checkout. Current status: {asset.status}",
                verification=VerificationResult(
                    number_verified=False,
                    geofence_verified=False,
                    inside_geofence=False,
                    sim_swap_detected=False,
                    device_swap_detected=False,
                    details={}
                ),
                message="Checkout failed: asset not available"
            )
        
        # Perform verification
        verification_summary = self._perform_verification(user, site, mock_context)
        verification_result = self._create_verification_result(verification_summary)
        
        # Evaluate policy
        policy_result = policy_engine.evaluate_from_verification(
            action="CHECK_OUT",
            asset_sensitivity=asset.sensitivity_level,
            user_role=user.role,
            site_requires_onsite=site.requires_onsite,
            verification_summary=verification_summary
        )
        
        if policy_result.decision == PolicyDecision.ALLOW:
            # Update asset
            asset.status = AssetStatus.CHECKED_OUT.value
            asset.current_custodian_id = user.id
            asset.site_id = site_id
            self.db.commit()
            
            # Create audit event
            event = self.audit_service.create_event(
                asset_id=asset.id,
                actor_user_id=user.id,
                action="CHECK_OUT",
                decision="ALLOW",
                site_id=site_id,
                verification_summary=verification_summary
            )
            
            return CustodyActionResponse(
                success=True,
                decision="ALLOW",
                reason=policy_result.reason,
                verification=verification_result,
                event_id=event.id,
                message="Checkout successful"
            )
        
        elif policy_result.decision == PolicyDecision.STEP_UP:
            # Create approval request
            approval = self._create_approval_request(
                asset=asset,
                user=user,
                action="CHECK_OUT",
                site_id=site_id,
                verification_summary=verification_summary,
                reason=policy_result.reason
            )
            
            # Create audit event for step-up
            event = self.audit_service.create_event(
                asset_id=asset.id,
                actor_user_id=user.id,
                action="CHECK_OUT",
                decision="STEP_UP",
                site_id=site_id,
                verification_summary=verification_summary
            )
            
            return CustodyActionResponse(
                success=False,
                decision="STEP_UP",
                reason=policy_result.reason,
                verification=verification_result,
                event_id=event.id,
                approval_id=approval.id,
                message="Checkout requires manager approval"
            )
        
        else:  # DENY
            # Create audit event for denial
            event = self.audit_service.create_event(
                asset_id=asset.id,
                actor_user_id=user.id,
                action="CHECK_OUT",
                decision="DENY",
                site_id=site_id,
                verification_summary=verification_summary
            )
            
            return CustodyActionResponse(
                success=False,
                decision="DENY",
                reason=policy_result.reason,
                verification=verification_result,
                event_id=event.id,
                message="Checkout denied"
            )
    
    def return_asset(
        self,
        asset_id: int,
        site_id: int,
        user: User,
        mock_context: Optional[MockNetworkContext] = None
    ) -> CustodyActionResponse:
        """
        Return a checked-out asset.
        
        The asset must be CHECKED_OUT and the user must be the current custodian.
        """
        asset = self._get_asset(asset_id)
        site = self._get_site(site_id)
        
        # Validate asset status
        if asset.status != AssetStatus.CHECKED_OUT.value:
            return CustodyActionResponse(
                success=False,
                decision="DENY",
                reason=f"Asset is not checked out. Current status: {asset.status}",
                verification=VerificationResult(
                    number_verified=False,
                    geofence_verified=False,
                    inside_geofence=False,
                    sim_swap_detected=False,
                    device_swap_detected=False,
                    details={}
                ),
                message="Return failed: asset not checked out"
            )
        
        # Validate custodian (optional: allow any authorized user to return)
        if asset.current_custodian_id != user.id and user.role not in ["ADMIN", "MANAGER"]:
            return CustodyActionResponse(
                success=False,
                decision="DENY",
                reason="You are not the current custodian of this asset",
                verification=VerificationResult(
                    number_verified=False,
                    geofence_verified=False,
                    inside_geofence=False,
                    sim_swap_detected=False,
                    device_swap_detected=False,
                    details={}
                ),
                message="Return failed: not the custodian"
            )
        
        # Perform verification
        verification_summary = self._perform_verification(user, site, mock_context)
        verification_result = self._create_verification_result(verification_summary)
        
        # Evaluate policy
        policy_result = policy_engine.evaluate_from_verification(
            action="CHECK_IN",
            asset_sensitivity=asset.sensitivity_level,
            user_role=user.role,
            site_requires_onsite=site.requires_onsite,
            verification_summary=verification_summary
        )
        
        if policy_result.decision == PolicyDecision.ALLOW:
            # Update asset
            asset.status = AssetStatus.AVAILABLE.value
            asset.current_custodian_id = None
            asset.site_id = site_id
            self.db.commit()
            
            # Create audit event
            event = self.audit_service.create_event(
                asset_id=asset.id,
                actor_user_id=user.id,
                action="CHECK_IN",
                decision="ALLOW",
                site_id=site_id,
                verification_summary=verification_summary
            )
            
            return CustodyActionResponse(
                success=True,
                decision="ALLOW",
                reason=policy_result.reason,
                verification=verification_result,
                event_id=event.id,
                message="Return successful"
            )
        
        elif policy_result.decision == PolicyDecision.STEP_UP:
            approval = self._create_approval_request(
                asset=asset,
                user=user,
                action="CHECK_IN",
                site_id=site_id,
                verification_summary=verification_summary,
                reason=policy_result.reason
            )
            
            event = self.audit_service.create_event(
                asset_id=asset.id,
                actor_user_id=user.id,
                action="CHECK_IN",
                decision="STEP_UP",
                site_id=site_id,
                verification_summary=verification_summary
            )
            
            return CustodyActionResponse(
                success=False,
                decision="STEP_UP",
                reason=policy_result.reason,
                verification=verification_result,
                event_id=event.id,
                approval_id=approval.id,
                message="Return requires manager approval"
            )
        
        else:  # DENY
            event = self.audit_service.create_event(
                asset_id=asset.id,
                actor_user_id=user.id,
                action="CHECK_IN",
                decision="DENY",
                site_id=site_id,
                verification_summary=verification_summary
            )
            
            return CustodyActionResponse(
                success=False,
                decision="DENY",
                reason=policy_result.reason,
                verification=verification_result,
                event_id=event.id,
                message="Return denied"
            )
    
    def transfer(
        self,
        asset_id: int,
        site_id: int,
        user: User,
        target_user_id: int,
        mock_context: Optional[MockNetworkContext] = None
    ) -> CustodyActionResponse:
        """
        Transfer asset custody to another user.
        
        The asset must be checked out to the current user.
        """
        asset = self._get_asset(asset_id)
        site = self._get_site(site_id)
        target_user = self._get_user(target_user_id)
        
        # Validate asset status
        if asset.status != AssetStatus.CHECKED_OUT.value:
            return CustodyActionResponse(
                success=False,
                decision="DENY",
                reason="Asset is not checked out and cannot be transferred",
                verification=VerificationResult(
                    number_verified=False,
                    geofence_verified=False,
                    inside_geofence=False,
                    sim_swap_detected=False,
                    device_swap_detected=False,
                    details={}
                ),
                message="Transfer failed: asset not checked out"
            )
        
        # Validate custodian
        if asset.current_custodian_id != user.id and user.role not in ["ADMIN", "MANAGER"]:
            return CustodyActionResponse(
                success=False,
                decision="DENY",
                reason="You are not the current custodian of this asset",
                verification=VerificationResult(
                    number_verified=False,
                    geofence_verified=False,
                    inside_geofence=False,
                    sim_swap_detected=False,
                    device_swap_detected=False,
                    details={}
                ),
                message="Transfer failed: not the custodian"
            )
        
        # Perform verification
        verification_summary = self._perform_verification(user, site, mock_context)
        verification_result = self._create_verification_result(verification_summary)
        
        # Evaluate policy
        policy_result = policy_engine.evaluate_from_verification(
            action="TRANSFER",
            asset_sensitivity=asset.sensitivity_level,
            user_role=user.role,
            site_requires_onsite=site.requires_onsite,
            verification_summary=verification_summary
        )
        
        if policy_result.decision == PolicyDecision.ALLOW:
            # Update asset
            asset.current_custodian_id = target_user_id
            self.db.commit()
            
            # Create audit event
            event = self.audit_service.create_event(
                asset_id=asset.id,
                actor_user_id=user.id,
                action="TRANSFER",
                decision="ALLOW",
                site_id=site_id,
                target_user_id=target_user_id,
                verification_summary=verification_summary
            )
            
            return CustodyActionResponse(
                success=True,
                decision="ALLOW",
                reason=policy_result.reason,
                verification=verification_result,
                event_id=event.id,
                message=f"Transfer to {target_user.full_name} successful"
            )
        
        elif policy_result.decision == PolicyDecision.STEP_UP:
            approval = self._create_approval_request(
                asset=asset,
                user=user,
                action="TRANSFER",
                site_id=site_id,
                verification_summary=verification_summary,
                reason=policy_result.reason,
                target_user_id=target_user_id
            )
            
            event = self.audit_service.create_event(
                asset_id=asset.id,
                actor_user_id=user.id,
                action="TRANSFER",
                decision="STEP_UP",
                site_id=site_id,
                target_user_id=target_user_id,
                verification_summary=verification_summary
            )
            
            return CustodyActionResponse(
                success=False,
                decision="STEP_UP",
                reason=policy_result.reason,
                verification=verification_result,
                event_id=event.id,
                approval_id=approval.id,
                message="Transfer requires manager approval"
            )
        
        else:  # DENY
            event = self.audit_service.create_event(
                asset_id=asset.id,
                actor_user_id=user.id,
                action="TRANSFER",
                decision="DENY",
                site_id=site_id,
                target_user_id=target_user_id,
                verification_summary=verification_summary
            )
            
            return CustodyActionResponse(
                success=False,
                decision="DENY",
                reason=policy_result.reason,
                verification=verification_result,
                event_id=event.id,
                message="Transfer denied"
            )
    
    def inventory_close(
        self,
        asset_id: int,
        site_id: int,
        user: User,
        mock_context: Optional[MockNetworkContext] = None
    ) -> CustodyActionResponse:
        """
        Close inventory cycle for an asset (simplified cycle count verification).
        """
        asset = self._get_asset(asset_id)
        site = self._get_site(site_id)
        
        # Perform verification
        verification_summary = self._perform_verification(user, site, mock_context)
        verification_result = self._create_verification_result(verification_summary)
        
        # Evaluate policy
        policy_result = policy_engine.evaluate_from_verification(
            action="INVENTORY_CLOSE",
            asset_sensitivity=asset.sensitivity_level,
            user_role=user.role,
            site_requires_onsite=site.requires_onsite,
            verification_summary=verification_summary
        )
        
        if policy_result.decision == PolicyDecision.ALLOW:
            # Create audit event
            event = self.audit_service.create_event(
                asset_id=asset.id,
                actor_user_id=user.id,
                action="INVENTORY_CLOSE",
                decision="ALLOW",
                site_id=site_id,
                verification_summary=verification_summary
            )
            
            return CustodyActionResponse(
                success=True,
                decision="ALLOW",
                reason=policy_result.reason,
                verification=verification_result,
                event_id=event.id,
                message="Inventory close recorded"
            )
        
        elif policy_result.decision == PolicyDecision.STEP_UP:
            approval = self._create_approval_request(
                asset=asset,
                user=user,
                action="INVENTORY_CLOSE",
                site_id=site_id,
                verification_summary=verification_summary,
                reason=policy_result.reason
            )
            
            event = self.audit_service.create_event(
                asset_id=asset.id,
                actor_user_id=user.id,
                action="INVENTORY_CLOSE",
                decision="STEP_UP",
                site_id=site_id,
                verification_summary=verification_summary
            )
            
            return CustodyActionResponse(
                success=False,
                decision="STEP_UP",
                reason=policy_result.reason,
                verification=verification_result,
                event_id=event.id,
                approval_id=approval.id,
                message="Inventory close requires manager approval"
            )
        
        else:  # DENY
            event = self.audit_service.create_event(
                asset_id=asset.id,
                actor_user_id=user.id,
                action="INVENTORY_CLOSE",
                decision="DENY",
                site_id=site_id,
                verification_summary=verification_summary
            )
            
            return CustodyActionResponse(
                success=False,
                decision="DENY",
                reason=policy_result.reason,
                verification=verification_result,
                event_id=event.id,
                message="Inventory close denied"
            )
    
    def process_approval(
        self,
        approval_id: int,
        manager: User,
        approved: bool,
        note: Optional[str] = None
    ) -> CustodyActionResponse:
        """
        Process an approval request (approve or reject).
        
        If approved, the original action is finalized.
        """
        approval = self.db.query(ApprovalRequest).filter(ApprovalRequest.id == approval_id).first()
        if not approval:
            raise ValueError(f"Approval request {approval_id} not found")
        
        if approval.status != ApprovalStatus.PENDING.value:
            raise ValueError(f"Approval request is already {approval.status}")
        
        # Update approval
        approval.status = ApprovalStatus.APPROVED.value if approved else ApprovalStatus.REJECTED.value
        approval.resolved_by_id = manager.id
        approval.resolved_at = datetime.utcnow()
        approval.resolution_note = note
        self.db.commit()
        
        # Get related data
        asset = self._get_asset(approval.asset_id)
        verification_summary = json.loads(approval.verification_summary) if approval.verification_summary else {}
        
        if approved:
            # Execute the original action
            if approval.action == "CHECK_OUT":
                asset.status = AssetStatus.CHECKED_OUT.value
                asset.current_custodian_id = approval.requester_id
                asset.current_site_id = approval.site_id
            elif approval.action == "CHECK_IN":
                asset.status = AssetStatus.AVAILABLE.value
                asset.current_custodian_id = None
                asset.current_site_id = approval.site_id
            elif approval.action == "TRANSFER":
                asset.current_custodian_id = approval.target_user_id
            # INVENTORY_CLOSE doesn't change asset state
            
            self.db.commit()
            
            # Create audit event for approval
            event = self.audit_service.create_event(
                asset_id=approval.asset_id,
                actor_user_id=approval.requester_id,
                action=approval.action,
                decision="ALLOW",
                site_id=approval.site_id,
                target_user_id=approval.target_user_id,
                approval_id=approval.id,
                verification_summary=verification_summary
            )
            
            return CustodyActionResponse(
                success=True,
                decision="ALLOW",
                reason=f"Approved by {manager.full_name}",
                verification=self._create_verification_result(verification_summary),
                event_id=event.id,
                approval_id=approval.id,
                message=f"Action approved and executed"
            )
        else:
            # Create audit event for rejection
            event = self.audit_service.create_event(
                asset_id=approval.asset_id,
                actor_user_id=approval.requester_id,
                action=approval.action,
                decision="DENY",
                site_id=approval.site_id,
                target_user_id=approval.target_user_id,
                approval_id=approval.id,
                verification_summary=verification_summary
            )
            
            return CustodyActionResponse(
                success=False,
                decision="DENY",
                reason=f"Rejected by {manager.full_name}: {note or 'No reason provided'}",
                verification=self._create_verification_result(verification_summary),
                event_id=event.id,
                approval_id=approval.id,
                message="Action rejected"
            )

"""API module exports."""
from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.sites import router as sites_router
from app.api.assets import router as assets_router
from app.api.custody import router as custody_router
from app.api.approvals import router as approvals_router
from app.api.audit import router as audit_router
from app.api.dashboard import router as dashboard_router
from app.api.opengateway import router as opengateway_router

api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(sites_router)
api_router.include_router(assets_router)
api_router.include_router(custody_router)
api_router.include_router(approvals_router)
api_router.include_router(audit_router)
api_router.include_router(dashboard_router)
api_router.include_router(opengateway_router)

__all__ = ["api_router"]

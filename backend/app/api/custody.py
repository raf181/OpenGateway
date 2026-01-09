"""Custody transaction API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.custody import (
    CheckoutRequest,
    ReturnRequest,
    TransferRequest,
    InventoryCloseRequest,
    CustodyActionResponse
)
from app.services.custody_service import CustodyService

router = APIRouter(prefix="/custody", tags=["Custody"])


@router.post("/checkout", response_model=CustodyActionResponse)
async def checkout_asset(
    request: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Check out an asset to the current user."""
    try:
        service = CustodyService(db)
        return await service.checkout(
            asset_id=request.asset_id,
            site_id=request.site_id,
            user=current_user,
            mock_context=request.mock_context
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/return", response_model=CustodyActionResponse)
async def return_asset(
    request: ReturnRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Return a checked-out asset."""
    try:
        service = CustodyService(db)
        return await service.return_asset(
            asset_id=request.asset_id,
            site_id=request.site_id,
            user=current_user,
            mock_context=request.mock_context
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/transfer", response_model=CustodyActionResponse)
async def transfer_asset(
    request: TransferRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Transfer asset custody to another user."""
    try:
        service = CustodyService(db)
        return await service.transfer(
            asset_id=request.asset_id,
            site_id=request.site_id,
            user=current_user,
            target_user_id=request.target_user_id,
            mock_context=request.mock_context
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/inventory-close", response_model=CustodyActionResponse)
async def inventory_close(
    request: InventoryCloseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Close inventory cycle for an asset."""
    try:
        service = CustodyService(db)
        return await service.inventory_close(
            asset_id=request.asset_id,
            site_id=request.site_id,
            user=current_user,
            mock_context=request.mock_context
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

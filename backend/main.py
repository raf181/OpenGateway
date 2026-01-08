"""GeoCustody Backend - FastAPI Application."""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.core.security import get_password_hash
from app.api import api_router
from app.models import User, Site, Asset

# Create data directory
os.makedirs("data", exist_ok=True)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="GeoCustody - Personnel and inventory tracking with Telefónica Open Gateway verification",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)


def seed_database():
    """Seed the database with sample data."""
    db = SessionLocal()
    
    try:
        # Check if already seeded
        if db.query(User).first():
            print("Database already seeded")
            return
        
        print("Seeding database...")
        
        # Create sites
        sites = [
            Site(
                name="Main Warehouse",
                address="123 Industrial Blvd, Madrid",
                latitude=40.4168,  # Madrid
                longitude=-3.7038,
                geofence_radius_m=200,
                requires_onsite=True
            ),
            Site(
                name="Field Office North",
                address="456 Tech Park, Madrid",
                latitude=40.4500,
                longitude=-3.6800,
                geofence_radius_m=150,
                requires_onsite=True
            )
        ]
        for site in sites:
            db.add(site)
        db.commit()
        
        # Get site IDs
        main_warehouse = db.query(Site).filter(Site.name == "Main Warehouse").first()
        field_office = db.query(Site).filter(Site.name == "Field Office North").first()
        
        # Create users
        users = [
            User(
                email="admin@geocustody.com",
                hashed_password=get_password_hash("admin123"),
                full_name="Admin User",
                role="ADMIN",
                phone_number="+34600000001",
                home_site_id=main_warehouse.id
            ),
            User(
                email="manager@geocustody.com",
                hashed_password=get_password_hash("manager123"),
                full_name="Manager Smith",
                role="MANAGER",
                phone_number="+34600000002",
                home_site_id=main_warehouse.id
            ),
            User(
                email="john@geocustody.com",
                hashed_password=get_password_hash("employee123"),
                full_name="John Employee",
                role="EMPLOYEE",
                phone_number="+34600000003",
                home_site_id=main_warehouse.id
            ),
            User(
                email="jane@geocustody.com",
                hashed_password=get_password_hash("employee123"),
                full_name="Jane Employee",
                role="EMPLOYEE",
                phone_number="+34600000004",
                home_site_id=field_office.id
            )
        ]
        for user in users:
            db.add(user)
        db.commit()
        
        # Create assets
        assets = [
            # Main Warehouse - Low sensitivity
            Asset(
                tag_id="TOOL-001",
                name="Power Drill",
                description="Cordless power drill",
                sensitivity_level="LOW",
                status="AVAILABLE",
                site_id=main_warehouse.id
            ),
            Asset(
                tag_id="TOOL-002",
                name="Angle Grinder",
                description="Electric angle grinder",
                sensitivity_level="LOW",
                status="AVAILABLE",
                site_id=main_warehouse.id
            ),
            # Main Warehouse - Medium sensitivity
            Asset(
                tag_id="EQUIP-001",
                name="Diagnostic Scanner",
                description="Professional diagnostic equipment",
                sensitivity_level="MEDIUM",
                status="AVAILABLE",
                site_id=main_warehouse.id
            ),
            Asset(
                tag_id="EQUIP-002",
                name="Calibration Kit",
                description="Precision calibration tools",
                sensitivity_level="MEDIUM",
                status="AVAILABLE",
                site_id=main_warehouse.id
            ),
            # Main Warehouse - High sensitivity
            Asset(
                tag_id="DEVICE-001",
                name="Network Analyzer",
                description="Enterprise network analysis device",
                sensitivity_level="HIGH",
                status="AVAILABLE",
                site_id=main_warehouse.id
            ),
            Asset(
                tag_id="DEVICE-002",
                name="Security Token Generator",
                description="Hardware security module",
                sensitivity_level="HIGH",
                status="AVAILABLE",
                site_id=main_warehouse.id
            ),
            # Field Office - Low sensitivity
            Asset(
                tag_id="TOOL-003",
                name="Cable Tester",
                description="Network cable testing device",
                sensitivity_level="LOW",
                status="AVAILABLE",
                site_id=field_office.id
            ),
            Asset(
                tag_id="TOOL-004",
                name="Crimping Tool Set",
                description="Professional crimping tools",
                sensitivity_level="LOW",
                status="AVAILABLE",
                site_id=field_office.id
            ),
            # Field Office - Medium sensitivity
            Asset(
                tag_id="EQUIP-003",
                name="Signal Meter",
                description="RF signal measurement device",
                sensitivity_level="MEDIUM",
                status="AVAILABLE",
                site_id=field_office.id
            ),
            # Field Office - High sensitivity
            Asset(
                tag_id="DEVICE-003",
                name="Encryption Module",
                description="Hardware encryption device",
                sensitivity_level="HIGH",
                status="AVAILABLE",
                site_id=field_office.id
            ),
            # Additional varied assets
            Asset(
                tag_id="MED-001",
                name="Medical Monitor",
                description="Portable vital signs monitor",
                sensitivity_level="HIGH",
                status="AVAILABLE",
                site_id=main_warehouse.id
            ),
            Asset(
                tag_id="CONST-001",
                name="Laser Level",
                description="Construction laser level",
                sensitivity_level="LOW",
                status="AVAILABLE",
                site_id=field_office.id
            )
        ]
        for asset in assets:
            db.add(asset)
        db.commit()
        
        print(f"Seeded {len(sites)} sites, {len(users)} users, and {len(assets)} assets")
        
    finally:
        db.close()


@app.on_event("startup")
async def startup():
    """Run startup tasks."""
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Seed sample data
    seed_database()


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}

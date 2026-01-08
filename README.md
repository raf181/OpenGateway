# GeoCustody - Full-Stack Demo

GeoCustody is a personnel and inventory tracking + authorization system that enforces chain-of-custody and verified on-site actions using Telefónica Open Gateway network APIs (mocked for this demo).

## Project Structure

```
/
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Config, security, database
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic
│   ├── data/               # SQLite database (auto-created)
│   ├── main.py             # FastAPI application entry
│   └── requirements.txt
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utilities
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js 18+
- npm

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn main:app --reload --port 8000
```

The backend will be available at <http://localhost:8000>

API documentation available at:

- Swagger UI: <http://localhost:8000/docs>
- ReDoc: <http://localhost:8000/redoc>

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at <http://localhost:5173>

## Demo Credentials

| Role     | Email                 | Password |
|----------|----------------------|----------|
| Admin    | <admin@geocustody.com> | admin123 |
| Manager  | <manager@geocustody.com> | manager123 |
| Employee | <john@geocustody.com>  | employee123 |
| Employee | <jane@geocustody.com>  | employee123 |

## Features

### Public Marketing Site

- **/** - Landing page with full product information
- **/product** - Product overview with architecture diagram
- Modal forms for "Book a Demo" and "Request Pricing"

### Authenticated Demo App

#### Employee Portal (`/app/employee`)

- View assigned assets
- Check-out, return, and transfer assets
- Scan assets by tag ID
- Real-time verification feedback

#### Manager Portal (`/app/manager`)

- Review and approve/reject step-up requests
- Monitor team activities

#### Admin Portal (`/app/admin`)

- Dashboard with key metrics
- Manage assets, sites, users, and policies
- Full audit trail access

### Mock Network Panel

A floating panel in the app that allows you to simulate Telefónica Open Gateway responses:

- Set claimed vs network phone numbers
- Set network location (lat/lon)
- Toggle SIM swap and device swap signals

## Policy Engine Rules

The policy engine evaluates custody actions based on:

1. **Number Verification**: If claimed number doesn't match network number → DENY
2. **Geofence Check**: If user is outside site geofence for on-site actions → DENY (or STEP_UP for LOW sensitivity)
3. **High Sensitivity Assets**: Any risk signal (SIM swap or device swap) → STEP_UP
4. **Medium Sensitivity Assets**: SIM swap detected → STEP_UP
5. **Otherwise**: ALLOW

## Audit Trail

All custody events are stored with a tamper-evident hash chain:

- Each event includes a hash of the previous event
- Chain verification endpoint to detect tampering
- Immutable append-only log

## Tech Stack

### Backend

- Python 3.12+
- FastAPI
- SQLAlchemy + SQLite
- Pydantic
- PyJWT
- Uvicorn

### Frontend

- React 18
- Vite
- React Router v6
- Tailwind CSS
- PostCSS

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login and get JWT
- `GET /api/auth/me` - Get current user

### Users (Admin only)

- `GET /api/users` - List users
- `POST /api/users` - Create user

### Sites (Admin only)

- `GET /api/sites` - List sites
- `POST /api/sites` - Create site
- `PUT /api/sites/{id}` - Update site

### Assets

- `GET /api/assets` - List assets (with filters)
- `POST /api/assets` - Create asset (Admin)
- `GET /api/assets/{id}` - Get asset details
- `PUT /api/assets/{id}` - Update asset (Admin)

### Custody

- `POST /api/custody/checkout` - Check out asset
- `POST /api/custody/return` - Return asset
- `POST /api/custody/transfer` - Transfer asset
- `POST /api/custody/inventory-close` - Close inventory

### Approvals (Manager)

- `GET /api/approvals` - List pending approvals
- `POST /api/approvals/{id}/approve` - Approve request
- `POST /api/approvals/{id}/reject` - Reject request

### Audit

- `GET /api/audit/events` - List audit events
- `GET /api/audit/verify-chain` - Verify chain integrity

## License

Demo project - Not for production use.

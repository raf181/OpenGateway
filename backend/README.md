# GeoCustody Backend

![Python](https://img.shields.io/badge/Python-3.12%2B-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green?logo=fastapi)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-blue?logo=database)
![Status](https://img.shields.io/badge/Status-Demo-yellow)

A modern FastAPI backend service for personnel and asset custody management with advanced network-based verification capabilities.

## Overview

GeoCustody Backend is a comprehensive custody management system that integrates with **Telefónica Open Gateway** APIs for network-level verification. It provides features for tracking asset checkout/return, managing user approvals, maintaining tamper-evident audit trails, and enforcing risk-based authentication policies.

## ✨ Features

### Core Functionality
- **Asset Custody Management** - Checkout, return, transfer, and inventory close operations with full audit trails
- **User & Site Management** - Role-based access control (Admin, Manager, Employee)
- **Approval Workflows** - Multi-level approval system for custody transactions
- **Comprehensive Audit Trail** - Tamper-evident event logging with chain verification

### Advanced Features
- **Telefónica Open Gateway Integration**
  - Phone number verification
  - Device location verification
  - SIM swap detection (check & retrieve)
  - Device swap detection (check & retrieve)
  - Roaming status verification
  - Quality of Demand (QoD) mobile network sessions
  
- **Policy Engine** - Intelligent step-up authentication and risk-based decision making
- **Mock Mode** - Full mock implementation for development/testing without live API calls
- **Sandbox & Production Modes** - Support for all Telefónica Open Gateway environments

### Technical Highlights
- **RESTful API** - Fully documented with OpenAPI/Swagger
- **Type Safety** - Pydantic v2 for request/response validation
- **Modern Security** - JWT-based authentication, password hashing with bcrypt
- **Async Support** - Built on async/await for high performance
- **CORS-Enabled** - Ready for frontend integration
- **Health Checks** - Liveness and readiness probes included

## 🚀 Quick Start

### Prerequisites
- Python 3.12 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Installation

1. **Clone and navigate to backend directory**
```bash
cd backend
```

2. **Create and activate virtual environment** (recommended)
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```bash
# Application Settings
APP_NAME=GeoCustody
SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=sqlite:///./data/geoctody.db

# Telefónica Open Gateway
GATEWAY_MODE=mock  # Options: mock, sandbox, production
GATEWAY_CLIENT_ID=your-client-id
GATEWAY_CLIENT_SECRET=your-client-secret

# CORS
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
```

5. **Run the server**
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at **http://localhost:8000**

## 📚 API Documentation

Once the server is running, access interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Health & Status Endpoints
- `GET /` - Root endpoint with app info
- `GET /health` - Health check

### Available API Routes

| Module | Prefix | Purpose |
|--------|--------|---------|
| Authentication | `/api/auth` | Login, token management |
| Users | `/api/users` | User CRUD and management |
| Sites | `/api/sites` | Site/location management |
| Assets | `/api/assets` | Asset inventory management |
| Custody | `/api/custody` | Checkout, return, transfer operations |
| Approvals | `/api/approvals` | Approval request workflows |
| Audit | `/api/audit` | Event logging and chain verification |
| Dashboard | `/api/dashboard` | Analytics and status overview |
| Open Gateway | `/api/opengateway` | Telefónica verification APIs |

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── api/                    # API endpoint definitions
│   │   ├── __init__.py
│   │   ├── auth.py            # Authentication endpoints
│   │   ├── users.py           # User management
│   │   ├── sites.py           # Site management
│   │   ├── assets.py          # Asset management
│   │   ├── custody.py         # Custody transactions
│   │   ├── approvals.py       # Approval workflows
│   │   ├── audit.py           # Audit trail
│   │   ├── dashboard.py       # Dashboard/analytics
│   │   └── opengateway.py     # Telefónica API integration
│   │
│   ├── core/                   # Core functionality
│   │   ├── __init__.py
│   │   ├── config.py          # Settings and environment config
│   │   ├── database.py        # Database setup and session management
│   │   └── security.py        # JWT, password hashing, authorization
│   │
│   ├── models/                 # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── user.py            # User model with roles
│   │   ├── site.py            # Site/location model
│   │   ├── asset.py           # Asset model with status tracking
│   │   ├── audit.py           # Audit event model
│   │   └── approval.py        # Approval request model
│   │
│   ├── schemas/                # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── site.py
│   │   ├── asset.py
│   │   ├── custody.py
│   │   ├── approval.py
│   │   └── audit.py
│   │
│   └── services/               # Business logic and integrations
│       ├── __init__.py
│       ├── telefonica_gateway.py    # Telefónica Open Gateway client
│       ├── policy_engine.py         # Risk-based decision engine
│       ├── custody_service.py       # Custody transaction logic
│       ├── audit_service.py         # Audit trail management
│       └── open_gateway_mock.py     # Mock gateway for testing
│
├── data/                       # SQLite database (auto-created)
├── main.py                     # FastAPI application entry point
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## 🔧 Environment Variables Reference

### Application
- `APP_NAME` - Application display name (default: GeoCustody)
- `SECRET_KEY` - JWT signing secret (generate with: `openssl rand -hex 32`)

### Database
- `DATABASE_URL` - SQLAlchemy connection string (default: sqlite:///./data/geoctody.db)

### Telefónica Open Gateway
- `GATEWAY_MODE` - Gateway environment: `mock` (default), `sandbox`, or `production`
- `GATEWAY_CLIENT_ID` - OAuth2 client ID
- `GATEWAY_CLIENT_SECRET` - OAuth2 client secret
- `GATEWAY_REDIRECT_URI` - OAuth2 callback URL (optional)

### Security & CORS
- `CORS_ORIGINS` - List of allowed origins (JSON array)
- `TOKEN_EXPIRE_MINUTES` - JWT token expiration (default: 30)

## 🗄️ Database Schema

### Users
- Roles: `ADMIN`, `MANAGER`, `EMPLOYEE`
- Authentication via bcrypt-hashed passwords
- JWT-based session management

### Assets
- Status tracking: `AVAILABLE`, `CHECKED_OUT`, `IN_TRANSIT`, `ARCHIVED`
- Sensitivity levels: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- Associated with sites and current holder

### Custody Transactions
- Checkout, Return, Transfer, Inventory Close operations
- Each operation triggers policy evaluation
- Results stored in audit trail

### Audit Trail
- Immutable event log with chain verification
- Tracks: user actions, policy decisions, API calls
- Hash-based integrity verification

### Approvals
- Status: `PENDING`, `APPROVED`, `REJECTED`
- Multi-level approval workflows
- Audit trail included

## 🧪 Running Tests

```bash
pytest
```

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| fastapi | 0.109.0 | Web framework |
| uvicorn | 0.27.0 | ASGI server |
| sqlalchemy | 2.0.25 | ORM |
| pydantic | 2.5.3 | Data validation |
| python-jose | 3.3.0 | JWT tokens |
| passlib + bcrypt | Latest | Password security |
| httpx | 0.27.0 | Async HTTP client |

## 🦭 Podman Deployment

The repository includes containerization support via `deploy/` directory.

### Using Podman Compose

```bash
cd deploy
./deploy.sh start      # Start backend and frontend services
./deploy.sh stop       # Stop services
```

### Advanced Options

```bash
# Enable auto-restart on container failure
./deploy.sh enable-autorestart

# Disable auto-restart
./deploy.sh disable-autorestart

# Enable user lingering (for persistent services after logout)
sudo loginctl enable-linger $USER
```

**Note:** Container restart policies depend on Podman version. The deploy script uses `podman update --restart=...` with fallback support.

## 💡 Common Tasks

### Generate a new SECRET_KEY
```bash
openssl rand -hex 32
```

### Create admin user (via API)
```bash
curl -X POST "http://localhost:8000/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "role": "ADMIN"
  }'
```

### Check API health
```bash
curl http://localhost:8000/health
```

### View audit trail
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/audit/events
```

## 📖 Development Workflow

1. **Install in editable mode with dev dependencies**
   ```bash
   pip install -e ".[dev]"
   ```

2. **Format code** (if configured)
   ```bash
   black app/
   ```

3. **Lint** (if configured)
   ```bash
   pylint app/
   ```

4. **Run with reload**
   ```bash
   uvicorn main:app --reload --port 8000 --log-level debug
   ```

## ⚙️ Configuration Examples

### Development (Mock Mode)
```bash
GATEWAY_MODE=mock
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
```

### Production (Real Gateway)
```bash
GATEWAY_MODE=production
GATEWAY_CLIENT_ID=your-production-id
GATEWAY_CLIENT_SECRET=your-production-secret
CORS_ORIGINS=["https://yourdomain.com"]
```

## 🔐 Security Considerations

- **JWT Tokens**: Expiration set via `TOKEN_EXPIRE_MINUTES` env variable
- **Password Hashing**: bcrypt with salting (12 rounds)
- **CORS**: Configure `CORS_ORIGINS` for your environment
- **Database**: SQLite suitable for demo only; use PostgreSQL for production
- **Environment Variables**: Never commit `.env` file; use `.env.example` as template

## 🚨 Troubleshooting

### Database Connection Error
```
Error: [Errno 2] No such file or directory: 'data/geoctody.db'
```
**Solution**: Ensure `data/` directory exists (auto-created on startup)

### Port Already in Use
```bash
# Use different port
uvicorn main:app --port 8001
```

### CORS Errors
- Verify `CORS_ORIGINS` in `.env` includes your frontend URL
- Restart server after environment changes

### Authentication Failures
- Check JWT `SECRET_KEY` is set and consistent
- Verify token hasn't expired (`TOKEN_EXPIRE_MINUTES`)
- Ensure Authorization header format: `Bearer <token>`

## 📝 License

Demo project. Not for production use without proper security review and modifications.

---

**Built with FastAPI | Powered by Telefónica Open Gateway | Demo Application**

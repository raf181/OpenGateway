> **Note:**
> This README was generated with GitHub Copilot. It may not always be up to date or fully accurate—please verify details before relying on it for production or critical use.

# GeoCustody Backend

This is the backend service for the GeoCustody demo application. It is built with FastAPI and integrates with Telefónica OpenGateway APIs for network-based verification and custody workflows.

## Features

- FastAPI REST API for asset custody, user management, sites, approvals, and audit trail
- Integration with Telefónica OpenGateway (SIM swap, device swap, location verification, QoD profiles)
- Policy engine for step-up authentication and risk-based decisions
- Tamper-evident audit chain
- SQLite database for demo purposes

## Setup

### Prerequisites
- Python 3.12+
- (Optional) Virtual environment: `python -m venv venv`

### Installation
```bash
cd backend
pip install -r requirements.txt
```

### Configuration
Copy `.env.example` to `.env` and fill in your settings:
```bash
cp .env.example .env
```
Edit `.env` to set your database, JWT secret, and Telefónica OpenGateway credentials.

### Running the Server
```bash
uvicorn main:app --reload --port 8000
```
The API will be available at http://localhost:8000

## API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Key Environment Variables
- `GATEWAY_MODE`: mock | sandbox | production
- `GATEWAY_CLIENT_ID`, `GATEWAY_CLIENT_SECRET`: Telefónica OpenGateway credentials
- `DATABASE_URL`: SQLite connection string
- `SECRET_KEY`: JWT secret

## Main Directories
- `app/api/` - API route definitions
- `app/core/` - Config, security, database
- `app/models/` - SQLAlchemy models
- `app/schemas/` - Pydantic schemas
- `app/services/` - Business logic and Telefónica API integration

## Useful Commands
- Run server: `uvicorn main:app --reload --port 8000`
- Run tests: `pytest`

## License
Demo project. Not for production use.

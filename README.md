> **Note:**
> This README was generated with GitHub Copilot. It may not always be up to date or fully accurate—please verify details before relying on it for production or critical use.

# GeoCustody - Full-Stack Demo

GeoCustody is a personnel and inventory tracking + authorization system that enforces chain-of-custody and verified on-site actions using **Telefónica Open Gateway** network APIs.

## Process Overview
```mermaid
graph TD

    subgraph base.cv::frontend_boundary["**OpenGateway Frontend System**<br>[External]"]
        subgraph base.cv::spa["**Single Page Application**<br>frontend/App.jsx `App`, frontend/main.jsx `ReactDOM.createRoot`, frontend/index.html `<div id="root"></div>`"]
            base.cv::react_app["**React Application**<br>frontend/App.jsx `function App()`, frontend/main.jsx `ReactDOM.createRoot`"]
            base.cv::router_component["**Router Component**<br>frontend/main.jsx `BrowserRouter`, frontend/src/components/layouts/AppLayout.jsx, frontend/src/components/layouts/MarketingLayout.jsx"]
            base.cv::auth_context["**Auth Context**<br>frontend/src/contexts/AuthContext.jsx `AuthContext`"]
            base.cv::mock_network_context["**Mock Network Context**<br>frontend/src/contexts/MockNetworkContext.jsx `MockNetworkContext`"]
            base.cv::api_client["**API Client**<br>frontend/src/utils/api.js `fetch`"]
            base.cv::page_components["**Page Components**<br>frontend/src/pages/app/Login.jsx, frontend/src/pages/marketing/Landing.jsx, frontend/src/pages/app/admin/Users.jsx"]
            base.cv::shared_ui_components["**Shared UI Components**<br>frontend/src/components/Modal.jsx, frontend/src/components/MockNetworkPanel.jsx, frontend/src/components/layouts/AppLayout.jsx"]
            %% Edges at this level (grouped by source)
            base.cv::react_app["**React Application**<br>frontend/App.jsx `function App()`, frontend/main.jsx `ReactDOM.createRoot`"] -->|"Uses"| base.cv::router_component["**Router Component**<br>frontend/main.jsx `BrowserRouter`, frontend/src/components/layouts/AppLayout.jsx, frontend/src/components/layouts/MarketingLayout.jsx"]
            base.cv::router_component["**Router Component**<br>frontend/main.jsx `BrowserRouter`, frontend/src/components/layouts/AppLayout.jsx, frontend/src/components/layouts/MarketingLayout.jsx"] -->|"Renders"| base.cv::page_components["**Page Components**<br>frontend/src/pages/app/Login.jsx, frontend/src/pages/marketing/Landing.jsx, frontend/src/pages/app/admin/Users.jsx"]
            base.cv::page_components["**Page Components**<br>frontend/src/pages/app/Login.jsx, frontend/src/pages/marketing/Landing.jsx, frontend/src/pages/app/admin/Users.jsx"] -->|"Uses"| base.cv::shared_ui_components["**Shared UI Components**<br>frontend/src/components/Modal.jsx, frontend/src/components/MockNetworkPanel.jsx, frontend/src/components/layouts/AppLayout.jsx"]
            base.cv::page_components["**Page Components**<br>frontend/src/pages/app/Login.jsx, frontend/src/pages/marketing/Landing.jsx, frontend/src/pages/app/admin/Users.jsx"] -->|"Consumes"| base.cv::auth_context["**Auth Context**<br>frontend/src/contexts/AuthContext.jsx `AuthContext`"]
            base.cv::page_components["**Page Components**<br>frontend/src/pages/app/Login.jsx, frontend/src/pages/marketing/Landing.jsx, frontend/src/pages/app/admin/Users.jsx"] -->|"Consumes"| base.cv::mock_network_context["**Mock Network Context**<br>frontend/src/contexts/MockNetworkContext.jsx `MockNetworkContext`"]
            base.cv::page_components["**Page Components**<br>frontend/src/pages/app/Login.jsx, frontend/src/pages/marketing/Landing.jsx, frontend/src/pages/app/admin/Users.jsx"] -->|"Makes Requests via"| base.cv::api_client["**API Client**<br>frontend/src/utils/api.js `fetch`"]
            base.cv::shared_ui_components["**Shared UI Components**<br>frontend/src/components/Modal.jsx, frontend/src/components/MockNetworkPanel.jsx, frontend/src/components/layouts/AppLayout.jsx"] -->|"Consumes"| base.cv::auth_context["**Auth Context**<br>frontend/src/contexts/AuthContext.jsx `AuthContext`"]
            base.cv::shared_ui_components["**Shared UI Components**<br>frontend/src/components/Modal.jsx, frontend/src/components/MockNetworkPanel.jsx, frontend/src/components/layouts/AppLayout.jsx"] -->|"Consumes"| base.cv::mock_network_context["**Mock Network Context**<br>frontend/src/contexts/MockNetworkContext.jsx `MockNetworkContext`"]
        end
        subgraph base.cv::backend_boundary["**OpenGateway Backend System**<br>[External]"]
            base.cv::user["**End User**<br>[External]"]
            base.cv::frontend["**OpenGateway Frontend**<br>frontend/App.jsx `App`, frontend/main.jsx `ReactDOM.createRoot`, frontend/index.html `<div id="root"></div>`"]
            base.cv::backend["**OpenGateway Backend**<br>backend/main.py `app = FastAPI()`"]
            base.cv::telefonica_gateway["**Telefonica Gateway**<br>backend/app/services/telefonica_gateway.py `httpx.AsyncClient`"]
            subgraph base.cv::database["**Database**<br>backend/app/core/database.py `create_engine`"]
                base.cv::db_engine["**Database Engine**<br>backend/app/core/database.py `create_engine`"]
                base.cv::orm_models["**ORM Models**<br>backend/app/models/approval.py `Base`, backend/app/models/asset.py `Base`, backend/app/models/audit.py `Base`, backend/app/models/site.py `Base`, backend/app/models/user.py `Base`"]
                base.cv::session_manager["**Session Manager**<br>backend/app/core/database.py `SessionLocal`, backend/app/core/database.py `get_db`"]
                %% Edges at this level (grouped by source)
                base.cv::session_manager["**Session Manager**<br>backend/app/core/database.py `SessionLocal`, backend/app/core/database.py `get_db`"] -->|"Connects to"| base.cv::db_engine["**Database Engine**<br>backend/app/core/database.py `create_engine`"]
                base.cv::session_manager["**Session Manager**<br>backend/app/core/database.py `SessionLocal`, backend/app/core/database.py `get_db`"] -->|"Uses"| base.cv::orm_models["**ORM Models**<br>backend/app/models/approval.py `Base`, backend/app/models/asset.py `Base`, backend/app/models/audit.py `Base`, backend/app/models/site.py `Base`, backend/app/models/user.py `Base`"]
            end
            subgraph base.cv::fastapi_app["**FastAPI Application**<br>backend/main.py `app = FastAPI()`, backend/app/core/config.py `settings`"]
                base.cv::api_router_users["**Users API Router**<br>backend/app/api/users.py `router`"]
                base.cv::api_router_approvals["**Approvals API Router**<br>backend/app/api/approvals.py `router`"]
                base.cv::api_router_assets["**Assets API Router**<br>backend/app/api/assets.py `router`"]
                base.cv::api_router_audit["**Audit API Router**<br>backend/app/api/audit.py `router`"]
                base.cv::api_router_auth["**Auth API Router**<br>backend/app/api/auth.py `router`"]
                base.cv::api_router_custody["**Custody API Router**<br>backend/app/api/custody.py `router`"]
                base.cv::api_router_dashboard["**Dashboard API Router**<br>backend/app/api/dashboard.py `router`"]
                base.cv::api_router_opengateway["**OpenGateway API Router**<br>backend/app/api/opengateway.py `router`"]
                base.cv::api_router_sites["**Sites API Router**<br>backend/app/api/sites.py `router`"]
                base.cv::audit_service["**Audit Service**<br>backend/app/services/audit_service.py"]
                base.cv::custody_service["**Custody Service**<br>backend/app/services/custody_service.py"]
                base.cv::open_gateway_mock_service["**OpenGateway Mock Service**<br>backend/app/services/open_gateway_mock.py"]
                base.cv::policy_engine_service["**Policy Engine Service**<br>backend/app/services/policy_engine.py"]
                base.cv::telefonica_gateway_service["**Telefonica Gateway Service**<br>backend/app/services/telefonica_gateway.py"]
                base.cv::auth_manager["**Authentication/Authorization Manager**<br>backend/app/core/security.py `require_role`, backend/app/core/security.py `get_password_hash`"]
                base.cv::config_manager["**Configuration Manager**<br>backend/app/core/config.py `settings`"]
                %% Edges at this level (grouped by source)
                base.cv::api_router_users["**Users API Router**<br>backend/app/api/users.py `router`"] -->|"Uses"| base.cv::auth_manager["**Authentication/Authorization Manager**<br>backend/app/core/security.py `require_role`, backend/app/core/security.py `get_password_hash`"]
                base.cv::api_router_approvals["**Approvals API Router**<br>backend/app/api/approvals.py `router`"] -->|"Uses"| base.cv::auth_manager["**Authentication/Authorization Manager**<br>backend/app/core/security.py `require_role`, backend/app/core/security.py `get_password_hash`"]
                base.cv::api_router_assets["**Assets API Router**<br>backend/app/api/assets.py `router`"] -->|"Uses"| base.cv::auth_manager["**Authentication/Authorization Manager**<br>backend/app/core/security.py `require_role`, backend/app/core/security.py `get_password_hash`"]
                base.cv::api_router_audit["**Audit API Router**<br>backend/app/api/audit.py `router`"] -->|"Uses"| base.cv::auth_manager["**Authentication/Authorization Manager**<br>backend/app/core/security.py `require_role`, backend/app/core/security.py `get_password_hash`"]
                base.cv::api_router_audit["**Audit API Router**<br>backend/app/api/audit.py `router`"] -->|"Calls"| base.cv::audit_service["**Audit Service**<br>backend/app/services/audit_service.py"]
                base.cv::api_router_auth["**Auth API Router**<br>backend/app/api/auth.py `router`"] -->|"Uses"| base.cv::auth_manager["**Authentication/Authorization Manager**<br>backend/app/core/security.py `require_role`, backend/app/core/security.py `get_password_hash`"]
                base.cv::api_router_custody["**Custody API Router**<br>backend/app/api/custody.py `router`"] -->|"Uses"| base.cv::auth_manager["**Authentication/Authorization Manager**<br>backend/app/core/security.py `require_role`, backend/app/core/security.py `get_password_hash`"]
                base.cv::api_router_custody["**Custody API Router**<br>backend/app/api/custody.py `router`"] -->|"Calls"| base.cv::custody_service["**Custody Service**<br>backend/app/services/custody_service.py"]
                base.cv::api_router_dashboard["**Dashboard API Router**<br>backend/app/api/dashboard.py `router`"] -->|"Uses"| base.cv::auth_manager["**Authentication/Authorization Manager**<br>backend/app/core/security.py `require_role`, backend/app/core/security.py `get_password_hash`"]
                base.cv::api_router_opengateway["**OpenGateway API Router**<br>backend/app/api/opengateway.py `router`"] -->|"Uses"| base.cv::auth_manager["**Authentication/Authorization Manager**<br>backend/app/core/security.py `require_role`, backend/app/core/security.py `get_password_hash`"]
                base.cv::api_router_opengateway["**OpenGateway API Router**<br>backend/app/api/opengateway.py `router`"] -->|"Calls"| base.cv::open_gateway_mock_service["**OpenGateway Mock Service**<br>backend/app/services/open_gateway_mock.py"]
                base.cv::api_router_opengateway["**OpenGateway API Router**<br>backend/app/api/opengateway.py `router`"] -->|"Calls"| base.cv::telefonica_gateway_service["**Telefonica Gateway Service**<br>backend/app/services/telefonica_gateway.py"]
                base.cv::api_router_sites["**Sites API Router**<br>backend/app/api/sites.py `router`"] -->|"Uses"| base.cv::auth_manager["**Authentication/Authorization Manager**<br>backend/app/core/security.py `require_role`, backend/app/core/security.py `get_password_hash`"]
                base.cv::telefonica_gateway_service["**Telefonica Gateway Service**<br>backend/app/services/telefonica_gateway.py"] -->|"Uses"| base.cv::config_manager["**Configuration Manager**<br>backend/app/core/config.py `settings`"]
            end
            %% Edges at this level (grouped by source)
            base.cv::telefonica_gateway_service["**Telefonica Gateway Service**<br>backend/app/services/telefonica_gateway.py"] -->|"Makes API calls to"| base.cv::telefonica_gateway["**Telefonica Gateway**<br>backend/app/services/telefonica_gateway.py `httpx.AsyncClient`"]
            base.cv::telefonica_gateway_service["**Telefonica Gateway Service**<br>backend/app/services/telefonica_gateway.py"] -->|"Uses"| base.cv::session_manager["**Session Manager**<br>backend/app/core/database.py `SessionLocal`, backend/app/core/database.py `get_db`"]
            base.cv::api_router_users["**Users API Router**<br>backend/app/api/users.py `router`"] -->|"Uses"| base.cv::session_manager["**Session Manager**<br>backend/app/core/database.py `SessionLocal`, backend/app/core/database.py `get_db`"]
            base.cv::api_router_approvals["**Approvals API Router**<br>backend/app/api/approvals.py `router`"] -->|"Uses"| base.cv::session_manager["**Session Manager**<br>backend/app/core/database.py `SessionLocal`, backend/app/core/database.py `get_db`"]
            base.cv::api_router_assets["**Assets API Router**<br>backend/app/api/assets.py `router`"] -->|"Uses"| base.cv::session_manager["**Session Manager**<br>backend/app/core/database.py `SessionLocal`, backend/app/core/database.py `get_db`"]
            base.cv::api_router_audit["**Audit API Router**<br>backend/app/api/audit.py `router`"] -->|"Uses"| base.cv::session_manager["**Session Manager**<br>backend/app/core/database.py `SessionLocal`, backend/app/core/database.py `get_db`"]
            base.cv::api_router_auth["**Auth API Router**<br>backend/app/api/auth.py `router`"] -->|"Uses"| base.cv::session_manager["**Session Manager**<br>backend/app/core/database.py `SessionLocal`, backend/app/core/database.py `get_db`"]
            base.cv::api_router_custody["**Custody API Router**<br>backend/app/api/custody.py `router`"] -->|"Uses"| base.cv::session_manager["**Session Manager**<br>backend/app/core/database.py `SessionLocal`, backend/app/core/database.py `get_db`"]
            base.cv::api_router_dashboard["**Dashboard API Router**<br>backend/app/api/dashboard.py `router`"] -->|"Uses"| base.cv::session_manager["**Session Manager**<br>backend/app/core/database.py `SessionLocal`, backend/app/core/database.py `get_db`"]
            base.cv::api_router_opengateway["**OpenGateway API Router**<br>backend/app/api/opengateway.py `router`"] -->|"Uses"| base.cv::session_manager["**Session Manager**<br>backend/app/core/database.py `SessionLocal`, backend/app/core/database.py `get_db`"]
            base.cv::api_router_sites["**Sites API Router**<br>backend/app/api/sites.py `router`"] -->|"Uses"| base.cv::session_manager["**Session Manager**<br>backend/app/core/database.py `SessionLocal`, backend/app/core/database.py `get_db`"]
            base.cv::audit_service["**Audit Service**<br>backend/app/services/audit_service.py"] -->|"Uses"| base.cv::session_manager["**Session Manager**<br>backend/app/core/database.py `SessionLocal`, backend/app/core/database.py `get_db`"]
            base.cv::custody_service["**Custody Service**<br>backend/app/services/custody_service.py"] -->|"Uses"| base.cv::session_manager["**Session Manager**<br>backend/app/core/database.py `SessionLocal`, backend/app/core/database.py `get_db`"]
            base.cv::policy_engine_service["**Policy Engine Service**<br>backend/app/services/policy_engine.py"] -->|"Uses"| base.cv::session_manager["**Session Manager**<br>backend/app/core/database.py `SessionLocal`, backend/app/core/database.py `get_db`"]
        end
        %% Edges at this level (grouped by source)
        base.cv::user["**End User**<br>[External]"] -->|"Uses"| base.cv::spa["**Single Page Application**<br>frontend/App.jsx `App`, frontend/main.jsx `ReactDOM.createRoot`, frontend/index.html `<div id="root"></div>`"]
        base.cv::user["**End User**<br>[External]"] -->|"Uses"| base.cv::react_app["**React Application**<br>frontend/App.jsx `function App()`, frontend/main.jsx `ReactDOM.createRoot`"]
        base.cv::spa["**Single Page Application**<br>frontend/App.jsx `App`, frontend/main.jsx `ReactDOM.createRoot`, frontend/index.html `<div id="root"></div>`"] -->|"Makes API calls to"| base.cv::api_router_users["**Users API Router**<br>backend/app/api/users.py `router`"]
        base.cv::spa["**Single Page Application**<br>frontend/App.jsx `App`, frontend/main.jsx `ReactDOM.createRoot`, frontend/index.html `<div id="root"></div>`"] -->|"Makes API calls to"| base.cv::api_router_approvals["**Approvals API Router**<br>backend/app/api/approvals.py `router`"]
        base.cv::spa["**Single Page Application**<br>frontend/App.jsx `App`, frontend/main.jsx `ReactDOM.createRoot`, frontend/index.html `<div id="root"></div>`"] -->|"Makes API calls to"| base.cv::api_router_assets["**Assets API Router**<br>backend/app/api/assets.py `router`"]
        base.cv::spa["**Single Page Application**<br>frontend/App.jsx `App`, frontend/main.jsx `ReactDOM.createRoot`, frontend/index.html `<div id="root"></div>`"] -->|"Makes API calls to"| base.cv::api_router_audit["**Audit API Router**<br>backend/app/api/audit.py `router`"]
        base.cv::spa["**Single Page Application**<br>frontend/App.jsx `App`, frontend/main.jsx `ReactDOM.createRoot`, frontend/index.html `<div id="root"></div>`"] -->|"Makes API calls to"| base.cv::api_router_auth["**Auth API Router**<br>backend/app/api/auth.py `router`"]
        base.cv::spa["**Single Page Application**<br>frontend/App.jsx `App`, frontend/main.jsx `ReactDOM.createRoot`, frontend/index.html `<div id="root"></div>`"] -->|"Makes API calls to"| base.cv::api_router_custody["**Custody API Router**<br>backend/app/api/custody.py `router`"]
        base.cv::spa["**Single Page Application**<br>frontend/App.jsx `App`, frontend/main.jsx `ReactDOM.createRoot`, frontend/index.html `<div id="root"></div>`"] -->|"Makes API calls to"| base.cv::api_router_dashboard["**Dashboard API Router**<br>backend/app/api/dashboard.py `router`"]
        base.cv::spa["**Single Page Application**<br>frontend/App.jsx `App`, frontend/main.jsx `ReactDOM.createRoot`, frontend/index.html `<div id="root"></div>`"] -->|"Makes API calls to"| base.cv::api_router_opengateway["**OpenGateway API Router**<br>backend/app/api/opengateway.py `router`"]
        base.cv::spa["**Single Page Application**<br>frontend/App.jsx `App`, frontend/main.jsx `ReactDOM.createRoot`, frontend/index.html `<div id="root"></div>`"] -->|"Makes API calls to"| base.cv::api_router_sites["**Sites API Router**<br>backend/app/api/sites.py `router`"]
        base.cv::api_client["**API Client**<br>frontend/src/utils/api.js `fetch`"] -->|"Makes API calls to"| base.cv::api_router_users["**Users API Router**<br>backend/app/api/users.py `router`"]
        base.cv::api_client["**API Client**<br>frontend/src/utils/api.js `fetch`"] -->|"Makes API calls to"| base.cv::api_router_approvals["**Approvals API Router**<br>backend/app/api/approvals.py `router`"]
        base.cv::api_client["**API Client**<br>frontend/src/utils/api.js `fetch`"] -->|"Makes API calls to"| base.cv::api_router_assets["**Assets API Router**<br>backend/app/api/assets.py `router`"]
        base.cv::api_client["**API Client**<br>frontend/src/utils/api.js `fetch`"] -->|"Makes API calls to"| base.cv::api_router_audit["**Audit API Router**<br>backend/app/api/audit.py `router`"]
        base.cv::api_client["**API Client**<br>frontend/src/utils/api.js `fetch`"] -->|"Makes API calls to"| base.cv::api_router_auth["**Auth API Router**<br>backend/app/api/auth.py `router`"]
        base.cv::api_client["**API Client**<br>frontend/src/utils/api.js `fetch`"] -->|"Makes API calls to"| base.cv::api_router_custody["**Custody API Router**<br>backend/app/api/custody.py `router`"]
        base.cv::api_client["**API Client**<br>frontend/src/utils/api.js `fetch`"] -->|"Makes API calls to"| base.cv::api_router_dashboard["**Dashboard API Router**<br>backend/app/api/dashboard.py `router`"]
        base.cv::api_client["**API Client**<br>frontend/src/utils/api.js `fetch`"] -->|"Makes API calls to"| base.cv::api_router_opengateway["**OpenGateway API Router**<br>backend/app/api/opengateway.py `router`"]
        base.cv::api_client["**API Client**<br>frontend/src/utils/api.js `fetch`"] -->|"Makes API calls to"| base.cv::api_router_sites["**Sites API Router**<br>backend/app/api/sites.py `router`"]
    end

```

## 🌐 Telefónica Open Gateway Integration

This demo integrates with the [Telefónica Open Gateway](https://developers.opengateway.telefonica.com/) APIs for network-based verification:

| API | Endpoint | Purpose | Status |
|-----|----------|---------|--------|
| **SIM Swap Check** | `POST /sim-swap/v0/check` | Detect recent SIM card changes (fraud signal) | ✅ Working |
| **SIM Swap Retrieve** | `POST /sim-swap/v0/retrieve-date` | Get last SIM swap date | ✅ Working |
| **Device Swap Check** | `POST /device-swap/v0.1/check` | Detect recent device changes (fraud signal) | ✅ Working |
| **Device Swap Retrieve** | `POST /device-swap/v0.1/retrieve-date` | Get last device swap date | ✅ Working |
| **Location Verification** | `POST /location/v0/verify` | Verify device is within authorized geofence | ✅ Working |
| **QoD Profiles** | `GET /qod/v0/qos-profiles` | Get available Quality on Demand profiles | ✅ Working |
| **Number Verification** | `POST /number-verification/v0/verify` | Verify device phone number matches claimed identity | ⚠️ Requires Frontend Auth |
| **Roaming Status** | `POST /device-status/v0/roaming` | Check if device is roaming | ⚠️ Scope Not Enabled |

### API Test Results (Sandbox)

```
============================================================
TELEFONICA OPENGATEWAY API TEST SUMMARY
============================================================

1. SIM Swap Check         ✅ Working - Returns swap status
2. SIM Swap Retrieve      ✅ Working - Returns last swap date
3. Device Swap Check      ✅ Working - Returns swap status  
4. Device Swap Retrieve   ✅ Working - Returns last swap date
5. Location Verification  ✅ Working - Verifies device in area (max 200m accuracy)
6. QoD Profiles          ✅ Working - Returns available profiles
7. Number Verification   ⚠️ Requires mobile network authentication (frontend flow)
8. Roaming Status        ⚠️ Scope may need to be enabled in Developer Portal
============================================================
```

### OpenGateway REST API Endpoints

The backend exposes these endpoints at `/api/opengateway/`:

```
GET  /api/opengateway/status              - Gateway status and mode
POST /api/opengateway/sim-swap/check      - Check for recent SIM swap
POST /api/opengateway/sim-swap/retrieve   - Get last SIM swap date
POST /api/opengateway/device-swap/check   - Check for recent device swap
POST /api/opengateway/device-swap/retrieve - Get last device swap date
POST /api/opengateway/location/verify     - Verify device location
POST /api/opengateway/number/verify       - Verify phone number
POST /api/opengateway/roaming/status      - Get roaming status
GET  /api/opengateway/qod/profiles        - List QoS profiles
POST /api/opengateway/qod/sessions        - Create QoD session
GET  /api/opengateway/qod/sessions/{id}   - Get session details
POST /api/opengateway/qod/sessions/{id}/extend - Extend session
DELETE /api/opengateway/qod/sessions/{id} - Delete session
```

### Gateway Modes

The system supports three operation modes:

| Mode | Description | Use Case |
|------|-------------|----------|
| `mock` | Local mock using frontend panel | Development & demos |
| `sandbox` | Telefónica Sandbox APIs | Testing with real API structure |
| `production` | Telefónica Production APIs | Live deployment |

Configure via environment variable:

```bash
GATEWAY_MODE=mock  # or "sandbox" or "production"
```

### Sandbox Configuration

To use the Telefónica Sandbox APIs, create a `.env` file in the `backend/` directory:

```bash
# Gateway Mode
GATEWAY_MODE=sandbox

# Telefónica OpenGateway Credentials (from Developer Portal)
GATEWAY_CLIENT_ID=your-client-id-here
GATEWAY_CLIENT_SECRET=your-client-secret-here

# Optional: Override base URL (defaults to sandbox URL)
# GATEWAY_BASE_URL=https://sandbox.opengateway.telefonica.com/apigateway
```

Get your credentials from the [Telefónica Developer Portal](https://developers.opengateway.telefonica.com/docs/sandbox).

### Authentication Flow (CIBA)

The integration uses **Client-Initiated Backchannel Authentication (CIBA)** OAuth flow:

1. `POST /bc-authorize` with `login_hint=tel:+<phone>` and scope
2. `POST /token` with `auth_req_id` to get access token
3. Use Bearer token for API calls

This allows backend authentication without requiring the end-user's browser.

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
│   │       ├── telefonica_gateway.py  # Open Gateway client
│   │       ├── policy_engine.py       # Authorization rules
│   │       └── custody_service.py     # Custody workflows
│   ├── data/               # SQLite database (auto-created)
│   ├── main.py             # FastAPI application entry
│   ├── requirements.txt
│   └── .env.example        # Environment configuration template
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth, MockNetwork)
│   │   ├── pages/          # Page components
│   │   └── utils/          # API utilities
│   ├── package.json
│   └── vite.config.js
├── API-Docs/               # Telefónica API documentation
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

## 🚦 Current Integrations Status

| Integration                | Status      | Notes |
|---------------------------|-------------|-------|
| **SIM Swap Check/Retrieve**    | ✅ Working  | Real Telefónica API (sandbox) |
| **Device Swap Check/Retrieve** | ✅ Working  | Real Telefónica API (sandbox) |
| **Location Verification**      | ✅ Working  | Real Telefónica API (sandbox, max 200m accuracy) |
| **QoD Profiles**               | ✅ Working  | Real Telefónica API (sandbox) |
| **Number Verification**        | ⚠️ Skipped  | Requires mobile network auth (frontend flow only) |
| **Roaming Status**             | ⚠️ Not enabled | Scope not available in sandbox app |

All working integrations use Telefónica's sandbox API endpoints. Number Verification and Roaming require additional setup or frontend user authentication.

## License

Demo project - Not for production use.

```sh
npm run dev
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
```

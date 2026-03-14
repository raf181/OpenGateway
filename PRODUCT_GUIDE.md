# GeoCustody Product Guide

This document describes the current GeoCustody product implementation in this repository and explains how to run and use it.

## 1. Product Summary

GeoCustody is a full-stack demo application for asset custody control. It combines:

- inventory and custody tracking
- role-based approvals
- tamper-evident audit logging
- network-based verification through Telefonica Open Gateway

The core idea is simple: before a person can check out, return, transfer, or close inventory on an asset, the system verifies who they are, whether they are where they are supposed to be, and whether there are fraud-risk signals on the mobile line or device being used.

GeoCustody is built as a demo platform, but the code already models the main operational workflow of a controlled chain-of-custody system.

## 2. What Problem It Solves

Many inventory systems can record that an action happened, but they cannot prove enough about the context of that action. GeoCustody is designed to improve that by combining:

- who performed the action
- what asset was involved
- where the device was located
- whether the device identity looked suspicious
- whether the action should be allowed, denied, or escalated
- whether the event trail has been tampered with afterward

This makes the product suitable for demos involving:

- warehouse tools and service kits
- regulated inventory
- data center hardware
- medical devices
- construction equipment
- sensitive field assets

## 3. Core Capabilities

GeoCustody currently implements the following product capabilities:

### Asset custody operations

- Check out an available asset
- Return a checked-out asset
- Transfer custody of an asset to another user
- Record an inventory-close event

### Governance and authorization

- JWT login
- Role-based access control
- Manager/admin approval workflow for step-up decisions
- Policy evaluation based on asset sensitivity and network verification results

### Audit and compliance

- Event log for every custody decision
- Hash-linked audit chain for tamper evidence
- Chain integrity verification endpoint and UI action
- Per-asset and global audit browsing

### Open Gateway integration

- Number verification
- Device location verification against a geofence
- SIM swap detection
- Device swap detection
- Roaming status lookup
- QoD profile and session endpoints

### Demo support

- Mock mode controlled from the frontend
- Sandbox mode for Telefonica integration testing
- Production mode for live Telefonica APIs
- Seeded users, sites, and assets for immediate demos

## 4. Roles and Permissions

The product has three roles.

### Employee

- Can log in
- Can browse assets
- Can open asset detail pages
- Can attempt checkout, return, and transfer actions
- Can view audit history

### Manager

- Has employee capabilities
- Can review pending approval requests
- Can approve or reject step-up actions
- Can view approval history

### Admin

- Has manager capabilities
- Can manage users
- Can manage sites and geofences
- Can manage assets
- Can view the admin dashboard
- Can view the policy reference page

## 5. How Authorization Decisions Work

GeoCustody uses a policy engine in the backend to decide whether an action is:

- `ALLOW`
- `DENY`
- `STEP_UP`

`STEP_UP` means the action is not executed immediately and must be approved by a manager or admin.

### Current policy rules

The implemented rules are:

1. If phone number verification fails, deny the action.
2. If the site requires on-site presence and the device is outside the geofence:
   - low-sensitivity assets -> `STEP_UP`
   - medium/high-sensitivity assets -> `DENY`
3. If the asset is high sensitivity and either SIM swap or device swap is recent, require `STEP_UP`.
4. If the asset is medium sensitivity and SIM swap is recent, require `STEP_UP`.
5. Otherwise, allow the action.

### Practical meaning

- Low-sensitivity assets are the most forgiving.
- Medium-sensitivity assets still require caution when SIM swap is detected.
- High-sensitivity assets are most tightly controlled.
- A number mismatch is a hard fail for all assets.

## 6. Open Gateway Verification Model

GeoCustody is designed around Telefonica Open Gateway APIs.

### Supported modes

| Mode | Purpose | Behavior |
| --- | --- | --- |
| `mock` | local demos and development | verification results come from the frontend mock panel |
| `sandbox` | real API integration testing | backend performs CIBA OAuth and calls Telefonica sandbox APIs |
| `production` | live deployment | backend calls Telefonica production APIs |

### Verifications used during custody actions

For custody workflows, the backend performs a combined verification that includes:

- number verification
- location verification against the selected site geofence
- SIM swap status
- device swap status

The verification summary is stored with the resulting audit event and, for step-up flows, with the approval request.

### Extra Open Gateway endpoints exposed by the backend

The backend also exposes standalone API routes for:

- gateway status
- number verification
- location verification
- SIM swap check and retrieve
- device swap check and retrieve
- roaming status
- QoD profile listing
- QoD session create/get/extend/delete

## 7. Product Architecture

### Frontend

- React 18 SPA
- Vite build
- React Router navigation
- Tailwind CSS styling
- Auth context for JWT session state
- Mock network context for local verification simulation

### Backend

- FastAPI
- SQLAlchemy
- SQLite by default
- Pydantic request/response validation
- JWT auth with bcrypt password hashing

### Deployment

- Local developer mode with backend + frontend
- Podman-based container deployment in `deploy/`
- Optional Cloudflare Tunnel support
- Optional Prometheus/Grafana monitoring profile

## 8. Seeded Demo Data

On backend startup, the app creates tables and seeds sample data if the database is empty.

### Seeded users

| Role | Email | Password | Phone |
| --- | --- | --- | --- |
| Admin | `admin@geocustody.com` | `admin123` | `+34600000001` |
| Manager | `manager@geocustody.com` | `manager123` | `+34600000002` |
| Employee | `john@geocustody.com` | `employee123` | `+34600000003` |
| Employee | `jane@geocustody.com` | `employee123` | `+34600000004` |

### Seeded sites

- `Main Warehouse` - geofence radius `200m`
- `Field Office North` - geofence radius `150m`

Both seeded sites currently require on-site presence.

### Seeded assets

The seed includes 12 assets across low, medium, and high sensitivity levels, including:

- `TOOL-001` Power Drill
- `EQUIP-001` Diagnostic Scanner
- `DEVICE-001` Network Analyzer
- `DEVICE-002` Security Token Generator
- `DEVICE-003` Encryption Module
- `MED-001` Medical Monitor

All seeded assets start in `AVAILABLE` state.

## 9. Running the Product

### 9.1 Backend local run

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

Recommended local settings in `backend/.env`:

```env
DEBUG=true
GATEWAY_MODE=mock
```

Use `sandbox` or `production` only when you already have valid Telefonica credentials configured.

Backend defaults:

- API root: `http://localhost:8000`
- health check: `http://localhost:8000/health`
- docs: `http://localhost:8000/docs` when `DEBUG=true`

### 9.2 Frontend local run

```bash
cd frontend
npm install
npm run dev
```

Frontend default dev URL:

- `http://localhost:5173`

The Vite dev server already proxies `/api` requests to `http://127.0.0.1:8000`.

### 9.3 Container deployment

From the repository root:

```bash
cd deploy
cp .env.example .env
./deploy.sh start
```

Default containerized access:

- app UI: `http://127.0.0.1:8080`
- optional Prometheus/Grafana ports are configured in `deploy/.env`

## 10. How to Use the Product

### 10.1 Login

1. Open the app.
2. Go to the login page.
3. Use one of the seeded demo accounts.
4. After login, the app redirects by role:
   - admin -> admin dashboard
   - manager -> approvals page
   - employee -> employee dashboard

Note: most of the in-app UI is written in Spanish.

### 10.2 Employee workflow

Typical employee usage:

1. Open `Activos` or `Escanear activo`.
2. Search by asset tag or use a sample tag such as `TOOL-001`, `EQUIP-001`, or `DEVICE-001`.
3. Open the asset detail page.
4. Choose an action:
   - `Retirar` for checkout
   - `Devolver` for return
   - `Transferir` for transfer
5. Select the site involved in the action.
6. Submit the action and review the decision result.

Possible outcomes:

- `ALLOW`: the asset state changes immediately
- `STEP_UP`: a manager approval request is created
- `DENY`: the action is rejected and only the audit record is written

### 10.3 Manager workflow

Typical manager usage:

1. Log in as the manager account.
2. Open `Solicitudes de aprobacion`.
3. Review pending requests created by step-up decisions.
4. Approve or reject the request.

If approved:

- the original custody action is executed
- the approval is marked resolved
- a follow-up audit event is written with decision `ALLOW`

If rejected:

- the asset state does not change
- the approval is marked rejected
- a follow-up audit event is written with decision `DENY`

### 10.4 Admin workflow

Typical admin usage:

1. Review the admin dashboard for asset, user, and site counts.
2. Open `Gestion de activos` to create, edit, or delete assets.
3. Open `Gestion de sitios` to define site coordinates and geofence radius.
4. Open `Gestion de usuarios` to create users and assign roles.
5. Open `Configuracion de politicas` to review the current policy model.

Important: the policy page is informational in the current implementation. It does not edit backend policy rules.

### 10.5 Audit workflow

Any authenticated user can use the audit page to:

- browse custody events
- filter by event type and decision
- inspect verification results stored with each event
- view current and previous event hashes
- trigger a full audit-chain verification

This demonstrates that the event log is not just chronological, but also tamper-evident.

### 10.6 Mock mode workflow

When `GATEWAY_MODE=mock`, the floating button in the frontend opens the simulated network panel.

From that panel you can change:

- claimed phone number
- network phone number
- network latitude/longitude
- SIM swap flag
- device swap flag

This lets you force different outcomes for demos.

Examples:

- set claimed and network phone numbers to different values -> action should be denied
- move the device outside the site geofence for a low-sensitivity asset -> step-up approval
- enable SIM swap for a medium-sensitivity asset -> step-up approval
- enable device swap for a high-sensitivity asset -> step-up approval

The floating button color also indicates gateway mode:

- orange -> mock mode
- green -> real Telefonica API mode

## 11. Data Model Overview

### Users

Users have:

- email and password hash
- full name
- role
- phone number
- home site

### Sites

Sites have:

- name and address
- latitude/longitude
- geofence radius in meters
- on-site requirement flag

### Assets

Assets have:

- tag ID
- name and description
- sensitivity level: `LOW`, `MEDIUM`, `HIGH`
- status: `AVAILABLE`, `CHECKED_OUT`, `MAINTENANCE`, `RETIRED`
- assigned site
- current custodian

### Approval requests

Approval requests store:

- original action
- requester
- asset
- optional transfer target
- verification summary
- human-readable reason
- resolution status and note

### Audit events

Audit events store:

- action
- decision
- actor
- asset
- site
- optional target user
- optional approval ID
- verification summary
- `prev_hash`
- `hash`

## 12. API Summary

The backend API is rooted at `/api`.

Main route groups:

- `/api/auth` - login and current-user lookup
- `/api/users` - admin user management
- `/api/sites` - site CRUD
- `/api/assets` - asset list/detail/history/tag lookup/CRUD
- `/api/custody` - checkout, return, transfer, inventory close
- `/api/approvals` - list and process approval requests
- `/api/audit` - event browsing and chain verification
- `/api/dashboard` - dashboard stats and gateway status
- `/api/opengateway` - Open Gateway integration endpoints

## 13. Demo Boundaries and Current Limitations

This repository is a strong functional demo, but some parts are intentionally simplified.

- The QR scanner page is a placeholder; manual tag entry is the working path.
- The policy page is read-only.
- SQLite is the default database.
- Demo data is seeded automatically on first startup.
- Mock mode is the easiest way to demonstrate policy branching without live Telefonica credentials.
- OpenAPI docs are disabled unless `DEBUG=true`.
- The UI is production-styled, but the product scope is still demo-oriented rather than a finished enterprise release.

## 14. Recommended Demo Script

If you need to show the product to someone quickly, this is the cleanest walkthrough:

1. Start the app in mock mode.
2. Log in as `john@geocustody.com`.
3. Open `DEVICE-001` or `EQUIP-001`.
4. Use the mock network panel to create a risky condition.
5. Attempt checkout and show the `STEP_UP` or `DENY` result.
6. Log in as `manager@geocustody.com`.
7. Approve the pending request.
8. Open the audit page and verify the chain.
9. Log in as `admin@geocustody.com` and show user/site/asset administration.

This sequence demonstrates:

- role-based access
- asset workflows
- policy enforcement
- Open Gateway-driven verification logic
- approvals
- audit integrity

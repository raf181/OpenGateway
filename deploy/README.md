# GeoCustody Deployment

Deploy GeoCustody with **Podman**.

Note: the `cloudflared` container image is pulled from `docker.io/cloudflare/cloudflared:latest` because the `registry.access.redhat.com/cloudflare/cloudflared` repository is not publicly available.

## Services Overview

| Service | Container name | Image | Port (host) | Purpose |
|---------|---------------|-------|-------------|---------|
| **Backend** | `geocustody-backend` | Python 3.12-slim (built) | — | FastAPI app, SQLite, Telefónica API |
| **Frontend** | `geocustody-frontend` | nginx:alpine (built) | `127.0.0.1:8080` | React SPA + reverse proxy to backend |
| **Cloudflare Tunnel** | `geocustody-tunnel` | `cloudflare/cloudflared` | — | Optional secure HTTPS without port-forwarding |
| **Prometheus** *(monitoring)* | `geocustody-prometheus` | `prom/prometheus:v2.51.2` | `127.0.0.1:9090` | Metric collection |
| **Grafana** *(monitoring)* | `geocustody-grafana` | `grafana/grafana:10.4.2` | `127.0.0.1:3000` | Dashboards |
| **nginx-exporter** *(monitoring)* | `geocustody-nginx-exporter` | `nginx/nginx-prometheus-exporter:1.1.0` | — | Translates nginx stub_status → Prometheus |

> Monitoring containers are **optional** — use the `monitoring` Compose profile to enable them.

---

## Network Architecture

```
                        Internet
                           │
              ┌────────────┴────────────┐
              │         edge-net        │  (regular bridge — internet capable)
              │   backend   cloudflared │
              └────────────┬────────────┘
                           │  app-net (internal bridge — NO internet)
              ┌────────────┴────────────────────────────────┐
              │  backend  frontend  prometheus  grafana      │
              │           nginx-exporter                     │
              └──────────────────────────────────────────────┘
                           │
                    127.0.0.1:8080
                    (host localhost only)
```

### Network segmentation rationale

| Network | `internal` | Who uses it | Why |
|---------|-----------|-------------|-----|
| `app-net` | **true** | All app + monitoring containers | No outbound internet. If a container is compromised, an attacker cannot reach external hosts or the host LAN through this network. |
| `edge-net` | false | `backend`, `cloudflared` | Backend needs internet for Telefónica API calls; cloudflared connects to Cloudflare's edge. |

---

## 🦭 Podman Deployment

> **Note:** This documentation was generated with AI. Please verify details before relying on it for production or critical use.

Deploy GeoCustody with Podman — no Node.js or Python installation required. Everything runs inside containers.

### Podman Prerequisites

**Linux (Fedora/RHEL):**
```bash
sudo dnf install podman podman-compose -y
```

If `dnf` fails because `docker-ce-stable` metadata returns 404, install with that repo disabled:

```bash
sudo dnf install --disablerepo=docker-ce-stable podman podman-compose -y
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install podman podman-compose -y
```

**macOS:**
```bash
brew install podman podman-compose
podman machine init
podman machine start
```

### Quick Start

```bash
cd deploy

# 1. Configure environment
cp .env.example .env
nano .env  # Edit with your settings

# 2. Make script executable and start
chmod +x deploy.sh
./deploy.sh start

# 3. Access the app
open http://localhost:8080
```

### Podman Commands (via deploy.sh)

```bash
./deploy.sh start    # Start all containers
./deploy.sh stop     # Stop all containers
./deploy.sh restart  # Restart all containers
./deploy.sh test     # Run deployment test and auto-restart failed services
./deploy.sh logs     # View all logs
./deploy.sh logs backend   # Backend logs only
./deploy.sh logs frontend  # Frontend logs only (JSON access log)
./deploy.sh build    # Rebuild containers
./deploy.sh status   # Show container status and mode
./deploy.sh mode mock       # Switch to demo mode
./deploy.sh mode sandbox    # Switch to Telefónica sandbox

# Optional monitoring stack
./deploy.sh monitoring start  # Start Prometheus + Grafana + nginx-exporter
./deploy.sh monitoring stop   # Stop monitoring containers
./deploy.sh monitoring logs   # Tail monitoring logs
```

`./deploy.sh start` and `./deploy.sh restart` now run the same deployment test automatically after containers come up. The test validates container health and key HTTP endpoints, and attempts to restart failed services once before reporting failure.

When Cloudflare tunnel is enabled, the test also verifies `https://${TUNNEL_HOSTNAME}` and attempts to restart the `cloudflared` service if the public endpoint fails.

---

## ⚙️ Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Gateway Mode (choose one)
GATEWAY_MODE=mock              # Demo with simulated responses
# GATEWAY_MODE=sandbox         # Telefónica OpenGateway sandbox
# GATEWAY_MODE=production      # Live API (use with caution)

# Telefónica Credentials (required for sandbox/production)
# Get from: https://opengateway.telefonica.com/
GATEWAY_CLIENT_ID=your-client-id
GATEWAY_CLIENT_SECRET=your-client-secret

# Application Security — generate with:
# python3 -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=your-secure-random-string-here

# Disable Swagger UI in production (default: false)
DEBUG=false

# Cloudflare Tunnel (optional - for public HTTPS access)
CLOUDFLARE_TUNNEL_TOKEN=your-tunnel-token
TUNNEL_HOSTNAME=geocustody.example.com

# Optional monitoring stack credentials
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=your-grafana-password
```

---

## 📊 Connection Monitoring (optional)

The monitoring Compose profile adds:

| Tool | URL | What it shows |
|------|-----|---------------|
| **Prometheus** | `http://localhost:9090` | Raw time-series metrics, query interface |
| **Grafana** | `http://localhost:3000` | Dashboards for nginx traffic, request rates, error rates |
| **nginx-exporter** | *(internal)* | nginx active connections, accepted/handled requests, reading/writing/waiting states |

Grafana is pre-provisioned on startup with:
- A Prometheus datasource (`Prometheus`)
- A default dashboard folder (`GeoCustody`)
- Dashboard: `GeoCustody Monitoring Overview`

### Enable monitoring

```bash
# Start everything including monitoring
./deploy.sh monitoring start

# Or set in .env and use normal start:
# COMPOSE_PROFILES=monitoring
./deploy.sh start
```

### Add Prometheus as Grafana data source

1. Open `http://localhost:3000` → login with `GRAFANA_ADMIN_USER` / `GRAFANA_ADMIN_PASSWORD`
2. **Connections → Data sources → Add data source → Prometheus**
3. URL: `http://geocustody-prometheus:9090`
4. Click **Save & test**

Useful Prometheus queries:
```promql
# Total HTTP requests to nginx
nginx_http_requests_total

# Active connections
nginx_connections_active

# Request rate (per second, 5-min window)
rate(nginx_http_requests_total[5m])
```

### nginx JSON access logs

Every request is logged in structured JSON to stdout:

```bash
# Live tail of all nginx access logs
podman logs -f geocustody-frontend

# Pretty-print with jq
podman logs geocustody-frontend 2>/dev/null | jq .

# Filter only 4xx/5xx errors
podman logs geocustody-frontend 2>/dev/null | jq 'select(.status >= 400)'

# Show requests by source IP
podman logs geocustody-frontend 2>/dev/null | jq -r .remote_addr | sort | uniq -c | sort -rn
```

---

## 🌐 Cloudflare Tunnel Setup (Optional)

For secure public HTTPS access without opening ports:

1. Create a [Cloudflare account](https://cloudflare.com) (free tier works)
2. Go to [Zero Trust Dashboard](https://one.dash.cloudflare.com/)
3. Navigate to **Networks → Tunnels**
4. Click **Create a tunnel**
5. Choose **Cloudflared** connector
6. Copy the tunnel token to your `.env`:
   ```bash
   CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoiY...
   ```
7. Configure public hostname:
   - **Type:** HTTP
   - **URL:** `geocustody-frontend:80`  ← use the container name, **not** `localhost`

> **Important:** The `cloudflared` container connects to the `geocustody-frontend` container directly via the internal `app-net` network.  The origin must be `geocustody-frontend:80` (not `localhost:8080`).

### Troubleshooting 502 on public hostname

If `https://your-hostname` returns `502` from Cloudflare while `http://localhost:8080` works locally, your tunnel ingress is usually pointing to the wrong origin.

Check tunnel logs:

```bash
podman logs geocustody-tunnel | grep -E "Updated to new configuration|service"
```

If you see `"service":"http://localhost:8080"`, fix the Cloudflare tunnel public hostname origin to:

```text
http://geocustody-frontend:80
```

Then restart the stack:

```bash
./deploy.sh restart
```

### QUIC UDP Buffer Tuning (recommended)

If host UDP buffers are too small, cloudflared can log degraded QUIC performance or unstable tunnel behavior.

Check current values:

```bash
sysctl net.core.rmem_max net.core.wmem_max
```

Apply recommended values immediately:

```bash
sudo sysctl -w net.core.rmem_max=7500000
sudo sysctl -w net.core.wmem_max=7500000
```

Persist across reboots:

```bash
sudo tee /etc/sysctl.d/99-cloudflared.conf >/dev/null <<'EOF'
net.core.rmem_max=7500000
net.core.wmem_max=7500000
EOF
sudo sysctl --system
```

`./deploy.sh status`, `./deploy.sh start`, `./deploy.sh restart`, and `./deploy.sh test` now warn if these values are below the recommended threshold while Cloudflare tunnel is enabled.

---

## 📁 File Structure

```
deploy/
├── .env.example           # Template environment file
├── .env                   # Your local config (not committed)
├── podman-compose.yml     # Container orchestration
├── deploy.sh              # Helper script for Podman
├── backend.Containerfile  # Backend container definition
├── frontend.Containerfile # Frontend container definition
├── nginx.conf             # Hardened nginx config (security headers, rate limiting)
├── prometheus.yml         # Prometheus scrape config (monitoring profile)
├── data/                  # SQLite database (created automatically)
└── README.md              # This file
```

---

## 🔒 Security Hardening Summary

| Layer | Measure | Details |
|-------|---------|---------|
| **Container user** | Non-root | Backend runs as `appuser` (UID 1001) |
| **Filesystem** | Read-only root FS | `read_only: true` + tmpfs for writable dirs |
| **Privileges** | No privilege escalation | `no-new-privileges: true` on all containers |
| **Resources** | CPU + memory limits | Prevents resource exhaustion / DoS |
| **Network** | Dual-network segmentation | `app-net` (internal, no internet) + `edge-net` (internet for backend/cloudflared only) |
| **Port binding** | Localhost only | Frontend bound to `127.0.0.1:8080` (not `0.0.0.0`) |
| **nginx** | Security headers | `X-Frame-Options: DENY`, `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` |
| **nginx** | Rate limiting | API: 30 req/min; Auth: 5 req/min (brute-force protection) |
| **nginx** | Server version hidden | `server_tokens off` |
| **API** | Swagger disabled in prod | `/docs`, `/redoc`, `/openapi.json` only available when `DEBUG=true` |
| **JWT** | Strong secret required | `SECRET_KEY` must be set to a random 64-char hex string |

### Post-deployment recommendations

```bash
# 1. Verify no container is running as root
podman ps -q | xargs -I{} podman inspect {} --format '{{.Name}}: User={{.Config.User}}'

# 2. Check open ports (should only see 127.0.0.1:8080)
ss -tlnp | grep podman

# 3. Confirm read-only root filesystems
podman inspect geocustody-backend --format '{{.HostConfig.ReadonlyRootfs}}'
podman inspect geocustody-frontend --format '{{.HostConfig.ReadonlyRootfs}}'

# 4. Test rate limiting (expect 429 after 5 rapid login requests)
for i in $(seq 1 7); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST http://localhost:8080/api/auth/login \
    -H 'Content-Type: application/json' \
    -d '{"username":"test","password":"test"}'
done
```

---

## 🐛 Troubleshooting

### Containers won't start

```bash
./deploy.sh logs backend
./deploy.sh logs frontend
```

### Permission issues (Podman/SELinux)

The compose file uses `:Z` suffix for proper SELinux labeling.  `deploy.sh`
uses `podman unshare chown` to set the correct UID mapping for the data
directory without making it world-writable.

If you still have issues:

```bash
# Re-run the script — it re-applies the correct ownership automatically
./deploy.sh start

# Or manually fix ownership in the Podman user namespace
podman unshare chown 1001:1001 deploy/data
```

### Frontend shows blank page

Check that the build completed successfully:

```bash
./deploy.sh logs frontend | grep -i error

# Rebuild frontend
./deploy.sh build
./deploy.sh restart
```

### Port already in use

```bash
# Check what's using port 8080
sudo lsof -i :8080

# Use a different port (edit podman-compose.yml)
# Change "127.0.0.1:8080:80" to "127.0.0.1:3000:80" or another available port
```

### Reset everything

```bash
./deploy.sh reset-db
./deploy.sh start
```

---

## 🔄 Updating

After pulling new code:

```bash
./deploy.sh build
./deploy.sh restart
```

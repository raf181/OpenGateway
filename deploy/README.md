# GeoCustody Deployment

Deploy GeoCustody with **Docker**, **Podman**, or **manually**. Choose the method that best fits your infrastructure.

## What's Included

| Service | Description | Port |
|---------|-------------|------|
| **Backend** | Python FastAPI with SQLite | 8000 |
| **Frontend** | React app (Vite dev server or built Nginx) | 5173 / 8080 |
| **Cloudflare Tunnel** | Secure HTTPS access (optional) | — |

---

## 🐳 Docker Deployment

> **Note:** This documentation was generated with AI. Please verify details before relying on it for production or critical use.

Deploy GeoCustody with Docker — no Node.js or Python installation required. Everything runs inside containers.

### Docker Prerequisites

**Linux (Ubuntu/Debian):**
```bash
sudo apt update && sudo apt install docker.io docker-compose-plugin -y
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
# Log out and back in for group changes
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install docker docker-compose-plugin -y
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```

**macOS:**
```bash
# Install Docker Desktop: https://docker.com/products/docker-desktop
# Or via Homebrew:
brew install --cask docker
```

**Windows:**
- Install [Docker Desktop](https://docker.com/products/docker-desktop)
- Enable WSL 2 backend for best performance

### Quick Start

```bash
cd deploy

# 1. Configure environment
cp .env.example .env
nano .env  # Edit with your settings

# 2. Build and start
docker compose up -d --build

# 3. Access the app
open http://localhost:8080
```

### Docker Commands

```bash
# Start/Stop/Restart
docker compose up -d          # Start all services
docker compose down           # Stop all services
docker compose restart        # Restart all services

# Logs
docker compose logs -f        # Follow all logs
docker compose logs backend   # Backend logs only
docker compose logs frontend  # Frontend logs only

# Rebuild after code changes
docker compose build --no-cache
docker compose up -d

# Full reset (removes database)
docker compose down -v
docker compose up -d --build
```

---

## 🦭 Podman Deployment

> **Note:** This documentation was generated with AI. Please verify details before relying on it for production or critical use.

Deploy GeoCustody with Podman — no Node.js or Python installation required. Everything runs inside containers.

### Podman Prerequisites

**Linux (Fedora/RHEL):**
```bash
sudo dnf install podman podman-compose -y
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
./deploy.sh logs     # View all logs
./deploy.sh logs backend   # Backend logs only
./deploy.sh logs frontend  # Frontend logs only
./deploy.sh build    # Rebuild containers
./deploy.sh status   # Show container status and mode
./deploy.sh mode mock       # Switch to demo mode
./deploy.sh mode sandbox    # Switch to Telefónica sandbox
```

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

# Application Security
SECRET_KEY=your-secure-random-string-here

# Cloudflare Tunnel (optional - for public HTTPS access)
CLOUDFLARE_TUNNEL_TOKEN=your-tunnel-token
TUNNEL_HOSTNAME=geocustody.example.com
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Cloudflare Tunnel (optional)                │
│               Secure HTTPS without port forwarding       │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Frontend (nginx)                       │
│                    Port 8080 → 80                        │
│         Serves React app + proxies /api to backend       │
└─────────────────────────┬───────────────────────────────┘
                          │ /api/*
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend (FastAPI)                      │
│                      Port 8000                           │
│              SQLite database + API logic                 │
└─────────────────────────────────────────────────────────┘
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
   - **URL:** `frontend:80`

---

## 📁 File Structure

```
deploy/
├── .env.example           # Template environment file
├── .env                   # Your local config (not committed)
├── docker-compose.yml     # Symlink to podman-compose.yml
├── podman-compose.yml     # Container orchestration (works with both)
├── deploy.sh              # Helper script for Podman
├── backend.Containerfile  # Backend container definition
├── frontend.Containerfile # Frontend container definition
├── nginx.conf             # Nginx configuration for frontend
├── data/                  # SQLite database (created automatically)
└── README.md              # This file
```

---

## 🔒 Security Notes

- Never commit `.env` files with real credentials
- The `.env` file is in `.gitignore`
- SQLite database is stored in a Docker/Podman volume
- Cloudflare Tunnel provides HTTPS automatically
- Backend is not directly exposed to the internet

---

## 🐛 Troubleshooting

### Containers won't start

```bash
# Docker
docker compose logs backend
docker compose logs frontend

# Podman
./deploy.sh logs backend
./deploy.sh logs frontend
```

### Permission issues (Podman/SELinux)

The compose file uses `:Z` suffix for proper SELinux labeling. If you still have issues:

```bash
# Check if data directory exists and is writable
ls -la deploy/data/

# Recreate with proper permissions
rm -rf deploy/data/
./deploy.sh start
```

### Port already in use

```bash
# Check what's using port 8080
sudo lsof -i :8080

# Use a different port (edit podman-compose.yml)
# Change "8080:80" to "3000:80" or another available port
```

### Reset everything

```bash
# Docker
docker compose down -v
docker compose up -d --build

# Podman
./deploy.sh stop
podman volume rm deploy_geocustody-data
./deploy.sh start
```

### Frontend shows blank page

Check that the build completed successfully:

```bash
# Docker
docker compose logs frontend | grep -i error

# Rebuild frontend
docker compose build frontend --no-cache
docker compose up -d
```

---

## 🔄 Updating

After pulling new code:

```bash
# Docker
docker compose build --no-cache
docker compose up -d

# Podman
./deploy.sh build
./deploy.sh restart
```

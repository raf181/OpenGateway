> **Note:**
> This README was generated with GitHub Copilot. It may not always be up to date or fully accurate—please verify details before relying on it for production or critical use.

# GeoCustody Container Deployment

Quick deployment using Podman containers with Cloudflare Tunnel for public access.

> **Note:**
> This README was generated with GitHub Copilot. It may not always be up to date or fully accurate—please verify details before relying on it for production or critical use.

## Prerequisites

- Podman
- podman-compose (`pip install podman-compose`)
- Cloudflare account with Zero Trust tunnel configured

## Quick Start

1. **Copy and configure environment:**
   ```bash
   cd deploy
   cp .env.example .env
   ```

2. **Edit `.env` with your credentials:**
   ```bash
   # Telefónica OpenGateway
   GATEWAY_CLIENT_ID=your-client-id
   GATEWAY_CLIENT_SECRET=your-client-secret
   
   # Cloudflare Tunnel
   CLOUDFLARE_TUNNEL_TOKEN=your-tunnel-token
   
   # Your public hostname
   TUNNEL_HOSTNAME=geocustody.example.com
   ```

3. **Start the deployment:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh start
   ```

4. **Access the app:**
   - Local: http://localhost:8080
   - Public: https://your-tunnel-hostname

## Commands

```bash
./deploy.sh start    # Start all containers
./deploy.sh stop     # Stop all containers
./deploy.sh restart  # Restart all containers
./deploy.sh logs     # View logs (add service name for specific)
./deploy.sh build    # Rebuild containers
./deploy.sh status   # Show container status
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Cloudflare Tunnel                     │
│                  (cloudflared container)                 │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Frontend (nginx)                       │
│                    Port 8080 → 80                        │
│         Serves React app + proxies /api to backend       │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend (FastAPI)                      │
│                      Port 8000                           │
│              SQLite + Telefónica API calls               │
└─────────────────────────────────────────────────────────┘
```

## Cloudflare Tunnel Setup

1. Go to [Cloudflare Zero Trust](https://one.dash.cloudflare.com/)
2. Navigate to **Access → Tunnels**
3. Create a new tunnel
4. Copy the tunnel token
5. Configure public hostname to point to `http://frontend:80`

## Security Notes

- Never commit `.env` files with real credentials
- The SQLite database is stored in a Podman volume
- Cloudflare Tunnel provides HTTPS automatically
- Backend is not exposed directly to the internet

## Troubleshooting

**Containers won't start:**
```bash
./deploy.sh logs backend   # Check backend logs
./deploy.sh logs frontend  # Check frontend logs
./deploy.sh logs cloudflared  # Check tunnel logs
```

**Rebuild after code changes:**
```bash
./deploy.sh build
./deploy.sh restart
```

**Reset everything:**
```bash
./deploy.sh stop
podman volume rm deploy_geocustody-data
./deploy.sh start
```

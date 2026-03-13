#!/bin/bash
# GeoCustody Podman Deployment Script
# Usage: ./deploy.sh [start|stop|restart|logs|build|mode|status|monitoring]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check for .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found!${NC}"
    echo "   Copy .env.example to .env and configure:"
    echo "   cp .env.example .env"
    exit 1
fi

# ── Ensure the data directory exists with correct ownership ───────────────────
# In rootless Podman the container's UID 1001 (appuser) maps to a host subuid.
# `podman unshare chown` sets ownership via the user namespace so the container
# can write to the volume without world-writable permissions (chmod 777).
mkdir -p "$SCRIPT_DIR/data"
if command -v podman &>/dev/null; then
    podman unshare chown 1001:1001 "$SCRIPT_DIR/data" 2>/dev/null \
        || chmod 755 "$SCRIPT_DIR/data"
else
    chmod 755 "$SCRIPT_DIR/data"
fi

# Load environment variables
set -a
source .env
set +a

# Get current mode
CURRENT_MODE="${GATEWAY_MODE:-mock}"

show_status() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  GeoCustody Status${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Show mode
    case "$CURRENT_MODE" in
        mock)
            echo -e "  Mode: ${YELLOW}🟠 Mock/Demo${NC} (simulated responses)"
            ;;
        sandbox)
            echo -e "  Mode: ${GREEN}🟢 Telefónica Sandbox${NC} (real API)"
            ;;
        production)
            echo -e "  Mode: ${RED}🔴 Production${NC} (live API)"
            ;;
    esac
    
    # Show credentials status
    if [ -n "$GATEWAY_CLIENT_ID" ] && [ -n "$GATEWAY_CLIENT_SECRET" ]; then
        echo -e "  Credentials: ${GREEN}✓ Configured${NC}"
    else
        echo -e "  Credentials: ${YELLOW}✗ Not set${NC}"
    fi
    
    # Show tunnel status
    if [ -n "$CLOUDFLARE_TUNNEL_TOKEN" ]; then
        echo -e "  Tunnel: ${GREEN}✓ Configured${NC} (${TUNNEL_HOSTNAME:-not set})"
    else
        echo -e "  Tunnel: ${YELLOW}✗ Not configured${NC}"
    fi
    
    # Show data directory
    if [ -f "$SCRIPT_DIR/data/geocustody.db" ]; then
        DB_SIZE=$(du -h "$SCRIPT_DIR/data/geocustody.db" | cut -f1)
        echo -e "  Database: ${GREEN}✓ $DB_SIZE${NC} (data/geocustody.db)"
    else
        echo -e "  Database: ${YELLOW}Not created yet${NC}"
    fi
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

validate_for_api() {
    # Only validate credentials if not in mock mode
    if [ "$CURRENT_MODE" != "mock" ]; then
        if [ -z "$GATEWAY_CLIENT_ID" ] || [ -z "$GATEWAY_CLIENT_SECRET" ]; then
            echo -e "${YELLOW}⚠️  Missing Telefónica credentials for $CURRENT_MODE mode${NC}"
            echo "   Set GATEWAY_CLIENT_ID and GATEWAY_CLIENT_SECRET in .env"
            echo "   Or switch to mock mode: ./deploy.sh mode mock"
            exit 1
        fi
    fi
}

case "${1:-help}" in
    start)
        show_status
        validate_for_api
        echo ""
        echo -e "${GREEN}🚀 Starting GeoCustody containers...${NC}"
        podman-compose up -d
        echo ""
        echo -e "${GREEN}✅ GeoCustody is running!${NC}"
        echo "   Local: http://localhost:8080"
        if [ -n "$TUNNEL_HOSTNAME" ]; then
            echo "   Tunnel: https://${TUNNEL_HOSTNAME}"
        fi
        ;;
    enable-autorestart)
        # Use Podman's built-in restart policy to mark containers Restart=always
        containers=($(podman ps --format '{{.Names}}'))
        if [ ${#containers[@]} -eq 0 ]; then
            echo -e "${YELLOW}No running Podman containers found.${NC}"
            exit 0
        fi

        echo -e "${BLUE}Found containers:${NC} ${containers[*]}"

        for name in "${containers[@]}"; do
            echo -e "${BLUE}Setting restart policy for ${name} -> restart=always${NC}"
            # Use podman update to persist restart policy for the container
            if podman update --restart=always "$name" 2>/dev/null; then
                echo -e "${GREEN}Updated ${name}${NC}"
            else
                # Fallback: try container-specific form
                podman container update --restart=always "$name" || echo -e "${YELLOW}Warning: could not update restart policy for ${name}${NC}"
            fi
        done

        echo ""
        echo -e "${GREEN}✅ Auto-restart (restart=always) set for running containers.${NC}"
        ;;
    disable-autorestart)
        # Use Podman's built-in restart policy to unset restart behaviour (restart=no)
        containers=($(podman ps --format '{{.Names}}'))
        if [ ${#containers[@]} -eq 0 ]; then
            echo -e "${YELLOW}No running Podman containers found.${NC}"
            exit 0
        fi

        for name in "${containers[@]}"; do
            echo -e "${BLUE}Setting restart policy for ${name} -> restart=no${NC}"
            if podman update --restart=no "$name" 2>/dev/null; then
                echo -e "${GREEN}Updated ${name}${NC}"
            else
                podman container update --restart=no "$name" || echo -e "${YELLOW}Warning: could not update restart policy for ${name}${NC}"
            fi
        done

        echo -e "${GREEN}✅ Auto-restart disabled for running containers.${NC}"
        ;;
    stop)
        echo -e "${YELLOW}🛑 Stopping GeoCustody containers...${NC}"
        podman-compose down
        echo -e "${GREEN}✅ Containers stopped${NC}"
        ;;
    restart)
        show_status
        validate_for_api
        echo ""
        echo -e "${BLUE}🔄 Restarting GeoCustody containers...${NC}"
        podman-compose down
        podman-compose up -d
        echo -e "${GREEN}✅ Containers restarted${NC}"
        ;;
    logs)
        podman-compose logs -f "${2:-}"
        ;;
    build)
        echo -e "${BLUE}🔨 Building GeoCustody containers...${NC}"
        podman-compose build --no-cache
        echo -e "${GREEN}✅ Build complete${NC}"
        ;;
    status)
        show_status
        echo ""
        podman-compose ps
        ;;
    mode)
        case "${2:-}" in
            mock|sandbox|production)
                NEW_MODE="$2"
                # Update .env file
                if grep -q "^GATEWAY_MODE=" .env; then
                    sed -i "s/^GATEWAY_MODE=.*/GATEWAY_MODE=$NEW_MODE/" .env
                else
                    echo "GATEWAY_MODE=$NEW_MODE" >> .env
                fi
                echo -e "${GREEN}✅ Mode changed to: $NEW_MODE${NC}"
                echo ""
                echo "Restart to apply: ./deploy.sh restart"
                ;;
            "")
                echo -e "Current mode: ${BLUE}$CURRENT_MODE${NC}"
                echo ""
                echo "Available modes:"
                echo -e "  ${YELLOW}mock${NC}       - Demo mode with simulated responses"
                echo -e "  ${GREEN}sandbox${NC}    - Telefónica OpenGateway sandbox API"
                echo -e "  ${RED}production${NC} - Telefónica production API"
                echo ""
                echo "Usage: ./deploy.sh mode [mock|sandbox|production]"
                ;;
            *)
                echo -e "${RED}Invalid mode: $2${NC}"
                echo "Valid modes: mock, sandbox, production"
                exit 1
                ;;
        esac
        ;;
    reset-db)
        echo -e "${YELLOW}⚠️  This will delete all data!${NC}"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            podman-compose down
            rm -f "$SCRIPT_DIR/data/geocustody.db"
            echo -e "${GREEN}✅ Database reset. Start to create fresh database.${NC}"
        else
            echo "Cancelled."
        fi
        ;;
    monitoring)
        case "${2:-help}" in
            start)
                echo -e "${BLUE}📊 Starting monitoring stack (Prometheus + Grafana + nginx-exporter)...${NC}"
                COMPOSE_PROFILES=monitoring podman-compose up -d
                echo ""
                echo -e "${GREEN}✅ Monitoring is running!${NC}"
                echo "   Prometheus: http://localhost:9090"
                echo "   Grafana:    http://localhost:3000"
                ADMIN_USER="${GRAFANA_ADMIN_USER:-admin}"
                echo "   Grafana login: ${ADMIN_USER} / (see GRAFANA_ADMIN_PASSWORD in .env)"
                echo ""
                echo -e "${YELLOW}💡 Add Prometheus as a data source in Grafana:${NC}"
                echo "   URL: http://geocustody-prometheus:9090"
                ;;
            stop)
                echo -e "${YELLOW}🛑 Stopping monitoring stack...${NC}"
                COMPOSE_PROFILES=monitoring podman-compose --profile monitoring stop prometheus grafana nginx-exporter 2>/dev/null || \
                    podman stop geocustody-prometheus geocustody-grafana geocustody-nginx-exporter 2>/dev/null || true
                echo -e "${GREEN}✅ Monitoring stopped${NC}"
                ;;
            logs)
                COMPOSE_PROFILES=monitoring podman-compose logs -f prometheus grafana nginx-exporter
                ;;
            *)
                echo -e "${BLUE}Monitoring commands:${NC}"
                echo "  ./deploy.sh monitoring start  - Start Prometheus + Grafana + nginx-exporter"
                echo "  ./deploy.sh monitoring stop   - Stop monitoring containers"
                echo "  ./deploy.sh monitoring logs   - Tail monitoring logs"
                echo ""
                echo "Endpoints (localhost only):"
                echo "  Prometheus: http://localhost:9090"
                echo "  Grafana:    http://localhost:3000"
                ;;
        esac
        ;;
    *)
        echo -e "${BLUE}GeoCustody Deployment Script${NC}"
        echo ""
        echo "Usage: $0 <command>"
        echo ""
        echo "Commands:"
        echo "  start     - Start all containers"
        echo "  stop      - Stop all containers"
        echo "  restart   - Restart all containers"
        echo "  logs      - Show container logs (optional: service name)"
        echo "  build     - Rebuild containers without cache"
        echo "  status    - Show status and container info"
        echo "  mode      - Show or change gateway mode (mock/sandbox/production)"
        echo "  monitoring start|stop|logs - Control the optional monitoring stack"
        echo "  enable-autorestart  - Generate and enable systemd --user units for running Podman containers"
        echo "  disable-autorestart - Disable and remove generated systemd --user units"
        echo "  reset-db  - Delete database and start fresh"
        echo ""
        echo "Examples:"
        echo "  ./deploy.sh start"
        echo "  ./deploy.sh mode mock      # Switch to demo mode"
        echo "  ./deploy.sh mode sandbox   # Switch to Telefónica sandbox"
        echo "  ./deploy.sh logs backend   # View backend logs"
        echo "  ./deploy.sh monitoring start  # Start Prometheus + Grafana"
        ;;
esac

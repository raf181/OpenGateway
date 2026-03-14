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

COMPOSE_CMD=()
COMPOSE_FILE="podman-compose.yml"

detect_compose() {
    # Podman-only: prefer podman-compose, then podman compose.
    if command -v podman-compose >/dev/null 2>&1; then
        COMPOSE_CMD=(podman-compose)
        return 0
    fi

    if command -v podman >/dev/null 2>&1; then
        if podman compose version >/dev/null 2>&1; then
            COMPOSE_CMD=(podman compose)
            return 0
        fi
    fi

    echo -e "${RED}No Podman compose engine found.${NC}"
    echo "Install one of the following Podman options:"
    echo "  - podman-compose"
    echo "  - podman with compose support"
    echo ""
    echo "On RHEL/Fedora, if a broken docker-ce repo causes 404, try:"
    echo "  sudo dnf install --disablerepo=docker-ce-stable podman podman-compose"
    exit 1
}

compose_cmd() {
    "${COMPOSE_CMD[@]}" -f "$COMPOSE_FILE" "$@"
}

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
    if ! podman unshare chown 1001:1001 "$SCRIPT_DIR/data" 2>/dev/null; then
        if ! chmod 755 "$SCRIPT_DIR/data" 2>/dev/null; then
            echo -e "${YELLOW}Warning: could not adjust permissions on $SCRIPT_DIR/data.${NC}"
            echo "         Continuing with existing permissions."
        fi
    fi
else
    if ! chmod 755 "$SCRIPT_DIR/data" 2>/dev/null; then
        echo -e "${YELLOW}Warning: could not adjust permissions on $SCRIPT_DIR/data.${NC}"
        echo "         Continuing with existing permissions."
    fi
fi

# Load environment variables
set -a
source .env
set +a

detect_compose

# Get current mode
CURRENT_MODE="${GATEWAY_MODE:-mock}"
MIN_UDP_BUFFER=7500000

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

check_udp_buffer_size_hint() {
    # QUIC tunnels benefit from larger UDP socket buffers.
    if [ -z "$CLOUDFLARE_TUNNEL_TOKEN" ]; then
        return 0
    fi

    if [ ! -r "/proc/sys/net/core/rmem_max" ] || [ ! -r "/proc/sys/net/core/wmem_max" ]; then
        return 0
    fi

    local rmem_max
    local wmem_max
    rmem_max="$(cat /proc/sys/net/core/rmem_max 2>/dev/null || echo 0)"
    wmem_max="$(cat /proc/sys/net/core/wmem_max 2>/dev/null || echo 0)"

    if [ "$rmem_max" -lt "$MIN_UDP_BUFFER" ] || [ "$wmem_max" -lt "$MIN_UDP_BUFFER" ]; then
        echo ""
        echo -e "${YELLOW}⚠ UDP buffer sizes are low for Cloudflare QUIC tunnels${NC}"
        echo "   Current: net.core.rmem_max=${rmem_max}, net.core.wmem_max=${wmem_max}"
        echo "   Recommended minimum: ${MIN_UDP_BUFFER}"
        echo ""
        echo "   Apply now:" 
        echo "     sudo sysctl -w net.core.rmem_max=${MIN_UDP_BUFFER}"
        echo "     sudo sysctl -w net.core.wmem_max=${MIN_UDP_BUFFER}"
        echo ""
        echo "   Persist (example): /etc/sysctl.d/99-cloudflared.conf"
        echo "     net.core.rmem_max=${MIN_UDP_BUFFER}"
        echo "     net.core.wmem_max=${MIN_UDP_BUFFER}"
    fi
}

check_tunnel_ingress_hint() {
    # Cloudflare-managed ingress is pushed remotely and may point to localhost.
    # In a containerized cloudflared setup, localhost refers to cloudflared
    # itself, not the frontend container.
    if [ -z "$CLOUDFLARE_TUNNEL_TOKEN" ]; then
        return 0
    fi

    if ! command -v podman >/dev/null 2>&1; then
        return 0
    fi

    if ! podman ps --format '{{.Names}}' | grep -qx "geocustody-tunnel"; then
        return 0
    fi

    if ! command -v curl >/dev/null 2>&1; then
        return 0
    fi

    status_code=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 8 "https://${TUNNEL_HOSTNAME}" 2>/dev/null || true)

    if [ "$status_code" = "502" ]; then
        echo ""
        echo -e "${RED}⚠ Public tunnel endpoint returned HTTP 502${NC}"
        echo "   https://${TUNNEL_HOSTNAME} is reachable but the origin is failing."
        echo "   Most common cause: Cloudflare tunnel ingress points to localhost."
        echo ""
        echo "   Fix in Cloudflare Zero Trust -> Networks -> Tunnels -> Public Hostname:"
        echo "   Service URL: http://geocustody-frontend:80"
        echo "   (not http://localhost:8080 when cloudflared runs in a container)"
    fi
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

get_container_id_for_service() {
    local service="$1"
    local cid

    # podman compose supports `ps -q <service>`, while some podman-compose
    # versions reject service arguments. Try compose first, then fallback to
    # label-based lookup directly via Podman.
    cid="$(compose_cmd ps -q "$service" 2>/dev/null | head -n 1 || true)"
    if [ -n "$cid" ]; then
        echo "$cid"
        return 0
    fi

    if command -v podman >/dev/null 2>&1; then
        cid="$(podman ps -a --filter "label=io.podman.compose.service=${service}" --format '{{.ID}}' | head -n 1)"
        if [ -z "$cid" ]; then
            cid="$(podman ps -a --filter "label=com.docker.compose.service=${service}" --format '{{.ID}}' | head -n 1)"
        fi
    fi

    echo "$cid"
}

wait_for_service_ready() {
    local service="$1"
    local timeout_seconds="${2:-60}"
    local elapsed=0

    while [ "$elapsed" -lt "$timeout_seconds" ]; do
        local cid
        cid="$(get_container_id_for_service "$service")"

        if [ -n "$cid" ]; then
            local state
            local health
            state="$(podman inspect -f '{{.State.Status}}' "$cid" 2>/dev/null || true)"
            health="$(podman inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$cid" 2>/dev/null || true)"

            if [ "$state" = "running" ] && { [ "$health" = "none" ] || [ "$health" = "healthy" ]; }; then
                return 0
            fi
        fi

        sleep 2
        elapsed=$((elapsed + 2))
    done

    return 1
}

heal_service() {
    local service="$1"

    echo -e "${YELLOW}Attempting self-heal for ${service}...${NC}"

    if [ -n "$(get_container_id_for_service "$service")" ]; then
        compose_cmd restart "$service" >/dev/null
    else
        compose_cmd up -d "$service" >/dev/null
    fi

    if wait_for_service_ready "$service" 90; then
        echo -e "${GREEN}Self-heal succeeded for ${service}.${NC}"
        return 0
    fi

    echo -e "${RED}Self-heal failed for ${service}.${NC}"
    return 1
}

check_http_endpoint() {
    local url="$1"
    local service_to_heal="$2"
    local label="$3"

    if ! command -v curl >/dev/null 2>&1; then
        echo -e "${YELLOW}curl not found; skipping HTTP check for ${label}.${NC}"
        return 0
    fi

    local status
    status="$(curl -sS -o /dev/null -w "%{http_code}" --max-time 8 "$url" 2>/dev/null || true)"

    if [[ "$status" =~ ^[23] ]]; then
        echo -e "${GREEN}✓ ${label} is reachable (${status})${NC}"
        return 0
    fi

    echo -e "${YELLOW}${label} check failed (HTTP ${status:-n/a}). Restarting ${service_to_heal}...${NC}"
    if ! heal_service "$service_to_heal"; then
        return 1
    fi

    status="$(curl -sS -o /dev/null -w "%{http_code}" --max-time 8 "$url" 2>/dev/null || true)"
    if [[ "$status" =~ ^[23] ]]; then
        echo -e "${GREEN}✓ ${label} recovered (${status})${NC}"
        return 0
    fi

    echo -e "${RED}✗ ${label} still failing after restart (HTTP ${status:-n/a}).${NC}"
    return 1
}

check_backend_internal_health() {
    local backend_cid
    backend_cid="$(get_container_id_for_service backend)"

    if [ -z "$backend_cid" ]; then
        echo -e "${RED}✗ Backend container is missing.${NC}"
        return 1
    fi

    if podman exec "$backend_cid" python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://localhost:8000/health', timeout=5).getcode()==200 else 1)" >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend internal health endpoint is healthy${NC}"
        return 0
    fi

    echo -e "${YELLOW}Backend internal health failed. Restarting backend...${NC}"
    if ! heal_service backend; then
        return 1
    fi

    backend_cid="$(get_container_id_for_service backend)"
    if podman exec "$backend_cid" python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://localhost:8000/health', timeout=5).getcode()==200 else 1)" >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend internal health recovered${NC}"
        return 0
    fi

    echo -e "${RED}✗ Backend internal health still failing after restart.${NC}"
    return 1
}

deployment_test() {
    local failed=0
    local services=(backend frontend)

    if [ -n "$CLOUDFLARE_TUNNEL_TOKEN" ]; then
        services+=(cloudflared)
    fi

    echo ""
    echo -e "${BLUE}Running deployment test (health + self-heal)...${NC}"

    for service in "${services[@]}"; do
        local cid
        local state
        local health

        cid="$(get_container_id_for_service "$service")"

        if [ -z "$cid" ]; then
            echo -e "${YELLOW}${service} is not running. Attempting start...${NC}"
            if ! heal_service "$service"; then
                failed=1
                continue
            fi
            cid="$(get_container_id_for_service "$service")"
        fi

        state="$(podman inspect -f '{{.State.Status}}' "$cid" 2>/dev/null || true)"
        health="$(podman inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$cid" 2>/dev/null || true)"

        if [ "$state" != "running" ] || [ "$health" = "unhealthy" ]; then
            echo -e "${YELLOW}${service} state=${state:-unknown}, health=${health:-unknown}. Restarting...${NC}"
            if ! heal_service "$service"; then
                failed=1
            fi
        else
            echo -e "${GREEN}✓ ${service} state=${state}, health=${health}${NC}"
        fi
    done

    if ! wait_for_service_ready backend 90; then
        echo -e "${RED}✗ Backend did not become ready in time.${NC}"
        failed=1
    fi

    if ! wait_for_service_ready frontend 90; then
        echo -e "${RED}✗ Frontend did not become ready in time.${NC}"
        failed=1
    fi

    if ! check_backend_internal_health; then
        failed=1
    fi

    if ! check_http_endpoint "http://localhost:8080/" frontend "Frontend UI"; then
        failed=1
    fi

    if ! check_http_endpoint "http://localhost:8080/api/opengateway/status" backend "Backend API via frontend proxy"; then
        failed=1
    fi

    if [ -n "$CLOUDFLARE_TUNNEL_TOKEN" ] && [ -n "$TUNNEL_HOSTNAME" ]; then
        if ! check_http_endpoint "https://${TUNNEL_HOSTNAME}" cloudflared "Cloudflare tunnel public endpoint"; then
            failed=1
        fi
    fi

    if [ "$failed" -eq 0 ]; then
        echo -e "${GREEN}✅ Deployment test passed. Services are healthy.${NC}"
        return 0
    fi

    echo -e "${RED}❌ Deployment test failed. Check logs with: ./deploy.sh logs${NC}"
    return 1
}

case "${1:-help}" in
    start)
        show_status
        check_udp_buffer_size_hint
        validate_for_api
        echo ""
        echo -e "${GREEN}🚀 Starting GeoCustody containers...${NC}"
        compose_cmd up -d
        check_tunnel_ingress_hint
        deployment_test
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
        compose_cmd down
        echo -e "${GREEN}✅ Containers stopped${NC}"
        ;;
    restart)
        show_status
        check_udp_buffer_size_hint
        validate_for_api
        echo ""
        echo -e "${BLUE}🔄 Restarting GeoCustody containers...${NC}"
        compose_cmd down
        compose_cmd up -d
        check_tunnel_ingress_hint
        deployment_test
        echo -e "${GREEN}✅ Containers restarted${NC}"
        ;;
    logs)
        compose_cmd logs -f "${2:-}"
        ;;
    build)
        echo -e "${BLUE}🔨 Building GeoCustody containers...${NC}"
        compose_cmd build --no-cache
        echo -e "${GREEN}✅ Build complete${NC}"
        ;;
    status)
        show_status
        check_udp_buffer_size_hint
        echo ""
        compose_cmd ps
        check_tunnel_ingress_hint
        ;;
    test)
        check_udp_buffer_size_hint
        deployment_test
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
            compose_cmd down
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
                compose_cmd --profile monitoring up -d --no-deps prometheus grafana nginx-exporter
                echo ""
                echo -e "${GREEN}✅ Monitoring is running!${NC}"
                PROM_PORT="${PROMETHEUS_PORT:-19090}"
                GRAF_PORT="${GRAFANA_PORT:-13000}"
                echo "   Prometheus: http://localhost:${PROM_PORT}"
                echo "   Grafana:    http://localhost:${GRAF_PORT}"
                ADMIN_USER="${GRAFANA_ADMIN_USER:-admin}"
                echo "   Grafana login: ${ADMIN_USER} / (see GRAFANA_ADMIN_PASSWORD in .env)"
                echo ""
                echo -e "${YELLOW}💡 Add Prometheus as a data source in Grafana:${NC}"
                echo "   URL: http://geocustody-prometheus:9090"
                ;;
            stop)
                echo -e "${YELLOW}🛑 Stopping monitoring stack...${NC}"
                compose_cmd --profile monitoring stop prometheus grafana nginx-exporter 2>/dev/null || \
                    podman stop geocustody-prometheus geocustody-grafana geocustody-nginx-exporter 2>/dev/null || true
                echo -e "${GREEN}✅ Monitoring stopped${NC}"
                ;;
            logs)
                compose_cmd --profile monitoring logs -f prometheus grafana nginx-exporter
                ;;
            *)
                echo -e "${BLUE}Monitoring commands:${NC}"
                echo "  ./deploy.sh monitoring start  - Start Prometheus + Grafana + nginx-exporter"
                echo "  ./deploy.sh monitoring stop   - Stop monitoring containers"
                echo "  ./deploy.sh monitoring logs   - Tail monitoring logs"
                echo ""
                echo "Endpoints (localhost only):"
                echo "  Prometheus: http://localhost:${PROMETHEUS_PORT:-19090}"
                echo "  Grafana:    http://localhost:${GRAFANA_PORT:-13000}"
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
        echo "  test      - Run deployment health test and self-heal failed services"
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

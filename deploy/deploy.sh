#!/bin/bash
# GeoCustody Podman Deployment Script
# Usage: ./deploy.sh [start|stop|restart|logs|build]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found!"
    echo "   Copy .env.example to .env and fill in your credentials:"
    echo "   cp .env.example .env"
    exit 1
fi

# Load environment variables
set -a
source .env
set +a

# Check required variables
if [ -z "$GATEWAY_CLIENT_ID" ] || [ -z "$GATEWAY_CLIENT_SECRET" ]; then
    echo "⚠️  Missing Telefónica credentials in .env"
    echo "   Set GATEWAY_CLIENT_ID and GATEWAY_CLIENT_SECRET"
    exit 1
fi

if [ -z "$CLOUDFLARE_TUNNEL_TOKEN" ]; then
    echo "⚠️  Missing CLOUDFLARE_TUNNEL_TOKEN in .env"
    echo "   Get your token from Cloudflare Zero Trust dashboard"
    exit 1
fi

case "${1:-start}" in
    start)
        echo "🚀 Starting GeoCustody containers..."
        podman-compose up -d
        echo "✅ GeoCustody is running!"
        echo "   Local: http://localhost:8080"
        echo "   Tunnel: https://${TUNNEL_HOSTNAME:-your-tunnel-hostname}"
        ;;
    stop)
        echo "🛑 Stopping GeoCustody containers..."
        podman-compose down
        echo "✅ Containers stopped"
        ;;
    restart)
        echo "🔄 Restarting GeoCustody containers..."
        podman-compose down
        podman-compose up -d
        echo "✅ Containers restarted"
        ;;
    logs)
        podman-compose logs -f "${2:-}"
        ;;
    build)
        echo "🔨 Building GeoCustody containers..."
        podman-compose build --no-cache
        echo "✅ Build complete"
        ;;
    status)
        podman-compose ps
        ;;
    *)
        echo "Usage: $0 [start|stop|restart|logs|build|status]"
        echo ""
        echo "Commands:"
        echo "  start   - Start all containers (default)"
        echo "  stop    - Stop all containers"
        echo "  restart - Restart all containers"
        echo "  logs    - Show container logs (optional: service name)"
        echo "  build   - Rebuild containers"
        echo "  status  - Show container status"
        exit 1
        ;;
esac

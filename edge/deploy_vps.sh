#!/usr/bin/env bash
set -euo pipefail

# Usage: VPS_HOST=user@host ./deploy_vps.sh

if [ -z "${VPS_HOST:-}" ]; then
  echo "Set VPS_HOST (e.g., user@1.2.3.4)" >&2
  exit 1
fi

scp edge/docker-compose.yaml "$VPS_HOST:/opt/edge/"
ssh "$VPS_HOST" 'cd /opt/edge && docker compose pull || true && docker compose up -d'


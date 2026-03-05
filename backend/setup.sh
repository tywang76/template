#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

# ── 1. Sync package.json name from .env ──────────────────────────────────────
echo "→ Syncing package.json name..."
node scripts/setup.mjs

# ── 2. Install dependencies ───────────────────────────────────────────────────
echo "→ Installing dependencies..."
npm install

# ── 3. Start Docker containers ────────────────────────────────────────────────
echo "→ Starting Docker containers..."
npm run docker:dev

# ── 4. Wait for MongoDB to be healthy (healthcheck handles replica set init) ──
echo "→ Waiting for MongoDB to be ready..."
until [ "$(docker inspect --format='{{.State.Health.Status}}' "$(docker ps --filter 'name=mongo' -q | head -1)" 2>/dev/null)" = "healthy" ]; do
  sleep 2
done
echo "  MongoDB is up and replica set is ready."

# ── 5. Generate Prisma client (inside container so it targets the Docker volume) ──
echo "→ Generating Prisma client..."
docker exec "$(docker ps --filter 'name=backend' -q | head -1)" npx prisma generate

# ── 6. Restart backend to pick up generated Prisma client ────────────────────
echo "→ Restarting backend..."
docker restart "$(docker ps --filter 'name=backend' -q | head -1)"

echo ""
echo "✓ Done. Backend running at http://localhost:3000"

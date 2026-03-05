#!/usr/bin/env bash
set -e

# ── 1. Sync package.json name from .env ──────────────────────────────────────
echo "→ Syncing package.json name..."
node scripts/setup.mjs

# ── 2. Install dependencies ───────────────────────────────────────────────────
echo "→ Installing dependencies..."
npm install

# ── 3. Start Docker containers ────────────────────────────────────────────────
echo "→ Starting Docker containers..."
npm run docker:dev

# ── 4. Wait for MongoDB to be ready ──────────────────────────────────────────
echo "→ Waiting for MongoDB..."
until docker exec "$(docker ps --filter 'name=mongo' -q | head -1)" \
    mongo --quiet --eval "db.runCommand({ ping: 1 }).ok" 2>/dev/null | grep -q 1; do
  sleep 2
done
echo "  MongoDB is up."

# ── 5. Initiate replica set ───────────────────────────────────────────────────
echo "→ Initiating replica set..."
docker exec "$(docker ps --filter 'name=mongo' -q | head -1)" \
    mongo --quiet --eval \
    "try { rs.status() } catch(e) { rs.initiate({_id:'rs0',members:[{_id:0,host:'mongo:27017'}]}) }"

echo "→ Waiting for primary election..."
until docker exec "$(docker ps --filter 'name=mongo' -q | head -1)" \
    mongo --quiet --eval "rs.status().ok" 2>/dev/null | grep -q 1; do
  sleep 2
done
echo "  Replica set ready."

# ── 6. Generate Prisma client ────────────────────────────────────────────────
echo "→ Generating Prisma client..."
npx prisma generate

echo ""
echo "✓ Done. Backend running at http://localhost:3000"

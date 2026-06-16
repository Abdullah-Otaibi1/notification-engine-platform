#!/bin/sh
# =============================================================
# Notification Engine Platform — Production Startup Entrypoint
# Runs automatically on every container start:
#   1. Push Prisma schema to database (safe, idempotent)
#   2. Seed initial data (skip if already seeded)
#   3. Launch the NestJS application
# =============================================================

set -e

echo ""
echo "============================================"
echo " Notification Engine Platform — Starting"
echo "============================================"
echo ""

# ------------------------------------
# Wait for PostgreSQL to be reachable
# (docker-compose healthcheck handles
#  this, but a quick retry loop adds
#  resilience for Coolify / bare VPS)
# ------------------------------------
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
MAX_TRIES=30
TRIES=0

echo "[1/3] Waiting for database at $DB_HOST:$DB_PORT ..."
until nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null || [ "$TRIES" -ge "$MAX_TRIES" ]; do
  TRIES=$((TRIES + 1))
  echo "      ... attempt $TRIES/$MAX_TRIES"
  sleep 2
done

if [ "$TRIES" -ge "$MAX_TRIES" ]; then
  echo "ERROR: Database not reachable after $MAX_TRIES attempts. Aborting."
  exit 1
fi
echo "      Database is reachable."
echo ""

# ------------------------------------
# Apply Prisma schema (db push)
# --accept-data-loss prevents the CLI
# from aborting in non-interactive mode
# ------------------------------------
echo "[2/3] Applying Prisma schema (db push)..."
npx prisma db push --accept-data-loss
echo "      Schema applied."
echo ""

# ------------------------------------
# Seed initial data
# seed.ts has built-in guards: it skips
# large data sets if they already exist
# ------------------------------------
echo "[3/3] Running database seed..."
npx prisma db seed
echo "      Seed complete."
echo ""

# ------------------------------------
# Launch application
# Use exec so Node becomes PID 1 and
# receives OS signals cleanly
# ------------------------------------
echo "Starting NestJS application..."
echo "============================================"
echo ""
exec node dist/main

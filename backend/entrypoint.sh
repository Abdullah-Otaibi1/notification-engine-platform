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
# Apply Prisma migrations (versioned).
# Uses `migrate deploy` (never destructive).
# If the DB already has the schema but no
# migration history (legacy `db push`
# deploys), baseline the initial migration
# so deploy does not fail (Prisma P3005).
# ------------------------------------
echo "[2/3] Applying Prisma migrations (migrate deploy)..."
if ! npx prisma migrate deploy 2>/tmp/migrate.log; then
  if grep -q "P3005" /tmp/migrate.log; then
    echo "      Existing non-empty schema detected — baselining 0_init..."
    npx prisma migrate resolve --applied 0_init
    npx prisma migrate deploy
  else
    echo "ERROR: prisma migrate deploy failed:"
    cat /tmp/migrate.log
    exit 1
  fi
fi
echo "      Migrations applied."
echo ""

# ------------------------------------
# Seed initial data (OPT-IN).
# Disabled by default in production so demo
# users/credentials are never created
# automatically. Enable explicitly with
# RUN_SEED=true (e.g. first bootstrap / dev).
# ------------------------------------
if [ "${RUN_SEED}" = "true" ]; then
  echo "[3/3] RUN_SEED=true — running database seed..."
  npx prisma db seed
  echo "      Seed complete."
else
  echo "[3/3] Skipping seed (set RUN_SEED=true to enable)."
fi
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

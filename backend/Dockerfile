# =============================================================
# Notification Engine Platform — Backend Dockerfile
# Multi-stage build: builder (compile TS) → runner (production)
# =============================================================

# ---- Stage 1: Build ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (includes devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy source and generate Prisma client, then compile
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- Stage 2: Production Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

# netcat-openbsd provides `nc` for the DB readiness check in entrypoint.sh
RUN apk add --no-cache netcat-openbsd

ENV NODE_ENV=production

# Install production dependencies
# (prisma + tsx are in `dependencies` so they are included here)
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled application
COPY --from=builder /app/dist ./dist

# Copy the pre-generated Prisma client (avoids re-running prisma generate)
COPY --from=builder /app/node_modules/.prisma  ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma  ./node_modules/@prisma

# Copy Prisma schema + seed (needed for db push, db seed at runtime)
COPY prisma ./prisma

# Copy and prepare the startup entrypoint
# sed strips Windows CR (\r) so the script works on Alpine regardless of host OS
COPY entrypoint.sh ./entrypoint.sh
RUN sed -i 's/\r//' ./entrypoint.sh && chmod +x ./entrypoint.sh

EXPOSE 3000

# entrypoint.sh: db push → db seed → node dist/main
CMD ["sh", "entrypoint.sh"]

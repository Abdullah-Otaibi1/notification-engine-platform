# Notification Engine Operations & Monitoring Platform

A production-ready enterprise-grade operations dashboard for monitoring, troubleshooting, and managing a Notification Engine. Built with Angular 20, NestJS, PostgreSQL, and Prisma — fully containerized for deployment on Hetzner VPS via Coolify.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│               Angular 20 Frontend                   │
│   Material UI  │  ApexCharts  │  Dark/Light Mode    │
└─────────────────────────┬───────────────────────────┘
                          │ REST / HTTP
┌─────────────────────────▼───────────────────────────┐
│               NestJS Backend API                    │
│   JWT Auth  │  RBAC  │  Swagger  │  Prisma ORM      │
└─────────────────────────┬───────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────┐
│                  PostgreSQL 16                      │
└─────────────────────────┬───────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────┐
│            Mock ESB Service Layer                   │
│         (replaceable with real ESB)                 │
└─────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | Angular 20, Angular Material, RxJS, SCSS, ApexCharts |
| Backend     | NestJS, TypeScript, REST, Swagger, JWT, RBAC  |
| Database    | PostgreSQL 16                                 |
| ORM         | Prisma 6                                      |
| Container   | Docker, Docker Compose                        |
| Deployment  | Hetzner VPS, Coolify                          |

---

## Modules

| #  | Module                        | Description                                |
|----|-------------------------------|--------------------------------------------|
| 1  | Dashboard                     | KPI summary with live-refreshing charts    |
| 2  | Channel Health Monitoring     | SMS / Email / Push status tiles            |
| 3  | Provider Monitoring           | Provider cards with enable/disable actions |
| 4  | Notification Search           | Advanced search with filters + CSV export  |
| 5  | Notification Details          | Full lifecycle timeline view               |
| 6  | Templates Management          | Template CRUD with audit                   |
| 7  | IDM Contact Configuration     | IDM config with audit                      |
| 8  | Queue Monitoring              | Queue depth, drain rate, capacity          |
| 9  | Consumer Channel Management   | Authorize / Ban / Simulator controls       |
| 10 | Retry & Recovery              | Manual and bulk retry with history         |
| 11 | Workload Management           | Instance scaling up to 250                 |
| 12 | Alerts & Incident Management  | Alert triage: Ack / Resolve / Silence      |
| 13 | SLA Monitoring                | Compliance gauges and percentile latencies |
| 14 | Audit Logs                    | Immutable audit trail with export          |
| 15 | Reports                       | Delivery/Failure/SLA/Provider reports (CSV/XLSX/PDF) |

---

## Roles

| Role       | Access Level                                  |
|------------|-----------------------------------------------|
| Admin      | Full access                                   |
| Operations | Monitor + perform operational actions         |
| Auditor    | Read-only                                     |
| Viewer     | Dashboard only                                |

---

## Quick Start — Docker Compose

### Prerequisites

- Docker ≥ 24 and Docker Compose v2 (`docker compose` — note: no hyphen)

### Step 1 — Configure environment

```bash
git clone <repo-url>
cd notification-engine-platform

# Copy the template
cp .env.example .env
```

Then **edit `.env`** and set the two required values:

```dotenv
# A strong database password (avoid @ # $ % in the password itself)
POSTGRES_PASSWORD=MyStr0ngDBP@ssword!

# A 64-char random hex secret for JWT signing
# Generate with:  openssl rand -hex 32
JWT_SECRET=a1b2c3d4e5f6...
```

All other values have safe defaults for local development.

> **Security:** `.env` is in `.gitignore` and will never be committed.

### Step 2 — Build and start

```bash
docker compose up -d --build
```

On first start the backend container **automatically**:
1. Waits for PostgreSQL to be ready (up to 60 s)
2. Applies versioned migrations — `npx prisma migrate deploy` (auto-baselines legacy schemas)
3. Seeds initial data **only when `RUN_SEED=true`** — `npx prisma db seed`
4. Starts the NestJS application

| Service    | URL                            |
|------------|--------------------------------|
| Frontend   | http://localhost               |
| Backend    | http://localhost:3000          |
| Swagger UI | http://localhost:3000/api/docs |
| PostgreSQL | localhost:5432                 |

### Step 3 — Verify startup

```bash
docker logs nep-backend --tail 80
```

Expected (first run):
```
[1/3] Waiting for database at postgres:5432 ...
      Database is reachable.
[2/3] Applying Prisma migrations (migrate deploy)...
      Migrations applied.
[3/3] RUN_SEED=true — running database seed...
🌱 Starting seed...
  ✔ Users seeded
  ✔ Providers seeded
  ✔ Notifications seeded (10000 records)
✅ Seed complete!
Starting NestJS application...
🚀 Application is running on: http://localhost:3000
```

On **restart** (data already present):
```
[3/3] Running database seed...
  ✔ Users seeded        ← always upserted
  ✔ Providers seeded    ← always upserted
  ⏭ Notifications already exist (10000 records), skipping
✅ Seed complete!
```

---

## Environment Variables Reference

| Variable            | Required | Default               | Description |
|---------------------|----------|-----------------------|-------------|
| `POSTGRES_PASSWORD` | ✅       | —                     | Database password |
| `JWT_SECRET`        | ✅       | —                     | JWT signing secret (min 32 chars) |
| `POSTGRES_USER`     |          | `nep_user`            | Database username |
| `POSTGRES_DB`       |          | `nep_db`              | Database name |
| `POSTGRES_PORT`     |          | `5432`                | Host port for PostgreSQL |
| `PORT`              |          | `3000`                | Port the backend listens on |
| `FRONTEND_PORT`     |          | `80`                  | Host port for frontend |
| `JWT_EXPIRES_IN`    |          | `8h`                  | JWT token lifetime |
| `CORS_ORIGIN`       |          | `http://localhost:4200` | Allowed CORS origin(s), comma-separated |
| `RUN_SEED`          |          | `false`               | Set `true` (first deploy) to run the DB seed |
| `SEED_ADMIN_PASSWORD` | when `RUN_SEED=true` |          | Initial admin password (no default in prod) |
| `NODE_ENV`          |          | `production`          | Node environment |

> `DATABASE_URL` is **auto-constructed** by `docker-compose.coolify.yml` using `postgres` (the service name). Do not override it in `.env` when using Docker Compose.

---

## Manual Database Commands

```bash
# Apply pending migrations (versioned, never destructive)
docker exec -it nep-backend npx prisma migrate deploy

# Re-run seed (opt-in; requires SEED_*_PASSWORD env in production)
docker exec -it -e RUN_SEED=true nep-backend npx prisma db seed

# Open Prisma Studio (GUI schema/data browser)
docker exec -it nep-backend npx prisma studio
```

---

## Local Development (without Docker)

### Backend

```bash
cd backend
npm install

# Edit DATABASE_URL in .env to point to localhost:
# DATABASE_URL=postgresql://nep_user:<password>@localhost:5432/nep_db?schema=public
cp ../.env.example .env

npx prisma migrate deploy
RUN_SEED=true npx prisma db seed
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm start        # dev server on http://localhost:4200
```

---

## API Documentation

Swagger UI:

```
http://localhost:3000/api/docs
```

Base path: `/api/v1/notification-engine`

---

## Project Structure

```
notification-engine-platform/
├── frontend/                  # Angular 20 application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/          # Auth, guards, interceptors, services
│   │   │   ├── shared/        # Reusable components, pipes, directives
│   │   │   ├── features/      # Feature modules (one per platform module)
│   │   │   └── layout/        # Shell, sidenav, header, theme
│   │   ├── environments/
│   │   ├── styles/            # Global SCSS, themes
│   │   └── assets/
│   ├── nginx.conf
│   └── Dockerfile
│
├── backend/                   # NestJS application
│   ├── src/
│   │   ├── auth/              # JWT auth, RBAC guards
│   │   ├── common/            # Interceptors, filters, decorators
│   │   ├── modules/           # Feature modules (one per platform module)
│   │   │   ├── dashboard/
│   │   │   ├── channels/
│   │   │   ├── providers/
│   │   │   ├── notifications/
│   │   │   ├── templates/
│   │   │   ├── idm/
│   │   │   ├── queues/
│   │   │   ├── consumer-channels/
│   │   │   ├── retry/
│   │   │   ├── workload/
│   │   │   ├── alerts/
│   │   │   ├── sla/
│   │   │   ├── audit/
│   │   │   └── reports/
│   │   └── esb/               # Mock ESB service layer (swappable)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── Dockerfile
│
├── docker-compose.coolify.yml
├── .env.example
└── README.md
```

---

## Deployment — Coolify (Hetzner VPS)

### How it works

The backend `entrypoint.sh` handles **zero-touch database setup** on every container start:

```
container start
  └─► wait for postgres
  └─► npx prisma migrate deploy  ← applies versioned migrations (never destructive;
                                    auto-baselines legacy db-push schemas)
  └─► npx prisma db seed         ← ONLY when RUN_SEED=true (off by default in prod)
  └─► exec node dist/main        ← starts NestJS (PID 1)
```

### First Deployment Steps

1. **Push code** to your Git repository (GitHub / GitLab / Gitea)
2. **In Coolify** → New Resource → Docker Compose
3. Select your repository and set the **Docker Compose file** to `docker-compose.coolify.yml`
4. **Set environment variables** (copy from `.env.example`):
   | Variable         | Required | Example                          |
   |------------------|----------|----------------------------------|
   | `POSTGRES_PASSWORD` | ✅    | `change_me_in_prod`              |
   | `JWT_SECRET`     | ✅       | `$(openssl rand -hex 32)` (≥32 chars) |
   | `PORT`           | optional | `3000`                           |
   | `FRONTEND_PORT`  | optional | `80`                             |
   | `RUN_SEED`       | first deploy | `true` (then remove)         |
   | `SEED_ADMIN_PASSWORD` | if seeding | strong password             |
5. **Deploy** — Coolify builds images and starts containers
6. Database is auto-prepared on first start (no manual steps needed)

### Re-deployment / Updates

Just push new code and redeploy. The entrypoint is idempotent:
- Schema changes are applied via `prisma migrate deploy` (versioned, non-destructive)
- Seeding only runs when `RUN_SEED=true` (off by default, so redeploys don't touch data)

### Rollback / Reset

```bash
# On the VPS or via Coolify terminal:
docker compose down -v          # removes all containers + volumes
docker compose up -d --build    # clean rebuild + fresh seed
```

> ⚠️ `down -v` deletes all PostgreSQL data. Use only when you want a full reset.

---

## Default Credentials (Dev Seed)

| Username | Password     | Role       |
|----------|--------------|------------|
| admin    | Admin@1234   | Admin      |
| ops      | Ops@1234     | Operations |
| auditor  | Auditor@1234 | Auditor    |
| viewer   | Viewer@1234  | Viewer     |

> **Change all credentials before production deployment.**

---

## License

Private — Internal Use Only

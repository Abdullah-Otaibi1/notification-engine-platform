# Thermo-Nuclear Audit & Fix — Review History (Ledger)

> Durable audit ledger. Every finding, decision, fix, and QA note lives here.
> Do not reopen Closed/Deferred findings without explicit owner approval.

## Repo Snapshot (recon)

- **Repo:** notification-engine-platform (NEP — Notification Engine Operations & Monitoring Platform)
- **Branch:** `main` @ `3e78cab` ("Initial clean upload for Coolify deployment")
- **Working tree:** DIRTY (many modified/untracked frontend files, modified backend filters/interceptors, deleted `docker-compose.yml`/`docker-compose.yaml`).
- **Base branch:** only `main` exists locally; no remote tracking confirmed.
- **Monorepo layout:** `backend/` (NestJS 10) + `frontend/` (Angular 20). No root package.json/workspace.

### Stack
- **Backend:** NestJS 10, Prisma 6 (PostgreSQL), JWT + Passport (local + jwt), bcryptjs, helmet, compression, throttler, Swagger, winston. Mock `EsbService` layer.
- **Frontend:** Angular 20 (standalone, signals), Angular Material 20, ApexCharts. Token in `localStorage`, route guard, lazy-loaded feature routes.

### Commands
| Purpose | Backend | Frontend |
|---|---|---|
| Install | `npm install` (in `backend/`) | `npm install` (in `frontend/`) |
| Build | `npm run build` (nest build) | `npm run build` (ng build --prod) |
| Dev | `npm run start:dev` | `npm start` (ng serve :4200) |
| Lint | `npm run lint` (eslint) | `npm run lint` (ng lint) |
| Test | `npm test` (jest) — **NO SPEC FILES EXIST** | `npm test` (karma/jasmine) — **NO SPEC FILES EXIST** |
| Typecheck | via `nest build` / `tsc` | via `ng build` |
| DB | `npm run prisma:migrate` / `prisma:seed` | — |

### Release-critical surfaces
- Auth: `backend/src/auth/*`, `frontend/src/app/core/services/auth.service.ts`, `core/guards/auth.guard.ts`, HTTP interceptor.
- Config/bootstrap: `backend/src/main.ts`, `app.module.ts`, `.env.example`, `Dockerfile`s, `docker-compose.coolify.yml`, nginx config.
- Data layer: `backend/prisma/schema.prisma`, `prisma/seed.ts`, per-module services; `EsbService` (mock).
- App shell/routing: `frontend/src/app/app.routes.ts`, `layout/shell/*`.

---

## Status Legend
`Open` (found, unverified) · `Approved` (owner ok to fix) · `Fixed` · `Deferred` · `Closed`

## Severity Legend
`Critical` · `High` · `Medium` · `Low`

## ID Format
`P{phase}-{type}{n}` — F=functional, S=security/privacy/data, CJ=code-quality/arch, O=ops/release/build, Q=QA/test gap.

---

## Findings

> Status after audit fan-out (4 read-only subagents) + parent spot-checks.
> Items marked **[verified]** were confirmed live in code by the parent.
> No code changes until the owner approves a specific ID/cluster.

### Master table

| ID | Title | Sev | Status | Phase |
|---|---|---|---|---|
| **P9-O2** | README/Coolify reference deleted `docker-compose.yml` (deploy-by-docs breaks) **[verified]** | Critical | **Fixed** | 9 |
| **P3-O1** | No committed `prisma/migrations/`; `migrate deploy` has nothing to apply **[verified]** | Critical | **Fixed** | 3 |
| **P3-O2** | Prod entrypoint uses `prisma db push --accept-data-loss` every start **[verified]** | Critical | **Fixed** | 3 |
| **P3-F1** | Hardcoded demo passwords committed in `seed.ts` **[verified]** | Critical | **Fixed** | 3 |
| **P3-F2** | Seed runs in production on every container start **[verified]** | Critical | **Fixed** | 3 |
| **P1-S1** | `JWT_SECRET` / `DATABASE_URL` not validated at startup (no fail-fast) **[verified]** | High | **Fixed** | 1 |
| **P1-S3** | `RolesGuard` exists but is never applied — no authorization **[verified]** | High | **Fixed** | 1 |
| **P1-S5** | Login not rate-limited (`ThrottlerGuard` never registered) **[verified]** | High | **Fixed** | 1 |
| **P2-F1** | Error banner persists after a later successful reload **[verified pattern]** | High | **Fixed** | 2 |
| **P2-CJ5** | Queues screen crashes: `columns` lists `status` with no `matColumnDef` **[verified]** | High | **Fixed** | 2 |
| **P3-CJ1** | Dashboard charts use unbounded `findMany` (loads all 7-day rows) | High | **Fixed** | 3 |
| **P10-Q1** | Zero automated tests across entire repo **[verified]** | High | **Fixed (foundation)** | 10 |
| **P1-S4** | JWT not re-validated vs DB (deactivated/role-changed user keeps access ≤8h) | Medium | **Fixed** | 1 |
| **P1-S2** | No global auth guard — new controllers ship public by default | Medium | **Fixed** | 1 |
| **P4-S1** | List query params bypass DTO validation (`page=NaN`, no `pageSize` cap) | Medium | **Fixed** | 4 |
| **P0-S1** | CORS defaults to `*` with `credentials: true` (mitigated in Coolify) **[verified]** | Medium | **Fixed** | 0 |
| **P0-S2** | Local-dev CORS origin mismatch (`localhost` vs `:4200`) | Medium | **Fixed** | 0 |
| **P9-O5** | Swagger exposed in prod + healthcheck depends on `/api/docs` | Medium | **Fixed** | 9 |
| **P9-O3** | Hardcoded infra IP as fallback CORS origin in compose | Medium | **Fixed** | 9 |
| **P9-O4** | `APP_ORIGIN` vs `CORS_ORIGIN` naming split (ops sets wrong var) | Medium | **Fixed** | 9 |
| **P2-F2** | Stale table/KPI data left visible alongside error on failed refresh | Medium | **Fixed** | 2 |
| **P2-CJ1** | Paginator desyncs after Search/Reset (no `[pageIndex]`) | Medium | **Fixed** | 2 |
| **P2-F3** | 7 nav routes are "coming soon" placeholders (mislead ops users) | Medium | **Fixed** | 2 |
| **P2-F4** | Notification rows click-only (no keyboard access) | Medium | **Fixed** | 7 |
| **P7-F1** | Login form lacks visible field-level validation (`mat-error`) | Medium | **Fixed** | 7 |
| **P3-S1** | Missing `@@index([providerId])` (FK filter → seq scan) | Medium | **Fixed** | 3 |
| **P3-S2** | Missing `@@index([consumerChannelId])` | Medium | **Fixed** | 3 |
| **P3-CJ2** | Unbounded `statusHistory` include on notification detail | Medium | **Fixed** | 3 |
| **P3-CJ3** | Audit `contains` ILIKE can't use B-tree index → full scan | Medium | **Deferred** | 3 |
| **P1-S7** | Frontend guard ignores token expiry (stale "logged-in" UI) | Medium | **Fixed** | 1 |
| **P0-O1** | Env name drift: code reads `PORT`, `.env.example` defines `BACKEND_PORT` **[verified]** | Low | **Fixed** | 0 |
| **P1-S6** | Login user-enumeration via timing (no dummy bcrypt on miss) | Low | **Fixed** | 1 |
| **P1-S8** | No frontend role-based route guard | Low | **Fixed** | 1 |
| **P2-CJ2** | Channels grid renders during load; no empty state | Low | **Fixed** | 2 |
| **P2-CJ3** | Dashboard manual refresh shows no loading spinner | Low | **Fixed** | 2 |
| **P2-CJ4** | Audit table ALSO crashes (`reason` col has no def) — re-classified from cosmetic **[parent re-verified]** | High | **Fixed** | 2 |
| **P7-F4** | Error banners lack `role="alert"`/`aria-live` | Low | **Fixed** | 7 |
| **P3-S3** | No business-key unique constraint on notifications (idempotency) | Low | **Deferred** | 3 |
| **P3-F4** | Swagger `LoginDto` example shows real default password | Low | **Fixed** | 3 |
| **P3-F3** | Seed `upsert update:{}` never rotates passwords | Medium | **Fixed** | 3 |
| **P9-O6** | `ThrottlerModule` configured but not enforced (dup of P1-S5) | Low | **Fixed** | 9 |
| **P9-O8** | No graceful shutdown / `enableShutdownHooks` | Low | **Fixed** | 9 |
| **P9-O9** | Nginx proxy missing timeouts / `X-Forwarded-Proto` | Low | **Fixed** | 9 |
| **P0-S3** | `winston` in deps but unused | Low | **Closed** | 0 |
| **P4-CJ1** | `EsbService` fully mocked — likely intentional pre-integration | Medium | **Closed** | 4 |

> **Closed at audit (no action / intentional):** API path alignment is correct
> (`P0-P1`); error filter does not leak stack traces to clients (`P0-E1`); no raw
> SQL injection surface (`P3-CJ7`); no unprotected mutation endpoints exist today
> (`P4-F2`, monitor when TODO controllers gain handlers).

---

### Critical & High — detail

#### P9-O2 — README/Coolify point to deleted `docker-compose.yml` · Critical · [verified]
- **Evidence:** Git: `D docker-compose.yml`, `D docker-compose.yaml`; only `docker-compose.coolify.yml` remains. `README.md:176,276,301` reference `docker-compose.yml` (incl. "Set the Docker Compose file to `docker-compose.yml`"). `.env.example:42` also references it.
- **Impact:** Following the documented deploy path fails (wrong/missing compose file). Release/ops blocker.
- **Recommendation:** Restore/rename to a single canonical compose file OR update all docs to `docker-compose.coolify.yml`. Decide intended file name first.
- **Owner decision:** _pending_ · **Fix:** — · **Tests:** — · **QA:** —

#### P3-O1 — No committed migrations · Critical · [verified]
- **Evidence:** `backend/prisma/` contains only `schema.prisma` + `seed.ts`; no `migrations/` dir. `package.json:21` defines `prisma:migrate`=`migrate deploy` but nothing to apply.
- **Impact:** No versioned schema history; `migrate deploy` is a no-op; reproducible deploys impossible.
- **Recommendation:** Generate + commit an initial migration; adopt `migrate deploy` in entrypoint (pairs with P3-O2).
- **Owner decision:** _pending_

#### P3-O2 — `db push --accept-data-loss` on every start · Critical · [verified]
- **Evidence:** `backend/entrypoint.sh:49` `npx prisma db push --accept-data-loss`.
- **Impact:** A schema change that drops/renames a column can silently destroy production data on redeploy.
- **Recommendation:** Replace with `prisma migrate deploy` (requires P3-O1). Remove `--accept-data-loss` from prod path.
- **Owner decision:** _pending_

#### P3-F1 — Hardcoded demo passwords in seed · Critical · [verified]
- **Evidence:** `seed.ts:49-52` plaintext `Admin@1234`/`Ops@1234`/`Auditor@1234`/`Viewer@1234`; hashed at `:56`. Also surfaced in login UI hint and `login.dto.ts` Swagger example (P3-F4).
- **Impact:** Known admin credentials ship in any deployment seeded with defaults.
- **Recommendation:** Read seed passwords from env; fail (or skip) if unset in prod; remove UI/Swagger hints in prod. Pairs with P3-F2/P3-F3.
- **Owner decision:** _pending_

#### P3-F2 — Seed runs in production every start · Critical · [verified]
- **Evidence:** `entrypoint.sh:58-59` runs `prisma db seed`; `docker-compose.coolify.yml` sets `NODE_ENV=production`. `seed.ts` upserts users unconditionally.
- **Impact:** Demo users (incl. admin) (re)created on prod; combined with P3-F1 = trivial compromise.
- **Recommendation:** Gate seed behind `RUN_SEED=true` or skip when `NODE_ENV=production`.
- **Owner decision:** _pending_

#### P1-S1 — No startup env validation (`JWT_SECRET`, `DATABASE_URL`) · High · [verified]
- **Evidence:** `app.module.ts:24` `ConfigModule.forRoot` with no `validationSchema`; `auth.module.ts:16` & `jwt.strategy.ts:12` read `JWT_SECRET` with no default/check.
- **Impact:** Missing `JWT_SECRET` → app boots but login 500s and all JWT routes 401; no fail-fast. Weak default secret risk.
- **Recommendation:** Add config validation (Joi/Zod) requiring `JWT_SECRET` (min length) + `DATABASE_URL`; abort boot if missing.
- **Owner decision:** _pending_

#### P1-S3 — Roles never enforced (`RolesGuard` dead code) · High · [verified]
- **Evidence:** `backend/src/common/guards/roles.guard.ts` defined; grep shows zero `@Roles`/`RolesGuard`/`APP_GUARD` usages. JWT carries `role` but no route checks it.
- **Impact:** Any authenticated user (e.g. seeded `viewer`) can read audit logs, notifications, dashboard, etc. No privilege separation.
- **Recommendation:** Apply `RolesGuard` + `@Roles(...)` on sensitive reads (audit) and all future mutations. Pairs with P1-S8 (frontend).
- **Owner decision:** _pending_

#### P1-S5 — Login not rate-limited · High · [verified]
- **Evidence:** `app.module.ts:25` `ThrottlerModule.forRoot(...)` but no `ThrottlerGuard`/`@Throttle`/`APP_GUARD` anywhere (grep). Login route unguarded.
- **Impact:** Online brute-force against known seed creds is unthrottled.
- **Recommendation:** Register `ThrottlerGuard` globally + stricter `@Throttle` on login.
- **Owner decision:** _pending_

#### P2-F1 — Sticky error banner after recovery · High · [verified pattern]
- **Evidence:** `notifications.component.ts:53-57` sets `loading=true` but never resets `error`; same in dashboard/providers/channels/notification-detail load paths.
- **Impact:** A transient failure shows an error forever even after data later loads — users believe the app is broken.
- **Recommendation:** Reset `error=''` at start of each load and in success handlers (~10 LOC across 5 components).
- **Owner decision:** _pending_

#### P2-CJ5 — Queue Monitoring screen crashes · High · [verified]
- **Evidence:** `queues.component.ts:22` `columns=[...,'oldestMessageMs','status']` (8) but `queues.component.html` defines 7 `matColumnDef`s with **no** `matColumnDef="status"` (def names are shifted by one). Material throws "Could not find column with id 'status'".
- **Impact:** Queue Monitoring page errors/renders broken.
- **Recommendation:** Fix the column def/name mapping so every entry in `columns` has a matching `matColumnDef` (mirror the audit-table naming cleanup).
- **Owner decision:** _pending_

#### P3-CJ1 — Unbounded dashboard aggregation query · High
- **Evidence:** `dashboard.service.ts:52-55` `findMany` over last-7-day notifications with no `take`; seed inserts 10k rows.
- **Impact:** Loads all matching rows into Node to aggregate in JS — memory/CPU grows with volume; dashboard slows/OOMs at scale.
- **Recommendation:** Use SQL aggregation (`groupBy`/`date_trunc`) instead of in-memory grouping. _Spot-check the exact lines before fixing._
- **Owner decision:** _pending_

#### P10-Q1 — Zero automated tests · High · [verified]
- **Evidence:** No `*.spec.ts` in `backend/` or `frontend/`.
- **Impact:** No regression safety net; cannot claim release-ready from tests.
- **Recommendation:** After functional fixes, add smoke tests for auth, config validation, and the fixed screens. Scope with owner.
- **Owner decision:** _pending_

---

## Release QA Checklist (manual)

> Add a row for every user-visible fix. Do NOT claim release-ready from tests
> alone while unchecked rows remain.

> All rows below are **code-complete + build-verified** but **not yet run against a live Postgres**
> (no DB in this environment). They require a manual pass before declaring release-ready.

| Area | Check | Status | Notes |
|---|---|---|---|
| Auth | Login with valid creds succeeds, token stored | [ ] | |
| Auth | Login with bad creds shows error, no token | [ ] | bad user & bad password indistinguishable (P1-S6) |
| Auth | Empty fields show inline `mat-error` (P7-F1) | [ ] | |
| Auth | Guard redirects unauthenticated to /auth/login | [ ] | |
| Auth | Expired JWT in localStorage → redirect to login (P1-S7) | [ ] | |
| Auth | `viewer` user blocked from /audit (403 + UI redirect) (P1-S3/S8) | [ ] | |
| Auth | 6+ rapid logins → 429 (P1-S5) | [ ] | |
| Auth | Deactivated user's existing token → 401 next request (P1-S4) | [ ] | |
| Config | Backend refuses to boot without `JWT_SECRET` (P1-S1) | [ ] | |
| Config | `GET /api/health` returns 200; Swagger 404 in prod (P9-O5) | [ ] | |
| Deploy | Fresh deploy applies `migrate deploy`; existing DB auto-baselines (P3-O1/O2) | [ ] | |
| Deploy | No seed/users created unless `RUN_SEED=true` (P3-F2) | [ ] | |
| Deploy | Seed in prod fails without `SEED_*_PASSWORD` (P3-F1) | [ ] | |
| Shell | App boots, nav renders, "Soon" badges on preview items (P2-F3) | [ ] | |
| Dashboard | KPIs/charts render; trend correct; refresh shows spinner (P3-CJ1/P2-CJ3) | [ ] | |
| Dashboard | Poll error clears stale KPIs + shows banner (P2-F1/F2) | [ ] | |
| Queues | Queue Monitoring page renders (no column crash) (P2-CJ5) | [ ] | |
| Audit | Audit page renders all columns (no crash) (P2-CJ4) | [ ] | |
| Notifications | Transient error then retry clears banner (P2-F1) | [ ] | |
| Notifications | Paginator resets to page 1 after search (P2-CJ1) | [ ] | |
| Notifications | Row openable via keyboard (Enter/Space) (P2-F4) | [ ] | |
| Notifications | `?page=foo` / `pageSize=999999` → 400/capped (P4-S1) | [ ] | |
| Channels | Empty channel data shows empty state (P2-CJ2) | [ ] | |

---

## Decision Log
- **Owner approved `all`** (fix every finding) — proceeding cluster-by-cluster, verifying live before each edit, no mega-refactors.
- **P9-O2 product decision:** canonical compose file = `docker-compose.coolify.yml` (matches the Coolify deployment intent). Docs updated to it rather than resurrecting duplicate `docker-compose.yml`/`.yaml`.

---

## Fix Log

### Cluster A — Deploy & data safety (Critical)
- **P3-O1 (Fixed):** Generated initial migration offline via `prisma migrate diff --from-empty` →
  `backend/prisma/migrations/0_init/migration.sql` (+ `migration_lock.toml`, provider=postgresql).
- **P3-O2 (Fixed):** `backend/entrypoint.sh` now runs `prisma migrate deploy` (never destructive) instead
  of `db push --accept-data-loss`. Added auto-baseline: on Prisma `P3005` (existing non-empty schema from
  legacy db-push deploys) it runs `migrate resolve --applied 0_init` then re-deploys. Fails loudly on any
  other error.
- **P3-F1 / P3-F3 (Fixed):** `backend/prisma/seed.ts` `seedUsers()` reads passwords from
  `SEED_ADMIN/OPS/AUDITOR/VIEWER_PASSWORD`; dev-only fallbacks used when `NODE_ENV !== production`;
  **throws** in production if a password env is missing. `upsert.update` now rotates `passwordHash`
  (+ profile fields) so re-seeding applies new passwords. Removed demo-credentials hint from
  `frontend/.../login/login.component.html`.
- **P3-F2 (Fixed):** `entrypoint.sh` seed step is now opt-in (`RUN_SEED=true`); skipped by default in prod.
  Documented `RUN_SEED` + `SEED_*_PASSWORD` in `.env.example`.
- **P3-F4 (Fixed):** `backend/src/auth/dto/login.dto.ts` Swagger example changed to `your-password`;
  added `@MaxLength(128)` to username/password.
- **P9-O2 (Fixed):** Updated `README.md` (deploy flow, tree, Coolify step, manual DB commands) and
  `.env.example` to reference `docker-compose.coolify.yml` and the migrate-deploy/opt-in-seed flow.
- **Verification:** `npx tsc --noEmit` (backend) passed. Migration SQL generated with exit 0, no BOM.
  _Not yet runtime-tested against a live Postgres (no DB in this environment) — see QA checklist._

### Cluster B — Auth & access control
- **P1-S1 (Fixed):** Added `backend/src/common/config/env.validation.ts` (`validateEnv`) and wired it into
  `ConfigModule.forRoot({ validate })`. App now fails fast at boot if `JWT_SECRET` (<32 chars) or
  `DATABASE_URL` is missing.
- **P1-S2 (Fixed):** New global `JwtAuthGuard` (`common/guards/jwt-auth.guard.ts`) registered via `APP_GUARD`
  with a `@Public()` decorator (`common/decorators/public.decorator.ts`). Every route now requires auth by
  default; login is the only `@Public` route. (Swagger is served outside the controller layer.)
- **P1-S3 (Fixed):** Registered `RolesGuard` globally via `APP_GUARD`; applied `@Roles(Admin, Auditor)` to
  `AuditController`. Other monitoring reads remain open to any authenticated user (product decision —
  monitoring data is broadly viewable; audit logs are restricted).
- **P1-S4 (Fixed):** `JwtStrategy.validate` now loads the user from the DB and rejects inactive/missing
  users, returning the current role. Deactivation/role change takes effect on the next request.
- **P1-S5 / P9-O6 (Fixed):** Registered `ThrottlerGuard` globally (300/min) and `@Throttle(5/min)` on login.
- **P1-S6 (Fixed):** `AuthService.validateUser` always runs a bcrypt comparison (against a real dummy hash
  when the user is missing) and returns a single generic error → constant-time login path.
- **P4-S1 (Fixed):** Added validated query DTOs (`QueryNotificationsDto`, `QueryAuditDto`,
  `QueryTemplatesDto`) with int coercion, `@Min(1)`, `@Max(100)` page-size caps, `@MaxLength` on strings,
  and `@IsIn(['asc','desc'])` for sort order. Controllers updated to consume them; removed redundant
  per-controller `AuthGuard` class guards (now covered globally).
- **Guard order:** `ThrottlerGuard` → `JwtAuthGuard` → `RolesGuard` (auth populates `req.user` before
  authorization).
- **Verification:** `npx tsc --noEmit` (backend) passed.

### Cluster C — Config / CORS / ops
- **P0-S1 / P0-S2 (Fixed):** `main.ts` CORS now defaults to `http://localhost:4200`, accepts a
  comma-separated allow-list, and only reflects any origin when explicitly set to `*`. `.env.example`
  updated accordingly.
- **P0-O1 (Fixed):** `.env.example` + README renamed `BACKEND_PORT` → `PORT` (the var the app reads).
- **P9-O3 / P9-O4 (Fixed):** `docker-compose.coolify.yml` uses `CORS_ORIGIN: ${CORS_ORIGIN:-}` (single
  canonical name, no hardcoded `134.122.69.38` fallback).
- **P9-O5 (Fixed):** Swagger now only mounts when `NODE_ENV !== production`. Added a public
  `GET /api/health` (`health/health.controller.ts`, version-neutral) and pointed the compose backend
  healthcheck at it instead of `/api/docs`.
- **P9-O8 (Fixed):** `app.enableShutdownHooks()` + `bootstrap().catch()` with non-zero exit on fatal error.
- **P9-O9 (Fixed):** `frontend/nginx.conf` adds `X-Forwarded-Proto` and connect/send/read timeouts on the
  `/api/` proxy.
- **P0-S3 (Closed):** `winston` deps left in place for future structured logging; default Nest logger is
  acceptable today. Low value — closed rather than churning deps.
- **Compose:** added `RUN_SEED` + `SEED_*_PASSWORD` passthrough envs for opt-in seeding.
- **Verification:** `npx tsc --noEmit` (backend) passed.

### Cluster D — Frontend UX / a11y
- **P2-F1 / P2-F2 (Fixed):** `notifications`, `dashboard`, `providers`, `channels`, `queues`, `audit`,
  `notification-detail` now clear `error` at the start of every load and on success, and clear stale
  rows/KPIs on error so an error banner is never shown alongside outdated data.
- **P2-CJ5 (Fixed):** Queue Monitoring crash resolved — renamed the shifted `matColumnDef`s
  (`depthCapacity`, `fillPct`, `drainRate`, `oldestMessage`, `status`) so every entry in the `columns`
  array has a matching def.
- **P2-CJ4 (Fixed, RE-CLASSIFIED High):** Parent spot-check found the **audit table was also crashing** —
  `columns` listed `reason` with no `matColumnDef` (only 6 of 7 defs existed). Renamed defs
  (`action`,`resource`,`resourceId`,`reason`) and dropped the dead `role` column entry. (The original
  subagent call of "renders OK" was wrong; verified live.)
- **P2-CJ1 (Fixed):** Added `[pageIndex]="page"` to the notifications and audit paginators.
- **P2-CJ3 (Fixed):** Dashboard `refresh()` sets `loading = true` before re-fetching.
- **P2-CJ2 (Fixed):** Channels grid gated behind `@if (!loading && !error)` with a new empty state
  (imported `EmptyStateComponent`).
- **P2-F4 (Fixed):** Notification rows are keyboard accessible (`role="button"`, `tabindex="0"`,
  Enter/Space handlers, `aria-label`).
- **P2-F3 (Fixed):** Added a `preview` flag + "Soon" badge to the 7 not-yet-implemented nav items
  (idm, consumer-channels, retry, workload, alerts, sla, reports).
- **P7-F1 (Fixed):** Login shows `mat-error` for required username/password; added aria-label to the
  show/hide password toggle.
- **P7-F4 (Fixed):** Added `role="alert"` to all feature error banners.
- **P1-S7 (Fixed):** `AuthService.isLoggedIn` now decodes the JWT `exp` and treats expired tokens as
  logged-out (guard redirects before the API 401).
- **P1-S8 (Fixed):** New `roleGuard(roles)` (`core/guards/role.guard.ts`) applied to `/audit`
  (`Admin`, `Auditor`) to mirror the backend authorization (P1-S3).
- **Verification:** `npm run build` (Angular production) succeeded.

### Cluster E — Data layer
- **P3-S1 / P3-S2 (Fixed):** Added `@@index([providerId])` and `@@index([consumerChannelId])` to the
  `Notification` model. New migration `prisma/migrations/1_add_notification_fk_indexes/migration.sql`
  (hand-written, matching Prisma's `notifications_<col>_idx` naming) applies on top of the baselined
  `0_init`.
- **P3-CJ1 (Fixed):** `dashboard.service.getCharts` now computes the 7-day trend via a parameterized
  `$queryRaw` (`date_trunc('day', "createdAt")` GROUP BY day/status, `COUNT(*)::int`) instead of loading
  every row into Node — memory stays flat regardless of volume.
- **P3-CJ2 (Fixed):** `notifications.service.findOne` bounds `statusHistory` with `take: 100`.
- **P3-CJ3 (Deferred):** Trigram/GIN indexing for audit ILIKE search needs the `pg_trgm` extension +
  raw migration; low data volume today. Deferred — revisit if audit search latency becomes a problem.
- **P3-S3 (Deferred):** Business-key uniqueness/idempotency on notifications is a product decision and
  existing seed data may contain duplicates; deferred pending owner direction on the canonical idempotency
  key.
- **Verification:** `npx prisma validate` (valid), `npx tsc --noEmit` (passed).

### Cluster F — Tests
- **P10-Q1 (Fixed — foundation):** Established backend test coverage for the highest-risk logic:
  - `common/config/env.validation.spec.ts` — fail-fast env validation (5 cases).
  - `auth/auth.service.spec.ts` — `validateUser`: valid creds strip `passwordHash`; wrong password,
    missing user (asserts constant-time bcrypt compare still runs), and inactive user all reject.
  - **Result:** `npm test` → 2 suites, **9 tests passing**. This removes the "zero tests" release blocker
    and gives a regression net for auth/config. Broader controller/e2e + frontend (karma needs a browser)
    coverage remains a recommended follow-up.

### Cluster G — Close intentional + final verification
- **P4-CJ1 (Closed):** `EsbService` is an intentional, documented mock layer pending real ESB endpoints;
  it is not wired into any controller and no UI shows false success from it (confirmed by the Phase 2/7
  audit). Closed as intentional product state — do not reopen without ESB integration work.
- **Final builds (all green):**
  - Backend: `npx tsc --noEmit` ✓, `npm run build` (nest build) ✓, `npm test` ✓ (9/9).
  - Frontend: `npm run build` (Angular production) ✓.
  - Prisma: `npx prisma validate` ✓.

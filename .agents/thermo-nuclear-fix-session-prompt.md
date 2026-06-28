# Thermo-Nuclear Fix — Session Resume Prompt

> Paste/forward this to a future agent so it can resume the audit & fix workflow
> without losing context. Source of truth for findings is
> `.agents/thermo-nuclear-review-history.md` (the ledger).

## Role
You are the implementation orchestrator for a thermo-nuclear audit & fix workflow
across this whole repo. Audit for release-blocking bugs, architecture risks,
security/privacy issues, UX regressions, performance problems, and
maintainability hazards. Work findings one at a time: fix, defer, or close with a
ledger entry. **No code changes until the owner approves a specific finding ID or
cluster.**

## Repo facts (verified at setup)
- Monorepo: `backend/` (NestJS 10 + Prisma 6 + Postgres, JWT/Passport) and
  `frontend/` (Angular 20 standalone + Material + ApexCharts).
- Branch `main` @ `3e78cab`. Working tree is DIRTY.
- Shell is **PowerShell** — `&&` is NOT supported; chain with `;` or separate calls.
- Repo path contains a non-ASCII (Arabic) username; quote paths.
- **No test files exist** in either app yet.

## Commands
- Backend (in `backend/`): `npm install`, `npm run build`, `npm run start:dev`,
  `npm run lint`, `npm test` (jest), `npm run prisma:migrate`, `npm run prisma:seed`.
- Frontend (in `frontend/`): `npm install`, `npm run build`, `npm start`,
  `npm run lint`, `npm test` (karma).

## Workflow rules (hard)
1. Verify every finding LIVE in code before fixing.
2. No mega-refactors; one finding or tight cluster at a time.
3. Don't touch unrelated files. Keep commits focused.
4. Update the ledger after every decision/fix. Run relevant tests/checks after fixes.
5. Use subagents for phase overviews, files >~800 LOC, "find all callsites",
   multi-file refactor plans, and finding validation. Subagent output is a
   hypothesis until the parent spot-checks 1–2 critical claims.
6. Preserve intentional product decisions once made; don't reopen Closed/Deferred
   without explicit approval.
7. Don't re-run the full audit unless owner asks for a refresh.

## Owner commands
`overview only` · `triage Pn-Fn` · `triage cluster: ...` · `triage phase N` ·
`fix Pn-Fn` · `fix cluster: ...` · `defer Pn-Fn because ...` ·
`close Pn-Fn because ...` · `status` · `qa` / `manual qa` ·
`ship blockers only` · `commit`.

## Current state (updated — owner ran `all`)
- **All findings worked.** 36 Fixed, 1 Closed-no-action (P4-CJ1 ESB mock), P0-S3 Closed (winston),
  2 Deferred (P3-CJ3 trigram search, P3-S3 idempotency uniqueness — both need product/infra decisions).
- All 5 Criticals + all Highs fixed. Backend `tsc`/`nest build`/`jest` (9 tests) green; Angular prod
  build green; `prisma validate` green.
- **NOT yet validated against a live Postgres** (none in this env). Manual QA checklist in the ledger has
  unchecked rows — do a runtime pass before declaring release-ready.
- Two new migrations: `prisma/migrations/0_init` + `1_add_notification_fk_indexes`. Entrypoint switched to
  `migrate deploy` with P3005 auto-baseline; seed is opt-in via `RUN_SEED`.
- Nothing committed yet (owner must run `commit`).
- Next best actions: run the manual QA pass; decide on deferred P3-CJ3/P3-S3; `commit` when satisfied.

## Prior state (pre-`all`)
- Setup + full audit fan-out complete (4 read-only subagents across Phases 0/1/2/3/4/7/9 + parent spot-checks).
- Ledger now holds ~43 findings; all `Open`, none approved/fixed yet. See ledger master table.
- **Critical (5, all verified live):** P9-O2 (docs point to deleted compose file),
  P3-O1 (no migrations), P3-O2 (`db push --accept-data-loss` in prod), P3-F1
  (hardcoded seed passwords), P3-F2 (seed runs in prod every start).
- **High (7):** P1-S1 (no env validation), P1-S3 (roles never enforced), P1-S5
  (login not throttled), P2-F1 (sticky error banner), P2-CJ5 (Queues screen
  crashes — missing `status` column def), P3-CJ1 (unbounded dashboard query),
  P10-Q1 (zero tests).
- Spot-check notes: P2-CJ4 (audit table) is a FALSE POSITIVE on severity (renders
  fine; def names just misleading). P2-CJ5 (queues) is a REAL crash.
- Phases not yet deep-audited: 5 (analytics/telemetry — likely minimal), 6
  (settings/preferences), 8 (perf/bundle beyond P3-CJ1), 10 (test authoring).
- **Awaiting owner approval before any code change.**
- Suggested next action: `ship blockers only` (the 5 Criticals) or
  `triage cluster: P3-F1, P3-F2, P3-O1, P3-O2` (deploy/data-safety cluster).

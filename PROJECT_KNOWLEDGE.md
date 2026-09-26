# Project Knowledge

Last consolidated: 2026-09-26

## Repository Structure

This is a pnpm monorepo:

- `apps/service`: NestJS API using Sequelize and MySQL; owns authentication, authorization, and backend business rules.
- `apps/admin`: React, Vite, TypeScript, and Ant Design administration UI.
- `apps/rental-client`: rental client UI.
- `packages/env` and `packages/error`: shared environment configuration and error handling.
- `scripts/migrations/service/table.sql`: service database schema/migration source; keep it aligned with Sequelize schema changes.
- Append new incremental SQL migrations to the end of `table.sql` under a separator, and include required indexes in the migration script.

## Validation and Change Practices

Run commands from the repository root. Relevant documented checks include:

- `pnpm --dir apps/service build`
- `pnpm --dir apps/admin build`
- `pnpm --dir apps/admin exec tsc --noEmit`

Prefer the narrowest relevant check first. Follow an affected shared contract or user workflow with a production build. Keep edits focused, preserve local TypeScript/NestJS/Sequelize/React patterns, and do not revert unrelated user changes or commit unless asked. On Windows, the documented pnpm executable path is `C:\Users\<user>\AppData\Roaming\npm\pnpm.cmd` if shell execution policy or aliases interfere.

## Backend Invariants

- Protected service requests validate both the access token and active persisted session. Logout soft-deletes the session using `deletedAt`. Keep session schema changes synchronized with the SQL migration.
- Admin and super-admin-only operations need role protection at the controller and service layers where applicable.
- Owner account-isolation POC: the rent-provider HTTP CRUD derives `accountId` from the authenticated token, scopes list/detail/update/delete queries to it, and ignores a body-supplied account ID on writes. Invoice owner projections also scope owner lookups to the authenticated account. The nullable `rent_providers.accountId` column is indexed; legacy rows remain invisible until explicitly assigned. Location, tenant, invoice, and schedule records themselves still need account scoping in later phases.
- Invoices start as `DRAFT`. Only admins and super admins may transition them to `DONE`; `DONE` invoices cannot be reopened or remain assigned to schedules; only `DRAFT` invoices can be scheduled.
- Meter readings cannot decrease. On update, move the former `currentUnit` to `initialUnit` and write the submitted reading to `currentUnit`.
- Invoice schedule cron runs daily at 00:00 UTC (07:00 Vietnam time), selects enabled schedules matching the current `Asia/Ho_Chi_Minh` due day, validates its bearer secret, and sends one Vietnamese summary email. Keep its EmailJS template variables intact.
- Keep the unique `expenses_location(locationCode, expenseCode)` index; add other indexes only for frequent filtering, joins, cleanup, or authorization needs.

## API Contract Workflow

- The `Service Backend` agent works in `apps/service/**`, with shared `packages/**`, required `scripts/migrations/**`, and `docs/openapi.yml` updates allowed when needed. Before finishing each implementation, it must review the OpenAPI document and update it for public endpoint, request, response, or error-contract changes.
- The `Frontend OpenAPI` agent is intended for `apps/admin/**` and `apps/rental-client/**`. It must use `docs/openapi.yml` as the sole source for API paths and request/response contracts, and must not inspect or change service implementation.
- `docs/openapi.yml` documents the service's HTTP API. It currently contains 43 HTTP operations across 29 paths; the separate echo WebSocket on port 8080 is not represented in OpenAPI.

## Known Follow-Up

- OCR rate limiting was requested but not implemented in this conversation. `apps/service/src/common/env.ts` defines AI rate-limit configuration fields (`perMinute` and `perDay`), but a source search found no enforcement. Reuse those settings if implementing the OCR limit, and verify the intended limit scope (per user, IP, or shared) and persistence requirements before choosing storage.

## Knowledge Maintenance

- `.github/instructions/pre-implementation.instructions.md` says to plan first for new features and update project knowledge after implementations.
- Run `/update-project-knowledge` to reconcile durable, verified facts into this file. It is a manually invoked prompt, not an automatic end-of-chat hook. Do not record secrets, credentials, personal data, assumptions as facts, or routine chat summaries.

# Project Knowledge

Last consolidated: 2026-09-27

## Repository Structure

This is a pnpm monorepo:

- `apps/service`: NestJS API using Sequelize and MySQL; owns authentication, authorization, and backend business rules.
- `apps/admin`: React, Vite, TypeScript, and Ant Design administration UI.
- `apps/rental-client`: rental client UI.
- `packages/env` and `packages/error`: shared environment configuration and error handling.
- `scripts/migrations/service/table.sql`: service database schema/migration source; keep it aligned with Sequelize schema changes.
- Append new incremental SQL migrations to the end of `table.sql` under a separator, and include required indexes in the migration script.
- The legacy location/tenant/invoice/expense account backfill in `table.sql` is plain SQL using `@targetAccountId`; set it to the chosen existing `accounts.id` before running, and keep all four updates transactional.

## Validation and Change Practices

Run commands from the repository root. Relevant documented checks include:

- `pnpm --dir apps/service build`
- `pnpm --dir apps/admin build`
- `pnpm --dir apps/admin exec tsc --noEmit`

Prefer the narrowest relevant check first. Follow an affected shared contract or user workflow with a production build. Keep edits focused, preserve local TypeScript/NestJS/Sequelize/React patterns, and do not revert unrelated user changes or commit unless asked. On Windows, the documented pnpm executable path is `C:\Users\<user>\AppData\Roaming\npm\pnpm.cmd` if shell execution policy or aliases interfere.

## Admin UI

- `apps/admin/src/pages/Dashboard.tsx` switches between desktop and mobile shells using `matchMedia("(max-width: 767px)")`; the mobile shell retains the shared nested route outlet and role-filtered dashboard menu. Keep its app bar `#474747`, navigation surface `#2f3330`, and primary accent `#4CAF50` aligned with the desktop shell.
- List cards in the location, provider, tenant, and expense pages use shared `.list-page-header`, `.list-page-heading`, and `.list-page-actions` classes from `apps/admin/src/App.css` to stack page descriptions above wrapping controls. `.list-page-search` flexes into the available action-row width.
- The LocationList horizontal card strip uses `.location-card-list` to bound overflow to the list itself; card children use `flex: 0 0 auto` so horizontal scrolling does not resize them or widen the page.
- `BaseTable` accepts an optional Ant Design `scroll` configuration. Tenant, rent-provider, and expense list pages opt into `scroll={{ x: "max-content" }}` inside `.list-page-table-scroll`; other `BaseTable` consumers retain default behavior unless they pass this prop.

## Backend Invariants

- Protected service requests validate both the access token and active persisted session. Login reuses the account's newest non-deleted, unexpired session and returns a token with the same session ID and expiry; otherwise it creates a session. Logout soft-deletes the session using `deletedAt`. Keep session schema changes synchronized with the SQL migration.
- Admin and super-admin-only operations need role protection at the controller and service layers where applicable.
- Account isolation: rent providers, locations, tenants, invoices, and expenses derive `accountId` from the authenticated token, scope dashboard CRUD and projections to it, and ignore client-supplied ownership on writes. Each table has a nullable, indexed `accountId`; legacy rows remain invisible until explicitly assigned. Tenant-location, location-owner, and location-expense relationships must be same-account. Dashboard invoice schedules are filtered through owned locations; the internal cron summary intentionally remains system-wide.
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

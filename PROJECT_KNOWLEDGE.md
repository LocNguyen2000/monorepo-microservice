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

- `apps/admin/src/pages/Dashboard.tsx` switches between desktop and mobile shells using `matchMedia("(max-width: 767px)")`; the mobile shell retains the shared nested route outlet and role-filtered dashboard menu. Keep both shells aligned with the shared ink, forest-green, vermilion, and paper palette.
- The admin UI uses a Japanese-inspired shared theme: ink text, forest-green primary/navigation, vermilion accents, and light paper surfaces. Keep Ant Design tokens in `apps/admin/src/css/theme.ts`, shell colors in `apps/admin/src/css/layout.ts`, and shared surface/background styling in `apps/admin/src/App.css`; preserve the existing Vietnamese UI copy and behavior.
- List cards in the location, provider, tenant, and expense pages use shared `.list-page-header`, `.list-page-heading`, and `.list-page-actions` classes from `apps/admin/src/App.css` to stack page descriptions above wrapping controls. `.list-page-search` flexes into the available action-row width.
- Tenant and rent-provider detail dialogs use vertical, sectioned forms with responsive Ant Design columns and explicitly enable `requiredMark`; keep text, date, and numeric controls full-width and let long tenant forms scroll within a viewport-bounded content area.
- The Guidance tab's process steps link to existing admin routes and use `PathContext.setPathFromKey` with `MENU_LIST` keys to keep the sidebar selection synchronized; its six-step flow is location, provider, tenant, expense, invoice, then schedule.
- The LocationList horizontal card strip uses `.location-card-list` to bound overflow to the list itself; card children use `flex: 0 0 auto` so horizontal scrolling does not resize them or widen the page.
- `BaseTable` accepts an optional Ant Design `scroll` configuration. Tenant, rent-provider, and expense list pages opt into `scroll={{ x: "max-content" }}` inside `.list-page-table-scroll`; other `BaseTable` consumers retain default behavior unless they pass this prop. These three listings omit their entity-code columns, keep the name column fixed left, and opt into `fixedActionColumn` to pin the action column right. Their add forms calculate the next numeric code as max + 1 across all pages from the paginated list endpoint and disable the code field in both add and edit forms.
- The invoice editor at `apps/admin/src/pages/invoice/InvoicePage.tsx` uses labeled read-only summaries for location and tenant data. Its `.invoice-editor-layout` grid has three desktop columns, two columns with expenses spanning the row at tablet widths, and a single-column mobile layout; selection and expense-edit controls remain interactive.
- The invoice page exposes `.invoice-page-tabs`. The meter-reading operator workspace uses `.operator-workspace-tabs` for a light, bounded tab surface and contrasting green active state over the photo background; preserve its existing narrow-screen horizontal scrolling. `.operator-workspace` uses `min-height: 100vh` and content-driven height so the background covers long tab content.
- The invoice expense edit drawer uses a viewport-bounded width, footer actions, responsive Ant Design column spans, and constrained processed-reading JSON. Keep its upload, meter inputs, and result panel inside the drawer on narrow screens.
- The profile and account-management page at `apps/admin/src/pages/MyProfile.tsx` presents its profile metadata, role/status labels, account table, and action feedback in Vietnamese. Preserve the existing API and permission behavior when changing these labels.

## Backend Invariants

- Protected service requests validate both the access token and active persisted session. Login reuses the account's newest non-deleted, unexpired session and returns a token with the same session ID and expiry; otherwise it creates a session. Logout soft-deletes the session using `deletedAt`. Keep session schema changes synchronized with the SQL migration.
- Admin and super-admin-only operations need role protection at the controller and service layers where applicable.
- Account isolation: rent providers, locations, tenants, invoices, and expenses derive `accountId` from the authenticated token, scope dashboard CRUD and projections to it, and ignore client-supplied ownership on writes. Each table has a nullable, indexed `accountId`; legacy rows remain invisible until explicitly assigned. Tenant-location, location-owner, and location-expense relationships must be same-account. Dashboard invoice schedules are filtered through owned locations; the internal cron summary intentionally remains system-wide.
- Super administrators can claim unassigned tenants, locations, invoices, and rent providers through `PATCH /admin/resources/{resourceType}/{resourceId}/account`. The API validates linked ownership, permits idempotent assignment to the same account, and rejects reassignment to a different account. It reuses existing `accountId` columns and requires no migration.
- Invoices start as `DRAFT`. Only admins and super admins may transition them to `DONE`; `DONE` invoices cannot be reopened or remain assigned to schedules; only `DRAFT` invoices can be scheduled.
- Meter readings cannot decrease. On update, move the former `currentUnit` to `initialUnit` and write the submitted reading to `currentUnit`.
- Invoice schedule cron runs daily at 00:00 UTC (07:00 Vietnam time), selects enabled schedules matching the current `Asia/Ho_Chi_Minh` due day, validates its bearer secret, and sends one Vietnamese summary email. Keep its EmailJS template variables intact.
- Keep the unique `expenses_location(locationCode, expenseCode)` index; add other indexes only for frequent filtering, joins, cleanup, or authorization needs.

## API Contract Workflow

- The `Service Backend` agent works in `apps/service/**`, with shared `packages/**`, required `scripts/migrations/**`, and `docs/openapi.yml` updates allowed when needed. Before finishing each implementation, it must review the OpenAPI document and update it for public endpoint, request, response, or error-contract changes.
- The `Frontend OpenAPI` agent is intended for `apps/admin/**` and `apps/rental-client/**`. It must use `docs/openapi.yml` as the sole source for API paths and request/response contracts, and must not inspect or change service implementation.
- `docs/openapi.yml` documents the service's HTTP API, including super-admin resource account assignment. The separate echo WebSocket on port 8080 is not represented in OpenAPI.

## Known Follow-Up

- OCR rate limiting was requested but not implemented in this conversation. `apps/service/src/common/env.ts` defines AI rate-limit configuration fields (`perMinute` and `perDay`), but a source search found no enforcement. Reuse those settings if implementing the OCR limit, and verify the intended limit scope (per user, IP, or shared) and persistence requirements before choosing storage.

## Knowledge Maintenance

- `.github/instructions/pre-implementation.instructions.md` says to plan first for new features and update project knowledge after implementations.
- Run `/update-project-knowledge` to reconcile durable, verified facts into this file. It is a manually invoked prompt, not an automatic end-of-chat hook. Do not record secrets, credentials, personal data, assumptions as facts, or routine chat summaries.

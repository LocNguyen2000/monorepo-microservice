# Project Agent Guide

## Repository

This is a pnpm monorepo containing:

- `apps/admin`: React, Vite, TypeScript, Ant Design admin UI
- `apps/rental-client`: rental client UI
- `apps/service`: NestJS, Sequelize, MySQL API service
- `packages/env`: shared environment configuration
- `packages/error`: shared error handling

Use existing local patterns and keep changes focused on the requested feature.

## Commands

Run commands from the repository root:

```text
pnpm --dir apps/admin build
pnpm --dir apps/service build
pnpm --dir apps/admin exec tsc --noEmit
```

On Windows PowerShell, invoke pnpm directly when execution policy or shell aliases interfere:

```text
C:\Users\<user>\AppData\Roaming\npm\pnpm.cmd --dir <path> build
```

Always run the narrowest relevant validation after editing, followed by a production build when the change affects a shared contract or user workflow.

## Editing Rules

- Preserve existing TypeScript, React, NestJS, Sequelize, and Ant Design patterns.
- Keep public APIs and unrelated formatting unchanged unless the feature requires otherwise.
- Use ASCII by default when creating files.
- Do not add comments unless they explain genuinely non-obvious logic.
- Do not commit changes or create branches unless explicitly requested.
- Do not revert user changes or unrelated dirty-worktree changes.
- Prefer small, reversible edits and validate immediately after the first substantive edit.

## Service Authentication

- Authentication is handled by `apps/service`.
- Login creates a persisted session and returns a `sessionId` with the access token.
- The session is represented by `apps/service/src/common/schema/auth/session.ts`.
- Protected requests must validate the token and active session.
- Logout soft-deletes the session by setting `deletedAt`.
- Keep session schema changes synchronized with `scripts/migrations/service/table.sql`.
- Admin and super-admin-only actions must be protected with `Roles(...)` in the controller and checked in the service when needed.

## Invoice Workflow

- Invoice statuses are enumerated as `DRAFT` and `DONE`.
- New invoices start as `DRAFT`.
- Only administrators and super administrators may change an invoice from `DRAFT` to `DONE`.
- A `DONE` invoice cannot be reopened.
- A `DONE` invoice must not remain assigned to an invoice schedule.
- Only `DRAFT` invoices may be assigned to schedules.
- Enforce these rules in the service API as well as in the UI.

## Invoice Schedule Cron

- Vercel runs `/internal/cron/invoice-schedules` daily at `0 0 * * *` UTC, which is 07:00 in Vietnam.
- The cron route is public to the application auth guard but must validate the `Authorization: Bearer <CRON_SECRET>` header.
- The job selects schedules where `enabled` is `true` and `dueDay` matches the current date in `Asia/Ho_Chi_Minh`.
- The job sends one Vietnamese summary email to `mailjs.adminEmail` through the `mailjs.template.invoiceSchedule` EmailJS template.
- Keep the EmailJS template source in `scripts/migrations/emailjs/invoice-schedule-summary.html` and preserve these variables: `{{email}}`, `{{schedule_date}}`, `{{schedule_count}}`, and `{{schedule_list}}`.
- Configure `CRON_SECRET` in Vercel environment variables. Do not expose it in repository configuration.

## Meter Readings

- Meter updates are handled by `LocationsService.updateMeterReading`.
- A submitted reading cannot be lower than the previous reading.
- On update, write the previous `currentUnit` into `initialUnit` and the submitted value into `currentUnit`.
- Return both values when useful to the client.

## Admin UI

- Admin UI pages use React, TypeScript, Ant Design, and shared global context.
- Keep role restrictions in route guards and service controller decorators.
- Location Operators use the operator workspace on `MeterReadingPage`, which contains meter reading, invoice, invoice status, and schedule tabs.
- Payment status updates remain restricted to admins and super admins.
- Responsive layouts must work on desktop and narrow screens.
- Prefer wrapping, stacking, bounded widths, and horizontal scrolling for wide tables/tabs instead of fixed viewport geometry.
- Keep repeated page surfaces readable over the shared operator background; cards and controls may retain their own contrast styling.
- User-facing text on the meter reading page is Vietnamese.

## Database and Indexes

- Use Sequelize models in `apps/service/src/common/schema`.
- Keep SQL changes in `scripts/migrations/service/table.sql`.
- Primary keys and unique fields are indexed automatically by MySQL.
- The `expenses_location(locationCode, expenseCode)` pair must remain uniquely indexed because meter readings look up that pair.
- Add additional indexes only for fields used frequently in filtering, joining, cleanup, or authorization checks.

## Change Completion Checklist

Before finishing a coding task:

1. Trace the owning code path and identify the smallest controlling change.
2. Edit only the relevant files.
3. Run a focused type check, test, or build.
4. Check touched files for diagnostics.
5. Mention any skipped validation or required database migration in the final response.

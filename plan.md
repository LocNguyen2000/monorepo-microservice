# Owner Account Isolation POC

## Goal

Scope rent-provider (owner) records to the authenticated account, preventing one account from listing, reading, updating, or deleting another account's owners. Add an `accountId` database index for this access pattern.

## Implementation

1. Add nullable `accountId` to the rent-provider Sequelize schema and append a separated SQL migration at the end of `table.sql`, including its index.
2. Read the authenticated account ID from requests and pass it to owner CRUD and invoice owner projections.
3. Assign ownership from authenticated context on create; scope list, detail, update, and delete queries by both record ID and account ID. Do not trust a body-supplied account ID.
4. Review the service OpenAPI contract and repository knowledge after implementation.

## Verification

- Run the service build and focused diagnostics for changed files.
- Verify owner HTTP query paths and invoice owner projections consistently include `accountId`; leave unrelated entity scoping for a later phase.

## Owner POC Legacy Data

Existing owner rows need an explicit account assignment before their data can be visible under account-scoped queries. Do not infer ownership or expose unassigned rows. At the end of the owner-only POC, location, tenant, invoice, and schedule data remained outside its scope; the next section records the follow-up for locations, tenants, and invoices.

# Location, Tenant, and Invoice Account Isolation

## Goal

Extend account isolation to locations, tenants, and invoices. Derive account ownership from the authenticated request, never from a client-supplied `accountId`.

## Implementation

1. Add nullable `accountId` fields and Sequelize indexes to the location, tenant, and invoice schemas; append one separated SQL migration at the end of `table.sql` with all three columns and indexes.
2. Pass the authenticated account ID through location, tenant, and invoice controllers and scope every corresponding create, list, detail, update, delete, status, and child-data operation.
3. Validate relationships at write and read boundaries: locations may reference only same-account owners; tenant-location assignments must join same-account records; invoices and invoice expenses must belong to same-account locations/invoices.
4. Scope invoice schedule UI operations and notifications through owned locations; do not add `accountId` to schedules in this phase.
5. Gate location stored-procedure reads behind an account-scoped location lookup; update OpenAPI and repository knowledge for the new ownership fields and filtering behavior.

## Verification

- Run the service build and diagnostics for changed TypeScript, OpenAPI, and SQL files.
- Audit all controller-to-service paths and linked-record lookups for account filtering; confirm no request body can override ownership.

## Legacy Data

Existing locations, tenants, and invoices remain invisible to account-scoped endpoints until explicitly assigned to an account. Do not infer ownership from unrelated records or expose unassigned rows.

# Legacy Data Account Backfill

## Goal

Provide a safe one-time migration to assign all existing locations, tenants, invoices, and expenses to one explicitly selected account.

## Implementation

1. Append a separated plain-SQL backfill transaction to `scripts/migrations/service/table.sql`, including an indexed `expenses.accountId` column migration.
2. Require the operator to set an existing account ID in a session variable and show a preflight account lookup; each update joins to `accounts`, so an invalid or missing ID changes no rows.
3. Update all rows in the four requested tables in one transaction and return per-table affected-row counts. Never use a hard-coded account ID.

## Verification

- Check SQL diagnostics and verify the account validation, transaction, and four table updates are present.
- Do not execute the data migration against the configured database.

# Expense Account Isolation

## Goal

Make expense data visible only to the account that owns it, including through location assignments and invoice creation.

## Implementation

1. Add indexed nullable `accountId` to the expense model and SQL schema migration.
2. Derive expense CRUD ownership from the authenticated request and scope every query/write to that account.
3. Validate expense ownership before assigning expenses to locations or creating invoice snapshots; filter location expense associations to the same account.
4. Update OpenAPI and repository knowledge to document the account-owned expense API.

## Verification

- Run the service build and diagnostics for touched TypeScript, SQL, and OpenAPI files.
- Audit expense controller paths and location/invoice expense link paths for account filtering.

# Reuse Active Login Sessions

## Goal

When an active account logs in again, reuse its existing session and return the same access token instead of creating a new session.

## Implementation

1. Query for the account's newest session that is not deleted and has not expired.
2. Rebuild the existing token from its session ID and original expiry; create a session only when no active session exists.
3. Keep the session schema and API response unchanged.

## Verification

- Build the service TypeScript project.
- Check diagnostics for the modified service file.

# Mobile Admin Dashboard

## Goal

Render a dedicated mobile dashboard shell when the viewport is in the mobile range, while preserving the existing desktop dashboard and route content.

## Implementation

1. Detect viewport changes with `matchMedia` at the mobile width boundary (`max-width: 767px`).
2. Add a mobile shell with compact page identity, account actions, and role-filtered navigation for the existing dashboard routes.
3. Keep authentication, route permissions, and the shared nested route outlet unchanged.
4. Match the mobile header and navigation surfaces to the existing desktop dashboard colors and text contrast.

## Verification

- Run the admin TypeScript check and production build.
- Confirm the mobile navigation adapts as the viewport crosses the breakpoint and preserves current route selection.

# List Page Header Controls

## Goal

Place list-page search and action controls below each page title and description.

## Implementation

1. Apply a shared vertical header layout to the location, provider, tenant, and expense list cards.
2. Keep controls together in a wrapping action row, with search fields allowed to shrink to the available width.
3. Constrain the LocationList card strip to its parent and enable horizontal scrolling within that strip.

## Verification

- Run the admin TypeScript check and production build.
- Review the affected headers at narrow viewport widths for overflow.
- Confirm LocationList cards scroll inside their list container without widening the page.

# List Card Table Scrolling

## Goal

Keep wide tenant, rent-provider, and expense tables scrollable within their own cards instead of widening the page.

## Implementation

1. Allow `BaseTable` to accept Ant Design's optional table scroll configuration.
2. Enable intrinsic-width horizontal scrolling only for the tenant, rent-provider, and expense list tables.
3. Bound each table scroll region to its card width.

## Verification

- Run the admin TypeScript check and production build.
- Check diagnostics for the shared table and the three list pages.

# Tenant, Provider, and Expense Table Columns

## Goal

Hide entity code columns from tenant, rent-provider, and expense listings while keeping identifying data available in records and forms. Keep each listing's name column fixed on the left and action column fixed on the right during horizontal scrolling.

## Implementation

1. Remove tenant, provider, and expense code columns from their shared listing column definitions.
2. Fix the provider and expense name columns on the left alongside the already-fixed tenant name column.
3. Add an opt-in fixed-right action column to `BaseTable` and enable it only for these three listing tables.

## Verification

- Run the admin TypeScript check and production build.
- Check diagnostics for the shared table and column definitions.

# Tenant and Rent Provider Detail Forms

## Goal

Improve the tenant and rent-provider detail dialogs' visual hierarchy and responsiveness without changing their data or submission behavior.

## Implementation

1. Replace fixed horizontal label layouts with responsive grouped form sections and aligned fields.
2. Improve dialog titles and content spacing while preserving all existing controls and handlers.
3. Keep the tenant form content naturally scrollable instead of tying its height to a fixed viewport value.
4. Explicitly display required-field markers on both detail forms.

## Verification

- Run the admin TypeScript check and production build.
- Check diagnostics for the two changed form components.

# Generate Entity Codes in Add Forms

## Goal

Disable tenant, rent-provider, and expense code inputs and prefill the next code from the maximum existing code plus one.

## Implementation

1. Reuse paginated list endpoints to load all current records when an add form is opened, then calculate numeric max + 1.
2. Make the shared code generation handle numeric and numeric-string codes; preserve expense codes as strings where required by the UI type.
3. Disable code inputs in add and edit forms and remove manual code-generation controls.

## Verification

- Run the admin TypeScript check and production build.
- Check diagnostics for the shared utility and the three list/detail flows.

# Invoice Location and Tenant Panels

## Goal

Make the location and tenant sections of the invoice editor easier to scan and more visually balanced across desktop and mobile.

## Implementation

1. Replace disabled read-only form controls with compact labeled summaries while preserving displayed location and tenant data.
2. Give the location selector a clear panel header and arrange editor columns with flexible sizing; retain the existing mobile stacking behavior.
3. Add focused styling for location and tenant summaries without changing invoice behavior or API contracts.

## Verification

- Run the admin TypeScript check and production build.
- Check touched files for diagnostics and review the resulting diff.

# Responsive Expense Edit Drawer

## Goal

Keep the invoice expense editor usable on narrow screens without horizontal overflow or crowded drawer actions.

## Implementation

1. Constrain the drawer width to the viewport and place its actions in a responsive footer.
2. Reflow meter inputs, upload control, and processed image data across desktop, tablet, and mobile breakpoints.
3. Bound processed JSON content so it wraps or scrolls within the drawer.

## Verification

- Run the admin TypeScript check and production build.
- Check touched files for diagnostics and whitespace errors.

# Account-Level Read Sharing

## Goal

Allow an account to share its account-owned data with another account, without assigning individual resources to the recipient. Resource ownership remains on the original account; shared accounts gain read-only visibility.

## Implementation

1. Add an indexed account-share relation storing the owner account and the account granted access, with endpoints for an account to list, create, and revoke its shares.
2. Resolve readable owner account IDs from the authenticated account and apply them to tenant, location, expense, invoice, rent-provider, and related read queries. Keep all create, update, and delete operations restricted to the caller's own account.
3. Replace the per-resource assignment endpoint and document account-share request, response, authorization, and read-only behavior in OpenAPI.
4. Update durable repository knowledge after implementation.

## Verification

- Run the service TypeScript build and diagnostics on changed files.
- Validate OpenAPI and verify reads include owner and shared accounts while writes remain scoped to the authenticated account.

# Invoice Tab Contrast

## Goal

Make the invoice page tabs and active selection readable over the page background.

## Implementation

1. Scope an explicit class to the invoice page tabs.
2. Add a high-contrast tab surface and distinct active-state styling without changing tab behavior.

## Verification

- Run the admin TypeScript check and check diagnostics for touched files.

# Meter Reading Tab Contrast

## Goal

Make the meter-reading workspace tabs readable over the photographic background and clearly identify the active view.

## Implementation

1. Apply the invoice tab contrast treatment to the operator workspace tab bar.
2. Preserve the existing centered desktop navigation and narrow-screen horizontal scrolling.

## Verification

- Check diagnostics for the stylesheet and run the admin TypeScript check.

# Meter Reading Background Height

## Goal

Keep the meter-reading workspace background image visible across the full viewport and all page content.

## Implementation

1. Replace the fixed workspace height with a full-viewport minimum height and content-driven growth.

## Verification

- Check diagnostics for the stylesheet.

# Account Resource Assignment UI

## Goal

Expose the super-admin resource-to-account assignment API from account management.

## Implementation

1. Add a super-admin-only form to choose one of the API-supported resource types, enter its ID, and select a target account.
2. Call the documented assignment endpoint and surface success or API errors using existing page conventions.

## Verification

- Run the admin TypeScript check and check diagnostics for touched files.

# Vietnamese Profile Page

## Goal

Present the profile and account-management page in Vietnamese while keeping its existing behavior unchanged.

## Implementation

1. Translate profile metadata, account table columns, role and status labels, actions, empty state, and fallback notifications.
2. Keep API paths, role checks, and account state updates unchanged.

## Verification

- Run the admin TypeScript check and check diagnostics for the page.

# Guidance Process Screen

## Goal

Replace the static guidance list with a visual, responsive business-process flow whose steps navigate to their existing admin pages.

## Implementation

1. Show a single sequence: Location → Rent Provider → Tenant → Expense → Invoice → Schedule.
2. Use Ant Design icons, existing `DASHBOARD_ROUTES`, and `PathContext.setPathFromKey` so each step links to the page and synchronizes the selected sidebar item.
3. Add hover and keyboard-focus affordances with concise step descriptions; preserve the existing concepts panel.
4. Reflow the process for narrow screens without horizontal page overflow. Do not change route definitions, permissions, or APIs.

## Verification

- Run the admin TypeScript check and production build.
- Verify all six navigation targets and sidebar selection, hover/focus behavior, keyboard activation, and narrow-screen layout.

# Japanese-Inspired Admin Theme

## Goal

Give the admin application a cohesive contemporary Japanese-inspired visual style while preserving its Vietnamese UI copy and existing workflows.

## Implementation

1. Refresh shared Ant Design color, typography, border, and surface tokens with an ink, forest-green, vermilion, and light-paper palette.
2. Align desktop navigation/header/footer, mobile dashboard, login screen, and location-operator workspace with the same palette and subtle geometric paper texture.
3. Apply restrained shared surface styling to common Ant Design cards, forms, tables, and controls; preserve component behavior, copy, routing, and role restrictions.

## Verification

- Run admin TypeScript diagnostics and production build.
- Review global color contrast and desktop/mobile layouts across the shared shells.

# Expo Rental Client Migration

## Goal

Replace the existing Next.js rental client with a native Expo mobile app centered on the operator workspace currently shown by the admin meter-reading page.

## Implementation

1. Remove the current rental-client web pages, components, and Next.js setup; configure the Expo application entry, routing, native app metadata, dependencies, and scripts.
2. Port the meter-reading workflow to native controls: authenticated location/expense selection, camera or image-library capture for OCR, reading validation and submission, and logout.
3. Preserve the operator workspace's invoice creation/status and schedule tabs using only API paths and contracts documented in `docs/openapi.yml`.
4. Store session credentials using platform-secure storage and source API endpoint configuration without embedding secrets in the mobile bundle.
5. Update project knowledge with the confirmed Expo app structure and verification commands.

## Verification

- Run the rental-client TypeScript check and Expo production/export validation.
- Check changed-file diagnostics and confirm no Next.js-only imports or web-only camera APIs remain.
- Do not alter the admin meter-reading page or service API contract.

# Rental Client Next.js Removal

## Implementation

1. Remove Next.js scripts, dependencies, configuration, generated type references, and app-specific files.
2. Remove remaining Next.js imports from retained rental-client utilities without removing the requested hooks, helpers, clients, or HOCs.
3. Update the lockfile and verify the rental-client package no longer references Next.js.

## Verification

- Run the rental-client build and check changed-file diagnostics.
- Search the rental-client source and configuration for remaining Next.js references.

# Service API Origin Allowlist

## Implementation

1. Replace unrestricted HTTP API CORS with an explicit `CORS_ORIGINS` allowlist for the admin and rental-client deployments.
2. Apply the same origin restrictions to the service WebSocket and document the required environment configuration.
3. Update project knowledge with the service origin policy.

## Verification

- Build the service and check changed-file diagnostics.
- Confirm no wildcard CORS configuration remains in the service.
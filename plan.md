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
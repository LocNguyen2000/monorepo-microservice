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

## Legacy Data

Existing owner rows need an explicit account assignment before their data can be visible under account-scoped queries. Do not infer ownership or expose unassigned rows. Invoice/location/tenant/schedule records themselves remain outside this owner-only POC and need account scoping in a follow-up phase.

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
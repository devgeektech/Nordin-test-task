# Companies

Small companies list for the Next.js assessment. No real backend — Route Handlers + an in-memory array.

## Run

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Sign in with any token (the field is prefilled).

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

To see a 409: open the same company in two tabs, save in one, then save in the other.

## Decisions

- Components talk to a typed client (`listCompaniesOptions`, `companyOptions`), not `fetch`. That’s how the real app uses the OpenAPI client.
- Filters, sort, page and the open drawer live in the URL so refresh and back work. That object is also the query key.
- Data sits on `globalThis` because separate route bundles would each get their own array. Seed ids are fixed so shared links still work after a restart.
- `keepPreviousData` so the table does not disappear when you change a filter.
- PATCH sends the version from when the form opened, not whatever is in the cache later. Otherwise a refetch can hide a conflict.
- No extra libs (nuqs, next-intl, dialog kits).

## With more time

Locale routes (`/en`, `/nl`) so we don’t ship both languages. A real IdP instead of sessionStorage. Prefetch the first list on the server. Playwright for the two-tab 409. On reload, keep only fields the user actually changed.

## Left out

No optimistic UI (optimistic here means the version check). No orgs/permissions. No delete, no e2e, no polish.

Restarting the server resets the data. That’s expected.

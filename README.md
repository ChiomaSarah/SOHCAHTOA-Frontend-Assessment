# SohCahToa Frontend Assessment

A secure fintech transaction monitoring dashboard built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and Redux Toolkit.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials

| Role    | Email                 | Password   |
| ------- | --------------------- | ---------- |
| Admin   | admin@sohcahtoa.com   | admin123   |
| Analyst | analyst@sohcahtoa.com | analyst123 |

> Only **admin** users can flag transactions.

## Project Structure

app/
login/ → Public login page
dashboard/ → Protected dashboard
layout.tsx → Dashboard shell (sidebar + topbar)
page.tsx → Main dashboard page
api/
auth/
login/ → POST /api/auth/login
logout/ → POST /api/auth/logout
refresh/ → POST /api/auth/refresh
transactions/
route.ts → GET /api/transactions
stream/ → GET /api/transactions/stream (SSE)
[id]/ → PATCH /api/transactions/:id
appStore/
authSlice.ts → Auth state
provider.ts → Redux provider wrapper
store.ts
transactionsSlice.ts → Transactions state
components/
Sidebar.tsx → Navigation sidebar
Topbar.tsx → Top navigation bar
Greeting.tsx → Dynamic time-based greeting
VisaCard.tsx → Prepaid card component
TransactionRow.tsx → Transaction list item
TransactionDetailsPanel.tsx → Transaction details panel
Pagination.tsx
hooks/
useTransactionStream.ts → SSE real-time hook
lib/
mockData.ts → Simulated transaction data
fetchWithAuth.ts → Authenticated fetch with refresh

## Architecture Decisions

### Authentication

JWT-style tokens are simulated and stored in **httpOnly cookies** — never exposed to JavaScript. This prevents XSS-based token theft. Cookies are configured with:

- `httpOnly: true` — not accessible via `document.cookie`
- `sameSite: strict` — prevents CSRF attacks
- `secure: true` in production — HTTPS only

### Token Refresh & Race Condition Prevention

When an access token expires (401 response), `fetchWithAuth.ts` handles refresh automatically:

- A single `isRefreshing` flag ensures **only one refresh call** is made at a time
- Subsequent requests that also get a 401 are **queued** while refresh is in progress
- Once refresh succeeds, all queued requests are **replayed** with the new token
- If refresh fails → cookies are cleared → user is redirected to `/login`

### CSRF Mitigation

- Cookies use `sameSite: strict` which prevents cross-origin requests from including cookies
- All mutation endpoints (login, logout, refresh, PATCH) use `POST`/`PATCH` methods
- No GET endpoints perform mutations

### XSS Prevention

- Transaction data is rendered using React JSX text content — **never** `dangerouslySetInnerHTML`
- One transaction intentionally contains `<script>alert("xss")</script>` — it renders as plain text, confirming protection
- Tokens are stored in httpOnly cookies — inaccessible to JavaScript

### Caching Strategy

- `/api/transactions` uses `Cache-Control: no-store` — transaction data is real-time sensitive and must never be cached
- `/api/transactions/stream` uses `Cache-Control: no-cache` — SSE requires a persistent fresh connection
- Static assets (fonts, images) use Next.js default caching

### Real-Time Updates

Server-Sent Events (SSE) stream new transactions every 8 seconds via `/api/transactions/stream`. The `upsertTransaction` Redux action prevents duplicates by checking existing IDs before inserting.

### Role-Based Access

- `admin` — can flag transactions and add notes
- `analyst` — can only view transactions and add notes
- Role is stored in Redux state and checked client-side in `TransactionPanel`
- Role is derived from the authenticated user returned by `/api/auth/login`

### Sensitive Data Masking

- Card numbers are masked as `•••• •••• •••• XXXX` — only last 4 digits shown
- Access tokens are never logged or exposed to the client via JavaScript
- Cookies are httpOnly — invisible to `document.cookie`

### Middleware

`middleware.ts` runs at the **Edge runtime** and:

- Protects all `/dashboard/*` routes
- Redirects unauthenticated users to `/login`
- Redirects authenticated users away from `/login`
- Preserves the original URL in `?from=` for post-login redirect
- Excludes static files and API routes from matching

## Deployment

Deployed on Vercel: [https://sohcahtoa-frontend-assessment.vercel.app/]

# SohCahToa Frontend Assessment

A secure fintech transaction monitoring dashboard built with **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS v4**, and **Redux Toolkit**.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Credentials

| Role    | Email                 | Password   |
| ------- | --------------------- | ---------- |
| Admin   | admin@sohcahtoa.com   | admin123   |
| Analyst | analyst@sohcahtoa.com | analyst123 |

> **Note:** Only **admin** users can flag transactions.

---

## Project Structure

```
app/
├── login/                            → Public login page
├── dashboard/
│   ├── layout.tsx                    → Dashboard shell (sidebar + topbar)
│   └── page.tsx                      → Main dashboard page
├── api/
│   ├── auth/
│   │   ├── login/                    → POST /api/auth/login
│   │   ├── logout/                   → POST /api/auth/logout
│   │   └── refresh/                  → POST /api/auth/refresh
│   └── transactions/
│       ├── route.ts                  → GET /api/transactions
│       ├── stream/                   → GET /api/transactions/stream (SSE)
│       └── [id]/                     → PATCH /api/transactions/:id
├── appStore/
│   ├── authSlice.ts                  → Auth state
│   ├── provider.ts                   → Redux provider wrapper
│   ├── store.ts                      → Redux store configuration
│   └── transactionsSlice.ts          → Transactions state
├── hooks/
│   ├── useTransactionStream.ts       → SSE real-time hook
│   └── useSessionManager.ts          → Inactivity + token refresh
└── proxy.ts                          → Route protection middleware

components/
├── Sidebar.tsx                       → Navigation sidebar
├── TopBar.tsx                        → Top navigation bar
├── Greeting.tsx                      → Dynamic time-based greeting
├── VisaCard.tsx                      → Prepaid card component
├── TransactionRow.tsx                → Transaction list item
├── TransactionDetailsPanel.tsx       → Transaction details panel
├── Pagination.tsx                    → Reusable pagination component
├── InactivityWarning.tsx             → Session timeout warning modal
└── Providers.tsx                     → Redux provider wrapper

lib/
├── mockData.ts                       → Simulated transaction data
└── fetchWithAuth.ts                  → Token refresh with race condition prevention
```

---

## Architecture Decisions

### Authentication

Access and refresh tokens are **simulated** for the purpose of this assessment (no external auth provider or JWT library). In production, these would be replaced with real JWT tokens signed with a secret key.

Tokens are stored in **httpOnly cookies** — never exposed to JavaScript. This prevents XSS-based token theft. Cookies are configured with:

- `httpOnly: true` — not accessible via `document.cookie`
- `sameSite: strict` — prevents CSRF attacks
- `secure: true` in production — HTTPS only

---

### Token Refresh & Race Condition Prevention

When an access token expires (401 response), `fetchWithAuth.ts` handles refresh automatically:

1. A single `isRefreshing` flag ensures **only one refresh call** is made at a time
2. Subsequent requests that also get a 401 are **queued** while refresh is in progress
3. Once refresh succeeds, all queued requests are **replayed** with the new token
4. If refresh fails → cookies are cleared → user is redirected to `/login`

---

### Session Management

- Access tokens expire after **15 minutes**
- Token is **automatically refreshed** every 10 minutes while the user is active
- After **15 minutes of inactivity**, a warning modal appears with a 60-second countdown
- If the user doesn't respond, they are logged out and redirected to `/login`
- Activity is tracked via `mousemove`, `keydown`, `click`, `scroll`, and `touchstart` events

---

### CSRF Mitigation

- Cookies use `sameSite: strict` which prevents cross-origin requests from including cookies
- All mutation endpoints (login, logout, refresh, PATCH) use `POST`/`PATCH` methods
- No GET endpoints perform mutations

---

### XSS Prevention

- Transaction data is rendered using React JSX text content — **never** `dangerouslySetInnerHTML`
- One transaction intentionally contains `<script>alert("xss")</script>` — it renders as plain text, confirming protection
- Tokens are stored in httpOnly cookies — inaccessible to JavaScript

---

### Caching Strategy

| Endpoint                   | Strategy   | Reason                                     |
| -------------------------- | ---------- | ------------------------------------------ |
| `/api/transactions`        | `no-store` | Transaction data is real-time sensitive    |
| `/api/transactions/stream` | `no-cache` | SSE requires a persistent fresh connection |
| Static assets              | Default    | Fonts, images use Next.js default caching  |

---

### Real-Time Updates

Server-Sent Events (SSE) stream new transactions every 8 seconds via `/api/transactions/stream`. The `upsertTransaction` Redux action prevents duplicates by checking existing IDs before inserting.

---

### Role-Based Access

| Role    | Flag Transactions | Add Notes | View Transactions |
| ------- | :---------------: | :-------: | :---------------: |
| Admin   |        ✅         |    ✅     |        ✅         |
| Analyst |        ❌         |    ✅     |        ✅         |

- Role is stored in Redux state and checked client-side in `TransactionPanel`
- Role is derived from the authenticated user returned by `/api/auth/login`

---

### Sensitive Data Masking

- Card numbers are masked as `•••• •••• •••• XXXX` — only last 4 digits shown
- Access tokens are never logged or exposed to the client via JavaScript
- Cookies are httpOnly — invisible to `document.cookie`

---

### Middleware

`proxy.ts` runs at the **Edge runtime** and:

- Protects all `/dashboard/*` routes
- Redirects unauthenticated users to `/login`
- Redirects authenticated users away from `/login`
- Preserves the original URL in `?from=` for post-login redirect
- Excludes static files and API routes from matching

---

## Deployment

Deployed on Vercel: [sohcahtoa-frontend-assessment.vercel.app](https://sohcahtoa-frontend-assessment.vercel.app/)

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Redux Toolkit
- **Icons:** Lucide React
- **Fonts:** Unbounded (Google Fonts)
- **Deployment:** Vercel

# VoyagerAuMaroc — Frontend

Next.js 13 vacation rental platform. Backend: `https://api.voyageraumaroc.net`

![Next.js](https://img.shields.io/badge/Next.js-13.5.1-black)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-38bdf8)

---

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in your values
npm run dev                  # http://localhost:3001
```

---

## Required Environment Variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend URL — no trailing `/api`. Production: `https://api.voyageraumaroc.net` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | `pk_live_…` for prod, `pk_test_…` for dev |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Yes | Google OAuth 2.0 Client ID |
| `MONGODB_URI` | Server-only | MongoDB Atlas URI (no `NEXT_PUBLIC_` — never sent to browser) |

> Variables without `NEXT_PUBLIC_` are **server-only** (SSR / API routes) and are never exposed to the browser.

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Dev server on port 3001 |
| `npm run build` | Production build |
| `npm run start` | Production server on port 3001 |
| `npm run typecheck` | TypeScript check (no emit) |
| `npm run lint` | ESLint |
| `npm run check` | typecheck + lint + build (full CI gate) |
| `npm run smoke` | Smoke tests against production API |

---

## Deploy Checklist

Run before every production deployment.

### Environment
- [ ] All required env vars set on the hosting platform
- [ ] `NEXT_PUBLIC_API_URL=https://api.voyageraumaroc.net` (no trailing `/api`)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is the **live** key (`pk_live_…`)
- [ ] Google OAuth redirect URIs include the production domain
- [ ] `MONGODB_URI` set for server-side routes

### Build Gate
- [ ] `npm run build` — no build errors
- [ ] `npm run typecheck` — no blocking TS errors (see Known Issues)
- [ ] `npm run lint` — no blocking ESLint errors

### Smoke Tests
- [ ] `npm run smoke` — all 7 checks pass against `https://api.voyageraumaroc.net`
  - Health check responds HTTP < 500
  - Properties search returns JSON
  - Invalid login returns 400/401 (not 500)
  - Protected routes return 401 without token
  - CORS preflight from `voyageraumaroc.net` accepted

### Manual QA
- [ ] Home page renders: hero, property grid, testimonials, HowItWorks, footer
- [ ] Property search with location filter works
- [ ] Property detail: images, calendar, price calculation
- [ ] Guest booking flow: checkout → payment → confirmation
- [ ] Auth: register, login, logout, Google OAuth
- [ ] Booking appears in `/mis-reservas`
- [ ] Admin dashboard loads and expandable cards work
- [ ] Notification panel renders above admin content

### Final
- [ ] Test production URL in incognito
- [ ] No `console.error` or JS exceptions in DevTools
- [ ] Git tag: `git tag v$(date +%Y%m%d) && git push --tags`

---

## Manual QA Playbook

### Home Page
1. Open `/` — verify hero, property grid, testimonials, HowItWorks, footer load
2. Hover property cards → image zoom + price overlay
3. Click HowItWorks steps → verify link navigation (Step 1→`/buscar`, Step 3→`/mis-reservas`)

### Search
1. Open `/buscar`, enter location "Marrakech" → verify filtered results
2. Apply date + guest count filters → results update

### Property Detail
1. Click any property → verify gallery, amenities, calendar, reviews load
2. Select dates → price calculation updates dynamically
3. "Reservar" without login → redirect to login

### Authentication
1. Register new email/password → verify success state
2. Login with same credentials → redirect to home
3. Wrong password → error message shown (no crash)
4. Google OAuth → complete flow → user appears in header
5. Logout → session cleared, protected pages redirect

### Booking Flow
1. Login as guest, select property and dates, proceed through checkout
2. Complete payment with Stripe test card `4242 4242 4242 4242`
3. Verify booking appears in `/mis-reservas`
4. Cancel booking → status updates to cancelled

### Admin Dashboard
1. Login as admin, navigate `/admin`
2. AdminCommandCenter: click each metric card → detail panel expands/collapses
3. Notification bell → panel renders above content cards (not behind)
4. Bookings management → table loads with real data

---

## Known Issues

| Issue | Severity | Notes |
|---|---|---|
| `HeadersInit` type error in `users-service.ts`, `property-service.ts` | Low / Non-blocking | `Authorization` header indexing. Build passes via `ignoreBuildErrors: true`. Fix: cast to `Record<string, string>` |
| `AuthError` union missing `INVALID_RESPONSE`, `RATE_LIMIT` in `users-service.ts` | Low / Non-blocking | Add values to the union type to resolve |
| `checkout-persistence.ts` — `currentStep` possibly undefined | Low / Non-blocking | Add null check / type narrowing |
| Testimonials scroll resets on window resize | Cosmetic | `CARD_WIDTH` hardcoded 365px; needs ResizeObserver for dynamic width |

---

## Project Structure

```
project/
├── app/                    # Next.js App Router pages
│   ├── (main)/             # Public pages (home, buscar, propiedad)
│   ├── admin/              # Admin dashboard
│   └── api/                # Next.js API route handlers
├── components/             # React components
│   ├── admin/              # Admin-specific (AdminCommandCenter, etc.)
│   ├── ui/                 # shadcn/ui primitives
│   └── ErrorBoundary.tsx   # Global error boundary
├── lib/                    # Services & utilities
│   ├── auth/               # Authentication service + validators
│   ├── bookings/           # Booking service (Booking interface)
│   ├── properties/         # Property service
│   ├── api-client.ts       # Shared HTTP utilities
│   └── config.ts           # Centralized env config + validateEnv()
├── scripts/
│   └── smoke-test.mjs      # Production smoke tests (npm run smoke)
├── .env.example            # Environment variable template
├── .env.local              # Local secrets (gitignored)
└── next.config.js          # Next.js config (conditional API proxy)
```

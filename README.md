# Troy Martial Arts — Website + Staff Portal

A complete rebuild of [troymartialarts.net](https://www.troymartialarts.net/): a modern,
conversion-focused marketing site **plus** a working school-management portal, in one
Next.js codebase. Built to demo to the business owners.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What's inside

### Public site (SEO-ready, statically rendered)

| Route | Purpose |
|---|---|
| `/` | Hero, 4-week trial offer, programs, values, real Google reviews, map |
| `/programs` | Kids 5–10, Teens 11–15, Adults, Family, Competition Team, Summer Camp |
| `/schedule` | Interactive 2024–25 weekly grid, filterable by age group |
| `/reviews` | 4.9★ / 648-review wall (real public Google reviews) |
| `/about` | 45+ years of history, mission & values, belt journey |
| `/contact` | Trial-request form + phone, address, embedded map |

### Staff portal (`/portal`)

Demo-mode school management: **Dashboard** (KPIs, belt distribution, activity feed),
**Students** (search, add/edit, belt promotion, assistants), **Attendance**
(class check-in + history), **Payments** (tuition tracking, mark-paid), **Schedule**.

- Sign in with any of the three demo accounts on the login screen.
- Data is seeded + persisted in `localStorage` (`tma-portal-v1`) — refresh-safe,
  device-local, zero backend needed for demos.
- The data layer lives in `src/lib/portal/store.tsx`; swap its persistence for a real
  backend (e.g. Supabase) without touching the page components.

## Going to production (post-sale checklist)

- [ ] Hook the trial form (`src/components/site/TrialForm.tsx`) to email/CRM — it
      currently stores leads in `localStorage` (`tma-trial-leads`)
- [ ] Replace the portal's localStorage store with a real backend + auth
- [ ] Swap emoji program art for real class photos
- [ ] Confirm current schedule/pricing with the owners (data in `src/lib/data.ts`)
- [ ] Deploy on Vercel, point the domain

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript.
All business content is centralized in `src/lib/data.ts`.

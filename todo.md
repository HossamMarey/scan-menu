# ScanMenu – Phased Execution Plan (MVP)

> Stack: Next.js (App Router) + TypeScript, Shadcn UI, next-intl (EN/AR + RTL), MongoDB/Mongoose, AWS S3. Use yarn, small reusable components/functions, strict typing (no any), code comments.

> review mvp.md file for more details
> update todo.md when done with a phase

---

## Phase 0 — Repo Hygiene & Tooling ✅

- [x] Initialize yarn and enforce tooling
  - [x] yarn set version stable; node >= 18
  - [x] ESLint + Prettier + TypeScript strict (noImplicitAny, strictNullChecks)
  - [x] Husky + lint-staged (format/lint on commit)
  - [x] Commitlint (conventional) optional
- [x] Project structure
  - [x] `src/` with `app/`, `lib/`, `components/`, `server/`, `types/`
  - [x] Aliases in `tsconfig.json` (e.g., `@/components`, `@/lib`)
- [x] Base UI kit
  - [x] Install shadcn and generate core components (button, input, form, dialog, dropdown, sonner)
  - [x] Tailwind config with themes (light/dark), container, RTL plugin

Acceptance

- [x] `yarn lint`/`yarn typecheck` pass
- [x] Pre-commit hooks run formatting/linting

---

## Phase 1 — App Foundation ✅

- [x] Next.js App Router scaffolding
  - [x] Root layout: `<html lang>` + RTL support via `dir`
  - [x] Global providers: Theme, Toast, Query (if used)
- [x] next-intl setup (EN, AR)
  - [x] Messages files `src/messages/{en,ar}.json`
  - [x] Locale segment `[locale]` with middleware redirect
  - [x] Language switcher component

Acceptance

- [x] `/en` and `/ar` render with proper `dir` and messages

---

## Phase 2 — Data Layer (MongoDB) ✅

- [x] Mongoose connection helper `@/server/db/connect.ts`
- [x] Schemas & types
  - [x] `User` (auth provider id, email, name, avatar, role)
  - [x] `Restaurant` (ownerId, name(i18n), slug unique, branding, socials)
  - [x] `Menu` (restaurantId, name, description, pdfKey, status)
  - [x] `MenuLink` (menuId, slug nanoid, style config, utm/meta)
  - [x] `Visit` (linkId, ts, ip hash, ua, source/table, country)
  - [x] `Plan` + `Subscription` (limits, status, provider)
- [x] Indexes (slug, restaurantId, menuId, linkId, createdAt)
- [x] Seed/dev utilities (optional)

Acceptance

- [x] DB connects once per server process; schemas type-safe

---

## Phase 3 — Authentication (Google OAuth) ✅

- [x] next-auth with Google provider (App Router handlers)
- [x] Session strategy JWT; link to `User` document on sign-in
- [x] Protected routes helper `getCurrentUser()`, `requireAuth()`, `requireAdmin()`
- [x] Onboarding: if first login, create `User` automatically
- [x] Auth UI components (SignInButton, sign-in/error pages)
- [x] Localization for auth messages (EN/AR)
- [x] Session provider integration with global providers
- [x] TypeScript definitions for NextAuth
- [x] Environment variables documentation

Acceptance

- [x] Login with Google works; session available in server/components

---

## Phase 4 — Storage (AWS S3) ✅

- [x] S3 client in `@/server/s3/client.ts`
- [x] Presigned POST/PUT for uploads (PDF, images)
- [x] Validation: PDF max 20MB, allowed mime types
- [x] next/image remotePatterns for S3 bucket
- [x] Bucket CORS + minimal IAM permissions
- [x] API routes for presigned upload and completion
- [x] Client upload utilities and React upload component
- [x] Localization/messages for uploads (EN/AR)

Acceptance

- [x] Uploads succeed from create menu form; stored with predictable keys

---

## Phase 5 — Restaurant & Menu Management (Dashboard)

- [ ] Restaurant CRUD
  - [ ] Create with unique slug (slug check + reservation)
  - [ ] Editor: name (EN/AR), logo, brand colors, socials, banner
- [ ] Menu CRUD
  - [ ] Create: name, description, PDF upload to S3
  - [ ] Generate short link slug (nanoid) per `MenuLink`
  - [ ] QR style config (color, logo, frame) persisted in `MenuLink`
- [ ] Forms: `react-hook-form` + `zod` validators; small field components

Acceptance

- [ ] Owner can create 1st restaurant and first menu end-to-end
- [ ] Short link visible and copyable; QR preview renders

---

## Phase 6 — Public Views (Viewer + Profile)

- [ ] Menu Viewer
  - [ ] Route: `/{restaurantSlug}/{linkSlug}` with optional query (`?table=1`/`?source=fb`)
  - [ ] Flipbook viewer using `react-pageflip` for uploaded PDF
  - [ ] Fallback simple PDF viewer for unsupported devices
  - [ ] Branding (logo/colors) applied; loading states
- [ ] Restaurant Profile (Linktree-style)
  - [ ] Route: `/{restaurantSlug}`
  - [ ] Shows branding, bio, menus with thumbnails, contact/social links

Acceptance

- [ ] Public routes render fast on mobile; basic SEO meta/OG tags

---

## Phase 7 — Link Tracking & Analytics

- [ ] Visit logging
  - [ ] Edge/middleware or server logging on viewer route
  - [ ] Parse query params (source, table, campaign); hash IP; UA parsing
- [ ] Aggregations
  - [ ] Daily counts per link; top sources; unique visits
  - [ ] Retention window configurable by plan
- [ ] Dashboard widgets
  - [ ] Charts (last 30 days) using lightweight lib
  - [ ] CSV export API for current filters

Acceptance

- [ ] Visits recorded and visible on dashboard/Single Menu page

---

## Phase 8 — App Pages (Owner)

- [ ] Home (Landing): product overview, pricing, login CTA
- [ ] Dashboard: totals, top menus, recent activity, date range filter
- [ ] Menus: table with create/edit/delete; pagination
- [ ] Single Menu: details, links & QR, analytics summary
- [ ] Create Menu: guided flow (upload, link, QR, publish)
- [ ] Settings: user profile, password change, default language
- [ ] Restaurant Profile Editor: branding/socials/bio/logo/banner

Acceptance

- [ ] All pages functional and navigable with breadcrumbs and toasts

---

## Phase 9 — Payments & Plans

- [ ] Stripe first (cards); stub PayPal/InstaPay for later
- [ ] Plans/limits enforcement
  - [ ] Middleware/guards: menus per plan, links per menu, visits cap
  - [ ] Analytics retention job (cron/queue) by plan
- [ ] Billing portal and webhooks (Stripe)

Acceptance

- [ ] Upgrade/downgrade works; plan limits applied in UI + server

---

## Phase 10 — i18n & Accessibility

- [ ] Complete EN/AR translations for UI strings
- [ ] RTL polish; logical properties in CSS; date/number formatting
- [ ] a11y checks on key flows; labels, focus order, color contrast

Acceptance

- [ ] Language switch persists; UI fully usable in AR with RTL

---

## Phase 11 — DevOps & Deployment

- [ ] Environment handling
  - [ ] `.env.local` for secrets; sample `.env.example` (no secrets)
  - [ ] NEVER commit secrets (rotate any leaked in `mvp.md`)
- [ ] Vercel deployment (recommended)
  - [ ] Edge-ready middleware; image optimization; S3 CORS
  - [ ] Set env vars in Vercel dashboard
- [ ] Monitoring
  - [ ] Basic logging; error reporting (e.g., Sentry) optional

Acceptance

- [ ] Production build deploys; uploads and auth work in prod

---

## Phase 12 — QA, Testing, Performance

- [ ] Unit tests for utilities (slug, limits, parsing)
- [ ] Minimal e2e happy path (auth -> create restaurant -> upload menu -> view -> analytics)
- [ ] Performance
  - [ ] Optimize viewer load; cache headers; bundling; images
  - [ ] DB indexes verified; slow queries reviewed

Acceptance

- [ ] CI green; happy path e2e passes

---

## Phase 13 — Launch Checklist

- [ ] Legal: Terms, Privacy, Contact
- [ ] Pricing page with plan cards
- [ ] Marketing OG images and metadata
- [ ] Changelog and feedback link
- [ ] Backup/restore runbook

---

## Cross-cutting Implementation Notes

- [ ] Reusable small UI components (FormField, LabeledInput, ColorPicker, QRPreview, MenuCard)
- [ ] Reusable server utilities (auth guards, plan guard, s3 helpers, parsers)
- [ ] Strict TypeScript models and DTOs; shared `@/types`
- [ ] Code comments: explain non-obvious logic and decisions
- [ ] Security: input validation (zod), rate limits on public endpoints

---

## Immediate Next Actions (Week 1)

- [ ] Phase 0 and Phase 1 completion
- [ ] Begin Phase 2 (DB) and Phase 3 (Auth)
- [ ] Draft UI for Restaurant/Create Menu forms

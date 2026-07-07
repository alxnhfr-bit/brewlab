# BrewLab

Coffee brewing companion app: guided recipes, brew ratio calculator, gear/bean catalog.

## Product intent (IMPORTANT)

This is an early prototype being scoped for a **complete overhaul**. The governing goal: publish as a
**native B2C app in production**. This is meant to become the first native app in Alex's portfolio,
a credibility centerpiece, so build decisions should target a real shippable product (app store
listing, real backend, real users), not a demo.

Sibling project for reference on conventions/workflow patterns (separate repo, separate app, do not
share code or context): `sundayatlas` at `~/Documents/GitHub/sundayatlas`. That project is a React +
Vite + Vercel + Supabase web app going through its own auth/backend buildout. BrewLab should be
evaluated independently: native-first (Capacitor or similar likely, since the goal is an app store
presence) rather than web-first.

## Current state (as of 2026-07-05, post-migration)

Migrated off the single-file prototype into a proper **Vite + React 18 + TypeScript** project
(strict mode, no `any`). The legacy file is preserved at
[legacy-prototype.html.bak](legacy-prototype.html.bak) for reference only, not loaded by the app.

Structure:
- [src/lib/theme.ts](src/lib/theme.ts): `C` (color palette) and `MC` (per-method accent colors for
  v60/aeropress/coldbrew), plus the `BrewMethodId` type.
- [src/lib/data.ts](src/lib/data.ts): typed data arrays `METHODS`, `ROASTS`, `PREFS`, `RECIPES` (7
  guided recipes across v60/aeropress/coldbrew), `BEANS` (5 sample listings), `GEAR` (6 sample
  listings), `NAV` (bottom nav config), with `Recipe`/`Bean`/`Gear`/etc. interfaces.
- [src/lib/format.ts](src/lib/format.ts): `fmt()` time-formatting helper.
- [src/components/icons.tsx](src/components/icons.tsx): hand-drawn SVG icon components (`V60I`,
  `ApI`, `CbI`, `TmI`, `ScI`, `CtI`, `BkI`, `CkI`, `ChI`, `XI`, `BnI`) plus the `MI` method-to-icon map.
- [src/components/Shared.tsx](src/components/Shared.tsx): `Lbl` and `Tog` shared UI primitives.
- Screens in `src/components/`: `HomeScreen` (scroll-driven hero animation + brand reveal + CTA),
  `RecipesScreen` (method filter + recipe list), `CalcScreen` (brew ratio calculator), `TimerScreen`
  (guided step timer), `ShopScreen` (bean/gear catalog with local cart state).
- [src/BrewLab.tsx](src/BrewLab.tsx): root component, home/tab routing.

The home screen's scroll-scrubbed animation used to inline 8 frames as base64 JPEGs directly in the
JS bundle (~220KB of it). These are now real files at `public/frames/frame-00.jpg` through
`frame-07.jpg`, referenced by path instead of inlined.

Nothing persists yet (no localStorage, no backend). Bean/gear data is static, not a real catalog or
commerce integration. No auth. No native wrapper yet. `npm run dev` / `npm run build` are the entry
points now.

## What NOT to do

- Don't assume this needs to match sundayatlas's stack (Vercel edge functions, Redis, etc.). Decide
  BrewLab's stack on its own merits, with native distribution as the target.
- Don't carry over sundayatlas-specific rules (e.g. its concierge/API conventions) into this repo.
- Don't reproduce branded IP, song lyrics, or copyrighted material in app content.
- No em dashes in code, content, comments, or commit messages (Alex's standing preference across
  projects). Use commas, parentheses, semicolons, periods.

## Decided (2026-07-07)

- Native stack: **Capacitor** wrapping the React app. Decided on cost (zero cash delta vs
  alternatives, lowest time cost) and fit (content/workflow app, not gesture-heavy).
- Backend: **Supabase** (managed auth + Postgres), arrives in v1.5; v1 is fully offline/local.
- Scope: **brewing companion only**. Commerce/shop is cut; beans/gear survive only as a personal
  "Bean Shelf" library concept in v2.
- Design: keep the warm coffee-shop concept, redo the execution. Full UX/IA direction lives in
  [docs/UX-DIRECTION.md](docs/UX-DIRECTION.md) (3-tab IA: Brew / Journal / Library, brew session as
  modal state, 1-tap time-to-timer as governing metric, "The Pour" first-run, 5 signature
  motion/haptic moments, v1 -> v1.5 -> v2 release plan). That document is the reference for all
  overhaul build work.

## Open decisions

- Pricing/monetization (research suggests free or cheap one-time unlock; subscriptions rejected).
- App name/branding check ("BrewLab" availability on both stores has not been verified).

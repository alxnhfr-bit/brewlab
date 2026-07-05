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

## Open decisions (discuss before building)

- Tech stack for native: most likely Capacitor (wraps a web app, ships to iOS/Android app stores,
  reuses web skills) vs. a fully native framework (React Native, Flutter, Swift/Kotlin). Capacitor is
  the lowest-friction path if keeping React; worth confirming against Alex's actual goals (App Store
  review, offline behavior, native API needs like notifications/haptics).
- Backend: currently zero persistence. A native B2C app in production will need real auth and a real
  database at minimum for any user accounts, saved recipes, or purchases.
- Scope of "brewing companion" vs "commerce" (BEANS/GEAR catalogs suggest an affiliate/shop angle,
  similar in spirit to sundayatlas's affiliate thesis, but unconfirmed as a real business model here).
- Whether the current design/animation direction is being kept, or this is a from-scratch rebuild
  keeping only the concept (coffee brewing guide).

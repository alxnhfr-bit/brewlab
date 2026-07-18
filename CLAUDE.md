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

## Current state (as of 2026-07-07, revamp v1)

The overhaul defined in [docs/UX-DIRECTION.md](docs/UX-DIRECTION.md) is implemented as a working web
app (Capacitor wrapper not yet added). Vite + React 18 + TypeScript strict, zustand persisted to
localStorage. The legacy prototype survives only as
[legacy-prototype.html.bak](legacy-prototype.html.bak).

Structure:
- [src/styles/tokens.css](src/styles/tokens.css): all design tokens as CSS variables (`--bl-*`),
  light + dark themes (`[data-theme="dark"]`), method accents (v60 sage / aeropress clay / coldbrew
  slate), caramel reserved for journal moments, shared keyframes. Components use inline styles
  referencing these vars only, no hardcoded hex.
- [src/lib/types.ts](src/lib/types.ts): all shared types (`Recipe`, `SessionPlan`, `ActiveSession`,
  `JournalEntry`, `Tweak`, `TasteTag`, ...).
- [src/lib/store.ts](src/lib/store.ts): zustand store (persist key `brewlab-store`): onboarding
  flag, settings, journal, favorites, per-recipe dose memory, pending taste tweaks, and the active
  brew session with all engine actions.
- [src/lib/session.ts](src/lib/session.ts): wall-clock session math. Steps run on absolute end
  timestamps (`stepEndsAt`); pause captures remaining ms; UI re-renders via
  [src/lib/useNow.ts](src/lib/useNow.ts). Never setInterval-accumulated state.
- [src/lib/coaching.ts](src/lib/coaching.ts): taste-chip -> conservative adjustment rules table.
- [src/lib/recipes.ts](src/lib/recipes.ts) + [src/lib/recipes-extra.ts](src/lib/recipes-extra.ts):
  12 bundled recipes with per-step cumulative `waterTargetG` and optional `why` tips.
- [src/lib/haptics.ts](src/lib/haptics.ts): haptics abstraction (web Vibration API now,
  @capacitor/haptics later).
- [src/ui/](src/ui): `primitives.tsx` (Card, Chip, PrimaryButton, Sheet, Segmented, Mono, ...) and
  `icons.tsx` (Phosphor light-weight re-exports + custom 24px method glyphs).
- [src/BrewLab.tsx](src/BrewLab.tsx): shell. 3 tabs (Brew / Journal / Library), brew session as a
  full-screen modal overlay (`SessionOverlay`), `NowBrewingBar` mini-bar when minimized, first-run
  gate to `ThePour`, theme attribute management.
- Screens in `src/screens/`: `brew/` (BrewTab with Brew Again hero + pending-tweak chip,
  RecipeDetail, DialInSheet, QuickBrewSheet), `session/` (Get Ready pre-roll, running session with
  pour targets + ring + scrubber, Brew Complete with rating/taste chips/coaching card),
  `journal/` (auto-collected log, editable EntryDetail, ManualLogSheet), `library/` (favorites with
  1-tap brew, v1.5/v2 placeholders, SettingsSheet with theme/haptics/export), `onboarding/`
  (ThePour, CSS/SVG animated first run).

Verified end to end in the browser: 1-tap brew-again loop, wall-clock timer with pause/scrub/
auto-advance, minimize/mini-bar, taste-chip coaching persisting to the next brew, journal auto-log,
dark mode, reload persistence. No backend yet (Supabase lands in v1.5). `npm run dev` /
`npm run build` / `npm run cap:sync`.

Capacitor integration (JS side) is done: [capacitor.config.ts](capacitor.config.ts) (appId
`com.alxnhfr.brewlab`, changeable until first store submission), haptics via @capacitor/haptics
with web Vibration fallback, [src/lib/native.ts](src/lib/native.ts) pre-schedules local
notifications at every remaining step boundary and completion (the load-bearing background-timer
architecture) and holds keep-awake during sessions; all no-ops on web. Fonts are bundled locally
via @fontsource (offline requirement); the Google Fonts link in index.html remains ONLY for the
static GitHub Pages placeholder. `npx cap add ios` / `npx cap add android` are NOT run yet: this
machine lacks Xcode (CLT only), CocoaPods, and Android Studio. Install those, then add platforms.

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
- **Public app name (BrewLab is blocked, rename required).** Checked 2026-07-15: an exact-name
  "BrewLab" coffee app exists and is actively updated on iOS (Apple requires unique display names,
  so the bare name is unavailable), two more BrewLab-named coffee apps crowd iOS, Android has a live
  "BrewLab" coffee guide plus an actively developed "BrewLab: Pour Over Coffee" near-clone, and
  there are senior trademark/business users in the US, UK, and EU (LaMotte, Brewlab Ltd UK, Munich
  and Dublin businesses); USPTO treats "BREW LAB" as descriptive. Verdict: keep BrewLab as internal
  repo codename only, never as the public brand. Candidate replacements pending clearance
  (iTunes Search API, Play search, USPTO, EUIPO/TMview, .app domain): Pourfect, Steepwise,
  Bloomly, Kurve. Once a name is picked: register the .app domain, set the matching bundle id in
  capacitor.config.ts (currently placeholder com.alxnhfr.brewlab, changeable until first store
  submission), and consider an EUIPO class 9/42 filing before launch (developer is EU-based).
- **"Dialed" was cleared and REJECTED (2026-07-15).** Alex's preferred candidate failed clearance:
  DIALED is a LIVE registered US trademark in class 9 for mobile app software (Ad Hoc Labs, Reg
  6206439, since 2020, and they ship an iOS app named "Dialed"), a second DIALED mark in class 30
  (coffee) has a Notice of Allowance and is expected to register early 2027 (dialed.coffee brand),
  the bare name "Dialled" is already taken on iOS BY a coffee app, roughly a dozen coffee/espresso
  apps already trade on Dialed/Dialed In across both stores (including a Germany-based "Dialed In -
  Espresso Logbook", same home market), and dialed.app plus dialed.coffee domains are taken. The
  Dial'd spelling is technically free on both stores but phonetically identical, so it inherits all
  of the above confusion risk. EU registers could not be checked via web search (TMview direct query
  still open) but the US and store findings alone are disqualifying.

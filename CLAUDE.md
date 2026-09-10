# BrewLab (public name: Pourfect)

Coffee brewing companion app: guided recipes, brew ratio calculator, brew journal.

**Naming:** `brewlab` is the repo codename only, and stays in the repo name, the bundle id
(`com.alxnhfr.brewlab`) and the persisted store key (`brewlab-store`). The public name in the UI is
**Pourfect**, a working title held in one constant, `APP_NAME` in [src/lib/brand.ts](src/lib/brand.ts).
Pourfect has NOT been through trademark/store clearance yet (see Open decisions).

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

## Current state (as of 2026-09-10, Pourfect design overhaul)

The IA and flows from [docs/UX-DIRECTION.md](docs/UX-DIRECTION.md) are unchanged, but the entire
visual system was replaced by the approved "Pink stickers" direction delivered in
[design_handoff_pourfect_overhaul/](design_handoff_pourfect_overhaul) (README = written spec,
`Pourfect.dc.html` = the prototype with every measurement inline, `screenshots/` = per-screen
reference renders). **That handoff is the source of truth for all visual work.** Vite + React 18 +
TypeScript strict, zustand persisted to localStorage. The legacy prototype survives only as
[legacy-prototype.html.bak](legacy-prototype.html.bak).

Design system (near-black ink, 2px rules, Archivo Black display type, sticker shapes, pill buttons):
- [src/styles/tokens.css](src/styles/tokens.css): six palette sets as `--p-*` variables, selected by
  `data-palette` (pink / lime / tangerine) x `data-theme` (light / dark) on the document element.
  Token roles: bg, card, ink (text AND all 2px rules), muted, faint, accent, accent-ink, track, num,
  nav-active. Also the sticker clip-paths and the blink/spin keyframes. Components use inline styles
  referencing these vars only; the ONLY allowed colour literals in src/ are the mini-bar shadow and
  the sheet scrim.
- **Methods are coded by SHAPE, never colour**: V60 = accent burst, AeroPress = ink circle, cold brew
  = accent diamond. There are no per-method accent colours any more.
- Type: Archivo Black for display (`DISPLAY` / `--p-font-display`), Archivo for body, both self-hosted
  via @fontsource. Tabular numerals wherever numbers change in place.
- [src/lib/types.ts](src/lib/types.ts): all shared types (`Recipe`, `SessionPlan`, `ActiveSession`,
  `JournalEntry`, `Tweak`, `TasteTag`, ...).
- [src/lib/store.ts](src/lib/store.ts): zustand store (persist key `brewlab-store`): onboarding
  flag, settings, journal, favorites, per-recipe dose memory, pending taste tweaks, and the active
  brew session with all engine actions.
- [src/lib/session.ts](src/lib/session.ts): wall-clock session math. Steps run on absolute end
  timestamps (`stepEndsAt`); pause captures remaining ms; UI re-renders via
  [src/lib/useNow.ts](src/lib/useNow.ts). Never setInterval-accumulated state.
- [src/lib/coaching.ts](src/lib/coaching.ts): taste-chip -> conservative adjustment rules table.
  Taste is **multi-select**: `coachFor(tastes[], method)` returns one suggestion line per tag and a
  combined `chipLabel`; `toggleTaste()` keeps "just right" exclusive with the problem tags.
- [src/lib/brand.ts](src/lib/brand.ts): `APP_NAME`, `APP_TAGLINE`, `APP_STRAPLINE`. Never hardcode
  the product name in a screen.
- [src/lib/recipes.ts](src/lib/recipes.ts) + [src/lib/recipes-extra.ts](src/lib/recipes-extra.ts):
  12 bundled recipes with per-step cumulative `waterTargetG` and optional `why` tips.
- [src/lib/haptics.ts](src/lib/haptics.ts): haptics abstraction (web Vibration API now,
  @capacitor/haptics later).
- [src/ui/](src/ui): `primitives.tsx` (Label, MicroLabel, Meta, PageTitle, PrimaryPill, OutlinePill,
  Chip, RoundBtn, SpecGrid, TweakPill, Toggle, Stepper, PillInput, Sheet, Row, `DISPLAY`) and
  `icons.tsx` (Burst / Diamond / Dot / `MethodSticker` / `LogoMark` / `RatingBurst`, plus Phosphor
  **bold** re-exports; the shell sets `IconContext` weight to bold).
  Pressed-state helper classes live in [src/index.css](src/index.css): `p-press`, `p-outline`, `p-row`.
- [src/BrewLab.tsx](src/BrewLab.tsx): shell. 3 tabs (Brew / Journal / Library) in a full-width ink nav
  bar, brew session as a full-screen modal overlay (`SessionOverlay`), `NowBrewingBar` mini-bar when
  minimized, first-run gate to `ThePour`, and palette/theme attribute resolution ("system" resolves
  against `prefers-color-scheme` live).
- Screens in `src/screens/`: `brew/` (BrewTab with Brew Again hero + pending-tweak chip,
  RecipeDetail, DialInSheet, QuickBrewSheet), `session/` (Get Ready pre-roll, running session with
  104px pour target + 12-wedge blinking ring + scrubber, Brew Complete with rating bursts, taste
  chips and coaching card), `journal/` (auto-collected log, editable EntryDetail, ManualLogSheet),
  `library/` (favorites with 1-tap brew, v1.5/v2 placeholders, SettingsSheet, and the **Appearance**
  screen: palette cards each previewing their own palette, plus mode pills and a live hero preview),
  `onboarding/` (ThePour, CSS/SVG animated first run).

Verified screen by screen against `design_handoff_pourfect_overhaul/screenshots/` at 402px in the
browser: all 14 screens, all three palettes, light and dark, plus the 1-tap brew-again loop,
wall-clock timer with pause/scrub/auto-advance, minimize/mini-bar, multi-select taste coaching
persisting to the next brew, journal auto-log, and reload persistence. No console errors. No backend
yet (Supabase lands in v1.5). `npm run dev` / `npm run build` / `npm run cap:sync`.

Capacitor integration (JS side) is done: [capacitor.config.ts](capacitor.config.ts) (appId
`com.alxnhfr.brewlab`, changeable until first store submission), haptics via @capacitor/haptics
with web Vibration fallback, [src/lib/native.ts](src/lib/native.ts) pre-schedules local
notifications at every remaining step boundary and completion (the load-bearing background-timer
architecture) and holds keep-awake during sessions; all no-ops on web. Fonts (Archivo, Archivo Black)
are bundled locally via @fontsource, so there is no Google Fonts link anywhere; index.html carries a
self-contained inline-styled Pourfect splash that doubles as the GitHub Pages placeholder (its hex
values are deliberate, the token stylesheet ships inside the bundle). Brand assets live in
`public/brand/` (all palettes, light and dark tiles, PNG exports at every iOS size); v1 ships the
Pink light icon only, wired as `favicon.svg` and `apple-touch-icon.png`. Alternate icons per palette
(`UIApplication.setAlternateIconName`) were deliberately deferred.
`npx cap add ios` / `npx cap add android` are NOT run yet: this machine lacks Xcode (CLT only),
CocoaPods, and Android Studio. Install those, then add platforms.

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
  (iTunes Search API, Play search, USPTO, EUIPO/TMview, .app domain): **Pourfect** (currently used in
  the UI as a working title, cleared NOTHING yet), Steepwise, Bloomly, Kurve. Once a name is picked: register the .app domain, set the matching bundle id in
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
- **"BRRW" checked 2026-09-10: store-available, but weak as a mark.** No iOS app, no Android app, no
  coffee brand and no indexed USPTO mark uses it, and the feared "borrow" fintech brand does not exist
  (brrw.com is a domain reseller listing, brrw.app is registered but serves 404, brrw.io has no site;
  brrw.coffee, brrw.co and getbrrw.app look free). So it clears the store hurdle that killed BrewLab
  and Dialed. The problem is the opposite one: under TMEP 1209.03(j) a novel spelling that is the
  phonetic equivalent of a descriptive term is itself merely descriptive (QUIK-PRINT, SHARPIN,
  URBANHOUZING), so to the extent BRRW reads as "brew" it is just a misspelling of a descriptive word
  for a brewing app, exactly the trap that made "BREW LAB" descriptive. The tension is structural: the
  clearer it reads as "brew", the weaker the mark; the more distinctive it is legally, the less it
  communicates and the harder it is to spell, pronounce or find in store search, which is this app's
  main discovery channel. EU/DPMA registers still unchecked (not web-indexed).

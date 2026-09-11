# BrewLab (public name: 15GRMS)

Coffee brewing companion app: guided recipes, brew ratio calculator, brew journal.

**Naming:** `brewlab` is the repo codename only, and stays in the repo name, the bundle id
(`com.alxnhfr.fifteengrams`) and the persisted store key (`brewlab-store`). The public name in the UI is
**15GRMS** ("fifteen grams"), held in [src/lib/brand.ts](src/lib/brand.ts) as `APP_NAME` plus
`WORDMARK_TOP` / `WORDMARK_BOTTOM` (the two-line burst lockup, "15" over "GRMS"). Chosen 2026-09-10
after Pourfect was found blocked; see Open decisions for the clearance trail. The app icon is
textless (burst plus drop), so it survived the rename unchanged; only the wordmark is name-bearing.

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

**Background catch-up (important, fixed 2026-09-11).** `advanceStep` chains the next step from the
current step's *scheduled* end, never from `Date.now()`. The phone is expected to be locked mid-brew,
which suspends the WebView, so on resume several steps can be overdue at once and must cascade onto
the same absolute schedule the notifications were pre-scheduled against. Using `Date.now()` silently
restarted the next step, so after a locked-phone brew the notifications said "Brew complete" while the
app still showed an early step. `completedAt` is likewise the last step's scheduled end, so the logged
duration is the real brew time rather than however long the phone stayed in a pocket.

**Nav bar height** is driven by `--p-nav-pad-bottom` / `--p-nav-h` in
[src/styles/tokens.css](src/styles/tokens.css), and `NowBrewingBar` positions itself from the same
variables so the two can never drift. The handoff's 36px bottom padding ALREADY covers the home
indicator, so `env(safe-area-inset-bottom)` must be `max()`'d with it, never added to it; adding it
made the bar 34px too tall on an iPhone. Measured: 72px tall, flush to the bottom, mini-bar clearing
it by 13px.

**Scrolling is owned by the shell, not the document** (fixed 2026-09-11). `html, body` are
`height:100%; overflow:hidden; overscroll-behavior:none`, and the shell div in
[src/BrewLab.tsx](src/BrewLab.tsx) is the scroll container. In a WKWebView a scrolling document
rubber-bands past its end and drags `position:fixed` chrome with it, which lifted the tab bar off the
bottom edge. The shell also paints an opaque `env(safe-area-inset-top)` strip so list content passes
behind the status bar instead of colliding with the clock. `capacitor.config.ts` sets
`ios.contentInset: 'never'` because the app handles safe areas itself.

Two behaviours were added after the handoff, which does not specify either:
- **Ending a running brew.** The session header's X used to minimize on tap and abandon the brew on a
  hidden 600ms long press, announced only through an aria-label, so ending a brew was undiscoverable
  and could fire by accident. Tapping X now swaps the header for an explicit "Keep brewing" (outline)
  / "End brew" (accent) pair that reverts after 5 seconds. The resting header is unchanged.
- **Deleting journal entries from the list.** EntryDetail already had a two-tap Delete; the list had
  nothing. Journal rows now swipe left to reveal a Delete action (`SwipeToDelete` in JournalTab).
  Horizontal intent must beat vertical intent before the row moves, so the list still scrolls, and a
  drag swallows the tap so swiping never opens the entry.

Verified screen by screen against `design_handoff_pourfect_overhaul/screenshots/` at 402px in the
browser: all 14 screens, all three palettes, light and dark, plus the 1-tap brew-again loop,
wall-clock timer with pause/scrub/auto-advance, minimize/mini-bar, multi-select taste coaching
persisting to the next brew, journal auto-log, and reload persistence. No console errors. No backend
yet (Supabase lands in v1.5). `npm run dev` / `npm run build` / `npm run cap:sync`.

Capacitor integration (JS side) is done: [capacitor.config.ts](capacitor.config.ts) (appId
**`com.alxnhfr.fifteengrams`**, chosen 2026-09-11 and PERMANENT from first submission; spelled out
rather than `15grms` because an Android package component may not begin with a digit), haptics via @capacitor/haptics
with web Vibration fallback, [src/lib/native.ts](src/lib/native.ts) pre-schedules local
notifications at every remaining step boundary and completion (the load-bearing background-timer
architecture) and holds keep-awake during sessions; all no-ops on web. Fonts (Archivo, Archivo Black)
are bundled locally via @fontsource, so there is no Google Fonts link anywhere; index.html carries a
self-contained inline-styled Pourfect splash that doubles as the GitHub Pages placeholder (its hex
values are deliberate, the token stylesheet ships inside the bundle). Brand assets live in
`public/brand/` (all palettes, light and dark tiles, PNG exports at every iOS size); v1 ships the
Pink light icon only, wired as `favicon.svg` and `apple-touch-icon.png`. Alternate icons per palette
(`UIApplication.setAlternateIconName`) were deliberately deferred.
**The iOS project exists and builds.** Xcode 26.6 with the iOS 26.5 SDK and simulator runtime;
`ios/` is committed (build output is gitignored). Capacitor 8 resolves plugins through Swift Package
Manager, so CocoaPods is installed but not actually used by this project.
- Build: `npm run build && npx cap sync ios`, then
  `cd ios/App && xcodebuild -project App.xcodeproj -scheme App -configuration Debug -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 17 Pro' -derivedDataPath /tmp/15grms-dd build`
- Install and run: `xcrun simctl install booted <path>/App.app && xcrun simctl launch booted com.alxnhfr.brewlab`
- **App icon**: the handoff PNGs are ROUNDED and carry an alpha channel, which App Store Connect
  rejects and which iOS would double-round. `AppIcon-512@2x.png` is therefore generated by flattening
  the rounded tile onto its own accent colour (#FF3E9A) and writing RGB with no alpha, which is
  byte-equivalent to the square tile. Regenerate the same way after any icon change.
- **Splash**: `Splash.imageset` has light and dark variants wired through asset-catalog
  `appearances`, so a dark-mode phone does not flash cream at launch.
Verified running on the iPhone 17 Pro simulator: clean first run shows The Pour, the Brew tab renders
correctly, the app follows the system light/dark appearance live, and the icon renders correctly on the
home screen (iOS rounds it, no double-rounding).
**The background-timer architecture is proven on device.** With the app backgrounded for a whole brew,
every step notification fired on time with the right pour target (Pause to 150g, Second pour to 250g,
Drawdown to 250g, then "Brew complete"), and reopening the app landed on Brew Complete showing the true
3:00 duration, with the journal entry timestamped at the brew's real start.

`npx cap add android` is NOT run yet (no Android Studio on this machine).

## Feedback and analytics (decided 2026-09-11)

- **Feedback**: a "Send feedback" row in Settings opens `FEEDBACK_URL` from
  [src/lib/brand.ts](src/lib/brand.ts), currently the repo issue tracker. Swapping in a hosted form
  (Tally, Formspree) is a one-line change and needs no other edits. No personal email is published.
- **App Store review prompt**: [src/lib/review.ts](src/lib/review.ts) asks once per install, and only
  after a brew the user both completed and rated 4+, with at least 5 completed brews behind them. It
  is deliberately never triggered after a poor rating or an abandoned brew: Apple allows only three
  prompts a year, and asking right after a bitter cup is how you collect one-star reviews.
- **Analytics: none in v1, on purpose.** The app makes zero network calls, so "Data Not Collected" is
  true and verifiable, which keeps review simple and is a selling point in this category. App Store
  Connect already supplies downloads, sessions, retention and crashes with no SDK. If in-app analytics
  is ever wanted, use a privacy-first one (TelemetryDeck, Aptabase) in v1.5 alongside Supabase, when
  the privacy policy has to be rewritten anyway.

## App Store submission checklist

GitHub Pages serves the repo root of `main` at https://alxnhfr-bit.github.io/brewlab/ (verified via
the Pages API), which is where the two URLs App Store Connect requires now live:
- Privacy policy: https://alxnhfr-bit.github.io/brewlab/privacy.html ([privacy.html](privacy.html))
- Support: https://alxnhfr-bit.github.io/brewlab/support.html ([support.html](support.html))
Both are deliberately self-contained (no webfonts, no analytics, no third party requests): a privacy
page that loads a font CDN contradicts itself, and embedding Google Fonts has been held to breach the
GDPR in German courts, which matters since the developer is EU-based. Both URLs are also in
[src/lib/brand.ts](src/lib/brand.ts) as `PRIVACY_URL` / `SUPPORT_URL` and linked from the Settings
sheet, because Apple requires the privacy policy to be reachable from inside the app too.

The privacy policy claims the app collects nothing. That is currently TRUE and verified: `src/` has
zero `fetch`/XHR calls, zero external URLs, no analytics and no backend, fonts and recipes are
bundled, and the only permissions are notifications and keep-awake. **If Supabase lands in v1.5, the
policy must be rewritten before that build ships.**

Store assets are drafted in [store/](store): `listing.md` (name, subtitle, promo text, keywords,
description, category, age rating, privacy answers, review notes, all within Apple's character
limits) and `screenshots-6.9/` (five captures at 1320x2868, the required 6.9 inch size, taken from
the iPhone 17 Pro Max simulator with realistic seeded state).

Still blocked on the developer, not on code:
- **Xcode** (App Store, large download) plus `brew install cocoapods`, then `npx cap add ios`.
- **Apple Developer Program** enrollment, 99 USD/year, which can take days to approve.
- App Store Connect's App Privacy questionnaire, which should be answered "Data Not Collected".
- Support contact currently points at GitHub issues rather than an email address, to avoid publishing
  a personal address. Swap it in `support.html` and `privacy.html` if a support mailbox is preferred.

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
- **"BR3W" checked 2026-09-10: REJECTED, worse than BRRW on both axes.** No iOS app holds the display
  name, but the name is already occupied in this exact niche: `br3w22.com` is a live coffee brewing
  site selling essentially this product ("exact ratios, weights, step by step techniques, saved
  favourites, community recipes, gear", billed as "the home barista's playbook"), there is a "BR3W"
  smart coffee machine project with a React Native companion app, and `br3w.app` (the TLD we would
  want) is an actively branded Next.js site, "If you know, you know". `br3w.com` is taken too.
  Legally it is weaker than BRRW, not stronger: swapping 3 for E is a textbook novel spelling, so
  TMEP 1209.03(j) reads it as "BREW", which for a coffee brewing app is arguably generic rather than
  merely descriptive, and generic terms cannot be registered even with acquired distinctiveness.
  It also breaks word of mouth and voice search, and collides with the exact word users type.
- **"15GRMS" re-examined 2026-09-10: VIABLE, the strongest candidate so far.** An earlier note in this
  file called it blocked; that was too strong and is corrected here. Verified via Apple's iTunes API:
  no app named 15GRMS, "15 grams" or "15G" exists, and no Food & Drink app surfaces for any of them.
  The whole `15grms.*` domain set (.com, .app, .coffee) is free. Legally it is the best-positioned name
  tested: a dose figure says nothing about software, so in class 9 it is arbitrary and properly
  registrable, unlike anything containing "brew". The UK roaster **15grams** (15 GRAMS LIMITED, company
  12014931, inc. 2019, Greenwich and Blackheath) has **no trade mark registration found**, so its rights
  are unregistered passing-off rights, which are territorially narrow and tied to its actual goods:
  roasted beans (class 30) and cafe services (class 43), not software (class 9). Dropping the vowels
  also visually separates the two. Residual risks, real but not disqualifying: conceptual overlap with
  a European coffee brand using the same 15 g rationale, spelling and pronunciation friction, and the
  fact that the app spans 11 g to 100 g so one fixed number narrows the idea. UK IPO and EUIPO are not
  web-indexed, so a definitive answer needs a direct query at trademarks.ipo.gov.uk and EUIPO eSearch.
- **"15G" alone is the weaker half of that pair:** globally it reads as India's Form 15G tax
  declaration and is confusable with 5G, and 15g.app and 15g.coffee are both taken.
- **Superseded note (kept for history), the original over-strong reading:** These finally escape
  the descriptiveness trap (a dose figure says nothing about software, so in class 9 it would be
  arbitrary and genuinely registrable, unlike anything containing "brew"). No app holds either name.
  The blocker is prior use in coffee: **15grams** (15grams.co.uk) is an active independent UK
  specialty roaster with shops in Greenwich and Blackheath since 2021, press in Eater and Sprudge,
  and their name means exactly what ours would, their recommended 15 g dose per cup. 15GRMS is that
  brand's phonetic equivalent, so it inherits the confusion risk in our own European market, and
  "N grams" is an established, occupied cafe naming pattern (18 Grams, Hong Kong). Domains: 15g.app
  and 15g.coffee taken, 15grams.coffee is the roaster; the 15grms.* set is entirely free.
  "15G" also carries heavy semantic noise: globally it reads as India's Form 15G tax declaration,
  and it is confusable with 5G. Product critique too: the app spans 11 g to 100 g doses and its whole
  point is dialling to YOUR dose, so naming it after one fixed number narrows the idea.
- **"Pourfect" checked 2026-09-10: REJECTED, and it is the name currently in the UI.** Confirmed via
  Apple's own iTunes lookup API: **"Pourfect: Coffee Journal"** (Dawnshard Software LLC, id 6745131265)
  is LIVE on the iOS App Store in **Food & Drink**, the same category we would ship into, released
  2025-05-04. Apple requires effectively unique display names, so the bare name is unavailable and even
  a subtitled variant would sit beside a same-named coffee app, exactly the BrewLab failure. Also:
  "PourFect: Color Sort Game" and other Pourfect games occupy the name on Play, POURfect(R) kitchenware
  (Dyce LLC, Scottsdale, since 2009) uses the registered symbol in class 21, POURFECTION is a
  registered US mark (Reg 5647293) whose logo uses a coffee cup as the letter U, POURFECT LTD is an
  active UK company (inc. July 2025), plus a resin-art Pourfect in India and a Pourfect AI cocktail
  app. pourfect.com is parked for sale, pourfect.app is a Squarespace "Coming Soon".
  **Action required: APP_NAME in src/lib/brand.ts still says Pourfect, and the wordmark, app icon and
  splash all spell POUR/FECT. These must change before any store submission.**
- **Bulk iOS screen run 2026-09-10** (iTunes Search API, exact + prefix match, US store). Taken or
  conflicted: Pourfect, Steeply, SlowPour (Food & Drink), Aroma Lab, Bloomwise, Bloomly (prefix),
  Kurve (prefix), Decant (prefix), Tamped ("Tamped: Coffee Journal & Timer"), Brewkit, Steepr
  ("Steepr: Tea Timer & Brew Guide"), Vessl. Clear on iOS: **Grindwell, Kettly, Cremaline, Craftpour,
  Pourlab** (all with .app and .coffee free; their .com are parked), plus Gramme (but gramme.app is
  French bakery software) and Draft Coffee (descriptive).
- **"Steepwise" checked and rejected despite being clear on iOS.** No trademark or company found, Play
  namespace free, most domains free, BUT steepwise.app is a **live product**: "SteepWise, a tea journal
  for people who take tea seriously", with a per-steep timer and gram amounts recalculated for your
  teapot, multilingual with accounts. That is this app's concept in the adjacent drink, so it is a real
  confusion risk. **Lesson: an empty App Store result is NOT clearance. Always check the live web too.**
- **Competitor intel found while checking names (worth knowing regardless):** the short-coffee-name
  space is heavily fished, and `brevv` (iOS, "brew perfect coffee") is a near-identical product:
  V60/Chemex/Kalita/AeroPress step-by-step guides, bag scanning, brew logging and rating. Others in
  the cluster: bruu, BROG, Bruvi, Breve, Brewlee, Brevity.

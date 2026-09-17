# 15GRMS

A coffee brewing companion for iPhone. Twelve guided recipes, a timer that stays correct through a
locked screen, and a journal that fills itself in.

**[Download on the App Store](https://apps.apple.com/us/app/15grms/id6811369525)** · Free · iOS 16+ ·
2.6 MB · No account, no ads, no tracking

> **Repo naming.** `brewlab` is the internal codename and survives in the repo name, the bundle id
> (`com.alxnhfr.fifteengrams`) and the persisted store key (`brewlab-store`). The public product name
> is **15GRMS**, held in [src/lib/brand.ts](src/lib/brand.ts). Never hardcode the product name in a
> screen.

---

## The problem

Brewing coffee by hand is a timed sequence with a different water target at each step. Doing it well
means watching a clock and a scale at the same time, while pouring from a kettle with your other
hand. Generic timers do not know the recipe. Written recipes do not keep time.

15GRMS runs the recipe as a timer. Each step shows how much water should be on the scale at that
moment and counts down against the wall clock, so you can watch the kettle instead of the phone.

## What it does

- **One tap to brewing.** Your last brew waits on the home screen with the dose you used. Tap Start
  and you are pouring in about five seconds.
- **Twelve recipes across three methods**, each step showing its cumulative pour target and, where it
  matters, the reason behind it.
- **A timer that survives a locked screen.** Steps run on absolute timestamps, not an accumulating
  counter, and notifications for every remaining step are scheduled in advance.
- **Dial in your dose.** Change dose, ratio or temperature and every pour target recalculates live.
  Your change is remembered per recipe.
- **A journal that fills itself in.** Every brew is logged the moment it finishes, with nothing to
  type. Rate it, tag how it tasted, add notes if you want to. Swipe to delete.
- **Coaching, not lectures.** Too bitter? Sour? Thin? Say so in one tap and 15GRMS suggests a single
  conservative adjustment, explains why, and applies it the next time you brew that recipe.
- **Three palettes, light and dark**, switchable at any time.
- **Export** the whole journal as JSON through the iOS share sheet.

## The recipe library

| Recipe | Method | After | Dose | Water | Temp | Time |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| The Hoffmann Method | V60 | James Hoffmann | 15 g | 250 g | 94 C | 3:00 |
| Better 1 Cup | V60 | James Hoffmann | 15 g | 250 g | 100 C | 3:00 |
| 4:6 Method | V60 | Tetsu Kasuya | 20 g | 300 g | 93 C | 4:00 |
| Iced V60 | V60 | Tetsu Kasuya | 20 g | 200 g | 96 C | 2:45 |
| Winton Five Pour | V60 | Matt Winton | 20 g | 300 g | 93 C | 3:30 |
| The Adler Original | AeroPress | Alan Adler | 15 g | 90 g | 80 C | 1:20 |
| Ultimate AeroPress | AeroPress | James Hoffmann | 11 g | 200 g | 100 C | 3:15 |
| Inverted Classic | AeroPress | Community | 17 g | 220 g | 85 C | 1:55 |
| Championship Style | AeroPress | Community | 14 g | 200 g | 92 C | 2:30 |
| Japanese Flash Brew | Cold brew | Community | 25 g | 200 g | 96 C | 2:25 |
| Room Temp Batch | Cold brew | Community | 60 g | 600 g | ambient | 10h 04 |
| Overnight Concentrate | Cold brew | Community | 100 g | 800 g | ambient | 12h 03 |

Methods popularised by a named person are credited as attribution ("After James Hoffmann"), not as
endorsement. Nobody listed has contributed to or endorsed the app.

## How the timer works

The session engine is the load-bearing part of the product, so it is worth stating plainly.

Steps run on **absolute end timestamps** (`stepEndsAt`), never on interval-accumulated state. A phone
is expected to be locked mid-brew, which suspends the WebView entirely, so a counter-based timer would
drift or stall. Pausing captures remaining milliseconds; the UI re-renders from a shared clock in
[src/lib/useNow.ts](src/lib/useNow.ts).

When the app resumes, several steps can be overdue at once. `advanceStep` chains each step from the
previous step's **scheduled** end rather than from `Date.now()`, so overdue steps cascade onto the same
absolute schedule the notifications were pre-scheduled against. The logged duration is the real brew
time rather than however long the phone stayed in a pocket.

Notification permission is requested **only for brews long enough to need it**. Ten of the twelve
recipes finish in one to four minutes with the screen held awake, so an alert would announce something
you are already watching. The two multi-hour steeps do ask. iOS grants one prompt per install, and
this is where it is worth spending.

## Privacy

The app makes **zero network requests**. No accounts, no analytics, no backend, no third-party runtime
services. Recipes and fonts are bundled. Everything you record stays on your device, which is why the
App Store privacy answer is "Data Not Collected" and why that claim is verifiable rather than asserted.

[Privacy policy](https://alxnhfr-bit.github.io/brewlab/privacy.html) ·
[Support](https://alxnhfr-bit.github.io/brewlab/support.html)

## Tech stack

| Layer | Choice | Version |
| --- | --- | --- |
| UI | React + React DOM | 18.3.1 |
| Language | TypeScript, `strict`, no `any` | 5.7.2 |
| Build | Vite | 6.0.7 |
| State | zustand + `persist` | 5.0.14 |
| Native shell | Capacitor (core / iOS / CLI) | 8.4.2 / 8.5.1 / 8.4.2 |
| Icons | Phosphor Icons for React | 2.1.10 |
| Type | Archivo + Archivo Black via Fontsource | 5.3.0 |
| Lint | ESLint + typescript-eslint | 9.17.0 / 8.19.1 |
| Toolchain | Node / Xcode | 24.16.0 / 26.6 |
| Target | iOS 16+, iPhone only, portrait, arm64 | |

**Native plugins (9):** local notifications, haptics, keep-awake, share sheet, filesystem, app
lifecycle, splash screen, status bar, StoreKit review prompt. Resolved through **Swift Package
Manager**, not CocoaPods.

**No CSS framework and no CSS-in-JS runtime.** Styling is CSS custom properties in
[src/styles/tokens.css](src/styles/tokens.css), selected by `data-palette` (pink / lime / tangerine)
x `data-theme` (light / dark) on the document element. Components use inline styles that reference
only those tokens. Brew methods are coded by **shape**, never colour: V60 is a burst, AeroPress a
circle, cold brew a diamond.

## Project layout

```
src/
  lib/        types, zustand store, session math, coaching rules, recipes, native bridges
  ui/         primitives and icons
  screens/    brew/ journal/ library/ session/ onboarding/
  styles/     palette tokens, sticker clip-paths, keyframes
ios/          Capacitor iOS project (committed; build output gitignored)
store/        App Store listing copy, screenshots, review correspondence
docs/         UX direction and the build case study
brand/        brand assets, deliberately NOT under public/ so they never ship in the IPA
```

Roughly 5,700 lines across 35 files in `src/`, 16 screen components, 3 tabs.

## Development

```bash
npm install
npm run dev          # Vite dev server
npm run build        # production web build
npx cap sync ios     # copy the web build into the iOS project
```

Then open `ios/App/App.xcodeproj` (there is no `.xcworkspace`; Capacitor 8 uses SPM, so there are no
Pods). To build and run on a simulator from the CLI:

```bash
cd ios/App && xcodebuild -project App.xcodeproj -scheme App -configuration Debug -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 17 Pro' -derivedDataPath /tmp/15grms-dd build
```

Archive from Xcode itself (Product > Archive) rather than the CLI, so the archive reaches the
Organizer. Every upload after the first must raise `CURRENT_PROJECT_VERSION` in **both** build
configurations.

See [CLAUDE.md](CLAUDE.md) for the full architecture notes, decision record and submission trail.

## Status

**1.0.0 is live on the App Store** (released 17 September 2026). Android is not built yet; the
Capacitor core makes it a realistic next target. Optional sync via Supabase is scoped for v1.5, at
which point the privacy policy, the privacy manifest and the App Store privacy answers all have to be
rewritten together.

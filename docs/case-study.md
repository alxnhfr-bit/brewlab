# 15GRMS — iOS brewing companion

**Live on the App Store:** https://apps.apple.com/us/app/15grms/id6811369525

Released 17 September 2026, version 1.0.0 (build 1). Free, Food & Drink, rated 4+, iPhone only,
iOS 16+, 2.6 MB. Submitted 13 September and cleared a Guideline 2.1 information request (the standard
request for a developer account with no review history) on the original binary, with no rebuild and
no new build number.
**Repo:** `brewlab` (internal codename) · **Bundle:** `com.alxnhfr.fifteengrams`

---

## Short version (portfolio blurb)

> **15GRMS** — a native iOS coffee brewing companion. Twelve guided recipes with a wall-clock
> timer that stays correct through a locked screen, a journal that fills itself in, and taste
> coaching that applies one conservative adjustment to your next brew. Built with Capacitor over a
> React and TypeScript core. Fully offline: no accounts, no analytics, no network calls at all, so
> the App Store privacy answer is "Data Not Collected" and it is verifiable rather than asserted.

**One-liner:** Shipped a native iOS app end to end, from prototype through trademark clearance,
design system, App Store compliance and submission.

---

## Scope

Took a single-file HTML prototype to a submitted App Store binary. That covered product direction,
stack selection, a full UX and visual rebuild, the native integration layer, App Store compliance,
and the legal groundwork around naming and privacy.

| | |
| --- | --- |
| Timeline | March to September 2026, 49 commits |
| Source | 5,717 lines across 35 files in `src/` |
| Surface | 16 screen components, 3 tabs, 12 recipes |
| Theming | 3 palettes x light/dark, resolved live against `prefers-color-scheme` |
| Native | 9 Capacitor plugins over Swift Package Manager |
| Bundle | 660 KB shipped web assets, 263 KB main JS |
| Target | iPhone only, portrait only, iOS 16+ |

---

## Tech stack

| Layer | Choice | Version |
| --- | --- | --- |
| UI | React + React DOM | 18.3.1 |
| Language | TypeScript, `strict`, no `any` | 5.7.2 |
| Build | Vite | 6.0.7 |
| State | zustand + `persist` middleware | 5.0.14 |
| Native shell | Capacitor (core / iOS / CLI) | 8.4.2 / 8.5.1 / 8.4.2 |
| Icons | Phosphor Icons for React | 2.1.10 |
| Type | Archivo + Archivo Black, self-hosted via Fontsource | 5.3.0 |
| Lint | ESLint + typescript-eslint | 9.17.0 / 8.19.1 |
| Toolchain | Node, Xcode | 24.16.0 / 26.6 |
| Target | iOS 16+, iPhone only, portrait only, arm64 | |

**Native plugins (9).** Local notifications, haptics, keep-awake, share sheet, filesystem, app
lifecycle, splash screen, status bar, and the StoreKit review prompt. Resolved through **Swift
Package Manager** rather than CocoaPods, which Capacitor 8 supports natively and which removes the
Podfile from the build entirely.

**Styling** is CSS custom properties driven by `data-palette` x `data-theme` attributes on the
document element, with components using inline styles that reference only those tokens. No CSS
framework, no CSS-in-JS runtime. Methods are coded by shape rather than colour, so the three palettes
and both themes never carry semantic load.

**No backend, no network calls, no analytics SDK, no third-party runtime services.**

## Why this stack

**Capacitor over React Native.** Decided on cost and fit. This is a content and workflow product, not
a gesture-heavy one, so a WebView core carries no meaningful UX penalty, and it keeps a single
codebase for an eventual Android target. React Native would have bought native rendering the product
does not need, at the cost of rebuilding the whole UI layer.

**zustand over Redux or Context.** The entire app state is one store with a versioned migration,
persisted to localStorage. The session engine needs precise control over how state advances on a
wall clock, and a small store with explicit actions made that legible rather than buried in
reducers.

**No analytics, deliberately.** App Store Connect already supplies downloads, retention and crashes
with no SDK. Shipping zero network calls is what makes the privacy claim checkable rather than
asserted, which is a selling point in this category and keeps review simple.

**No backend in v1.** Supabase is scoped for v1.5, at which point the privacy policy, the privacy
manifest and the App Store privacy answers all have to be rewritten together.

---

## Engineering decisions worth naming

### Wall-clock session engine

The brew timer runs on absolute end timestamps, never on interval-accumulated state. A phone is
expected to be locked mid-brew, which suspends the WebView entirely, so any counter-based timer
drifts or stalls. Steps chain from the *scheduled* end of the previous step rather than from
`Date.now()`, so several overdue steps cascade onto the same schedule the notifications were
pre-scheduled against.

That distinction was a real bug: using `Date.now()` silently restarted the next step, so after a
locked-phone brew the notifications said "Brew complete" while the app still showed an early step.
Verified end to end on device, with the app backgrounded for a whole brew.

### Permission requests driven by data, not by default

The notification permission dialog originally fired on every user's first brew. Measuring the actual
recipe distribution showed why that was wrong: ten of twelve recipes finish inside four minutes with
no single step over two, and the other two are single steeps of 10 and 12 hours.

For a three minute pour-over the screen is held awake and the user is watching the pour target, so
the prompt solves a problem they do not have. iOS grants exactly one prompt per install, so spending
it there means having nothing left for the overnight steep, which is the case that genuinely cannot
work any other way. The threshold now sits at five minutes, with two orders of magnitude of margin on
either side.

The same measurement surfaced a second defect: keep-awake was held for the whole session, so starting
a twelve hour cold brew pinned the display on all night.

### A feature that shipped dead

The journal export built a blob URL and clicked a synthetic `<a download>`. That works in a browser,
which is where it was tested, and does nothing at all in a WKWebView. Confirmed by reading
Capacitor's iOS runtime sources directly: it implements no `WKDownloadDelegate` and no download
decision handler.

The result was an inert Settings row and a sentence in the store description that were both untrue.
Replaced with a real file write plus the system share sheet, which also meant declaring
`NSPrivacyAccessedAPICategoryFileTimestamp` (reason C617.1) in the privacy manifest, since the
filesystem plugin reads file timestamps.

### Device support set by evidence

The Capacitor template declared iPad support. There was no iPad layout to go with it, and App Store
Connect blocks submission until a 13-inch screenshot set exists.

Testing each width instead of assuming: clean at 440, 402 and 375 points, and broken at 320, where
the running-brew screen overlaps its own header and controls inside an `overflow: hidden` container
with no way to scroll out. Exactly one device could hit that (iPhone SE 1st gen, iOS 15.8), so the
deployment target moved to iOS 16, which makes 375pt the guaranteed floor and matches what was
verified. Chosen over adding the first responsive exception to a deliberately fixed-size design
system for a phone Apple dropped in 2022.

---

## Compliance and groundwork

### Name clearance

Five candidate names were researched and rejected on evidence before one cleared:

- **BrewLab** — an exact-name coffee app is live and actively updated on iOS; senior trademark users
  in the US, UK and EU; USPTO treats "BREW LAB" as descriptive.
- **Dialed** — a live US registration in class 9 for mobile app software, plus a class 30 coffee mark
  with a notice of allowance, plus a same-named coffee app already on iOS.
- **BRRW / BR3W** — store-available but structurally weak. Under TMEP 1209.03(j) a novel spelling
  that is the phonetic equivalent of a descriptive term is itself descriptive, so the clearer they
  read as "brew", the weaker the mark. BR3W was also already occupied in the exact niche.
- **Pourfect** — live on the iOS App Store in the same category, found via Apple's lookup API.

**15GRMS** cleared: no app holds the name, the domain set is free, and a dose figure says nothing
about software, so in class 9 it is arbitrary rather than descriptive. The one prior user, a UK
roaster, holds unregistered rights tied to beans and cafe services, not software.

One lesson came out of this that changed the method: an empty App Store search is not clearance.
"Steepwise" was clear on iOS and had no trademark, but `steepwise.app` was a live tea-journal product
with the same concept in an adjacent drink.

### Privacy that survives inspection

The policy claims the app collects nothing, and that is verified rather than asserted: no fetch or
XHR anywhere in `src/`, no analytics, no backend, fonts and recipes bundled, and the only permissions
are local notifications and keep-awake. The public policy and support pages are entirely
self-contained with zero third-party requests, which matters for an EU-based developer given German
rulings on embedded webfonts.

`PrivacyInfo.xcprivacy` declares the one required-reason API the app actually reaches, and nothing
else.

### EU Digital Services Act trader status

Public sources conflicted on whether declaring non-trader delists an app from EU storefronts. The
contradiction resolved on a distinction: apps removed in February 2025 had declared *nothing*, not
non-trader. Declaring trader publishes a contact address on the public product page across all 27 EU
storefronts, which for an individual means a home address unless a service address is arranged.
Non-trader was the correct and honest answer for a free app with no commercial intent, and the
decision is documented alongside the pricing decision it is coupled to, because charging money would
require re-declaring.

---

## Pre-submission audit

A systematic audit before submission caught, among others:

1. **Blocking:** the binary declared iPad support with no iPad layout or screenshots.
2. **Dead feature:** journal export inert on device while advertised in the store description.
3. **Battery:** keep-awake held through a twelve hour steep.
4. **Layout:** running-brew screen collapsing below 375pt.
5. **Stale asset:** a wordmark spelling a rejected brand name shipping inside the binary, alongside
   1.3 MB of unreferenced design files (68% of the web bundle).
6. **Metadata:** a store screenshot advertising a recipe name no longer in the build.
7. **Accuracy:** a privacy policy describing feedback form fields as optional when all were required.
8. **Review risk:** review notes directing a reviewer to an empty screen while verifying the one
   behaviour the notes existed to explain.

Every upload also carries `ITSAppUsesNonExemptEncryption`, so builds go straight to testable rather
than parking in Missing Compliance.

---

## Verified on device

TestFlight build on an iPhone running iOS 26.5:

- Short pour-over starts with no permission prompt; cold brew prompts. The asymmetry holds.
- Background timer with the phone locked lands on Brew Complete with the true duration.
- Share-sheet journal export works.
- Icon renders correctly, app follows system light/dark.

---

## What I would do next

- Supabase for optional sync, which requires rewriting the privacy policy, the privacy manifest and
  the App Store answers together before that build ships.
- Android via the same Capacitor core.
- A Bean Shelf library, deferred from v1 along with per-palette alternate app icons.

---

*If you are presenting this on a portfolio site, consider noting your development tooling if that is
relevant to how you want the work read. Delete this line before publishing.*

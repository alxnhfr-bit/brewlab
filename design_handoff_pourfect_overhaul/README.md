# Handoff: Pourfect design overhaul (BrewLab → Pourfect)

## Overview
A full visual overhaul of the BrewLab coffee companion (repo `alxnhfr-bit/brewlab`, Vite + React + TypeScript, single `<BrewLab>` shell with three tabs and a full-screen session overlay). The information architecture, flows and copy are unchanged; the visual system is replaced by the approved "Pink stickers" direction: near-black ink, 2px rules, Archivo Black display type, sticker shapes for methods, pill buttons, and a user-selectable colour palette (Pink, Lime, Tangerine) with Light / Dark / System mode. The public name in the UI is **Pourfect** (BrewLab stays as the repo codename).

## About the design files
Everything in this bundle is a **design reference built in HTML**. `Pourfect.dc.html` is a prototype that shows the intended look and behaviour; it is not production code to copy. The task is to **recreate these screens inside the existing React codebase**, using its established structure (`src/BrewLab.tsx` shell, `src/screens/*`, `src/ui/primitives.tsx`, `src/styles/tokens.css`, the Zustand-style store in `src/lib/store.ts`) and its data (`src/lib/recipes*.ts`, `src/lib/session.ts`, `src/lib/coaching.ts`). Open `Pourfect.dc.html` in a browser (keep `support.js` and `ios-frame.jsx` next to it) to inspect any measurement; every style is inline on the element.

## Fidelity
**High-fidelity.** Colours, type, spacing, radii and copy are final. Recreate pixel-accurately at 402 px logical width (the prototype frame is iPhone 402 × 874). The app is fluid: use the 20 px gutter and let content stretch; nothing is fixed-width except icons and stickers.

## Global system

### Palette and mode (new feature)
- Two settings: `palette: "pink" | "lime" | "tangerine"` (default `pink`) and `appearance: "system" | "light" | "dark"` (already exists in the store as the theme setting; keep it, add `palette`).
- Apply as attributes on the app root: `data-palette` and `data-theme` (resolved light/dark). `tokens.css` in this folder contains the six variable sets; drop it in next to `src/styles/tokens.css` and map the old `--bl-*` names as follows, then delete per-method accent tokens (methods are coded by shape now, not colour):
  - `--bl-bg` ← `--p-bg`, `--bl-card` ← `--p-card`, `--bl-ink` ← `--p-ink`, `--bl-muted` ← `--p-muted`, `--bl-faint` ← `--p-faint`, `--bl-line` ← `--p-ink` (all rules are 2 px ink), `--bl-brand` ← `--p-accent`, `--bl-brand-ink` ← `--p-accent-ink`, `--bl-scrim` ← `rgba(0,0,0,.5)`.
- Token roles: `bg` page, `card` sheet/card surface (equals bg in Lime), `ink` text + rules, `muted` secondary text, `faint` tertiary text and placeholders, `accent` filled surfaces (hero, primary button, stickers, progress), `accent-ink` text on accent, `track` unfilled progress, `num` the big pour-target numeral, `nav-active` the active tab colour.
- Contrast was checked at 4.5:1 for body text in all six sets; keep text on accent surfaces in `accent-ink`, never in `ink`.

### Type
- Display: **Archivo Black** (Google Fonts). Body/UI: **Archivo** 400 / 600 / 700. Tabular numerals everywhere numbers change.
- Scale (size / line-height / tracking):
  - Pour target: 104 px / 0.9 / −0.05em, Archivo Black, colour `num`; unit "G" 40 px in `ink`.
  - Countdown numeral (Get ready): 176 px / 1 / −0.06em on an accent burst.
  - Hero title: 36 px / 0.95 / −0.03em, uppercase. Recipe/entry detail title: 34–36 px same style.
  - Page title: 28 px / 1 / −0.04em. Sheet title: 24 px / 1 / −0.03em. Step name (session): 24 px uppercase / −0.02em.
  - Timer readout: 40 px / 1 / −0.03em. Stepper value: 44 px / 1 / −0.04em. Spec value: 17–20 px / 1 / −0.02em.
  - Row title: 15 px Archivo Black uppercase / −0.01em. Nav label: 12 px Archivo Black / .12em. Button: 18 px Archivo Black / .04em.
  - Label: 11 px 700 / .16em uppercase, `muted`. Micro label: 10 px 700 / .12em. Meta: 11–12 px 700 / .08–.1em. Chip: 12 px 700 / .08em uppercase. Body: 15 px 400 (`muted` when secondary), 14 px 600 in coaching panels.

### Shape language
- Rules and borders: 2 px solid `ink` (3 px for a selected palette card). No hairlines, no shadows except the floating Now Brewing pill (`0 12px 28px rgba(0,0,0,.18)`).
- Radii: pills 999 px (buttons, chips, inputs, segmented controls, mini-bar), hero panel 28 px, cards/coaching/notes 22 px, sheet top corners 28 px, round icon buttons 40–48 px.
- Stickers (method glyphs), drawn with `clip-path` from `tokens.css`: **V60** = burst in `accent`; **AeroPress** = circle in `ink`; **Cold brew** = diamond in `accent`. Sizes: 40 px in lists, 36 px in onboarding cards, 32 px next to detail titles, 26 px in the header logo (with a 34% `ink` dot centred), 12 px for rating dots.
- Rating: five bursts, 26–30 px, filled `accent` for the score and `track` for the rest (replaces the bean icons).
- Nav bar: full-width `ink` bar, labels in `bg` at 60% opacity; active label in `nav-active` with a 3 px underline in the same colour, 4 px below the text. Padding 16 px 28 px 36 px (36 covers the home indicator).

### Spacing
Screen gutter 20 px. Status-bar clearance 62 px top. Top bars: padding 10–14 px 20 px, bottom rule 2 px. Section gap 26–28 px, label-to-content 10 px, list rows padding 14 px 0 with a 2 px rule between rows and a 2 px rule on top of the list. Hero panel padding 20 px. Sheet padding 12 px 20 px 28 px with a 44 × 4 px `ink` handle centred, 18 px above the title.

### Motion
- Session wedge ring: the current wedge blinks (`opacity 0` at 50%, 1 s, `steps(2,end)`, infinite). Same blink for any "current" segment.
- Onboarding burst and Get-ready burst rotate slowly: `spin` 40 s / 30 s linear infinite.
- Sheet open: slide up 280 ms ease-out with the scrim fading in. Screen pushes: standard platform push. Brew complete card: scale from .96 to 1 with fade, 350 ms.
- Respect `prefers-reduced-motion`: stop the spin and blink, keep state changes instant.

## Screens

All screens: background `bg`, text `ink`, font Archivo. Top area clears the status bar by 62 px. The tab bar is only present on tab roots and detail pages, not on sheets, session screens or onboarding.

### 1. The Pour (first run) — `src/screens/onboarding/ThePour.tsx`
Purpose: pick your brewer on first launch.
Layout: vertical, centred, 24 px side padding.
- Burst 240 × 240 in `accent`, rotating (spin 40 s). Inside, "POUR / FECT" on two lines, Archivo Black 32 px / 0.9 / −0.04em in `accent-ink`, rotated −8°.
- Tagline "YOUR COFFEE, STEP BY STEP." Archivo Black 20 px, 28 px below.
- Label "WHAT DO YOU BREW WITH?" 40 px below.
- Three equal cards in a row, gap 10 px: 2 px `ink` border, radius 22 px, padding 18 px 8 px 14 px, sticker 36 px above a 12 px 700 / .08em label ("V60", "AEROPRESS", "COLD BREW"). Tap selects the method and continues.
- "I'LL LOOK AROUND" 12 px 700 / .1em `muted`, underlined (offset 4 px), 26 px below the cards. Tap skips.

### 2. Brew home — `src/screens/brew/BrewTab.tsx`
- Header bar: logo mark 26 px (accent burst + ink dot) + "POURFECT" Archivo Black 20 px / −0.04em; right: date "TUE 9 SEP" 12 px 700 / .12em. Padding 14 px 20 px, 2 px bottom rule.
- Hero "Brew again" (only when a last brew exists): margin 20 px 20 px 0, `accent` panel, radius 28, padding 20, text `accent-ink`. Contents: label "BREW AGAIN" 11 px / .16em; title 36 px uppercase (max-width 230 px so it wraps left of the sticker); spec grid 16 px below: three cells with 2 px `accent-ink` borders, value 20 px Archivo Black ("15 G", "250 G", "94°C") over a 10 px / .12em caption ("COFFEE", "WATER", "3:00 TOTAL"); tweak pill 14 px below (pill, `accent-ink` fill, `accent` text 12 px 700 / .1em, counter-clockwise arrow icon, "GRIND COARSER · RATED BITTER"); primary button 16 px below: full width, min-height 64, pill, `accent-ink` fill, `accent` text, Archivo Black 20 px, "START BREW →". A burst sticker 84 × 84 in `accent-ink` sits at top 14 / right 14, rotated −12°, with the method code ("V60") in `accent`, Archivo Black 15 px.
- Method filter: 24 px below, row of pills gap 8: "ALL" (selected: `ink` fill, `bg` text), "V60", "AERO", "COLD" (2 px `ink` outline). Padding 10 px 14 px, 12 px 700 / .08em.
- Recipe list: 20 px below, 2 px top rule, rows with 14 px vertical padding and 2 px rules: sticker 40 px, title 15 px Archivo Black uppercase (ellipsis), subtitle 12 px `muted` ("James Hoffmann · light roast"), right-aligned ratio 13 px 700 ("15 : 250"). Tap opens Recipe detail. Favourite toggling stays on long-press or in detail (the heart column was removed from rows).
- "JUST A TIMER →" 20 px below: dashed 2 px `ink` pill, padding 14 px 20 px, 13 px 700 / .08em, arrow right-aligned. Opens the Quick brew sheet.
- Tab bar, "BREW" active.

### 3. Recipe detail — `src/screens/brew/RecipeDetail.tsx`
- Top bar: 40 px round outline back button, breadcrumb label "V60 · JAMES HOFFMANN · LIGHT ROAST" (11 px / .16em `muted`), 40 px round heart button on the right (filled `accent` heart when favourited).
- Content padding 22 px 20 px 0: sticker 32 px + title 36 px uppercase in one row (gap 12); description 15 px `muted` / 1.45; spec grid 18 px below: four cells, 2 px `ink` borders, value 17 px Archivo Black ("15 G", "250 G", "1:16.7", "94°C"), caption 10 px / .12em `muted` ("DOSE", "WATER", "RATIO", "TEMP"); tweak pill (ink fill, bg text) when a saved tweak exists.
- "STEPS" label 28 px below, list 10 px under it: each row has a 32 px `ink` circle with the step number in `bg` (Archivo Black 13), name 15 px Archivo Black uppercase, duration 13 px 700 right-aligned, detail 13 px `muted` / 1.4, water target 10 px / .12em `faint` ("TO 150 G"). Keep the existing "why" disclosure as a 12 px 700 `faint` "WHY ▾" link under the detail when a step has one.
- Actions 22 px below the list, gap 8: "DIAL IN" outline pill (min-height 60, padding 0 22 px, 13 px 700 / .08em) and "START BREW →" primary pill (flex 1, `accent` fill, `accent-ink` text, Archivo Black 18 / .04em).
- Tab bar, "BREW" active.

### 4. Dial in sheet — `src/screens/brew/DialInSheet.tsx`
Scrim `rgba(0,0,0,.5)`; sheet: `bg`, 2 px `ink` top rule, top radius 28, max-height 92%, scrolls internally.
- Handle, title "DIAL IN" 24 px, recipe line 14 px below (sticker 24 px, name 13 px 700, "· V60" label).
- Three steppers (DOSE, RATIO, TEMPERATURE), each: label, then a row with 48 px round outline − and + buttons and the value centred in Archivo Black 44 px (unit "G" 20 px). Ratio shows the computed water below in 12 px 700 / .1em `muted` ("248 G WATER"). Steps: dose 0.5 g, ratio 0.5, temperature 1 °C; ranges as in the current implementation.
- "LIVE PREVIEW" label 22 px below, list of the recipe's pour targets: rows min-height 42, 2 px rules, step name 12 px 700 / .1em left, water Archivo Black 14 px right. Recomputes on every change.
- Footer 18 px below, gap 8: "RESET" outline pill, "START BREW →" primary pill (flex 1). Start launches the session with the adjusted parameters.

### 5. Quick brew sheet — `src/screens/brew/QuickBrewSheet.tsx`
Same sheet chrome. Title "QUICK BREW", helper "No recipe. Just method, dose and water." 13 px 600 `muted`. Segmented method control 18 px below: three equal pills (min-height 44, 2 px `ink` border), selected = `ink` fill / `bg` text. Steppers DOSE and RATIO (with "225 G WATER"). Summary row 24 px below, centred, 12 px 700 / .1em `muted` with `ink` numbers: "94°C WATER · ABOUT 2:45". Primary "START BREW →" 22 px below.

### 6. Get ready (session pre-roll) — `SessionOverlay.tsx`
Full screen, no tab bar. Centred: accent burst 280 × 280 rotating (spin 30 s) with the countdown digit inside (Archivo Black 176 px, `accent-ink`); 32 px below, label "FIRST" then "BLOOM · POUR TO 50 G" Archivo Black 24 px uppercase; 22 px below, an outline pill "GET READY ▾" (12 px 700 / .1em) that expands the full step list; "CANCEL" 13 px 700 / .1em `muted` centred 40 px above the bottom. Counts 3-2-1 at 1 s each, then starts.

### 7. Brew session (running) — `SessionOverlay.tsx`
Full screen, fixed height, no scroll. Padding 58 px 20 px 36 px.
- Header row: close icon (X, 18 px bold) left, recipe name centre, "2 / 5" right; all 12 px 700 / .12em.
- Step rail 16 px below: one 8 px tall pill per step, gap 4; current = `accent`, done = `muted`, upcoming = `track`.
- Centre block (flex 1, centred): label "POUR TO", pour target 104 px in `num` with "G" 40 px `ink`; wedge ring 200 × 200 below (12 annular sectors, inner radius 60, outer 98, 0.06 rad gap each side, filled `accent` for elapsed overall time, current wedge blinking, rest `track`) with the step timer inside (Archivo Black 40 px "0:18" over "OF 0:30" 11 px / .12em `muted`); then step name 24 px uppercase, instruction 15 px `muted`, "NEXT: PAUSE · 0:15" 11 px / .12em `faint`.
- Controls: skip-back and skip-forward 64 px round outline buttons, "PAUSE" primary pill between them (flex 1, min-height 64, Archivo Black 18), gap 8. Paused state: label becomes "RESUME", ring stops blinking.
- Steps without a pour target (pause, drawdown) show the step's water total in `muted` instead of `num`.

### 8. Brew complete — `SessionOverlay.tsx`
Full screen. A card centred vertically: 2 px `ink` border, radius 28, padding 22 px 20 px, with an `accent` burst 84 × 84 at top 12 / right 12 rotated 12° showing the total time in `accent-ink` (Archivo Black 15). Inside: label "NICE POUR", title "BREW COMPLETE" 36 px uppercase (max-width 220); "RATE IT" label 24 px below and five 30 px burst ratings (gap 8); "HOW DID IT TASTE" label 22 px below and taste chips (Bitter, Sour, Weak, Strong, Just right; selected = `ink` fill / `bg` text; multi-select as today); coaching panel 20 px below when a taste is selected: `accent` fill, radius 22, padding 16, copy 14 px 600 / 1.45 in `accent-ink` from `src/lib/coaching.ts`, and a "SAVE FOR NEXT BREW" row (12 px 700 / .1em) with a 28 px `accent-ink` circle check on the right (filled when saved). Primary "DONE" pill sits at the bottom with 20 px gutters and 36 px bottom padding. Done writes the journal entry and dismisses.

### 9. Journal — `src/screens/journal/JournalTab.tsx`
- Page head: "JOURNAL" 28 px, sub-label "3 BREWS" (count), right: 44 px round outline "+" button (opens Log a brew). 2 px bottom rule.
- Groups by day ("TODAY", "YESTERDAY", then dates) with labels; each group is a list with a 2 px top rule. Row: sticker 40 px, name 15 px Archivo Black uppercase (ellipsis), meta 11 px 700 / .08em `muted` ("07:42 · 15 : 250 · BITTER", "· LOGGED" for manual entries), rating as five 12 px bursts on the right (gap 3). Tap opens Entry detail.
- Tab bar, "JOURNAL" active.

### 10. Entry detail — `EntryDetail.tsx`
- Top bar with back button and breadcrumb "JOURNAL · TODAY · 07:42".
- Sticker 32 + title 34 px uppercase; label "V60 · BREWED IN 3:02"; four-cell spec grid; tweak pill "TWEAK APPLIED · GRIND COARSER" when relevant.
- "RATING" (five 28 px bursts, tappable), "TASTE" chips, "NOTES" (2 px `ink` border, radius 22, min-height 100, padding 14 px 16 px, placeholder "How was the cup?" in `faint`), each section 26 px apart.
- Actions 24 px below: primary "BREW THIS AGAIN" (pill, `accent`), then "DELETE" outline pill full width 10 px below (confirm as today).
- Tab bar, "JOURNAL" active.

### 11. Log a brew sheet — `ManualLogSheet.tsx`
Sheet chrome, title "LOG A BREW". Sections 20 px apart: METHOD (segmented pills), RECIPE (OPTIONAL) (outline chips, wrap), NAME (pill input, min-height 52, 2 px border, 15 px; value 700), DOSE (G) and WATER (G) as two pill inputs side by side (gap 10, placeholders "15", "250", numeric keyboard), RATING (OPTIONAL) (five 26 px bursts, `track` until set), TASTE (OPTIONAL) (chips), primary "SAVE BREW" 24 px below. Validation as today (name required, dose/water numeric).

### 12. Library — `LibraryTab.tsx`
- Page head: "LIBRARY" 28 px, sub-label "YOUR RECIPES, KEPT CLOSE", right: 44 px round outline gear button (opens Settings).
- "FAVORITES" list: rows with sticker 40, name + ratio, bold heart icon in `accent`, and a "BREW" pill on the right (min-height 40, padding 0 16, `accent` fill, `accent-ink` Archivo Black 12 / .08em) that starts the session directly.
- "MY RECIPES" and "BEAN SHELF": dashed 2 px `ink` pill-cards (radius 22, padding 16 px 18 px) with 12 px 700 / .08em `muted` copy ("CREATE YOUR OWN RECIPES", "TRACK BAGS AND FRESHNESS") and a version badge pill on the right (`ink` fill, `bg` text 10 px / .12em: "V1.5", "V2").
- Now Brewing mini-bar (when a session runs behind a tab): sticky above the tab bar with 12 px side margins, `accent` pill, padding 10 px 18 px 10 px 10 px, burst 36 px in `accent-ink`, recipe name 13 px Archivo Black uppercase + "FIRST POUR · TO 150 G" 10 px / .1em, elapsed step time Archivo Black 18 px right. Tap re-opens the session overlay. Same component appears on every tab.
- Tab bar, "LIBRARY" active.

### 13. Settings sheet — `SettingsSheet.tsx`
Sheet chrome, title "SETTINGS". A list with 2 px rules, rows min-height 52, 12 px 700 / .1em: APPEARANCE (right: current "PINK · LIGHT" in `muted` + caret; pushes the Appearance screen), HAPTICS (toggle), SOUND (toggle), EXPORT JOURNAL (JSON) (right: "3 ENTRIES" + caret), VERSION (right: "0.1.0"). Toggle: 48 × 28 pill, `ink` fill when on with a 22 px `bg` knob (3 px inset) on the right; off = 2 px `ink` outline with an `ink` knob on the left. Footer line 18 px below: 22 px mark + "POURFECT · POUR IT RIGHT, EVERY TIME" 12 px 700 / .08em `muted`.

### 14. Appearance (new screen) — add under Settings
- Top bar: 40 px back button, then "SETTINGS" label over "APPEARANCE" Archivo Black 24 px.
- "COLOR": three cards in a row (gap 10), each a button: radius 22, 2 px `track` border (3 px `ink` when selected), inner preview 126 px tall rendered **in that card's own palette** at the current mode: its `bg`, a 30 px burst in its `accent`, a 22 px dot in its `ink`, and the name ("PINK", "LIME", "TANGERINE") Archivo Black 12 / .08em. Selected card shows a 24 px `ink` circle with a `bg` check at top 8 / right 8. A one-line note under the row describes the selected palette (Pink: "Hot pink on black. The original sticker set." Lime: "Acid lime and bottle green, strictly two colors. They swap in dark mode." Tangerine: "Plum ink with a tangerine accent. Warmest of the three.").
- "MODE" 28 px below: three pills LIGHT / DARK / SYSTEM (min-height 48, selected = `ink` fill / `bg` text).
- "PREVIEW" 28 px below: a reduced hero panel (accent, radius 22, padding 16) that re-renders live.
- Tab bar with "LIBRARY" active. Changes apply immediately app-wide and persist.

## Interactions & behaviour
- Navigation and flows are unchanged from the current app: Brew → Recipe detail → Dial in / Start; Quick brew from home; session overlay (Get ready → running → complete) over everything with the mini-bar when minimised; Journal → Entry detail; Library → Settings → Appearance.
- Palette/mode selection: tap applies instantly (no confirmation), persists with the other settings, and is reflected in the Settings row label. System mode follows `prefers-color-scheme` live.
- Pressed states: pills scale to .97 for 120 ms; outline pills fill `ink`/`bg` while pressed; list rows dim to 70% while pressed. No hover states (touch app).
- Loading/empty: recipe data is local; journal empty state keeps the current copy set in "STICKER" style (label + outline card). Errors only in Log a brew validation: 2 px `accent` border on the invalid input plus a 12 px 700 message in `accent-ink` on an `accent` pill below it.
- Reduced motion: see Motion.

## State management
- Existing store (`src/lib/store.ts`): keep entries, favourites, tweaks, session state and `appearance` (system/light/dark). Add `palette: "pink" | "lime" | "tangerine"` with default `pink`, persisted like the others.
- Root effect: resolve mode, then set `document.documentElement.dataset.palette` and `.dataset.theme`. The prototype does exactly this on each screen root.
- Session progress for the wedge ring = elapsed total / total duration (12 wedges, `round`), step rail = per-step status, timer text = per-step elapsed.

## Design tokens
See `tokens.css` (six palette sets, fonts, sticker clip-paths, keyframes). Summary:
- Pink light: bg #FFF4F8, card #FFFFFF, ink #111111, muted #4A4548, faint #8F878B, accent #FF3E9A, accent-ink #111111, track #F3DCE6, num #111111, nav-active #FF3E9A. Dark: bg #111111, card #1C1819, ink #FFF4F8, muted #C9BFC4, faint #6E6669, accent #FF3E9A, accent-ink #111111, track #2A2426, num #FF3E9A, nav-active #FF3E9A.
- Lime light: bg #D9F26B, card #D9F26B, ink #0F3B2E, muted #2E5A4B, faint #5E8474, accent #0F3B2E, accent-ink #D9F26B, track #BFD85C, num #0F3B2E, nav-active #D9F26B. Dark: bg #0F3B2E, card #0F3B2E, ink #D9F26B, muted #A9C46A, faint #5E8474, accent #D9F26B, accent-ink #0F3B2E, track #1E5243, num #D9F26B, nav-active #0F3B2E.
- Tangerine light: bg #F7EFE3, card #FFFFFF, ink #2A1633, muted #5A4A66, faint #9A8CA3, accent #FF6B1A, accent-ink #2A1633, track #E6DCCF, num #2A1633, nav-active #FF6B1A. Dark: bg #2A1633, card #35203F, ink #F7EFE3, muted #C9BBD3, faint #7A6C86, accent #FF6B1A, accent-ink #2A1633, track #3E2A4A, num #FF6B1A, nav-active #FF6B1A.
- Spacing scale: 4, 8, 10, 12, 14, 16, 20, 22, 24, 28, 36. Radii: 22, 28, 999. Rules: 2 px (3 px selected). Shadow: mini-bar only, `0 12px 28px rgba(0,0,0,.18)`.

## Logo and app icon (approved: burst + drop)

The mark is the in-app V60 sticker: a 12-point burst (inner radius 72% of outer) with a drop in the centre. Construction and every variant are shown in `Pourfect Logo.dc.html`.

- **App icon tiles** (`assets/logo/icon-<palette>.svg`, `icon-<palette>-dark.svg`): 1024 grid, corner radius 224. Light tile = accent fill, ink burst, accent drop. Dark tile = ink fill, accent burst, ink drop. Ship the tile that matches the user's chosen palette if you support alternate icons (`UIApplication.setAlternateIconName`); otherwise ship Pink light.
- **App Store / asset catalog**: `assets/logo/appstore-icon-<palette>-square.svg` are the same tiles without rounding (the OS masks them). PNG exports at every iOS size are in `assets/logo/png/` (1024, 512, 180, 167, 152, 120, 87, 80, 76, 60, 58, 40, 29), light and dark per palette.
- **In-app mark** (`assets/logo/mark-<palette>.svg`): burst + dot, for the header logo (26 px) and the Settings footer (22 px). Colours follow the palette's light-mode accent and ink (Lime is a green burst with a lime dot). Use `mark-<palette>-drop.svg` only at 32 px and above (splash, About).
- **Mono** (`icon-mono.svg`, `mark-mono.svg`): black tile / white burst for favicons, print and monochrome contexts.
- **Wordmark**: "POURFECT" in Archivo Black, tracking −0.04em, mark height 1.3 × cap height, gap 0.28 × cap height. `wordmark.svg` keeps the text live; outline it before shipping.
- Rules: never mix palettes in one tile; never rotate the icon tile (the in-app sticker may rotate −12°); clear space around the mark = the dot diameter.

## Assets
- `assets/logo/`: see the Logo section above. App icons per palette, light and dark tiles (`icon-<palette>.svg`, `icon-<palette>-dark.svg`), 1024 grid, corner radius 224 (export square for the App Store, the OS masks it); in-app marks (`mark-<palette>.svg` burst + dot, `mark-<palette>-drop.svg` burst + drop for sizes ≥ 32 px); `icon-mono.svg` / `mark-mono.svg`; `wordmark.svg` (text layer uses Archivo Black; outline before shipping). Construction notes are in `Pourfect Logo.dc.html`.
- Icons: Phosphor Icons, **bold** weight only (x, caret-left/right/down, plus, minus, heart, gear-six, check, skip-back, skip-forward, arrow-counter-clockwise, arrow-right, timer). The current app uses the light weight; switch the import to bold.
- Fonts: Archivo Black and Archivo from Google Fonts (self-host for production).

## Files
- `screenshots/` — one PNG per screen (Pink, light), numbered in flow order, for quick reference.
- `assets/logo/png/` — icon PNG exports; `assets/logo/appstore-icon-*-square.svg` — unmasked tiles.
- `Pourfect.dc.html` — the approved design, all 14 screens, with the live palette/mode switch (needs `support.js` and `ios-frame.jsx` alongside; open directly in a browser).
- `Pourfect Logo.dc.html` — icon sheet and construction.
- `tokens.css` — palette variables, fonts, sticker clip-paths, keyframes.
- `assets/logo/` — SVG logo files listed above.
- Screen map to repo files: see `github.md` at the project root (Shell `src/BrewLab.tsx`; Brew `src/screens/brew/*`; Session `src/screens/session/*`; Journal `src/screens/journal/*`; Library `src/screens/library/*`; Onboarding `src/screens/onboarding/ThePour.tsx`).

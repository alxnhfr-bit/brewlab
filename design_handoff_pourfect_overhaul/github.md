repo: alxnhfr-bit/brewlab
branch: main

## Last sync
date: 2026-09-10T00:00:00Z

### Updated in this project
- Design overhaul approved: `Pourfect.dc.html` is the source of truth (5c "Pink stickers" layout, switchable palettes pink / lime / tangerine, light / dark / system)
- Explorations kept for reference in `Pourfect Directions.dc.html`; faithful copy of the current app in `BrewLab Recreation.dc.html`

## Sync history
- 2026-09-09T16:59:03Z: read full app source (shell, tokens, primitives, all screens) to plan the overhaul

## Screen map
| Screen | Repo files | Approved design |
| --- | --- | --- |
| Shell + tab bar | src/BrewLab.tsx, src/styles/tokens.css, src/index.css, src/ui/primitives.tsx, src/ui/icons.tsx | Pourfect.dc.html (all phones: nav bar, palette variables) |
| Brew (home) | src/screens/brew/BrewTab.tsx, src/screens/brew/shared.tsx, src/lib/recipes.ts, src/lib/recipes-extra.ts | Pourfect.dc.html › Brew home |
| Recipe detail | src/screens/brew/RecipeDetail.tsx, src/screens/brew/shared.tsx | Pourfect.dc.html › Recipe detail |
| Dial in sheet | src/screens/brew/DialInSheet.tsx | Pourfect.dc.html › Dial in sheet |
| Quick brew sheet | src/screens/brew/QuickBrewSheet.tsx | Pourfect.dc.html › Quick brew sheet |
| Brew session (get ready / running / complete) | src/screens/session/SessionOverlay.tsx, src/screens/session/accent.ts, src/lib/session.ts, src/lib/coaching.ts | Pourfect.dc.html › Get ready, Brew session, Brew complete |
| Now brewing mini-bar | src/screens/session/NowBrewingBar.tsx | Pourfect.dc.html › Library (pill above nav) |
| Journal | src/screens/journal/JournalTab.tsx, src/screens/journal/shared.tsx | Pourfect.dc.html › Journal |
| Journal entry detail | src/screens/journal/EntryDetail.tsx | Pourfect.dc.html › Entry detail |
| Manual log sheet | src/screens/journal/ManualLogSheet.tsx | Pourfect.dc.html › Manual log sheet |
| Library | src/screens/library/LibraryTab.tsx | Pourfect.dc.html › Library |
| Settings sheet | src/screens/library/SettingsSheet.tsx | Pourfect.dc.html › Settings sheet, Appearance (new screen) |
| First run (The Pour) | src/screens/onboarding/ThePour.tsx | Pourfect.dc.html › The Pour |

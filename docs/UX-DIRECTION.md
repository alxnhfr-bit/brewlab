# BrewLab Overhaul: Final Direction

**Base: "Two Taps to Bloom" (unanimous judge winner), with the improvement loop grafted in from Craft Journal and the cheap, high-value tools grafted in from Patient Teacher.** The governing metric stays: time-to-timer. One tap and about five seconds from cold launch to a running guided brew for a returning user. Every screen, feature, and animation is scored against that number. The one thing the speed lens lacked, a reason the app makes you better rather than just faster, is added as the taste-chip-to-pending-tweak loop, which all three judges independently named the best idea outside the winner.

## Judge conflicts, resolved

1. **Taste capture: chips, not sliders.** Sided with Judges 2 and 3 over Patient Teacher's three notched sliders. One optional tap (bitter, sour, weak, strong, just right) preserves the zero-required-input rule; sliders are homework.
2. **The clay color collision.** Craft Journal wanted roasted clay (~#C0754D) for journal moments; Two Taps assigns clay to AeroPress. Sided with Judge 2's note: keep the brewing-vs-remembering semantics, change the hue. AeroPress keeps clay #B06A4A (method identity needs the strongest fix; the current three near-identical greens are the worst defect in the existing palette). Journal and memory moments get roasted caramel #9C6B43, deeper and browner than both clay and heat-amber. Amber #C99A5B stays reserved exclusively for heat signals.
3. **Session controls: scrub-back ships.** Sided with Judge 2 over the winner's Pause and Skip only. Real kitchen brewing includes mistakes; a timer that fights nonstandard technique gets deleted. Controls become Pause, plus a step scrubber (back and skip). Still two touch targets, still one-handed.
4. **Pre-Brew Checklist: yes, but collapsed.** Sided with Judge 1. It folds into the 3-second Get Ready pre-roll as an optional expandable (rinse filter, water temp, personalized grind setting once known). Never adds a tap to the fast path.
5. **Coaching in v1: yes, as a rules table, not an engine.** Judge 3 flagged day-one heuristics as a trust liability; Judges 1 and 2 correctly note the stripped version is roughly a dozen conservative, single-variable rules with reasoning shown ("A touch bitter: try a slightly coarser grind, or water 2C cooler"). That is v1-cheap. The full Fix My Cup troubleshooter waits for v1.5.
6. **Dark mode: v1, non-negotiable.** All judges dinged Patient Teacher for deferring it. The real context is a kitchen at 6am.

## 1. Navigation model and screen inventory

Three fixed, noun-based bottom tabs (HIG and M3 compliant, safe under the iOS 26 floating capsule bar; no critical CTA in the bottom safe area). The Brew Session is a state, not a place: full-screen modal, never a tab. The calculator is dissolved into Dial In and Quick Brew, never a tab. Settings is a sheet from the header avatar, never a tab.

**Tab 1: BREW (default)**
- **Brew** (tab root): Brew Again hero card with pending-tweak chip, method filter chips (V60, AeroPress, Cold Brew), recipe browser, Quick Brew entry. This is the home screen; there is no marketing home.
- **Recipe Detail** (push): why-line, parameters in mono, step timeline preview, collapsible one-line "why" tip per step (collapsed by default, experts never see them), remembered dose, 64pt Start Brew in the thumb zone.
- **Dial In** (sheet): dose dial with 1g haptic detents, ratio lock, temp, roast and taste nudges; recomputes every step's water target live; edits remembered per recipe.
- **Quick Brew** (sheet): freestyle method plus dose plus ratio; generates simple guided steps or a plain stopwatch.
- **Brew Session** (full-screen modal): guided timer; 96pt pour-target grams, step ring, cumulative time in tabular mono, next-step preview, Pause plus step scrubber, keep-awake, Live Activity mirror (v1.5).
- **Get Ready pre-roll** (session state): 3-second countdown showing step 1's target, with the optional expandable pre-brew checklist.
- **Brew Complete** (session state): entry already saved; optional 5-bean rating, optional taste chips; a chip triggers the Coaching Card (one conservative adjustment, reasoning shown, "save tweak for next brew" toggle).
- **Now Brewing mini-bar** (accessory, docked above the tab bar): appears if the user backs out of the session in-app; one tap returns. Spotify precedent; the winner had no in-app answer for tab-switching mid-brew.

**Tab 2: JOURNAL**
- **Journal** (tab root): reverse-chronological auto-collected brew log grouped by day, method glyphs, ratings, taste dots, search and filter. No streaks; count framing only ("127 brews").
- **Brew Entry** (push): full record of a past brew, fully editable after the fact, Brew This Again carrying tweaks forward.
- **Manual Log** (sheet, from the plus button): log a brew without ever running the timer; same fields, all optional.

**Tab 3: LIBRARY**
- **Library** (tab root): Favorites, My Recipes, Bean Shelf section (v2); avatar in the large-title header opens Settings.
- **Recipe Editor** (push, v1.5): create or duplicate-and-edit with a flexible step model (arbitrary step types, per-step water and time, bypass water, nonstandard techniques).
- **Bean Shelf Entry** (push, v2): bag details, roast-date freshness decay ring, linked brews; freshest bag auto-defaults into every new brew.
- **Fix My Cup** (sheet, v1.5): symptom picker, 2 to 3 questions, one adjustment writable onto a recipe. A decision tree, not a curriculum.

**Chrome**
- **Settings** (sheet): units, temp scale, haptics and sound toggles, appearance, CSV/JSON export (v1), account and sync status, account deletion.
- **Sign In** (sheet, v1.5): Apple, Google, magic link; appears only when a sync feature is touched.
- **First Run** (one-time full screen): The Pour (below).

## 2. Core flow: cold launch to running brew

Returning user, the flow that must win:

1. **0.0s:** Tap app icon. Native splash, cream background, no white flash (@capacitor/splash-screen).
2. **~0.8s:** Brew tab renders from the local store. Brew Again card at top: "The Hoffmann Method, V60, 15g : 250g, 94C, last brewed Tuesday" plus the pending-tweak chip: "grind coarser, you rated it bitter." Full-width 64pt Start button in the thumb zone.
3. **Tap 1: Start.** The card liquid-morphs into the Brew Session (spring, medium haptic). The saved tweak is applied and shown. Get Ready pre-roll counts 3 seconds, showing "Bloom: pour to 50g," exactly the time to set the phone down and zero the scale.
4. **Brewing.** Absolute end timestamp per step, rendered from wall clock, never setInterval. Local notifications pre-scheduled at every step boundary and completion, so backgrounding, lock, or a killed WebView loses nothing. Keep-awake active only during the session. Step changes: ring wipe, label slide, double light haptic tick plus soft chime; followable by feel while watching the kettle.
5. **Brew Complete:** strong success haptic. Entry is already saved. Optional: one bean-rating tap, one taste chip, one coaching save. Done stamps the entry into Journal with a tab-icon bounce.

**Total: 1 tap, about 5 seconds of interaction, to a running brew.** New-recipe path: tap a recipe card, optionally Dial In, Start Brew: 2 to 3 taps, under 15 seconds; every dose edit is remembered, so tomorrow it is 1 tap again. Cold brew is the exception by design: starting Overnight Concentrate schedules a "your cold brew is ready" notification window (12 to 18h) instead of holding a session open.

## 3. First-run: "The Pour"

One screen, under 15 seconds, skippable by tapping anywhere. No carousel, no account ask, no permission prompts.

- **0 to 1s:** Splash cross-fades to a cream canvas.
- **1 to 6s:** A 1.5px sage line draws a V60 cone and server (Rive vector loop, under 500KB, replacing the scroll-scrubbed JPEG hack outright). The bloom swells, a spiral pour animates, and a single soft haptic tick lands exactly on the first drop hitting the server.
- **6 to 8s:** Wordmark settles beneath: "Better coffee, step by step."
- **8s+:** One question, not a tour: "What do you brew with?" as three large method cards plus a quiet "I'll look around." The chosen card does a shared-element morph and physically expands into the real Brew tab, pre-filtered to that method. Onboarding becomes the app instead of preceding it. One coach mark on the top recipe: "Two taps and you're brewing."

Notification permission is primed contextually at the first brew start ("We ring at each step so you can watch the kettle, not the phone"), immediately before the system prompt. Reduce Motion swaps the Rive loop for a static illustrated frame with a fade. The Rive asset is reused for pull-to-refresh and empty states, so the wow moment amortizes into a brand system instead of a one-off lobby trick.

## 4. Design system evolution

**Palette (keep the warmth, fix contrast and differentiation).** Light: cream #F5F5F3 background, true white cards with 1px #E0E0DD hairline, ink deepened to #26231F for AAA body contrast. Sage #4A6B5D stays the brand primary, reserved for interactive elements. Method accents become genuinely distinct: V60 sage #5B7F6E, AeroPress clay #B06A4A, Cold Brew slate #5E7A8C. Amber #C99A5B exclusively for heat signals. Roasted caramel #9C6B43 exclusively for journal and memory moments (ratings, taste dots, the stamp), so brewing reads calm and remembering reads warm. Dark mode ships in v1: espresso #1C1917, #2A2622 cards, desaturated accents.

**Type.** Platform system font (SF Pro, Roboto) for all UI body and controls, the single highest-leverage "not a wrapped website" move. Outfit survives as display voice only (recipe names, section headers, SemiBold). DM Mono is a strict data voice: weights, ratios, temps, timer digits, always tabular figures. Scale honors Dynamic Type.

**Icons.** Retire the one-off hand-drawn set. Systematic family on a 24px grid, uniform 1.5px stroke, rounded terminals, shared corner radii (Phosphor Light metrics as base, custom method glyphs: cone, plunger, ice cube, kettle, bean). The warmth survives in the thin stroke, not in inconsistency.

**Five signature motion and haptic moments** (springs only, 200 to 400ms feedback, ~600ms context changes; Reduce Motion respected; haptics toggleable; everything else stays calm fades):
1. **First Drop:** Start button liquid-morphs into the session ring; medium impact (@capacitor/haptics).
2. **Step Turn:** ring color wipe plus label slide; double light tick, distinct pattern per event type (@capacitor/haptics, chime via pre-scheduled @capacitor/local-notifications when backgrounded).
3. **Finish Bell:** success notification haptic plus warm chime; ring blooms outward (@capacitor/haptics).
4. **Ratio Dial:** 1g detents with selection haptics; water figure counter-rolls like an odometer (@capacitor/haptics selection API).
5. **Journal Stamp:** completed brew card springs into the Journal tab; tab icon bounces once (@capacitor/haptics light).

Infrastructure plugins from day one: @capacitor/status-bar, @capacitor/splash-screen, @capacitor/keyboard, @capacitor/app (resume-event timer reconciliation), @capacitor-community/keep-awake (session-scoped only).

## 5. Release plan

**v1 (solo-shippable, fully offline, no account required for anything):**
- 3-tab IA, Brew Session engine (wall-clock timestamps, scheduled local notifications, keep-awake, haptic grammar), Get Ready pre-roll with collapsible checklist, Pause plus step scrubber, Now Brewing mini-bar.
- Brew Again with per-recipe dose memory and pending-tweak chip; Dial In; Quick Brew; cold brew scheduled-notification mode.
- Auto-logging Journal (zero required input), editable past entries, Manual Log without the timer: the three loudest category complaints, solved structurally.
- Taste chips plus Coaching Card (conservative rules table, reasoning shown, save-tweak toggle).
- ~12 recipes across V60, AeroPress, Cold Brew, bundled locally (verified against primary sources, factual attribution only). Favorites. Settings with CSV/JSON export (the cheap trust feature, shipped before sync exists). Dark mode. The Pour first-run. Both app stores.

**v1.5 (Supabase arrives):**
- Anonymous sign-in from first launch, upgraded in place to Apple, Google, or magic link, so no early brew is ever orphaned; sign-in appears only when a sync feature is touched. Sync of journal, favorites, custom recipes, dose memory, tweaks, preferences (per-record last-write-wins, pending/synced status, optimistic UI). Marketed as backup: "your brewing history survives a lost phone."
- Live Activities via Capacitor plugin plus the small Swift Widget Extension; Android ongoing chronometer notification. v1's notification architecture is the designed fallback, so this is additive polish.
- Recipe Editor with the flexible step model. Fix My Cup troubleshooter sheet. Recipes stored in Postgres, bundled at build time, background-refreshed between App Store releases (new content without review cycles).

**v2:**
- Bean Shelf with roast-date freshness decay ring and active-bag auto-default. Recipe sharing by link (share code lands in the recipient's local store, no account needed to receive). Apple Watch step haptics, Siri Shortcuts, Apple Health caffeine, home screen widgets.
- Explicitly out of roadmap until further notice: Bluetooth scales (the category's biggest bug magnet and reputation killer), social feeds, any subscription (pricing norms are free or cheap one-time; if monetized, a one-time unlock).

## 6. Top 3 risks

1. **Background timer correctness in a WebView.** The WebView throttles and can be killed; a brew timer that drifts or dies is a deleted app. Mitigation: the end-timestamp plus scheduled-notification architecture is the v1 foundation, not an optimization; prove it on real iPhone and mid-range Android hardware in week one, not month three; @capacitor/app resume events reconcile state; Live Activities are additive, never load-bearing.
2. **Motion is the differentiator and the money pit.** A half-executed spring system inside a WebView reads webbier than none, and 2025's Liquid Glass and M3 Expressive raised the bar. Mitigation: the budget is exactly five moments; cut by count, never by quality of survivors; system font and native chrome plugins do most of the native-feel work for free; mid-range Android testing is a launch gate; Reduce Motion fallbacks throughout.
3. **Solo v1 scope creep.** Even the cut v1 spans two stores, a session engine, and a design system. Mitigation: the cut line is structural and pre-declared (Recipe Editor, troubleshooter, Live Activities, and all Supabase work at v1.5; beans and sharing at v2; scales never); time-to-timer is the tiebreaker for every scope debate; the journal's health is protected structurally (100% of sessions auto-log with zero required input), so retention does not depend on discipline features that expand scope.

The 30-second portfolio demo this buys: cold launch, one tap, a running guided brew with haptics you can follow while watching the kettle, and yesterday's taste feedback already applied. That is the credibility centerpiece.

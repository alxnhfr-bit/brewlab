# App Store listing copy: 15GRMS

Paste-ready for App Store Connect. Character limits are Apple's; counts are noted
so nothing gets silently truncated.

---

## App Name (30 max)

```
15GRMS
```
*6 chars. The bare name is free on the App Store (verified via Apple's lookup API).*

## Subtitle (30 max)

```
Coffee brew timer and journal
```
*29 chars. Carries the search weight the coined name cannot, since "15GRMS" signals
nothing about coffee on its own.*

Why not "pour-over": only the V60 recipes are pour-over. AeroPress is immersion plus
pressure and cold brew is immersion, so "pour-over" undersells two of the three
methods. The accurate umbrella is **manual brewing** (also "hand brewing", or
"filter coffee" in the UK and EU), but nobody searches those, so the subtitle uses
the plain words people type and the keywords field carries the method names.

Why not "home brew": on the App Store "homebrew" means BEER. A search returns
Brewfather, Brewer's Friend, BeerSmith, BrewBuddy and Beer Lab, with no coffee apps
at all. It would aim the listing at the wrong audience and compete with established
beer software.

This wording also matches how the category names itself: "Brew Timer - Coffee
Recipes", "PixelCafe - Coffee Brew Timer", "BrewPrint: Coffee Brew Timer",
"Coffee Book: Brew Journal".

Alternates:
- `Coffee timer and brew journal` (29)
- `Brew timer for better coffee` (28)
- `V60, AeroPress and cold brew` (28, method-led rather than function-led)

## Promotional Text (170 max, editable without review)

```
Twelve guided recipes for V60, AeroPress and cold brew. The timer runs with your phone locked, and every brew logs itself. No account, no ads, nothing collected.
```
*161 chars, comfortably inside the 170 limit. Update this for seasonal pushes without resubmitting.*

## Keywords (100 max, comma separated, no spaces after commas)

```
coffee,pourover,v60,aeropress,brew,timer,barista,journal,recipe,grind,ratio,coldbrew,filter,scale
```
*97 chars. "espresso" and "chemex" are deliberately absent: the app ships no
recipe for either, and keywords that oversell get flagged. No need to repeat words already in the name or subtitle: Apple indexes
those separately. Plurals are matched automatically, so "recipe" covers "recipes".*

## Description (4000 max)

```
15GRMS is a brewing companion for people who make coffee by hand.

Pick a recipe, tap once, and start pouring. The timer counts each step against the
clock and tells you exactly how much water should be on the scale, so you can watch
the kettle instead of the phone.

ONE TAP TO BREWING
Your last brew waits on the home screen with the dose you used. Tap Start and you
are pouring in about five seconds.

IT KEEPS TIME WITHOUT YOU
The timer runs against the clock rather than against the app, so locking your phone
or switching away never breaks a brew. It is still correct when you come back. Set
a cold brew going and 15GRMS tells you when it is ready, ten hours later.

TWELVE RECIPES, CREDITED
The Hoffmann Method, 4:6 Method, Winton Five Pour, The Adler Original, Overnight
Concentrate and more, credited to the people who developed them. Each pour shows
its target on the scale, with the reasoning behind the steps that matter.

DIAL IN YOUR DOSE
Change the dose, ratio or temperature and every pour target recalculates as you
turn the dial. Your change is remembered for next time.

A JOURNAL THAT FILLS ITSELF IN
Every brew is logged the moment it finishes, with nothing to type. Rate it, tag how
it tasted, add notes if you feel like it.

COFFEE COACHING, NOT LECTURES
Too bitter? Sour? Thin? Say so in one tap and 15GRMS suggests a single conservative
adjustment, explains why, and applies it the next time you brew that recipe.

MAKE IT YOURS
Three colour palettes in light and dark, switchable at any time.

PRIVATE BY DEFAULT
No account. No sign-up. No analytics. No ads. 15GRMS makes no network requests at
all, so everything you record stays on your phone, and it works perfectly with no
signal. Export your journal as JSON whenever you like.
```
*Roughly 1,500 characters. The first two paragraphs matter most: Apple only shows
about three lines before "more".*

## What's New (first release)

```
First release.
```

## Category

- Primary: **Food & Drink**
- Secondary: **Lifestyle**

## App Information (record level: answered once, not per version)

These are the answers, not the outcome. Several are effectively frozen after the
first submission, so they are written down rather than improvised at the form.

| Field | Answer | Why |
| --- | --- | --- |
| Age rating outcome | **4+** | Falls out of the answers below |
| Alcohol, tobacco or drug references | None | Caffeine does not count; do not overthink this into 13+ |
| Unrestricted web access | **No** | The three Settings links are `target="_blank"` handoffs to Safari, not an embedded browser. Revisit if an in-app webview is ever added |
| User-generated content | **No** | Journal text is device-local, never shared, no feed, no other users |
| Social media capabilities | **No** | Required to answer since September 2026. Yes would attach a Social Media descriptor and push toward 13+ |
| Content rights: third-party content | **No** | No ads, no analytics SDK, no fetched content. Archivo and Archivo Black are OFL. A brewing method is an unprotectable process; the prose is original |
| Copyright | `2026 Alexander Neuhofer` | |
| Primary language | English (U.S.) | |
| Price | Free, worldwide | |
| In-app purchases | None | |
| IDFA / advertising identifier | **No** | Nothing in the app touches it |
| Release option | **Manual** for a first release | So you choose the moment it goes live rather than it appearing the instant review passes |
| Mac / Apple Vision Pro availability | **Off** | These toggles can default ON and would put an untested iPhone-only build on two more platforms |
| EU trader status (DSA) | **Non-trader** | Free app, no IAP, no ads, no revenue, no intent to commercialise, which matches Apple's own "hobbyist" example. Publishes nothing; EU customers see a consumer-rights notice. **Must be re-declared as trader if a paid unlock is ever added.** Business > Agreements > Compliance |
| SKU | `15grms-ios` | Arbitrary, permanent, never shown to users |
| Tax category | App Store Software (B2) | Required even at price zero |
| EULA | Apple's standard | No custom terms needed |
| Sign-in required | **No** | There is no account |
| App Review contact | Alex's own name, phone and email | Reviewer-only, never published. Note there is no support email anywhere else in the project since support moved to a form, so this is the one place a personal address is correct |
| Version string | `1.0.0` | Must match `CFBundleShortVersionString` in the archive |

Read the region-specific ratings App Store Connect computes rather than assuming
4+ applies everywhere.

## URLs

| Field | Value |
| --- | --- |
| Privacy Policy | `https://alxnhfr-bit.github.io/brewlab/privacy.html` |
| Support | `https://alxnhfr-bit.github.io/brewlab/support.html` |
| Marketing | leave blank |

## App Privacy questionnaire

Answer **Data Not Collected**.

This is verifiable, not a convenience: `src/` contains no fetch or XHR calls, no
analytics SDK, no third-party services, and no backend. The only permissions are
notifications (local, scheduled on device) and keep-awake during a brew.

## Screenshots

`store/screenshots-6.9/` holds five 1320 x 2868 captures, which is the required
6.9 inch size. An iPhone-only binary needs this one size set; Apple downscales
for smaller devices. 1 to 10 per size, and the Media Manager panel is the
authority if it ever disagrees with this file.

All five are RGB with no alpha channel, and all match the shipping build as of
2026-09-13. `01-brew-home` and `05-journal` were recaptured that day: they
predated the attribution change, so the first showed bare bylines ("James
Hoffmann") instead of "After James Hoffmann", and the second advertised
"COMPETITION WINNER", a recipe name no longer anywhere in the build.

**Recapturing is scripted, so do it whenever user-facing copy changes.**
[seed-screenshot-state.mjs](seed-screenshot-state.mjs) writes a realistic
journal and a pending tweak straight into the simulator's WKWebView
localStorage, which avoids completing brews by hand. Its header carries the full
procedure. Three things that cost an hour to learn the first time:
- The device must be the **iPhone 17 Pro Max**. It gives 1320x2868; the plain
  Pro gives 1206x2622, which is the wrong size and is silently accepted by
  everything until App Store Connect rejects it.
- Capture with `xcrun simctl io booted screenshot`. The iOS simulator automation
  tool returns stale frames (it will happily show a screen the app cannot
  currently be on); its taps are reliable, its screenshots are not.
- The WebKit origin directory is created on first write, and its hash is per
  install, so onboarding must be tapped through once before there is anything to
  seed. Copying the path from a previous run silently seeds an origin the app
  never reads.

Captures come out RGBA but fully opaque, so flatten to RGB before uploading
(one line of PIL, in the script header). Alpha is a hard rejection for the app
icon; whether it is enforced on screenshots is unconfirmed, and flattening is
free.

**Paste the description and promo text unwrapped.** This file is hard-wrapped at
about 80 columns and those newlines survive a copy-paste as mid-sentence line
breaks in the listing.

Suggested order and captions, if captions are added later:

1. `01-brew-home` - "Your last brew, one tap away"
2. `02-session` - "Pour to the gram, step by step"
3. `03-complete` - "Tell it how the cup tasted"
4. `05-journal` - "Every brew logs itself"
5. `06-appearance` - "Three palettes, light or dark"

## Review notes (optional, for the reviewer)

```
15GRMS is fully offline and requires no account. To see the main flow: pick a
brewer on first launch, then tap Start brew on the home screen.

Notification permission is requested only when a brew is long enough to need it,
which means the two recipes that steep for ten to twelve hours: Overnight
Concentrate and Room Temp Batch. Every other brew runs one to four minutes with
the screen held awake, so it never asks.

To see the prompt: on the Brew tab, tap the COLD filter chip, then choose
Overnight Concentrate or Room Temp Batch and start it. Japanese Flash Brew is also
listed under COLD but is brewed hot over ice and finishes in under three minutes,
so it correctly does not ask.

Notifications are local only, scheduled on device to alert each brewing step; the
app makes no network requests of any kind.

The recipes are widely published manual brewing methods, credited to the people
who originated them ("After James Hoffmann", and so on). No affiliation with or
endorsement by any of them is claimed or implied.
```

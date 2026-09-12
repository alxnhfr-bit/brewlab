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

TWELVE RECIPES, PROPERLY SOURCED
The Hoffmann Method, Tetsu Kasuya's 4:6, Matt Winton's five pour, the Adler original
AeroPress, overnight cold brew and more. Each step shows the pour target and the
reason behind it.

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

**Two of the five are stale as of 2026-09-12 and must be recaptured before
upload.** They predate the attribution and recipe-name changes:
- `01-brew-home.png`: shows bare bylines ("James Hoffmann · light roast"). The
  app now renders "After James Hoffmann · light roast". Three of the four visible
  rows are wrong.
- `05-journal.png`: the top row reads "COMPETITION WINNER", a recipe name that no
  longer exists anywhere in the build. It is now "Championship Style". This is
  the worse of the two: a store screenshot advertising content the app does not
  contain.
- `02-session.png`, `03-complete.png` and `06-appearance.png` are unaffected.

When recapturing, re-encode to RGB. All five are currently RGBA (fully opaque,
but with an alpha channel). Alpha is a hard rejection for the app icon; whether
it is enforced on screenshots is unconfirmed, and flattening costs nothing.

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
which means the two cold brew recipes (Overnight Concentrate, Room Temp Batch)
that steep for ten to twelve hours. The short pour-over and AeroPress brews run
two to four minutes with the screen held awake, so they never ask. To see the
prompt, start Overnight Concentrate from the Library or the cold brew filter.
Notifications are local only, scheduled on device to alert each brewing step; the
app makes no network requests of any kind.

The recipes are widely published manual brewing methods, credited to the people
who originated them ("After James Hoffmann", and so on). No affiliation with or
endorsement by any of them is claimed or implied.
```

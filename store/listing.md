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

IT KEEPS TIME WITH THE SCREEN OFF
Lock your phone, put it down, get on with it. Every step alerts you, right through
to the last drop, and the brew is still correct when you come back.

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

## Age Rating

**4+**. No objectionable content, no user-generated content, no web browsing, no
ads, no data collection.

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
6.9 inch size. Suggested order and captions, if captions are added later:

1. `01-brew-home` - "Your last brew, one tap away"
2. `02-session` - "Pour to the gram, step by step"
3. `03-complete` - "Tell it how the cup tasted"
4. `05-journal` - "Every brew logs itself"
5. `06-appearance` - "Three palettes, light or dark"

## Review notes (optional, for the reviewer)

```
15GRMS is fully offline and requires no account. To see the main flow: pick a
brewer on first launch, then tap Start brew on the home screen. Notifications are
requested at that point and are used only to alert each brewing step locally; the
app makes no network requests.
```

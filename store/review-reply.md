# Reply to App Review — Guideline 2.1, Information Needed

Submission ID `7a8a7c14-3179-43da-98aa-6d91a35e53e3`, 15GRMS 1.0.0, raised 2026-09-13.

This is the standard information request for a developer account with no review history. It is not a
finding against the build. **No new binary is required**: build 1 stays, `CURRENT_PROJECT_VERSION`
stays at 1. Reply on the App Review page and paste the same text into App Review Information > Notes,
which is what Apple asked for and what future submissions will reuse.

---

## Paste this into the App Review page reply, and into Notes

```
15GRMS is a coffee brewing companion. It is fully offline, requires no account, and makes no
network requests of any kind.

1. SCREEN RECORDING
Attached. Recorded on an iPhone running iOS 26.5, starting from app launch.

The app has no account registration, no login, no account deletion, no user-generated content that
is shared or distributed, and no paid content or in-app purchases, so none of those flows appear in
the recording. Journal notes are free text stored only on the device; they are never uploaded,
shared or visible to anyone else, so there is no content reporting or blocking mechanism to show.

2. PURPOSE AND TARGET AUDIENCE
15GRMS is for people who brew coffee by hand, with a V60 dripper, an AeroPress or a cold brew
vessel, and want repeatable results.

The problem: manual brewing is a timed sequence with a different water target at each step. Doing
it well means watching a clock and a scale at the same time while pouring from a kettle. Generic
timers do not know the recipe, and written recipes do not keep time.

15GRMS runs the recipe as a timer. Each step shows how much water should be on the scale at that
moment and counts down against the wall clock, so the user can watch the kettle instead of the
phone. Every brew is logged automatically. If a cup tasted wrong, the user taps one taste chip and
the app suggests a single conservative adjustment, explains the reasoning, and applies it the next
time that recipe is brewed.

Audience: home brewing enthusiasts, from someone who just bought a V60 to someone dialling in a new
bag of beans. Age rating 4+, no objectionable content.

3. SETTING UP AND ACCESSING THE MAIN FEATURES
No login, no credentials, no sample files, no configuration. Everything works on first launch with
no network connection.

On first launch the app asks which brewer the user owns and then opens on the Brew tab.

- Start a brew: Brew tab, tap START BREW on the card at the top, or tap any recipe in the list
  below it and then Start brew.
- During a brew: the large number is the water target in grams for the current step. The ring is
  the step timer. Controls at the bottom are previous step, pause, next step. The X at the top left
  offers Keep brewing or End brew.
- After a brew: rate it, optionally tag how it tasted, and the adjustment is offered there.
- Journal tab: every completed brew, logged automatically. Swipe a row left to delete. Tap a row to
  edit it. The + button adds a brew by hand.
- Library tab: favourites, and the settings icon opens appearance, haptics, journal export, and
  links to the privacy policy and support page.

NOTIFICATION PERMISSION, WORTH KNOWING BEFORE TESTING
The app requests notification permission only for brews long enough to need it. Ten of the twelve
recipes finish in one to four minutes with the screen held awake, so they never ask; a notification
would tell the user something they are already looking at.

The two cold brew recipes steep for ten and twelve hours, and those do ask.

To see the permission prompt: on the Brew tab, tap the COLD filter chip, choose Overnight
Concentrate or Room Temp Batch, and start it. Note that Japanese Flash Brew is also listed under
COLD but is brewed hot over ice and finishes in under three minutes, so it correctly does not ask.

Notifications are scheduled locally on the device and are used only to alert each brewing step. No
notification content is ever sent over a network.

4. EXTERNAL SERVICES, TOOLS OR PLATFORMS
None. The app uses no data providers, no authentication service, no payment processor, no AI
service, no analytics and no backend of any kind. It makes zero network requests. All twelve
recipes and both fonts are bundled inside the app, and all user data is stored locally on the
device. This is why the App Privacy answer is Data Not Collected.

For completeness, the only third party reachable from the app is a hosted feedback form (Tally),
opened in Safari if the user taps Send feedback in Settings. It is not part of any app
functionality, and the app itself never contacts it.

Technically the app is built with Capacitor, using only first-party and open-source Capacitor
plugins for haptics, local notifications, keep-awake, splash screen, status bar, app lifecycle,
share sheet, filesystem and the StoreKit review prompt. None of these transmit data.

5. REGIONAL DIFFERENCES
None. The app functions identically in every region. There is no geographic gating, no
region-specific content, no regional pricing (it is free everywhere) and no server to vary
behaviour. The app is localised in English (U.S.) only. Measurements are metric (grams, Celsius)
in all regions.

6. REGULATED INDUSTRY OR PROTECTED THIRD-PARTY MATERIAL
Neither applies.

The app is not in a regulated industry. It provides no medical, health or dietary advice. The taste
coaching adjusts brewing variables such as grind size and water temperature; it makes no health
claims.

On third-party material: brewing methods are processes and are not protectable. Where a recipe is
associated with a person who popularised it, the app credits them as attribution and not as
endorsement, displaying "After James Hoffmann", "After Tetsu Kasuya" and so on rather than a bare
byline. No affiliation with or endorsement by any of these individuals is claimed or implied, and
none has contributed to the app. The remaining recipes are credited to "Community". All recipe
text, step instructions and explanatory copy were written for this app. The two typefaces, Archivo
and Archivo Black, are licensed under the SIL Open Font License and bundled with the app. No
third-party content is fetched, displayed or accessed.
```

---

## The screen recording

This is the only real work. Everything else is text.

Record on the physical iPhone, not a simulator. Apple asks for a physical device on the latest OS,
and the recording must start with launching the app.

**Capture:** Settings > Control Centre, add Screen Recording if it is not there. Then swipe down from
the top right and tap the record button. Stop from the red pill at the top.

**Suggested run, about two minutes:**

1. Start on the home screen. Tap the 15GRMS icon, so the recording opens with the launch.
2. If the app is already past onboarding, delete and reinstall from TestFlight first so the reviewer
   sees first run. That also shows the app works from a clean state.
3. First run: pick a brewer.
4. Brew tab: tap START BREW on the hero card. Let the Get Ready countdown run into the session.
5. Running brew: let one step elapse so the ring and the pour target visibly change. Use the next
   step control to move through the rest rather than waiting out the full three minutes.
6. Brew Complete: give it a rating, tap a taste chip, show the coaching suggestion.
7. Journal tab: show the logged brew at the top. Swipe a row to reveal Delete.
8. Library tab: settings icon, show Appearance and switch a palette so the live theming is visible.
9. Back to Brew, tap the COLD chip, start Overnight Concentrate, and let the notification permission
   prompt appear. **This is the single most valuable moment in the recording**, because it shows the
   behaviour that the notes describe and that a reviewer would otherwise never see.
10. End that brew.

**Do not** show anything the app does not have. No login screen, no account, no purchase.

**Attaching:** the App Review page message supports attachments. If the file is too large, trim it
rather than raising the quality, or host it unlisted and paste the link.

---

## After replying

Apple's email is explicit that an information request does not need a resubmission: reply on the App
Review page and the same submission continues. Do not create a new build, and do not raise the build
number. Typical turnaround after replying is 24 to 48 hours.

Paste the same text into App Review Information > Notes as well. Apple asked for this specifically,
and it means future submissions from this account start with the context already attached.

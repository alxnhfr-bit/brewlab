# Reply to App Review — Guideline 2.1, Information Needed

Submission ID `7a8a7c14-3179-43da-98aa-6d91a35e53e3`, 15GRMS 1.0.0, raised 2026-09-13.

This is the standard information request for a developer account with no review history. It is not a
finding against the build. **No new binary is required**: build 1 stays, `CURRENT_PROJECT_VERSION`
stays at 1. Reply on the App Review page and paste the same text into App Review Information > Notes,
which is what Apple asked for and what future submissions will reuse.

**Both fields cap at 4,000 characters.** The block below is written to fit with margin. If it is ever
edited, re-count before pasting rather than trusting that it still fits.

---

## Paste this into the App Review page reply, and into Notes

```
15GRMS is an offline coffee brewing companion. No account, no in-app purchases, and no network
requests of any kind.

1. SCREEN RECORDING
Attached, recorded on an iPhone running iOS 26.5, starting from app launch.
The app has no account registration, login or deletion, no in-app purchases, and no user-generated
content that is shared, so none of those flows appear. Journal notes are stored only on the device
and are never uploaded or visible to anyone else, so there is no content reporting or blocking
mechanism to show.

2. PURPOSE AND AUDIENCE
For people who brew coffee by hand with a V60, an AeroPress or a cold brew vessel.
Brewing by hand is a timed sequence with a different water target at each step, so doing it well
means watching a clock and a scale while pouring from a kettle. 15GRMS runs the recipe as a timer:
each step shows how much water should be on the scale at that moment and counts down against the
wall clock, so the user can watch the kettle instead of the phone. Brews are logged automatically.
If a cup tasted wrong, one tap on a taste chip produces a single conservative adjustment, with the
reasoning, applied next time.
Audience: home brewing enthusiasts. Rated 4+.

3. SETUP AND ACCESS
No login, credentials, sample files or configuration. Everything works on first launch with no
network connection. The app asks which brewer you own, then opens on the Brew tab, where START BREW
begins a guided brew. The Journal and Library tabs hold logged brews and settings.

NOTIFICATIONS, PLEASE READ BEFORE TESTING
Permission is requested only for brews long enough to need it. Ten of the twelve recipes finish in
one to four minutes with the screen held awake and never ask, because an alert would tell the user
something they are already watching. The two cold brew recipes steep for ten and twelve hours, and
those do ask.
To see the prompt: on the Brew tab tap the COLD filter chip, choose Overnight Concentrate or Room
Temp Batch, and start it. Japanese Flash Brew is also listed under COLD but is brewed hot over ice
and finishes in under three minutes, so it correctly does not ask.
Notifications are scheduled locally and only alert brewing steps. No notification content is sent
over a network.

4. EXTERNAL SERVICES
None. No data providers, authentication, payment processors, AI services, analytics or backend. The
app makes zero network requests. All twelve recipes and both fonts are bundled, and all user data
stays on the device. This is why the App Privacy answer is Data Not Collected.
The only third party reachable from the app is a hosted feedback form (Tally), opened in Safari if
the user taps Send feedback in Settings. It is not part of any app functionality and the app never
contacts it.
The app is built with Capacitor, using only first-party and open-source plugins. None transmit data.

5. REGIONAL DIFFERENCES
None. The app behaves identically everywhere: no geographic gating, no region-specific content,
free in all territories, and no server to vary behaviour. English (U.S.) only; measurements are
metric everywhere.

6. REGULATED INDUSTRY OR PROTECTED MATERIAL
Neither applies. The app is not in a regulated industry and gives no medical, health or dietary
advice; the coaching adjusts brewing variables such as grind size and water temperature.
Brewing methods are processes and are not protectable. Where a recipe is associated with the person
who popularised it, the app credits them as attribution rather than endorsement, showing "After
James Hoffmann" and so on. No affiliation or endorsement is claimed or implied, and none of them
contributed to the app. The other recipes are credited to "Community". All recipe text and copy
were written for this app. The typefaces Archivo and Archivo Black are licensed under the SIL Open
Font License. No third-party content is fetched, displayed or accessed.
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

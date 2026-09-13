/**
 * Seed the iOS Simulator with realistic state for App Store screenshots.
 *
 * Why this exists: store screenshots drift out of date every time user-facing
 * copy changes, and a screenshot advertising a recipe name the build no longer
 * contains is a real review problem. Recapturing by hand means completing brews
 * in the simulator, which is slow enough that nobody does it. This writes the
 * zustand store straight into the WKWebView's localStorage instead.
 *
 * How it works: Capacitor serves the app from a custom scheme, and WebKit keeps
 * that origin's localStorage in a SQLite file inside the app's data container,
 * with values stored as UTF-16LE blobs. We overwrite the "brewlab-store" key.
 *
 * Usage:
 *
 *   # 1. Boot the 6.9 inch device. Screenshots MUST be 1320x2868, which is the
 *   #    Pro Max; the plain Pro gives 1206x2622 and is the wrong size.
 *   xcrun simctl boot "iPhone 17 Pro Max"
 *
 *   # 2. Build, install, and launch ONCE so WebKit creates the storage file.
 *   #    Tap through onboarding (pick a brewer), otherwise the origin directory
 *   #    does not exist yet and there is nothing to seed. The origin hash is
 *   #    per install, so do not copy the path from a previous run.
 *   npm run build && npx cap sync ios
 *   xcrun simctl install booted <path>/App.app
 *   xcrun simctl launch booted com.alxnhfr.fifteengrams
 *
 *   # 3. Find the DB, terminate the app, seed, relaunch.
 *   DB=$(find ~/Library/Developer/CoreSimulator/Devices/<UDID>/data/Containers/Data/Application \
 *        -path "*com.alxnhfr.fifteengrams*" -name localstorage.sqlite3 | head -1)
 *   xcrun simctl terminate booted com.alxnhfr.fifteengrams
 *   node store/seed-screenshot-state.mjs "$DB"
 *   xcrun simctl launch booted com.alxnhfr.fifteengrams
 *
 *   # 4. Capture with simctl, NOT with an automation tool's own screenshot.
 *   xcrun simctl io booted screenshot out.png
 *
 * Then flatten the alpha channel before uploading. The captures are RGBA but
 * fully opaque, and Apple's spec asks for no transparency:
 *
 *   python3 -c "from PIL import Image; Image.open('out.png').convert('RGB').save('out.png')"
 */
import { execFileSync } from "node:child_process"

const DB = process.argv[2]
if (!DB) {
  console.error("usage: node store/seed-screenshot-state.mjs <path to localstorage.sqlite3>")
  process.exit(1)
}

/** Fixed clock so reruns are reproducible. Brews land across the last few days. */
const BASE = new Date("2026-09-13T08:12:00+02:00").getTime()
const hours = (n) => n * 3600_000
const days = (n) => hours(24 * n)

const brew = (o) => ({ manual: false, completed: true, ...o })

/**
 * Newest first. The first entry drives the Brew Again hero on the Brew tab, so
 * it wants to be a recognisable pour-over. Methods are deliberately mixed so the
 * journal shows all three shape stickers (burst, circle, diamond).
 */
const journal = [
  brew({
    id: "sj01", at: BASE - hours(1.5), recipeId: "hoffmann-v60", recipeName: "The Hoffmann Method",
    method: "v60", doseG: 15, waterG: 250, tempC: 94, durationSec: 180, rating: 4, tastes: ["bitter"],
  }),
  brew({
    id: "sj02", at: BASE - days(1) - hours(2), recipeId: "aeropress-wac24", recipeName: "Championship Style",
    method: "aeropress", doseG: 14, waterG: 200, tempC: 92, durationSec: 150, rating: 5,
    tastes: ["just-right"], notes: "Best one yet. Rinsed the filter properly this time.",
  }),
  brew({
    id: "sj03", at: BASE - days(1) - hours(9), recipeId: "coldbrew-overnight", recipeName: "Overnight Concentrate",
    method: "coldbrew", doseG: 100, waterG: 800, tempC: null, durationSec: 43380, rating: 5,
    tastes: ["just-right"],
  }),
  brew({
    id: "sj04", at: BASE - days(2) - hours(1), recipeId: "kasuya-46", recipeName: "4:6 Method",
    method: "v60", doseG: 20, waterG: 300, tempC: 93, durationSec: 240, rating: 4, tastes: ["just-right"],
  }),
  brew({
    id: "sj05", at: BASE - days(3) - hours(2), recipeId: "hoffmann-aeropress", recipeName: "Ultimate AeroPress",
    method: "aeropress", doseG: 11, waterG: 200, tempC: 100, durationSec: 195, rating: 3, tastes: ["sour"],
    tweakApplied: "grind finer",
  }),
  // Stop here. A seventh entry pushes the last row under the tab bar, and a row
  // sliced through its own text reads as a rendering bug in a store screenshot.
  brew({
    id: "sj06", at: BASE - days(4) - hours(3), recipeId: "winton-five-pour", recipeName: "Winton Five Pour",
    method: "v60", doseG: 20, waterG: 300, tempC: 93, durationSec: 210, rating: 4, tastes: ["just-right"],
  }),
]

const state = {
  state: {
    hasOnboarded: true,
    hasAskedForReview: false,
    preferredMethod: "v60",
    settings: { theme: "system", palette: "pink", haptics: true, sound: true },
    journal,
    favorites: ["hoffmann-v60", "kasuya-46", "aeropress-wac24"],
    doseMemory: {},
    // Drives the tweak pill on the Brew Again hero: "grind coarser, rated bitter".
    // Must stay consistent with the tastes on sj01 and with the rules in
    // src/lib/coaching.ts, or the screenshot shows a state the app cannot reach.
    pendingTweaks: {
      "hoffmann-v60": {
        tasteTags: ["bitter"],
        suggestions: [
          "A touch bitter usually means over-extraction. Try a slightly coarser grind, or water 2C cooler.",
        ],
        chipLabel: "grind coarser",
        createdAt: BASE - hours(1.4),
      },
    },
    session: null,
  },
  // Keep in step with the persist version in src/lib/store.ts.
  version: 2,
}

const hex = Buffer.from(JSON.stringify(state), "utf16le").toString("hex")
execFileSync("sqlite3", [DB, `UPDATE ItemTable SET value = X'${hex}' WHERE key = 'brewlab-store';`])
if (execFileSync("sqlite3", [DB, "SELECT changes();"]).toString().trim() === "0") {
  execFileSync("sqlite3", [DB, `INSERT INTO ItemTable (key, value) VALUES ('brewlab-store', X'${hex}');`])
}
console.log(`seeded ${journal.length} journal entries`)

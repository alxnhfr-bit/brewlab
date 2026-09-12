import { Capacitor } from "@capacitor/core"
import { LocalNotifications } from "@capacitor/local-notifications"
import { KeepAwake } from "@capacitor-community/keep-awake"
import { useBrewLab } from "./store"
import type { ActiveSession } from "./types"

/**
 * Native session side effects, driven by store subscription:
 * - Local notifications pre-scheduled at every remaining step boundary and
 *   at completion, so a locked phone or killed WebView loses nothing. This
 *   is the load-bearing timer architecture, not an optimization.
 * - Keep-awake only through steps the user is actually watching.
 * Everything no-ops on the web.
 */

const isNative = Capacitor.isNativePlatform()
const ID_BASE = 4200
const MAX_IDS = 40

/**
 * A step longer than this is one nobody stands and watches.
 *
 * The recipe library splits cleanly either side of it: ten of the twelve brews
 * finish inside four minutes with no single step over two, and the two cold
 * brews are a single steep of 10 and 12 hours. So this constant is really the
 * line between "you are at the counter holding a kettle" and "you are asleep".
 */
const UNATTENDED_STEP_MS = 5 * 60 * 1000

let permissionAsked = false
let lastSignature = ""

/** Does anything still ahead in this brew run long enough to walk away from? */
function hasUnattendedStep(session: ActiveSession): boolean {
  return session.plan.steps
    .slice(session.stepIndex)
    .some((step) => step.seconds * 1000 >= UNATTENDED_STEP_MS)
}

/**
 * Resolves to whether we may post notifications, and prompts at most once per
 * install, only for a brew that actually needs background delivery.
 *
 * The permission dialog used to fire on every user's first brew. For a
 * three minute V60 that is an interruption asking to solve a problem the user
 * does not have: the screen is held awake and they are watching the pour target
 * anyway. Spending the one prompt iOS grants us there, on the brew where the
 * answer is most likely to be no, is how you end up unable to alert the people
 * steeping cold brew overnight, which is the case that genuinely cannot work
 * any other way.
 *
 * Note the asymmetry: we only PROMPT for a long brew, but once permission
 * exists we schedule for every brew, so a user who grants it for cold brew is
 * still covered when they background the app mid pour-over.
 */
async function ensurePermission(session: ActiveSession): Promise<boolean> {
  const status = await LocalNotifications.checkPermissions()
  if (status.display === "granted") return true
  if (status.display === "denied") return false
  if (permissionAsked) return false
  if (!hasUnattendedStep(session)) return false
  permissionAsked = true
  const req = await LocalNotifications.requestPermissions()
  return req.display === "granted"
}

async function cancelAll(): Promise<void> {
  const ids = Array.from({ length: MAX_IDS }, (_, i) => ({ id: ID_BASE + i }))
  await LocalNotifications.cancel({ notifications: ids })
}

async function scheduleForSession(session: ActiveSession): Promise<void> {
  if (!(await ensurePermission(session))) return
  await cancelAll()

  if (session.phase !== "running" || session.stepEndsAt === null) return

  const steps = session.plan.steps
  const notifications = []
  let boundary = session.stepEndsAt

  for (let i = session.stepIndex; i < steps.length; i++) {
    const isLast = i === steps.length - 1
    const next = steps[i + 1]
    notifications.push({
      id: ID_BASE + (i - session.stepIndex),
      title: isLast ? "Brew complete" : next.label,
      body: isLast
        ? "Enjoy your coffee. Rate it when you are back."
        : next.waterTargetG !== undefined
          ? `Pour to ${next.waterTargetG}g`
          : next.detail,
      schedule: { at: new Date(boundary) },
      sound: useBrewLab.getState().settings.sound ? undefined : "",
    })
    if (!isLast && next) boundary += next.seconds * 1000
  }

  if (notifications.length > 0) {
    await LocalNotifications.schedule({ notifications })
  }
}

function signatureOf(session: ActiveSession | null): string {
  if (!session) return "none"
  return `${session.phase}:${session.stepIndex}:${session.stepEndsAt ?? "x"}`
}

/**
 * Hold the display only through the step being watched.
 *
 * This used to key off "a session exists", which meant starting the overnight
 * concentrate pinned the screen on for twelve hours. iOS drops the idle timer
 * once the app backgrounds, so it only bit someone who set the phone down
 * without locking it, but that is a flat battery by morning and there is no
 * reading of a 12 hour steep where keeping the screen lit is correct. The
 * notification is what covers that stretch.
 */
async function syncKeepAwake(session: ActiveSession | null): Promise<void> {
  const current =
    session !== null && session.phase !== "complete"
      ? session.plan.steps[session.stepIndex]
      : undefined
  const active = current !== undefined && current.seconds * 1000 < UNATTENDED_STEP_MS
  try {
    if (active) await KeepAwake.keepAwake()
    else await KeepAwake.allowSleep()
  } catch {
    // keep-awake is best effort; never let it break the session
  }
}

export function initNativeSessionEffects(): void {
  if (!isNative) return

  useBrewLab.subscribe((state) => {
    const session = state.session
    const signature = signatureOf(session)
    if (signature === lastSignature) return
    lastSignature = signature

    void syncKeepAwake(session)
    if (session && session.phase === "running") {
      void scheduleForSession(session)
    } else {
      void cancelAll()
    }
  })
}

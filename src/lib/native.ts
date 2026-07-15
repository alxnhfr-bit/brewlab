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
 * - Keep-awake only while a session is active.
 * Everything no-ops on the web.
 */

const isNative = Capacitor.isNativePlatform()
const ID_BASE = 4200
const MAX_IDS = 40

let permissionAsked = false
let lastSignature = ""

async function ensurePermission(): Promise<boolean> {
  const status = await LocalNotifications.checkPermissions()
  if (status.display === "granted") return true
  if (permissionAsked) return false
  permissionAsked = true
  const req = await LocalNotifications.requestPermissions()
  return req.display === "granted"
}

async function cancelAll(): Promise<void> {
  const ids = Array.from({ length: MAX_IDS }, (_, i) => ({ id: ID_BASE + i }))
  await LocalNotifications.cancel({ notifications: ids })
}

async function scheduleForSession(session: ActiveSession): Promise<void> {
  if (!(await ensurePermission())) return
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

async function syncKeepAwake(session: ActiveSession | null): Promise<void> {
  const active = session !== null && session.phase !== "complete"
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

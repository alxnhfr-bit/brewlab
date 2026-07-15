import { Capacitor } from "@capacitor/core"
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics"
import { useBrewLab } from "./store"

const isNative = Capacitor.isNativePlatform()

function enabled(): boolean {
  return useBrewLab.getState().settings.haptics
}

/** Web fallback via the Vibration API where present. */
function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern)
  }
}

/**
 * Haptics abstraction: @capacitor/haptics on device, Vibration API on web.
 * Every call is gated on the user's haptics setting.
 */
export const haptics = {
  light: () => {
    if (!enabled()) return
    if (isNative) void Haptics.impact({ style: ImpactStyle.Light })
    else vibrate(10)
  },
  medium: () => {
    if (!enabled()) return
    if (isNative) void Haptics.impact({ style: ImpactStyle.Medium })
    else vibrate(20)
  },
  success: () => {
    if (!enabled()) return
    if (isNative) void Haptics.notification({ type: NotificationType.Success })
    else vibrate([15, 60, 25])
  },
  stepTick: () => {
    if (!enabled()) return
    if (isNative) {
      void Haptics.impact({ style: ImpactStyle.Light }).then(() =>
        setTimeout(() => void Haptics.impact({ style: ImpactStyle.Light }), 90)
      )
    } else {
      vibrate([12, 40, 12])
    }
  },
  selection: () => {
    if (!enabled()) return
    if (isNative) void Haptics.selectionChanged()
    else vibrate(8)
  },
}

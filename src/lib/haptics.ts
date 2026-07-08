import { useBrewLab } from "./store"

/**
 * Haptics abstraction. Web fallback uses the Vibration API where present;
 * swaps to @capacitor/haptics when the native wrapper lands.
 */
function vibrate(pattern: number | number[]): void {
  if (!useBrewLab.getState().settings.haptics) return
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern)
  }
}

export const haptics = {
  light: () => vibrate(10),
  medium: () => vibrate(20),
  success: () => vibrate([15, 60, 25]),
  stepTick: () => vibrate([12, 40, 12]),
  selection: () => vibrate(8),
}

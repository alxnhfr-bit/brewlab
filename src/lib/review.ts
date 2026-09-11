import { Capacitor } from "@capacitor/core"
import { InAppReview } from "@capacitor-community/in-app-review"
import { useBrewLab } from "./store"

/**
 * Asks for an App Store rating, once, after the user has actually got value
 * from the app. Apple rate-limits this prompt to three per year per user and
 * silently swallows extra calls, so it is spent on a good moment rather than
 * on launch: a brew the user finished and rated well.
 *
 * Deliberately never called after a bad rating, an abandoned brew, or a taste
 * problem. Asking someone to review the app right after their coffee came out
 * bitter is how you collect one star reviews.
 */
const BREWS_BEFORE_ASKING = 5
const GOOD_RATING = 4

export function maybeAskForReview(rating: number | undefined): void {
  if (!Capacitor.isNativePlatform()) return

  const state = useBrewLab.getState()
  if (state.hasAskedForReview) return
  if (rating === undefined || rating < GOOD_RATING) return

  // journal already contains the brew that just finished.
  const completed = state.journal.filter((e) => e.completed && !e.manual).length
  if (completed < BREWS_BEFORE_ASKING) return

  // Mark first: if the prompt throws or Apple declines to show it, we still
  // do not pester on every subsequent brew.
  state.markAskedForReview()
  void InAppReview.requestReview().catch(() => {
    // Nothing to do. The prompt is best effort and entirely Apple's call.
  })
}

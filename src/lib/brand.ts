/**
 * Public product name. Working title: the repo, bundle id and persisted store
 * key stay "brewlab", so swapping these constants renames the whole UI.
 *
 * 15GRMS reads as "fifteen grams", the canonical single cup dose that the app
 * already prints on the Brew Again card.
 */
export const APP_NAME = "15GRMS"

/**
 * The wordmark stacks on two lines inside the onboarding burst. Kept explicit
 * rather than sliced from APP_NAME, because the right break point is a design
 * decision, not a character count.
 */
export const WORDMARK_TOP = "15"
export const WORDMARK_BOTTOM = "GRMS"

export const APP_TAGLINE = "Your coffee, step by step."

/** Used in the settings footer. */
export const APP_STRAPLINE = "Pour it right, every time"

/**
 * Public pages served from GitHub Pages off the repo root. The App Store
 * requires a privacy policy URL and a separate support URL, and Apple also
 * expects the privacy policy to be reachable from inside the app, which is
 * what the Settings rows link to.
 */
export const PRIVACY_URL = "https://alxnhfr-bit.github.io/brewlab/privacy.html"
export const SUPPORT_URL = "https://alxnhfr-bit.github.io/brewlab/support.html"

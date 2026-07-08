import type { BrewMethodId, TasteTag, Tweak } from "./types"

interface CoachingRule {
  suggestion: string
  chipLabel: string
}

/**
 * Conservative, single-variable adjustment rules with reasoning shown.
 * Deliberately a lookup table, not an engine (see docs/UX-DIRECTION.md).
 */
const RULES: Record<Exclude<TasteTag, "just-right">, Record<BrewMethodId, CoachingRule>> = {
  bitter: {
    v60: {
      suggestion: "A touch bitter usually means over-extraction. Try a slightly coarser grind, or water 2C cooler.",
      chipLabel: "grind coarser",
    },
    aeropress: {
      suggestion: "Bitterness points to over-extraction. Shorten the steep by 15 to 20 seconds, or grind slightly coarser.",
      chipLabel: "steep shorter",
    },
    coldbrew: {
      suggestion: "Bitter cold brew is usually steeped too long. Aim for the low end of the window, around 12 hours.",
      chipLabel: "steep shorter",
    },
  },
  sour: {
    v60: {
      suggestion: "Sourness means under-extraction. Try a slightly finer grind, or water 2C hotter.",
      chipLabel: "grind finer",
    },
    aeropress: {
      suggestion: "Sourness means under-extraction. Extend the steep by 20 to 30 seconds, or grind slightly finer.",
      chipLabel: "steep longer",
    },
    coldbrew: {
      suggestion: "Sour cold brew needs more time. Push toward 16 to 18 hours, or grind slightly finer.",
      chipLabel: "steep longer",
    },
  },
  weak: {
    v60: {
      suggestion: "Thin body with good flavor: use a little more coffee. Try 1g more at the same water.",
      chipLabel: "+1g coffee",
    },
    aeropress: {
      suggestion: "For more body, add 1g of coffee, or press a little earlier to keep more oils in suspension.",
      chipLabel: "+1g coffee",
    },
    coldbrew: {
      suggestion: "Weak concentrate: dilute less when serving, or raise the dose about 10g per batch.",
      chipLabel: "dilute less",
    },
  },
  strong: {
    v60: {
      suggestion: "Intense but not bitter: use a little less coffee. Try 1g less at the same water.",
      chipLabel: "-1g coffee",
    },
    aeropress: {
      suggestion: "Too intense: use 1g less coffee, or add a splash of hot water after pressing (a small bypass).",
      chipLabel: "-1g coffee",
    },
    coldbrew: {
      suggestion: "Too strong is easy to fix: dilute further when serving, start at 1:1.5 instead of 1:1.",
      chipLabel: "dilute more",
    },
  },
}

export function coachFor(taste: TasteTag, method: BrewMethodId): Tweak | null {
  if (taste === "just-right") return null
  const rule = RULES[taste][method]
  return {
    tasteTag: taste,
    suggestion: rule.suggestion,
    chipLabel: rule.chipLabel,
    createdAt: Date.now(),
  }
}

export const TASTE_OPTIONS: { tag: TasteTag; label: string }[] = [
  { tag: "bitter", label: "Bitter" },
  { tag: "sour", label: "Sour" },
  { tag: "weak", label: "Weak" },
  { tag: "strong", label: "Strong" },
  { tag: "just-right", label: "Just right" },
]

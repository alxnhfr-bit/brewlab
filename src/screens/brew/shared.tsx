import { useMemo } from "react"
import type { BrewMethodId, DoseMemory, Recipe, SessionPlan, Tweak } from "../../lib/types"
import { useBrewLab } from "../../lib/store"
import { makePlan } from "../../lib/session"

/*
 * Helpers shared by the Brew home and Recipe detail screens. Nothing here
 * renders chrome: the two screens own their own layout.
 */

/** Short method code used on stickers, filter pills and breadcrumbs. */
export function methodCode(method: BrewMethodId): string {
  if (method === "aeropress") return "AERO"
  if (method === "coldbrew") return "COLD"
  return "V60"
}

/** "1:16.7" style computed ratio. */
export function ratioLabel(doseG: number, waterG: number): string {
  if (doseG <= 0) return "1:0"
  const r = Math.round((waterG / doseG) * 10) / 10
  return `1:${Number.isInteger(r) ? String(r) : r.toFixed(1)}`
}

/** "94°C", or "COLD" for ambient brews. */
export function tempLabel(tempC: number | null): string {
  return tempC === null ? "COLD" : `${tempC}°C`
}

/** "15 : 250", the list-row ratio readout. */
export function doseWaterLabel(doseG: number, waterG: number): string {
  return `${doseG} : ${waterG}`
}

/**
 * Authors that name no individual, so an "After" prefix would read oddly.
 */
const UNATTRIBUTED = new Set(["Community"])

/**
 * "After James Hoffmann", or plain "Community".
 *
 * These are published methods reproduced with attribution, not recipes their
 * authors contributed. A bare byline reads as "by", which is an endorsement
 * claim nobody granted; "After" says what this actually is. Every surface that
 * shows an author goes through here so the two cannot drift.
 */
export function recipeCredit(recipe: Recipe): string {
  return UNATTRIBUTED.has(recipe.author) ? recipe.author : `After ${recipe.author}`
}

/** "After James Hoffmann · light roast". */
export function recipeSubtitle(recipe: Recipe): string {
  return `${recipeCredit(recipe)} · ${recipe.roast} roast`
}

/** "grind coarser · rated bitter". Uppercased by the pill it sits in. */
export function tweakLabel(tweak: Tweak): string {
  const tags = tweak.tasteTags.map((t) => t.replace("-", " ")).join(" & ")
  return tags.length > 0 ? `${tweak.chipLabel} · rated ${tags}` : tweak.chipLabel
}

/**
 * The plan a recipe would brew right now: the remembered dose from the last
 * dial-in plus any saved taste tweak. Also the single source for the dose,
 * water, temperature and step water targets both screens display.
 */
export function useRecipePlan(recipe: Recipe): { plan: SessionPlan; tweak: Tweak | undefined } {
  const memory: DoseMemory | undefined = useBrewLab((s) => s.doseMemory[recipe.id])
  const tweak: Tweak | undefined = useBrewLab((s) => s.pendingTweaks[recipe.id])
  const plan = useMemo(() => makePlan(recipe, memory, tweak?.chipLabel), [recipe, memory, tweak])
  return { plan, tweak }
}

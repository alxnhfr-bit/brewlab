import type { Recipe, BrewMethodId } from "./types"
import { EXTRA_RECIPES } from "./recipes-extra"

export interface MethodInfo {
  id: BrewMethodId
  short: string
  ratio: string
  time: string
  grind: string
}

export const METHODS: MethodInfo[] = [
  { id: "v60", short: "V60", ratio: "1:15", time: "3:00", grind: "Medium-fine" },
  { id: "aeropress", short: "AeroPress", ratio: "1:12", time: "2:00", grind: "Fine to medium" },
  { id: "coldbrew", short: "Cold Brew", ratio: "1:8", time: "12-18h", grind: "Extra coarse" },
]

const BASE_RECIPES: Recipe[] = [
  {
    id: "hoffmann-v60",
    method: "v60",
    name: "The Hoffmann Method",
    author: "James Hoffmann",
    roast: "light",
    doseG: 15,
    waterG: 250,
    tempC: 94,
    whyLine: "The modern single-cup standard: even extraction with minimal technique.",
    steps: [
      { label: "Bloom", detail: "Pour 50g in circles. Wait 45s.", seconds: 45, waterTargetG: 50, why: "Blooming releases trapped CO2 so later pours extract evenly." },
      { label: "First pour", detail: "Slowly pour to 150g.", seconds: 30, waterTargetG: 150, why: "A slow, steady pour keeps the bed level." },
      { label: "Pause", detail: "Let the water draw down.", seconds: 15, waterTargetG: 150 },
      { label: "Second pour", detail: "Pour to 250g.", seconds: 30, waterTargetG: 250 },
      { label: "Drawdown", detail: "Gentle swirl. Let it finish.", seconds: 60, waterTargetG: 250, why: "The swirl flattens the bed for an even finish." },
    ],
  },
  {
    id: "iced-v60",
    method: "v60",
    name: "Iced V60",
    author: "Tetsu Kasuya",
    roast: "light",
    doseG: 20,
    waterG: 200,
    tempC: 96,
    whyLine: "Flash-chilled over ice: bright and clean, never watery.",
    steps: [
      { label: "Prepare", detail: "100g ice in server.", seconds: 10, why: "The ice replaces part of the brew water, so the coffee is dosed stronger." },
      { label: "Bloom", detail: "40g water. Wait 40s.", seconds: 40, waterTargetG: 40 },
      { label: "Pour", detail: "Remaining 160g slowly.", seconds: 60, waterTargetG: 200 },
      { label: "Drawdown", detail: "Complete drawdown.", seconds: 45, waterTargetG: 200 },
      { label: "Stir and serve", detail: "Stir. Pour over fresh ice.", seconds: 10 },
    ],
  },
  {
    id: "kasuya-46",
    method: "v60",
    name: "4:6 Method",
    author: "Tetsu Kasuya",
    roast: "medium",
    doseG: 20,
    waterG: 300,
    tempC: 93,
    whyLine: "World Brewers Cup winner: five equal pours you can tune for taste and strength.",
    steps: [
      { label: "First pour", detail: "60g water. Wait 45s.", seconds: 45, waterTargetG: 60, why: "The first two pours set acidity and sweetness balance." },
      { label: "Second pour", detail: "Pour to 120g. Wait 45s.", seconds: 45, waterTargetG: 120 },
      { label: "Third pour", detail: "Pour to 180g. Wait 45s.", seconds: 45, waterTargetG: 180, why: "The last three pours control strength." },
      { label: "Fourth pour", detail: "Pour to 240g. Wait 45s.", seconds: 45, waterTargetG: 240 },
      { label: "Final pour", detail: "Pour to 300g. Full drawdown.", seconds: 60, waterTargetG: 300 },
    ],
  },
  {
    id: "aeropress-inverted",
    method: "aeropress",
    name: "Inverted Classic",
    author: "Community",
    roast: "medium",
    doseG: 17,
    waterG: 220,
    tempC: 85,
    whyLine: "Full immersion with zero drip-through: rich, forgiving, repeatable.",
    steps: [
      { label: "Setup", detail: "Inverted. Add coffee.", seconds: 10 },
      { label: "Pour and stir", detail: "All 220g in. Stir 10s.", seconds: 15, waterTargetG: 220, why: "Full immersion extracts evenly regardless of pour technique." },
      { label: "Steep", detail: "Wait 1 minute.", seconds: 60, waterTargetG: 220 },
      { label: "Press", detail: "Flip. Press 30 seconds.", seconds: 30, waterTargetG: 220, why: "A slow, even press avoids agitating fines into the cup." },
    ],
  },
  {
    id: "aeropress-wac24",
    method: "aeropress",
    name: "Competition Winner",
    author: "WAC 2024",
    roast: "light",
    doseG: 14,
    waterG: 200,
    tempC: 92,
    whyLine: "A championship recipe tuned for clarity and sweetness in light roasts.",
    steps: [
      { label: "Prep", detail: "Standard position. Wet filter.", seconds: 10, why: "Rinsing the filter removes paper taste." },
      { label: "Pour", detail: "All 200g at once.", seconds: 10, waterTargetG: 200 },
      { label: "Stir", detail: "Three gentle stirs.", seconds: 10, waterTargetG: 200 },
      { label: "Steep", detail: "Wait 90 seconds.", seconds: 90, waterTargetG: 200 },
      { label: "Press", detail: "Slow, even. 30 seconds.", seconds: 30, waterTargetG: 200 },
    ],
  },
  {
    id: "coldbrew-overnight",
    method: "coldbrew",
    name: "Overnight Concentrate",
    author: "Community",
    roast: "dark",
    doseG: 100,
    waterG: 800,
    tempC: null,
    whyLine: "Set it before bed, wake to a week of smooth, low-acid concentrate.",
    steps: [
      { label: "Combine", detail: "Coffee and cold water in jar.", seconds: 30, waterTargetG: 800 },
      { label: "Stir", detail: "Saturate all grounds.", seconds: 15, waterTargetG: 800, why: "Dry pockets extract nothing; full saturation matters more than technique." },
      { label: "Refrigerate", detail: "12 to 18 hours.", seconds: 43200, waterTargetG: 800 },
      { label: "Filter", detail: "Fine mesh, then paper filter.", seconds: 120, waterTargetG: 800 },
      { label: "Serve", detail: "Dilute 1:1 with water or milk.", seconds: 15 },
    ],
  },
  {
    id: "flash-brew",
    method: "coldbrew",
    name: "Japanese Flash Brew",
    author: "Community",
    roast: "light",
    doseG: 25,
    waterG: 200,
    tempC: 96,
    whyLine: "Iced coffee in four minutes: hot extraction, instant chill, full aroma.",
    steps: [
      { label: "Ice", detail: "150g ice in server.", seconds: 10 },
      { label: "Bloom", detail: "40g hot water. 30s.", seconds: 30, waterTargetG: 40 },
      { label: "Pour", detail: "Remaining 160g over grounds.", seconds: 90, waterTargetG: 200 },
      { label: "Swirl", detail: "Melt remaining ice. Serve.", seconds: 15 },
    ],
  },
]

export const RECIPES: Recipe[] = [...BASE_RECIPES, ...EXTRA_RECIPES]

export function recipeById(id: string | null): Recipe | undefined {
  if (!id) return undefined
  return RECIPES.find((r) => r.id === id)
}

export type BrewMethodId = "v60" | "aeropress" | "coldbrew"

export type RoastLevel = "light" | "medium" | "dark"

export interface RecipeStep {
  label: string
  detail: string
  seconds: number
  /** Cumulative water target in grams at the END of this step, where applicable. */
  waterTargetG?: number
  /** One-line technique tip, collapsed by default in the UI. */
  why?: string
}

export interface Recipe {
  id: string
  method: BrewMethodId
  name: string
  author: string
  roast: RoastLevel
  doseG: number
  waterG: number
  /** Brew water temperature in Celsius. null means ambient/cold (cold brew). */
  tempC: number | null
  /** One-line reason this recipe exists / what it optimizes for. */
  whyLine: string
  steps: RecipeStep[]
}

export type TasteTag = "bitter" | "sour" | "weak" | "strong" | "just-right"

export interface Tweak {
  /** Every taste tag the coaching came from, in selection order. */
  tasteTags: TasteTag[]
  /** One suggestion line per tag, reasoning included. */
  suggestions: string[]
  /** Short chip labels joined for display, e.g. "grind coarser · +1g coffee". */
  chipLabel: string
  createdAt: number
}

export interface DoseMemory {
  doseG: number
  waterG: number
  tempC: number | null
}

export interface JournalEntry {
  id: string
  at: number
  recipeId: string | null
  recipeName: string
  method: BrewMethodId
  doseG: number
  waterG: number
  tempC: number | null
  durationSec: number
  completed: boolean
  manual: boolean
  rating?: number
  /** Taste tags for this brew. Multi-select; "just-right" is exclusive. */
  tastes?: TasteTag[]
  tweakApplied?: string
  notes?: string
}

export interface SessionStep {
  label: string
  detail: string
  seconds: number
  waterTargetG?: number
  why?: string
}

export interface SessionPlan {
  recipeId: string | null
  recipeName: string
  method: BrewMethodId
  doseG: number
  waterG: number
  tempC: number | null
  steps: SessionStep[]
  tweakApplied?: string
}

export type SessionPhase = "getready" | "running" | "paused" | "complete"

export interface ActiveSession {
  plan: SessionPlan
  phase: SessionPhase
  stepIndex: number
  /** Wall-clock ms timestamp when the current step ends (running only). */
  stepEndsAt: number | null
  /** Remaining ms in current step, captured on pause. */
  pausedRemainingMs: number | null
  /** Wall-clock ms timestamp when the get-ready pre-roll ends. */
  getReadyEndsAt: number | null
  startedAt: number
  /** Wall-clock ms timestamp when the last step finished (phase "complete"). */
  completedAt?: number
  minimized: boolean
}

export type ThemeSetting = "system" | "light" | "dark"

export type PaletteId = "pink" | "lime" | "tangerine"

export interface Settings {
  theme: ThemeSetting
  palette: PaletteId
  haptics: boolean
  sound: boolean
}

import type { BrewMethodId } from "../../lib/types"

export interface MethodAccent {
  /** Full-strength method accent color. */
  main: string
  /** Soft tint of the method accent, for fills behind the main color. */
  soft: string
}

/** Method accent mapping (brewing moments only; journal moments use caramel). */
export function accentFor(method: BrewMethodId): MethodAccent {
  if (method === "v60") return { main: "var(--bl-v60)", soft: "var(--bl-v60-soft)" }
  if (method === "aeropress") return { main: "var(--bl-aero)", soft: "var(--bl-aero-soft)" }
  return { main: "var(--bl-cold)", soft: "var(--bl-cold-soft)" }
}

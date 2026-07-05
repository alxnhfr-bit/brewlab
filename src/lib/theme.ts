export const C = {
  bg: "#F5F5F3",
  bgA: "rgba(245,245,243,0.88)",
  card: "#FEFEFE",
  green: "#4A6B5D",
  greenLt: "#D5DED8",
  greenPale: "#E8EEEA",
  stone: "#8A8A85",
  line: "#E0E0DD",
  text: "#2B2B28",
  muted: "#6B6B65",
  faint: "#A5A5A0",
} as const

export type BrewMethodId = "v60" | "aeropress" | "coldbrew"

export interface MethodColor {
  main: string
  light: string
}

export const MC: Record<BrewMethodId, MethodColor> = {
  v60: { main: "#5B7F6E", light: "#DCE6DF" },
  aeropress: { main: "#4A6B5D", light: "#D5DED8" },
  coldbrew: { main: "#6B8A7A", light: "#E0EAE3" },
}

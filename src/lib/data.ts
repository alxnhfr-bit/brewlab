import type { BrewMethodId } from "./theme"
import { BkI, ScI, TmI, CtI, type IconProps } from "../components/icons"

export interface Method {
  id: BrewMethodId
  short: string
  ratio: string
  time: string
  grind: string
}

export const METHODS: Method[] = [
  { id: "v60", short: "V60", ratio: "1:15", time: "3:00", grind: "Medium-fine" },
  { id: "aeropress", short: "AeroPress", ratio: "1:12", time: "2:00", grind: "Fine–medium" },
  { id: "coldbrew", short: "Cold Brew", ratio: "1:8", time: "12–18h", grind: "Extra coarse" },
]

export interface Roast {
  id: "light" | "medium" | "dark"
  name: string
  tA: number
  rA: number
}

export const ROASTS: Roast[] = [
  { id: "light", name: "Light", tA: 2, rA: 1 },
  { id: "medium", name: "Medium", tA: 0, rA: 0 },
  { id: "dark", name: "Dark", tA: -2, rA: -1 },
]

export interface Pref {
  id: "bright" | "balanced" | "bold"
  name: string
  rA: number
}

export const PREFS: Pref[] = [
  { id: "bright", name: "Bright & Fruity", rA: 1 },
  { id: "balanced", name: "Balanced", rA: 0 },
  { id: "bold", name: "Bold & Heavy", rA: -1 },
]

export interface RecipeStep {
  label: string
  detail: string
  time: number
}

export interface Recipe {
  id: number
  method: BrewMethodId
  name: string
  author: string
  roast: Roast["id"]
  coffee: number
  water: number
  temp: number
  steps: RecipeStep[]
}

export const RECIPES: Recipe[] = [
  {
    id: 1, method: "v60", name: "The Hoffmann Method", author: "James Hoffmann", roast: "light", coffee: 15, water: 250, temp: 94,
    steps: [
      { label: "Bloom", detail: "Pour 50g in circles. Wait 45s.", time: 45 },
      { label: "First pour", detail: "Slowly pour to 150g.", time: 30 },
      { label: "Pause", detail: "Let the water draw down.", time: 15 },
      { label: "Second pour", detail: "Pour to 250g.", time: 30 },
      { label: "Drawdown", detail: "Gentle swirl. Let it finish.", time: 60 },
    ],
  },
  {
    id: 2, method: "v60", name: "Iced V60", author: "Tetsu Kasuya", roast: "light", coffee: 20, water: 200, temp: 96,
    steps: [
      { label: "Prepare", detail: "100g ice in server.", time: 10 },
      { label: "Bloom", detail: "40g water. Wait 40s.", time: 40 },
      { label: "Pour", detail: "Remaining 160g slowly.", time: 60 },
      { label: "Drawdown", detail: "Complete drawdown.", time: 45 },
      { label: "Stir and serve", detail: "Stir. Pour over fresh ice.", time: 10 },
    ],
  },
  {
    id: 3, method: "v60", name: "4:6 Method", author: "Tetsu Kasuya", roast: "medium", coffee: 20, water: 300, temp: 93,
    steps: [
      { label: "First pour", detail: "60g water. Wait 45s.", time: 45 },
      { label: "Second pour", detail: "60g water. Wait 45s.", time: 45 },
      { label: "Third pour", detail: "60g water. Wait 45s.", time: 45 },
      { label: "Fourth pour", detail: "60g water. Wait 45s.", time: 45 },
      { label: "Final pour", detail: "60g water. Full drawdown.", time: 60 },
    ],
  },
  {
    id: 4, method: "aeropress", name: "Inverted Classic", author: "Alan Adler", roast: "medium", coffee: 17, water: 220, temp: 85,
    steps: [
      { label: "Setup", detail: "Inverted. Add coffee.", time: 10 },
      { label: "Pour and stir", detail: "All water in. Stir 10s.", time: 15 },
      { label: "Steep", detail: "Wait 1 minute.", time: 60 },
      { label: "Press", detail: "Flip. Press 30 seconds.", time: 30 },
    ],
  },
  {
    id: 5, method: "aeropress", name: "Competition Winner", author: "WAC 2024", roast: "light", coffee: 14, water: 200, temp: 92,
    steps: [
      { label: "Prep", detail: "Standard position. Wet filter.", time: 10 },
      { label: "Pour", detail: "All water at once.", time: 10 },
      { label: "Stir", detail: "Three gentle stirs.", time: 10 },
      { label: "Steep", detail: "Wait 90 seconds.", time: 90 },
      { label: "Press", detail: "Slow, even. 30 seconds.", time: 30 },
    ],
  },
  {
    id: 6, method: "coldbrew", name: "Overnight Concentrate", author: "Community", roast: "dark", coffee: 100, water: 800, temp: 4,
    steps: [
      { label: "Combine", detail: "Coffee and cold water in jar.", time: 30 },
      { label: "Stir", detail: "Saturate all grounds.", time: 15 },
      { label: "Refrigerate", detail: "12 to 18 hours.", time: 43200 },
      { label: "Filter", detail: "Fine mesh, then paper filter.", time: 120 },
      { label: "Serve", detail: "Dilute 1:1 with water or milk.", time: 15 },
    ],
  },
  {
    id: 7, method: "coldbrew", name: "Japanese Flash Brew", author: "Community", roast: "light", coffee: 25, water: 200, temp: 96,
    steps: [
      { label: "Ice", detail: "150g ice in server.", time: 10 },
      { label: "Bloom", detail: "40g hot water. 30s.", time: 30 },
      { label: "Pour", detail: "Remaining 160g over grounds.", time: 90 },
      { label: "Swirl", detail: "Melt remaining ice. Serve.", time: 15 },
    ],
  },
]

export interface Bean {
  id: number
  name: string
  origin: string
  roast: Roast["id"]
  price: number
  wt: string
  notes: string
}

export const BEANS: Bean[] = [
  { id: 1, name: "Ethiopia Yirgacheffe", origin: "Bonanza Coffee", roast: "light", price: 16.50, wt: "250g", notes: "Blueberry, jasmine, lemon zest" },
  { id: 2, name: "Colombia Huila", origin: "The Barn", roast: "medium", price: 14.00, wt: "250g", notes: "Caramel, red apple, chocolate" },
  { id: 3, name: "Brazil Santos", origin: "Five Elephant", roast: "dark", price: 12.50, wt: "250g", notes: "Nutty, cocoa, brown sugar" },
  { id: 4, name: "Kenya Nyeri AA", origin: "Bonanza Coffee", roast: "light", price: 18.00, wt: "250g", notes: "Blackcurrant, grapefruit, honey" },
  { id: 5, name: "Guatemala Antigua", origin: "Father Carpenter", roast: "medium", price: 15.00, wt: "250g", notes: "Dark chocolate, orange, spice" },
]

export interface Gear {
  id: number
  name: string
  cat: string
  price: number
  desc: string
}

export const GEAR: Gear[] = [
  { id: 10, name: "Hario V60 Ceramic 02", cat: "Dripper", price: 9.90, desc: "The standard. White ceramic." },
  { id: 11, name: "AeroPress Original", cat: "Brewer", price: 35.00, desc: "Portable. Versatile. Essential." },
  { id: 12, name: "Timemore C3 Max", cat: "Grinder", price: 79.00, desc: "Hand grinder. 36mm steel burrs." },
  { id: 13, name: "Acaia Pearl S", cat: "Scale", price: 150.00, desc: "0.1g precision. Bluetooth timer." },
  { id: 14, name: "Fellow Stagg EKG", cat: "Kettle", price: 169.00, desc: "Variable temp. Pour-over spout." },
  { id: 15, name: "Hario Mizudashi 1L", cat: "Cold Brew", price: 22.00, desc: "Built-in mesh filter. Fridge-ready." },
]

export interface NavItem {
  id: string
  label: string
  Ic: (props: IconProps) => JSX.Element
}

export const NAV: NavItem[] = [
  { id: "recipes", label: "Recipes", Ic: BkI },
  { id: "calculator", label: "Ratio", Ic: ScI },
  { id: "timer", label: "Timer", Ic: TmI },
  { id: "shop", label: "Shop", Ic: CtI },
]

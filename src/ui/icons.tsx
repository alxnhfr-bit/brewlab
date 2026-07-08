import type { BrewMethodId } from "../lib/types"

export {
  Coffee,
  Notebook,
  Books,
  GearSix,
  Plus,
  X,
  CaretRight,
  CaretLeft,
  CaretDown,
  CaretUp,
  Play,
  Pause,
  Check,
  Star,
  Timer,
  SlidersHorizontal,
  PencilSimple,
  Trash,
  Heart,
  ArrowCounterClockwise,
  Export,
  MagnifyingGlass,
  Moon,
  Sun,
  SkipForward,
  SkipBack,
} from "@phosphor-icons/react"

export interface GlyphProps {
  size?: number
  color?: string
}

/** Custom method glyphs on the shared 24px grid, 1.5px stroke, rounded terminals. */
export function V60Glyph({ size = 24, color = "currentColor" }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="6.5" rx="7" ry="1.8" />
      <path d="M5 6.5l4.6 11h4.8L19 6.5" />
      <path d="M9.6 17.5h4.8" />
    </svg>
  )
}

export function AeroGlyph({ size = 24, color = "currentColor" }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="3.5" width="8" height="2" rx="1" />
      <rect x="8.8" y="5.5" width="6.4" height="12.5" rx="1.2" />
      <path d="M10 18h4v2h-4z" />
    </svg>
  )
}

export function ColdGlyph({ size = 24, color = "currentColor" }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4h10l-1 16.5H8L7 4z" />
      <rect x="10" y="9" width="4" height="4" rx="1" transform="rotate(12 12 11)" />
      <path d="M7.4 7.5h9.2" opacity=".4" />
    </svg>
  )
}

export function MethodGlyph({ method, size = 24, color = "currentColor" }: GlyphProps & { method: BrewMethodId }) {
  if (method === "v60") return <V60Glyph size={size} color={color} />
  if (method === "aeropress") return <AeroGlyph size={size} color={color} />
  return <ColdGlyph size={size} color={color} />
}

export function BeanGlyph({ size = 24, color = "currentColor" }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <ellipse cx="12" cy="12" rx="5.5" ry="8" transform="rotate(-30 12 12)" />
      <path d="M9.5 7.5c1 2 1.2 5 0 9" opacity=".4" />
    </svg>
  )
}

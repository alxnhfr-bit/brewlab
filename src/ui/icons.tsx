import type { CSSProperties, ReactNode } from "react"
import type { BrewMethodId } from "../lib/types"

/** Phosphor, bold weight only (set globally via IconContext in the shell). */
export {
  X,
  CaretLeft,
  CaretRight,
  CaretDown,
  CaretUp,
  Plus,
  Minus,
  Heart,
  GearSix,
  Check,
  SkipBack,
  SkipForward,
  ArrowCounterClockwise,
  ArrowRight,
  Timer,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react"

export interface StickerProps {
  size?: number
  /** Fill color. Defaults to the palette accent. */
  color?: string
  children?: ReactNode
  style?: CSSProperties
}

/** 12-point burst, inner radius 72% of outer. The house shape. */
export function Burst({ size = 40, color = "var(--p-accent)", children, style }: StickerProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        background: color,
        clipPath: "var(--p-burst)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Diamond({ size = 40, color = "var(--p-accent)", children, style }: StickerProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        background: color,
        clipPath: "var(--p-diamond)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Dot({ size = 40, color = "var(--p-ink)", children, style }: StickerProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        background: color,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/**
 * Methods are coded by SHAPE, not colour: V60 burst, AeroPress circle,
 * cold brew diamond. Never tint these per method.
 */
export function MethodSticker({
  method,
  size = 40,
  style,
  children,
}: StickerProps & { method: BrewMethodId }) {
  if (method === "aeropress") return <Dot size={size} color="var(--p-ink)" style={style}>{children}</Dot>
  if (method === "coldbrew") return <Diamond size={size} color="var(--p-accent)" style={style}>{children}</Diamond>
  return <Burst size={size} color="var(--p-accent)" style={style}>{children}</Burst>
}

/** Header and settings-footer logo: accent burst with a centred ink dot at 34%. */
export function LogoMark({ size = 26, style }: { size?: number; style?: CSSProperties }) {
  return (
    <Burst size={size} style={style}>
      <div style={{ width: "34%", height: "34%", borderRadius: 999, background: "var(--p-ink)" }} />
    </Burst>
  )
}

/** Rating burst: filled accent up to the score, track beyond it. */
export function RatingBurst({ filled, size = 30 }: { filled: boolean; size?: number }) {
  return <Burst size={size} color={filled ? "var(--p-accent)" : "var(--p-track)"} />
}

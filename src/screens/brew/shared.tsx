import type { CSSProperties } from "react"
import type { BrewMethodId, Tweak } from "../../lib/types"
import { METHODS } from "../../lib/recipes"
import { MethodGlyph, ArrowCounterClockwise } from "../../ui/icons"
import { Mono } from "../../ui/primitives"

/** Method accent mapping (brewing identity colors, never used for journal moments). */
export function methodColors(method: BrewMethodId): { accent: string; soft: string } {
  if (method === "v60") return { accent: "var(--bl-v60)", soft: "var(--bl-v60-soft)" }
  if (method === "aeropress") return { accent: "var(--bl-aero)", soft: "var(--bl-aero-soft)" }
  return { accent: "var(--bl-cold)", soft: "var(--bl-cold-soft)" }
}

export function methodShort(method: BrewMethodId): string {
  return METHODS.find((m) => m.id === method)?.short ?? method
}

/** today -> "today", yesterday -> "yesterday", else "Mon 5 Jul". */
export function relDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / 86400000)
  if (diffDays === 0) return "today"
  if (diffDays === 1) return "yesterday"
  const wd = d.toLocaleDateString("en-US", { weekday: "short" })
  const mon = d.toLocaleDateString("en-US", { month: "short" })
  return `${wd} ${d.getDate()} ${mon}`
}

/** "1:16.7" style computed ratio. */
export function ratioLabel(doseG: number, waterG: number): string {
  if (doseG <= 0) return "1:0"
  const r = Math.round((waterG / doseG) * 10) / 10
  return `1:${Number.isInteger(r) ? String(r) : r.toFixed(1)}`
}

export function tempLabel(tempC: number | null): string {
  return tempC === null ? "cold" : `${tempC}C`
}

/** Method glyph inside a soft-accent rounded square. */
export function GlyphSquare({
  method,
  size = 48,
  style,
}: {
  method: BrewMethodId
  size?: number
  style?: CSSProperties
}) {
  const { accent, soft } = methodColors(method)
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "var(--bl-radius-sm)",
        background: soft,
        color: accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      <MethodGlyph method={method} size={Math.round(size * 0.55)} />
    </div>
  )
}

/** Pending-tweak chip: a memory moment, always caramel. */
export function TweakChip({ tweak, style }: { tweak: Tweak; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 12px",
        borderRadius: 999,
        background: "var(--bl-caramel-soft)",
        color: "var(--bl-caramel)",
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.3,
        ...style,
      }}
    >
      <ArrowCounterClockwise size={14} />
      <span>
        {tweak.chipLabel}, you rated it {tweak.tasteTag.replace("-", " ")}
      </span>
    </div>
  )
}

/** "15g : 250g, 94C" data line, all mono. */
export function ParamsLine({
  doseG,
  waterG,
  tempC,
  style,
}: {
  doseG: number
  waterG: number
  tempC: number | null
  style?: CSSProperties
}) {
  return (
    <Mono style={{ fontSize: 13, color: "var(--bl-muted)", ...style }}>
      {doseG}g : {waterG}g, {tempLabel(tempC)}
    </Mono>
  )
}

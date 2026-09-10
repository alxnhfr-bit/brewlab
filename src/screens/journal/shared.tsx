import type { BrewMethodId, TasteTag } from "../../lib/types"
import { TASTE_OPTIONS, toggleTaste } from "../../lib/coaching"
import { Chip } from "../../ui/primitives"
import { RatingBurst } from "../../ui/icons"

/*
 * Journal-local helpers: day/time formatting plus the two controls the
 * journal, the entry detail and the log sheet all share.
 */

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** Midnight of the day a timestamp falls in. The grouping key. */
export function startOfDay(ms: number): number {
  const d = new Date(ms)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

/**
 * "Today", "Yesterday", else "Fri 4 Jul". Rendered through Label / Meta,
 * which uppercase it.
 */
export function dayLabel(at: number): string {
  const diff = Math.round((startOfDay(Date.now()) - startOfDay(at)) / 86400000)
  if (diff === 0) return "Today"
  if (diff === 1) return "Yesterday"
  const d = new Date(at)
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

/** "HH:MM", 24h. */
export function timeOfDay(at: number): string {
  const d = new Date(at)
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

/** Compact method label for segmented controls and filters. */
export function methodShort(method: BrewMethodId): string {
  if (method === "aeropress") return "AERO"
  if (method === "coldbrew") return "COLD"
  return "V60"
}

/** Taste tags as one meta string, e.g. "Bitter, Strong". Null when none. */
export function tasteSummary(tastes: TasteTag[] | undefined): string | null {
  if (!tastes || tastes.length === 0) return null
  const labels = tastes
    .map((t) => TASTE_OPTIONS.find((o) => o.tag === t)?.label)
    .filter((l): l is string => l !== undefined)
  return labels.length > 0 ? labels.join(", ") : null
}

/** Five bursts, filled to the score. Tapping the current value clears it. */
export function RatingRow({
  value,
  onChange,
  size = 28,
  gap = 8,
}: {
  value: number | undefined
  onChange: (value: number | undefined) => void
  size?: number
  gap?: number
}) {
  return (
    <div style={{ display: "flex", gap }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          className="p-press"
          onClick={() => onChange(n === value ? undefined : n)}
          aria-label={`Rate ${n} of 5`}
          style={{
            width: size,
            height: size,
            padding: 0,
            border: "none",
            background: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RatingBurst size={size} filled={value !== undefined && n <= value} />
        </button>
      ))}
    </div>
  )
}

/** Multi-select taste chips. "Just right" is exclusive, per toggleTaste. */
export function TasteChipRow({
  value,
  onChange,
}: {
  value: TasteTag[]
  onChange: (tastes: TasteTag[]) => void
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {TASTE_OPTIONS.map((o) => (
        <Chip key={o.tag} selected={value.includes(o.tag)} onClick={() => onChange(toggleTaste(value, o.tag))}>
          {o.label}
        </Chip>
      ))}
    </div>
  )
}

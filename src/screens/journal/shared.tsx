import type { BrewMethodId, TasteTag } from "../../lib/types"
import { TASTE_OPTIONS } from "../../lib/coaching"
import { Chip } from "../../ui/primitives"
import { BeanGlyph } from "../../ui/icons"

/** Method accent mapping, journal-local. */
export function methodAccent(method: BrewMethodId): { accent: string; soft: string } {
  if (method === "v60") return { accent: "var(--bl-v60)", soft: "var(--bl-v60-soft)" }
  if (method === "aeropress") return { accent: "var(--bl-aero)", soft: "var(--bl-aero-soft)" }
  return { accent: "var(--bl-cold)", soft: "var(--bl-cold-soft)" }
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function startOfDay(ms: number): number {
  const d = new Date(ms)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

/** "today", "yesterday", else "Mon 5 Jul". */
export function relativeDate(at: number): string {
  const diff = Math.round((startOfDay(Date.now()) - startOfDay(at)) / 86400000)
  if (diff === 0) return "today"
  if (diff === 1) return "yesterday"
  const d = new Date(at)
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

/** Section header variant: "Today", "Yesterday", else "Fri 4 Jul". */
export function dayLabel(at: number): string {
  const rel = relativeDate(at)
  if (rel === "today") return "Today"
  if (rel === "yesterday") return "Yesterday"
  return rel
}

/** "HH:MM", 24h. */
export function timeOfDay(at: number): string {
  const d = new Date(at)
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

/** Editable 5-bean rating, caramel (journal memory moment). Tapping the current value clears it. */
export function BeanRating({
  value,
  onChange,
}: {
  value?: number
  onChange: (value: number | undefined) => void
}) {
  return (
    <div style={{ display: "flex" }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = value !== undefined && n <= value
        return (
          <button
            key={n}
            onClick={() => onChange(n === value ? undefined : n)}
            aria-label={`Rate ${n} of 5 beans`}
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "opacity .15s",
            }}
          >
            <BeanGlyph size={24} color={filled ? "var(--bl-caramel)" : "var(--bl-faint)"} />
          </button>
        )
      })}
    </div>
  )
}

/** Taste chips, caramel (journal memory moment). Tapping the current value clears it. */
export function TasteChips({
  value,
  onChange,
}: {
  value?: TasteTag
  onChange: (value: TasteTag | undefined) => void
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {TASTE_OPTIONS.map((o) => (
        <Chip
          key={o.tag}
          selected={value === o.tag}
          color="var(--bl-caramel)"
          onClick={() => onChange(value === o.tag ? undefined : o.tag)}
        >
          {o.label}
        </Chip>
      ))}
    </div>
  )
}

import { useState } from "react"
import { useBrewLab } from "../../lib/store"
import type { JournalEntry } from "../../lib/types"
import { DISPLAY, Label, Meta, PageTitle, RoundBtn } from "../../ui/primitives"
import { MethodSticker, Plus, RatingBurst } from "../../ui/icons"
import { EntryDetail } from "./EntryDetail"
import { ManualLogSheet } from "./ManualLogSheet"
import { dayLabel, startOfDay, tasteSummary, timeOfDay } from "./shared"

function EntryRow({ entry, onOpen }: { entry: JournalEntry; onOpen: () => void }) {
  const tastes = tasteSummary(entry.tastes)
  return (
    <button
      className="p-row"
      onClick={onOpen}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        width: "100%",
        padding: "14px 0",
        background: "none",
        border: "none",
        borderBottom: "2px solid var(--p-ink)",
        color: "var(--p-ink)",
        textAlign: "left",
      }}
    >
      <MethodSticker method={entry.method} size={40} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 15,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {entry.recipeName}
        </div>
        <Meta
          style={{
            marginTop: 4,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {timeOfDay(entry.at)} · {entry.doseG} : {entry.waterG}
          {tastes !== null && ` · ${tastes}`}
          {entry.manual && " · LOGGED"}
          {!entry.completed && <span style={{ color: "var(--p-accent)" }}> · INCOMPLETE</span>}
        </Meta>
      </div>

      <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <RatingBurst key={n} size={12} filled={entry.rating !== undefined && n <= entry.rating} />
        ))}
      </div>
    </button>
  )
}

/** Sticker-style empty state: label plus an outline card. */
function EmptyState() {
  return (
    <div>
      <Label>No brews yet</Label>
      <div
        style={{
          marginTop: 10,
          border: "2px solid var(--p-ink)",
          borderRadius: 22,
          padding: "16px 18px",
          fontSize: 13,
          fontWeight: 600,
          lineHeight: 1.5,
          color: "var(--p-muted)",
        }}
      >
        Finish a brew and it lands here automatically, nothing to fill in.
      </div>
    </div>
  )
}

export function JournalTab() {
  const journal = useBrewLab((s) => s.journal)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [logOpen, setLogOpen] = useState(false)

  const detail = detailId !== null ? journal.find((e) => e.id === detailId) : undefined
  if (detail) {
    return <EntryDetail entry={detail} onBack={() => setDetailId(null)} />
  }

  const sorted = [...journal].sort((a, b) => b.at - a.at)
  const groups: { key: number; label: string; entries: JournalEntry[] }[] = []
  for (const e of sorted) {
    const key = startOfDay(e.at)
    const last = groups[groups.length - 1]
    if (last && last.key === key) last.entries.push(e)
    else groups.push({ key, label: dayLabel(e.at), entries: [e] })
  }

  return (
    <div style={{ paddingTop: 62, paddingBottom: 120 }}>
      <div
        style={{
          padding: "10px 20px 14px",
          borderBottom: "2px solid var(--p-ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <PageTitle>Journal</PageTitle>
          <Label style={{ marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
            {journal.length} {journal.length === 1 ? "brew" : "brews"}
          </Label>
        </div>
        <RoundBtn size={44} label="Log a brew" onClick={() => setLogOpen(true)}>
          <Plus size={18} />
        </RoundBtn>
      </div>

      <div style={{ padding: "22px 20px 0" }}>
        {journal.length === 0 ? (
          <EmptyState />
        ) : (
          groups.map((g, i) => (
            <div key={g.key}>
              <Label style={{ marginTop: i === 0 ? 0 : 26 }}>{g.label}</Label>
              <div style={{ marginTop: 10, borderTop: "2px solid var(--p-ink)" }}>
                {g.entries.map((e) => (
                  <EntryRow key={e.id} entry={e} onOpen={() => setDetailId(e.id)} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <ManualLogSheet open={logOpen} onClose={() => setLogOpen(false)} />
    </div>
  )
}

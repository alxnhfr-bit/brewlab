import { useState } from "react"
import { useBrewLab } from "../../lib/store"
import type { JournalEntry } from "../../lib/types"
import { Card, Mono, SectionLabel } from "../../ui/primitives"
import { BeanGlyph, MethodGlyph, Notebook, Plus } from "../../ui/icons"
import { EntryDetail } from "./EntryDetail"
import { ManualLogSheet } from "./ManualLogSheet"
import { dayLabel, methodAccent, timeOfDay } from "./shared"

function EntryRow({
  entry,
  divider,
  onOpen,
}: {
  entry: JournalEntry
  divider: boolean
  onOpen: () => void
}) {
  const { accent, soft } = methodAccent(entry.method)
  return (
    <button
      onClick={onOpen}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        minHeight: 64,
        padding: "12px 14px",
        background: "none",
        border: "none",
        borderTop: divider ? "1px solid var(--bl-line)" : "none",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "var(--bl-radius-sm)",
          background: soft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <MethodGlyph method={entry.method} size={22} color={accent} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "var(--bl-ink)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {entry.recipeName}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--bl-muted)",
            marginTop: 3,
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <Mono>{timeOfDay(entry.at)}</Mono>
          <span>·</span>
          <Mono>
            {entry.doseG}g : {entry.waterG}g
          </Mono>
          {entry.manual && (
            <>
              <span>·</span>
              <span>logged</span>
            </>
          )}
          {!entry.completed && (
            <>
              <span>·</span>
              <span style={{ color: "var(--bl-danger)" }}>incomplete</span>
            </>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 5,
          flexShrink: 0,
        }}
      >
        {entry.rating !== undefined && entry.rating > 0 && (
          <div style={{ display: "flex", gap: 1 }}>
            {Array.from({ length: entry.rating }, (_, i) => (
              <BeanGlyph key={i} size={12} color="var(--bl-caramel)" />
            ))}
          </div>
        )}
        {entry.taste && (
          <div style={{ width: 8, height: 8, borderRadius: 999, background: "var(--bl-caramel)" }} />
        )}
      </div>
    </button>
  )
}

function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "72px 24px",
        animation: "bl-fade-in .25s ease",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "var(--bl-radius)",
          background: "var(--bl-brand-soft)",
          color: "var(--bl-brand)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Notebook size={28} />
      </div>
      <div
        style={{
          fontFamily: "var(--bl-font-display)",
          fontSize: 17,
          fontWeight: 600,
          color: "var(--bl-ink)",
          marginBottom: 6,
        }}
      >
        No brews yet
      </div>
      <div style={{ fontSize: 14, color: "var(--bl-muted)", lineHeight: 1.5, maxWidth: 260 }}>
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
  const groups: { label: string; entries: JournalEntry[] }[] = []
  for (const e of sorted) {
    const label = dayLabel(e.at)
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.entries.push(e)
    else groups.push({ label, entries: [e] })
  }

  return (
    <div style={{ padding: "24px 24px 120px", animation: "bl-fade-in .2s ease" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--bl-font-display)",
              fontSize: 28,
              fontWeight: 700,
              color: "var(--bl-ink)",
              margin: 0,
              marginBottom: 4,
            }}
          >
            Journal
          </h1>
          <div style={{ fontSize: 13, color: "var(--bl-muted)" }}>
            {journal.length === 0 ? (
              "Your brews land here automatically"
            ) : (
              <>
                <Mono>{journal.length}</Mono> {journal.length === 1 ? "brew" : "brews"}
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => setLogOpen(true)}
          aria-label="Log a brew"
          style={{
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            border: "1px solid var(--bl-line)",
            background: "var(--bl-card)",
            boxShadow: "var(--bl-shadow-card)",
            color: "var(--bl-ink)",
            cursor: "pointer",
            flexShrink: 0,
            padding: 0,
          }}
        >
          <Plus size={20} />
        </button>
      </div>

      {journal.length === 0 ? (
        <EmptyState />
      ) : (
        groups.map((g) => (
          <div key={g.label} style={{ marginBottom: 24 }}>
            <SectionLabel style={{ marginBottom: 8 }}>{g.label}</SectionLabel>
            <Card style={{ overflow: "hidden" }}>
              {g.entries.map((e, i) => (
                <EntryRow key={e.id} entry={e} divider={i > 0} onOpen={() => setDetailId(e.id)} />
              ))}
            </Card>
          </div>
        ))
      )}

      <ManualLogSheet open={logOpen} onClose={() => setLogOpen(false)} />
    </div>
  )
}

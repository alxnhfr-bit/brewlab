import { useEffect, useRef, useState, type ReactNode } from "react"
import { useBrewLab } from "../../lib/store"
import { haptics } from "../../lib/haptics"
import type { JournalEntry } from "../../lib/types"
import { DISPLAY, Label, Meta, PageTitle, RoundBtn } from "../../ui/primitives"
import { MethodSticker, Plus, RatingBurst } from "../../ui/icons"
import { EntryDetail } from "./EntryDetail"
import { ManualLogSheet } from "./ManualLogSheet"
import { dayLabel, startOfDay, tasteSummary, timeOfDay } from "./shared"

/** How far a row slides to reveal the delete action. */
const SWIPE_W = 104

/**
 * Swipe a row left to reveal Delete. Horizontal intent has to beat vertical
 * intent before the row moves, so the list still scrolls normally, and a drag
 * swallows the tap so swiping never opens the entry by accident.
 */
function SwipeToDelete({
  open,
  onOpenChange,
  onDelete,
  label,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => void
  label: string
  children: ReactNode
}) {
  const [dx, setDx] = useState(0)
  const start = useRef<{ x: number; y: number } | null>(null)
  const axis = useRef<"undecided" | "x" | "y">("undecided")
  const dragged = useRef(false)

  useEffect(() => {
    if (!open) setDx(0)
  }, [open])

  const offset = open && axis.current !== "x" ? -SWIPE_W : dx

  return (
    <div style={{ position: "relative", overflow: "hidden", borderBottom: "2px solid var(--p-ink)" }}>
      <button
        aria-label={`Delete ${label}`}
        onClick={() => {
          haptics.medium()
          onDelete()
        }}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: SWIPE_W,
          border: "none",
          background: "var(--p-accent)",
          color: "var(--p-accent-ink)",
          fontFamily: DISPLAY,
          fontSize: 12,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Delete
      </button>

      <div
        style={{
          position: "relative",
          background: "var(--p-bg)",
          transform: `translateX(${offset}px)`,
          transition: axis.current === "x" ? "none" : "transform .22s cubic-bezier(.2,.8,.3,1)",
          touchAction: "pan-y",
        }}
        onPointerDown={(e) => {
          start.current = { x: e.clientX, y: e.clientY }
          axis.current = "undecided"
          dragged.current = false
        }}
        onPointerMove={(e) => {
          if (!start.current) return
          const mx = e.clientX - start.current.x
          const my = e.clientY - start.current.y
          if (axis.current === "undecided") {
            if (Math.abs(mx) < 6 && Math.abs(my) < 6) return
            axis.current = Math.abs(mx) > Math.abs(my) ? "x" : "y"
            if (axis.current === "x") {
              try {
                e.currentTarget.setPointerCapture(e.pointerId)
              } catch {
                // Capture is an optimisation, not a requirement: without it the
                // drag still tracks, it just stops early if the finger leaves.
              }
            }
          }
          if (axis.current !== "x") return
          dragged.current = true
          const base = open ? -SWIPE_W : 0
          setDx(Math.max(-SWIPE_W, Math.min(0, base + mx)))
        }}
        onPointerUp={() => {
          if (axis.current === "x") {
            const shouldOpen = dx < -SWIPE_W / 2
            onOpenChange(shouldOpen)
            setDx(shouldOpen ? -SWIPE_W : 0)
          }
          axis.current = "undecided"
          start.current = null
        }}
        onPointerCancel={() => {
          axis.current = "undecided"
          start.current = null
          setDx(open ? -SWIPE_W : 0)
        }}
        onClickCapture={(e) => {
          // A swipe must never fall through into opening the entry.
          if (dragged.current || open) {
            e.preventDefault()
            e.stopPropagation()
            dragged.current = false
            if (open) onOpenChange(false)
          }
        }}
      >
        {children}
      </div>
    </div>
  )
}

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
  const deleteEntry = useBrewLab((s) => s.deleteEntry)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [logOpen, setLogOpen] = useState(false)
  const [swipedId, setSwipedId] = useState<string | null>(null)

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
                  <SwipeToDelete
                    key={e.id}
                    open={swipedId === e.id}
                    onOpenChange={(o) => setSwipedId(o ? e.id : null)}
                    onDelete={() => {
                      setSwipedId(null)
                      deleteEntry(e.id)
                    }}
                    label={e.recipeName}
                  >
                    <EntryRow entry={e} onOpen={() => setDetailId(e.id)} />
                  </SwipeToDelete>
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

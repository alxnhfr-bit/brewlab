import { useEffect, useRef, useState } from "react"
import { useBrewLab } from "../../lib/store"
import type { JournalEntry } from "../../lib/types"
import { METHODS, recipeById } from "../../lib/recipes"
import { makePlan } from "../../lib/session"
import { fmt } from "../../lib/format"
import { haptics } from "../../lib/haptics"
import { Card, GhostButton, Mono, PrimaryButton, SectionLabel } from "../../ui/primitives"
import { CaretLeft } from "../../ui/icons"
import { BeanRating, TasteChips, methodAccent, relativeDate } from "./shared"

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--bl-faint)",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <Mono style={{ fontSize: 16, fontWeight: 500, color: "var(--bl-ink)" }}>{value}</Mono>
    </div>
  )
}

export function EntryDetail({ entry, onBack }: { entry: JournalEntry; onBack: () => void }) {
  const updateEntry = useBrewLab((s) => s.updateEntry)
  const deleteEntry = useBrewLab((s) => s.deleteEntry)
  const startSession = useBrewLab((s) => s.startSession)

  const [notes, setNotes] = useState(entry.notes ?? "")
  const [confirmDelete, setConfirmDelete] = useState(false)
  const confirmTimer = useRef<number | null>(null)
  useEffect(
    () => () => {
      if (confirmTimer.current !== null) window.clearTimeout(confirmTimer.current)
    },
    []
  )

  const recipe = recipeById(entry.recipeId)
  const { accent } = methodAccent(entry.method)
  const methodLabel = METHODS.find((m) => m.id === entry.method)?.short ?? entry.method
  const ratio = entry.doseG > 0 ? `1:${Math.round((entry.waterG / entry.doseG) * 10) / 10}` : "-"

  function handleBrewAgain() {
    if (!recipe) return
    const plan = makePlan(recipe, { doseG: entry.doseG, waterG: entry.waterG, tempC: entry.tempC })
    startSession(plan)
    haptics.medium()
  }

  function handleDeleteTap() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      confirmTimer.current = window.setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    if (confirmTimer.current !== null) window.clearTimeout(confirmTimer.current)
    deleteEntry(entry.id)
    onBack()
  }

  return (
    <div style={{ padding: "16px 24px 120px", animation: "bl-fade-in .2s ease" }}>
      <button
        onClick={onBack}
        aria-label="Back to journal"
        style={{
          width: 44,
          height: 44,
          marginLeft: -12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          color: "var(--bl-ink)",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <CaretLeft size={22} />
      </button>

      <div
        style={{
          fontFamily: "var(--bl-font-display)",
          fontSize: 22,
          fontWeight: 600,
          color: "var(--bl-ink)",
          marginTop: 8,
          marginBottom: 6,
        }}
      >
        {entry.recipeName}
      </div>

      <div
        style={{
          fontSize: 13,
          color: "var(--bl-muted)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <span>{methodLabel}</span>
        <span>·</span>
        <span>{relativeDate(entry.at)}</span>
        {entry.durationSec > 0 && (
          <>
            <span>·</span>
            <Mono>{fmt(entry.durationSec)}</Mono>
          </>
        )}
        {!entry.completed && (
          <>
            <span>·</span>
            <span style={{ color: "var(--bl-danger)" }}>incomplete</span>
          </>
        )}
      </div>

      <Card style={{ padding: 16, display: "flex", gap: 8 }}>
        <Stat label="Dose" value={`${entry.doseG}g`} />
        <Stat label="Water" value={`${entry.waterG}g`} />
        <Stat label="Ratio" value={ratio} />
        <Stat label="Temp" value={entry.tempC === null ? "cold" : `${entry.tempC}C`} />
      </Card>

      {entry.tweakApplied && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "7px 14px",
            borderRadius: 999,
            background: "var(--bl-caramel-soft)",
            color: "var(--bl-caramel)",
            fontSize: 12,
            fontWeight: 500,
            marginTop: 12,
          }}
        >
          tweak applied: {entry.tweakApplied}
        </div>
      )}

      <SectionLabel style={{ marginTop: 28, marginBottom: 6 }}>Rating</SectionLabel>
      <BeanRating
        value={entry.rating}
        onChange={(rating) => {
          updateEntry(entry.id, { rating })
          haptics.selection()
        }}
      />

      <SectionLabel style={{ marginTop: 24 }}>Taste</SectionLabel>
      <TasteChips
        value={entry.taste}
        onChange={(taste) => {
          updateEntry(entry.id, { taste })
          haptics.selection()
        }}
      />

      <SectionLabel style={{ marginTop: 24 }}>Notes</SectionLabel>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={() => updateEntry(entry.id, { notes })}
        placeholder="How was the cup?"
        style={{
          width: "100%",
          boxSizing: "border-box",
          minHeight: 96,
          padding: 14,
          background: "var(--bl-card)",
          border: "1px solid var(--bl-line)",
          borderRadius: "var(--bl-radius)",
          boxShadow: "var(--bl-shadow-card)",
          color: "var(--bl-ink)",
          fontSize: 14,
          fontFamily: "inherit",
          lineHeight: 1.5,
          resize: "vertical",
          outline: "none",
        }}
      />

      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
        {recipe && (
          <PrimaryButton color={accent} onClick={handleBrewAgain}>
            Brew this again
          </PrimaryButton>
        )}
        <GhostButton
          onClick={handleDeleteTap}
          style={{
            width: "100%",
            color: "var(--bl-danger)",
            borderColor: confirmDelete ? "var(--bl-danger)" : undefined,
            fontWeight: confirmDelete ? 600 : 500,
          }}
        >
          {confirmDelete ? "Delete this brew?" : "Delete"}
        </GhostButton>
      </div>
    </div>
  )
}

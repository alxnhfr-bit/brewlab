import { useEffect, useRef, useState } from "react"
import { useBrewLab } from "../../lib/store"
import type { JournalEntry, TasteTag } from "../../lib/types"
import { METHODS, recipeById } from "../../lib/recipes"
import { makePlan } from "../../lib/session"
import { fmt } from "../../lib/format"
import { haptics } from "../../lib/haptics"
import { DISPLAY, Label, OutlinePill, PrimaryPill, RoundBtn, SpecGrid, TweakPill } from "../../ui/primitives"
import { ArrowCounterClockwise, CaretLeft, MethodSticker } from "../../ui/icons"
import { RatingRow, TasteChipRow, dayLabel, timeOfDay } from "./shared"

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
  const methodLabel = METHODS.find((m) => m.id === entry.method)?.short ?? entry.method
  const ratio = entry.doseG > 0 ? `1:${Math.round((entry.waterG / entry.doseG) * 10) / 10}` : "-"
  const tastes: TasteTag[] = entry.tastes ?? []

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
    <div style={{ paddingTop: 62, paddingBottom: 120 }}>
      <div
        style={{
          padding: "10px 20px 14px",
          borderBottom: "2px solid var(--p-ink)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <RoundBtn size={40} label="Back to journal" onClick={onBack}>
          <CaretLeft size={18} />
        </RoundBtn>
        <Label style={{ flex: 1, fontVariantNumeric: "tabular-nums" }}>
          Journal · {dayLabel(entry.at)} · {timeOfDay(entry.at)}
        </Label>
      </div>

      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <MethodSticker method={entry.method} size={32} />
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 34,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}
          >
            {entry.recipeName}
          </div>
        </div>

        <Label style={{ marginTop: 12, fontVariantNumeric: "tabular-nums" }}>
          {methodLabel}
          {entry.durationSec > 0 && ` · Brewed in ${fmt(entry.durationSec)}`}
          {entry.manual && " · Logged"}
          {!entry.completed && <span style={{ color: "var(--p-accent)" }}> · Incomplete</span>}
        </Label>

        <SpecGrid
          style={{ marginTop: 18, fontVariantNumeric: "tabular-nums", textTransform: "uppercase" }}
          cells={[
            { value: `${entry.doseG} G`, caption: "Dose" },
            { value: `${entry.waterG} G`, caption: "Water" },
            { value: ratio, caption: "Ratio" },
            { value: entry.tempC === null ? "Cold" : `${entry.tempC}°C`, caption: "Temp" },
          ]}
        />

        {entry.tweakApplied !== undefined && (
          <TweakPill style={{ marginTop: 14 }}>
            <ArrowCounterClockwise size={14} />
            Tweak applied · {entry.tweakApplied}
          </TweakPill>
        )}

        <Label style={{ marginTop: 26 }}>Rating</Label>
        <div style={{ marginTop: 10 }}>
          <RatingRow
            value={entry.rating}
            size={28}
            onChange={(rating) => {
              updateEntry(entry.id, { rating })
              haptics.selection()
            }}
          />
        </div>

        <Label style={{ marginTop: 26 }}>Taste</Label>
        <div style={{ marginTop: 10 }}>
          <TasteChipRow
            value={tastes}
            onChange={(next) => {
              updateEntry(entry.id, { tastes: next.length > 0 ? next : undefined })
              haptics.selection()
            }}
          />
        </div>

        <Label style={{ marginTop: 26 }}>Notes</Label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => updateEntry(entry.id, { notes: notes.trim() === "" ? undefined : notes })}
          placeholder="How was the cup?"
          style={{
            width: "100%",
            marginTop: 10,
            minHeight: 100,
            padding: "14px 16px",
            border: "2px solid var(--p-ink)",
            borderRadius: 22,
            background: "transparent",
            fontSize: 14,
            lineHeight: 1.5,
            resize: "vertical",
            outline: "none",
          }}
        />

        <div style={{ marginTop: 24 }}>
          {recipe && (
            <PrimaryPill
              minHeight={60}
              fontSize={18}
              style={{ textTransform: "uppercase" }}
              onClick={handleBrewAgain}
            >
              Brew this again
            </PrimaryPill>
          )}
          <OutlinePill
            onClick={handleDeleteTap}
            style={{
              width: "100%",
              marginTop: recipe ? 10 : 0,
              borderColor: confirmDelete ? "var(--p-accent)" : "var(--p-ink)",
            }}
          >
            {confirmDelete ? "Delete this brew?" : "Delete"}
          </OutlinePill>
        </div>
      </div>
    </div>
  )
}

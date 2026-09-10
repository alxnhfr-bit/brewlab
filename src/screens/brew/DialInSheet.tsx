import { useEffect, useState } from "react"
import type { BrewMethodId, DoseMemory, Recipe, SessionPlan } from "../../lib/types"
import { useBrewLab } from "../../lib/store"
import { makePlan } from "../../lib/session"
import { METHODS } from "../../lib/recipes"
import { fmt } from "../../lib/format"
import { haptics } from "../../lib/haptics"
import { DISPLAY, Label, OutlinePill, PrimaryPill, Sheet, Stepper } from "../../ui/primitives"
import { MethodSticker } from "../../ui/icons"

export interface DialInSheetProps {
  recipe: Recipe
  open: boolean
  onClose: () => void
  onStart: (plan: SessionPlan) => void
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

function roundHalf(n: number): number {
  return Math.round(n * 2) / 2
}

/** "15" or "15.5": integers stay clean, halves show one decimal. */
function numStr(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1)
}

function methodLabel(method: BrewMethodId): string {
  return METHODS.find((m) => m.id === method)?.short ?? method
}

export function DialInSheet({ recipe, open, onClose, onStart }: DialInSheetProps) {
  const rememberDose = useBrewLab((s) => s.rememberDose)

  const [doseG, setDoseG] = useState<number>(recipe.doseG)
  const [ratio, setRatio] = useState<number>(roundHalf(recipe.waterG / recipe.doseG))
  const [tempC, setTempC] = useState<number | null>(recipe.tempC)

  useEffect(() => {
    if (!open) return
    const memory = useBrewLab.getState().doseMemory[recipe.id]
    const d = memory?.doseG ?? recipe.doseG
    const w = memory?.waterG ?? recipe.waterG
    setDoseG(d)
    setRatio(roundHalf(w / d))
    setTempC(memory?.tempC ?? recipe.tempC)
  }, [open, recipe])

  const [minDose, maxDose]: [number, number] = recipe.method === "coldbrew" ? [20, 150] : [5, 60]
  const waterG = Math.round(doseG * ratio)
  const factor = waterG / recipe.waterG

  const stepDose = (delta: number) => {
    setDoseG((d) => clamp(roundHalf(d + delta), minDose, maxDose))
    haptics.selection()
  }
  const stepRatio = (delta: number) => {
    setRatio((r) => clamp(roundHalf(r + delta), 2, 30))
    haptics.selection()
  }
  const stepTemp = (delta: number) => {
    setTempC((t) => (t === null ? t : clamp(t + delta, 60, 100)))
    haptics.selection()
  }

  const reset = () => {
    setDoseG(recipe.doseG)
    setRatio(roundHalf(recipe.waterG / recipe.doseG))
    setTempC(recipe.tempC)
    haptics.light()
  }

  const start = () => {
    const memory: DoseMemory = { doseG, waterG, tempC }
    rememberDose(recipe.id, memory)
    const pending = useBrewLab.getState().pendingTweaks[recipe.id]
    onStart(makePlan(recipe, memory, pending?.chipLabel))
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Dial in">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
        <MethodSticker method={recipe.method} size={24} />
        <span style={{ fontSize: 13, fontWeight: 700 }}>{recipe.name}</span>
        <Label>{`· ${methodLabel(recipe.method)}`}</Label>
      </div>

      <div style={{ marginTop: 20 }}>
        <Label>Dose</Label>
        <div style={{ marginTop: 8 }}>
          {/* The unit carries a leading space: the design sets "15 G", not "15G". */}
          <Stepper
            value={numStr(doseG)}
            unit=" G"
            onMinus={() => stepDose(-0.5)}
            onPlus={() => stepDose(0.5)}
          />
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <Label>Ratio</Label>
        <div style={{ marginTop: 8 }}>
          <Stepper
            value={`1 : ${numStr(ratio)}`}
            onMinus={() => stepRatio(-0.5)}
            onPlus={() => stepRatio(0.5)}
            below={`${waterG} g water`}
          />
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <Label>Temperature</Label>
        <div style={{ marginTop: 8 }}>
          {tempC !== null ? (
            <Stepper value={`${tempC}°C`} onMinus={() => stepTemp(-1)} onPlus={() => stepTemp(1)} />
          ) : (
            <div
              style={{
                minHeight: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--p-muted)",
              }}
            >
              Cold / ambient
            </div>
          )}
        </div>
      </div>

      <Label style={{ marginTop: 22 }}>Live preview</Label>
      <div style={{ marginTop: 6, borderTop: "2px solid var(--p-ink)" }}>
        {recipe.steps.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              minHeight: 42,
              borderBottom: "2px solid var(--p-ink)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
            }}
          >
            <span>{s.label}</span>
            <span
              style={{
                fontFamily: DISPLAY,
                fontSize: 14,
                letterSpacing: "-0.01em",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
                color: s.waterTargetG === undefined ? "var(--p-faint)" : undefined,
              }}
            >
              {s.waterTargetG === undefined ? fmt(s.seconds) : `${Math.round(s.waterTargetG * factor)} g`}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
        <OutlinePill onClick={reset}>Reset</OutlinePill>
        <PrimaryPill
          onClick={start}
          minHeight={60}
          fontSize={18}
          style={{ flex: 1, width: "auto", textTransform: "uppercase" }}
        >
          Start brew &rarr;
        </PrimaryPill>
      </div>
    </Sheet>
  )
}

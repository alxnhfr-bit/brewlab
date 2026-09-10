import { useEffect, useState } from "react"
import type { BrewMethodId, SessionPlan, SessionStep } from "../../lib/types"
import { useBrewLab } from "../../lib/store"
import { METHODS } from "../../lib/recipes"
import { totalSeconds } from "../../lib/session"
import { fmt } from "../../lib/format"
import { haptics } from "../../lib/haptics"
import { Chip, Label, PrimaryPill, Sheet, Stepper } from "../../ui/primitives"

export interface QuickBrewSheetProps {
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

const DEFAULTS: Record<BrewMethodId, { doseG: number; ratio: number }> = {
  v60: { doseG: 15, ratio: 15 },
  aeropress: { doseG: 14, ratio: 13 },
  coldbrew: { doseG: 80, ratio: 8 },
}

/** Short codes for the segmented control, one word each. */
const METHOD_CODES: Record<BrewMethodId, string> = {
  v60: "V60",
  aeropress: "Aero",
  coldbrew: "Cold",
}

function methodShort(method: BrewMethodId): string {
  return METHODS.find((m) => m.id === method)?.short ?? method
}

/** Generate a sensible guided plan from just method, dose, and water. */
function quickPlan(method: BrewMethodId, doseG: number, waterG: number): SessionPlan {
  let steps: SessionStep[]
  let tempC: number | null
  if (method === "v60") {
    tempC = 94
    const bloomG = Math.min(waterG, Math.round(doseG * 2))
    steps = [
      { label: "Bloom", detail: `Pour to ${bloomG}g in circles. Wait.`, seconds: 45, waterTargetG: bloomG },
      { label: "Pour", detail: `Slow spiral to ${waterG}g.`, seconds: 75, waterTargetG: waterG },
      { label: "Drawdown", detail: "Gentle swirl. Let it finish.", seconds: 45, waterTargetG: waterG },
    ]
  } else if (method === "aeropress") {
    tempC = 90
    steps = [
      { label: "Pour", detail: `All ${waterG}g in at once.`, seconds: 15, waterTargetG: waterG },
      { label: "Stir", detail: "Three gentle stirs.", seconds: 10, waterTargetG: waterG },
      { label: "Steep", detail: "Hands off. Let it sit.", seconds: 90, waterTargetG: waterG },
      { label: "Press", detail: "Slow, even, 30 seconds.", seconds: 30, waterTargetG: waterG },
    ]
  } else {
    tempC = null
    steps = [
      { label: "Combine", detail: `Coffee and ${waterG}g cold water in a jar.`, seconds: 30, waterTargetG: waterG },
      { label: "Stir", detail: "Saturate all the grounds.", seconds: 15, waterTargetG: waterG },
      { label: "Steep", detail: "Refrigerate about 12 hours.", seconds: 43200, waterTargetG: waterG },
      { label: "Filter", detail: "Fine mesh, then a paper filter.", seconds: 120, waterTargetG: waterG },
    ]
  }
  return {
    recipeId: null,
    recipeName: `Quick ${methodShort(method)}`,
    method,
    doseG,
    waterG,
    tempC,
    steps,
  }
}

export function QuickBrewSheet({ open, onClose, onStart }: QuickBrewSheetProps) {
  const [method, setMethod] = useState<BrewMethodId>("v60")
  const [doseG, setDoseG] = useState<number>(DEFAULTS.v60.doseG)
  const [ratio, setRatio] = useState<number>(DEFAULTS.v60.ratio)

  useEffect(() => {
    if (!open) return
    const preferred = useBrewLab.getState().preferredMethod ?? "v60"
    setMethod(preferred)
    setDoseG(DEFAULTS[preferred].doseG)
    setRatio(DEFAULTS[preferred].ratio)
  }, [open])

  const [minDose, maxDose]: [number, number] = method === "coldbrew" ? [20, 150] : [5, 60]
  const waterG = Math.round(doseG * ratio)
  const plan = quickPlan(method, doseG, waterG)

  const pickMethod = (id: BrewMethodId) => {
    if (id === method) return
    setMethod(id)
    setDoseG(DEFAULTS[id].doseG)
    setRatio(DEFAULTS[id].ratio)
    haptics.selection()
  }

  const stepDose = (delta: number) => {
    setDoseG((d) => clamp(roundHalf(d + delta), minDose, maxDose))
    haptics.selection()
  }
  const stepRatio = (delta: number) => {
    setRatio((r) => clamp(roundHalf(r + delta), 2, 30))
    haptics.selection()
  }

  const start = () => {
    onStart(plan)
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Quick brew">
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--p-muted)", marginTop: 8 }}>
        No recipe. Just method, dose and water.
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
        {METHODS.map((m) => (
          <Chip
            key={m.id}
            selected={m.id === method}
            onClick={() => pickMethod(m.id)}
            style={{
              flex: 1,
              minHeight: 44,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              letterSpacing: ".1em",
            }}
          >
            {METHOD_CODES[m.id]}
          </Chip>
        ))}
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 14,
          marginTop: 24,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "var(--p-muted)",
        }}
      >
        <span>
          {plan.tempC !== null ? (
            <>
              <span style={{ color: "var(--p-ink)", fontVariantNumeric: "tabular-nums" }}>{plan.tempC}°C</span> water
            </>
          ) : (
            "Cold / ambient"
          )}
        </span>
        <span>·</span>
        <span>
          About{" "}
          <span style={{ color: "var(--p-ink)", fontVariantNumeric: "tabular-nums" }}>{fmt(totalSeconds(plan))}</span>
        </span>
      </div>

      <div style={{ marginTop: 22 }}>
        <PrimaryPill onClick={start} minHeight={60} fontSize={18} style={{ textTransform: "uppercase" }}>
          Start brew &rarr;
        </PrimaryPill>
      </div>
    </Sheet>
  )
}

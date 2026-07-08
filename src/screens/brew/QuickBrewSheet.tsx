import { useEffect, useState, type ReactNode } from "react"
import type { BrewMethodId, SessionPlan, SessionStep } from "../../lib/types"
import { useBrewLab } from "../../lib/store"
import { METHODS } from "../../lib/recipes"
import { totalSeconds } from "../../lib/session"
import { fmt } from "../../lib/format"
import { haptics } from "../../lib/haptics"
import { GhostButton, Mono, PrimaryButton, Row, SectionLabel, Segmented, Sheet } from "../../ui/primitives"

export interface QuickBrewSheetProps {
  open: boolean
  onClose: () => void
  onStart: (plan: SessionPlan) => void
}

function accentFor(method: BrewMethodId): { main: string; soft: string } {
  if (method === "aeropress") return { main: "var(--bl-aero)", soft: "var(--bl-aero-soft)" }
  if (method === "coldbrew") return { main: "var(--bl-cold)", soft: "var(--bl-cold-soft)" }
  return { main: "var(--bl-v60)", soft: "var(--bl-v60-soft)" }
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

function RoundBtn({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <GhostButton
      onClick={onClick}
      style={{
        width: 44,
        height: 44,
        minHeight: 44,
        padding: 0,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        lineHeight: 1,
        color: "var(--bl-ink)",
        flex: "0 0 auto",
      }}
    >
      {children}
    </GhostButton>
  )
}

function DialRow({
  label,
  onMinus,
  onPlus,
  children,
  under,
}: {
  label: string
  onMinus: () => void
  onPlus: () => void
  children: ReactNode
  under?: ReactNode
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <SectionLabel style={{ marginBottom: 8 }}>{label}</SectionLabel>
      <Row style={{ justifyContent: "space-between" }}>
        <RoundBtn onClick={onMinus}>-</RoundBtn>
        <div style={{ textAlign: "center", flex: 1 }}>{children}</div>
        <RoundBtn onClick={onPlus}>+</RoundBtn>
      </Row>
      {under}
    </div>
  )
}

/** Keyed wrapper: value changes re-run a subtle fade, the odometer feel. */
function Rolling({ value, children }: { value: string | number; children: ReactNode }) {
  return (
    <span key={value} style={{ display: "inline-block", animation: "bl-fade-in .22s ease" }}>
      {children}
    </span>
  )
}

export function QuickBrewSheet({ open, onClose, onStart }: QuickBrewSheetProps) {
  const [method, setMethod] = useState<BrewMethodId>("v60")
  const [doseG, setDoseG] = useState<number>(DEFAULTS.v60.doseG)
  const [ratio, setRatio] = useState<number>(DEFAULTS.v60.ratio)
  const accent = accentFor(method)

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

  const pickMethod = (id: string) => {
    const m = METHODS.find((x) => x.id === id)
    if (!m || m.id === method) return
    setMethod(m.id)
    setDoseG(DEFAULTS[m.id].doseG)
    setRatio(DEFAULTS[m.id].ratio)
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
      <div style={{ fontSize: 13, color: "var(--bl-muted)", marginTop: -8, marginBottom: 16 }}>
        No recipe, just method, dose, and water.
      </div>

      <div style={{ marginBottom: 20 }}>
        <Segmented
          options={METHODS.map((m) => ({ id: m.id, label: m.short }))}
          value={method}
          onChange={pickMethod}
        />
      </div>

      <DialRow label="Dose" onMinus={() => stepDose(-0.5)} onPlus={() => stepDose(0.5)}>
        <Mono style={{ fontSize: 36, fontWeight: 500, color: "var(--bl-ink)" }}>
          <Rolling value={doseG}>{numStr(doseG)}</Rolling>
          <span style={{ fontSize: 16, color: "var(--bl-muted)", marginLeft: 2 }}>g</span>
        </Mono>
      </DialRow>

      <DialRow
        label="Ratio"
        onMinus={() => stepRatio(-0.5)}
        onPlus={() => stepRatio(0.5)}
        under={
          <div style={{ textAlign: "center", marginTop: 6 }}>
            <Mono style={{ fontSize: 17, fontWeight: 500, color: accent.main }}>
              <Rolling value={waterG}>{waterG}g</Rolling>
            </Mono>
            <span style={{ fontSize: 13, color: "var(--bl-muted)", marginLeft: 5 }}>water</span>
          </div>
        }
      >
        <Mono style={{ fontSize: 28, fontWeight: 500, color: "var(--bl-ink)" }}>
          1 : <Rolling value={ratio}>{numStr(ratio)}</Rolling>
        </Mono>
      </DialRow>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          fontSize: 13,
          color: "var(--bl-muted)",
          marginBottom: 20,
        }}
      >
        <span>
          {plan.tempC !== null ? (
            <>
              <Mono style={{ color: "var(--bl-ink)" }}>{plan.tempC}C</Mono> water
            </>
          ) : (
            "Cold / ambient"
          )}
        </span>
        <span style={{ color: "var(--bl-faint)" }}>|</span>
        <span>
          about <Mono style={{ color: "var(--bl-ink)" }}>{fmt(totalSeconds(plan))}</Mono>
        </span>
      </div>

      <PrimaryButton onClick={start} color={accent.main}>
        Start brew
      </PrimaryButton>
    </Sheet>
  )
}

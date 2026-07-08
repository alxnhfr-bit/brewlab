import { useEffect, useState, type ReactNode } from "react"
import type { BrewMethodId, DoseMemory, Recipe, SessionPlan } from "../../lib/types"
import { useBrewLab } from "../../lib/store"
import { makePlan } from "../../lib/session"
import { fmt } from "../../lib/format"
import { haptics } from "../../lib/haptics"
import { Card, GhostButton, Mono, PrimaryButton, Row, SectionLabel, Sheet } from "../../ui/primitives"
import { MethodGlyph } from "../../ui/icons"

export interface DialInSheetProps {
  recipe: Recipe
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

export function DialInSheet({ recipe, open, onClose, onStart }: DialInSheetProps) {
  const rememberDose = useBrewLab((s) => s.rememberDose)
  const pendingTweak = useBrewLab((s) => s.pendingTweaks[recipe.id])
  const accent = accentFor(recipe.method)

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
      <Row style={{ marginBottom: 20 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "var(--bl-radius-sm)",
            background: accent.soft,
            color: accent.main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "0 0 auto",
          }}
        >
          <MethodGlyph method={recipe.method} size={20} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, fontFamily: "var(--bl-font-display)", color: "var(--bl-ink)" }}>
            {recipe.name}
          </div>
          <div style={{ fontSize: 12, color: "var(--bl-faint)" }}>{recipe.author}</div>
        </div>
      </Row>

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

      {recipe.tempC !== null && tempC !== null ? (
        <DialRow label="Temperature" onMinus={() => stepTemp(-1)} onPlus={() => stepTemp(1)}>
          <Mono style={{ fontSize: 28, fontWeight: 500, color: "var(--bl-ink)" }}>
            <Rolling value={tempC}>{tempC}C</Rolling>
          </Mono>
        </DialRow>
      ) : (
        <div style={{ marginBottom: 18 }}>
          <SectionLabel style={{ marginBottom: 8 }}>Temperature</SectionLabel>
          <div style={{ textAlign: "center", fontSize: 14, color: "var(--bl-muted)", padding: "10px 0" }}>
            Cold / ambient
          </div>
        </div>
      )}

      <SectionLabel style={{ marginBottom: 8 }}>Live preview</SectionLabel>
      <Card style={{ padding: "2px 16px", marginBottom: 16, boxShadow: "none" }}>
        {recipe.steps.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: i < recipe.steps.length - 1 ? "1px solid var(--bl-line)" : "none",
            }}
          >
            <span style={{ fontSize: 13, color: "var(--bl-muted)" }}>{s.label}</span>
            {s.waterTargetG !== undefined ? (
              <Mono style={{ fontSize: 13, color: "var(--bl-ink)" }}>
                <Rolling value={Math.round(s.waterTargetG * factor)}>
                  {Math.round(s.waterTargetG * factor)}g
                </Rolling>
              </Mono>
            ) : (
              <Mono style={{ fontSize: 13, color: "var(--bl-faint)" }}>{fmt(s.seconds)}</Mono>
            )}
          </div>
        ))}
      </Card>

      {pendingTweak && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <span
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              background: "var(--bl-caramel-soft)",
              color: "var(--bl-caramel)",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Tweak ready: {pendingTweak.chipLabel}
          </span>
        </div>
      )}

      <Row style={{ gap: 12 }}>
        <GhostButton onClick={reset} style={{ minHeight: 56, flex: "0 0 auto" }}>
          Reset
        </GhostButton>
        <PrimaryButton onClick={start} color={accent.main} style={{ flex: 1, width: "auto" }}>
          Start brew
        </PrimaryButton>
      </Row>
    </Sheet>
  )
}

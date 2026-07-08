import { useState, type CSSProperties, type ReactNode } from "react"
import type { DoseMemory, Recipe, Tweak } from "../../lib/types"
import { useBrewLab } from "../../lib/store"
import { makePlan } from "../../lib/session"
import { fmt } from "../../lib/format"
import { haptics } from "../../lib/haptics"
import { Card, GhostButton, Mono, PrimaryButton, Row, SectionLabel } from "../../ui/primitives"
import { CaretDown, CaretLeft, Heart, SlidersHorizontal } from "../../ui/icons"
import { DialInSheet } from "./DialInSheet"
import { GlyphSquare, TweakChip, methodColors, methodShort, ratioLabel, tempLabel } from "./shared"

function IconButton({
  onClick,
  children,
  color,
  label,
}: {
  onClick: () => void
  children: ReactNode
  color?: string
  label: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: 44,
        height: 44,
        borderRadius: "var(--bl-radius-sm)",
        border: "1px solid var(--bl-line)",
        background: "var(--bl-card)",
        color: color ?? "var(--bl-ink)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}

function Param({ value, unit, label }: { value: string; unit?: string; label: string }) {
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <div>
        <Mono style={{ fontSize: 18, color: "var(--bl-ink)" }}>{value}</Mono>
        {unit && <Mono style={{ fontSize: 12, color: "var(--bl-faint)" }}>{unit}</Mono>}
      </div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--bl-faint)",
          marginTop: 3,
        }}
      >
        {label}
      </div>
    </div>
  )
}

const mutedNote: CSSProperties = { fontSize: 12, color: "var(--bl-muted)", lineHeight: 1.5 }

export function RecipeDetail({ recipe, onBack }: { recipe: Recipe; onBack: () => void }) {
  const favorites = useBrewLab((s) => s.favorites)
  const toggleFavorite = useBrewLab((s) => s.toggleFavorite)
  const doseMemory = useBrewLab((s) => s.doseMemory)
  const pendingTweaks = useBrewLab((s) => s.pendingTweaks)
  const startSession = useBrewLab((s) => s.startSession)

  const [dialOpen, setDialOpen] = useState(false)
  const [openWhys, setOpenWhys] = useState<Record<number, boolean>>({})

  const { accent } = methodColors(recipe.method)
  const fav = favorites.includes(recipe.id)
  const memory: DoseMemory | undefined = doseMemory[recipe.id]
  const tweak: Tweak | undefined = pendingTweaks[recipe.id]

  const doseG = memory?.doseG ?? recipe.doseG
  const waterG = memory?.waterG ?? recipe.waterG
  const tempC = memory !== undefined ? memory.tempC : recipe.tempC
  const remembered =
    memory !== undefined &&
    (memory.doseG !== recipe.doseG || memory.waterG !== recipe.waterG || memory.tempC !== recipe.tempC)

  const start = () => {
    startSession(makePlan(recipe, memory, tweak?.chipLabel))
    haptics.medium()
  }

  return (
    <div style={{ padding: "24px 24px 120px", animation: "bl-fade-in .25s ease" }}>
      <Row style={{ justifyContent: "space-between", marginBottom: 20 }}>
        <IconButton onClick={onBack} label="Back">
          <CaretLeft size={20} />
        </IconButton>
        <IconButton
          onClick={() => {
            toggleFavorite(recipe.id)
            haptics.selection()
          }}
          color={fav ? "var(--bl-caramel)" : "var(--bl-faint)"}
          label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={20} weight={fav ? "fill" : "light"} />
        </IconButton>
      </Row>

      <Row style={{ alignItems: "flex-start", gap: 14 }}>
        <GlyphSquare method={recipe.method} size={52} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: accent,
              marginBottom: 3,
            }}
          >
            {methodShort(recipe.method)}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--bl-font-display)", lineHeight: 1.15 }}>
            {recipe.name}
          </div>
          <div style={{ fontSize: 12, color: "var(--bl-faint)", marginTop: 4 }}>
            {recipe.author}, {recipe.roast} roast
          </div>
        </div>
      </Row>

      <div style={{ ...mutedNote, fontSize: 14, marginTop: 12 }}>{recipe.whyLine}</div>

      <Card style={{ marginTop: 18, padding: "16px 12px", display: "flex", alignItems: "center" }}>
        <Param value={String(doseG)} unit="g" label="Dose" />
        <Param value={String(waterG)} unit="g" label="Water" />
        <Param value={ratioLabel(doseG, waterG)} label="Ratio" />
        <Param value={tempLabel(tempC)} label="Temp" />
      </Card>

      {remembered && (
        <div style={{ ...mutedNote, marginTop: 10 }}>
          Remembered from your dial-in. Recipe default:{" "}
          <Mono>
            {recipe.doseG}g : {recipe.waterG}g, {tempLabel(recipe.tempC)}
          </Mono>
          .
        </div>
      )}

      {tweak && <TweakChip tweak={tweak} style={{ marginTop: 12 }} />}

      <SectionLabel style={{ marginTop: 28 }}>Steps</SectionLabel>
      <Card style={{ padding: "4px 16px" }}>
        {recipe.steps.map((step, i) => {
          const whyOpen = openWhys[i] === true
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 12,
                padding: "14px 0",
                borderTop: i > 0 ? "1px solid var(--bl-line)" : "none",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  background: methodColors(recipe.method).soft,
                  color: accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <Mono style={{ fontSize: 12 }}>{i + 1}</Mono>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Row style={{ justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{step.label}</span>
                  <Mono style={{ fontSize: 13, color: "var(--bl-muted)", flexShrink: 0 }}>{fmt(step.seconds)}</Mono>
                </Row>
                <div style={{ fontSize: 13, color: "var(--bl-muted)", marginTop: 2, lineHeight: 1.4 }}>
                  {step.detail}
                </div>
                {step.waterTargetG !== undefined && (
                  <Mono style={{ fontSize: 12, color: "var(--bl-faint)", display: "block", marginTop: 3 }}>
                    to {step.waterTargetG}g
                  </Mono>
                )}
                {step.why && (
                  <>
                    <button
                      onClick={() => setOpenWhys((w) => ({ ...w, [i]: !whyOpen }))}
                      style={{
                        minHeight: 44,
                        margin: "-10px 0",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--bl-faint)",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      why
                      <CaretDown
                        size={12}
                        style={{ transform: whyOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}
                      />
                    </button>
                    {whyOpen && (
                      <div style={{ ...mutedNote, marginTop: 8, animation: "bl-fade-in .2s ease" }}>{step.why}</div>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </Card>

      <GhostButton onClick={() => setDialOpen(true)} style={{ width: "100%", marginTop: 24 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <SlidersHorizontal size={18} />
          Dial in
        </span>
      </GhostButton>

      <PrimaryButton color={accent} onClick={start} style={{ minHeight: 64, marginTop: 12 }}>
        Start brew
      </PrimaryButton>

      <DialInSheet
        recipe={recipe}
        open={dialOpen}
        onClose={() => setDialOpen(false)}
        onStart={(plan) => {
          setDialOpen(false)
          startSession(plan)
          haptics.medium()
        }}
      />
    </div>
  )
}

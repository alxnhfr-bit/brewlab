import { useState } from "react"
import type { Recipe } from "../../lib/types"
import { useBrewLab } from "../../lib/store"
import { fmt } from "../../lib/format"
import { haptics } from "../../lib/haptics"
import {
  DISPLAY,
  Label,
  MicroLabel,
  OutlinePill,
  PrimaryPill,
  RoundBtn,
  SpecGrid,
  TweakPill,
} from "../../ui/primitives"
import { ArrowCounterClockwise, CaretDown, CaretLeft, Dot, Heart, MethodSticker } from "../../ui/icons"
import { DialInSheet } from "./DialInSheet"
import { methodCode, ratioLabel, tempLabel, tweakLabel, useRecipePlan } from "./shared"

/** Numbers in the spec grid never reflow when a dial-in changes them. */
function Num({ children }: { children: string }) {
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{children}</span>
}

export function RecipeDetail({ recipe, onBack }: { recipe: Recipe; onBack: () => void }) {
  const favorites = useBrewLab((s) => s.favorites)
  const toggleFavorite = useBrewLab((s) => s.toggleFavorite)
  const startSession = useBrewLab((s) => s.startSession)
  const { plan, tweak } = useRecipePlan(recipe)

  const [dialOpen, setDialOpen] = useState(false)
  const [openWhys, setOpenWhys] = useState<Record<number, boolean>>({})

  const fav = favorites.includes(recipe.id)

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
        <RoundBtn size={40} onClick={onBack} label="Back">
          <CaretLeft size={18} />
        </RoundBtn>
        <div
          style={{
            flex: 1,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: "var(--p-muted)",
          }}
        >
          {methodCode(recipe.method)} · {recipe.author} · {recipe.roast} roast
        </div>
        <RoundBtn
          size={40}
          onClick={() => {
            toggleFavorite(recipe.id)
            haptics.selection()
          }}
          label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={18} weight={fav ? "fill" : "bold"} color={fav ? "var(--p-accent)" : undefined} />
        </RoundBtn>
      </div>

      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <MethodSticker method={recipe.method} size={32} />
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 36,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}
          >
            {recipe.name}
          </div>
        </div>

        <div style={{ fontSize: 15, color: "var(--p-muted)", lineHeight: 1.45, marginTop: 14 }}>
          {recipe.whyLine}
        </div>

        <SpecGrid
          style={{ marginTop: 18 }}
          cells={[
            { value: <Num>{`${plan.doseG} G`}</Num>, caption: "Dose" },
            { value: <Num>{`${plan.waterG} G`}</Num>, caption: "Water" },
            { value: <Num>{ratioLabel(plan.doseG, plan.waterG)}</Num>, caption: "Ratio" },
            { value: <Num>{tempLabel(plan.tempC)}</Num>, caption: "Temp" },
          ]}
        />

        {tweak && (
          <TweakPill style={{ marginTop: 14 }}>
            <ArrowCounterClockwise size={14} />
            {tweakLabel(tweak)}
          </TweakPill>
        )}

        <Label style={{ marginTop: 28 }}>Steps</Label>

        <div style={{ marginTop: 10, borderTop: "2px solid var(--p-ink)" }}>
          {plan.steps.map((step, i) => {
            const whyOpen = openWhys[i] === true
            return (
              <div
                key={i}
                style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "2px solid var(--p-ink)" }}
              >
                <Dot size={32} color="var(--p-ink)">
                  <span style={{ fontFamily: DISPLAY, fontSize: 13, color: "var(--p-bg)" }}>{i + 1}</span>
                </Dot>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                    <span style={{ fontFamily: DISPLAY, fontSize: 15, textTransform: "uppercase" }}>
                      {step.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                      {fmt(step.seconds)}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--p-muted)", marginTop: 3, lineHeight: 1.4 }}>
                    {step.detail}
                  </div>
                  {step.waterTargetG !== undefined && (
                    <MicroLabel style={{ color: "var(--p-faint)", marginTop: 6 }}>
                      to {step.waterTargetG} g
                    </MicroLabel>
                  )}
                  {step.why && (
                    <>
                      <button
                        onClick={() => setOpenWhys((w) => ({ ...w, [i]: !whyOpen }))}
                        aria-expanded={whyOpen}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          marginTop: 6,
                          padding: "6px 0",
                          background: "none",
                          border: "none",
                          color: "var(--p-faint)",
                          fontSize: 12,
                          fontWeight: 700,
                          letterSpacing: ".1em",
                          textTransform: "uppercase",
                        }}
                      >
                        Why
                        <CaretDown
                          size={12}
                          style={{ transform: whyOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}
                        />
                      </button>
                      {whyOpen && (
                        <div style={{ fontSize: 13, color: "var(--p-muted)", lineHeight: 1.45, marginTop: 2 }}>
                          {step.why}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
          <OutlinePill minHeight={60} onClick={() => setDialOpen(true)} style={{ flex: "0 0 auto" }}>
            Dial in
          </OutlinePill>
          <PrimaryPill
            minHeight={60}
            fontSize={18}
            onClick={() => {
              startSession(plan)
              haptics.medium()
            }}
            style={{ flex: 1, width: "auto" }}
          >
            START BREW →
          </PrimaryPill>
        </div>
      </div>

      <DialInSheet
        recipe={recipe}
        open={dialOpen}
        onClose={() => setDialOpen(false)}
        onStart={(nextPlan) => {
          setDialOpen(false)
          startSession(nextPlan)
          haptics.medium()
        }}
      />
    </div>
  )
}

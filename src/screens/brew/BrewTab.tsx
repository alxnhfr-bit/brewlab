import { useEffect, useMemo, useState } from "react"
import type { BrewMethodId, Recipe } from "../../lib/types"
import { useBrewLab, selectLastBrew } from "../../lib/store"
import { METHODS, RECIPES, recipeById } from "../../lib/recipes"
import { totalSeconds } from "../../lib/session"
import { fmt } from "../../lib/format"
import { haptics } from "../../lib/haptics"
import { APP_NAME } from "../../lib/brand"
import { Chip, DISPLAY, Label, PrimaryPill, SpecGrid, TweakPill } from "../../ui/primitives"
import { ArrowCounterClockwise, Burst, LogoMark, MethodSticker } from "../../ui/icons"
import { QuickBrewSheet } from "./QuickBrewSheet"
import { RecipeDetail } from "./RecipeDetail"
import {
  doseWaterLabel,
  methodCode,
  recipeSubtitle,
  tempLabel,
  tweakLabel,
  useRecipePlan,
} from "./shared"

/** "TUE 9 SEP", the live date in the header bar. */
function todayLabel(now: Date): string {
  const weekday = now.toLocaleDateString("en-US", { weekday: "short" })
  const month = now.toLocaleDateString("en-US", { month: "short" })
  return `${weekday} ${now.getDate()} ${month}`.toUpperCase()
}

function HeaderBar() {
  const date = useMemo(() => todayLabel(new Date()), [])
  return (
    <div
      style={{
        padding: "14px 20px",
        borderBottom: "2px solid var(--p-ink)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <LogoMark size={26} />
        <span style={{ fontFamily: DISPLAY, fontSize: 20, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
          {APP_NAME}
        </span>
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: ".12em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {date}
      </span>
    </div>
  )
}

/** Numbers in the spec grid never reflow when a dial-in changes them. */
function Num({ children }: { children: string }) {
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{children}</span>
}

/**
 * The one-tap hero. Same panel for "brew again" and, on an empty journal, for
 * the first brew of the preferred method.
 */
function Hero({ recipe, label }: { recipe: Recipe; label: string }) {
  const startSession = useBrewLab((s) => s.startSession)
  const { plan, tweak } = useRecipePlan(recipe)

  return (
    <div
      style={{
        margin: "20px 20px 0",
        padding: 20,
        borderRadius: 28,
        background: "var(--p-accent)",
        color: "var(--p-accent-ink)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Burst
        size={84}
        color="var(--p-accent-ink)"
        style={{ position: "absolute", top: 14, right: 14, transform: "rotate(-12deg)" }}
      >
        <span style={{ fontFamily: DISPLAY, fontSize: 15, letterSpacing: "-0.02em", color: "var(--p-accent)" }}>
          {methodCode(recipe.method)}
        </span>
      </Burst>

      <Label style={{ color: "var(--p-accent-ink)" }}>{label}</Label>

      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 36,
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
          textTransform: "uppercase",
          marginTop: 14,
          maxWidth: 230,
        }}
      >
        {recipe.name}
      </div>

      <SpecGrid
        style={{ marginTop: 16 }}
        borderColor="var(--p-accent-ink)"
        valueSize={20}
        cells={[
          { value: <Num>{`${plan.doseG} G`}</Num>, caption: "Coffee" },
          { value: <Num>{`${plan.waterG} G`}</Num>, caption: "Water" },
          { value: <Num>{tempLabel(plan.tempC)}</Num>, caption: `${fmt(totalSeconds(plan))} total` },
        ]}
      />

      {tweak && (
        <TweakPill onAccent style={{ marginTop: 14 }}>
          <ArrowCounterClockwise size={14} />
          {tweakLabel(tweak)}
        </TweakPill>
      )}

      <PrimaryPill
        minHeight={64}
        fontSize={20}
        onClick={() => {
          startSession(plan)
          haptics.medium()
        }}
        style={{
          marginTop: 16,
          background: "var(--p-accent-ink)",
          color: "var(--p-accent)",
          letterSpacing: ".02em",
        }}
      >
        START BREW →
      </PrimaryPill>
    </div>
  )
}

function RecipeRow({ recipe, onOpen }: { recipe: Recipe; onOpen: () => void }) {
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
        borderBottom: "2px solid var(--p-ink)",
        color: "var(--p-ink)",
        textAlign: "left",
      }}
    >
      <MethodSticker method={recipe.method} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 15,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {recipe.name}
        </div>
        <div style={{ fontSize: 12, color: "var(--p-muted)", marginTop: 3 }}>{recipeSubtitle(recipe)}</div>
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          whiteSpace: "nowrap",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {doseWaterLabel(recipe.doseG, recipe.waterG)}
      </span>
    </button>
  )
}

export function BrewTab() {
  const lastBrew = useBrewLab(selectLastBrew)
  const preferredMethod = useBrewLab((s) => s.preferredMethod)
  const startSession = useBrewLab((s) => s.startSession)

  const [detailId, setDetailId] = useState<string | null>(null)
  const [methodFilter, setMethodFilter] = useState<BrewMethodId | null>(null)
  const [quickOpen, setQuickOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [detailId])

  const detailRecipe = detailId !== null ? recipeById(detailId) : undefined
  if (detailRecipe) {
    return <RecipeDetail key={detailRecipe.id} recipe={detailRecipe} onBack={() => setDetailId(null)} />
  }

  const lastRecipe = lastBrew ? recipeById(lastBrew.recipeId) : undefined
  const firstMethod: BrewMethodId = preferredMethod ?? "v60"
  const firstRecipe = RECIPES.find((r) => r.method === firstMethod) ?? RECIPES[0]
  const filtered = methodFilter === null ? RECIPES : RECIPES.filter((r) => r.method === methodFilter)

  return (
    <div style={{ paddingTop: 62, paddingBottom: 120 }}>
      <HeaderBar />

      {lastRecipe ? (
        <Hero recipe={lastRecipe} label="Brew again" />
      ) : (
        <Hero recipe={firstRecipe} label="Your first brew" />
      )}

      <div style={{ display: "flex", margin: "24px 20px 0", gap: 8 }}>
        <Chip
          selected={methodFilter === null}
          onClick={() => {
            setMethodFilter(null)
            haptics.selection()
          }}
        >
          All
        </Chip>
        {METHODS.map((m) => (
          <Chip
            key={m.id}
            selected={methodFilter === m.id}
            onClick={() => {
              setMethodFilter(m.id)
              haptics.selection()
            }}
          >
            {methodCode(m.id)}
          </Chip>
        ))}
      </div>

      <div style={{ margin: "20px 20px 0", borderTop: "2px solid var(--p-ink)" }}>
        {filtered.map((r) => (
          <RecipeRow key={r.id} recipe={r} onOpen={() => setDetailId(r.id)} />
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: "20px 0", borderBottom: "2px solid var(--p-ink)" }}>
            <Label>No recipes for this method yet.</Label>
          </div>
        )}
      </div>

      <button
        className="p-press"
        onClick={() => setQuickOpen(true)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "calc(100% - 40px)",
          margin: "20px 20px 0",
          padding: "14px 20px",
          border: "2px dashed var(--p-ink)",
          borderRadius: 999,
          background: "transparent",
          color: "var(--p-ink)",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: ".08em",
          textTransform: "uppercase",
        }}
      >
        Just a timer
        <span>→</span>
      </button>

      <QuickBrewSheet
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
        onStart={(plan) => {
          setQuickOpen(false)
          startSession(plan)
          haptics.medium()
        }}
      />
    </div>
  )
}

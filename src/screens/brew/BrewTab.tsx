import { useEffect, useState } from "react"
import type { BrewMethodId, DoseMemory, Recipe, Tweak } from "../../lib/types"
import { useBrewLab, selectLastBrew } from "../../lib/store"
import { RECIPES, METHODS, recipeById } from "../../lib/recipes"
import { makePlan } from "../../lib/session"
import { haptics } from "../../lib/haptics"
import { Card, Chip, GhostButton, Mono, PrimaryButton, Row, SectionLabel } from "../../ui/primitives"
import { Heart, MethodGlyph, Timer } from "../../ui/icons"
import { QuickBrewSheet } from "./QuickBrewSheet"
import { RecipeDetail } from "./RecipeDetail"
import { GlyphSquare, ParamsLine, TweakChip, methodColors, methodShort, relDate } from "./shared"

function HeroCard({ recipe, lastBrewedAt }: { recipe: Recipe; lastBrewedAt: number }) {
  const doseMemory = useBrewLab((s) => s.doseMemory)
  const pendingTweaks = useBrewLab((s) => s.pendingTweaks)
  const startSession = useBrewLab((s) => s.startSession)

  const memory: DoseMemory | undefined = doseMemory[recipe.id]
  const tweak: Tweak | undefined = pendingTweaks[recipe.id]
  const { accent } = methodColors(recipe.method)

  const doseG = memory?.doseG ?? recipe.doseG
  const waterG = memory?.waterG ?? recipe.waterG
  const tempC = memory !== undefined ? memory.tempC : recipe.tempC

  return (
    <>
      <SectionLabel>Brew again</SectionLabel>
      <Card style={{ padding: 20 }}>
        <Row style={{ gap: 14 }}>
          <GlyphSquare method={recipe.method} size={52} />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                fontFamily: "var(--bl-font-display)",
                lineHeight: 1.2,
              }}
            >
              {recipe.name}
            </div>
            <ParamsLine doseG={doseG} waterG={waterG} tempC={tempC} style={{ display: "block", marginTop: 3 }} />
          </div>
        </Row>
        <div style={{ fontSize: 13, color: "var(--bl-muted)", marginTop: 12 }}>
          Last brewed {relDate(lastBrewedAt)}
        </div>
        {tweak && <TweakChip tweak={tweak} style={{ marginTop: 10 }} />}
        <PrimaryButton
          color={accent}
          style={{ marginTop: 16 }}
          onClick={() => {
            startSession(makePlan(recipe, memory, tweak?.chipLabel))
            haptics.medium()
          }}
        >
          Start brew
        </PrimaryButton>
      </Card>
    </>
  )
}

function FirstBrewCard({ recipe }: { recipe: Recipe }) {
  const startSession = useBrewLab((s) => s.startSession)
  const { accent } = methodColors(recipe.method)
  return (
    <>
      <SectionLabel>Your first brew</SectionLabel>
      <Card style={{ padding: 20 }}>
        <Row style={{ gap: 14 }}>
          <GlyphSquare method={recipe.method} size={52} />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                fontFamily: "var(--bl-font-display)",
                lineHeight: 1.2,
              }}
            >
              {recipe.name}
            </div>
            <ParamsLine
              doseG={recipe.doseG}
              waterG={recipe.waterG}
              tempC={recipe.tempC}
              style={{ display: "block", marginTop: 3 }}
            />
          </div>
        </Row>
        <div style={{ fontSize: 13, color: "var(--bl-muted)", marginTop: 12, lineHeight: 1.5 }}>
          {recipe.whyLine} A guided timer walks you through every step.
        </div>
        <PrimaryButton
          color={accent}
          style={{ marginTop: 16 }}
          onClick={() => {
            startSession(makePlan(recipe))
            haptics.medium()
          }}
        >
          Start your first brew
        </PrimaryButton>
      </Card>
    </>
  )
}

export function BrewTab() {
  const lastBrew = useBrewLab(selectLastBrew)
  const journalCount = useBrewLab((s) => s.journal.length)
  const preferredMethod = useBrewLab((s) => s.preferredMethod)
  const favorites = useBrewLab((s) => s.favorites)
  const toggleFavorite = useBrewLab((s) => s.toggleFavorite)
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
    <div style={{ padding: "24px 24px 120px", animation: "bl-fade-in .25s ease" }}>
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--bl-font-display)", marginBottom: 4 }}>
        Brew
      </div>
      <div style={{ fontSize: 13, color: "var(--bl-muted)", marginBottom: 24 }}>Craft better coffee</div>

      {journalCount > 0 && lastBrew && lastRecipe ? (
        <HeroCard recipe={lastRecipe} lastBrewedAt={lastBrew.at} />
      ) : (
        <FirstBrewCard recipe={firstRecipe} />
      )}

      <SectionLabel style={{ marginTop: 28 }}>Recipes</SectionLabel>
      <Row style={{ gap: 8 }}>
        {METHODS.map((m) => {
          const selected = methodFilter === m.id
          return (
            <Chip
              key={m.id}
              selected={selected}
              color={methodColors(m.id).accent}
              onClick={() => {
                setMethodFilter(selected ? null : m.id)
                haptics.selection()
              }}
              style={{ minHeight: 44, display: "inline-flex", alignItems: "center" }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <MethodGlyph method={m.id} size={16} />
                {m.short}
              </span>
            </Chip>
          )
        })}
      </Row>

      <Card style={{ marginTop: 16, overflow: "hidden" }}>
        {filtered.map((r, i) => {
          const fav = favorites.includes(r.id)
          return (
            <div
              key={r.id}
              onClick={() => setDetailId(r.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 8px 12px 16px",
                borderTop: i > 0 ? "1px solid var(--bl-line)" : "none",
                cursor: "pointer",
                minHeight: 64,
              }}
            >
              <GlyphSquare method={r.method} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    fontFamily: "var(--bl-font-display)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {r.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--bl-muted)", marginTop: 1 }}>
                  {r.author}, {r.roast} roast
                </div>
              </div>
              <Mono style={{ fontSize: 12, color: "var(--bl-muted)", flexShrink: 0 }}>
                {r.doseG}g : {r.waterG}g
              </Mono>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(r.id)
                  haptics.selection()
                }}
                aria-label={fav ? `Unfavorite ${r.name}` : `Favorite ${r.name}`}
                style={{
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: fav ? "var(--bl-caramel)" : "var(--bl-faint)",
                  flexShrink: 0,
                }}
              >
                <Heart size={20} weight={fav ? "fill" : "light"} />
              </button>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div style={{ padding: 20, fontSize: 13, color: "var(--bl-faint)" }}>
            No {methodFilter !== null ? methodShort(methodFilter) : ""} recipes yet.
          </div>
        )}
      </Card>

      <GhostButton onClick={() => setQuickOpen(true)} style={{ width: "100%", marginTop: 12 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Timer size={18} />
          Quick brew: just a timer
        </span>
      </GhostButton>

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

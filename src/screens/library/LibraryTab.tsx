import { useState } from "react"
import type { BrewMethodId, Recipe } from "../../lib/types"
import { useBrewLab } from "../../lib/store"
import { RECIPES } from "../../lib/recipes"
import { makePlan } from "../../lib/session"
import { haptics } from "../../lib/haptics"
import { SectionLabel, Card, Mono, Row } from "../../ui/primitives"
import { GearSix, Heart, PencilSimple, MethodGlyph, BeanGlyph } from "../../ui/icons"
import { SettingsSheet } from "./SettingsSheet"

function accentFor(method: BrewMethodId): { main: string; soft: string } {
  if (method === "v60") return { main: "var(--bl-v60)", soft: "var(--bl-v60-soft)" }
  if (method === "aeropress") return { main: "var(--bl-aero)", soft: "var(--bl-aero-soft)" }
  return { main: "var(--bl-cold)", soft: "var(--bl-cold-soft)" }
}

/** Small caramel release pill, e.g. "v1.5" or "v2". */
function VersionPill({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: "var(--bl-font-mono)",
        fontSize: 10.5,
        fontWeight: 500,
        letterSpacing: "0.04em",
        padding: "3px 9px",
        borderRadius: 999,
        background: "var(--bl-caramel-soft)",
        color: "var(--bl-caramel)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  )
}

function FavoriteRow({ recipe, isLast }: { recipe: Recipe; isLast: boolean }) {
  const doseMemory = useBrewLab((s) => s.doseMemory)
  const pendingTweaks = useBrewLab((s) => s.pendingTweaks)
  const toggleFavorite = useBrewLab((s) => s.toggleFavorite)
  const startSession = useBrewLab((s) => s.startSession)
  const accent = accentFor(recipe.method)
  const memory = doseMemory[recipe.id]
  const doseG = memory?.doseG ?? recipe.doseG
  const waterG = memory?.waterG ?? recipe.waterG

  const brew = () => {
    const plan = makePlan(recipe, memory, pendingTweaks[recipe.id]?.chipLabel)
    startSession(plan)
    haptics.medium()
  }

  return (
    <Row
      style={{
        padding: "12px 14px",
        borderBottom: isLast ? "none" : "1px solid var(--bl-line)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: "var(--bl-radius-sm)",
          background: accent.soft,
          color: accent.main,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MethodGlyph method={recipe.method} size={22} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--bl-font-display)",
            fontWeight: 600,
            fontSize: 15,
            color: "var(--bl-ink)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {recipe.name}
        </div>
        <Mono style={{ fontSize: 12, color: "var(--bl-muted)" }}>
          {doseG}g : {waterG}g
        </Mono>
      </div>
      <button
        onClick={() => {
          toggleFavorite(recipe.id)
          haptics.light()
        }}
        aria-label={`Remove ${recipe.name} from favorites`}
        style={{
          width: 44,
          height: 44,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--bl-caramel)",
        }}
      >
        <Heart weight="fill" size={20} />
      </button>
      <button
        onClick={brew}
        style={{
          minHeight: 44,
          padding: "0 18px",
          flexShrink: 0,
          borderRadius: 999,
          border: "none",
          background: accent.main,
          color: "var(--bl-brand-ink)",
          fontFamily: "var(--bl-font-display)",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.02em",
          cursor: "pointer",
          transition: "transform .12s",
        }}
      >
        Brew
      </button>
    </Row>
  )
}

/** Library tab root: favorites, plus placeholders for my recipes and the bean shelf. */
export function LibraryTab() {
  const favorites = useBrewLab((s) => s.favorites)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const favoriteRecipes = RECIPES.filter((r) => favorites.includes(r.id))

  return (
    <div style={{ padding: "24px 24px 120px", animation: "bl-fade-in .25s ease" }}>
      <Row style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div
            style={{
              fontFamily: "var(--bl-font-display)",
              fontSize: 28,
              fontWeight: 700,
              color: "var(--bl-ink)",
              marginBottom: 4,
            }}
          >
            Library
          </div>
          <div style={{ fontSize: 13, color: "var(--bl-muted)" }}>Your recipes, kept close</div>
        </div>
        <button
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
          style={{
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            border: "1px solid var(--bl-line)",
            background: "var(--bl-card)",
            color: "var(--bl-muted)",
            cursor: "pointer",
          }}
        >
          <GearSix size={22} />
        </button>
      </Row>

      <SectionLabel>Favorites</SectionLabel>
      {favoriteRecipes.length === 0 ? (
        <Card style={{ padding: 18 }}>
          <Row>
            <div
              style={{
                width: 44,
                height: 44,
                flexShrink: 0,
                borderRadius: "var(--bl-radius-sm)",
                background: "var(--bl-brand-soft)",
                color: "var(--bl-brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Heart size={22} />
            </div>
            <div style={{ fontSize: 14, color: "var(--bl-muted)" }}>
              Heart a recipe to keep it here.
            </div>
          </Row>
        </Card>
      ) : (
        <Card>
          {favoriteRecipes.map((r, i) => (
            <FavoriteRow key={r.id} recipe={r} isLast={i === favoriteRecipes.length - 1} />
          ))}
        </Card>
      )}

      <SectionLabel style={{ marginTop: 28 }}>My recipes</SectionLabel>
      <Card style={{ padding: "14px 16px", opacity: 0.6 }}>
        <Row>
          <div
            style={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: "var(--bl-radius-sm)",
              background: "var(--bl-bg)",
              color: "var(--bl-faint)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PencilSimple size={20} />
          </div>
          <div style={{ flex: 1, fontSize: 14, color: "var(--bl-muted)" }}>
            Create your own recipes
          </div>
          <VersionPill label="v1.5" />
        </Row>
      </Card>

      <SectionLabel style={{ marginTop: 28 }}>Bean shelf</SectionLabel>
      <Card style={{ padding: "14px 16px", opacity: 0.6 }}>
        <Row>
          <div
            style={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: "var(--bl-radius-sm)",
              background: "var(--bl-bg)",
              color: "var(--bl-faint)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BeanGlyph size={20} />
          </div>
          <div style={{ flex: 1, fontSize: 14, color: "var(--bl-muted)" }}>
            Track bags and freshness
          </div>
          <VersionPill label="v2" />
        </Row>
      </Card>

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

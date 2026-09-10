import { useState } from "react"
import type { Recipe } from "../../lib/types"
import { useBrewLab } from "../../lib/store"
import { RECIPES } from "../../lib/recipes"
import { makePlan } from "../../lib/session"
import { haptics } from "../../lib/haptics"
import { DISPLAY, Label, PageTitle, RoundBtn } from "../../ui/primitives"
import { GearSix, Heart, MethodSticker } from "../../ui/icons"
import { Appearance } from "./Appearance"
import { SettingsSheet } from "./SettingsSheet"

/** Ink-filled release badge, e.g. "V1.5". */
function VersionBadge({ label }: { label: string }) {
  return (
    <span
      style={{
        flexShrink: 0,
        padding: "6px 10px",
        borderRadius: 999,
        background: "var(--p-ink)",
        color: "var(--p-bg)",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: ".12em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  )
}

/** Dashed placeholder card for a shelf that lands in a later release. */
function ComingCard({ copy, version }: { copy: string; version: string }) {
  return (
    <div
      style={{
        marginTop: 10,
        border: "2px dashed var(--p-ink)",
        borderRadius: 22,
        padding: "16px 18px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          flex: 1,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: "var(--p-muted)",
        }}
      >
        {copy}
      </div>
      <VersionBadge label={version} />
    </div>
  )
}

function FavoriteRow({ recipe }: { recipe: Recipe }) {
  const doseMemory = useBrewLab((s) => s.doseMemory)
  const pendingTweaks = useBrewLab((s) => s.pendingTweaks)
  const toggleFavorite = useBrewLab((s) => s.toggleFavorite)
  const startSession = useBrewLab((s) => s.startSession)

  const memory = doseMemory[recipe.id]
  const doseG = memory?.doseG ?? recipe.doseG
  const waterG = memory?.waterG ?? recipe.waterG

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 0",
        borderBottom: "2px solid var(--p-ink)",
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
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".08em",
            color: "var(--p-muted)",
            marginTop: 4,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {doseG} : {waterG}
        </div>
      </div>
      <button
        className="p-press"
        onClick={() => {
          toggleFavorite(recipe.id)
          haptics.light()
        }}
        aria-label={`Remove ${recipe.name} from favorites`}
        style={{
          // Padded out for the thumb, pulled back in so the row keeps the
          // 12px rhythm of the design.
          height: 40,
          padding: "0 8px",
          margin: "0 -8px",
          flexShrink: 0,
          background: "none",
          border: "none",
          color: "var(--p-accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Heart size={18} />
      </button>
      <button
        className="p-press"
        onClick={() => {
          startSession(makePlan(recipe, memory, pendingTweaks[recipe.id]?.chipLabel))
          haptics.medium()
        }}
        style={{
          minHeight: 40,
          padding: "0 16px",
          flexShrink: 0,
          border: "none",
          borderRadius: 999,
          background: "var(--p-accent)",
          color: "var(--p-accent-ink)",
          fontFamily: DISPLAY,
          fontSize: 12,
          letterSpacing: ".08em",
          textTransform: "uppercase",
        }}
      >
        Brew
      </button>
    </div>
  )
}

/** Library tab root: favorites, plus the shelves that arrive in later releases. */
export function LibraryTab() {
  const favorites = useBrewLab((s) => s.favorites)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [appearanceOpen, setAppearanceOpen] = useState(false)
  const favoriteRecipes = RECIPES.filter((r) => favorites.includes(r.id))

  if (appearanceOpen) return <Appearance onBack={() => setAppearanceOpen(false)} />

  return (
    <div style={{ padding: "62px 0 120px" }}>
      <div
        style={{
          padding: "10px 20px 14px",
          borderBottom: "2px solid var(--p-ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <PageTitle>Library</PageTitle>
          <Label style={{ marginTop: 6 }}>Your recipes, kept close</Label>
        </div>
        <RoundBtn size={44} onClick={() => setSettingsOpen(true)} label="Settings">
          <GearSix size={18} />
        </RoundBtn>
      </div>

      <div style={{ padding: "22px 20px 0" }}>
        <Label>Favorites</Label>
        {favoriteRecipes.length === 0 ? (
          <div
            style={{
              marginTop: 10,
              border: "2px solid var(--p-ink)",
              borderRadius: 22,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Heart size={18} style={{ flexShrink: 0, color: "var(--p-accent)" }} />
            <div
              style={{
                flex: 1,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: "var(--p-muted)",
              }}
            >
              Heart a recipe to keep it here
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 10, borderTop: "2px solid var(--p-ink)" }}>
            {favoriteRecipes.map((r) => (
              <FavoriteRow key={r.id} recipe={r} />
            ))}
          </div>
        )}

        <Label style={{ marginTop: 26 }}>My recipes</Label>
        <ComingCard copy="Create your own recipes" version="V1.5" />

        <Label style={{ marginTop: 26 }}>Bean shelf</Label>
        <ComingCard copy="Track bags and freshness" version="V2" />
      </div>

      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onAppearance={() => {
          setSettingsOpen(false)
          setAppearanceOpen(true)
        }}
      />
    </div>
  )
}

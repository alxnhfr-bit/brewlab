import { useEffect, useState } from "react"
import type { BrewMethodId, PaletteId, ThemeSetting } from "../../lib/types"
import { useBrewLab, selectLastBrew } from "../../lib/store"
import { RECIPES, recipeById } from "../../lib/recipes"
import { haptics } from "../../lib/haptics"
import { DISPLAY, Label, RoundBtn } from "../../ui/primitives"
import { Burst, CaretLeft, Check, Dot } from "../../ui/icons"

const PALETTES: { id: PaletteId; name: string; note: string }[] = [
  { id: "pink", name: "Pink", note: "Hot pink on black. The original sticker set." },
  {
    id: "lime",
    name: "Lime",
    note: "Acid lime and bottle green, strictly two colors. They swap in dark mode.",
  },
  { id: "tangerine", name: "Tangerine", note: "Plum ink with a tangerine accent. Warmest of the three." },
]

const MODES: { id: ThemeSetting; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
]

/** Short method code for the preview sticker, matching the brew-home filters. */
const METHOD_CODE: Record<BrewMethodId, string> = {
  v60: "V60",
  aeropress: "AERO",
  coldbrew: "COLD",
}

/**
 * Light/dark actually in force. The palette preview cards need it so each card
 * can render its own palette at the mode the app is currently showing.
 */
function useResolvedTheme(theme: ThemeSetting): "light" | "dark" {
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  )
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])
  return theme === "system" ? (systemDark ? "dark" : "light") : theme
}

function PaletteCard({
  id,
  name,
  selected,
  theme,
  onPick,
}: {
  id: PaletteId
  name: string
  selected: boolean
  theme: "light" | "dark"
  onPick: () => void
}) {
  return (
    <button
      className="p-press"
      onClick={onPick}
      aria-pressed={selected}
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 44,
        padding: 0,
        background: "none",
        border: selected ? "3px solid var(--p-ink)" : "2px solid var(--p-track)",
        borderRadius: 22,
        overflow: "hidden",
        textAlign: "left",
        position: "relative",
      }}
    >
      {/* Re-scopes the palette tokens for its own subtree, so the swatch shows
          the real thing rather than an approximation of it. */}
      <div
        data-palette={id}
        data-theme={theme}
        style={{
          background: "var(--p-bg)",
          color: "var(--p-ink)",
          padding: "14px 12px 12px",
          minHeight: 126,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Burst size={30} />
          <Dot size={22} />
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase" }}>
          {name}
        </div>
      </div>
      {selected && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 24,
            height: 24,
            borderRadius: 999,
            background: "var(--p-ink)",
            color: "var(--p-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check size={13} />
        </div>
      )}
    </button>
  )
}

export interface AppearanceProps {
  onBack: () => void
}

/**
 * Pushed under Settings inside the Library tab, so the tab bar stays. Palette
 * and mode apply instantly and persist; there is no confirmation step.
 */
export function Appearance({ onBack }: AppearanceProps) {
  const palette = useBrewLab((s) => s.settings.palette)
  const theme = useBrewLab((s) => s.settings.theme)
  const setPalette = useBrewLab((s) => s.setPalette)
  const setTheme = useBrewLab((s) => s.setTheme)
  const favorites = useBrewLab((s) => s.favorites)
  const lastBrew = useBrewLab(selectLastBrew)
  const resolved = useResolvedTheme(theme)

  const note = PALETTES.find((p) => p.id === palette)?.note ?? ""
  const previewRecipe =
    recipeById(lastBrew?.recipeId ?? null) ??
    RECIPES.find((r) => favorites.includes(r.id)) ??
    RECIPES[0]

  return (
    <div style={{ padding: "62px 0 120px" }}>
      <div
        style={{
          padding: "10px 20px 14px",
          borderBottom: "2px solid var(--p-ink)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <RoundBtn size={40} onClick={onBack} label="Back to library">
          <CaretLeft size={18} />
        </RoundBtn>
        <div>
          <Label>Settings</Label>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 24,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}
          >
            Appearance
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 20px 0" }}>
        <Label>Color</Label>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          {PALETTES.map((p) => (
            <PaletteCard
              key={p.id}
              id={p.id}
              name={p.name}
              selected={p.id === palette}
              theme={resolved}
              onPick={() => {
                setPalette(p.id)
                haptics.selection()
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 12, color: "var(--p-muted)", marginTop: 12, lineHeight: 1.45 }}>{note}</div>

        <Label style={{ marginTop: 28 }}>Mode</Label>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {MODES.map((m) => {
            const on = m.id === theme
            return (
              <button
                key={m.id}
                className="p-press"
                onClick={() => {
                  setTheme(m.id)
                  haptics.selection()
                }}
                aria-pressed={on}
                style={{
                  flex: 1,
                  minHeight: 48,
                  border: "2px solid var(--p-ink)",
                  borderRadius: 999,
                  background: on ? "var(--p-ink)" : "transparent",
                  color: on ? "var(--p-bg)" : "var(--p-ink)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                }}
              >
                {m.label}
              </button>
            )
          })}
        </div>

        <Label style={{ marginTop: 28 }}>Preview</Label>
        <div
          style={{
            marginTop: 12,
            background: "var(--p-accent)",
            color: "var(--p-accent-ink)",
            padding: 16,
            borderRadius: 22,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Burst
            size={56}
            color="var(--p-accent-ink)"
            style={{ position: "absolute", top: 10, right: 10, transform: "rotate(-12deg)" }}
          >
            <span style={{ fontFamily: DISPLAY, fontSize: 11, color: "var(--p-accent)" }}>
              {METHOD_CODE[previewRecipe.method]}
            </span>
          </Burst>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" }}>
            Brew again
          </span>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 22,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              marginTop: 8,
              maxWidth: 200,
            }}
          >
            {previewRecipe.name}
          </div>
          <div
            style={{
              marginTop: 12,
              display: "inline-flex",
              alignItems: "center",
              background: "var(--p-accent-ink)",
              color: "var(--p-accent)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              padding: "8px 14px",
              borderRadius: 999,
            }}
          >
            Start brew &rarr;
          </div>
        </div>
      </div>
    </div>
  )
}

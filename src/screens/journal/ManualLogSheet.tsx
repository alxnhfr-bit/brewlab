import { useState, type CSSProperties } from "react"
import { useBrewLab } from "../../lib/store"
import type { BrewMethodId, TasteTag } from "../../lib/types"
import { METHODS, RECIPES } from "../../lib/recipes"
import { haptics } from "../../lib/haptics"
import { Chip, PrimaryButton, SectionLabel, Segmented, Sheet } from "../../ui/primitives"
import { BeanRating, TasteChips } from "./shared"

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  minHeight: 48,
  padding: "12px 14px",
  background: "var(--bl-card)",
  border: "1px solid var(--bl-line)",
  borderRadius: "var(--bl-radius)",
  color: "var(--bl-ink)",
  fontSize: 15,
  fontFamily: "inherit",
  outline: "none",
}

export function ManualLogSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const logManual = useBrewLab((s) => s.logManual)

  const [method, setMethod] = useState<BrewMethodId>("v60")
  const [recipeId, setRecipeId] = useState<string | null>(null)
  const [name, setName] = useState("Manual brew")
  const [dose, setDose] = useState("")
  const [water, setWater] = useState("")
  const [rating, setRating] = useState<number | undefined>(undefined)
  const [taste, setTaste] = useState<TasteTag | undefined>(undefined)

  const methodRecipes = RECIPES.filter((r) => r.method === method)

  function changeMethod(id: string) {
    const m = METHODS.find((x) => x.id === id)
    if (!m || m.id === method) return
    setMethod(m.id)
    setRecipeId(null)
  }

  function pickRecipe(id: string) {
    if (recipeId === id) {
      setRecipeId(null)
      return
    }
    const r = methodRecipes.find((x) => x.id === id)
    if (!r) return
    setRecipeId(r.id)
    setName(r.name)
    setDose(String(r.doseG))
    setWater(String(r.waterG))
  }

  function reset() {
    setRecipeId(null)
    setName("Manual brew")
    setDose("")
    setWater("")
    setRating(undefined)
    setTaste(undefined)
  }

  function save() {
    const doseG = parseFloat(dose)
    const waterG = parseFloat(water)
    logManual({
      at: Date.now(),
      recipeId,
      recipeName: name.trim() === "" ? "Manual brew" : name.trim(),
      method,
      doseG: Number.isFinite(doseG) ? doseG : 0,
      waterG: Number.isFinite(waterG) ? waterG : 0,
      tempC: null,
      durationSec: 0,
      completed: true,
      rating,
      taste,
    })
    haptics.light()
    reset()
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Log a brew">
      <SectionLabel style={{ marginBottom: 8 }}>Method</SectionLabel>
      <Segmented
        options={METHODS.map((m) => ({ id: m.id, label: m.short }))}
        value={method}
        onChange={changeMethod}
      />

      <SectionLabel style={{ marginTop: 20, marginBottom: 8 }}>Recipe (optional)</SectionLabel>
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          margin: "0 -24px",
          padding: "0 24px 4px",
        }}
      >
        {methodRecipes.map((r) => (
          <Chip key={r.id} selected={recipeId === r.id} onClick={() => pickRecipe(r.id)}>
            {r.name}
          </Chip>
        ))}
      </div>

      <SectionLabel style={{ marginTop: 20, marginBottom: 8 }}>Name</SectionLabel>
      <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <div style={{ flex: 1 }}>
          <SectionLabel style={{ marginBottom: 8 }}>Dose (g)</SectionLabel>
          <input
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            inputMode="decimal"
            placeholder="15"
            style={{ ...inputStyle, fontFamily: "var(--bl-font-mono)" }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <SectionLabel style={{ marginBottom: 8 }}>Water (g)</SectionLabel>
          <input
            value={water}
            onChange={(e) => setWater(e.target.value)}
            inputMode="decimal"
            placeholder="250"
            style={{ ...inputStyle, fontFamily: "var(--bl-font-mono)" }}
          />
        </div>
      </div>

      <SectionLabel style={{ marginTop: 20, marginBottom: 4 }}>Rating (optional)</SectionLabel>
      <BeanRating value={rating} onChange={setRating} />

      <SectionLabel style={{ marginTop: 20, marginBottom: 8 }}>Taste (optional)</SectionLabel>
      <TasteChips value={taste} onChange={setTaste} />

      <PrimaryButton onClick={save} style={{ marginTop: 28 }}>
        Save brew
      </PrimaryButton>
    </Sheet>
  )
}

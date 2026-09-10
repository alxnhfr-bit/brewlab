import { useState, type ReactNode } from "react"
import { useBrewLab } from "../../lib/store"
import type { BrewMethodId, TasteTag } from "../../lib/types"
import { METHODS, RECIPES } from "../../lib/recipes"
import { haptics } from "../../lib/haptics"
import { Chip, Label, PillInput, PrimaryPill, Sheet } from "../../ui/primitives"
import { RatingRow, TasteChipRow, methodShort } from "./shared"

/** Three equal method pills. Selected = ink fill / bg text. */
function MethodSegment({
  value,
  onChange,
}: {
  value: BrewMethodId
  onChange: (method: BrewMethodId) => void
}) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {METHODS.map((m) => {
        const selected = m.id === value
        return (
          <button
            key={m.id}
            className="p-press"
            onClick={() => onChange(m.id)}
            style={{
              flex: 1,
              minHeight: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--p-ink)",
              borderRadius: 999,
              background: selected ? "var(--p-ink)" : "transparent",
              color: selected ? "var(--p-bg)" : "var(--p-ink)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
            }}
          >
            {methodShort(m.id)}
          </button>
        )
      })}
    </div>
  )
}

/** Validation message: accent pill, accent-ink text, under the bad input. */
function FieldError({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        marginTop: 8,
        padding: "6px 14px",
        borderRadius: 999,
        background: "var(--p-accent)",
        color: "var(--p-accent-ink)",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: ".08em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  )
}

function amount(raw: string): number | null {
  const trimmed = raw.trim()
  if (trimmed === "") return null
  const n = Number(trimmed)
  return Number.isFinite(n) && n > 0 ? n : null
}

export function ManualLogSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const logManual = useBrewLab((s) => s.logManual)

  const [method, setMethod] = useState<BrewMethodId>("v60")
  const [recipeId, setRecipeId] = useState<string | null>(null)
  const [name, setName] = useState("Manual brew")
  const [dose, setDose] = useState("")
  const [water, setWater] = useState("")
  const [rating, setRating] = useState<number | undefined>(undefined)
  const [tastes, setTastes] = useState<TasteTag[]>([])
  const [showErrors, setShowErrors] = useState(false)

  const methodRecipes = RECIPES.filter((r) => r.method === method)
  const doseG = amount(dose)
  const waterG = amount(water)
  const nameInvalid = name.trim() === ""
  const doseInvalid = doseG === null
  const waterInvalid = waterG === null

  function changeMethod(id: BrewMethodId) {
    if (id === method) return
    setMethod(id)
    setRecipeId(null)
    haptics.selection()
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
    setTastes([])
    setShowErrors(false)
  }

  function save() {
    if (nameInvalid || doseG === null || waterG === null) {
      setShowErrors(true)
      return
    }
    logManual({
      at: Date.now(),
      recipeId,
      recipeName: name.trim(),
      method,
      doseG,
      waterG,
      tempC: null,
      durationSec: 0,
      completed: true,
      rating,
      tastes: tastes.length > 0 ? tastes : undefined,
    })
    haptics.light()
    reset()
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Log a brew">
      <Label style={{ marginTop: 18 }}>Method</Label>
      <div style={{ marginTop: 10 }}>
        <MethodSegment value={method} onChange={changeMethod} />
      </div>

      <Label style={{ marginTop: 20 }}>Recipe (optional)</Label>
      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {methodRecipes.map((r) => (
          <Chip key={r.id} selected={recipeId === r.id} onClick={() => pickRecipe(r.id)}>
            {r.name}
          </Chip>
        ))}
      </div>

      <Label style={{ marginTop: 20 }}>Name</Label>
      <div style={{ marginTop: 10 }}>
        <PillInput value={name} onChange={setName} invalid={showErrors && nameInvalid} />
        {showErrors && nameInvalid && <FieldError>Name is required</FieldError>}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Label>Dose (g)</Label>
          <div style={{ marginTop: 10 }}>
            <PillInput
              value={dose}
              onChange={setDose}
              placeholder="15"
              inputMode="decimal"
              invalid={showErrors && doseInvalid}
              style={{ fontVariantNumeric: "tabular-nums" }}
            />
            {showErrors && doseInvalid && <FieldError>Enter a number</FieldError>}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Label>Water (g)</Label>
          <div style={{ marginTop: 10 }}>
            <PillInput
              value={water}
              onChange={setWater}
              placeholder="250"
              inputMode="decimal"
              invalid={showErrors && waterInvalid}
              style={{ fontVariantNumeric: "tabular-nums" }}
            />
            {showErrors && waterInvalid && <FieldError>Enter a number</FieldError>}
          </div>
        </div>
      </div>

      <Label style={{ marginTop: 20 }}>Rating (optional)</Label>
      <div style={{ marginTop: 10 }}>
        <RatingRow value={rating} size={26} onChange={setRating} />
      </div>

      <Label style={{ marginTop: 20 }}>Taste (optional)</Label>
      <div style={{ marginTop: 10 }}>
        <TasteChipRow value={tastes} onChange={setTastes} />
      </div>

      <PrimaryPill
        minHeight={60}
        fontSize={18}
        style={{ marginTop: 24, textTransform: "uppercase" }}
        onClick={save}
      >
        Save brew
      </PrimaryPill>
    </Sheet>
  )
}

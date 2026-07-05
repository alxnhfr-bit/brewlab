import { useState } from "react"
import { C, MC } from "../lib/theme"
import { MI, ChI } from "./icons"
import { METHODS, RECIPES, type Recipe } from "../lib/data"
import type { BrewMethodId } from "../lib/theme"
import { Lbl } from "./Shared"

export interface RecipesScreenProps {
  onBrew: (recipe: Recipe) => void
}

export function RecipesScreen({ onBrew }: RecipesScreenProps) {
  const [mf, setMf] = useState<BrewMethodId | null>(null)
  const fl = mf ? RECIPES.filter((r) => r.method === mf) : RECIPES

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
      <div>
        <Lbl>Brew Method</Lbl>
        <div style={{ display: "flex", gap: 10 }}>
          {METHODS.map((m) => {
            const mc = MC[m.id]
            const sel = mf === m.id
            const Ic = MI[m.id]
            return (
              <button
                key={m.id}
                onClick={() => setMf(sel ? null : m.id)}
                style={{
                  flex: 1, padding: "26px 12px 20px", borderRadius: 16, cursor: "pointer",
                  border: sel ? "none" : "1px solid " + C.line, background: sel ? mc.main : C.card,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                  boxShadow: sel ? "0 6px 24px " + mc.main + "30" : "none",
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: sel ? "rgba(255,255,255,.2)" : C.greenPale, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ic size={28} color={sel ? "#fff" : mc.main} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: sel ? "#fff" : C.text }}>{m.short}</div>
                  <div style={{ fontSize: 10, color: sel ? "rgba(255,255,255,.6)" : C.faint, marginTop: 2 }}>
                    {m.ratio} · {m.time}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <Lbl>{mf ? METHODS.find((m) => m.id === mf)!.short + " Recipes" : "All Recipes"}</Lbl>
          {mf && (
            <button onClick={() => setMf(null)} style={{ background: "none", border: "none", fontSize: 11, color: C.faint, cursor: "pointer" }}>
              Show all
            </button>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {fl.map((r, i) => {
            const mc = MC[r.method]
            const Ic = MI[r.method]
            return (
              <button
                key={r.id}
                onClick={() => onBrew(r)}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "16px 4px", background: "none", border: "none",
                  borderBottom: i < fl.length - 1 ? "1px solid " + C.line : "none", cursor: "pointer", textAlign: "left",
                  width: "100%", fontFamily: "'Outfit',sans-serif",
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: mc.light, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Ic size={24} color={mc.main} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>{r.author}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginRight: 4 }}>
                  <div style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: C.muted }}>{r.coffee}g : {r.water}g</div>
                  <div style={{ fontSize: 10, color: C.faint, marginTop: 2 }}>{r.roast}</div>
                </div>
                <ChI />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { useCallback, useState } from "react"
import { C } from "./lib/theme"
import { NAV, type Recipe } from "./lib/data"
import { HomeScreen } from "./components/HomeScreen"
import { RecipesScreen } from "./components/RecipesScreen"
import { CalcScreen } from "./components/CalcScreen"
import { TimerScreen } from "./components/TimerScreen"
import { ShopScreen } from "./components/ShopScreen"

export default function BrewLab() {
  const [home, setHome] = useState(true)
  const [tab, setTab] = useState("recipes")
  const [ar, setAr] = useState<Recipe | null>(null)

  const brew = useCallback((r: Recipe) => {
    setAr(r)
    setTab("timer")
  }, [])

  if (home) {
    return (
      <div style={{ fontFamily: "'Outfit','Helvetica Neue',sans-serif", maxWidth: 420, margin: "0 auto" }}>
        <HomeScreen onEnter={() => setHome(false)} />
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Outfit','Helvetica Neue',sans-serif", background: C.bg, color: C.text, minHeight: "100vh", maxWidth: 420, margin: "0 auto", position: "relative", paddingBottom: 78 }}>
      <div style={{ padding: "22px 24px 16px", position: "sticky", top: 0, background: C.bgA, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", zIndex: 100, borderBottom: "1px solid " + C.line }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", color: C.text }}>BrewLab</span>
          <span style={{ fontSize: 11, color: C.faint }}>Craft better coffee</span>
        </div>
      </div>
      <div style={{ padding: "28px 24px" }}>
        {tab === "recipes" && <RecipesScreen onBrew={brew} />}
        {tab === "calculator" && <CalcScreen />}
        {tab === "timer" && <TimerScreen activeRecipe={ar} setActiveRecipe={setAr} />}
        {tab === "shop" && <ShopScreen />}
      </div>
      <div
        style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420,
          background: C.bgA, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid " + C.line,
          display: "flex", padding: "10px 0 18px", zIndex: 100,
        }}
      >
        {NAV.map((n) => {
          const a = tab === n.id
          return (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: a ? C.green : C.faint, padding: 0 }}
            >
              <n.Ic size={20} />
              <span style={{ fontSize: 9, fontWeight: a ? 600 : 400, letterSpacing: ".08em", textTransform: "uppercase" }}>{n.label}</span>
              {a && <div style={{ width: 3, height: 3, borderRadius: "50%", background: C.green, marginTop: 1 }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

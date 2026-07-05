import { useState } from "react"
import { C, MC, type MethodColor } from "../lib/theme"
import { BnI } from "./icons"
import { BEANS, GEAR, type Bean, type Gear } from "../lib/data"
import { Tog } from "./Shared"

function roastColor(r: Bean["roast"]): MethodColor {
  return r === "light" ? MC.v60 : r === "medium" ? MC.aeropress : MC.coldbrew
}

export function ShopScreen() {
  const [tab, setTab] = useState("beans")
  const [cart, setCart] = useState<(Bean | Gear)[]>([])
  const tot = cart.reduce((a, c) => a + c.price, 0)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {cart.length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: C.greenPale, borderRadius: 14 }}>
          <span style={{ fontSize: 12, color: C.muted }}>{cart.length} item{cart.length > 1 ? "s" : ""}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontFamily: "'DM Mono',monospace", fontWeight: 500, color: C.text }}>€{tot.toFixed(2)}</span>
            <div style={{ background: C.green, color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Checkout</div>
          </div>
        </div>
      )}
      <Tog
        options={[
          { id: "beans", name: "Beans" },
          { id: "gear", name: "Gear" },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === "beans" &&
        BEANS.map((b, i) => {
          const c = roastColor(b.roast)
          return (
            <div key={b.id} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "18px 4px", borderBottom: i < BEANS.length - 1 ? "1px solid " + C.line : "none" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: c.light, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BnI color={c.main} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{b.name}</div>
                <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>{b.origin} · {b.wt}</div>
                <div style={{ fontSize: 11, color: C.stone, marginTop: 4, fontStyle: "italic", lineHeight: 1.5 }}>{b.notes}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontFamily: "'DM Mono',monospace", fontWeight: 500, color: C.text }}>€{b.price.toFixed(2)}</div>
                <button
                  onClick={() => setCart(cart.concat([b]))}
                  style={{ marginTop: 8, padding: "6px 16px", borderRadius: 8, border: "1.5px solid " + C.line, background: "none", fontSize: 11, fontWeight: 500, cursor: "pointer", color: C.stone }}
                >
                  Add
                </button>
              </div>
            </div>
          )
        })}
      {tab === "gear" &&
        GEAR.map((g, i) => (
          <div key={g.id} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "18px 4px", borderBottom: i < GEAR.length - 1 ? "1px solid " + C.line : "none" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{g.name}</div>
              <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>{g.desc}</div>
              <div style={{ fontSize: 9, color: C.faint, marginTop: 4, textTransform: "uppercase", letterSpacing: ".15em", fontWeight: 500 }}>{g.cat}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontFamily: "'DM Mono',monospace", fontWeight: 500, color: C.text }}>€{g.price.toFixed(2)}</div>
              <button
                onClick={() => setCart(cart.concat([g]))}
                style={{ marginTop: 8, padding: "6px 16px", borderRadius: 8, border: "1.5px solid " + C.line, background: "none", fontSize: 11, fontWeight: 500, cursor: "pointer", color: C.stone }}
              >
                Add
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}

import { useState } from "react"
import { C, MC } from "../lib/theme"
import type { BrewMethodId } from "../lib/theme"
import { METHODS, ROASTS, PREFS } from "../lib/data"
import { Lbl, Tog } from "./Shared"

const BASE_RATIO: Record<BrewMethodId, number> = { v60: 15, aeropress: 12, coldbrew: 8 }
const CUP_SIZE: Record<BrewMethodId, number> = { v60: 250, aeropress: 220, coldbrew: 300 }
const BASE_TEMP: Record<BrewMethodId, number> = { v60: 94, aeropress: 86, coldbrew: 4 }

export function CalcScreen() {
  const [m, setM] = useState<BrewMethodId>("v60")
  const [ro, setRo] = useState("medium")
  const [pr, setPr] = useState("balanced")
  const [cu, setCu] = useState(1)

  const rd = ROASTS.find((r) => r.id === ro)
  const pd = PREFS.find((p) => p.id === pr)
  const ratio = BASE_RATIO[m] + (rd ? rd.rA : 0) + (pd ? pd.rA : 0)
  const tw = CUP_SIZE[m] * cu
  const cof = Math.round((tw / ratio) * 10) / 10
  const temp = m === "coldbrew" ? "Room temp" : BASE_TEMP[m] + (rd ? rd.tA : 0) + "°C"
  const md = METHODS.find((x) => x.id === m)
  const mc = MC[m]
  const pills = ["1:" + ratio, temp, md ? md.grind : ""]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <Lbl>Method</Lbl>
        <Tog options={METHODS} value={m} onChange={(id) => setM(id as BrewMethodId)} />
      </div>
      <div>
        <Lbl>Roast level</Lbl>
        <Tog options={ROASTS} value={ro} onChange={setRo} />
      </div>
      <div>
        <Lbl>Taste preference</Lbl>
        <Tog options={PREFS} value={pr} onChange={setPr} />
      </div>
      <div>
        <Lbl>Servings</Lbl>
        <div style={{ display: "flex", alignItems: "center", gap: 24, justifyContent: "center" }}>
          <button
            onClick={() => setCu(Math.max(1, cu - 1))}
            style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid " + C.line, background: C.card, fontSize: 18, cursor: "pointer", color: C.stone, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            −
          </button>
          <span style={{ fontSize: 42, fontWeight: 300, fontFamily: "'DM Mono',monospace", color: C.text, minWidth: 36, textAlign: "center" }}>{cu}</span>
          <button
            onClick={() => setCu(Math.min(8, cu + 1))}
            style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid " + C.line, background: C.card, fontSize: 18, cursor: "pointer", color: C.stone, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            +
          </button>
        </div>
      </div>
      <div style={{ background: mc.light, borderRadius: 20, padding: "32px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
          <div>
            <div style={{ fontSize: 42, fontWeight: 300, fontFamily: "'DM Mono',monospace", color: C.text, lineHeight: 1 }}>{cof}</div>
            <div style={{ fontSize: 9, color: C.muted, marginTop: 8, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 500 }}>grams coffee</div>
          </div>
          <div style={{ width: 1, background: mc.main + "20", alignSelf: "stretch" }} />
          <div>
            <div style={{ fontSize: 42, fontWeight: 300, fontFamily: "'DM Mono',monospace", color: C.text, lineHeight: 1 }}>{tw}</div>
            <div style={{ fontSize: 9, color: C.muted, marginTop: 8, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 500 }}>grams water</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24 }}>
          {pills.map((t, i) => (
            <span key={i} style={{ fontSize: 11, color: mc.main, background: "rgba(255,255,255,.6)", padding: "5px 14px", borderRadius: 20, fontWeight: 500 }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from "react"
import { C, MC } from "../lib/theme"
import { MI, TmI, XI, CkI } from "./icons"
import { fmt } from "../lib/format"
import type { Recipe } from "../lib/data"

export interface TimerScreenProps {
  activeRecipe: Recipe | null
  setActiveRecipe: (recipe: Recipe | null) => void
}

export function TimerScreen({ activeRecipe, setActiveRecipe }: TimerScreenProps) {
  const r = activeRecipe
  const [st, setSt] = useState(0)
  const [el, setEl] = useState(0)
  const [run, setRun] = useState(false)
  const [tEl, setTEl] = useState(0)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (run) {
      ref.current = setInterval(() => {
        setEl((e) => e + 1)
        setTEl((t) => t + 1)
      }, 1000)
    } else if (ref.current) {
      clearInterval(ref.current)
    }
    return () => {
      if (ref.current) clearInterval(ref.current)
    }
  }, [run])

  if (!r) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 440, gap: 16, textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: 22, background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", color: C.faint }}>
          <TmI size={30} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, color: C.muted, marginTop: 4 }}>No active brew</div>
        <div style={{ fontSize: 13, color: C.faint, maxWidth: 240, lineHeight: 1.7 }}>Select a recipe to start.</div>
      </div>
    )
  }

  const mc = MC[r.method]
  const Ic = MI[r.method]
  const s = r.steps[st]
  const tt = r.steps.reduce((a, x) => a + x.time, 0)
  const prog = tt > 0 ? Math.min(tEl / tt, 1) : 0
  const sp = s ? Math.min(el / s.time, 1) : 0
  const rad = 78
  const circ = 2 * Math.PI * rad

  const next = () => {
    if (st < r.steps.length - 1) {
      setSt(st + 1)
      setEl(0)
    } else {
      setRun(false)
    }
  }

  const reset = () => {
    setRun(false)
    setSt(0)
    setEl(0)
    setTEl(0)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: mc.light, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic size={22} color={mc.main} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{r.name}</div>
            <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>
              {r.coffee}g · {r.water}g · {r.temp}°C
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            reset()
            setActiveRecipe(null)
          }}
          style={{ background: C.greenPale, border: "none", cursor: "pointer", padding: 8, borderRadius: 10, color: C.stone }}
        >
          <XI />
        </button>
      </div>
      <div style={{ height: 3, background: C.line, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", background: mc.main, borderRadius: 2, width: prog * 100 + "%", transition: "width .5s" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "8px 0" }}>
        <div style={{ position: "relative", width: 196, height: 196 }}>
          <svg width="196" height="196" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="98" cy="98" r={rad} fill="none" stroke={C.line} strokeWidth="3" />
            <circle
              cx="98" cy="98" r={rad} fill="none" stroke={mc.main} strokeWidth="3"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - sp)} strokeLinecap="round"
              style={{ transition: "stroke-dashoffset .5s" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 40, fontWeight: 300, fontFamily: "'DM Mono',monospace", color: C.text, letterSpacing: 2 }}>{fmt(el)}</div>
            <div style={{ fontSize: 10, color: C.faint, marginTop: 4 }}>of {fmt(s ? s.time : 0)}</div>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 9, color: C.faint, letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 500 }}>
            Step {st + 1} of {r.steps.length}
          </div>
          <div style={{ fontSize: 20, fontWeight: 500, color: C.text, marginTop: 8 }}>{s ? s.label : ""}</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>{s ? s.detail : ""}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={reset}
          style={{ flex: 1, padding: "14px 0", borderRadius: 14, border: "1.5px solid " + C.line, background: C.card, fontSize: 13, fontWeight: 500, cursor: "pointer", color: C.stone, fontFamily: "'Outfit',sans-serif" }}
        >
          Reset
        </button>
        <button
          onClick={() => setRun(!run)}
          style={{ flex: 2, padding: "14px 0", borderRadius: 14, border: "none", background: mc.main, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}
        >
          {run ? "Pause" : "Start"}
        </button>
        <button
          onClick={next}
          style={{
            flex: 1, padding: "14px 0", borderRadius: 14, border: "1.5px solid " + C.line, background: C.card, fontSize: 13, fontWeight: 500,
            cursor: "pointer", color: st >= r.steps.length - 1 ? C.line : C.text, fontFamily: "'Outfit',sans-serif",
            pointerEvents: st >= r.steps.length - 1 ? "none" : "auto",
          }}
        >
          Next
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {r.steps.map((x, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: i < r.steps.length - 1 ? "1px solid " + C.line : "none", opacity: i < st ? 0.3 : 1 }}
          >
            <div
              style={{
                width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 500, flexShrink: 0,
                background: i <= st ? mc.light : "transparent", color: i <= st ? mc.main : C.faint,
                border: i > st ? "1.5px solid " + C.line : "1.5px solid " + mc.light,
              }}
            >
              {i < st ? <CkI /> : i + 1}
            </div>
            <span style={{ flex: 1, fontSize: 13, fontWeight: i === st ? 500 : 400, color: i === st ? C.text : C.muted }}>{x.label}</span>
            <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: C.faint }}>{fmt(x.time)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

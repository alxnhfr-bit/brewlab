import { useEffect, useRef, useState } from "react"
import type { BrewMethodId } from "../../lib/types"
import { METHODS } from "../../lib/recipes"
import { haptics } from "../../lib/haptics"
import { Card } from "../../ui/primitives"
import { MethodGlyph } from "../../ui/icons"

/** Method accent pair, local to this screen. */
function accentFor(method: BrewMethodId): { accent: string; soft: string } {
  if (method === "v60") return { accent: "var(--bl-v60)", soft: "var(--bl-v60-soft)" }
  if (method === "aeropress") return { accent: "var(--bl-aero)", soft: "var(--bl-aero-soft)" }
  return { accent: "var(--bl-cold)", soft: "var(--bl-cold-soft)" }
}

/* Component-scoped keyframes for the pour scene. One calm 3.8s loop:
   kettle tips in, the stream scales down from the spout, drips land in
   the server, then the kettle eases back and the loop restarts. */
const SCENE_CSS = `
@keyframes tp-tilt {
  0%, 100% { transform: rotate(5deg); }
  13%, 74% { transform: rotate(0deg); }
  90% { transform: rotate(5deg); }
}
@keyframes tp-pour {
  0%, 13% { transform: scaleY(0); opacity: 0; }
  22%, 72% { transform: scaleY(1); opacity: 0.9; }
  82%, 100% { transform: scaleY(1); opacity: 0; }
}
@keyframes tp-shimmer {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -21; }
}
@keyframes tp-steam {
  0% { opacity: 0; transform: translateY(5px); }
  30% { opacity: 0.45; }
  65%, 100% { opacity: 0; transform: translateY(-7px); }
}
@keyframes tp-drip {
  0% { opacity: 0; transform: translateY(0); }
  15% { opacity: 1; }
  80% { opacity: 1; transform: translateY(20px); }
  100% { opacity: 0; transform: translateY(23px); }
}
.tp-kettle {
  animation: tp-tilt 3.8s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: 55% 45%;
}
.tp-pour-g {
  animation: tp-pour 3.8s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: 50% 0%;
}
.tp-shimmer { animation: tp-shimmer 1s linear infinite; }
.tp-steam { animation: tp-steam 3.8s ease-in-out infinite; opacity: 0; }
.tp-drip { animation: tp-drip 1.4s ease-in infinite; animation-delay: 1s; opacity: 0; }
`

/** Line-art pour scene: gooseneck kettle, stream, V60 on a glass server, steam. */
function PourScene() {
  return (
    <div style={{ color: "var(--bl-brand)", display: "flex", justifyContent: "center" }}>
      <svg
        viewBox="66 24 180 194"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ display: "block", width: "min(258px, 72vw)", height: "auto" }}
      >
        {/* steam wisps, staggered rise and fade */}
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none">
          <path className="tp-steam" style={{ animationDelay: ".4s" }} d="M96 152 Q92 144 96 136 Q100 128 96 120" />
          <path className="tp-steam" style={{ animationDelay: "1.6s" }} d="M166 154 Q162 146 166 138 Q170 130 166 122" />
          <path className="tp-steam" style={{ animationDelay: "2.6s" }} d="M84 136 Q80 128 84 120" />
        </g>

        {/* gooseneck kettle, tilted pose baked in, subtle tilt loop on top */}
        <g className="tp-kettle">
          <g
            transform="rotate(-18 204 78)"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            <ellipse cx="204" cy="58" rx="29" ry="4.5" />
            <path d="M175 58 L181 96 Q181.5 100 186 100 L222 100 Q226.5 100 227 96 L233 58" />
            <path d="M190 54 Q204 46.5 218 54" />
            <circle cx="204" cy="45.5" r="2.2" />
            <path d="M186 50 Q204 28 222 50" />
            <path d="M181 92 C160 90 151 83 149.5 74 C148 65 141 61.5 135 63.5 C132 64.8 130.8 67 129.6 70.4" />
          </g>
        </g>

        {/* pour stream, scales in from the spout with a faint moving shimmer */}
        <g className="tp-pour-g">
          <rect x="129.7" y="95" width="2.6" height="47" rx="1.3" fill="currentColor" />
          <line
            className="tp-shimmer"
            x1="131"
            y1="97"
            x2="131"
            y2="140"
            stroke="var(--bl-bg)"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeDasharray="1.5 9"
            opacity="0.55"
          />
        </g>

        {/* V60 cone */}
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <ellipse cx="131" cy="130" rx="26" ry="5" />
          <path d="M105 130 L124 158 L138 158 L157 130" />
          <path d="M121 163 L141 163" />
          <path d="M110 136 L126 154" opacity="0.3" />
          <path d="M152 136 L136 154" opacity="0.3" />
        </g>
        {/* coffee bed inside the cone (caramel accent) */}
        <path d="M114 141 Q131 147 148 141" stroke="var(--bl-caramel)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* the drop, caramel, falling into the server */}
        <circle className="tp-drip" cx="131" cy="167" r="1.7" fill="var(--bl-caramel)" />

        {/* glass server with handle */}
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M107 166 L103 196 Q102 205 111 206 L151 206 Q160 205 159 196 L155 166" />
          <path d="M107 166 Q131 172 155 166" />
          <path d="M156 172 Q168 174 164 186 Q161 193 154 192" />
        </g>
        {/* brewed coffee level (caramel accent) */}
        <path d="M105 190 Q131 194 157 190" stroke="var(--bl-caramel)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.9" />
      </svg>
    </div>
  )
}

/**
 * First run, "The Pour": one screen, one question, no tour.
 * Pour scene loops immediately, wordmark fades in at ~1.5s,
 * the method question at ~2.5s. A method tap scales the card,
 * fires a medium haptic, and hands the choice up after ~250ms.
 */
export function ThePour({ onDone }: { onDone: (method: BrewMethodId | null) => void }) {
  const [picked, setPicked] = useState<BrewMethodId | null>(null)
  const doneTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (doneTimer.current !== null) window.clearTimeout(doneTimer.current)
    }
  }, [])

  function pick(method: BrewMethodId) {
    if (picked !== null) return
    setPicked(method)
    haptics.medium()
    doneTimer.current = window.setTimeout(() => onDone(method), 250)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bl-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 24px calc(28px + env(safe-area-inset-bottom))",
      }}
    >
      <style>{SCENE_CSS}</style>

      <PourScene />

      <div style={{ textAlign: "center", marginTop: 8, animation: "bl-fade-in .7s ease 1.5s both" }}>
        <div
          style={{
            fontFamily: "var(--bl-font-display)",
            fontSize: 32,
            fontWeight: 700,
            color: "var(--bl-ink)",
            letterSpacing: "-0.01em",
          }}
        >
          BrewLab
        </div>
        <div style={{ fontSize: 15, color: "var(--bl-muted)", marginTop: 6 }}>Your coffee, step by step.</div>
      </div>

      <div style={{ width: "100%", marginTop: 36, animation: "bl-fade-in .7s ease 2.5s both" }}>
        <div
          style={{
            textAlign: "center",
            fontFamily: "var(--bl-font-display)",
            fontSize: 17,
            fontWeight: 600,
            color: "var(--bl-ink)",
            marginBottom: 16,
          }}
        >
          What do you brew with?
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {METHODS.map((m) => {
            const { accent, soft } = accentFor(m.id)
            const isPicked = picked === m.id
            return (
              <Card
                key={m.id}
                onClick={() => pick(m.id)}
                style={{
                  flex: 1,
                  background: soft,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  padding: "20px 8px 16px",
                  minHeight: 96,
                  transform: isPicked ? "scale(1.07)" : "scale(1)",
                  opacity: picked !== null && !isPicked ? 0.45 : 1,
                  transition: "transform .25s cubic-bezier(.2,.9,.3,1), opacity .25s ease",
                }}
              >
                <MethodGlyph method={m.id} size={32} color={accent} />
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--bl-ink)" }}>{m.short}</div>
              </Card>
            )
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
          <button
            onClick={() => onDone(null)}
            style={{
              background: "none",
              border: "none",
              color: "var(--bl-muted)",
              fontSize: 14,
              fontWeight: 500,
              minHeight: 44,
              padding: "0 18px",
              cursor: "pointer",
            }}
          >
            I'll look around
          </button>
        </div>
      </div>
    </div>
  )
}

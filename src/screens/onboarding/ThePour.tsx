import { useEffect, useRef, useState } from "react"
import type { BrewMethodId } from "../../lib/types"
import { METHODS } from "../../lib/recipes"
import { haptics } from "../../lib/haptics"
import { APP_TAGLINE, WORDMARK_BOTTOM, WORDMARK_TOP } from "../../lib/brand"
import { DISPLAY, Label } from "../../ui/primitives"
import { Burst, MethodSticker } from "../../ui/icons"

const WORD_TOP = WORDMARK_TOP
const WORD_BOTTOM = WORDMARK_BOTTOM

/**
 * First run, "The Pour": one screen, one question, no tour.
 * The burst rotates behind a still wordmark; a method tap scales the card,
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
        background: "var(--p-bg)",
        color: "var(--p-ink)",
        padding: "62px 0 0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        {/* Burst spins on its own layer so the wordmark stays put at -8deg. */}
        <div
          style={{
            position: "relative",
            width: 240,
            height: 240,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Burst
            size={240}
            style={{ position: "absolute", inset: 0, animation: "spin 40s linear infinite" }}
          />
          <div
            style={{
              position: "relative",
              fontFamily: DISPLAY,
              fontSize: 32,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              color: "var(--p-accent-ink)",
              transform: "rotate(-8deg)",
            }}
          >
            {WORD_TOP}
            <br />
            {WORD_BOTTOM}
          </div>
        </div>

        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 20,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            marginTop: 28,
          }}
        >
          {APP_TAGLINE}
        </div>

        <Label style={{ marginTop: 40 }}>What do you brew with?</Label>

        <div style={{ display: "flex", gap: 10, marginTop: 14, width: "100%" }}>
          {METHODS.map((m) => {
            const isPicked = picked === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => pick(m.id)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: "2px solid var(--p-ink)",
                  borderRadius: 22,
                  background: "transparent",
                  color: "var(--p-ink)",
                  padding: "18px 8px 14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  transform: isPicked ? "scale(1.07)" : "scale(1)",
                  opacity: picked !== null && !isPicked ? 0.45 : 1,
                  transition: "transform .25s cubic-bezier(.2,.9,.3,1), opacity .25s ease",
                }}
              >
                <MethodSticker method={m.id} size={36} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.short}
                </span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          className="p-row"
          onClick={() => onDone(null)}
          style={{
            marginTop: 26,
            border: "none",
            background: "transparent",
            padding: 0,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "var(--p-muted)",
            textDecoration: "underline",
            textUnderlineOffset: 4,
          }}
        >
          I'll look around
        </button>
      </div>
    </div>
  )
}

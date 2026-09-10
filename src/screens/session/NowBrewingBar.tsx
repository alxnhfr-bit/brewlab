import { useEffect } from "react"
import { useBrewLab } from "../../lib/store"
import { stepRemainingMs } from "../../lib/session"
import { fmt } from "../../lib/format"
import { useNow } from "../../lib/useNow"
import { haptics } from "../../lib/haptics"
import type { SessionStep } from "../../lib/types"
import { DISPLAY } from "../../ui/primitives"
import { Burst } from "../../ui/icons"

/**
 * Now Brewing: the accent pill that floats above the tab bar while a running
 * or paused session is minimized. One tap anywhere restores the session.
 * It is the only surface mounted while minimized, so it also carries the
 * wall-clock step advance that the session overlay runs when it is open.
 */
export function NowBrewingBar() {
  const session = useBrewLab((s) => s.session)
  const setMinimized = useBrewLab((s) => s.setMinimized)
  const advanceStep = useBrewLab((s) => s.advanceStep)

  const visible =
    session !== null && session.minimized && (session.phase === "running" || session.phase === "paused")
  const running = visible && session !== null && session.phase === "running"
  const now = useNow(running, 200)
  const remainingMs = session !== null && visible ? stepRemainingMs(session, now) : 0
  const stepEndsAt = session?.stepEndsAt ?? null

  useEffect(() => {
    if (running && stepEndsAt !== null && remainingMs <= 0) {
      advanceStep()
      haptics.stepTick()
    }
  }, [running, stepEndsAt, remainingMs, advanceStep])

  if (!visible || !session) return null

  const plan = session.plan
  const step: SessionStep | undefined = plan.steps[session.stepIndex]
  const paused = session.phase === "paused"

  return (
    <button
      className="p-press"
      onClick={() => {
        setMinimized(false)
        haptics.light()
      }}
      style={{
        position: "fixed",
        bottom: "calc(88px + env(safe-area-inset-bottom))",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 24px)",
        maxWidth: 416,
        zIndex: 150,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 18px 10px 10px",
        border: "none",
        borderRadius: 999,
        background: "var(--p-accent)",
        color: "var(--p-accent-ink)",
        boxShadow: "0 12px 28px rgba(0,0,0,.18)",
        textAlign: "left",
      }}
    >
      <Burst size={36} color="var(--p-accent-ink)" />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontFamily: DISPLAY,
            fontSize: 13,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {plan.recipeName}
        </span>
        {step && (
          <span
            style={{
              display: "block",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginTop: 2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {step.label}
            {step.waterTargetG !== undefined && ` · to ${step.waterTargetG} g`}
            {paused && " · paused"}
          </span>
        )}
      </span>
      <span
        style={{
          flexShrink: 0,
          fontFamily: DISPLAY,
          fontSize: 18,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {fmt(Math.ceil(remainingMs / 1000))}
      </span>
    </button>
  )
}

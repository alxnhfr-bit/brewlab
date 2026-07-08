import { useBrewLab } from "../../lib/store"
import { stepRemainingMs } from "../../lib/session"
import { fmt } from "../../lib/format"
import { useNow } from "../../lib/useNow"
import { haptics } from "../../lib/haptics"
import type { SessionStep } from "../../lib/types"
import { Mono } from "../../ui/primitives"
import { MethodGlyph } from "../../ui/icons"
import { accentFor } from "./accent"

/**
 * Docked mini-bar above the tab bar while a running or paused session is
 * minimized. One tap anywhere returns to the session.
 */
export function NowBrewingBar() {
  const session = useBrewLab((s) => s.session)
  const setMinimized = useBrewLab((s) => s.setMinimized)
  const visible =
    session !== null && session.minimized && (session.phase === "running" || session.phase === "paused")
  const now = useNow(visible && session !== null && session.phase === "running", 200)
  if (!visible || !session) return null

  const plan = session.plan
  const accent = accentFor(plan.method)
  const step: SessionStep | undefined = plan.steps[session.stepIndex]
  const remainingSec = Math.ceil(stepRemainingMs(session, now) / 1000)

  return (
    <button
      onClick={() => {
        setMinimized(false)
        haptics.light()
      }}
      style={{
        position: "fixed",
        bottom: "calc(64px + env(safe-area-inset-bottom))",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 24px)",
        maxWidth: 396,
        zIndex: 250,
        display: "flex",
        alignItems: "center",
        gap: 12,
        minHeight: 56,
        padding: "10px 16px 10px 13px",
        background: "var(--bl-card)",
        border: "1px solid var(--bl-line)",
        borderLeft: `3px solid ${accent.main}`,
        borderRadius: "var(--bl-radius)",
        boxShadow: "var(--bl-shadow-float)",
        cursor: "pointer",
        textAlign: "left",
        animation: "bl-sheet-up .22s cubic-bezier(.2,.9,.3,1)",
      }}
    >
      <span style={{ display: "inline-flex", flexShrink: 0, color: accent.main }}>
        <MethodGlyph method={plan.method} size={24} />
      </span>
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--bl-ink)",
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
              fontSize: 12,
              color: "var(--bl-muted)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {step.label}
          </span>
        )}
      </span>
      {session.phase === "paused" ? (
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--bl-muted)", flexShrink: 0 }}>Paused</span>
      ) : (
        <Mono style={{ fontSize: 15, fontWeight: 500, color: "var(--bl-ink)", flexShrink: 0 }}>
          {fmt(remainingSec)}
        </Mono>
      )}
    </button>
  )
}

import { useCallback, useEffect, useRef, useState } from "react"
import { useBrewLab } from "../../lib/store"
import { getReadyRemainingMs, overallProgress, stepRemainingMs } from "../../lib/session"
import { coachFor, TASTE_OPTIONS, toggleTaste } from "../../lib/coaching"
import { fmt } from "../../lib/format"
import { useNow } from "../../lib/useNow"
import { haptics } from "../../lib/haptics"
import { maybeAskForReview } from "../../lib/review"
import type { ActiveSession, SessionStep, TasteTag } from "../../lib/types"
import { Chip, DISPLAY, Label, OutlinePill, PrimaryPill, RoundBtn } from "../../ui/primitives"
import { Burst, CaretDown, CaretUp, Check, RatingBurst, SkipBack, SkipForward, X } from "../../ui/icons"
import { WedgeRing } from "./WedgeRing"

/**
 * Full-screen brew session. Renders Get ready, the running session or Brew
 * complete depending on session.phase. Every timing value is derived from the
 * session timestamps through src/lib/session.ts; useNow only forces re-renders.
 */
export function SessionOverlay() {
  const session = useBrewLab((s) => s.session)
  if (!session || session.minimized) return null
  const running = session.phase === "running" || session.phase === "paused"
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 440,
        zIndex: 400,
        background: "var(--p-bg)",
        color: "var(--p-ink)",
        overflowY: running ? "hidden" : "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {session.phase === "getready" && <GetReadyView session={session} />}
      {running && <RunningView session={session} />}
      {session.phase === "complete" && <CompleteView session={session} />}
    </div>
  )
}

/** The cumulative water poured by the end of a step, carried forward. */
function runningWaterG(steps: SessionStep[], index: number): number {
  for (let i = Math.min(index, steps.length - 1); i >= 0; i--) {
    const target = steps[i].waterTargetG
    if (target !== undefined) return target
  }
  return 0
}

/* ------------------------------------------------------------------ */
/* Get ready                                                           */
/* ------------------------------------------------------------------ */

function GetReadyView({ session }: { session: ActiveSession }) {
  const beginBrewing = useBrewLab((s) => s.beginBrewing)
  const abandonSession = useBrewLab((s) => s.abandonSession)
  const now = useNow(true, 200)
  const [open, setOpen] = useState(false)
  const firedRef = useRef(false)

  const remaining = getReadyRemainingMs(session, now)
  const count = Math.max(1, Math.ceil(remaining / 1000))
  const plan = session.plan
  const first: SessionStep | undefined = plan.steps[0]

  useEffect(() => {
    if (remaining <= 0 && !firedRef.current) {
      firedRef.current = true
      beginBrewing()
      haptics.medium()
    }
  }, [remaining, beginBrewing])

  return (
    <div style={{ minHeight: "100%", padding: "62px 0 0", display: "flex", flexDirection: "column" }}>
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
        <div
          style={{
            position: "relative",
            width: 280,
            height: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Burst
            size={280}
            style={{ position: "absolute", inset: 0, animation: "spin 30s linear infinite" }}
          />
          <div
            style={{
              position: "relative",
              fontFamily: DISPLAY,
              fontSize: 176,
              lineHeight: 1,
              letterSpacing: "-0.06em",
              color: "var(--p-accent-ink)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {count}
          </div>
        </div>

        <Label style={{ marginTop: 32 }}>First</Label>
        {first && (
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 24,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              marginTop: 6,
            }}
          >
            {first.label}
            {first.waterTargetG !== undefined && ` · pour to ${first.waterTargetG} g`}
          </div>
        )}

        <OutlinePill
          minHeight={0}
          onClick={() => {
            setOpen((v) => !v)
            haptics.selection()
          }}
          style={{
            marginTop: 22,
            padding: "12px 18px",
            fontSize: 12,
            letterSpacing: ".1em",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Get ready
          {open ? <CaretUp size={14} /> : <CaretDown size={14} />}
        </OutlinePill>

        {open && (
          <div style={{ width: "100%", marginTop: 18, borderTop: "2px solid var(--p-ink)" }}>
            {plan.steps.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  minHeight: 42,
                  borderBottom: "2px solid var(--p-ink)",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    textAlign: "left",
                  }}
                >
                  {s.label}
                </span>
                <span style={{ fontFamily: DISPLAY, fontSize: 14, fontVariantNumeric: "tabular-nums" }}>
                  {fmt(s.seconds)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="p-press"
        onClick={abandonSession}
        style={{
          padding: "0 20px 40px",
          background: "none",
          border: "none",
          textAlign: "center",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "var(--p-muted)",
        }}
      >
        Cancel
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Running / paused                                                    */
/* ------------------------------------------------------------------ */

function RunningView({ session }: { session: ActiveSession }) {
  const pauseSession = useBrewLab((s) => s.pauseSession)
  const resumeSession = useBrewLab((s) => s.resumeSession)
  const scrubToStep = useBrewLab((s) => s.scrubToStep)
  const advanceStep = useBrewLab((s) => s.advanceStep)
  const setMinimized = useBrewLab((s) => s.setMinimized)
  const abandonSession = useBrewLab((s) => s.abandonSession)

  const paused = session.phase === "paused"
  const now = useNow(!paused, 200)

  const plan = session.plan
  const step: SessionStep | undefined = plan.steps[session.stepIndex]
  const next: SessionStep | undefined = plan.steps[session.stepIndex + 1]
  const remainingMs = stepRemainingMs(session, now)
  const overall = overallProgress(session, now)
  const canBack = session.stepIndex > 0
  const canForward = session.stepIndex < plan.steps.length - 1

  useEffect(() => {
    if (session.phase === "running" && session.stepEndsAt !== null && remainingMs <= 0) {
      advanceStep()
      haptics.stepTick()
    }
  }, [session.phase, session.stepEndsAt, remainingMs, advanceStep])

  if (!step) return null

  const pourTarget = step.waterTargetG ?? runningWaterG(plan.steps, session.stepIndex)
  const isPour = step.waterTargetG !== undefined

  return (
    <div
      style={{
        height: "100%",
        padding: "58px 20px 36px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: ".12em",
        }}
      >
        <SessionHeader
          recipeName={plan.recipeName}
          stepLabel={`${session.stepIndex + 1} / ${plan.steps.length}`}
          onMinimize={() => setMinimized(true)}
          onEnd={abandonSession}
        />
      </div>

      <div style={{ display: "flex", gap: 4, marginTop: 16 }}>
        {plan.steps.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 8,
              borderRadius: 999,
              background:
                i === session.stepIndex
                  ? "var(--p-accent)"
                  : i < session.stepIndex
                    ? "var(--p-muted)"
                    : "var(--p-track)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Label>Pour to</Label>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 104,
              lineHeight: 0.9,
              letterSpacing: "-0.05em",
              color: isPour ? "var(--p-num)" : "var(--p-muted)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {pourTarget}
            <span style={{ fontSize: 40, color: "var(--p-ink)", letterSpacing: 0 }}>G</span>
          </div>
        </div>

        <div style={{ marginTop: 4 }}>
          <WedgeRing progress={overall} blink={!paused}>
            <div
              style={{
                fontFamily: DISPLAY,
                fontSize: 40,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {fmt(Math.ceil(remainingMs / 1000))}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".12em",
                color: "var(--p-muted)",
                marginTop: 6,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              OF {fmt(step.seconds)}
            </div>
          </WedgeRing>
        </div>

        <div style={{ textAlign: "center", marginTop: 6 }}>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 24,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            {step.label}
          </div>
          <div style={{ fontSize: 15, color: "var(--p-muted)", marginTop: 4 }}>{step.detail}</div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "var(--p-faint)",
              marginTop: 10,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {next ? `Next: ${next.label} · ${fmt(next.seconds)}` : "Last step"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <RoundBtn
          size={64}
          label="Previous step"
          onClick={canBack ? () => scrubToStep(session.stepIndex - 1) : undefined}
          style={{ opacity: canBack ? 1 : 0.35 }}
        >
          <SkipBack size={20} />
        </RoundBtn>
        <PrimaryPill
          fontSize={18}
          onClick={() => {
            if (paused) resumeSession()
            else pauseSession()
            haptics.light()
          }}
          style={{ flex: 1, width: "auto", textTransform: "uppercase" }}
        >
          {paused ? "Resume" : "Pause"}
        </PrimaryPill>
        <RoundBtn
          size={64}
          label="Next step"
          onClick={canForward ? () => scrubToStep(session.stepIndex + 1) : undefined}
          style={{ opacity: canForward ? 1 : 0.35 }}
        >
          <SkipForward size={20} />
        </RoundBtn>
      </div>
    </div>
  )
}

/**
 * Session header. At rest it is the designed row: close, recipe name, step
 * count. Tapping close swaps the row for an explicit choice between leaving
 * the brew running in the mini-bar and ending it, because ending a brew is
 * destructive and used to be reachable only by an invisible long press.
 * The prompt reverts on its own after a few seconds.
 */
const PROMPT_TIMEOUT_MS = 5000

function SessionHeader({
  recipeName,
  stepLabel,
  onMinimize,
  onEnd,
}: {
  recipeName: string
  stepLabel: string
  onMinimize: () => void
  onEnd: () => void
}) {
  const [prompt, setPrompt] = useState(false)
  const timerRef = useRef<number | null>(null)

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => clear, [clear])

  const openPrompt = () => {
    setPrompt(true)
    haptics.light()
    clear()
    timerRef.current = window.setTimeout(() => setPrompt(false), PROMPT_TIMEOUT_MS)
  }

  const closePrompt = () => {
    clear()
    setPrompt(false)
  }

  return (
    <>
      <button
        className="p-press"
        aria-label={prompt ? "Keep brewing" : "Close the brew session"}
        onClick={prompt ? closePrompt : openPrompt}
        style={{
          width: 28,
          height: 28,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: -4,
          padding: 0,
          border: "none",
          background: "none",
          color: "var(--p-ink)",
        }}
      >
        <X size={18} />
      </button>

      {prompt ? (
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
          <button
            className="p-press p-outline"
            onClick={() => {
              clear()
              onMinimize()
            }}
            style={{
              minHeight: 34,
              padding: "0 14px",
              border: "2px solid var(--p-ink)",
              borderRadius: 999,
              background: "transparent",
              color: "var(--p-ink)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Keep brewing
          </button>
          <button
            className="p-press"
            onClick={() => {
              clear()
              haptics.medium()
              onEnd()
            }}
            style={{
              minHeight: 34,
              padding: "0 14px",
              border: "2px solid var(--p-accent)",
              borderRadius: 999,
              background: "var(--p-accent)",
              color: "var(--p-accent-ink)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            End brew
          </button>
        </div>
      ) : (
        <>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              textAlign: "center",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {recipeName}
          </span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{stepLabel}</span>
        </>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Brew complete                                                       */
/* ------------------------------------------------------------------ */

function CompleteView({ session }: { session: ActiveSession }) {
  const finalizeSession = useBrewLab((s) => s.finalizeSession)
  const [durationSec] = useState(() =>
    Math.round(((session.completedAt ?? Date.now()) - session.startedAt) / 1000)
  )
  const [rating, setRating] = useState(0)
  const [tastes, setTastes] = useState<TasteTag[]>([])
  const [saveTweak, setSaveTweak] = useState(true)
  const successRef = useRef(false)

  useEffect(() => {
    if (successRef.current) return
    successRef.current = true
    haptics.success()
  }, [])

  const coaching = coachFor(tastes, session.plan.method)

  return (
    <div style={{ minHeight: "100%", padding: "62px 0 0", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 20px" }}>
        <div
          style={{
            margin: "auto 0",
            border: "2px solid var(--p-ink)",
            borderRadius: 28,
            padding: "22px 20px",
            position: "relative",
            overflow: "hidden",
            animation: "p-card-in .35s ease-out",
          }}
        >
          <Burst
            size={84}
            style={{ position: "absolute", top: 12, right: 12, transform: "rotate(12deg)" }}
          >
            <span
              style={{
                fontFamily: DISPLAY,
                fontSize: 15,
                color: "var(--p-accent-ink)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {fmt(durationSec)}
            </span>
          </Burst>

          <Label>Nice pour</Label>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 36,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              marginTop: 8,
              maxWidth: 220,
            }}
          >
            Brew complete
          </div>

          <Label style={{ marginTop: 24 }}>Rate it</Label>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className="p-press"
                aria-label={`Rate ${n} of 5`}
                onClick={() => {
                  setRating((r) => (r === n ? 0 : n))
                  haptics.selection()
                }}
                style={{ padding: 0, border: "none", background: "none", lineHeight: 0 }}
              >
                <RatingBurst filled={n <= rating} size={30} />
              </button>
            ))}
          </div>

          <Label style={{ marginTop: 22 }}>How did it taste</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {TASTE_OPTIONS.map((o) => (
              <Chip
                key={o.tag}
                selected={tastes.includes(o.tag)}
                onClick={() => {
                  setTastes((t) => toggleTaste(t, o.tag))
                  haptics.selection()
                }}
              >
                {o.label}
              </Chip>
            ))}
          </div>

          {coaching && (
            <div
              style={{
                marginTop: 20,
                background: "var(--p-accent)",
                color: "var(--p-accent-ink)",
                borderRadius: 22,
                padding: 16,
              }}
            >
              {coaching.suggestions.map((line, i) => (
                <div
                  key={i}
                  style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.45, marginTop: i === 0 ? 0 : 10 }}
                >
                  {line}
                </div>
              ))}
              <button
                className="p-press"
                onClick={() => {
                  setSaveTweak((v) => !v)
                  haptics.selection()
                }}
                style={{
                  width: "100%",
                  marginTop: 12,
                  padding: 0,
                  border: "none",
                  background: "none",
                  color: "var(--p-accent-ink)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                }}
              >
                Save for next brew
                <span
                  style={{
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    borderRadius: 999,
                    background: saveTweak ? "var(--p-accent-ink)" : "transparent",
                    border: saveTweak ? "none" : "2px solid var(--p-accent-ink)",
                    color: "var(--p-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {saveTweak && <Check size={14} />}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "0 20px 36px" }}>
        <PrimaryPill
          minHeight={60}
          fontSize={18}
          style={{ textTransform: "uppercase" }}
          onClick={() => {
            const given = rating > 0 ? rating : undefined
            finalizeSession({
              rating: given,
              tastes: tastes.length > 0 ? tastes : undefined,
              saveTweak: coaching ? saveTweak : undefined,
            })
            // After the entry is written, so the brew counts toward the total.
            maybeAskForReview(given)
          }}
        >
          Done
        </PrimaryPill>
      </div>
    </div>
  )
}

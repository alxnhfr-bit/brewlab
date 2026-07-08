import { useEffect, useRef, useState, type ReactNode } from "react"
import { useBrewLab } from "../../lib/store"
import {
  getReadyRemainingMs,
  overallProgress,
  stepProgress,
  stepRemainingMs,
} from "../../lib/session"
import { coachFor, TASTE_OPTIONS } from "../../lib/coaching"
import { fmt } from "../../lib/format"
import { useNow } from "../../lib/useNow"
import { haptics } from "../../lib/haptics"
import type { ActiveSession, SessionStep, TasteTag } from "../../lib/types"
import { Card, Chip, Mono, PrimaryButton, SectionLabel } from "../../ui/primitives"
import { BeanGlyph, CaretDown, CaretUp, Check, Pause, Play, SkipBack, SkipForward, X } from "../../ui/icons"
import { accentFor } from "./accent"

/**
 * Full-screen brew session modal. Renders Get Ready, the running session,
 * or Brew Complete depending on session.phase. All time state derives from
 * session timestamps via src/lib/session.ts helpers; useNow only re-renders.
 */
export function SessionOverlay() {
  const session = useBrewLab((s) => s.session)
  if (!session || session.minimized) return null
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 400,
        background: "var(--bl-bg)",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        animation: "bl-fade-in .2s ease",
      }}
    >
      {session.phase === "getready" && <GetReadyView session={session} />}
      {(session.phase === "running" || session.phase === "paused") && <RunningView session={session} />}
      {session.phase === "complete" && <CompleteView session={session} />}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Get Ready pre-roll                                                  */
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
  const step1: SessionStep | undefined = plan.steps[0]

  useEffect(() => {
    if (remaining <= 0 && !firedRef.current) {
      firedRef.current = true
      beginBrewing()
      haptics.medium()
    }
  }, [remaining, beginBrewing])

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "calc(env(safe-area-inset-top) + 24px) 24px calc(24px + env(safe-area-inset-bottom))",
      }}
    >
      <div style={{ flex: 1 }} />

      <Mono style={{ fontSize: 64, fontWeight: 500, color: "var(--bl-ink)", lineHeight: 1 }}>{count}</Mono>

      {step1 && (
        <div style={{ marginTop: 20, fontSize: 15, color: "var(--bl-muted)", textAlign: "center" }}>
          First: {step1.label}
          {step1.waterTargetG !== undefined && (
            <>
              , pour to <Mono style={{ color: "var(--bl-ink)", fontWeight: 500 }}>{step1.waterTargetG}g</Mono>
            </>
          )}
        </div>
      )}

      <Card style={{ marginTop: 28, width: "100%", padding: "0 16px" }}>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            width: "100%",
            minHeight: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--bl-muted)",
            fontSize: 14,
            fontWeight: 500,
            padding: 0,
          }}
        >
          Get ready
          {open ? <CaretUp size={16} /> : <CaretDown size={16} />}
        </button>
        {open && (
          <div style={{ paddingBottom: 14, animation: "bl-fade-in .2s ease" }}>
            <ChecklistRow>Rinse the filter</ChecklistRow>
            <ChecklistRow>
              {plan.tempC !== null ? (
                <>
                  Water at <Mono style={{ fontWeight: 500 }}>{plan.tempC}C</Mono>
                </>
              ) : (
                "Cold water ready"
              )}
            </ChecklistRow>
            <ChecklistRow>
              <Mono style={{ fontWeight: 500 }}>{plan.doseG}g</Mono>&nbsp;dosed and ground
            </ChecklistRow>
          </div>
        )}
      </Card>

      <div style={{ flex: 1 }} />

      <button
        onClick={abandonSession}
        style={{
          minHeight: 44,
          padding: "0 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--bl-muted)",
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        Cancel
      </button>
    </div>
  )
}

function ChecklistRow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "7px 0",
        fontSize: 14,
        color: "var(--bl-ink)",
      }}
    >
      <span style={{ display: "inline-flex", color: "var(--bl-faint)" }}>
        <Check size={15} />
      </span>
      <span>{children}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Running / paused session                                            */
/* ------------------------------------------------------------------ */

const RING_R = 88
const RING_SIZE = 192
const RING_C = 2 * Math.PI * RING_R

function RunningView({ session }: { session: ActiveSession }) {
  const pauseSession = useBrewLab((s) => s.pauseSession)
  const resumeSession = useBrewLab((s) => s.resumeSession)
  const scrubToStep = useBrewLab((s) => s.scrubToStep)
  const advanceStep = useBrewLab((s) => s.advanceStep)
  const setMinimized = useBrewLab((s) => s.setMinimized)
  const abandonSession = useBrewLab((s) => s.abandonSession)

  const paused = session.phase === "paused"
  const now = useNow(!paused, 200)
  const [confirmEnd, setConfirmEnd] = useState(false)

  const plan = session.plan
  const accent = accentFor(plan.method)
  const step: SessionStep | undefined = plan.steps[session.stepIndex]
  const next: SessionStep | undefined = plan.steps[session.stepIndex + 1]
  const remainingMs = stepRemainingMs(session, now)
  const remainingSec = Math.ceil(remainingMs / 1000)
  const prog = stepProgress(session, now)
  const overall = overallProgress(session, now)
  const canBack = session.stepIndex > 0
  const canForward = session.stepIndex < plan.steps.length - 1

  useEffect(() => {
    if (session.phase === "running" && session.stepEndsAt !== null && remainingMs <= 0) {
      advanceStep()
      haptics.stepTick()
    }
  }, [session.phase, session.stepEndsAt, remainingMs, advanceStep])

  useEffect(() => {
    if (!confirmEnd) return
    const t = setTimeout(() => setConfirmEnd(false), 3000)
    return () => clearTimeout(t)
  }, [confirmEnd])

  if (!step) return null

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "calc(env(safe-area-inset-top) + 10px) 20px calc(24px + env(safe-area-inset-bottom))",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <IconButton onClick={() => setMinimized(true)} label="Minimize">
          <CaretDown size={22} />
        </IconButton>
        <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--bl-font-display)",
              fontSize: 17,
              fontWeight: 600,
              color: "var(--bl-ink)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {plan.recipeName}
          </div>
          <Mono style={{ fontSize: 12, color: "var(--bl-muted)" }}>
            {plan.doseG}g : {plan.waterG}g{plan.tempC !== null ? ` · ${plan.tempC}C` : ""}
          </Mono>
        </div>
        {confirmEnd ? (
          <button
            onClick={abandonSession}
            style={{
              minHeight: 44,
              padding: "0 14px",
              borderRadius: 999,
              border: "1.5px solid var(--bl-danger)",
              background: "var(--bl-card)",
              color: "var(--bl-danger)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              animation: "bl-fade-in .15s ease",
            }}
          >
            End brew?
          </button>
        ) : (
          <IconButton onClick={() => setConfirmEnd(true)} label="End brew">
            <X size={22} />
          </IconButton>
        )}
      </div>

      {/* Overall progress hairline */}
      <div style={{ height: 3, borderRadius: 2, background: "var(--bl-line)", marginTop: 10, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${overall * 100}%`,
            background: accent.main,
            borderRadius: 2,
            transition: "width .2s linear",
          }}
        />
      </div>

      {/* Center: pour target + ring + labels */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          padding: "18px 0",
        }}
      >
        {step.waterTargetG !== undefined ? (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--bl-muted)",
                marginBottom: 2,
              }}
            >
              Pour to
            </div>
            <Mono style={{ fontSize: 84, fontWeight: 500, color: accent.main, lineHeight: 1 }}>
              {step.waterTargetG}
              <span style={{ fontSize: 40 }}>g</span>
            </Mono>
          </div>
        ) : (
          <div
            style={{
              fontFamily: "var(--bl-font-display)",
              fontSize: 28,
              fontWeight: 600,
              color: "var(--bl-ink)",
              textAlign: "center",
            }}
          >
            {step.label}
          </div>
        )}

        {/* Step ring */}
        <div style={{ position: "relative", width: RING_SIZE, height: RING_SIZE }}>
          <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_R}
              fill="none"
              stroke="var(--bl-line)"
              strokeWidth={4}
            />
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_R}
              fill="none"
              stroke={accent.main}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - prog)}
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
              style={{ transition: "stroke-dashoffset .2s linear" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Mono style={{ fontSize: 36, fontWeight: 500, color: "var(--bl-ink)", lineHeight: 1.1 }}>
              {fmt(remainingSec)}
            </Mono>
            <div style={{ fontSize: 13, color: "var(--bl-muted)", marginTop: 2 }}>
              of <Mono>{fmt(step.seconds)}</Mono>
            </div>
          </div>
        </div>

        {/* Step label + detail + next preview */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--bl-ink)" }}>{step.label}</div>
          <div style={{ fontSize: 14, color: "var(--bl-muted)", marginTop: 3 }}>{step.detail}</div>
          <div style={{ fontSize: 13, color: "var(--bl-faint)", marginTop: 10 }}>
            {next ? (
              <>
                Next: {next.label}
                {next.waterTargetG !== undefined && (
                  <>
                    {" "}
                    to <Mono>{next.waterTargetG}g</Mono>
                  </>
                )}
              </>
            ) : (
              "Last step"
            )}
          </div>
        </div>
      </div>

      {/* Controls row (thumb zone) */}
      <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
        <ScrubButton enabled={canBack} onPress={() => scrubToStep(session.stepIndex - 1)} label="Previous step">
          <SkipBack size={22} />
        </ScrubButton>
        <PrimaryButton
          color={accent.main}
          onClick={() => {
            if (paused) resumeSession()
            else pauseSession()
            haptics.light()
          }}
          style={{ flex: 2, width: "auto", minHeight: 56 }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {paused ? <Play size={18} weight="fill" /> : <Pause size={18} weight="fill" />}
            {paused ? "Resume" : "Pause"}
          </span>
        </PrimaryButton>
        <ScrubButton enabled={canForward} onPress={() => scrubToStep(session.stepIndex + 1)} label="Next step">
          <SkipForward size={22} />
        </ScrubButton>
      </div>

      {/* Compact step list */}
      <div style={{ marginTop: 20 }}>
        {plan.steps.map((s, i) => {
          const done = i < session.stepIndex
          const current = i === session.stepIndex
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                minHeight: 44,
                padding: "2px 0",
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  flexShrink: 0,
                  borderRadius: 999,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: done ? accent.soft : "transparent",
                  border: done
                    ? "1px solid transparent"
                    : current
                      ? `1.5px solid ${accent.main}`
                      : "1px solid var(--bl-line)",
                  color: done || current ? accent.main : "var(--bl-faint)",
                }}
              >
                {done ? <Check size={14} /> : <Mono style={{ fontSize: 12 }}>{i + 1}</Mono>}
              </span>
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: 14,
                  fontWeight: current ? 600 : 400,
                  color: current ? "var(--bl-ink)" : "var(--bl-muted)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {s.label}
              </span>
              {s.waterTargetG !== undefined && (
                <Mono style={{ fontSize: 12, color: "var(--bl-faint)" }}>{s.waterTargetG}g</Mono>
              )}
              <Mono style={{ fontSize: 13, color: "var(--bl-muted)", minWidth: 42, textAlign: "right" }}>
                {fmt(s.seconds)}
              </Mono>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function IconButton({
  children,
  onClick,
  label,
}: {
  children: ReactNode
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: 44,
        height: 44,
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--bl-muted)",
        borderRadius: "var(--bl-radius-sm)",
      }}
    >
      {children}
    </button>
  )
}

function ScrubButton({
  children,
  enabled,
  onPress,
  label,
}: {
  children: ReactNode
  enabled: boolean
  onPress: () => void
  label: string
}) {
  return (
    <button
      onClick={enabled ? onPress : undefined}
      aria-label={label}
      aria-disabled={!enabled}
      style={{
        width: 56,
        minHeight: 56,
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--bl-radius)",
        border: "1.5px solid var(--bl-line)",
        background: "var(--bl-card)",
        color: enabled ? "var(--bl-muted)" : "var(--bl-faint)",
        cursor: enabled ? "pointer" : "default",
        transition: "color .18s",
      }}
    >
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Brew Complete                                                       */
/* ------------------------------------------------------------------ */

function CompleteView({ session }: { session: ActiveSession }) {
  const finalizeSession = useBrewLab((s) => s.finalizeSession)
  const [durationSec] = useState(() => Math.round((Date.now() - session.startedAt) / 1000))
  const [rating, setRating] = useState(0)
  const [taste, setTaste] = useState<TasteTag | null>(null)
  const [saveTweak, setSaveTweak] = useState(true)
  const successRef = useRef(false)

  useEffect(() => {
    if (successRef.current) return
    successRef.current = true
    haptics.success()
  }, [])

  const coaching = taste && taste !== "just-right" ? coachFor(taste, session.plan.method) : null

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "calc(env(safe-area-inset-top) + 24px) 20px calc(24px + env(safe-area-inset-bottom))",
      }}
    >
      <div style={{ flex: 1 }} />

      <Card style={{ padding: 24, animation: "bl-pop .35s cubic-bezier(.2,.9,.3,1) both" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--bl-font-display)", fontSize: 24, fontWeight: 600, color: "var(--bl-ink)" }}>
            Brew complete
          </div>
          <Mono style={{ display: "block", fontSize: 15, color: "var(--bl-muted)", marginTop: 6 }}>
            {fmt(durationSec)}
          </Mono>
        </div>

        <SectionLabel style={{ marginTop: 24, marginBottom: 6, textAlign: "center" }}>Rate it</SectionLabel>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              aria-label={`Rate ${n} of 5`}
              onClick={() => {
                setRating((r) => (r === n ? 0 : n))
                haptics.selection()
              }}
              style={{
                width: 44,
                height: 44,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: n <= rating ? "var(--bl-caramel)" : "var(--bl-faint)",
                transition: "color .15s",
              }}
            >
              <BeanGlyph size={30} />
            </button>
          ))}
        </div>

        <SectionLabel style={{ marginTop: 18, marginBottom: 10, textAlign: "center" }}>How did it taste</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
          {TASTE_OPTIONS.map((o) => (
            <Chip
              key={o.tag}
              selected={taste === o.tag}
              color={o.tag === "just-right" ? "var(--bl-brand)" : "var(--bl-caramel)"}
              onClick={() => {
                setTaste((t) => (t === o.tag ? null : o.tag))
                haptics.selection()
              }}
            >
              {o.label}
            </Chip>
          ))}
        </div>

        {coaching && (
          <Card
            style={{
              marginTop: 18,
              padding: 16,
              background: "var(--bl-caramel-soft)",
              border: "1px solid transparent",
              boxShadow: "none",
              animation: "bl-fade-in .2s ease",
            }}
          >
            <div style={{ fontSize: 14, lineHeight: 1.5, color: "var(--bl-ink)" }}>{coaching.suggestion}</div>
            <button
              onClick={() => {
                setSaveTweak((v) => !v)
                haptics.selection()
              }}
              style={{
                marginTop: 12,
                width: "100%",
                minHeight: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "var(--bl-ink)",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Save for next brew
              <span
                style={{
                  width: 26,
                  height: 26,
                  flexShrink: 0,
                  borderRadius: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: saveTweak ? "var(--bl-caramel)" : "var(--bl-card)",
                  border: saveTweak ? "1.5px solid var(--bl-caramel)" : "1.5px solid var(--bl-line)",
                  color: "var(--bl-brand-ink)",
                  transition: "background .15s, border-color .15s",
                }}
              >
                {saveTweak && <Check size={15} weight="bold" />}
              </span>
            </button>
          </Card>
        )}
      </Card>

      <div style={{ flex: 1 }} />

      <PrimaryButton
        onClick={() =>
          finalizeSession({
            rating: rating > 0 ? rating : undefined,
            taste: taste ?? undefined,
            saveTweak: coaching ? saveTweak : undefined,
          })
        }
      >
        Done
      </PrimaryButton>
    </div>
  )
}

import type { ActiveSession, DoseMemory, Recipe, SessionPlan } from "./types"

/**
 * Build a session plan from a recipe, optionally scaled to a remembered or
 * dialed-in dose. Step times stay fixed; water targets scale proportionally.
 */
export function makePlan(recipe: Recipe, memory?: DoseMemory, tweakApplied?: string): SessionPlan {
  const doseG = memory?.doseG ?? recipe.doseG
  const waterG = memory?.waterG ?? recipe.waterG
  const tempC = memory !== undefined ? memory.tempC : recipe.tempC
  const factor = waterG / recipe.waterG
  return {
    recipeId: recipe.id,
    recipeName: recipe.name,
    method: recipe.method,
    doseG,
    waterG,
    tempC,
    tweakApplied,
    steps: recipe.steps.map((s) => ({
      label: s.label,
      detail: s.detail,
      seconds: s.seconds,
      why: s.why,
      waterTargetG: s.waterTargetG === undefined ? undefined : Math.round(s.waterTargetG * factor),
    })),
  }
}

export function totalSeconds(plan: SessionPlan): number {
  return plan.steps.reduce((a, s) => a + s.seconds, 0)
}

/** Milliseconds remaining in the current step, derived from the wall clock. */
export function stepRemainingMs(session: ActiveSession, now: number): number {
  if (session.phase === "paused") return session.pausedRemainingMs ?? 0
  if (session.phase !== "running" || session.stepEndsAt === null) return 0
  return Math.max(0, session.stepEndsAt - now)
}

/** 0..1 progress through the current step. */
export function stepProgress(session: ActiveSession, now: number): number {
  const step = session.plan.steps[session.stepIndex]
  if (!step || step.seconds <= 0) return 1
  const remaining = stepRemainingMs(session, now) / 1000
  return Math.min(1, Math.max(0, 1 - remaining / step.seconds))
}

/** 0..1 progress through the whole brew, by step time budget. */
export function overallProgress(session: ActiveSession, now: number): number {
  const total = totalSeconds(session.plan)
  if (total <= 0) return 1
  const done = session.plan.steps.slice(0, session.stepIndex).reduce((a, s) => a + s.seconds, 0)
  const step = session.plan.steps[session.stepIndex]
  const inStep = step ? step.seconds * stepProgress(session, now) : 0
  return Math.min(1, (done + inStep) / total)
}

export function getReadyRemainingMs(session: ActiveSession, now: number): number {
  if (session.phase !== "getready" || session.getReadyEndsAt === null) return 0
  return Math.max(0, session.getReadyEndsAt - now)
}

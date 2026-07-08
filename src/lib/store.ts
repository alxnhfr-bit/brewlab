import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  ActiveSession,
  BrewMethodId,
  DoseMemory,
  JournalEntry,
  SessionPlan,
  Settings,
  TasteTag,
  ThemeSetting,
  Tweak,
} from "./types"
import { coachFor } from "./coaching"

const GET_READY_MS = 3000

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export interface FinalizeInput {
  rating?: number
  taste?: TasteTag
  saveTweak?: boolean
}

interface BrewLabState {
  hasOnboarded: boolean
  preferredMethod: BrewMethodId | null
  settings: Settings
  journal: JournalEntry[]
  favorites: string[]
  doseMemory: Record<string, DoseMemory>
  pendingTweaks: Record<string, Tweak>
  session: ActiveSession | null

  completeOnboarding: (method: BrewMethodId | null) => void
  setTheme: (theme: ThemeSetting) => void
  setSetting: (key: "haptics" | "sound", value: boolean) => void
  toggleFavorite: (recipeId: string) => void
  rememberDose: (recipeId: string, memory: DoseMemory) => void

  startSession: (plan: SessionPlan) => void
  beginBrewing: () => void
  pauseSession: () => void
  resumeSession: () => void
  scrubToStep: (index: number) => void
  advanceStep: () => void
  setMinimized: (minimized: boolean) => void
  finalizeSession: (input: FinalizeInput) => void
  abandonSession: () => void

  logManual: (entry: Omit<JournalEntry, "id" | "manual">) => void
  updateEntry: (id: string, patch: Partial<JournalEntry>) => void
  deleteEntry: (id: string) => void
  clearTweak: (recipeId: string) => void
}

export const useBrewLab = create<BrewLabState>()(
  persist(
    (set, get) => ({
      hasOnboarded: false,
      preferredMethod: null,
      settings: { theme: "system", haptics: true, sound: true },
      journal: [],
      favorites: [],
      doseMemory: {},
      pendingTweaks: {},
      session: null,

      completeOnboarding: (method) => set({ hasOnboarded: true, preferredMethod: method }),

      setTheme: (theme) => set((s) => ({ settings: { ...s.settings, theme } })),

      setSetting: (key, value) => set((s) => ({ settings: { ...s.settings, [key]: value } })),

      toggleFavorite: (recipeId) =>
        set((s) => ({
          favorites: s.favorites.includes(recipeId)
            ? s.favorites.filter((f) => f !== recipeId)
            : [...s.favorites, recipeId],
        })),

      rememberDose: (recipeId, memory) =>
        set((s) => ({ doseMemory: { ...s.doseMemory, [recipeId]: memory } })),

      startSession: (plan) => {
        const now = Date.now()
        set({
          session: {
            plan,
            phase: "getready",
            stepIndex: 0,
            stepEndsAt: null,
            pausedRemainingMs: null,
            getReadyEndsAt: now + GET_READY_MS,
            startedAt: now,
            minimized: false,
          },
        })
      },

      beginBrewing: () => {
        const s = get().session
        if (!s || s.phase !== "getready") return
        const now = Date.now()
        const first = s.plan.steps[0]
        set({
          session: {
            ...s,
            phase: "running",
            stepIndex: 0,
            stepEndsAt: now + (first ? first.seconds * 1000 : 0),
            getReadyEndsAt: null,
            startedAt: now,
          },
        })
      },

      pauseSession: () => {
        const s = get().session
        if (!s || s.phase !== "running" || s.stepEndsAt === null) return
        set({
          session: {
            ...s,
            phase: "paused",
            pausedRemainingMs: Math.max(0, s.stepEndsAt - Date.now()),
            stepEndsAt: null,
          },
        })
      },

      resumeSession: () => {
        const s = get().session
        if (!s || s.phase !== "paused") return
        set({
          session: {
            ...s,
            phase: "running",
            stepEndsAt: Date.now() + (s.pausedRemainingMs ?? 0),
            pausedRemainingMs: null,
          },
        })
      },

      scrubToStep: (index) => {
        const s = get().session
        if (!s) return
        const clamped = Math.max(0, Math.min(index, s.plan.steps.length - 1))
        const step = s.plan.steps[clamped]
        const running = s.phase === "running" || s.phase === "paused"
        if (!running) return
        set({
          session: {
            ...s,
            stepIndex: clamped,
            phase: s.phase === "paused" ? "paused" : "running",
            stepEndsAt: s.phase === "paused" ? null : Date.now() + step.seconds * 1000,
            pausedRemainingMs: s.phase === "paused" ? step.seconds * 1000 : null,
          },
        })
      },

      advanceStep: () => {
        const s = get().session
        if (!s || s.phase !== "running") return
        const nextIndex = s.stepIndex + 1
        if (nextIndex >= s.plan.steps.length) {
          set({
            session: { ...s, phase: "complete", stepEndsAt: null, minimized: false, completedAt: Date.now() },
          })
          return
        }
        const next = s.plan.steps[nextIndex]
        set({
          session: {
            ...s,
            stepIndex: nextIndex,
            stepEndsAt: Date.now() + next.seconds * 1000,
          },
        })
      },

      setMinimized: (minimized) => {
        const s = get().session
        if (!s) return
        set({ session: { ...s, minimized } })
      },

      finalizeSession: (input) => {
        const state = get()
        const s = state.session
        if (!s) return
        const entry: JournalEntry = {
          id: uid(),
          at: s.startedAt,
          recipeId: s.plan.recipeId,
          recipeName: s.plan.recipeName,
          method: s.plan.method,
          doseG: s.plan.doseG,
          waterG: s.plan.waterG,
          tempC: s.plan.tempC,
          durationSec: Math.round(((s.completedAt ?? Date.now()) - s.startedAt) / 1000),
          completed: s.phase === "complete",
          manual: false,
          rating: input.rating,
          taste: input.taste,
          tweakApplied: s.plan.tweakApplied,
        }
        const tweaks = { ...state.pendingTweaks }
        if (s.plan.recipeId) {
          if (input.saveTweak && input.taste && input.taste !== "just-right") {
            const tweak = coachFor(input.taste, s.plan.method)
            if (tweak) tweaks[s.plan.recipeId] = tweak
          } else if (s.plan.tweakApplied || input.taste === "just-right") {
            delete tweaks[s.plan.recipeId]
          }
        }
        set({
          journal: [entry, ...state.journal],
          pendingTweaks: tweaks,
          session: null,
        })
      },

      abandonSession: () => {
        const state = get()
        const s = state.session
        if (!s) return
        if (s.phase === "getready") {
          set({ session: null })
          return
        }
        const entry: JournalEntry = {
          id: uid(),
          at: s.startedAt,
          recipeId: s.plan.recipeId,
          recipeName: s.plan.recipeName,
          method: s.plan.method,
          doseG: s.plan.doseG,
          waterG: s.plan.waterG,
          tempC: s.plan.tempC,
          durationSec: Math.round((Date.now() - s.startedAt) / 1000),
          completed: false,
          manual: false,
          tweakApplied: s.plan.tweakApplied,
        }
        set({ journal: [entry, ...state.journal], session: null })
      },

      logManual: (entry) =>
        set((s) => ({
          journal: [{ ...entry, id: uid(), manual: true }, ...s.journal],
        })),

      updateEntry: (id, patch) =>
        set((s) => ({
          journal: s.journal.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),

      deleteEntry: (id) =>
        set((s) => ({ journal: s.journal.filter((e) => e.id !== id) })),

      clearTweak: (recipeId) =>
        set((s) => {
          const tweaks = { ...s.pendingTweaks }
          delete tweaks[recipeId]
          return { pendingTweaks: tweaks }
        }),
    }),
    {
      name: "brewlab-store",
      version: 1,
    }
  )
)

/** The most recent completed, non-manual brew with a known recipe. */
export function selectLastBrew(state: BrewLabState): JournalEntry | undefined {
  return state.journal.find((e) => !e.manual && e.recipeId !== null)
}

import { useEffect, useState } from "react"
import { IconContext } from "@phosphor-icons/react"
import { useBrewLab } from "./lib/store"
import { DISPLAY } from "./ui/primitives"
import { BrewTab } from "./screens/brew/BrewTab"
import { JournalTab } from "./screens/journal/JournalTab"
import { LibraryTab } from "./screens/library/LibraryTab"
import { SessionOverlay } from "./screens/session/SessionOverlay"
import { NowBrewingBar } from "./screens/session/NowBrewingBar"
import { ThePour } from "./screens/onboarding/ThePour"

export type TabId = "brew" | "journal" | "library"

const TABS: { id: TabId; label: string }[] = [
  { id: "brew", label: "Brew" },
  { id: "journal", label: "Journal" },
  { id: "library", label: "Library" },
]

/**
 * Resolves the "system" appearance to light/dark and writes both palette and
 * theme onto the document element, where tokens.css picks them up.
 */
function usePaletteAttributes() {
  const theme = useBrewLab((s) => s.settings.theme)
  const palette = useBrewLab((s) => s.settings.palette)

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const apply = () => {
      const resolved = theme === "system" ? (mql.matches ? "dark" : "light") : theme
      document.documentElement.dataset.theme = resolved
      document.documentElement.dataset.palette = palette
      document.documentElement.style.colorScheme = resolved
    }
    apply()
    mql.addEventListener("change", apply)
    return () => mql.removeEventListener("change", apply)
  }, [theme, palette])
}

function TabBar({ tab, onChange }: { tab: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 440,
        background: "var(--p-ink)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "16px 28px var(--p-nav-pad-bottom)",
        zIndex: 200,
      }}
    >
      {TABS.map(({ id, label }) => {
        const active = tab === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              color: active ? "var(--p-nav-active)" : "var(--p-bg)",
              opacity: active ? 1 : 0.6,
            }}
          >
            <span style={{ fontFamily: DISPLAY, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase" }}>
              {label}
            </span>
            <span
              style={{
                width: "100%",
                height: 3,
                background: active ? "var(--p-nav-active)" : "transparent",
              }}
            />
          </button>
        )
      })}
    </nav>
  )
}

export default function BrewLab() {
  const hasOnboarded = useBrewLab((s) => s.hasOnboarded)
  const completeOnboarding = useBrewLab((s) => s.completeOnboarding)
  const [tab, setTab] = useState<TabId>("brew")
  usePaletteAttributes()

  return (
    <IconContext.Provider value={{ size: 20, weight: "bold" }}>
      <div
        style={{
          maxWidth: 440,
          margin: "0 auto",
          // The shell is the scroll container, so the bounce happens here and
          // is contained, leaving the fixed tab bar and mini-bar untouched.
          height: "100%",
          overflowY: "auto",
          overscrollBehaviorY: "contain",
          background: "var(--p-bg)",
          color: "var(--p-ink)",
          position: "relative",
        }}
      >
        {!hasOnboarded ? (
          <ThePour onDone={completeOnboarding} />
        ) : (
          <>
            {/* Opaque backdrop for the status bar, so list content scrolling
                up passes behind the clock rather than colliding with it. */}
            <div
              aria-hidden
              style={{
                position: "fixed",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                maxWidth: 440,
                height: "env(safe-area-inset-top)",
                background: "var(--p-bg)",
                pointerEvents: "none",
                zIndex: 150,
              }}
            />
            {tab === "brew" && <BrewTab />}
            {tab === "journal" && <JournalTab />}
            {tab === "library" && <LibraryTab />}

            <NowBrewingBar />
            <TabBar tab={tab} onChange={setTab} />
            <SessionOverlay />
          </>
        )}
      </div>
    </IconContext.Provider>
  )
}

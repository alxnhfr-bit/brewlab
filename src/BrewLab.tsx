import { useEffect, useState } from "react"
import { IconContext } from "@phosphor-icons/react"
import { useBrewLab } from "./lib/store"
import { Coffee, Notebook, Books } from "./ui/icons"
import { BrewTab } from "./screens/brew/BrewTab"
import { JournalTab } from "./screens/journal/JournalTab"
import { LibraryTab } from "./screens/library/LibraryTab"
import { SessionOverlay } from "./screens/session/SessionOverlay"
import { NowBrewingBar } from "./screens/session/NowBrewingBar"
import { ThePour } from "./screens/onboarding/ThePour"

type TabId = "brew" | "journal" | "library"

const TABS: { id: TabId; label: string; Icon: typeof Coffee }[] = [
  { id: "brew", label: "Brew", Icon: Coffee },
  { id: "journal", label: "Journal", Icon: Notebook },
  { id: "library", label: "Library", Icon: Books },
]

function useThemeAttribute() {
  const theme = useBrewLab((s) => s.settings.theme)
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const apply = () => {
      const resolved = theme === "system" ? (mql.matches ? "dark" : "light") : theme
      document.documentElement.dataset.theme = resolved
    }
    apply()
    mql.addEventListener("change", apply)
    return () => mql.removeEventListener("change", apply)
  }, [theme])
}

export default function BrewLab() {
  const hasOnboarded = useBrewLab((s) => s.hasOnboarded)
  const completeOnboarding = useBrewLab((s) => s.completeOnboarding)
  const [tab, setTab] = useState<TabId>("brew")
  useThemeAttribute()

  return (
    <IconContext.Provider value={{ size: 22, weight: "light" }}>
      <div style={{ maxWidth: 420, margin: "0 auto", minHeight: "100vh", position: "relative" }}>
        {!hasOnboarded ? (
          <ThePour onDone={completeOnboarding} />
        ) : (
          <>
            {tab === "brew" && <BrewTab />}
            {tab === "journal" && <JournalTab />}
            {tab === "library" && <LibraryTab />}

            <NowBrewingBar />

            <nav
              style={{
                position: "fixed",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                maxWidth: 420,
                background: "var(--bl-bg-translucent)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderTop: "1px solid var(--bl-line)",
                display: "flex",
                padding: "8px 0 calc(14px + env(safe-area-inset-bottom))",
                zIndex: 200,
              }}
            >
              {TABS.map(({ id, label, Icon }) => {
                const active = tab === id
                return (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 3,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: active ? "var(--bl-brand)" : "var(--bl-faint)",
                      padding: "4px 0",
                    }}
                  >
                    <Icon weight={active ? "fill" : "light"} />
                    <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, letterSpacing: "0.06em" }}>
                      {label}
                    </span>
                  </button>
                )
              })}
            </nav>

            <SessionOverlay />
          </>
        )}
      </div>
    </IconContext.Provider>
  )
}

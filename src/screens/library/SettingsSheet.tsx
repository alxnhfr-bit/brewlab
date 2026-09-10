import type { CSSProperties, ReactNode } from "react"
import { APP_NAME, APP_STRAPLINE, PRIVACY_URL, SUPPORT_URL } from "../../lib/brand"
import { useBrewLab } from "../../lib/store"
import { haptics } from "../../lib/haptics"
import { Sheet, Toggle } from "../../ui/primitives"
import { CaretRight, LogoMark } from "../../ui/icons"

const APP_VERSION = "0.1.0"

const ROW: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  minHeight: 52,
  padding: 0,
  background: "none",
  border: "none",
  borderBottom: "2px solid var(--p-ink)",
  color: "var(--p-ink)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: ".1em",
  textTransform: "uppercase",
  textAlign: "left",
}

/** Right-hand side of a row: muted value, optional caret. */
function RowValue({ children, caret }: { children?: ReactNode; caret?: boolean }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {children !== undefined && <span style={{ color: "var(--p-muted)" }}>{children}</span>}
      {caret && <CaretRight size={14} />}
    </span>
  )
}

function ToggleRow({ label, settingKey }: { label: string; settingKey: "haptics" | "sound" }) {
  const value = useBrewLab((s) => s.settings[settingKey])
  const setSetting = useBrewLab((s) => s.setSetting)

  const set = (next: boolean) => {
    setSetting(settingKey, next)
    // Confirm the new state on the channel the user just changed.
    if (settingKey === "haptics" && next) haptics.selection()
  }

  return (
    <div className="p-row" onClick={() => set(!value)} style={ROW}>
      {label}
      <span onClick={(e) => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}>
        <Toggle on={value} onChange={set} label={label} />
      </span>
    </div>
  )
}

/**
 * Opens a public page in the system browser. target="_blank" is what makes
 * Capacitor hand the URL to Safari rather than navigating the app's own
 * WebView, which would strand the user with no way back.
 */
function LinkRow({ label, href }: { label: string; href: string }) {
  return (
    <a className="p-row" href={href} target="_blank" rel="noreferrer" style={{ ...ROW, textDecoration: "none" }}>
      {label}
      <RowValue caret />
    </a>
  )
}

function exportJournal(): void {
  const journal = useBrewLab.getState().journal
  const blob = new Blob([JSON.stringify(journal, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "brewlab-journal.json"
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export interface SettingsSheetProps {
  open: boolean
  onClose: () => void
  /** Pushes the Appearance screen. The sheet closes first. */
  onAppearance: () => void
}

/** Settings sheet: appearance, feedback toggles, data export, version. */
export function SettingsSheet({ open, onClose, onAppearance }: SettingsSheetProps) {
  const palette = useBrewLab((s) => s.settings.palette)
  const theme = useBrewLab((s) => s.settings.theme)
  const entryCount = useBrewLab((s) => s.journal.length)

  return (
    <Sheet open={open} onClose={onClose} title="Settings">
      <div style={{ marginTop: 18, borderTop: "2px solid var(--p-ink)" }}>
        <button className="p-row" onClick={onAppearance} style={ROW}>
          Appearance
          <RowValue caret>
            {palette} &middot; {theme}
          </RowValue>
        </button>

        <ToggleRow label="Haptics" settingKey="haptics" />
        <ToggleRow label="Sound" settingKey="sound" />

        <button className="p-row" onClick={exportJournal} style={ROW}>
          Export journal (JSON)
          <RowValue caret>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{entryCount}</span>{" "}
            {entryCount === 1 ? "entry" : "entries"}
          </RowValue>
        </button>

        <LinkRow label="Privacy policy" href={PRIVACY_URL} />
        <LinkRow label="Support" href={SUPPORT_URL} />

        <div style={ROW}>
          Version
          <RowValue>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{APP_VERSION}</span>
          </RowValue>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18 }}>
        <LogoMark size={22} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: "var(--p-muted)",
          }}
        >
          {APP_NAME} &middot; {APP_STRAPLINE}
        </span>
      </div>
    </Sheet>
  )
}

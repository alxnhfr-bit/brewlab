import type { CSSProperties, ReactNode } from "react"
import { Capacitor } from "@capacitor/core"
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem"
import { Share } from "@capacitor/share"
import { APP_NAME, APP_STRAPLINE, APP_VERSION, FEEDBACK_URL, PRIVACY_URL, SUPPORT_URL } from "../../lib/brand"
import { useBrewLab } from "../../lib/store"
import { haptics } from "../../lib/haptics"
import { Sheet, Toggle } from "../../ui/primitives"
import { CaretRight, LogoMark } from "../../ui/icons"

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

/**
 * The persist key stays "brewlab-store" (renaming it would orphan existing
 * data), but this filename is the one the user actually sees in Files.
 */
const EXPORT_FILENAME = "15grms-journal.json"

/**
 * Hand the journal to the system share sheet, so it can be saved to Files,
 * mailed or AirDropped.
 *
 * This cannot be the web path. A synthetic `<a download>` click does nothing at
 * all in a WKWebView: Capacitor's iOS runtime implements no WKDownloadDelegate
 * and no download decision handler, so the tap was silently inert on device
 * while working fine in the browser where it was tested. That made a row in
 * Settings and a sentence in the store description both untrue.
 */
async function shareJournalNative(json: string): Promise<void> {
  const { uri } = await Filesystem.writeFile({
    path: EXPORT_FILENAME,
    data: json,
    // Cache, not Documents: this is a handoff to the share sheet, not a file
    // the app is keeping. iOS may reclaim it, which is the correct lifetime.
    directory: Directory.Cache,
    encoding: Encoding.UTF8,
  })
  await Share.share({ title: "15GRMS journal", url: uri })
}

/** Web fallback: a real download, which is what browsers actually support. */
function downloadJournalWeb(json: string): void {
  const url = URL.createObjectURL(new Blob([json], { type: "application/json" }))
  const a = document.createElement("a")
  a.href = url
  a.download = EXPORT_FILENAME
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function exportJournal(): void {
  const json = JSON.stringify(useBrewLab.getState().journal, null, 2)
  if (!Capacitor.isNativePlatform()) {
    downloadJournalWeb(json)
    return
  }
  // Dismissing the share sheet rejects, which is a normal outcome, not an error.
  void shareJournalNative(json).catch(() => {})
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

        <LinkRow label="Send feedback" href={FEEDBACK_URL} />
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

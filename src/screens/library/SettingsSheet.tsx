import type { ThemeSetting } from "../../lib/types"
import { useBrewLab } from "../../lib/store"
import { haptics } from "../../lib/haptics"
import { SectionLabel, Card, Mono, Row, Sheet, Segmented, GhostButton } from "../../ui/primitives"

const THEME_OPTIONS: { id: ThemeSetting; label: string }[] = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
]

function Switch({ on }: { on: boolean }) {
  return (
    <div
      style={{
        width: 44,
        height: 26,
        flexShrink: 0,
        borderRadius: 999,
        padding: 2,
        background: on ? "var(--bl-brand)" : "var(--bl-line)",
        transition: "background .18s",
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          background: "var(--bl-card)",
          boxShadow: "var(--bl-shadow-card)",
          transform: on ? "translateX(18px)" : "translateX(0)",
          transition: "transform .18s",
        }}
      />
    </div>
  )
}

function ToggleRow({
  label,
  settingKey,
  isLast,
}: {
  label: string
  settingKey: "haptics" | "sound"
  isLast?: boolean
}) {
  const value = useBrewLab((s) => s.settings[settingKey])
  const setSetting = useBrewLab((s) => s.setSetting)
  return (
    <button
      onClick={() => {
        const next = !value
        setSetting(settingKey, next)
        if (settingKey === "haptics" && next) haptics.selection()
      }}
      style={{
        width: "100%",
        minHeight: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "0 16px",
        background: "none",
        border: "none",
        borderBottom: isLast ? "none" : "1px solid var(--bl-line)",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <span style={{ fontSize: 15, color: "var(--bl-ink)" }}>{label}</span>
      <Switch on={value} />
    </button>
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
}

/** Settings sheet: appearance, feedback toggles, data export, about. */
export function SettingsSheet({ open, onClose }: SettingsSheetProps) {
  const theme = useBrewLab((s) => s.settings.theme)
  const setTheme = useBrewLab((s) => s.setTheme)
  const entryCount = useBrewLab((s) => s.journal.length)

  return (
    <Sheet open={open} onClose={onClose} title="Settings">
      <div style={{ paddingBottom: 8 }}>
        <SectionLabel>Appearance</SectionLabel>
        <Segmented
          options={THEME_OPTIONS}
          value={theme}
          onChange={(id) => setTheme(id as ThemeSetting)}
        />

        <SectionLabel style={{ marginTop: 24 }}>Feedback</SectionLabel>
        <Card>
          <ToggleRow label="Haptics" settingKey="haptics" />
          <ToggleRow label="Sound" settingKey="sound" isLast />
        </Card>

        <SectionLabel style={{ marginTop: 24 }}>Data</SectionLabel>
        <GhostButton onClick={exportJournal} style={{ width: "100%" }}>
          Export journal (JSON)
        </GhostButton>
        <div style={{ marginTop: 8, fontSize: 12, color: "var(--bl-muted)" }}>
          <Mono>{entryCount}</Mono> {entryCount === 1 ? "entry" : "entries"} in your journal
        </div>

        <SectionLabel style={{ marginTop: 24 }}>About</SectionLabel>
        <Card>
          <Row style={{ minHeight: 48, padding: "0 16px", justifyContent: "space-between", borderBottom: "1px solid var(--bl-line)" }}>
            <span style={{ fontSize: 14, color: "var(--bl-muted)" }}>Version</span>
            <Mono style={{ fontSize: 14, color: "var(--bl-muted)" }}>0.1.0</Mono>
          </Row>
          <Row style={{ minHeight: 48, padding: "0 16px" }}>
            <span style={{ fontSize: 14, color: "var(--bl-muted)" }}>BrewLab, craft better coffee</span>
          </Row>
        </Card>
      </div>
    </Sheet>
  )
}

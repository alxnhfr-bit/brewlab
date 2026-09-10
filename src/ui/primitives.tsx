import { useEffect, useState, type CSSProperties, type ReactNode } from "react"

/*
 * Pourfect primitives. Shape language: 2px ink rules, pill radii (999),
 * 22px cards, 28px hero/sheet corners, no shadows except the mini-bar.
 * Colours always come from the palette tokens, never hardcoded.
 */

export const DISPLAY = "var(--p-font-display)"

/** 11px / 700 / .16em uppercase, muted. The workhorse section label. */
export function Label({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".16em",
        textTransform: "uppercase",
        color: "var(--p-muted)",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** 10px / 700 / .12em uppercase. Captions inside spec cells and stickers. */
export function MicroLabel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: ".12em",
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** 11-12px / 700 / .08-.1em uppercase. Row meta lines. */
export function Meta({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".08em",
        textTransform: "uppercase",
        color: "var(--p-muted)",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Page title, 28px Archivo Black / 1 / -0.04em uppercase. */
export function PageTitle({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: DISPLAY,
        fontSize: 28,
        lineHeight: 1,
        letterSpacing: "-0.04em",
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Primary action: accent fill, accent-ink text, Archivo Black. */
export function PrimaryPill({
  children,
  onClick,
  minHeight = 64,
  fontSize = 20,
  style,
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  minHeight?: number
  fontSize?: number
  style?: CSSProperties
  disabled?: boolean
}) {
  return (
    <button
      className="p-press"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        minHeight,
        border: "none",
        borderRadius: 999,
        background: "var(--p-accent)",
        color: "var(--p-accent-ink)",
        fontFamily: DISPLAY,
        fontSize,
        letterSpacing: ".04em",
        opacity: disabled ? 0.4 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

/** Secondary action: 2px ink outline, inverts while pressed. */
export function OutlinePill({
  children,
  onClick,
  minHeight = 60,
  style,
}: {
  children: ReactNode
  onClick?: () => void
  minHeight?: number
  style?: CSSProperties
}) {
  return (
    <button
      className="p-press p-outline"
      onClick={onClick}
      style={{
        minHeight,
        padding: "0 22px",
        border: "2px solid var(--p-ink)",
        borderRadius: 999,
        background: "transparent",
        color: "var(--p-ink)",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: ".08em",
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </button>
  )
}

/** Selectable chip. Selected = ink fill / bg text. */
export function Chip({
  children,
  selected,
  onClick,
  style,
}: {
  children: ReactNode
  selected?: boolean
  onClick?: () => void
  style?: CSSProperties
}) {
  return (
    <button
      className="p-press"
      onClick={onClick}
      style={{
        padding: "10px 14px",
        border: "2px solid var(--p-ink)",
        borderRadius: 999,
        background: selected ? "var(--p-ink)" : "transparent",
        color: selected ? "var(--p-bg)" : "var(--p-ink)",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: ".08em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </button>
  )
}

/** Round outline icon button. 40 / 44 / 48 / 64 depending on context. */
export function RoundBtn({
  children,
  onClick,
  size = 44,
  label,
  style,
}: {
  children: ReactNode
  onClick?: () => void
  size?: number
  label?: string
  style?: CSSProperties
}) {
  return (
    <button
      className="p-press p-outline"
      onClick={onClick}
      aria-label={label}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        border: "2px solid var(--p-ink)",
        borderRadius: 999,
        background: "transparent",
        color: "var(--p-ink)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {children}
    </button>
  )
}

/** Bordered spec grid. Cells share 2px rules; the last cell drops its border. */
export function SpecGrid({
  cells,
  borderColor = "var(--p-ink)",
  valueSize = 17,
  style,
}: {
  cells: { value: ReactNode; caption: string }[]
  borderColor?: string
  valueSize?: number
  style?: CSSProperties
}) {
  return (
    <div style={{ display: "flex", border: `2px solid ${borderColor}`, ...style }}>
      {cells.map((c, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            minWidth: 0,
            padding: "10px 12px",
            borderRight: i < cells.length - 1 ? `2px solid ${borderColor}` : undefined,
          }}
        >
          <div style={{ fontFamily: DISPLAY, fontSize: valueSize, lineHeight: 1 }}>{c.value}</div>
          <MicroLabel style={{ marginTop: 4, opacity: 0.85 }}>{c.caption}</MicroLabel>
        </div>
      ))}
    </div>
  )
}

/** Saved-tweak pill. Inverted on accent surfaces, ink-filled elsewhere. */
export function TweakPill({
  children,
  onAccent,
  style,
}: {
  children: ReactNode
  onAccent?: boolean
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: onAccent ? "var(--p-accent-ink)" : "var(--p-ink)",
        color: onAccent ? "var(--p-accent)" : "var(--p-bg)",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: ".1em",
        textTransform: "uppercase",
        padding: "8px 14px",
        borderRadius: 999,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** 48 x 28 toggle. On = ink fill with a bg knob right. */
export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      aria-label={label}
      style={{
        width: 48,
        height: 28,
        flexShrink: 0,
        borderRadius: 999,
        border: "2px solid var(--p-ink)",
        background: on ? "var(--p-ink)" : "transparent",
        padding: 0,
        position: "relative",
        transition: "background .18s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 1,
          left: on ? 21 : 1,
          width: 22,
          height: 22,
          borderRadius: 999,
          background: on ? "var(--p-bg)" : "var(--p-ink)",
          transition: "left .18s",
        }}
      />
    </button>
  )
}

/** Stepper row: round outline minus/plus around a big Archivo Black value. */
export function Stepper({
  value,
  unit,
  onMinus,
  onPlus,
  below,
  valueSize = 44,
}: {
  value: ReactNode
  unit?: string
  onMinus: () => void
  onPlus: () => void
  below?: ReactNode
  valueSize?: number
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <RoundBtn size={48} onClick={onMinus} label="Decrease" style={{ fontSize: 22, fontWeight: 700 }}>
          <span style={{ lineHeight: 1, marginTop: -2 }}>&minus;</span>
        </RoundBtn>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontFamily: DISPLAY,
            fontSize: valueSize,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
          {unit && <span style={{ fontSize: 20, marginLeft: 2 }}>{unit}</span>}
        </div>
        <RoundBtn size={48} onClick={onPlus} label="Increase" style={{ fontSize: 22, fontWeight: 700 }}>
          <span style={{ lineHeight: 1, marginTop: -2 }}>+</span>
        </RoundBtn>
      </div>
      {below && (
        <div
          style={{
            textAlign: "center",
            marginTop: 8,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "var(--p-muted)",
          }}
        >
          {below}
        </div>
      )}
    </div>
  )
}

/** Pill text input, 2px ink border, min-height 52. */
export function PillInput({
  value,
  onChange,
  placeholder,
  inputMode,
  invalid,
  style,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  inputMode?: "text" | "decimal" | "numeric"
  invalid?: boolean
  style?: CSSProperties
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      style={{
        width: "100%",
        minHeight: 52,
        padding: "0 18px",
        border: `2px solid ${invalid ? "var(--p-accent)" : "var(--p-ink)"}`,
        borderRadius: 999,
        background: "transparent",
        fontSize: 15,
        fontWeight: 700,
        outline: "none",
        ...style,
      }}
    />
  )
}

/**
 * Bottom sheet: scrim at 50%, ink top rule, 28px top corners, slides up in
 * 280ms and scrolls internally at up to 92% height.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}) {
  const [mounted, setMounted] = useState(open)
  useEffect(() => {
    if (open) {
      setMounted(true)
      return
    }
    const t = setTimeout(() => setMounted(false), 200)
    return () => clearTimeout(t)
  }, [open])
  if (!mounted) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        animation: "p-scrim-in .28s ease-out",
        opacity: open ? 1 : 0,
        transition: "opacity .2s",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 440,
          maxHeight: "92%",
          overflowY: "auto",
          background: "var(--p-bg)",
          color: "var(--p-ink)",
          borderTop: "2px solid var(--p-ink)",
          borderRadius: "28px 28px 0 0",
          padding: "12px 20px calc(28px + env(safe-area-inset-bottom))",
          animation: "p-sheet-up .28s cubic-bezier(.2,.8,.3,1)",
        }}
      >
        <div style={{ width: 44, height: 4, borderRadius: 999, background: "var(--p-ink)", margin: "0 auto" }} />
        {title && (
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 24,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              marginTop: 18,
            }}
          >
            {title}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export function Row({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 12, ...style }}>{children}</div>
}

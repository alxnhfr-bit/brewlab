import { useEffect, useState, type CSSProperties, type ReactNode } from "react"

export function SectionLabel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--bl-faint)",
        marginBottom: 12,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Card({ children, style, onClick }: { children: ReactNode; style?: CSSProperties; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--bl-card)",
        border: "1px solid var(--bl-line)",
        borderRadius: "var(--bl-radius-lg)",
        boxShadow: "var(--bl-shadow-card)",
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Chip({
  children,
  selected,
  color,
  onClick,
  style,
}: {
  children: ReactNode
  selected?: boolean
  /** Accent CSS color for the selected state; defaults to brand. */
  color?: string
  onClick?: () => void
  style?: CSSProperties
}) {
  const accent = color ?? "var(--bl-brand)"
  return (
    <button
      onClick={onClick}
      style={{
        padding: "9px 16px",
        borderRadius: 999,
        border: selected ? `1.5px solid ${accent}` : "1.5px solid var(--bl-line)",
        background: selected ? accent : "var(--bl-card)",
        color: selected ? "var(--bl-brand-ink)" : "var(--bl-muted)",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background .18s, border-color .18s, color .18s",
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function PrimaryButton({
  children,
  onClick,
  color,
  disabled,
  style,
}: {
  children: ReactNode
  onClick?: () => void
  color?: string
  disabled?: boolean
  style?: CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        minHeight: 56,
        borderRadius: "var(--bl-radius)",
        border: "none",
        background: disabled ? "var(--bl-line)" : color ?? "var(--bl-brand)",
        color: disabled ? "var(--bl-faint)" : "var(--bl-brand-ink)",
        fontSize: 16,
        fontWeight: 600,
        fontFamily: "var(--bl-font-display)",
        letterSpacing: "0.02em",
        cursor: disabled ? "default" : "pointer",
        transition: "transform .12s, background .18s",
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function GhostButton({
  children,
  onClick,
  style,
}: {
  children: ReactNode
  onClick?: () => void
  style?: CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      style={{
        minHeight: 48,
        padding: "0 18px",
        borderRadius: "var(--bl-radius)",
        border: "1.5px solid var(--bl-line)",
        background: "var(--bl-card)",
        color: "var(--bl-muted)",
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function Segmented({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[]
  value: string
  onChange: (id: string) => void
}) {
  return (
    <div style={{ display: "flex", gap: 4, background: "var(--bl-line)", borderRadius: 12, padding: 4 }}>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: 9,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
            background: value === o.id ? "var(--bl-card)" : "transparent",
            color: value === o.id ? "var(--bl-ink)" : "var(--bl-faint)",
            boxShadow: value === o.id ? "var(--bl-shadow-card)" : "none",
            transition: "background .15s, color .15s",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Sheet({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}) {
  const [mounted, setMounted] = useState(open)
  useEffect(() => {
    if (open) setMounted(true)
    else {
      const t = setTimeout(() => setMounted(false), 180)
      return () => clearTimeout(t)
    }
  }, [open])
  if (!mounted) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "var(--bl-scrim)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        animation: "bl-fade-in .18s ease",
        opacity: open ? 1 : 0,
        transition: "opacity .18s",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 420,
          maxHeight: "88vh",
          overflowY: "auto",
          background: "var(--bl-bg)",
          borderRadius: "var(--bl-radius-lg) var(--bl-radius-lg) 0 0",
          padding: "12px 24px calc(24px + env(safe-area-inset-bottom))",
          animation: "bl-sheet-up .22s cubic-bezier(.2,.9,.3,1)",
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--bl-line)", margin: "0 auto 16px" }} />
        {title && (
          <div style={{ fontSize: 18, fontWeight: 600, fontFamily: "var(--bl-font-display)", marginBottom: 16 }}>
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

/** Monospaced data value, the app's strict "data voice". */
export function Mono({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span style={{ fontFamily: "var(--bl-font-mono)", fontVariantNumeric: "tabular-nums", ...style }}>
      {children}
    </span>
  )
}

import type { ReactNode } from "react"
import { C } from "../lib/theme"

export interface LblProps {
  children: ReactNode
}

export function Lbl({ children }: LblProps) {
  return (
    <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: C.faint, marginBottom: 12 }}>
      {children}
    </div>
  )
}

export interface TogOption {
  id: string
  name?: string
  short?: string
}

export interface TogProps {
  options: TogOption[]
  value: string
  onChange: (id: string) => void
}

export function Tog({ options, value, onChange }: TogProps) {
  return (
    <div style={{ display: "flex", gap: 4, background: C.line, borderRadius: 12, padding: 4 }}>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "'Outfit',sans-serif",
            background: value === o.id ? C.card : "transparent",
            color: value === o.id ? C.text : C.faint,
            boxShadow: value === o.id ? "0 1px 6px rgba(0,0,0,.04)" : "none",
          }}
        >
          {o.name || o.short}
        </button>
      ))}
    </div>
  )
}

import type { ReactNode } from "react"

/*
 * The signature session element: 12 annular sectors on a 200 x 200 box,
 * inner radius 60, outer radius 98, with a 0.06 rad gap on each side of every
 * sector. Wedge 0 starts at 12 o'clock and the ring fills clockwise.
 */

const SIZE = 200
const COUNT = 12
const R_IN = 60
const R_OUT = 98
const GAP = 0.06
const CENTER = SIZE / 2
const SWEEP = (Math.PI * 2) / COUNT

function point(radius: number, angle: number): string {
  const x = CENTER + radius * Math.cos(angle)
  const y = CENTER + radius * Math.sin(angle)
  return `${x.toFixed(3)} ${y.toFixed(3)}`
}

function wedgePath(index: number): string {
  const start = -Math.PI / 2 + index * SWEEP + GAP
  const end = -Math.PI / 2 + (index + 1) * SWEEP - GAP
  return [
    `M ${point(R_OUT, start)}`,
    `A ${R_OUT} ${R_OUT} 0 0 1 ${point(R_OUT, end)}`,
    `L ${point(R_IN, end)}`,
    `A ${R_IN} ${R_IN} 0 0 0 ${point(R_IN, start)}`,
    "Z",
  ].join(" ")
}

const PATHS: string[] = Array.from({ length: COUNT }, (_, i) => wedgePath(i))

/**
 * Fills sectors up to round(progress * 12). The single current sector blinks
 * while the brew is running and holds still while it is paused.
 */
export function WedgeRing({
  progress,
  blink,
  children,
}: {
  progress: number
  blink: boolean
  children?: ReactNode
}) {
  const filled = Math.min(COUNT, Math.max(0, Math.round(progress * COUNT)))
  const current = Math.min(COUNT - 1, Math.max(0, filled - 1))

  return (
    <div style={{ position: "relative", width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        {PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={i < filled ? "var(--p-accent)" : "var(--p-track)"}
            style={i === current && blink ? { animation: "blink 1s steps(2,end) infinite" } : undefined}
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  )
}

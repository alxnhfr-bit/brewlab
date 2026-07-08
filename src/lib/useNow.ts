import { useEffect, useState } from "react"

/**
 * Wall-clock tick for timer UIs. State is always derived from timestamps;
 * this hook only forces re-render at a display cadence.
 */
export function useNow(active: boolean, intervalMs = 250): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [active, intervalMs])
  return now
}

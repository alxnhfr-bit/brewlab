export function fmt(s: number): string {
  if (s >= 3600) {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

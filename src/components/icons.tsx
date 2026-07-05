import type { BrewMethodId } from "../lib/theme"

export interface IconProps {
  color?: string
  size?: number
}

export function V60I({ color = "currentColor", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="20" cy="12" rx="11" ry="2.5" />
      <path d="M9 12l8 18h6l8-18" />
      <path d="M12 16c2 1 5 1.5 8 1.5s6-.5 8-1.5" opacity=".2" />
    </svg>
  )
}

export function ApI({ color = "currentColor", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="6" width="12" height="2.5" rx="1" />
      <rect x="15" y="8.5" width="10" height="22" rx="1.5" />
      <rect x="17" y="30.5" width="6" height="2" rx=".5" opacity=".4" />
    </svg>
  )
}

export function CbI({ color = "currentColor", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="12" y="7" width="16" height="26" rx="3" />
      <line x1="12" y1="13" x2="28" y2="13" opacity=".25" />
    </svg>
  )
}

export function TmI({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <circle cx="12" cy="13" r="8.5" />
      <path d="M12 8.5v4.5l2.8 2.8" />
      <path d="M10 2.5h4M12 2.5v2" />
    </svg>
  )
}

export function ScI({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3.5M4.5 14.5L7.5 6h9l3 8.5" />
      <circle cx="12" cy="6" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function CtI({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h14l-1.5 8.5H8L6.5 6.5zM3.5 3.5h3" />
      <circle cx="9.5" cy="19.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="19.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function BkI({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  )
}

export function CkI({ size = 12 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function ChI() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export function XI() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

export function BnI({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
      <ellipse cx="12" cy="12" rx="5.5" ry="8" transform="rotate(-30 12 12)" />
      <path d="M9.5 7.5c1 2 1.2 5 0 9" opacity=".4" />
    </svg>
  )
}

export const MI: Record<BrewMethodId, (props: IconProps) => JSX.Element> = {
  v60: V60I,
  aeropress: ApI,
  coldbrew: CbI,
}

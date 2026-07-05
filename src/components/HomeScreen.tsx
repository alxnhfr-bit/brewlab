import { useEffect, useRef } from "react"
import { C, MC } from "../lib/theme"
import { V60I, ApI, CbI } from "./icons"

const FRAMES = [
  "/frames/frame-00.jpg",
  "/frames/frame-01.jpg",
  "/frames/frame-02.jpg",
  "/frames/frame-03.jpg",
  "/frames/frame-04.jpg",
  "/frames/frame-05.jpg",
  "/frames/frame-06.jpg",
  "/frames/frame-07.jpg",
]

export interface HomeScreenProps {
  onEnter: () => void
}

export function HomeScreen({ onEnter }: HomeScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const brandRef = useRef<HTMLDivElement | null>(null)
  const hintRef = useRef<HTMLDivElement | null>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrame = useRef(-1)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const images = FRAMES.map((src) => {
      const img = new Image()
      img.src = src
      return img
    })
    imagesRef.current = images
    function waitAll() {
      const loaded = images.filter((i) => i.complete)
      if (loaded.length === images.length) {
        drawFrame(0)
      } else {
        setTimeout(waitAll, 50)
      }
    }
    waitAll()
  }, [])

  function drawFrame(index: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const img = imagesRef.current[index]
    if (!img || !img.complete) return
    const dpr = window.devicePixelRatio || 1
    const cw = canvas.offsetWidth
    const ch = canvas.offsetHeight
    canvas.width = cw * dpr
    canvas.height = ch * dpr
    ctx.scale(dpr, dpr)
    const scale = Math.min(cw / img.width, ch / img.height)
    const w = img.width * scale
    const h = img.height * scale
    const x = (cw - w) / 2
    const y = (ch - h) / 2
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, x, y, w, h)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    function onScroll() {
      if (rafId.current) return
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null
        const scrollTop = el!.scrollTop
        const viewH = el!.clientHeight
        const animEnd = viewH * 2.2
        const p = Math.min(Math.max(scrollTop / animEnd, 0), 1)
        const idx = Math.min(Math.floor(p * FRAMES.length), FRAMES.length - 1)
        if (idx !== currentFrame.current) {
          currentFrame.current = idx
          drawFrame(idx)
        }
        const fadeStart = Math.floor(FRAMES.length * 0.65)
        const brandOp = idx >= fadeStart ? (idx - fadeStart) / (FRAMES.length - 1 - fadeStart) : 0
        if (brandRef.current) {
          brandRef.current.style.opacity = String(brandOp)
          brandRef.current.style.pointerEvents = brandOp > 0.5 ? "auto" : "none"
        }
        if (hintRef.current) {
          hintRef.current.style.display = idx < 1 ? "block" : "none"
        }
      })
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div ref={scrollRef} style={{ height: "100vh", overflowY: "auto", background: C.bg }}>
      <div style={{ height: "300vh", position: "relative" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, overflow: "hidden" }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
          <div
            ref={brandRef}
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0, padding: "80px 0 44px",
              background: "linear-gradient(to bottom,transparent," + C.bg + "cc 30%," + C.bg + ")",
              display: "flex", flexDirection: "column", alignItems: "center", opacity: 0, transition: "none", pointerEvents: "none",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: C.text }}>BrewLab</div>
            <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.stone, marginTop: 6 }}>Craft better coffee</div>
          </div>
          <div ref={hintRef} style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", opacity: 0.35 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={C.stone} strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </div>
        </div>
      </div>
      <div style={{ background: C.bg, padding: "20px 36px 56px", textAlign: "center" }}>
        <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 280, margin: "0 auto" }}>
          Guided recipes, precision ratios, and everything you need to brew beautifully at home.
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 40 }}>
          {[
            { c: MC.v60.main, l: "V60", Ic: V60I },
            { c: MC.aeropress.main, l: "AeroPress", Ic: ApI },
            { c: MC.coldbrew.main, l: "Cold Brew", Ic: CbI },
          ].map((x) => (
            <div key={x.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <x.Ic size={26} color={x.c} />
              </div>
              <span style={{ fontSize: 10, color: C.stone, fontWeight: 500 }}>{x.l}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onEnter}
          style={{ marginTop: 44, padding: "15px 52px", borderRadius: 14, border: "none", background: C.green, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit',sans-serif", letterSpacing: "0.08em" }}
        >
          Start Brewing
        </button>
      </div>
    </div>
  )
}

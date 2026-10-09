import { useEffect, useRef } from 'react'

// Pavesas que suben desde la brasa: chispas naranjas que titilan, se mecen y se apagan al subir.
// El cursor las empuja suavemente, como una corriente de aire.
export default function CanvasBrasas({ className = '', cantidad = 70 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cursor = { x: -9999, y: -9999 }
    let ancho = 0
    let alto = 0
    let id = 0
    let visible = true
    let anterior = performance.now()
    let pavesas = []

    function crear(inicial) {
      const vida = 5 + Math.random() * 7
      return {
        x: Math.random() * ancho,
        y: inicial ? Math.random() * alto : alto + 10,
        r: 0.8 + Math.random() * 2.4,
        vy: 22 + Math.random() * 46,
        vx: 0,
        fase: Math.random() * Math.PI * 2,
        vaiven: 10 + Math.random() * 26,
        vida,
        edad: inicial ? Math.random() * vida : 0,
        // De amarillo vivo a rojo brasa
        tono: 18 + Math.random() * 28,
      }
    }

    function medir() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      ancho = r.width
      alto = r.height
      canvas.width = Math.round(ancho * dpr)
      canvas.height = Math.round(alto * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      pavesas = Array.from({ length: cantidad }, () => crear(true))
    }

    function dibujar(dt, t) {
      ctx.clearRect(0, 0, ancho, alto)
      ctx.globalCompositeOperation = 'lighter'

      for (const p of pavesas) {
        p.edad += dt
        if (p.edad > p.vida || p.y < -20) Object.assign(p, crear(false))

        // Corriente de aire del cursor
        const dx = p.x - cursor.x
        const dy = p.y - cursor.y
        const d2 = dx * dx + dy * dy
        if (d2 < 150 * 150) {
          const d = Math.sqrt(d2) || 1
          p.vx += (dx / d) * (1 - d / 150) * 260 * dt
        }
        p.vx *= 0.96
        p.y -= p.vy * dt
        p.x += (Math.sin(t * 1.3 + p.fase) * p.vaiven + p.vx) * dt

        const progreso = p.edad / p.vida
        const titileo = 0.6 + 0.4 * Math.sin(t * 9 + p.fase * 3)
        const alfa = Math.sin(Math.min(progreso * 6, 1) * Math.PI * 0.5) * (1 - progreso) * titileo
        const radio = p.r * (1 - progreso * 0.5)
        const halo = radio * 6

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, halo)
        g.addColorStop(0, `hsla(${p.tono + 20}, 100%, 82%, ${alfa})`)
        g.addColorStop(0.18, `hsla(${p.tono}, 100%, 58%, ${alfa * 0.7})`)
        g.addColorStop(1, `hsla(${p.tono - 8}, 100%, 45%, 0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(p.x, p.y, halo, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function bucle(ahora) {
      const dt = Math.min((ahora - anterior) / 1000, 0.05)
      anterior = ahora
      dibujar(dt, ahora / 1000)
      if (visible) id = requestAnimationFrame(bucle)
    }

    function alMover(e) {
      const r = canvas.getBoundingClientRect()
      cursor.x = e.clientX - r.left
      cursor.y = e.clientY - r.top
    }

    medir()
    const ro = new ResizeObserver(() => {
      medir()
      if (reducido) dibujar(0, 0)
    })
    ro.observe(canvas)

    if (reducido) {
      dibujar(0, 0)
      return () => ro.disconnect()
    }

    const io = new IntersectionObserver(([entrada]) => {
      const antes = visible
      visible = entrada.isIntersecting
      if (visible && !antes) {
        anterior = performance.now()
        id = requestAnimationFrame(bucle)
      }
    })
    io.observe(canvas)
    window.addEventListener('pointermove', alMover, { passive: true })
    id = requestAnimationFrame(bucle)

    return () => {
      cancelAnimationFrame(id)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', alMover)
    }
  }, [cantidad])

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`} />
}

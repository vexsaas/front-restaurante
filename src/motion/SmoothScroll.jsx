import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// Scroll con inercia para todo el sitio público. Con "reducir movimiento" se deja el scroll nativo.
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 1, smoothWheel: true })
    lenisRef.current = lenis

    let id = requestAnimationFrame(function raf(time) {
      lenis.raf(time)
      id = requestAnimationFrame(raf)
    })

    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname])

  return children
}

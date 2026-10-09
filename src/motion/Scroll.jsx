import { motion, useScroll, useSpring } from 'motion/react'

// Hilo dorado bajo el navbar que crece con el avance de la página.
export function BarraProgreso() {
  const { scrollYProgress } = useScroll()
  const escala = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 })
  return <motion.div className="h-0.5 origin-left bg-gradient-to-r from-gold via-gold-light to-gold" style={{ scaleX: escala }} />
}

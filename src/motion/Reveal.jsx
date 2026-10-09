import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useSpring } from 'motion/react'

export const EASE = [0.22, 1, 0.36, 1]

// Aparece al entrar en pantalla: sube y se enfoca.
export function Reveal({ children, delay = 0, y = 36, className = '', as = 'div', once = true }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}

// Titular que sube palabra por palabra desde detrás de una máscara.
export function TextoMascara({ texto, className = '', claseTexto = '', delay = 0, as = 'h2', alMontar = false }) {
  const Tag = as
  const palabras = texto.split(' ')
  const anim = alMontar ? { animate: 'visible' } : { whileInView: 'visible', viewport: { once: true, margin: '0px 0px -10% 0px' } }

  return (
    <Tag className={className} aria-label={texto}>
      <motion.span
        aria-hidden="true"
        initial="oculto"
        {...anim}
        transition={{ staggerChildren: 0.09, delayChildren: delay }}
      >
        {palabras.map((palabra, i) => (
          <span key={i} className="-mt-[0.2em] inline-block overflow-hidden pb-[0.08em] pt-[0.2em] align-bottom">
            <motion.span
              className={`inline-block ${claseTexto}`}
              variants={{
                oculto: { y: '105%' },
                visible: { y: '0%', transition: { duration: 1.15, ease: EASE } },
              }}
            >
              {palabra}
              {i < palabras.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

// Contenedor que escalona la entrada de sus hijos <Item>.
export function Escalonado({ children, className = '', paso = 0.1, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ staggerChildren: paso, delayChildren: delay }}
    >
      {children}
    </motion.div>
  )
}

export function Item({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={{
        oculto: { opacity: 0, y: 48, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.85, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}

// Número que cuenta desde cero al entrar en pantalla. Conserva sufijos como "K" o decimales.
export function Contador({ valor, className = '' }) {
  const ref = useRef(null)
  const enVista = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const match = String(valor).match(/^([\d.]+)(.*)$/)
  const numero = match ? Number(match[1]) : 0
  const sufijo = match ? match[2] : ''
  const decimales = match && match[1].includes('.') ? match[1].split('.')[1].length : 0

  useEffect(() => {
    if (!enVista || !ref.current) return undefined
    const controles = animate(0, numero, {
      duration: 2,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimales) + sufijo
      },
    })
    return () => controles.stop()
  }, [enVista, numero, sufijo, decimales])

  return (
    <span ref={ref} className={className}>
      {(0).toFixed(decimales) + sufijo}
    </span>
  )
}

// El elemento se deja "atraer" por el cursor y vuelve con un resorte.
export function Magnetico({ children, fuerza = 0.35, className = '' }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })

  function mover(e) {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * fuerza)
    y.set((e.clientY - (r.top + r.height / 2)) * fuerza)
  }

  function soltar() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div className={`inline-block ${className}`} style={{ x: sx, y: sy }} onPointerMove={mover} onPointerLeave={soltar}>
      {children}
    </motion.div>
  )
}

// Tarjeta que se inclina en 3D siguiendo al cursor.
export function Inclinar({ children, className = '', grados = 7 }) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 180, damping: 18 })
  const sry = useSpring(ry, { stiffness: 180, damping: 18 })

  function mover(e) {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * grados * 2)
    rx.set(-py * grados * 2)
  }

  function soltar() {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onPointerMove={mover}
      onPointerLeave={soltar}
    >
      {children}
    </motion.div>
  )
}

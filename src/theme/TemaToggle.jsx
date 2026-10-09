import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

const CLAVE = 'restaurante-tema'

function temaActual() {
  return document.documentElement.dataset.tema === 'oscuro' ? 'oscuro' : 'claro'
}

function aplicar(tema) {
  document.documentElement.dataset.tema = tema
  document.documentElement.style.colorScheme = tema === 'claro' ? 'light' : 'dark'
  try {
    localStorage.setItem(CLAVE, tema)
  } catch {
    /* almacenamiento bloqueado: el tema vale solo para esta visita */
  }
}

// Botón sol/luna. El cambio se revela en círculo desde el propio botón cuando el navegador lo permite.
export default function TemaToggle({ className = '' }) {
  const [tema, setTema] = useState(temaActual)

  // Mantiene sincronizados los botones del navbar y del panel si hay más de uno montado.
  useEffect(() => {
    const observador = new MutationObserver(() => setTema(temaActual()))
    observador.observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema'] })
    return () => observador.disconnect()
  }, [])

  function alternar(e) {
    const siguiente = tema === 'claro' ? 'oscuro' : 'claro'
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!document.startViewTransition || reducido) {
      aplicar(siguiente)
      return
    }

    const r = e.currentTarget.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const radio = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    document.startViewTransition(() => aplicar(siguiente)).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radio}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }

  const claro = tema === 'claro'

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={claro ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      title={claro ? 'Modo oscuro' : 'Modo claro'}
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/30 bg-carbon/40 text-gold transition-colors hover:bg-gold hover:text-carbon ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={tema}
          initial={{ y: 18, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -18, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {claro ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

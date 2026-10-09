import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Calendar, Clock, Menu as MenuIcon, X } from 'lucide-react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import Logo from './Logo'
import { BarraProgreso } from '../motion/Scroll'
import TemaToggle from '../theme/TemaToggle'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/menu', label: 'Menú & Cava' },
  { to: '/reservar', label: 'Reservar' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [oculto, setOculto] = useState(false)
  const location = useLocation()
  const { scrollY } = useScroll()

  // Se esconde al bajar y reaparece al subir, para dejarle la pantalla al contenido.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const anterior = scrollY.getPrevious() ?? 0
    setOculto(y > anterior && y > 320 && !open)
    setScrolled(y > 20)
  })

  useEffect(() => {
    setOpen(false)
  }, [location])

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-[padding,background-color,box-shadow] duration-500 ${
        scrolled
          ? 'bg-forest-dark/95 shadow-xl shadow-carbon/30 border-b border-gold/30 backdrop-blur-md pt-3'
          : 'bg-forest-dark/90 border-b border-gold/20 backdrop-blur-sm pt-4'
      }`}
      animate={{ y: oculto ? '-100%' : '0%' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top Banner Accent */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link to="/" className="group flex items-center transition-transform hover:scale-[1.01]" aria-label="Restaurante Amaranto">
          <Logo size="md" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex bg-carbon/30 px-3 py-1.5 rounded-full border border-gold/20 shadow-inner">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200 rounded-full ${
                  isActive
                    ? 'bg-gradient-to-r from-gold/25 to-terracotta/25 text-gold font-bold border border-gold/40 shadow-sm'
                    : 'text-cream/80 hover:text-gold hover:bg-white/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Button & Contact Info */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            to="/reservar"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-gold via-gold-light to-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-carbon shadow-lg shadow-gold/20 transition-all hover:scale-105 hover:shadow-gold/40"
          >
            <Calendar className="h-4 w-4 transition-transform group-hover:rotate-12" />
            <span>Reservar Mesa</span>
            <span className="absolute inset-0 -z-10 translate-x-full bg-white/20 transition-transform group-hover:translate-x-0" />
          </Link>
          <TemaToggle />
        </div>

        <TemaToggle className="sm:hidden" />

        {/* Mobile menu trigger */}
        <button
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-carbon/40 text-gold transition-colors hover:bg-gold hover:text-carbon lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence initial={false}>
      {open && (
        <motion.div
          className="mt-3 overflow-hidden border-t border-gold/20 bg-forest-dark px-5 backdrop-blur-xl lg:hidden"
          initial={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
          animate={{ height: 'auto', opacity: 1, paddingTop: 24, paddingBottom: 24 }}
          exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-wider transition ${
                    isActive
                      ? 'bg-gradient-to-r from-gold/20 to-terracotta/20 text-gold border border-gold/40'
                      : 'text-cream/85 hover:bg-white/5 hover:text-gold'
                  }`
                }
              >
                <span>{link.label}</span>
                <span className="text-gold/40">✦</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 border-t border-gold/15 pt-5">
            <Link
              to="/reservar"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold via-gold-light to-gold py-3.5 text-center text-sm font-bold uppercase tracking-wider text-carbon shadow-lg"
            >
              <Calendar className="h-4 w-4" />
              Reservar Mesa Online
            </Link>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-cream/60">
              <Clock className="h-3.5 w-3.5 text-gold" />
              <span>Horario hoy: 12:00 - 23:00</span>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
      <div className={scrolled ? 'mt-3' : 'mt-4'}>
        <BarraProgreso />
      </div>
    </motion.header>
  )
}

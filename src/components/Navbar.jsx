import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/menu', label: 'Menú' },
  { to: '/reservar', label: 'Reservar' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-forest text-cream shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <NavLink to="/" className="font-display text-2xl font-bold tracking-wide text-cream">
          Restaurante <span className="text-terracotta-light">Amaranto</span>
        </NavLink>

        <nav className="hidden gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium uppercase tracking-wider transition-colors hover:text-terracotta-light ${
                  isActive ? 'text-terracotta-light' : 'text-cream/90'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/reservar"
          className="hidden rounded-full bg-terracotta px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow transition hover:bg-terracotta-dark md:inline-block"
        >
          Reservar Mesa
        </NavLink>

        <button
          className="text-cream md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menú"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-cream/10 bg-forest-dark px-5 py-4 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm font-medium uppercase tracking-wide ${
                  isActive ? 'bg-terracotta/20 text-terracotta-light' : 'text-cream/90'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}

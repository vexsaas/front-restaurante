import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/reservas', label: 'Reservas' },
  { to: '/admin/menu', label: 'Menú' },
  { to: '/admin/mesas', label: 'Mesas' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-cream-dark">
      <aside className="hidden w-64 flex-col bg-forest-dark text-cream md:flex">
        <div className="border-b border-cream/10 px-6 py-6">
          <p className="font-display text-xl font-semibold">Amaranto</p>
          <p className="text-xs uppercase tracking-wider text-cream/60">Panel Admin</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-terracotta text-white' : 'text-cream/80 hover:bg-cream/10'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-cream/10 px-6 py-4">
          <p className="text-xs text-cream/60">Sesión de</p>
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <button
            onClick={handleLogout}
            className="mt-3 w-full rounded-lg border border-cream/20 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cream/90 transition hover:bg-cream/10"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-charcoal/10 bg-white px-6 py-4 md:hidden">
          <p className="font-display text-lg font-semibold text-forest-dark">Panel Admin</p>
          <button onClick={handleLogout} className="text-xs font-semibold uppercase text-terracotta">
            Salir
          </button>
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-charcoal/10 bg-white px-4 py-2 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                  isActive ? 'bg-terracotta text-white' : 'bg-cream text-charcoal/70'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, UtensilsCrossed, Table2, LogOut, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import TemaToggle from '../theme/TemaToggle'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/reservas', label: 'Reservas', icon: Calendar },
  { to: '/admin/menu', label: 'Menú & Platos', icon: UtensilsCrossed },
  { to: '/admin/mesas', label: 'Mesas & Salones', icon: Table2 },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-fondo-alt">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 flex-col bg-forest-dark text-cream md:flex border-r border-gold/20">
        <div className="border-b border-cream/10 px-6 py-6">
          <Logo size="sm" />
          <p className="text-[10px] uppercase tracking-widest text-gold mt-2 font-bold">
            Panel de Gestión Administrativa
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1.5 px-3 py-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-gold to-terracotta text-carbon shadow-md font-bold'
                    : 'text-cream/80 hover:bg-white/5 hover:text-gold'
                }`
              }
            >
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </NavLink>
          ))}

          <NavLink
            to="/"
            className="mt-6 flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gold/80 hover:bg-white/5 border border-gold/20"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Ver Portal Público</span>
          </NavLink>
        </nav>
        <div className="border-t border-cream/10 px-6 py-4 bg-carbon/40">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-cream/50 uppercase tracking-wider">Sesión de</p>
              <p className="truncate text-sm font-bold text-gold">{user?.name || 'Administrador'}</p>
            </div>
            <TemaToggle />
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-cream/20 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cream transition hover:bg-red-900/30 hover:text-red-300"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-charcoal/10 bg-papel px-6 py-4 md:hidden">
          <Logo size="sm" light />
          <button onClick={handleLogout} className="text-xs font-bold uppercase text-terracotta">
            Salir
          </button>
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-charcoal/10 bg-papel px-4 py-2 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                  isActive ? 'bg-terracotta text-white' : 'bg-fondo text-charcoal/70'
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

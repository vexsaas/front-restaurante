import { Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Menu from './pages/Menu'
import Reservar from './pages/Reservar'
import Contacto from './pages/Contacto'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Reservas from './pages/admin/Reservas'
import MenuAdmin from './pages/admin/MenuAdmin'
import Mesas from './pages/admin/Mesas'

export default function App() {
  return (
    <Routes>
      {/* Público */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservar" element={<Reservar />} />
        <Route path="/contacto" element={<Contacto />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/reservas" element={<Reservas />} />
          <Route path="/admin/menu" element={<MenuAdmin />} />
          <Route path="/admin/mesas" element={<Mesas />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-forest-dark px-5 text-center">
      <p className="font-luxury text-xs font-bold uppercase tracking-[0.4em] text-gold">Mesa no encontrada</p>
      <p className="text-gradient-gold font-display text-8xl font-bold leading-none">404</p>
      <p className="max-w-sm text-cream/70">Esta página no está en nuestra carta. Volvamos a un lugar conocido.</p>
      <a
        href="/"
        className="btn-gold-luxury mt-4 rounded-full px-8 py-3 text-sm font-bold uppercase tracking-wide text-carbon"
      >
        Volver al inicio
      </a>
    </div>
  )
}

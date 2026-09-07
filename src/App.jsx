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
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream text-center">
      <p className="font-display text-6xl font-bold text-terracotta">404</p>
      <p className="text-charcoal/70">Página no encontrada.</p>
      <a href="/" className="mt-4 rounded-full bg-forest px-6 py-2 text-sm font-semibold text-white">
        Volver al inicio
      </a>
    </div>
  )
}

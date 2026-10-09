import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/Logo'

const LOGIN_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@restaurante.com')
  const [password, setPassword] = useState('')
  const [verPassword, setVerPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      navigate('/admin')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="grid min-h-screen bg-forest-dark lg:grid-cols-2">
      {/* Panel fotográfico */}
      <div className="relative isolate hidden overflow-hidden lg:block">
        <img src={LOGIN_IMG} alt="" className="hero-zoom absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-carbon via-carbon/60 to-forest-dark/40" />
        <div className="flex h-full flex-col justify-between p-12">
          <Logo size="lg" />
          <div>
            <p className="font-luxury text-xs font-bold uppercase tracking-[0.4em] text-gold">Panel de gestión</p>
            <h1 className="mt-4 max-w-md font-display text-5xl font-bold leading-tight text-cream">
              La sala, la carta y las reservas, <em className="text-gradient-gold">en un solo lugar</em>
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/70">
              Confirma reservas, actualiza platos y organiza tus mesas en tiempo real.
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo size="md" />
          </div>

          <div className="glass-card rounded-3xl p-8 shadow-2xl sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-dark text-gold">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold text-titulo">Bienvenido de nuevo</h2>
            <p className="mt-1 text-sm text-charcoal/60">Ingresa con tu cuenta de administrador.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-dark" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-charcoal/15 bg-fondo-suave py-3 pl-11 pr-4 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-dark" />
                  <input
                    type={verPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-charcoal/15 bg-fondo-suave py-3 pl-11 pr-11 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                  />
                  <button
                    type="button"
                    onClick={() => setVerPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-charcoal/40 hover:text-charcoal"
                    aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {verPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-gold-luxury w-full rounded-full py-3.5 text-sm font-bold uppercase tracking-wide text-carbon disabled:opacity-60"
              >
                {loading ? 'Ingresando...' : 'Ingresar al panel'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setEmail('admin@restaurante.com')
                setPassword('demo1234')
              }}
              className="mt-5 w-full rounded-xl border border-dashed border-gold/50 bg-gold/10 px-4 py-3 text-center text-xs text-charcoal/70 transition hover:bg-gold/20"
            >
              Acceso demo: <strong className="text-titulo">admin@restaurante.com</strong> /{' '}
              <strong className="text-titulo">demo1234</strong> — toca para rellenar
            </button>
          </div>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold/80 hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  )
}

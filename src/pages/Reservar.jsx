import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Compass, Sparkles, SunMedium, Utensils } from 'lucide-react'
import api from '../api/client'

const ubicacionMeta = {
  interior: { label: 'Salón Principal', desc: 'Ambiente cálido y elegante', Icon: Utensils },
  terraza: { label: 'Terraza Jardín', desc: 'Al aire libre con calefacción', Icon: SunMedium },
  ventana: { label: 'Junto al Ventanal', desc: 'Vistas panorámicas a la ciudad', Icon: Compass },
}

function hoyISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Reservar() {
  const [busqueda, setBusqueda] = useState({ fecha: hoyISO(), hora: '19:30', num_personas: 2 })
  const [mesas, setMesas] = useState(null)
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null)
  const [buscando, setBuscando] = useState(false)
  const [errorBusqueda, setErrorBusqueda] = useState('')

  const [cliente, setCliente] = useState({
    cliente_nombre: '',
    cliente_telefono: '',
    cliente_email: '',
    notas: '',
  })
  const [enviando, setEnviando] = useState(false)
  const [errores, setErrores] = useState({})
  const [confirmacion, setConfirmacion] = useState(null)

  async function buscarDisponibilidad(e) {
    e.preventDefault()
    setBuscando(true)
    setErrorBusqueda('')
    setMesas(null)
    setMesaSeleccionada(null)
    try {
      const { data } = await api.get('/disponibilidad', { params: busqueda })
      setMesas(data.data)
    } catch {
      setErrorBusqueda('No se pudo consultar la disponibilidad. Intenta nuevamente.')
    } finally {
      setBuscando(false)
    }
  }

  async function confirmarReserva(e) {
    e.preventDefault()
    setEnviando(true)
    setErrores({})
    try {
      const payload = {
        ...busqueda,
        ...cliente,
        mesa_id: mesaSeleccionada,
      }
      const { data } = await api.post('/reservas', payload)
      setConfirmacion(data)
    } catch (error) {
      if (error.response?.status === 422) {
        setErrores(error.response.data.errors || {})
      } else {
        setErrores({ general: ['Ocurrió un error al crear la reserva. Intenta nuevamente.'] })
      }
    } finally {
      setEnviando(false)
    }
  }

  function nuevaReserva() {
    setConfirmacion(null)
    setMesas(null)
    setMesaSeleccionada(null)
    setCliente({ cliente_nombre: '', cliente_telefono: '', cliente_email: '', notas: '' })
  }

  if (confirmacion) {
    const reserva = confirmacion.data
    return (
      <div className="min-h-[80vh] bg-fondo px-5 py-20 flex items-center justify-center">
        <div className="mx-auto max-w-xl w-full rounded-3xl bg-papel p-8 sm:p-10 shadow-2xl border border-gold/40 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-forest text-gold border-2 border-gold/40 shadow-xl">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta">
            Reserva Exitosa
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-charcoal">
            ¡Te esperamos en Amaranto!
          </h1>
          <p className="mt-3 text-sm text-charcoal/70">{confirmacion.message}</p>

          <div className="mt-8 rounded-2xl bg-fondo p-6 text-left border border-charcoal/10 shadow-inner space-y-3">
            <div className="flex justify-between border-b border-charcoal/10 pb-2 text-sm">
              <span className="text-charcoal/60">Titular</span>
              <strong className="text-charcoal font-semibold">{reserva.cliente_nombre}</strong>
            </div>
            <div className="flex justify-between border-b border-charcoal/10 pb-2 text-sm">
              <span className="text-charcoal/60">Comensales</span>
              <strong className="text-charcoal font-semibold">{reserva.num_personas} personas</strong>
            </div>
            <div className="flex justify-between border-b border-charcoal/10 pb-2 text-sm">
              <span className="text-charcoal/60">Fecha &amp; Hora</span>
              <strong className="text-charcoal font-semibold">{reserva.fecha} a las {reserva.hora}</strong>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-charcoal/60">Mesa / Ambiente</span>
              <strong className="text-verde font-bold">
                {reserva.mesa ? `Mesa #${reserva.mesa.numero} (${reserva.mesa.ubicacion})` : 'Mesa Principal Asignada'}
              </strong>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={nuevaReserva}
              className="flex-1 rounded-full border-2 border-terracotta py-3 text-xs font-bold uppercase tracking-wider text-terracotta transition hover:bg-terracotta hover:text-white"
            >
              Hacer otra reserva
            </button>
            <Link
              to="/"
              className="btn-gold-luxury flex-1 rounded-full py-3 text-xs font-bold uppercase tracking-wider text-carbon shadow-lg"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-fondo pb-24">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-forest-dark py-16 text-cream border-b border-gold/20">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-carbon/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Experiencia Gastronómica Exclusiva
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl text-cream">
            Reservar una <span className="text-gradient-gold italic">Mesa</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-cream/80 font-light">
            Selecciona la fecha, el horario y tus preferencias de salón para asegurar tu lugar.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 -mt-6">
        {/* Step 1: Availability Search */}
        <div className="rounded-3xl bg-papel p-6 sm:p-8 shadow-xl border border-charcoal/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-gold font-bold text-xs">
              1
            </div>
            <h2 className="font-display text-xl font-bold text-charcoal">
              Consulta de Disponibilidad
            </h2>
          </div>

          <form onSubmit={buscarDisponibilidad} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal/60">
                Fecha
              </label>
              <input
                type="date"
                required
                min={hoyISO()}
                value={busqueda.fecha}
                onChange={(e) => setBusqueda({ ...busqueda, fecha: e.target.value })}
                className="w-full rounded-xl border border-charcoal/20 bg-fondo-suave px-3.5 py-2.5 text-sm font-medium text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal/60">
                Hora
              </label>
              <input
                type="time"
                required
                value={busqueda.hora}
                onChange={(e) => setBusqueda({ ...busqueda, hora: e.target.value })}
                className="w-full rounded-xl border border-charcoal/20 bg-fondo-suave px-3.5 py-2.5 text-sm font-medium text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal/60">
                Comensales
              </label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={busqueda.num_personas}
                onChange={(e) => setBusqueda({ ...busqueda, num_personas: Number(e.target.value) })}
                className="w-full rounded-xl border border-charcoal/20 bg-fondo-suave px-3.5 py-2.5 text-sm font-medium text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={buscando}
                className="btn-gold-luxury w-full rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider text-carbon shadow-md"
              >
                {buscando ? 'Consultando...' : 'Buscar Mesas'}
              </button>
            </div>
          </form>

          {errorBusqueda && (
            <p className="mt-4 text-center text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">
              {errorBusqueda}
            </p>
          )}
        </div>

        {/* Step 2: Table and Details */}
        {mesas && (
          <div className="mt-8 space-y-8 animate-in fade-in duration-300">
            {mesas.length === 0 ? (
              <div className="rounded-2xl bg-amber-50 p-6 text-center border border-amber-200">
                <p className="text-sm text-amber-900 font-medium">
                  No hay mesas disponibles en ese horario exacto. Te sugerimos probar 30 minutos antes o después.
                </p>
              </div>
            ) : (
              <div className="rounded-3xl bg-papel p-6 sm:p-8 shadow-xl border border-charcoal/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-gold font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-charcoal">
                      Elige tu Mesa o Salón ({mesas.length} disponibles)
                    </h2>
                    <p className="text-xs text-charcoal/60">
                      Selección opcional: puedes hacer clic para preferir un ambiente específico.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {mesas.map((mesa) => {
                    const meta = ubicacionMeta[mesa.ubicacion] || {
                      label: mesa.ubicacion,
                      desc: '',
                      Icon: Utensils,
                    }
                    const isSelected = mesaSeleccionada === mesa.id
                    return (
                      <button
                        key={mesa.id}
                        type="button"
                        onClick={() => setMesaSeleccionada(isSelected ? null : mesa.id)}
                        className={`flex items-start gap-3.5 rounded-2xl p-4 text-left transition-all border-2 ${
                          isSelected
                            ? 'border-gold bg-gradient-to-br from-gold/15 to-transparent shadow-md'
                            : 'border-charcoal/10 hover:border-gold/50 bg-cream/20'
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isSelected ? 'bg-forest text-gold' : 'bg-charcoal/5 text-charcoal/60'
                          }`}
                        >
                          <meta.Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-display font-bold text-charcoal text-base">
                            Mesa #{mesa.numero}
                          </p>
                          <p className="text-xs font-semibold text-terracotta">{meta.label}</p>
                          <p className="text-[11px] text-charcoal/50">Capacidad: {mesa.capacidad} personas</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Guest details form */}
            <form
              onSubmit={confirmarReserva}
              className="rounded-3xl bg-papel p-6 sm:p-8 shadow-xl border border-charcoal/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-gold font-bold text-xs">
                  3
                </div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  Datos de Contacto &amp; Peticiones
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal/60">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={cliente.cliente_nombre}
                    onChange={(e) => setCliente({ ...cliente, cliente_nombre: e.target.value })}
                    placeholder="Ej. Gabriela Morales"
                    className="w-full rounded-xl border border-charcoal/20 bg-fondo-suave px-3.5 py-2.5 text-sm font-medium text-charcoal focus:border-gold focus:outline-none"
                  />
                  {errores.cliente_nombre && (
                    <p className="mt-1 text-xs text-red-600">{errores.cliente_nombre[0]}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal/60">
                    Teléfono Celular *
                  </label>
                  <input
                    type="tel"
                    required
                    value={cliente.cliente_telefono}
                    onChange={(e) => setCliente({ ...cliente, cliente_telefono: e.target.value })}
                    placeholder="Ej. +593 99 123 4567"
                    className="w-full rounded-xl border border-charcoal/20 bg-fondo-suave px-3.5 py-2.5 text-sm font-medium text-charcoal focus:border-gold focus:outline-none"
                  />
                  {errores.cliente_telefono && (
                    <p className="mt-1 text-xs text-red-600">{errores.cliente_telefono[0]}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal/60">
                    Correo Electrónico (opcional)
                  </label>
                  <input
                    type="email"
                    value={cliente.cliente_email}
                    onChange={(e) => setCliente({ ...cliente, cliente_email: e.target.value })}
                    placeholder="contacto@ejemplo.com"
                    className="w-full rounded-xl border border-charcoal/20 bg-fondo-suave px-3.5 py-2.5 text-sm font-medium text-charcoal focus:border-gold focus:outline-none"
                  />
                  {errores.cliente_email && (
                    <p className="mt-1 text-xs text-red-600">{errores.cliente_email[0]}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal/60">
                    Ocasión o Notas Especiales
                  </label>
                  <input
                    type="text"
                    value={cliente.notas}
                    onChange={(e) => setCliente({ ...cliente, notas: e.target.value })}
                    placeholder="Ej. Aniversario, alergia a frutos secos..."
                    className="w-full rounded-xl border border-charcoal/20 bg-fondo-suave px-3.5 py-2.5 text-sm font-medium text-charcoal focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              {errores.general && (
                <p className="mt-4 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">
                  {errores.general[0]}
                </p>
              )}

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={enviando}
                  className="btn-gold-luxury w-full rounded-full py-4 text-sm font-bold uppercase tracking-wider text-carbon shadow-xl"
                >
                  {enviando ? 'Confirmando Reserva...' : 'Confirmar Reserva en Amaranto'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

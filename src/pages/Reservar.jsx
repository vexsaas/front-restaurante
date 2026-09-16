import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import api from '../api/client'

const ubicacionLabel = {
  interior: 'Interior',
  terraza: 'Terraza',
  ventana: 'Junto a la ventana',
}

function hoyISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Reservar() {
  const [busqueda, setBusqueda] = useState({ fecha: hoyISO(), hora: '19:00', num_personas: 2 })
  const [mesas, setMesas] = useState(null)
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null)
  const [buscando, setBuscando] = useState(false)
  const [errorBusqueda, setErrorBusqueda] = useState('')

  const [cliente, setCliente] = useState({ cliente_nombre: '', cliente_telefono: '', cliente_email: '', notas: '' })
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
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl font-bold text-charcoal">¡Reserva Confirmada!</h1>
        <p className="mt-3 text-charcoal/70">{confirmacion.message}</p>

        <div className="mt-8 w-full rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-charcoal/5">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-charcoal/50">Nombre</dt>
              <dd className="font-medium">{reserva.cliente_nombre}</dd>
            </div>
            <div>
              <dt className="text-charcoal/50">Personas</dt>
              <dd className="font-medium">{reserva.num_personas}</dd>
            </div>
            <div>
              <dt className="text-charcoal/50">Fecha</dt>
              <dd className="font-medium">{reserva.fecha}</dd>
            </div>
            <div>
              <dt className="text-charcoal/50">Hora</dt>
              <dd className="font-medium">{reserva.hora}</dd>
            </div>
            <div>
              <dt className="text-charcoal/50">Mesa asignada</dt>
              <dd className="font-medium">
                {reserva.mesa ? `Mesa ${reserva.mesa.numero} (${ubicacionLabel[reserva.mesa.ubicacion]})` : 'Por confirmar'}
              </dd>
            </div>
            <div>
              <dt className="text-charcoal/50">Estado</dt>
              <dd className="font-medium capitalize">{reserva.estado}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={nuevaReserva}
            className="rounded-full border-2 border-terracotta px-6 py-2.5 text-sm font-semibold uppercase text-terracotta transition hover:bg-terracotta hover:text-white"
          >
            Nueva reserva
          </button>
          <Link
            to="/"
            className="rounded-full bg-forest px-6 py-2.5 text-sm font-semibold uppercase text-white transition hover:bg-forest-dark"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-terracotta">
          Te esperamos
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-charcoal">Reservar una Mesa</h1>
        <p className="mx-auto mt-3 max-w-lg text-charcoal/70">
          Elige la fecha, hora y número de comensales para consultar disponibilidad en tiempo real.
        </p>
      </div>

      {/* Paso 1: búsqueda de disponibilidad */}
      <form
        onSubmit={buscarDisponibilidad}
        className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-charcoal/5 sm:grid-cols-4"
      >
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-charcoal/50">Fecha</label>
          <input
            type="date"
            required
            min={hoyISO()}
            value={busqueda.fecha}
            onChange={(e) => setBusqueda({ ...busqueda, fecha: e.target.value })}
            className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-charcoal/50">Hora</label>
          <input
            type="time"
            required
            value={busqueda.hora}
            onChange={(e) => setBusqueda({ ...busqueda, hora: e.target.value })}
            className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-charcoal/50">Personas</label>
          <input
            type="number"
            min="1"
            max="30"
            required
            value={busqueda.num_personas}
            onChange={(e) => setBusqueda({ ...busqueda, num_personas: Number(e.target.value) })}
            className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={buscando}
            className="w-full rounded-lg bg-terracotta px-4 py-2 text-sm font-semibold uppercase text-white transition hover:bg-terracotta-dark disabled:opacity-60"
          >
            {buscando ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {errorBusqueda && <p className="mt-4 text-center text-sm text-red-600">{errorBusqueda}</p>}

      {/* Resultados de disponibilidad */}
      {mesas && (
        <div className="mt-8">
          {mesas.length === 0 ? (
            <p className="rounded-xl bg-gold/10 p-4 text-center text-sm text-charcoal/70">
              No encontramos mesas disponibles para ese horario exacto. Puedes intentar con otra hora
              o de todas formas dejar tu solicitud y te contactaremos.
            </p>
          ) : (
            <>
              <h2 className="mb-3 font-display text-lg font-semibold text-charcoal">
                Mesas disponibles ({mesas.length})
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {mesas.map((mesa) => (
                  <button
                    key={mesa.id}
                    type="button"
                    onClick={() => setMesaSeleccionada(mesa.id === mesaSeleccionada ? null : mesa.id)}
                    className={`rounded-xl border-2 p-4 text-left text-sm transition ${
                      mesaSeleccionada === mesa.id
                        ? 'border-terracotta bg-terracotta/10'
                        : 'border-charcoal/10 hover:border-terracotta/50'
                    }`}
                  >
                    <p className="font-display font-semibold text-charcoal">Mesa {mesa.numero}</p>
                    <p className="text-xs text-charcoal/60">Capacidad: {mesa.capacidad}</p>
                    <p className="text-xs text-charcoal/60">{ubicacionLabel[mesa.ubicacion]}</p>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-charcoal/50">
                Selección opcional: si no eliges una mesa, te asignaremos automáticamente la más
                adecuada.
              </p>
            </>
          )}

          {/* Paso 2: datos del cliente */}
          <form
            onSubmit={confirmarReserva}
            className="mt-8 grid grid-cols-1 gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-charcoal/5 sm:grid-cols-2"
          >
            <h2 className="col-span-full font-display text-lg font-semibold text-charcoal">
              Tus datos
            </h2>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-charcoal/50">
                Nombre completo
              </label>
              <input
                type="text"
                required
                value={cliente.cliente_nombre}
                onChange={(e) => setCliente({ ...cliente, cliente_nombre: e.target.value })}
                className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
              />
              {errores.cliente_nombre && <p className="mt-1 text-xs text-red-600">{errores.cliente_nombre[0]}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-charcoal/50">Teléfono</label>
              <input
                type="tel"
                required
                value={cliente.cliente_telefono}
                onChange={(e) => setCliente({ ...cliente, cliente_telefono: e.target.value })}
                className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
              />
              {errores.cliente_telefono && (
                <p className="mt-1 text-xs text-red-600">{errores.cliente_telefono[0]}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-charcoal/50">
                Correo (opcional)
              </label>
              <input
                type="email"
                value={cliente.cliente_email}
                onChange={(e) => setCliente({ ...cliente, cliente_email: e.target.value })}
                className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
              />
              {errores.cliente_email && <p className="mt-1 text-xs text-red-600">{errores.cliente_email[0]}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-charcoal/50">
                Notas (opcional)
              </label>
              <input
                type="text"
                value={cliente.notas}
                onChange={(e) => setCliente({ ...cliente, notas: e.target.value })}
                placeholder="Ej. celebración, alergias, preferencia de mesa..."
                className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
              />
            </div>

            {errores.general && <p className="col-span-full text-sm text-red-600">{errores.general[0]}</p>}
            {errores.mesa_id && <p className="col-span-full text-sm text-red-600">{errores.mesa_id[0]}</p>}

            <div className="col-span-full">
              <button
                type="submit"
                disabled={enviando}
                className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-forest-dark disabled:opacity-60"
              >
                {enviando ? 'Confirmando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

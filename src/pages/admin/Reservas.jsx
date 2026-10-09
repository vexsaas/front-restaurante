import { useEffect, useState } from 'react'
import api from '../../api/client'
import EstadoBadge from '../../components/EstadoBadge'
import Spinner from '../../components/Spinner'

const estados = ['pendiente', 'confirmada', 'cancelada', 'completada']

export default function Reservas() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({ estado: '', fecha: '' })

  function cargar() {
    setLoading(true)
    const params = {}
    if (filtros.estado) params.estado = filtros.estado
    if (filtros.fecha) params.fecha = filtros.fecha
    api
      .get('/admin/reservas', { params })
      .then(({ data }) => setReservas(data.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros])

  async function cambiarEstado(reserva, estado) {
    await api.put(`/admin/reservas/${reserva.id}`, { estado })
    setReservas((prev) => prev.map((r) => (r.id === reserva.id ? { ...r, estado } : r)))
  }

  async function eliminar(reserva) {
    if (!confirm(`¿Eliminar la reserva de ${reserva.cliente_nombre}?`)) return
    await api.delete(`/admin/reservas/${reserva.id}`)
    setReservas((prev) => prev.filter((r) => r.id !== reserva.id))
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-titulo">Reservas</h1>
          <p className="mt-1 text-sm text-charcoal/60">Gestiona las reservas de los clientes.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
            className="rounded-xl border border-charcoal/15 bg-fondo-suave px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          >
            <option value="">Todos los estados</option>
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filtros.fecha}
            onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
            className="rounded-xl border border-charcoal/15 bg-fondo-suave px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
          {(filtros.estado || filtros.fecha) && (
            <button
              onClick={() => setFiltros({ estado: '', fecha: '' })}
              className="rounded-lg border border-charcoal/15 px-3 py-2 text-sm text-charcoal/60 hover:bg-charcoal/5"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <Spinner label="Cargando reservas..." />
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-papel shadow-md shadow-charcoal/5 ring-1 ring-gold/20">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-forest-dark text-[11px] uppercase tracking-wider text-gold">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Hora</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3">Personas</th>
                <th className="px-4 py-3">Mesa</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {reservas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-charcoal/50">
                    No hay reservas que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                reservas.map((reserva) => (
                  <tr key={reserva.id} className="transition hover:bg-cream-light">
                    <td className="px-4 py-3">{reserva.fecha}</td>
                    <td className="px-4 py-3">{reserva.hora}</td>
                    <td className="px-4 py-3 font-medium">{reserva.cliente_nombre}</td>
                    <td className="px-4 py-3 text-xs text-charcoal/60">
                      {reserva.cliente_telefono}
                      <br />
                      {reserva.cliente_email}
                    </td>
                    <td className="px-4 py-3">{reserva.num_personas}</td>
                    <td className="px-4 py-3">{reserva.mesa ? `#${reserva.mesa.numero}` : '—'}</td>
                    <td className="px-4 py-3">
                      <EstadoBadge estado={reserva.estado} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={reserva.estado}
                          onChange={(e) => cambiarEstado(reserva, e.target.value)}
                          className="rounded-xl border border-charcoal/15 bg-fondo-suave px-2 py-1 text-xs focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                        >
                          {estados.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => eliminar(reserva)}
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

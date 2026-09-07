import { useEffect, useState } from 'react'
import api from '../../api/client'
import StatCard from '../../components/StatCard'
import EstadoBadge from '../../components/EstadoBadge'
import Spinner from '../../components/Spinner'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then(({ data }) => setData(data.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner label="Cargando panel..." />
  if (!data) return <p className="text-charcoal/60">No se pudo cargar la información.</p>

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-charcoal">Dashboard</h1>
      <p className="mt-1 text-sm text-charcoal/60">Resumen de la actividad del restaurante hoy.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Reservas Hoy" value={data.reservas_hoy_total} accent="terracotta" />
        <StatCard label="Pendientes" value={data.reservas_pendientes} accent="gold" />
        <StatCard
          label="Ocupación Esta Noche"
          value={data.ocupacion_esta_noche}
          hint="Personas desde las 18:00"
          accent="forest"
        />
        <StatCard label="Mesas Totales" value={data.total_mesas} accent="terracotta" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold text-charcoal">Reservas de Hoy</h2>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-charcoal/5">
            {data.reservas_hoy.length === 0 ? (
              <p className="p-6 text-sm text-charcoal/50">No hay reservas registradas para hoy.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-cream-dark text-xs uppercase text-charcoal/50">
                  <tr>
                    <th className="px-4 py-3">Hora</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Personas</th>
                    <th className="px-4 py-3">Mesa</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {data.reservas_hoy.map((reserva) => (
                    <tr key={reserva.id}>
                      <td className="px-4 py-3 font-medium">{reserva.hora}</td>
                      <td className="px-4 py-3">{reserva.cliente_nombre}</td>
                      <td className="px-4 py-3">{reserva.num_personas}</td>
                      <td className="px-4 py-3">{reserva.mesa ? `#${reserva.mesa.numero}` : '—'}</td>
                      <td className="px-4 py-3">
                        <EstadoBadge estado={reserva.estado} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-charcoal">Platos Destacados</h2>
          <div className="space-y-3">
            {data.platos_destacados.map((plato) => (
              <div
                key={plato.id}
                className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-charcoal/5"
              >
                <img src={plato.imagen_url} alt={plato.nombre} className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-charcoal">{plato.nombre}</p>
                  <p className="text-xs text-charcoal/50">${Number(plato.precio).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

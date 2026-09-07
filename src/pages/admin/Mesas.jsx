import { useEffect, useState } from 'react'
import api from '../../api/client'
import Spinner from '../../components/Spinner'

const vacio = { numero: '', capacidad: '', ubicacion: 'interior' }

export default function Mesas() {
  const [mesas, setMesas] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(vacio)
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  function cargar() {
    setLoading(true)
    api
      .get('/admin/mesas')
      .then(({ data }) => setMesas(data.data))
      .finally(() => setLoading(false))
  }

  useEffect(cargar, [])

  function editar(mesa) {
    setEditandoId(mesa.id)
    setForm({ numero: mesa.numero, capacidad: mesa.capacidad, ubicacion: mesa.ubicacion })
    setError('')
  }

  function cancelar() {
    setEditandoId(null)
    setForm(vacio)
    setError('')
  }

  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)
    setError('')
    const payload = {
      numero: Number(form.numero),
      capacidad: Number(form.capacidad),
      ubicacion: form.ubicacion,
    }
    try {
      if (editandoId) {
        const { data } = await api.put(`/admin/mesas/${editandoId}`, payload)
        setMesas((prev) => prev.map((m) => (m.id === editandoId ? data.data : m)))
      } else {
        const { data } = await api.post('/admin/mesas', payload)
        setMesas((prev) => [...prev, data.data].sort((a, b) => a.numero - b.numero))
      }
      cancelar()
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' ')
        : 'No se pudo guardar la mesa.'
      setError(msg)
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar(mesa) {
    if (!confirm(`¿Eliminar la mesa número ${mesa.numero}?`)) return
    try {
      await api.delete(`/admin/mesas/${mesa.id}`)
      setMesas((prev) => prev.filter((m) => m.id !== mesa.id))
    } catch (err) {
      alert(err.response?.data?.message || 'No se pudo eliminar la mesa.')
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-charcoal">Mesas</h1>
      <p className="mt-1 text-sm text-charcoal/60">Administra las mesas disponibles del restaurante.</p>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form onSubmit={guardar} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-charcoal/5">
          <h2 className="font-display text-lg font-semibold text-charcoal">
            {editandoId ? 'Editar mesa' : 'Nueva mesa'}
          </h2>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-charcoal/50">Número</label>
            <input
              type="number"
              min="1"
              required
              value={form.numero}
              onChange={(e) => setForm({ ...form, numero: e.target.value })}
              className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-charcoal/50">Capacidad</label>
            <input
              type="number"
              min="1"
              max="50"
              required
              value={form.capacidad}
              onChange={(e) => setForm({ ...form, capacidad: e.target.value })}
              className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-charcoal/50">Ubicación</label>
            <select
              value={form.ubicacion}
              onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
              className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
            >
              <option value="interior">Interior</option>
              <option value="terraza">Terraza</option>
              <option value="ventana">Ventana</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 rounded-full bg-terracotta py-2.5 text-sm font-semibold uppercase text-white transition hover:bg-terracotta-dark disabled:opacity-60"
            >
              {editandoId ? 'Actualizar' : 'Crear'}
            </button>
            {editandoId && (
              <button
                type="button"
                onClick={cancelar}
                className="rounded-full border border-charcoal/20 px-4 py-2.5 text-sm text-charcoal/60 hover:bg-charcoal/5"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="lg:col-span-2">
          {loading ? (
            <Spinner label="Cargando mesas..." />
          ) : (
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-charcoal/5">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream-dark text-xs uppercase text-charcoal/50">
                  <tr>
                    <th className="px-4 py-3">Número</th>
                    <th className="px-4 py-3">Capacidad</th>
                    <th className="px-4 py-3">Ubicación</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {mesas.map((mesa) => (
                    <tr key={mesa.id}>
                      <td className="px-4 py-3 font-medium">Mesa {mesa.numero}</td>
                      <td className="px-4 py-3">{mesa.capacidad} personas</td>
                      <td className="px-4 py-3 capitalize">{mesa.ubicacion}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => editar(mesa)}
                            className="rounded-lg px-2 py-1 text-xs font-semibold text-forest hover:bg-forest/10"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminar(mesa)}
                            className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

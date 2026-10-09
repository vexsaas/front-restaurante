import { useEffect, useState } from 'react'
import api from '../../api/client'
import Spinner from '../../components/Spinner'

const platoVacio = {
  nombre: '',
  descripcion: '',
  precio: '',
  categoria_id: '',
  imagen_url: '',
  disponible: true,
  destacado: false,
  es_vegetariano: false,
}

export default function MenuAdmin() {
  const [categorias, setCategorias] = useState([])
  const [platos, setPlatos] = useState([])
  const [loading, setLoading] = useState(true)

  const [nombreCategoria, setNombreCategoria] = useState('')
  const [ordenCategoria, setOrdenCategoria] = useState(0)
  const [editandoCategoriaId, setEditandoCategoriaId] = useState(null)

  const [formPlato, setFormPlato] = useState(platoVacio)
  const [editandoPlatoId, setEditandoPlatoId] = useState(null)
  const [errorPlato, setErrorPlato] = useState('')
  const [guardandoPlato, setGuardandoPlato] = useState(false)
  const [filtroCategoria, setFiltroCategoria] = useState('todas')

  function cargar() {
    setLoading(true)
    Promise.all([api.get('/admin/categorias-menu'), api.get('/admin/platos')])
      .then(([resCategorias, resPlatos]) => {
        setCategorias(resCategorias.data.data)
        setPlatos(resPlatos.data.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(cargar, [])

  // --- Categorías ---
  async function guardarCategoria(e) {
    e.preventDefault()
    const payload = { nombre: nombreCategoria, orden: Number(ordenCategoria) || 0 }
    if (editandoCategoriaId) {
      const { data } = await api.put(`/admin/categorias-menu/${editandoCategoriaId}`, payload)
      setCategorias((prev) =>
        prev.map((c) => (c.id === editandoCategoriaId ? { ...c, ...data.data } : c)).sort((a, b) => a.orden - b.orden)
      )
    } else {
      const { data } = await api.post('/admin/categorias-menu', payload)
      setCategorias((prev) => [...prev, data.data].sort((a, b) => a.orden - b.orden))
    }
    setNombreCategoria('')
    setOrdenCategoria(0)
    setEditandoCategoriaId(null)
  }

  function editarCategoria(categoria) {
    setEditandoCategoriaId(categoria.id)
    setNombreCategoria(categoria.nombre)
    setOrdenCategoria(categoria.orden)
  }

  async function eliminarCategoria(categoria) {
    if (!confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return
    try {
      await api.delete(`/admin/categorias-menu/${categoria.id}`)
      setCategorias((prev) => prev.filter((c) => c.id !== categoria.id))
    } catch (err) {
      alert(err.response?.data?.message || 'No se pudo eliminar la categoría.')
    }
  }

  // --- Platos ---
  function editarPlato(plato) {
    setEditandoPlatoId(plato.id)
    setFormPlato({
      nombre: plato.nombre,
      descripcion: plato.descripcion || '',
      precio: plato.precio,
      categoria_id: plato.categoria_id,
      imagen_url: plato.imagen_url || '',
      disponible: plato.disponible,
      destacado: plato.destacado,
      es_vegetariano: plato.es_vegetariano,
    })
    setErrorPlato('')
  }

  function cancelarPlato() {
    setEditandoPlatoId(null)
    setFormPlato(platoVacio)
    setErrorPlato('')
  }

  async function guardarPlato(e) {
    e.preventDefault()
    setGuardandoPlato(true)
    setErrorPlato('')
    const payload = {
      ...formPlato,
      precio: Number(formPlato.precio),
      categoria_id: Number(formPlato.categoria_id),
      imagen_url: formPlato.imagen_url || `https://picsum.photos/seed/plato-${Date.now()}/600/400`,
    }
    try {
      if (editandoPlatoId) {
        const { data } = await api.put(`/admin/platos/${editandoPlatoId}`, payload)
        setPlatos((prev) => prev.map((p) => (p.id === editandoPlatoId ? data.data : p)))
      } else {
        const { data } = await api.post('/admin/platos', payload)
        setPlatos((prev) => [...prev, data.data])
      }
      cancelarPlato()
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' ')
        : 'No se pudo guardar el plato.'
      setErrorPlato(msg)
    } finally {
      setGuardandoPlato(false)
    }
  }

  async function eliminarPlato(plato) {
    if (!confirm(`¿Eliminar "${plato.nombre}"?`)) return
    await api.delete(`/admin/platos/${plato.id}`)
    setPlatos((prev) => prev.filter((p) => p.id !== plato.id))
  }

  async function alternar(plato, campo) {
    const { data } = await api.put(`/admin/platos/${plato.id}`, { [campo]: !plato[campo] })
    setPlatos((prev) => prev.map((p) => (p.id === plato.id ? data.data : p)))
  }

  const platosFiltrados = platos.filter(
    (p) => filtroCategoria === 'todas' || String(p.categoria_id) === filtroCategoria
  )

  if (loading) return <Spinner label="Cargando menú..." />

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-titulo">Gestión del Menú</h1>
      <p className="mt-1 text-sm text-charcoal/60">Administra categorías y platos del restaurante.</p>

      {/* Categorías */}
      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-semibold text-titulo">Categorías</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <form onSubmit={guardarCategoria} className="space-y-3 rounded-2xl bg-papel p-5 shadow-md shadow-charcoal/5 ring-1 ring-gold/20">
            <input
              type="text"
              placeholder="Nombre de la categoría"
              required
              value={nombreCategoria}
              onChange={(e) => setNombreCategoria(e.target.value)}
              className="w-full rounded-xl border border-charcoal/15 bg-fondo-suave px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
            <input
              type="number"
              placeholder="Orden"
              value={ordenCategoria}
              onChange={(e) => setOrdenCategoria(e.target.value)}
              className="w-full rounded-xl border border-charcoal/15 bg-fondo-suave px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="btn-gold-luxury flex-1 rounded-full py-2 text-sm font-bold uppercase tracking-wide text-carbon"
              >
                {editandoCategoriaId ? 'Actualizar' : 'Agregar'}
              </button>
              {editandoCategoriaId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditandoCategoriaId(null)
                    setNombreCategoria('')
                    setOrdenCategoria(0)
                  }}
                  className="rounded-full border border-charcoal/20 px-4 py-2 text-sm text-charcoal/60"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl bg-papel shadow-md shadow-charcoal/5 ring-1 ring-gold/20">
              <table className="w-full text-left text-sm">
                <thead className="bg-forest-dark text-[11px] uppercase tracking-wider text-gold">
                  <tr>
                    <th className="px-4 py-3">Orden</th>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Platos</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {categorias.map((categoria) => (
                    <tr key={categoria.id} className="transition hover:bg-cream-light">
                      <td className="px-4 py-3">{categoria.orden}</td>
                      <td className="px-4 py-3 font-medium">{categoria.nombre}</td>
                      <td className="px-4 py-3">{platos.filter((p) => p.categoria_id === categoria.id).length}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => editarCategoria(categoria)}
                            className="rounded-lg px-2 py-1 text-xs font-semibold text-verde hover:bg-forest/10"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarCategoria(categoria)}
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
          </div>
        </div>
      </section>

      {/* Platos */}
      <section className="mt-12">
        <h2 className="mb-3 font-display text-xl font-semibold text-titulo">Platos</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <form onSubmit={guardarPlato} className="space-y-3 rounded-2xl bg-papel p-5 shadow-md shadow-charcoal/5 ring-1 ring-gold/20">
            <input
              type="text"
              placeholder="Nombre del plato"
              required
              value={formPlato.nombre}
              onChange={(e) => setFormPlato({ ...formPlato, nombre: e.target.value })}
              className="w-full rounded-xl border border-charcoal/15 bg-fondo-suave px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
            <textarea
              placeholder="Descripción"
              rows={2}
              value={formPlato.descripcion}
              onChange={(e) => setFormPlato({ ...formPlato, descripcion: e.target.value })}
              className="w-full rounded-xl border border-charcoal/15 bg-fondo-suave px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Precio"
                required
                value={formPlato.precio}
                onChange={(e) => setFormPlato({ ...formPlato, precio: e.target.value })}
                className="w-full rounded-xl border border-charcoal/15 bg-fondo-suave px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
              <select
                required
                value={formPlato.categoria_id}
                onChange={(e) => setFormPlato({ ...formPlato, categoria_id: e.target.value })}
                className="w-full rounded-xl border border-charcoal/15 bg-fondo-suave px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              >
                <option value="">Categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="URL de imagen (opcional, se genera una si se deja vacío)"
              value={formPlato.imagen_url}
              onChange={(e) => setFormPlato({ ...formPlato, imagen_url: e.target.value })}
              className="w-full rounded-xl border border-charcoal/15 bg-fondo-suave px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
            <div className="flex flex-wrap gap-4 text-sm text-charcoal/70">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formPlato.disponible}
                  onChange={(e) => setFormPlato({ ...formPlato, disponible: e.target.checked })}
                />
                Disponible
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formPlato.destacado}
                  onChange={(e) => setFormPlato({ ...formPlato, destacado: e.target.checked })}
                />
                Destacado
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formPlato.es_vegetariano}
                  onChange={(e) => setFormPlato({ ...formPlato, es_vegetariano: e.target.checked })}
                />
                Vegetariano
              </label>
            </div>

            {errorPlato && <p className="text-sm text-red-600">{errorPlato}</p>}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={guardandoPlato}
                className="btn-gold-luxury flex-1 rounded-full py-2 text-sm font-bold uppercase tracking-wide text-carbon disabled:opacity-60"
              >
                {editandoPlatoId ? 'Actualizar' : 'Agregar'}
              </button>
              {editandoPlatoId && (
                <button
                  type="button"
                  onClick={cancelarPlato}
                  className="rounded-full border border-charcoal/20 px-4 py-2 text-sm text-charcoal/60"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="lg:col-span-2">
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                onClick={() => setFiltroCategoria('todas')}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  filtroCategoria === 'todas' ? 'border-forest-dark bg-forest-dark text-gold' : 'border-charcoal/15 text-charcoal/60'
                }`}
              >
                Todas
              </button>
              {categorias.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFiltroCategoria(String(c.id))}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                    filtroCategoria === String(c.id)
                      ? 'border-forest-dark bg-forest-dark text-gold'
                      : 'border-charcoal/15 text-charcoal/60'
                  }`}
                >
                  {c.nombre}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto rounded-2xl bg-papel shadow-md shadow-charcoal/5 ring-1 ring-gold/20">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-forest-dark text-[11px] uppercase tracking-wider text-gold">
                  <tr>
                    <th className="px-4 py-3">Plato</th>
                    <th className="px-4 py-3">Precio</th>
                    <th className="px-4 py-3">Disponible</th>
                    <th className="px-4 py-3">Destacado</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {platosFiltrados.map((plato) => (
                    <tr key={plato.id} className="transition hover:bg-cream-light">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={plato.imagen_url} alt={plato.nombre} className="h-10 w-10 rounded-lg object-cover" />
                          <span className="font-medium">{plato.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">${Number(plato.precio).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => alternar(plato, 'disponible')}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            plato.disponible ? 'bg-forest/15 text-verde' : 'bg-charcoal/10 text-charcoal/50'
                          }`}
                        >
                          {plato.disponible ? 'Sí' : 'No'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => alternar(plato, 'destacado')}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            plato.destacado ? 'bg-terracotta/15 text-terracotta' : 'bg-charcoal/10 text-charcoal/50'
                          }`}
                        >
                          {plato.destacado ? 'Sí' : 'No'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => editarPlato(plato)}
                            className="rounded-lg px-2 py-1 text-xs font-semibold text-verde hover:bg-forest/10"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarPlato(plato)}
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
          </div>
        </div>
      </section>
    </div>
  )
}

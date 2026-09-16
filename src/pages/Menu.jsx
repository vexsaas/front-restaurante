import { useEffect, useMemo, useState } from 'react'
import { Leaf } from 'lucide-react'
import api from '../api/client'
import PlatoCard from '../components/PlatoCard'
import Spinner from '../components/Spinner'

export default function Menu() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoriaActiva, setCategoriaActiva] = useState('todas')
  const [soloVegetariano, setSoloVegetariano] = useState(false)

  useEffect(() => {
    api
      .get('/menu')
      .then(({ data }) => setCategorias(data.data))
      .finally(() => setLoading(false))
  }, [])

  const categoriasFiltradas = useMemo(() => {
    return categorias
      .filter((categoria) => categoriaActiva === 'todas' || String(categoria.id) === categoriaActiva)
      .map((categoria) => ({
        ...categoria,
        platos: categoria.platos.filter((plato) => !soloVegetariano || plato.es_vegetariano),
      }))
      .filter((categoria) => categoria.platos.length > 0)
  }, [categorias, categoriaActiva, soloVegetariano])

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-terracotta">
          Nuestra propuesta
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-charcoal">Menú</h1>
        <p className="mx-auto mt-3 max-w-xl text-charcoal/70">
          Descubre nuestra selección de entradas, platos fuertes, especialidades, postres y bebidas
          preparados con ingredientes frescos de temporada.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setCategoriaActiva('todas')}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            categoriaActiva === 'todas'
              ? 'border-terracotta bg-terracotta text-white'
              : 'border-charcoal/20 text-charcoal/70 hover:border-terracotta hover:text-terracotta'
          }`}
        >
          Todas
        </button>
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            onClick={() => setCategoriaActiva(String(categoria.id))}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              categoriaActiva === String(categoria.id)
                ? 'border-terracotta bg-terracotta text-white'
                : 'border-charcoal/20 text-charcoal/70 hover:border-terracotta hover:text-terracotta'
            }`}
          >
            {categoria.nombre}
          </button>
        ))}
        <button
          onClick={() => setSoloVegetariano((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
            soloVegetariano
              ? 'border-forest bg-forest text-white'
              : 'border-charcoal/20 text-charcoal/70 hover:border-forest hover:text-forest'
          }`}
        >
          <Leaf className="h-4 w-4" /> Vegetariano
        </button>
      </div>

      {loading ? (
        <Spinner label="Cargando el menú..." />
      ) : categoriasFiltradas.length === 0 ? (
        <p className="text-center text-charcoal/60">No hay platos que coincidan con este filtro.</p>
      ) : (
        <div className="space-y-16">
          {categoriasFiltradas.map((categoria) => (
            <div key={categoria.id}>
              <h2 className="mb-6 border-b-2 border-terracotta/30 pb-2 font-display text-2xl font-bold text-charcoal">
                {categoria.nombre}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categoria.platos.map((plato) => (
                  <PlatoCard key={plato.id} plato={plato} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

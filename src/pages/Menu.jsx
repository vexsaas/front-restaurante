import { useEffect, useMemo, useState } from 'react'
import { Leaf, Search, Sparkles, UtensilsCrossed } from 'lucide-react'
import api from '../api/client'
import PlatoCard from '../components/PlatoCard'
import Spinner from '../components/Spinner'

export default function Menu() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoriaActiva, setCategoriaActiva] = useState('todas')
  const [soloVegetariano, setSoloVegetariano] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    api
      .get('/menu')
      .then(({ data }) => setCategorias(data.data))
      .finally(() => setLoading(false))
  }, [])

  const categoriasFiltradas = useMemo(() => {
    const term = busqueda.toLowerCase().trim()
    return categorias
      .filter((categoria) => categoriaActiva === 'todas' || String(categoria.id) === categoriaActiva)
      .map((categoria) => ({
        ...categoria,
        platos: categoria.platos.filter((plato) => {
          const matchVeg = !soloVegetariano || plato.es_vegetariano
          const matchText =
            !term ||
            plato.nombre.toLowerCase().includes(term) ||
            plato.descripcion.toLowerCase().includes(term)
          return matchVeg && matchText
        }),
      }))
      .filter((categoria) => categoria.platos.length > 0)
  }, [categorias, categoriaActiva, soloVegetariano, busqueda])

  const totalPlatosVisibles = useMemo(() => {
    return categoriasFiltradas.reduce((acc, cat) => acc + cat.platos.length, 0)
  }, [categoriasFiltradas])

  return (
    <div className="min-h-screen bg-fondo pb-24">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-forest-dark py-20 text-cream border-b border-gold/20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-forest/60 via-forest-dark to-carbon" />
        <div className="mx-auto max-w-6xl px-5 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-carbon/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-gold-light backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Nuestra Propuesta Gastronómica
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-6xl text-cream">
            Carta &amp; <span className="text-gradient-gold italic">Especialidades</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-cream/80 font-light">
            Entradas frescas, cortes a la brasa, pesca del día, pastas artesanales, postres de autor y una cava selecta.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 -mt-6">
        {/* Controls / Filter Bar */}
        <div className="rounded-2xl bg-papel p-4 sm:p-6 shadow-xl border border-charcoal/10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
            <input
              type="text"
              placeholder="Buscar por plato o ingrediente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full rounded-full border border-charcoal/15 bg-cream/40 py-2.5 pl-10 pr-4 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 overflow-x-auto w-full md:w-auto">
            <button
              onClick={() => setCategoriaActiva('todas')}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                categoriaActiva === 'todas'
                  ? 'bg-terracotta text-white shadow-md'
                  : 'bg-fondo text-charcoal/70 hover:bg-charcoal/10 hover:text-charcoal'
              }`}
            >
              Todas
            </button>
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                onClick={() => setCategoriaActiva(String(categoria.id))}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  categoriaActiva === String(categoria.id)
                    ? 'bg-terracotta text-white shadow-md'
                    : 'bg-fondo text-charcoal/70 hover:bg-charcoal/10 hover:text-charcoal'
                }`}
              >
                {categoria.nombre}
              </button>
            ))}
            {/* Vegetarian Toggle */}
            <button
              onClick={() => setSoloVegetariano((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                soloVegetariano
                  ? 'bg-forest text-gold-light border border-gold/40 shadow-md'
                  : 'bg-fondo text-charcoal/70 hover:bg-charcoal/10 hover:text-verde'
              }`}
            >
              <Leaf className="h-3.5 w-3.5 text-verde" />
              Veggie
            </button>
          </div>
        </div>

        {/* Counter */}
        <div className="mt-8 flex items-center justify-between text-xs text-charcoal/60 px-2">
          <span>Mostrando <strong className="text-charcoal">{totalPlatosVisibles}</strong> creaciones</span>
          {busqueda && (
            <button onClick={() => setBusqueda('')} className="text-terracotta underline font-semibold">
              Limpiar búsqueda
            </button>
          )}
        </div>

        {/* Dishes Grid */}
        {loading ? (
          <div className="py-20">
            <Spinner label="Cargando la carta gastronómica..." />
          </div>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="my-16 rounded-3xl bg-papel p-12 text-center border border-charcoal/10 shadow-sm">
            <UtensilsCrossed className="mx-auto h-12 w-12 text-gold" />
            <h3 className="mt-4 font-display text-2xl font-bold text-charcoal">No se encontraron platos</h3>
            <p className="mt-2 text-sm text-charcoal/60">
              Prueba cambiando los filtros o buscando con otros términos.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-16">
            {categoriasFiltradas.map((categoria) => (
              <div key={categoria.id}>
                {/* Category Header */}
                <div className="mb-8 flex items-center gap-4">
                  <div className="h-10 w-2 rounded-full bg-gradient-to-b from-gold to-terracotta" />
                  <div>
                    <h2 className="font-display text-3xl font-extrabold text-charcoal tracking-tight">
                      {categoria.nombre}
                    </h2>
                    <p className="text-xs uppercase tracking-widest text-charcoal/50 mt-0.5">
                      {categoria.platos.length} platos disponibles
                    </p>
                  </div>
                  <div className="flex-1 h-px bg-charcoal/10 ml-4 hidden sm:block" />
                </div>

                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                  {categoria.platos.map((plato) => (
                    <PlatoCard key={plato.id} plato={plato} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

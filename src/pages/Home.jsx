import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Flame, Leaf, MapPin, Star, UtensilsCrossed, Wine } from 'lucide-react'
import api from '../api/client'
import PlatoCard from '../components/PlatoCard'
import Spinner from '../components/Spinner'

const HERO_IMG = 'https://cdn.stocksnap.io/img-thumbs/960w/THXU08ODDE.jpg'
const INTERIOR_IMG = 'https://cdn.stocksnap.io/img-thumbs/960w/HOHJK6B7TD.jpg'
const CHEF_IMG = 'https://cdn.stocksnap.io/img-thumbs/960w/GPNAYQCHQV.jpg'
const CTA_IMG = 'https://cdn.stocksnap.io/img-thumbs/960w/LAA57DAZMZ.jpg'

const pilares = [
  { Icon: Leaf, titulo: 'Del huerto a la mesa', texto: 'Trabajamos con productores locales y cosecha de temporada. Nada viaja más de lo necesario.' },
  { Icon: Flame, titulo: 'Fuego y paciencia', texto: 'Brasa, humo y cocciones lentas de hasta 12 horas que no se pueden apurar.' },
  { Icon: Wine, titulo: 'Maridaje pensado', texto: 'Una cava corta y honesta, elegida para acompañar cada plato de la carta.' },
]

const testimonios = [
  {
    nombre: 'Gabriela M.',
    texto:
      'La mejor experiencia gastronómica de la ciudad. El servicio es impecable y cada plato está lleno de sabor.',
  },
  {
    nombre: 'Fernando A.',
    texto: 'Reservamos para un aniversario y superó todas las expectativas. Ambiente cálido y comida exquisita.',
  },
  {
    nombre: 'Paola R.',
    texto: 'El lomo fino y el risotto de hongos son espectaculares. Volveremos pronto con toda la familia.',
  },
]

function Etiqueta({ children, clara = false }) {
  return (
    <p className={`flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] ${clara ? 'text-gold' : 'text-terracotta'}`}>
      <span className="h-px w-8 bg-current opacity-60" />
      {children}
      <span className="h-px w-8 bg-current opacity-60" />
    </p>
  )
}

export default function Home() {
  const [destacados, setDestacados] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/menu')
      .then(({ data }) => {
        const platos = data.data.flatMap((categoria) => categoria.platos)
        setDestacados(platos.filter((plato) => plato.destacado).slice(0, 6))
        setCategorias(data.data.filter((categoria) => categoria.platos.length > 0))
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden text-white">
        <img src={HERO_IMG} alt="" className="hero-zoom absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-carbon/75 via-carbon/55 to-carbon" />

        <div className="mx-auto w-full max-w-6xl px-5 pb-40 pt-24 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-carbon/40 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.3em] text-gold backdrop-blur">
            <Flame className="h-3.5 w-3.5" />
            Cocina de autor · Desde 2012
          </p>
          <h1 className="mx-auto mt-7 max-w-4xl font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
            Sabores que cuentan <em className="font-semibold text-gold">una historia</em>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg font-light text-cream/85">
            Producto fresco, fuego lento y una mesa esperándote. Tradición latinoamericana con mirada
            contemporánea.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/reservar"
              className="group inline-flex items-center gap-2 rounded-full bg-terracotta px-9 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-terracotta/30 transition hover:bg-terracotta-light"
            >
              Reservar una mesa
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/menu"
              className="rounded-full border border-cream/50 px-9 py-4 text-sm font-semibold uppercase tracking-wide text-cream backdrop-blur transition hover:bg-cream hover:text-carbon"
            >
              Ver el menú
            </Link>
          </div>
        </div>

        {/* Franja informativa */}
        <div className="absolute inset-x-0 bottom-0 px-5">
          <div className="mx-auto grid max-w-5xl translate-y-1/2 gap-px overflow-hidden rounded-2xl bg-charcoal/10 text-charcoal shadow-2xl sm:grid-cols-3">
            {[
              { Icon: Clock, titulo: 'Abierto hoy', texto: '12:00 pm – 11:00 pm' },
              { Icon: MapPin, titulo: 'Encuéntranos', texto: 'Av. Amazonas N34-451, Quito' },
              { Icon: Star, titulo: '4.8 de 5', texto: 'Más de 2.300 opiniones' },
            ].map(({ Icon, titulo, texto }) => (
              <div key={titulo} className="flex items-center gap-4 bg-white px-6 py-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-base font-semibold">{titulo}</p>
                  <p className="text-sm text-charcoal/60">{texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-44 sm:pt-36">
        <div className="mb-14 text-center">
          <Etiqueta>Los favoritos de la casa</Etiqueta>
          <h2 className="mt-3 font-display text-4xl font-bold text-charcoal md:text-5xl">Platos que no fallan</h2>
          <p className="mx-auto mt-4 max-w-xl text-charcoal/65">
            Los que más piden nuestros comensales. Si es tu primera vez, empieza por aquí.
          </p>
        </div>

        {loading ? (
          <Spinner label="Cargando platos destacados..." />
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((plato) => (
              <PlatoCard key={plato.id} plato={plato} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/menu"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-charcoal px-8 py-3 text-sm font-semibold uppercase tracking-wide text-charcoal transition hover:bg-charcoal hover:text-cream"
          >
            Ver menú completo
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Sobre nosotros */}
      <section className="bg-forest-dark text-cream">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-24 md:grid-cols-2 md:items-center">
          <div className="relative pb-10 pr-10">
            <img src={INTERIOR_IMG} alt="Salón del Restaurante Amaranto" loading="lazy" className="aspect-[4/5] w-full rounded-t-full object-cover shadow-2xl" />
            <img
              src={CHEF_IMG}
              alt="Chef emplatando"
              loading="lazy"
              className="absolute bottom-0 right-0 aspect-square w-1/2 rounded-2xl border-8 border-forest-dark object-cover shadow-2xl"
            />
            <div className="absolute left-4 top-10 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gold text-carbon shadow-xl">
              <span className="font-display text-3xl font-bold leading-none">13</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider">años</span>
            </div>
          </div>
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-gold">
              <span className="h-px w-8 bg-gold/60" />
              Nuestra historia
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
              Una cocina honesta, <em className="text-gold">con memoria</em>
            </h2>
            <p className="mt-6 leading-relaxed text-cream/80">
              Amaranto nació en 2012 del sueño de compartir la riqueza de la cocina latinoamericana
              con un toque contemporáneo. Elegimos cada ingrediente con productores locales para
              llevar a tu mesa platos frescos y llenos de carácter.
            </p>
            <div className="mt-10 space-y-6">
              {pilares.map(({ Icon, titulo, texto }) => (
                <div key={titulo} className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-cream">{titulo}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-cream/65">{texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* La carta por secciones */}
      {categorias.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-24">
          <div className="mb-12 text-center">
            <Etiqueta>La carta</Etiqueta>
            <h2 className="mt-3 font-display text-4xl font-bold text-charcoal md:text-5xl">Un recorrido completo</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categorias.map((categoria, i) => (
              <Link
                key={categoria.id}
                to="/menu"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-charcoal/10 bg-white px-6 py-5 transition hover:-translate-y-0.5 hover:border-terracotta hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <span className="font-display text-2xl font-bold text-terracotta/40 transition group-hover:text-terracotta">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-charcoal">{categoria.nombre}</p>
                    <p className="text-xs uppercase tracking-wider text-charcoal/50">{categoria.platos.length} platos</p>
                  </div>
                </div>
                <UtensilsCrossed className="h-5 w-5 text-charcoal/25 transition group-hover:text-terracotta" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Testimonios */}
      <section className="bg-cream-dark">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <div className="mb-12 text-center">
            <Etiqueta>Lo que dicen</Etiqueta>
            <h2 className="mt-3 font-display text-4xl font-bold text-charcoal md:text-5xl">Mesas felices</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonios.map((testimonio) => (
              <blockquote key={testimonio.nombre} className="relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-charcoal/5">
                <span className="absolute -top-5 left-7 flex h-10 w-10 items-center justify-center rounded-full bg-terracotta font-display text-3xl leading-none text-white">
                  &ldquo;
                </span>
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold" />
                  ))}
                </div>
                <p className="mt-4 font-display text-lg italic leading-relaxed text-charcoal/80">{testimonio.texto}</p>
                <footer className="mt-5 text-sm font-semibold uppercase tracking-wider text-terracotta">
                  {testimonio.nombre}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative isolate overflow-hidden">
        <img src={CTA_IMG} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-carbon/80" />
        <div className="mx-auto max-w-4xl px-5 py-24 text-center text-white">
          <Etiqueta clara>Tu mesa te espera</Etiqueta>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            ¿Listo para vivir la experiencia <em className="text-gold">Amaranto</em>?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-cream/85">
            Reserva en segundos y déjanos preparar una velada inolvidable para ti y los tuyos.
          </p>
          <Link
            to="/reservar"
            className="group mt-9 inline-flex items-center gap-2 rounded-full bg-gold px-10 py-4 text-sm font-semibold uppercase tracking-wide text-carbon shadow-xl transition hover:bg-cream"
          >
            Reservar ahora
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  )
}

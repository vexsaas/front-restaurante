import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import PlatoCard from '../components/PlatoCard'
import Spinner from '../components/Spinner'

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
    texto: 'El lomo saltado y el risotto de hongos son espectaculares. Volveremos pronto con toda la familia.',
  },
]

export default function Home() {
  const [destacados, setDestacados] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/menu')
      .then(({ data }) => {
        const platos = data.data.flatMap((categoria) => categoria.platos)
        setDestacados(platos.filter((plato) => plato.destacado).slice(0, 6))
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section
        className="relative flex min-h-[80vh] items-center justify-center bg-cover bg-center text-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(26,18,14,0.55), rgba(26,18,14,0.75)), url('https://picsum.photos/seed/restaurante-hero/1600/900')",
        }}
      >
        <div className="mx-auto max-w-3xl px-5">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-terracotta-light">
            Cocina de autor · Ingredientes frescos
          </p>
          <h1 className="font-display text-5xl font-bold leading-tight md:text-6xl">
            Sabores que cuentan una historia
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-cream/90">
            En Restaurante Amaranto fusionamos tradición y creatividad para ofrecerte una experiencia
            culinaria inolvidable, en un ambiente cálido pensado para ti.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/reservar"
              className="rounded-full bg-terracotta px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-terracotta-dark"
            >
              Reservar una mesa
            </Link>
            <Link
              to="/menu"
              className="rounded-full border border-cream/60 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-cream transition hover:bg-cream/10"
            >
              Ver el menú
            </Link>
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-terracotta">
            Nuestros favoritos
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-charcoal md:text-4xl">
            Platos Destacados
          </h2>
        </div>

        {loading ? (
          <Spinner label="Cargando platos destacados..." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((plato) => (
              <PlatoCard key={plato.id} plato={plato} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/menu"
            className="inline-block rounded-full border-2 border-terracotta px-8 py-3 text-sm font-semibold uppercase tracking-wide text-terracotta transition hover:bg-terracotta hover:text-white"
          >
            Ver menú completo
          </Link>
        </div>
      </section>

      {/* Sobre nosotros */}
      <section className="bg-forest text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:items-center">
          <img
            src="https://picsum.photos/seed/restaurante-interior/900/700"
            alt="Interior del restaurante"
            className="rounded-2xl shadow-xl"
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-terracotta-light">
              Nuestra historia
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Sobre Nosotros</h2>
            <p className="mt-5 leading-relaxed text-cream/85">
              Desde 2012, Restaurante Amaranto nació del sueño de compartir la riqueza de la cocina
              latinoamericana con un toque contemporáneo. Seleccionamos cuidadosamente cada
              ingrediente de productores locales para llevar a tu mesa platos honestos, frescos y
              llenos de carácter.
            </p>
            <p className="mt-4 leading-relaxed text-cream/85">
              Nuestro equipo de chefs combina técnicas clásicas con creatividad moderna, creando una
              experiencia gastronómica que despierta los sentidos en cada visita.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-terracotta">
            Lo que dicen
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-charcoal md:text-4xl">
            Testimonios de Clientes
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonios.map((testimonio) => (
            <blockquote
              key={testimonio.nombre}
              className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-charcoal/5"
            >
              <p className="text-terracotta text-3xl leading-none">&ldquo;</p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{testimonio.texto}</p>
              <footer className="mt-4 font-display text-sm font-semibold text-charcoal">
                — {testimonio.nombre}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-terracotta">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center text-white">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            ¿Listo para vivir la experiencia Amaranto?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">
            Reserva tu mesa en segundos y déjanos preparar una velada inolvidable para ti y los
            tuyos.
          </p>
          <Link
            to="/reservar"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wide text-terracotta shadow-lg transition hover:bg-cream"
          >
            Reservar Ahora
          </Link>
        </div>
      </section>
    </div>
  )
}

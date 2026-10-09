import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  Calendar,
  Clock,
  Flame,
  HeartHandshake,
  Leaf,
  MapPin,
  Sparkles,
  Star,
  UtensilsCrossed,
  Wine,
} from 'lucide-react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import api from '../api/client'
import PlatoCard from '../components/PlatoCard'
import Spinner from '../components/Spinner'
import CanvasBrasas from '../motion/CanvasBrasas'
import { EASE, Escalonado, Item, Magnetico, Reveal, TextoMascara } from '../motion/Reveal'

// High-end Fine Dining Luxury Photography
const HERO_IMG = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&auto=format&fit=crop&q=85'
const INTERIOR_IMG = 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=900&auto=format&fit=crop&q=80'
const CHEF_IMG = 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&auto=format&fit=crop&q=80'
const CAVA_IMG = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&auto=format&fit=crop&q=80'
const TERRAZA_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80'
const CTA_IMG = 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&auto=format&fit=crop&q=85'

// Cursiva con degradado: el relleno extra evita que la máscara recorte trazos y descendentes.
const DORADO = 'text-gradient-gold italic -my-[0.2em] py-[0.2em] pr-[0.12em]'

const pilares = [
  {
    Icon: Leaf,
    titulo: 'Del huerto a la mesa',
    texto: 'Trabajamos con agricultores locales y cosecha de temporada. Ingredientes puros y frescos a diario.',
  },
  {
    Icon: Flame,
    titulo: 'Fuego y paciencia',
    texto: 'Brasa de leña seleccionada y cocciones lentas de hasta 12 horas para exaltar cada textura y aroma.',
  },
  {
    Icon: Wine,
    titulo: 'Cava y maridaje de autor',
    texto: 'Una cuidada selección de más de 120 etiquetas internacionales y destilados guiados por nuestro sommelier.',
  },
  {
    Icon: HeartHandshake,
    titulo: 'Hospitalidad de alta escuela',
    texto: 'Atención personalizada para que cada velada sea un momento cálido, íntimo y memorable.',
  },
]

const testimonios = [
  {
    nombre: 'Gabriela Morales',
    rol: 'Crítica Gastronómica',
    texto:
      'La mejor experiencia gastronómica de la ciudad. El lomo al vino y la armonía de sabores en cada tiempo son simplemente sublimes.',
    estrellas: 5,
  },
  {
    nombre: 'Fernando Alvarado',
    rol: 'Comensal Frecuente',
    texto:
      'Celebramos nuestro aniversario en la Cava y superó todas las expectativas. El servicio es impecable y la atmósfera, mágica.',
    estrellas: 5,
  },
  {
    nombre: 'Paola Restrepo',
    rol: 'Guía Gourmet 2024',
    texto:
      'El pulpo a la brasa y el risotto de hongos silvestres son obras de arte culinarias. Amaranto es una parada obligatoria.',
    estrellas: 5,
  },
]

const salones = [
  {
    nombre: 'Salón Principal',
    descripcion: 'Espacio elegante con iluminación tenue, mesas de madera noble y atmósfera acogedora.',
    imagen: INTERIOR_IMG,
    capacidad: 'Hasta 60 personas',
  },
  {
    nombre: 'La Cava Privada',
    descripcion: 'Espacio íntimo rodeado de barricas y botellas de colección, ideal para catas y cenas ejecutivas.',
    imagen: CAVA_IMG,
    capacidad: 'Hasta 14 personas',
  },
  {
    nombre: 'La Terraza Jardín',
    descripcion: 'Ambiente al aire libre con vegetación andina, calentadores y vista panorámica nocturna.',
    imagen: TERRAZA_IMG,
    capacidad: 'Hasta 35 personas',
  },
]

const destacadosHero = [
  { Icon: Clock, titulo: 'Horario de Atención', sub: 'Lun a Dom: 12:00 - 23:00' },
  { Icon: Star, titulo: 'Excelencia Culinaria', sub: '4.9 / 5 · Más de 2.300 reseñas' },
  { Icon: MapPin, titulo: 'Ubicación Exclusiva', sub: 'Av. Amazonas N34-451, Quito' },
]

function Etiqueta({ children, clara = false }) {
  return (
    <Reveal y={14}>
      <p
        className={`flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.35em] ${
          clara ? 'text-gold-light' : 'text-terracotta'
        }`}
      >
        <span className="h-px w-8 bg-current opacity-60" />
        {children}
        <span className="h-px w-8 bg-current opacity-60" />
      </p>
    </Reveal>
  )
}

export default function Home() {
  const [destacados, setDestacados] = useState([])
  const [loading, setLoading] = useState(true)

  const heroRef = useRef(null)
  const historiaRef = useRef(null)
  const ctaRef = useRef(null)

  // La foto del hero se aleja y el texto sube más rápido mientras se baja.
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const fotoY = useTransform(heroP, [0, 1], ['0%', '22%'])
  const fotoEscala = useTransform(heroP, [0, 1], [1.06, 1.22])
  const textoY = useTransform(heroP, [0, 1], ['0%', '-30%'])
  const textoOpacidad = useTransform(heroP, [0, 0.65], [1, 0])

  // En "Nuestra esencia" las dos fotos se mueven a ritmos distintos para dar profundidad.
  const { scrollYProgress: histP } = useScroll({ target: historiaRef, offset: ['start end', 'end start'] })
  const fotoGrandeY = useSpring(useTransform(histP, [0, 1], ['-7%', '7%']), { stiffness: 110, damping: 30 })
  const fotoChicaY = useSpring(useTransform(histP, [0, 1], [80, -80]), { stiffness: 110, damping: 30 })

  const { scrollYProgress: ctaP } = useScroll({ target: ctaRef, offset: ['start end', 'end start'] })
  const ctaY = useTransform(ctaP, [0, 1], ['-12%', '12%'])

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
    <div className="bg-fondo selection:bg-gold selection:text-carbon overflow-x-hidden">
      {/* -------------------- HERO SECTION -------------------- */}
      <section ref={heroRef} className="relative isolate min-h-[92vh] flex flex-col justify-between overflow-hidden text-white bg-carbon">
        <motion.img
          src={HERO_IMG}
          alt="Restaurante Amaranto Ambiance"
          className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
          style={{ y: fotoY, scale: fotoEscala }}
        />

        {/* Multi-Layered Luxury Gradient Vignette */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-carbon/90 via-carbon/65 to-forest-dark" />
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,14,11,0.85)_100%)]" />
        <CanvasBrasas className="absolute inset-0 -z-10 h-full w-full" />

        {/* Hero Content */}
        <motion.div className="mx-auto w-full max-w-5xl px-5 pt-20 pb-12 text-center my-auto" style={{ y: textoY, opacity: textoOpacidad }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-carbon/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-light shadow-xl backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Alta Cocina de Autor · Desde 2012
          </motion.div>

          <h1
            className="mx-auto mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl text-cream"
            aria-label="Sabores que cuentan una historia inolvidable"
          >
            <TextoMascara as="span" alMontar delay={0.2} texto="Sabores que cuentan" className="block" />
            <TextoMascara as="span" alMontar delay={0.45} texto="una historia inolvidable" className="block" claseTexto={DORADO} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.95, ease: EASE }}
            className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-cream/90 sm:text-lg"
          >
            Ingredientes de origen andino, cocción a fuego lento y maridaje de autor.
            Una experiencia sensorial creada para los amantes de la buena mesa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.15, ease: EASE }}
            className="mt-9 flex flex-wrap justify-center items-center gap-4 sm:gap-6"
          >
            <Magnetico>
              <Link
                to="/reservar"
                className="btn-gold-luxury group inline-flex items-center gap-3 rounded-full px-9 py-4 text-sm font-bold uppercase tracking-wider text-carbon shadow-xl shadow-gold/20"
              >
                <Calendar className="h-4 w-4" />
                <span>Reservar una Mesa</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetico>
            <Magnetico fuerza={0.2}>
              <Link
                to="/menu"
                className="group inline-flex items-center gap-2 rounded-full border border-gold/40 bg-carbon/50 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-cream backdrop-blur-md transition-colors duration-500 hover:bg-gold hover:text-carbon hover:border-gold"
              >
                <UtensilsCrossed className="h-4 w-4 text-gold transition-colors duration-500 group-hover:text-carbon" />
                <span>Explorar la Carta</span>
              </Link>
            </Magnetico>
          </motion.div>
        </motion.div>

        {/* Informative Highlights */}
        <div className="w-full bg-forest-dark/95 border-t border-gold/25 backdrop-blur-xl py-6 px-5">
          <Escalonado paso={0.12} delay={1.3} className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3">
            {destacadosHero.map(({ Icon, titulo, sub }) => (
              <Item key={titulo}>
                <div className="group flex items-center gap-4 rounded-2xl bg-forest/50 p-4 border border-gold/15 transition-colors duration-500 hover:border-gold/40">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold border border-gold/30 transition duration-500 group-hover:bg-gold group-hover:text-carbon">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-display text-base font-bold text-cream">{titulo}</p>
                    <p className="text-xs text-cream/70 mt-0.5">{sub}</p>
                  </div>
                </div>
              </Item>
            ))}
          </Escalonado>
        </div>
      </section>

      {/* -------------------- PLATOS DESTACADOS -------------------- */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-14 text-center">
          <Etiqueta>La selección del Chef</Etiqueta>
          <TextoMascara texto="Platos Estrella de la Carta" className="mt-3 font-display text-4xl font-extrabold text-charcoal sm:text-5xl" />
          <Reveal delay={0.2} y={18}>
            <p className="mx-auto mt-4 max-w-2xl text-charcoal/70 text-base leading-relaxed">
              Creaciones emblemáticas nacidas de la fusión entre tradición e innovación contemporánea.
              Si es tu primera visita a Amaranto, déjate seducir por estas recomendaciones.
            </p>
          </Reveal>
        </div>

        {loading ? (
          <div className="py-12">
            <Spinner label="Preparando los platos destacados..." />
          </div>
        ) : (
          <Escalonado paso={0.1} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((plato) => (
              <Item key={plato.id} className="flex">
                <PlatoCard plato={plato} />
              </Item>
            ))}
          </Escalonado>
        )}

        <Reveal className="mt-14 text-center">
          <Link
            to="/menu"
            className="group inline-flex items-center gap-3 rounded-full border-2 border-titulo bg-transparent px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-titulo transition-colors duration-500 hover:bg-titulo hover:text-fondo shadow-md"
          >
            <span>Ver Menú Completo & Maridajes</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      {/* -------------------- HISTORIA & FILOSOFÍA -------------------- */}
      <section ref={historiaRef} className="relative overflow-hidden bg-forest-dark py-28 text-cream border-y border-gold/25">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-terracotta/5 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-16 px-5 md:grid-cols-2 md:items-center">
          {/* Images Collage */}
          <div className="relative pb-10 pr-10">
            <motion.div
              className="aspect-[4/5] overflow-hidden rounded-3xl border-2 border-gold/30 shadow-2xl"
              initial={{ clipPath: 'inset(100% 0% 0% 0% round 24px)' }}
              whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
              viewport={{ once: true, margin: '0px 0px -20% 0px' }}
              transition={{ duration: 1.5, ease: EASE }}
            >
              <motion.img
                src={INTERIOR_IMG}
                alt="Salón del Restaurante Amaranto"
                loading="lazy"
                className="h-[115%] w-full object-cover"
                style={{ y: fotoGrandeY }}
              />
            </motion.div>
            <motion.div
              className="absolute bottom-0 right-0 w-3/5 overflow-hidden rounded-2xl border-4 border-forest-dark shadow-2xl ring-2 ring-gold/40"
              style={{ y: fotoChicaY }}
            >
              <img
                src={CHEF_IMG}
                alt="Chef emplatando con dedicación"
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
              />
            </motion.div>
            {/* 13 Years Golden Badge */}
            <motion.div
              className="absolute left-4 top-8"
              initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 160, damping: 14 }}
            >
              <div className="animate-float flex h-28 w-28 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-gold-light via-gold to-gold-dark text-carbon shadow-2xl ring-4 ring-carbon/40">
                <span className="font-display text-4xl font-black leading-none">13</span>
                <span className="text-[11px] font-bold uppercase tracking-widest mt-1">Años</span>
                <span className="text-[9px] font-semibold text-carbon/80">de Pasión</span>
              </div>
            </motion.div>
          </div>

          {/* Philosophy Content */}
          <div>
            <Reveal y={14}>
              <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.35em] text-gold-light">
                <span className="h-px w-8 bg-current opacity-60" />
                Nuestra Esencia
              </p>
            </Reveal>
            <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight md:text-5xl" aria-label="Una cocina con memoria, elevada al arte">
              <TextoMascara as="span" texto="Una cocina con memoria," className="block" />
              <TextoMascara as="span" texto="elevada al arte" delay={0.25} className="block" claseTexto={DORADO} />
            </h2>
            <Reveal delay={0.2} y={20}>
              <p className="mt-6 text-base leading-relaxed text-cream/80">
                Fundado en 2012, Amaranto rinde homenaje a la biodiversidad andina y latinoamericana.
                Cada receta rescata ingredientes autóctonos mediante técnicas culinarias vanguardistas
                para lograr platos que emocionan el paladar.
              </p>
            </Reveal>

            <Escalonado paso={0.12} delay={0.2} className="mt-10 space-y-6">
              {pilares.map(({ Icon, titulo, texto }) => (
                <Item key={titulo} className="flex gap-4 items-start group">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/40 bg-carbon/40 text-gold shadow-md transition duration-500 group-hover:-rotate-6 group-hover:bg-gold group-hover:text-carbon">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-cream">{titulo}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-cream/70">{texto}</p>
                  </div>
                </Item>
              ))}
            </Escalonado>
          </div>
        </div>
      </section>

      {/* -------------------- ESPACIOS & SALONES EXCLUSIVOS -------------------- */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-14 text-center">
          <Etiqueta>Ambientes Inmersivos</Etiqueta>
          <TextoMascara texto="Espacios Diseñados para Cada Ocasión" className="mt-3 font-display text-4xl font-bold text-charcoal md:text-5xl" />
          <Reveal delay={0.2} y={18}>
            <p className="mx-auto mt-4 max-w-xl text-charcoal/70">
              Desde una cena romántica a la luz de las velas hasta celebraciones privadas y reuniones de negocios.
            </p>
          </Reveal>
        </div>

        <Escalonado paso={0.14} className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {salones.map((salon) => (
            <Item key={salon.nombre} className="flex">
              <div className="group w-full overflow-hidden rounded-3xl bg-papel border border-charcoal/10 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-gold/50">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={salon.imagen}
                    alt={salon.nombre}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon/80 via-transparent to-transparent opacity-60" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-forest/90 px-3 py-1 text-xs font-semibold text-cream backdrop-blur-sm border border-gold/30">
                    {salon.capacidad}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold text-charcoal group-hover:text-terracotta transition-colors duration-500">
                    {salon.nombre}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{salon.descripcion}</p>
                </div>
              </div>
            </Item>
          ))}
        </Escalonado>
      </section>

      {/* -------------------- BANNER MENÚ DEGUSTACIÓN -------------------- */}
      <section className="relative isolate overflow-hidden bg-carbon py-24 text-cream border-y border-gold/30">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-forest/50 via-carbon to-carbon" />
        <CanvasBrasas cantidad={55} className="absolute inset-0 -z-10 h-full w-full" />
        <div className="mx-auto max-w-6xl px-5 text-center">
          <Reveal y={14}>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-gold-light">
              <Award className="h-4 w-4" />
              Experiencia Gastronómica Exclusiva
            </span>
          </Reveal>
          <h2 className="mt-6 font-display text-4xl font-black text-cream sm:text-5xl lg:text-6xl" aria-label="Menú Degustación 7 Tiempos">
            <TextoMascara as="span" texto="Menú Degustación" className="inline-block" />{' '}
            <TextoMascara as="span" texto="7 Tiempos" delay={0.2} className="inline-block" claseTexto={DORADO} />
          </h2>
          <Reveal delay={0.25} y={18}>
            <p className="mx-auto mt-5 max-w-2xl text-base text-cream/80 sm:text-lg">
              Un viaje sensorial por la costa, sierra y amazonía ecuatoriana con maridaje de vinos y destilados guiado por nuestro sommelier en jefe.
            </p>
          </Reveal>
          <Reveal delay={0.4} y={18} className="mt-8 flex flex-wrap justify-center gap-4">
            <Magnetico>
              <Link
                to="/reservar"
                className="btn-gold-luxury inline-block rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-carbon"
              >
                Reservar Experiencia
              </Link>
            </Magnetico>
            <Link
              to="/menu"
              className="rounded-full border border-cream/30 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-cream transition-colors duration-500 hover:bg-cream hover:text-carbon"
            >
              Ver Maridajes
            </Link>
          </Reveal>
        </div>
      </section>

      {/* -------------------- TESTIMONIOS -------------------- */}
      <section className="bg-fondo-alt/60 py-24 border-b border-charcoal/10">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-14 text-center">
            <Etiqueta>Opiniones y Crítica</Etiqueta>
            <TextoMascara texto="Experiencias que Dejan Huella" className="mt-3 font-display text-4xl font-bold text-charcoal md:text-5xl" />
          </div>
          <Escalonado paso={0.14} className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonios.map((t) => (
              <Item key={t.nombre} className="flex">
                <blockquote className="relative flex w-full flex-col justify-between rounded-3xl bg-papel p-8 shadow-md border border-charcoal/5 transition duration-500 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-xl">
                  <div>
                    <div className="flex gap-1 text-gold">
                      {Array.from({ length: t.estrellas }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="mt-5 font-display text-lg italic leading-relaxed text-charcoal/85">
                      &ldquo;{t.texto}&rdquo;
                    </p>
                  </div>
                  <footer className="mt-6 border-t border-charcoal/10 pt-4">
                    <p className="font-display text-base font-bold text-charcoal">{t.nombre}</p>
                    <p className="text-xs uppercase tracking-wider text-terracotta font-semibold">{t.rol}</p>
                  </footer>
                </blockquote>
              </Item>
            ))}
          </Escalonado>
        </div>
      </section>

      {/* -------------------- CTA RESERVAR FINAL -------------------- */}
      <section ref={ctaRef} className="relative isolate overflow-hidden">
        <motion.img
          src={CTA_IMG}
          alt="Restaurante Amaranto Table"
          loading="lazy"
          className="absolute inset-x-0 -top-[15%] -z-30 h-[130%] w-full object-cover"
          style={{ y: ctaY }}
        />
        <div className="absolute inset-0 -z-20 bg-gradient-to-t from-carbon via-carbon/80 to-carbon/90" />
        <CanvasBrasas cantidad={45} className="absolute inset-0 -z-10 h-full w-full" />
        <div className="mx-auto max-w-4xl px-5 py-28 text-center text-white">
          <Etiqueta clara>Tu velada perfecta</Etiqueta>
          <h2 className="mt-4 font-display text-4xl font-extrabold md:text-6xl" aria-label="¿Listo para vivir la experiencia Amaranto?">
            <TextoMascara as="span" texto="¿Listo para vivir la" className="block" />
            <TextoMascara as="span" texto="experiencia Amaranto?" delay={0.25} className="block" claseTexto="text-gradient-gold -my-[0.2em] py-[0.2em]" />
          </h2>
          <Reveal delay={0.3} y={18}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-cream/90 font-light">
              Garantiza tu mesa en pocos pasos. Consulta disponibilidad en tiempo real y elige tu ambiente favorito.
            </p>
          </Reveal>
          <Reveal delay={0.45} y={18}>
            <Magnetico className="mt-10">
              <Link
                to="/reservar"
                className="btn-gold-luxury group inline-flex items-center gap-3 rounded-full px-10 py-4.5 text-base font-bold uppercase tracking-wider text-carbon shadow-2xl"
              >
                <Calendar className="h-5 w-5" />
                <span>Reservar mi Mesa Ahora</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetico>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Calendar, Car, Clock, Mail, MapPin, MessageCircle, Navigation, PartyPopper, Phone, Send, Sparkles, Wine } from 'lucide-react'
import CanvasBrasas from '../motion/CanvasBrasas'
import { Escalonado, Item, Magnetico, Reveal, TextoMascara } from '../motion/Reveal'

const TELEFONO = '+593 99 123 4567'
const WHATSAPP = '593991234567'
const CORREO = 'contacto@restauranteamaranto.com'
const CORREO_EVENTOS = 'eventos@restauranteamaranto.com'
const MAPA_EMBED =
  'https://www.openstreetmap.org/export/embed.html?bbox=-78.4930%2C-0.1880%2C-78.4760%2C-0.1740&layer=mapnik&marker=-0.1807%2C-78.4845'
const MAPA_RUTA = 'https://www.google.com/maps/dir/?api=1&destination=-0.1807,-78.4845'
const DORADO = 'text-gradient-gold italic -my-[0.2em] py-[0.2em] pr-[0.12em]'

// Índice = getDay(): 0 domingo … 6 sábado. Horas en formato 24h; cierra 24 = medianoche.
const horario = [
  { dia: 'Domingo', abre: 12, cierra: 22, nota: 'Brunch & carta' },
  { dia: 'Lunes', abre: 12, cierra: 23 },
  { dia: 'Martes', abre: 12, cierra: 23 },
  { dia: 'Miércoles', abre: 12, cierra: 23 },
  { dia: 'Jueves', abre: 12, cierra: 23 },
  { dia: 'Viernes', abre: 12, cierra: 24 },
  { dia: 'Sábado', abre: 12, cierra: 24 },
]

const canales = [
  { Icon: MessageCircle, titulo: 'WhatsApp', dato: TELEFONO, nota: 'Respuesta en minutos', href: `https://wa.me/${WHATSAPP}` },
  { Icon: Phone, titulo: 'Central de reservas', dato: TELEFONO, nota: 'En horario de servicio', href: `tel:${TELEFONO.replace(/\s/g, '')}` },
  { Icon: Mail, titulo: 'Escríbenos', dato: CORREO, nota: 'Respondemos en 24 h', href: `mailto:${CORREO}` },
]

const extras = [
  { Icon: Car, titulo: 'Valet parking', texto: 'Sin costo para comensales, en la entrada principal sobre la Av. Amazonas.' },
  { Icon: Wine, titulo: 'Cava privada', texto: 'Hasta 14 personas entre barricas y botellas de colección, con sommelier dedicado.' },
  { Icon: PartyPopper, titulo: 'Eventos a medida', texto: 'Aniversarios, cenas de empresa y celebraciones con menú diseñado para la ocasión.' },
]

function hora(h) {
  return h === 24 ? '00:00' : `${String(h).padStart(2, '0')}:00`
}

function estadoActual() {
  const ahora = new Date()
  const hoy = horario[ahora.getDay()]
  const h = ahora.getHours() + ahora.getMinutes() / 60
  if (h >= hoy.abre && h < hoy.cierra) {
    return { abierto: true, texto: `Abierto ahora · cocina hasta las ${hora(hoy.cierra)}` }
  }
  if (h < hoy.abre) return { abierto: false, texto: `Cerrado · abrimos hoy a las ${hora(hoy.abre)}` }
  const manana = horario[(ahora.getDay() + 1) % 7]
  return { abierto: false, texto: `Cerrado · abrimos mañana a las ${hora(manana.abre)}` }
}

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', mensaje: '' })
  // El mapa solo responde a la rueda después de un clic, para que no secuestre el scroll de la página.
  const [mapaActivo, setMapaActivo] = useState(false)
  const estado = estadoActual()
  const hoy = new Date().getDay()
  // Semana empezando en lunes, como se lee un horario.
  const semana = [1, 2, 3, 4, 5, 6, 0]

  function enviar(e) {
    e.preventDefault()
    const texto = `Hola, soy ${form.nombre.trim()}. ${form.mensaje.trim()}`
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener')
  }

  return (
    <div className="bg-fondo">
      {/* Encabezado */}
      <section className="relative isolate overflow-hidden border-b border-gold/20 bg-forest-dark text-cream">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,rgba(217,164,65,0.14),transparent_60%)]" />
        <CanvasBrasas cantidad={50} className="absolute inset-0 -z-10 h-full w-full" />
        <div className="mx-auto max-w-5xl px-5 py-20 text-center sm:py-24">
          <Reveal y={14}>
            <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-carbon/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Atención &amp; Hospitalidad
            </p>
          </Reveal>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.1] text-cream sm:text-6xl lg:text-7xl" aria-label="Tu mesa te espera">
            <TextoMascara as="span" alMontar delay={0.15} texto="Tu mesa" className="inline-block" />{' '}
            <TextoMascara as="span" alMontar delay={0.35} texto="te espera" className="inline-block" claseTexto={DORADO} />
          </h1>
          <Reveal delay={0.6} y={16}>
            <p className="mx-auto mt-5 max-w-lg font-light text-cream/80">
              Estamos en el corazón gastronómico de Quito. Reserva una mesa, pregunta por la cava o
              planifica tu evento privado.
            </p>
          </Reveal>
          <Reveal delay={0.75} y={16}>
            <span
              className={`mt-7 inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold ${
                estado.abierto ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300' : 'border-gold/40 bg-gold/10 text-gold-light'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                {estado.abierto && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />}
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${estado.abierto ? 'bg-emerald-400' : 'bg-gold'}`} />
              </span>
              {estado.texto}
            </span>
          </Reveal>
        </div>
      </section>

      {/* Canales directos */}
      <section className="mx-auto max-w-6xl px-5 pt-16">
        <Escalonado paso={0.12} className="grid gap-6 md:grid-cols-3">
          {canales.map(({ Icon, titulo, dato, nota, href }) => (
            <Item key={titulo} className="flex">
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-charcoal/10 bg-papel p-8 shadow-md transition duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-2xl"
              >
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-gold via-gold-light to-terracotta transition duration-500 group-hover:scale-x-100" />
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/40 bg-gold/10 text-gold-dark transition duration-500 group-hover:bg-gold group-hover:text-carbon">
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-charcoal/30 transition duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-terracotta" />
                </div>
                <p className="mt-6 font-display text-2xl font-bold text-charcoal">{titulo}</p>
                <p className="mt-2 break-words text-sm font-semibold text-charcoal/85">{dato}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/50">{nota}</p>
              </a>
            </Item>
          ))}
        </Escalonado>
      </section>

      {/* Mapa + horario */}
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-16 lg:grid-cols-[1.25fr_1fr]">
        <Reveal className="relative min-h-[440px] overflow-hidden rounded-3xl border border-charcoal/10 bg-papel shadow-md lg:min-h-full">
          <div className="absolute inset-0" onMouseLeave={() => setMapaActivo(false)}>
            <iframe
              title="Mapa de ubicación del Restaurante Amaranto"
              src={MAPA_EMBED}
              loading="lazy"
              className={`mapa-tema h-full w-full border-0 ${mapaActivo ? '' : 'pointer-events-none'}`}
            />
            {!mapaActivo && (
              <button
                type="button"
                onClick={() => setMapaActivo(true)}
                className="group absolute inset-0 flex items-start justify-center pt-5"
                aria-label="Activar el mapa para moverlo"
              >
                <span className="rounded-full bg-forest-dark/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-cream opacity-0 backdrop-blur transition group-hover:opacity-100">
                  Clic para mover el mapa
                </span>
              </button>
            )}
          </div>
          <div className="glass-dark absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 text-cream shadow-xl">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold text-carbon">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-xl font-bold text-cream">Av. Amazonas N34-451</p>
                <p className="mt-0.5 text-sm text-cream/70">y Rumipamba · a pasos del Parque La Carolina</p>
              </div>
            </div>
            <a
              href={MAPA_RUTA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gold transition-colors duration-500 hover:bg-gold hover:text-carbon"
            >
              <Navigation className="h-4 w-4" />
              Cómo llegar
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="rounded-3xl border border-charcoal/10 bg-papel p-8 shadow-md">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/40 bg-gold/10 text-gold-dark">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl font-bold text-charcoal">Horario de servicio</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/50">Hora de Quito</p>
            </div>
          </div>

          <ul className="mt-6 space-y-1">
            {semana.map((i) => {
              const d = horario[i]
              const esHoy = i === hoy
              return (
                <li
                  key={d.dia}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm ${
                    esHoy ? 'bg-gold/15 font-bold text-charcoal ring-1 ring-gold/50' : 'text-charcoal/70'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {d.dia}
                    {esHoy && <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-carbon">Hoy</span>}
                    {d.nota && <span className="hidden text-xs font-normal text-charcoal/45 sm:inline">· {d.nota}</span>}
                  </span>
                  <span>
                    {hora(d.abre)} – {hora(d.cierra)}
                  </span>
                </li>
              )
            })}
          </ul>

          <a
            href={`mailto:${CORREO_EVENTOS}`}
            className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-fondo-suave px-4 py-3 text-sm transition-colors duration-500 hover:border-gold"
          >
            <span className="text-charcoal/70">
              Eventos privados: <strong className="font-semibold text-charcoal">{CORREO_EVENTOS}</strong>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-terracotta" />
          </a>
        </Reveal>
      </section>

      {/* Detalles de la visita */}
      <section className="border-y border-charcoal/10 bg-fondo-alt/60">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="text-center">
            <Reveal y={14}>
              <p className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.35em] text-terracotta">
                <span className="h-px w-8 bg-current opacity-60" />
                Antes de venir
                <span className="h-px w-8 bg-current opacity-60" />
              </p>
            </Reveal>
            <TextoMascara texto="Nos encargamos de los detalles" className="mt-3 font-display text-4xl font-bold text-charcoal md:text-5xl" />
          </div>
          <Escalonado paso={0.12} className="mt-12 grid gap-6 md:grid-cols-3">
            {extras.map(({ Icon, titulo, texto }) => (
              <Item key={titulo} className="flex">
                <div className="group w-full rounded-3xl border border-charcoal/10 bg-papel p-8 shadow-md transition duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-2xl">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/40 bg-gold/10 text-gold-dark transition duration-500 group-hover:-rotate-6 group-hover:bg-gold group-hover:text-carbon">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-charcoal">{titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{texto}</p>
                </div>
              </Item>
            ))}
          </Escalonado>
        </div>
      </section>

      {/* Mensaje rápido */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid overflow-hidden rounded-[2rem] border border-charcoal/10 bg-papel shadow-lg lg:grid-cols-2">
          <div className="relative isolate overflow-hidden bg-forest-dark p-10 text-cream sm:p-14">
            <CanvasBrasas cantidad={35} className="absolute inset-0 -z-10 h-full w-full" />
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold-light">Escríbenos</p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight md:text-5xl" aria-label="¿Celebras algo especial?">
              <TextoMascara as="span" texto="¿Celebras algo" className="block" />
              <TextoMascara as="span" texto="especial?" delay={0.2} className="block" claseTexto={DORADO} />
            </h2>
            <Reveal delay={0.3} y={16}>
              <p className="mt-5 max-w-sm font-light text-cream/80">
                Cuéntanos la ocasión y preparamos la mesa, el maridaje y los detalles. Si solo
                quieres cenar, reserva directo en un minuto.
              </p>
            </Reveal>
            <Reveal delay={0.45} y={16}>
              <Magnetico className="mt-8">
                <Link
                  to="/reservar"
                  className="btn-gold-luxury group inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-carbon"
                >
                  <Calendar className="h-4 w-4" />
                  Reservar una mesa
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Magnetico>
            </Reveal>
          </div>

          <form onSubmit={enviar} className="space-y-5 p-10 sm:p-14">
            <div>
              <label htmlFor="contacto-nombre" className="mb-2 block text-xs font-bold uppercase tracking-wider text-charcoal/60">
                Tu nombre
              </label>
              <input
                id="contacto-nombre"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej. Gabriela Morales"
                className="w-full rounded-xl border border-charcoal/20 bg-fondo-suave px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
            <div>
              <label htmlFor="contacto-mensaje" className="mb-2 block text-xs font-bold uppercase tracking-wider text-charcoal/60">
                Mensaje
              </label>
              <textarea
                id="contacto-mensaje"
                required
                rows={4}
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                placeholder="Somos 8 personas y queremos la cava para un aniversario…"
                className="w-full resize-none rounded-xl border border-charcoal/20 bg-fondo-suave px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-500 hover:bg-terracotta-dark"
            >
              <Send className="h-4 w-4" />
              Enviar por WhatsApp
            </button>
            <p className="text-center text-xs text-charcoal/50">Se abre WhatsApp con tu mensaje listo para enviar.</p>
          </form>
        </div>
      </section>
    </div>
  )
}

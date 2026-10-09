import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Calendar, Clock, Mail, MapPin, MessageCircle, Phone, Sparkles } from 'lucide-react'
import Logo from './Logo'
import { Magnetico, Reveal } from '../motion/Reveal'

const enlaces = [
  { to: '/', texto: 'Inicio & Filosofía' },
  { to: '/menu', texto: 'Carta Gastronómica & Cava' },
  { to: '/reservar', texto: 'Reservar una Mesa' },
  { to: '/contacto', texto: 'Ubicación & Eventos Privados' },
]

const horarios = [
  ['Lunes a Jueves', '12:00 – 23:00'],
  ['Viernes y Sábados', '12:00 – 00:00'],
  ['Domingos', '12:00 – 22:00'],
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-carbon text-cream/80">
      <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Llamado final */}
      <div className="border-b border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-14 md:flex-row md:items-center">
          <Reveal>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.35em] text-gold-light">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Cocina de autor con identidad andina
            </p>
            <p className="mt-3 font-display text-4xl font-extrabold text-cream md:text-5xl">
              La mesa está <span className="text-gradient-gold italic">servida</span>
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <Magnetico>
              <Link
                to="/reservar"
                className="btn-gold-luxury group inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-wider text-carbon"
              >
                <Calendar className="h-4 w-4" />
                Reservar una mesa
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetico>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1.1fr_1.2fr_1.3fr]">
        <div>
          <Link to="/" className="group inline-block" aria-label="Restaurante Amaranto">
            <Logo size="md" />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/65">
            Alta cocina de autor con ingredientes de temporada, fuego lento y maridaje de excepción
            en un ambiente íntimo y contemporáneo.
          </p>
          <a
            href="https://wa.me/593991234567"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gold transition-colors duration-500 hover:bg-gold hover:text-carbon"
          >
            <MessageCircle className="h-4 w-4" />
            Escríbenos por WhatsApp
          </a>
        </div>

        <nav aria-label="Pie de página">
          <h4 className="font-display text-base font-bold uppercase tracking-wider text-gold">Navegación</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {enlaces.map((e) => (
              <li key={e.to}>
                <Link to={e.to} className="group inline-flex items-center gap-2 text-cream/70 transition-colors duration-300 hover:text-gold">
                  <span className="text-gold/40 transition-transform duration-300 group-hover:rotate-90 group-hover:text-gold">✦</span>
                  {e.texto}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/admin/login" className="text-xs text-cream/40 transition-colors hover:text-gold">
                Acceso administrativo
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h4 className="flex items-center gap-2 font-display text-base font-bold uppercase tracking-wider text-gold">
            <Clock className="h-4 w-4" />
            Horario
          </h4>
          <ul className="mt-5 divide-y divide-cream/10 text-sm">
            {horarios.map(([dias, horas]) => (
              <li key={dias} className="flex justify-between gap-4 py-2.5 first:pt-0">
                <span className="text-cream/65">{dias}</span>
                <span className="font-semibold text-cream">{horas}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-bold uppercase tracking-wider text-gold">Visítanos</h4>
          <ul className="mt-5 space-y-3 text-sm text-cream/70">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>Av. Amazonas N34-451 y Rumipamba, Quito</span>
            </li>
            <li>
              <a href="tel:+593991234567" className="flex items-center gap-3 transition-colors hover:text-gold">
                <Phone className="h-4 w-4 shrink-0 text-gold" />+593 99 123 4567
              </a>
            </li>
            <li>
              <a href="mailto:contacto@restauranteamaranto.com" className="flex items-center gap-3 break-all transition-colors hover:text-gold">
                <Mail className="h-4 w-4 shrink-0 text-gold" />contacto@restauranteamaranto.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Marca gigante de fondo */}
      <p aria-hidden="true" className="pointer-events-none -mb-[0.26em] select-none whitespace-nowrap text-center font-display text-[19vw] font-extrabold italic leading-none text-gold/[0.05]">
        Amaranto
      </p>

      <div className="relative border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Restaurante Amaranto — Demo de portafolio de alta gastronomía.</p>
          <a
            href="https://changosdev.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-4 py-1.5 text-cream/65 transition-colors duration-500 hover:border-gold hover:text-cream"
          >
            Desarrollado por <span className="font-bold text-gold">ChangosDev</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-gold transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}

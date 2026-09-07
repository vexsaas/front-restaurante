export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl font-semibold text-cream">Restaurante Amaranto</h3>
          <p className="mt-3 text-sm leading-relaxed">
            Cocina de autor con ingredientes frescos y de temporada, en un ambiente cálido pensado
            para compartir grandes momentos.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold text-cream">Horario</h4>
          <ul className="mt-3 space-y-1 text-sm">
            <li>Lunes a Viernes: 12:00 - 23:00</li>
            <li>Sábados y Domingos: 12:00 - 00:00</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold text-cream">Ubicación &amp; Contacto</h4>
          <ul className="mt-3 space-y-1 text-sm">
            <li>Av. Amazonas N34-451 y Rumipamba, Quito</li>
            <li>+593 99 123 4567</li>
            <li>contacto@restauranteamaranto.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Restaurante Amaranto — Demo de portafolio. Todos los derechos reservados.
      </div>
    </footer>
  )
}

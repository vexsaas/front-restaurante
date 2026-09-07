export default function Contacto() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-terracotta">
          Estamos para ti
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-charcoal">Contacto</h1>
        <p className="mx-auto mt-3 max-w-xl text-charcoal/70">
          Visítanos, escríbenos o llámanos. Estaremos encantados de atenderte.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-charcoal/5">
            <h2 className="font-display text-lg font-semibold text-charcoal">Dirección</h2>
            <p className="mt-2 text-sm text-charcoal/70">
              Av. Amazonas N34-451 y Rumipamba
              <br />
              Quito, Ecuador
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-charcoal/5">
            <h2 className="font-display text-lg font-semibold text-charcoal">Horario de atención</h2>
            <ul className="mt-2 space-y-1 text-sm text-charcoal/70">
              <li>Lunes a Viernes: 12:00 - 23:00</li>
              <li>Sábados y Domingos: 12:00 - 00:00</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-charcoal/5">
            <h2 className="font-display text-lg font-semibold text-charcoal">Teléfono y correo</h2>
            <p className="mt-2 text-sm text-charcoal/70">
              +593 99 123 4567
              <br />
              contacto@restauranteamaranto.com
            </p>
          </div>
        </div>

        {/* Bloque de mapa estilizado (sin API real de mapas) */}
        <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl bg-forest text-cream shadow-sm">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 30%, white 0, transparent 40%), radial-gradient(circle at 80% 70%, white 0, transparent 35%)',
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-3 px-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-2xl shadow-lg">
              📍
            </div>
            <p className="font-display text-xl font-semibold">Restaurante Amaranto</p>
            <p className="text-sm text-cream/80">Av. Amazonas N34-451 y Rumipamba, Quito</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-cream/50">
              Mapa ilustrativo — demo de portafolio
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

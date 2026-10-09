import { Leaf, Sparkles, Star } from 'lucide-react'

export default function PlatoCard({ plato }) {
  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl bg-papel border border-charcoal/10 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-2xl hover:shadow-gold/10">
      {/* Image container */}
      <div className="relative h-60 w-full overflow-hidden bg-charcoal/5">
        <img
          src={plato.imagen_url}
          alt={plato.nombre}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-carbon/70 via-transparent to-carbon/20 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {plato.es_vegetariano && (
            <span className="inline-flex items-center gap-1 rounded-full bg-forest/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cream shadow-md backdrop-blur-sm border border-forest-light">
              <Leaf className="h-3 w-3 text-gold-light" />
              Veggie
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 z-10">
          {plato.destacado && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-carbon shadow-md border border-gold-light">
              <Star className="h-3 w-3 fill-carbon text-carbon" />
              Especial
            </span>
          )}
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="rounded-full bg-forest-dark/90 px-3.5 py-1.5 font-display text-base font-bold text-gold shadow-lg backdrop-blur-md border border-gold/30">
            ${Number(plato.precio).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold text-charcoal group-hover:text-terracotta transition-colors leading-snug">
            {plato.nombre}
          </h3>
        </div>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-charcoal/70">
          {plato.descripcion}
        </p>
        
        {/* Card Footer accent */}
        <div className="mt-4 pt-3 border-t border-charcoal/10 flex items-center justify-between text-xs text-charcoal/50">
          <span className="uppercase tracking-wider font-semibold text-gold-dark">
            Cocina de Autor
          </span>
          <span className="inline-flex items-center gap-1 text-terracotta font-medium group-hover:translate-x-0.5 transition-transform">
            <Sparkles className="h-3.5 w-3.5" />
            Servicio fresco
          </span>
        </div>
      </div>
    </article>
  )
}

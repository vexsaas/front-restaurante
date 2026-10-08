export default function PlatoCard({ plato }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-charcoal/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
      <div className="relative h-56 overflow-hidden">
        <img
          src={plato.imagen_url}
          alt={plato.nombre}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        {plato.es_vegetariano && (
          <span className="absolute left-3 top-3 rounded-full bg-forest px-3 py-1 text-xs font-semibold text-cream shadow">
            Vegetariano
          </span>
        )}
        {plato.destacado && (
          <span className="absolute right-3 top-3 rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-white shadow">
            Destacado
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-charcoal">{plato.nombre}</h3>
          <span className="whitespace-nowrap font-display text-lg font-bold text-terracotta">
            ${Number(plato.precio).toFixed(2)}
          </span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/70">{plato.descripcion}</p>
      </div>
    </article>
  )
}

export default function StatCard({ label, value, hint, accent = 'terracotta', icon: Icon }) {
  const colors = {
    terracotta: 'bg-terracotta/10 text-terracotta',
    forest: 'bg-forest/10 text-verde',
    gold: 'bg-gold/20 text-gold-dark',
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-papel p-6 shadow-md shadow-charcoal/5 ring-1 ring-gold/20 transition hover:-translate-y-0.5 hover:shadow-lg">
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-gold-light to-terracotta opacity-0 transition group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">{label}</p>
        {Icon && (
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors[accent]}`}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-4xl font-bold text-titulo">{value}</p>
      {hint && <p className="mt-2 text-xs text-charcoal/50">{hint}</p>}
    </div>
  )
}

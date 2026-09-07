export default function StatCard({ label, value, hint, accent = 'terracotta' }) {
  const colors = {
    terracotta: 'bg-terracotta/10 text-terracotta',
    forest: 'bg-forest/10 text-forest',
    gold: 'bg-gold/15 text-gold',
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-charcoal/5">
      <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">{label}</p>
      <p className={`mt-3 inline-block rounded-lg px-2 font-display text-3xl font-bold ${colors[accent]}`}>
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-charcoal/50">{hint}</p>}
    </div>
  )
}

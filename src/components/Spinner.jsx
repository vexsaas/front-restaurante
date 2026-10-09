export default function Spinner({ label = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-charcoal/60">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold/20 border-t-gold" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

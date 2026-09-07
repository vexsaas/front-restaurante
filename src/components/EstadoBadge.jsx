const estilos = {
  pendiente: 'bg-gold/20 text-gold border-gold/40',
  confirmada: 'bg-forest/15 text-forest border-forest/40',
  cancelada: 'bg-red-100 text-red-700 border-red-300',
  completada: 'bg-charcoal/10 text-charcoal border-charcoal/20',
}

const etiquetas = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
  completada: 'Completada',
}

export default function EstadoBadge({ estado }) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
        estilos[estado] || 'bg-gray-100 text-gray-700 border-gray-300'
      }`}
    >
      {etiquetas[estado] || estado}
    </span>
  )
}

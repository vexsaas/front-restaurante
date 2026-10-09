export default function Logo({ className = '', size = 'md', light = false }) {
  const sizeMap = {
    sm: { img: 'h-8 w-8', text: 'text-lg', sub: 'text-[9px]' },
    md: { img: 'h-11 w-11', text: 'text-2xl', sub: 'text-[10px]' },
    lg: { img: 'h-14 w-14', text: 'text-3xl', sub: 'text-xs' },
  }
  const s = sizeMap[size] || sizeMap.md

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* 3D Chef Gold Medallion Logo */}
      <img
        src="/logo.svg"
        alt="Restaurante Amaranto"
        className={`${s.img} shrink-0 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105`}
      />

      <div className="flex flex-col">
        <span className={`font-display ${s.text} font-bold tracking-tight leading-none ${light ? 'text-charcoal' : 'text-cream'}`}>
          Restaurante <em className="font-semibold text-gold not-italic">Amaranto</em>
        </span>
        <span className={`${s.sub} font-bold uppercase tracking-[0.25em] text-gold/80 mt-1`}>
          Alta Cocina de Autor
        </span>
      </div>
    </div>
  )
}

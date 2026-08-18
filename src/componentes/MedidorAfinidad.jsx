import { useId } from 'react'

// La afinidad es un dato que devuelve Last.fm con .getSimilar

const CORAZON =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'

function MedidorAfinidad({ afinidad }) {

  const id = useId()

  const alto = (afinidad / 100) * 24

  return (
    <div className="flex items-center gap-1.5">
      <svg
        viewBox="0 0 24 24"
        className="h-[15px] w-[15px] overflow-visible"
        role="img"
        aria-label={`Afinidad ${afinidad} por ciento`}
      >
        <defs>
          <clipPath id={id}>
            <rect x="0" y={24 - alto} width="24" height={alto} />
          </clipPath>
        </defs>

        {/* Corazon vacio/gris */}
        <path d={CORAZON} fill="var(--color-mist)" />

        {/* Corazon verde" */}
        <path d={CORAZON} fill="var(--color-grass)" clipPath={`url(#${id})`} />

        {/* Contorno negro */}
        <path
          d={CORAZON}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="1.5"
        />
      </svg>

      <span className="font-data text-[11px] tabular-nums text-ink">
        {afinidad}%
      </span>
    </div>
  )
}

export default MedidorAfinidad

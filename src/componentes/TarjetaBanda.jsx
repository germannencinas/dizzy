import { useEffect, useState } from 'react'
import MedidorAfinidad from './MedidorAfinidad.jsx'
import { buscarImagenArtista } from '../deezer.js'
import { formatearOrigen } from '../utilidades/origen.js'

function TarjetaBanda({ nombre, afinidad, url, ciudad, pais, indice }) {
  const [imagen, setImagen] = useState(null)

  useEffect(() => {
    
    const control = new AbortController()

    buscarImagenArtista(nombre, control.signal)
      .then(setImagen)
      .catch(() => {})

    return () => control.abort()

  }, [nombre])

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      title={nombre}
      className="animar-entrada group block"
      style={{ animationDelay: `${Math.min(indice * 40, 300)}ms` }}
    >
      <div className="relative aspect-square overflow-hidden rounded-card border border-line bg-mist transition-colors group-hover:border-grass">
        <span className="absolute inset-0 flex items-center justify-center font-display text-6xl font-extrabold text-paper/80 select-none">
          {nombre.charAt(0)}
        </span>

        {imagen && (
          <img
            src={imagen}
            alt={`Foto de ${nombre}`}
            loading="lazy"
            onError={() => setImagen(null)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute top-2.5 right-2.5 rounded-full bg-paper px-2 py-1 shadow-sm">
          <MedidorAfinidad afinidad={afinidad} />
        </div>
      </div>

      <div className="mt-3">
        <h3 className="font-display text-[15px] leading-tight font-semibold text-ink line-clamp-2 group-hover:underline">
          {nombre}
        </h3>
        <p className="mt-0.5 truncate text-[13px] text-ash">
          {formatearOrigen(ciudad, pais)}
        </p>
      </div>
    </a>
  )
}

export default TarjetaBanda

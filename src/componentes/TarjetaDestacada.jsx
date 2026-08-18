import { useEffect, useState } from 'react'
import { buscarImagenArtista } from '../deezer.js'
import { formatearOrigen } from '../utilidades/origen.js'


function TarjetaDestacada({ nombre, url, ciudad, pais }) {
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
      className="animar-entrada group relative block aspect-[16/10] overflow-hidden rounded-card bg-ink sm:aspect-[24/7]"
    >
      {imagen && (
        <img
          src={imagen}
          alt={`Foto de ${nombre}`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      )}

      <div className="velo-destacada absolute inset-0" />

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <h2 className="font-display text-3xl leading-none font-extrabold tracking-tight text-white sm:text-5xl">
          {nombre}
        </h2>
        <p className="mt-2 text-sm text-white/75 sm:text-base">
          {formatearOrigen(ciudad, pais)}
        </p>
      </div>
    </a>
  )
}

export default TarjetaDestacada

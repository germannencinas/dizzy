import { useEffect, useState } from 'react'
import { buscarImagenArtista } from '../deezer.js'

const BANDAS = [
  'blink-182',
  'Avenged Sevenfold',
  'Paramore',
  'Sum 41',
  'Fall Out Boy',
  'The Story So Far',
  'Neck Deep',
]

const MS_POR_FOTO = 5000

function FondoCarrusel() {
  const [fotos, setFotos] = useState([])
  const [actual, setActual] = useState(0)

  const sinMovimiento =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Obtiene las fotos
  useEffect(() => {
    const control = new AbortController()

    Promise.all(
      BANDAS.map((b) =>
        buscarImagenArtista(b, control.signal).catch(() => null),
      ),
    )
      
      .then((urls) => setFotos(urls.filter(Boolean)))
      .catch(() => {})

    return () => control.abort()
  }, [])

  // Movimiento del slider de fotos
  useEffect(() => {
    if (sinMovimiento || fotos.length < 2) return

    const id = setInterval(() => {
      setActual((i) => (i + 1) % fotos.length)
    }, MS_POR_FOTO)

    return () => clearInterval(id)
  }, [fotos.length, sinMovimiento])

  if (fotos.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {fotos.map((url, i) => (
        <img
          key={url}
          src={url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out"
          style={{ opacity: i === actual ? 1 : 0 }}
        />
      ))}

      <div className="velo-hero absolute inset-0" />
    </div>
  )
}

export default FondoCarrusel

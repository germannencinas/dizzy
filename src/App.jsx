import { useState } from 'react'
import { buscarSimilares } from './lastfm.js'
import Hero from './componentes/Hero.jsx'
import BarraNav from './componentes/BarraNav.jsx'
import ListaResultados from './componentes/ListaResultados.jsx'
import EsqueletoResultados from './componentes/EsqueletoResultados.jsx'
import PieDePagina from './componentes/PieDePagina.jsx'

function App() {
 
  const [consulta, setConsulta] = useState('') 
  const [buscada, setBuscada] = useState('')
  const [bandas, setBandas] = useState([])
 
  const [destacada, setDestacada] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  async function manejarEnvio(evento) {

    evento.preventDefault()

    const limpia = consulta.trim()
    if (!limpia) {
      setError('Escribe el nombre de una banda.')
      return
    }

    setCargando(true)
    setError('')

    try {
      const { consultada, bandas: encontradas } = await buscarSimilares(limpia)
      setBandas(encontradas)
      setDestacada(consultada)
      setBuscada(consultada?.nombre ?? limpia)
    } catch (e) {
      
      setError(e.message)
      setBandas([])
      setDestacada(null)
      setBuscada('')
    } finally {

      setCargando(false)
    }
  }

  function reiniciar() {
    setConsulta('')
    setBuscada('')
    setBandas([])
    setDestacada(null)
    setError('')
  }

  const mostrarResultados = buscada !== '' || cargando

  if (!mostrarResultados) {
    return (
      <Hero
        valor={consulta}
        alCambiar={setConsulta}
        alEnviar={manejarEnvio}
        cargando={cargando}
        error={error}
      />
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <BarraNav
        valor={consulta}
        alCambiar={setConsulta}
        alEnviar={manejarEnvio}
        cargando={cargando}
        alReiniciar={reiniciar}
      />

      <main className="flex-1">
        {error && (
          <p role="alert" className="mx-auto max-w-6xl px-6 pt-8 text-sm">
            {error}
          </p>
        )}

        {cargando ? (
          <EsqueletoResultados />
        ) : bandas.length > 0 ? (
          <ListaResultados
            bandas={bandas}
            consulta={buscada}
            destacada={destacada}
          />
        ) : (
          !error && (
            <p className="mx-auto max-w-6xl px-6 py-16 text-ash">
              Last.fm no tiene bandas parecidas a{' '}
              <span className="text-ink">{buscada}</span>. Prueba con
              una más conocida.
            </p>
          )
        )}
      </main>

      <PieDePagina />
    </div>
  )
}

export default App


const LASTFM = 'https://ws.audioscrobbler.com/2.0/'
const MUSICBRAINZ = 'https://musicbrainz.org/ws/2/artist'

const USER_AGENT = 'Dizzy/1.0 ( https://github.com/germannencinas/dizzy )'

const cacheOrigenes = (globalThis.__dizzyOrigenes ??= new Map())

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Busca ciudad y pais de todas las bandas recomendadas
 * @param {string[]} mbids identificadores de MusicBrainz
 * @returns {Promise<Map>} mbid -> { ciudad, pais }
 */
// Clave especial bajo la que se guarda el artista encontrado por
// nombre, cuando Last.fm no nos dio su mbid.
export const POR_NOMBRE = Symbol('porNombre')

async function buscarOrigenes(mbids, nombreSinMbid = null) {
  const resultado = new Map()

  // Primero las que ya tenemos guardadas, y nos quedamos
  // solo con lass que faltan, y si todas estan en cache no hacemos
  // ninguna peticion.
  const faltantes = mbids.filter((id) => {
    if (cacheOrigenes.has(id)) {
      resultado.set(id, cacheOrigenes.get(id))
      return false
    }
    return true
  })

  if (faltantes.length === 0 && !nombreSinMbid) return resultado

  const clausulas = faltantes.map((id) => `arid:${id}`)
  if (nombreSinMbid) {
    clausulas.push(`artist:"${nombreSinMbid.replace(/"/g, '')}"`)
  }

  const params = new URLSearchParams({
    query: clausulas.join(' OR '),
    fmt: 'json',
    limit: '25',
  })

  let respuesta
  for (let intento = 0; intento < 2; intento++) {
    respuesta = await fetch(`${MUSICBRAINZ}?${params}`, {
      headers: { 'User-Agent': USER_AGENT },
      
      signal: AbortSignal.timeout(5000),
    })
    if (respuesta.status !== 503) break
    await esperar(1200)
  }

  if (!respuesta.ok) return resultado

  const datos = await respuesta.json()
  const artistas = datos.artists ?? []

  // "begin-area" es donde se formo la banda y "area"
  // donde la banda radica actualmente.
  // No siempre estan los dos datos, así que guardamos lo que exista.
  const leerOrigen = (a) => ({
    ciudad: a['begin-area']?.name ?? null,
    pais: a.area?.name ?? null,
  })

  const pedidos = new Set(faltantes)

  for (const artista of artistas) {
    if (!pedidos.has(artista.id)) continue
    const origen = leerOrigen(artista)
    cacheOrigenes.set(artista.id, origen)
    resultado.set(artista.id, origen)
  }


  if (nombreSinMbid) {
    const candidato = artistas
      .filter((a) => !pedidos.has(a.id) && (a.score ?? 0) >= 90)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0]
    if (candidato) resultado.set(POR_NOMBRE, leerOrigen(candidato))
  }

  if (artistas.length > 0) {
    for (const id of faltantes) {
      if (!cacheOrigenes.has(id)) {
        cacheOrigenes.set(id, { ciudad: null, pais: null })
      }
    }
  }

  return resultado
}

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost')
  const artista = url.searchParams.get('artista')

  res.setHeader('content-type', 'application/json')

  if (!artista) {
    res.statusCode = 400
    return res.end(JSON.stringify({ error: 'Falta el parámetro artista' }))
  }

  const apiKey = process.env.LASTFM_API_KEY
  if (!apiKey) {
    res.statusCode = 500
    return res.end(
      JSON.stringify({ error: 'Falta LASTFM_API_KEY en el servidor' }),
    )
  }

  const consultar = (metodo, extra = {}) => {
    const params = new URLSearchParams({
      method: metodo,
      artist: artista,
      autocorrect: '1',
      api_key: apiKey,
      format: 'json',
      ...extra,
    })
    return fetch(`${LASTFM}?${params}`).then((r) => r.json())
  }

  try {
    // getsimilar -> las bandas parecidas
    // getinfo    -> datos de la banda que busco el usuario
    const [datos, info] = await Promise.all([
      consultar('artist.getsimilar', { limit: '12' }),
      consultar('artist.getinfo').catch(() => ({})),
    ])

    if (datos.error) {
      res.statusCode = datos.error === 6 ? 404 : 502
      return res.end(JSON.stringify({ error: datos.error }))
    }

    const lista = datos.similarartists?.artist ?? []

    const nombreConsultada =
      datos.similarartists?.['@attr']?.artist ?? artista
    const mbidConsultada = info.artist?.mbid ?? null

    // Buscamos origenes de la banda por id en MusicBrainz
    const mbids = [mbidConsultada, ...lista.map((a) => a.mbid)].filter(
      Boolean,
    )

    const origenes = await buscarOrigenes(
      mbids,
      mbidConsultada ? null : nombreConsultada,
    ).catch(() => new Map())

    const origenConsultada = mbidConsultada
      ? origenes.get(mbidConsultada)
      : origenes.get(POR_NOMBRE)
    const consultada = {
      nombre: nombreConsultada,
      url:
        info.artist?.url ??
        `https://www.last.fm/music/${encodeURIComponent(nombreConsultada)}`,
      ciudad: origenConsultada?.ciudad ?? null,
      pais: origenConsultada?.pais ?? null,
    }

    const bandas = lista.map((a) => {
      const origen = origenes.get(a.mbid)
      return {
        nombre: a.name,
        afinidad: Math.round(Number(a.match) * 100),
        url: a.url,
        ciudad: origen?.ciudad ?? null,
        pais: origen?.pais ?? null,
      }
    })

    const conOrigen = bandas.filter((b) => b.ciudad || b.pais).length
    const completa = bandas.length === 0 || conOrigen > 0

    res.setHeader(
      'cache-control',
      completa
        ? 's-maxage=3600, stale-while-revalidate'
        : 's-maxage=30', // fallo puntual: reintentar pronto
    )
    res.end(JSON.stringify({ consultada, bandas }))
  } catch {
    res.statusCode = 502
    res.end(JSON.stringify({ error: 'lastfm-caido' }))
  }
}

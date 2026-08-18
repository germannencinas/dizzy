
const DEEZER = 'https://api.deezer.com'

export default async function handler(req, res) {

  const url = new URL(req.url, 'http://localhost')
  const q = url.searchParams.get('q')

  if (!q) {
    res.statusCode = 400
    res.setHeader('content-type', 'application/json')
    return res.end(JSON.stringify({ error: 'Falta el parámetro q' }))
  }

  try {
    const params = new URLSearchParams({ q, limit: '8' })
    const respuesta = await fetch(`${DEEZER}/search/artist?${params}`)
    const datos = await respuesta.json()

    res.setHeader('cache-control', 's-maxage=86400, stale-while-revalidate')
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify(datos))
  } catch {
    res.statusCode = 502
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ error: 'Deezer no respondió' }))
  }
}

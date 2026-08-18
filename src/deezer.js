
const BASE_URL = '/api/deezer'

const HASH_SIN_FOTO = 'd41d8cd98f00b204e9800998ecf8427e'

// Normalizar textos con acentos
function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Busca la foto de un artista en Deezer.
 * @param {string} nombre
 * @param {AbortSignal} [signal] - Cancelar la petición
 * @returns {Promise<string|null>} URL de la imagen, o null si no hay
 */
export async function buscarImagenArtista(nombre, signal) {
  const params = new URLSearchParams({ q: nombre })
  const respuesta = await fetch(`${BASE_URL}?${params}`, { signal })

  if (!respuesta.ok) return null

  const datos = await respuesta.json()
  const candidatos = datos.data ?? []

  const buscado = normalizar(nombre)

  const conFoto = candidatos.filter(
    (a) => a.picture_medium && !a.picture_medium.includes(HASH_SIN_FOTO),
  )

  const exactos = conFoto.filter((a) => normalizar(a.name) === buscado)

  // Si hay coincidencias exactas usamos esas, si no hay, usamos cualquiera con foto
  const pool = exactos.length > 0 ? exactos : conFoto
  if (pool.length === 0) return null

  const mejor = pool.reduce((a, b) => (b.nb_fan > a.nb_fan ? b : a))

  return mejor.picture_big ?? mejor.picture_medium ?? null
}

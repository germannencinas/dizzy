
/**
 * Busca bandas parecidas y datos de la banda buscada
 * @param {string} nombreBanda
 * @returns {Promise<{consultada: object, bandas: Array}>}
 */
export async function buscarSimilares(nombreBanda) {
  const params = new URLSearchParams({ artista: nombreBanda })
  const respuesta = await fetch(`/api/similares?${params}`)

  if (!respuesta.ok) {
    if (respuesta.status === 404) {
      throw new Error(`No encontramos "${nombreBanda}". ¿Está bien escrito?`)
    }
    throw new Error('Last.fm no responde. Inténtalo en un momento.')
  }

  const datos = await respuesta.json()

  // Devolvemos la banda que se busco y las bandas similares.
  return {
    consultada: datos.consultada ?? null,
    bandas: datos.bandas ?? [],
  }
}

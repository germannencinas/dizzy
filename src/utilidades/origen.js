// Formato de origen de la banda de MusicBrainz
export function formatearOrigen(ciudad, pais) {
  if (ciudad && pais) return `${ciudad}, ${pais}`
  return pais ?? ciudad ?? '—'
}

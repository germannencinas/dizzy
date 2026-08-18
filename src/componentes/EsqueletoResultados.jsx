
const CANTIDAD = 12

function EsqueletoResultados() {
  return (
    <section
      className="mx-auto max-w-6xl px-6 py-10"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">Buscando bandas parecidas…</span>

      <div className="flex items-baseline justify-between gap-4">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-mist" />
        <div className="h-4 w-24 animate-pulse rounded bg-mist" />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: CANTIDAD }).map((_, i) => (
          <div key={i}>
          
            <div
              className="aspect-square animate-pulse rounded-card bg-mist"
              style={{ animationDelay: `${i * 90}ms` }}
            />
            <div className="mt-3 space-y-2">
              <div
                className="h-4 w-3/4 animate-pulse rounded bg-mist"
                style={{ animationDelay: `${i * 90}ms` }}
              />
              <div
                className="h-3 w-1/2 animate-pulse rounded bg-mist"
                style={{ animationDelay: `${i * 90}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default EsqueletoResultados

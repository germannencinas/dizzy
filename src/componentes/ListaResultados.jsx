import TarjetaBanda from './TarjetaBanda.jsx'
import TarjetaDestacada from './TarjetaDestacada.jsx'

function ListaResultados({ bandas, consulta, destacada }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">

      {destacada && (
        <div>
          <TarjetaDestacada
            nombre={destacada.nombre}
            url={destacada.url}
            ciudad={destacada.ciudad}
            pais={destacada.pais}
          />
        </div>
      )}

      <div className="flex items-baseline justify-between gap-4 mt-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Si te gusta <span className="italic">{consulta}</span>, te recomiendo que esuches...
        </h2>
        
        <span className="font-data text-xs whitespace-nowrap text-ash">
          {bandas.length} resultados
        </span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">

        {bandas.map((banda, i) => (
          <TarjetaBanda
            key={banda.url}
            nombre={banda.nombre}
            afinidad={banda.afinidad}
            url={banda.url}
            ciudad={banda.ciudad}
            pais={banda.pais}
            indice={i}
          />
        ))}
      </div>
    </section>
  )
}

export default ListaResultados

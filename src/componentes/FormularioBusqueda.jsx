
function FormularioBusqueda({ valor, alCambiar, alEnviar, cargando, tamaño = 'grande' }) {
  const esGrande = tamaño === 'grande'

  return (

    <form
      onSubmit={alEnviar}
      className={`flex w-full gap-2 ${esGrande ? 'flex-col sm:flex-row' : ''}`}
    >
      
      <label
        htmlFor={`busqueda-${tamaño}`}
        className={esGrande ? 'sr-only' : 'sr-only'}
      >
        Nombre de la banda
      </label>

      <input
        id={`busqueda-${tamaño}`}
        type="text"
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        placeholder="Blink 182"
        autoComplete="off"
        className={`min-h-11 min-w-0 flex-1 rounded-full border border-line bg-paper text-ink transition-colors placeholder:text-ash/70 hover:border-grass focus:border-grass ${
          esGrande ? 'px-6 py-4 text-base' : 'px-4 py-2 text-sm'
        }`}
      />

      <button
        type="submit"
        disabled={cargando}
        className={`min-h-11 shrink-0 rounded-full bg-grass font-semibold text-ink transition-colors hover:bg-grass-dark disabled:opacity-40 ${
          esGrande ? 'px-8 py-4 text-base' : 'px-5 py-2 text-sm'
        }`}
      >
        {cargando ? 'Buscando…' : 'Buscar'}
      </button>
    </form>
  )
}

export default FormularioBusqueda

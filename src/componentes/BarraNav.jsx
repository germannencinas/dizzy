import Logo from './Logo.jsx'
import FormularioBusqueda from './FormularioBusqueda.jsx'

function BarraNav({ valor, alCambiar, alEnviar, cargando, alReiniciar }) {
  return (
    // sticky + backdrop-blur
    <header className="sticky top-0 z-10 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        {/* El logo reinicia el estado. */}
        <button
          onClick={alReiniciar}
          className="flex min-h-11 shrink-0 items-center rounded cursor-pointer"
          aria-label="Volver al inicio"
        >
          <Logo />
        </button>

        <div className="ml-auto min-w-0 flex-1 sm:max-w-sm">
          <FormularioBusqueda
            valor={valor}
            alCambiar={alCambiar}
            alEnviar={alEnviar}
            cargando={cargando}
            tamaño="compacto"
          />
        </div>
      </div>
    </header>
  )
}

export default BarraNav

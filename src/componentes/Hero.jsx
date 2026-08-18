import Logo from './Logo.jsx'
import FormularioBusqueda from './FormularioBusqueda.jsx'
import FondoCarrusel from './FondoCarrusel.jsx'

function Hero({ valor, alCambiar, alEnviar, cargando, error }) {
  return (

    <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-carbon px-6 py-16 text-white">
      <FondoCarrusel />

      <div className="relative w-full max-w-xl text-center">
        <Logo tamaño="lg" />

        <h1 className="mt-8 font-display text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
          ¿Cuál es tu banda favorita?
        </h1>

        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
          Te recomendaré una lista de bandas que deberías de escuchar similares a tu banda favorita.
        </p>

        <div className="mt-10">
          <FormularioBusqueda
            valor={valor}
            alCambiar={alCambiar}
            alEnviar={alEnviar}
            cargando={cargando}
            tamaño="grande"
          />
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-white">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

export default Hero

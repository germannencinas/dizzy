function PieDePagina() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-[13px] text-ash sm:flex-row">
        <p>Dizzy.</p>
        <p className="flex flex-wrap justify-center gap-x-1">
          <span>Datos de</span>
          {[
            ['Last.fm', 'https://www.last.fm'],
            ['MusicBrainz', 'https://musicbrainz.org'],
            ['Deezer', 'https://www.deezer.com'],
          ].map(([nombre, enlace], i, lista) => (
            <span key={nombre}>
              <a
                href={enlace}
                target="_blank"
                rel="noreferrer"
                className="text-ink underline underline-offset-2"
              >
                {nombre}
              </a>
              {i < lista.length - 1 && ','}
            </span>
          ))}
        </p>
      </div>
    </footer>
  )
}

export default PieDePagina


function Logo({ tamaño = 'sm' }) {
  const clases = tamaño === 'lg' ? 'text-3xl' : 'text-xl'

  return (
    <span className={`font-display font-extrabold tracking-tight ${clases}`}>
      Dizzy<span className="text-grass">.</span>
    </span>
  )
}

export default Logo

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function apiEnDesarrollo() {
  return {
    name: 'api-en-desarrollo',
    configureServer(server) {
      server.middlewares.use(async (req, res, siguiente) => {
        if (!req.url?.startsWith('/api/')) return siguiente()

        const nombre = req.url.split('?')[0].replace('/api/', '')
        try {
          
          const modulo = await server.ssrLoadModule(`/api/${nombre}.js`)
          await modulo.default(req, res)
        } catch (e) {
          siguiente(e)
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.LASTFM_API_KEY = env.LASTFM_API_KEY

  return {
    plugins: [react(), tailwindcss(), apiEnDesarrollo()],
  }
})

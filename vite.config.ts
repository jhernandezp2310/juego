import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// IMPORTANTE: Para GitHub Pages, ajusta la ruta base según tu repositorio
// Si tu repo se llama 'juego', usa '/juego/'
// Si tu repo se llama 'mi-repo', usa '/mi-repo/'
// Si es usuario.github.io (repositorio raíz), usa '/'
const REPO_NAME = 'juego' // ⬅️ CAMBIA ESTO por el nombre de tu repositorio

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? `/${REPO_NAME}/` : '/',
})


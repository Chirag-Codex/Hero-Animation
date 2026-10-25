import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Set base to repo name for GitHub Pages deployment
// Change 'car-scroll-animation' to your actual repo name if different
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})


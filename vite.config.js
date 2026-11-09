import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        pedido: fileURLToPath(new URL('./pedido/index.html', import.meta.url)),
        umAno: fileURLToPath(new URL('./1ano/index.html', import.meta.url)),
      },
    },
  },
})

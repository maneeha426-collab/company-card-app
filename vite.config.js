import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,             // Port React dev server will run on
  },
  build: {
    outDir: 'dist',         // Output folder for built files
  }
})

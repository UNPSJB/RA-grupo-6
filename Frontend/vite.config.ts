import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: './', //para las rutas, x las dudas
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});

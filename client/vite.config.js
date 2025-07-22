import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        // Replace hardcoded black fills with currentColor
        replaceAttrValues: {
          '#000': 'currentColor',
          '#000000': 'currentColor',
        },
        // Optional: support <title>, etc.
        titleProp: true,
        icon: false,
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})

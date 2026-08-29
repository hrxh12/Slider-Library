import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build:{
    copyPublicDir: false,
    lib:{
      entry:"./src/index.js",
      formats: ["es"],
      fileName:"slider-library"
    },
    rollupOptions:{
      external:[
        "react",
        "react-dom",
        "react/jsx-runtime",
      ]
    }
  }
});

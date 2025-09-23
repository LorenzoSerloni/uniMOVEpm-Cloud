import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv';
import viteCompression from 'vite-plugin-compression';

// Load environment variables from .env file
dotenv.config();

const mode = process.env.VITE_MODE;
const ip = process.env.VITE_IP;
let host = 'localhost';

if (mode === "production" && ip) {
    host = ip;
} else if (mode === "local") {
    host = 'localhost';
} else {
    console.error("Error in .env loading IP or MODE");
}

console.log(`Vite server will run on host: ${host}`);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress' })
  ],
  server: {
    host: host,
    port: 3001,
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      output: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  },
});
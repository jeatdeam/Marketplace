import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El cliente React vive en Jeatdeam/client; Express sirve el build (Jeatdeam/client/dist)
// y las imágenes/videos desde Jeatdeam/public, así que no se copian al build.
export default defineConfig({
    root: 'Jeatdeam/client',
    publicDir: '../public',
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': 'http://localhost:8080',
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        copyPublicDir: false,
    },
});

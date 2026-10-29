import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// El cliente React vive en Jeatdeam/client; Express sirve el build (Jeatdeam/client/dist)
// y las imágenes/videos desde Jeatdeam/public, así que no se copian al build.
// En Vercel no hay Express sirviendo estaticos: ahi si se copian.
// Vercel se detecta con `--mode vercel` (build:vercel) y no con process.env.VERCEL,
// que no siempre esta expuesto durante el build.
export default defineConfig(({ mode }) => {
    const enVercel = mode === 'vercel' || Boolean(process.env.VERCEL);
    return {
        root: 'Jeatdeam/client',
        publicDir: '../public',
        plugins: [react()],
        // postcss en linea: vite busca su config desde Jeatdeam/client y no encontraria la de la raiz
        css: {
            postcss: {
                plugins: [
                    tailwindcss({ config: fileURLToPath(new URL('./tailwind.config.js', import.meta.url)) }),
                    autoprefixer(),
                ],
            },
        },
        server: {
            port: 5173,
            proxy: {
                '/api': 'http://localhost:8080',
                // pdf de los pedidos (lo arma Express)
                '^/pedido/.+\.pdf$': 'http://localhost:8080',
            },
        },
        build: {
            // en Vercel el build va a <raiz>/dist, que es donde Vercel lo busca (vercel.json#outputDirectory)
            outDir: enVercel ? fileURLToPath(new URL('./dist', import.meta.url)) : 'dist',
            emptyOutDir: true,
            copyPublicDir: enVercel,
        },
    };
});

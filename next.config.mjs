// la tienda (Next.js, carpeta app/) vive en Vercel y la API (Express, Jeatdeam/app.ts) en Render.
// API_URL: url de Render; en local, el Express de `npm run dev:server` (puerto 8080).
// misma regla que Jeatdeam/client/src/servidor/datos.ts
const API_URL = (
    process.env.API_URL || (process.env.NODE_ENV === 'production' ? 'https://marketplace-1-daxe.onrender.com' : 'http://localhost:8080')
).replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
export default {
    // typescript 7 no trae la api que next usa para revisar tipos: los revisa `npm run typecheck`
    typescript: { ignoreBuildErrors: true },
    async redirects() {
        return [{ source: '/catalogoProducts', destination: '/productos', permanent: true }];
    },
    // el navegador habla con /api en el mismo dominio (la sesion del dashboard va en una cookie) y Vercel lo
    // pasa a Render. Van despues de las rutas de app/, asi /api/revalidar la atiende Next
    async rewrites() {
        return [
            { source: '/api/:path*', destination: `${API_URL}/api/:path*` },
            // pdf de los pedidos (lo arma Express)
            { source: '/pedido/:archivo', destination: `${API_URL}/pedido/:archivo` },
        ];
    },
};

La tienda (Next.js) está en Vercel y la API (Express) en Render: https://marketplace-obys.onrender.com


## Estructura (Next.js + Express, todo en TypeScript)

- `app/` — rutas de la tienda en Next.js (App Router). Las páginas se arman en el servidor de Vercel (SSR) con los productos, banners e imágenes guardados en su caché, así nadie espera a que Render despierte.
- `Jeatdeam/client/src/` — componentes, páginas y estado de la tienda en React (`.tsx`). `servidor/datos.ts` pide los datos a Render desde Vercel; `router.tsx` adapta los enlaces a Next.
- `Jeatdeam/app.ts` — servidor Express en TypeScript (se ejecuta con `tsx`): solo expone la API en `/api/...` y los PDF de `/pedido/...`.
- `Jeatdeam/shared/types.ts` — tipos compartidos entre cliente y servidor (productos, carrito, respuestas de la API).
- `public/` — imágenes, videos y `css/style.css` (los sirve Next; Express también los usa para el PDF y las subidas).

## Desarrollo

```bash
npm install
npm run dev          # API en http://localhost:8080 y tienda en http://localhost:3000
```

La tienda pasa `/api` y `/pedido` al Express local (`next.config.mjs`).

## Producción

```bash
npm run typecheck    # verifica tipos de la tienda y del servidor
npm run build:web    # build de Next.js (lo corre Vercel)
npm run build        # verifica tipos del servidor (lo corre Render)
npm start            # Express con la API en el puerto 8080 (Render)
```

### Variables

| Dónde | Variable | Para qué |
|---|---|---|
| Vercel | `API_URL` (opcional) | URL de Render; por defecto `https://marketplace-obys.onrender.com` |
| Vercel y Render | `REVALIDAR_SECRETO` | mismo valor en los dos: Render avisa a `/api/revalidar` al guardar en el dashboard y la tienda muestra el cambio al instante (sin ella tarda hasta 60 s) |
| Render | `URL_TIENDA` | URL de la tienda en Vercel: a ella se avisa y se redirigen las visitas que lleguen a Render fuera de `/api` |

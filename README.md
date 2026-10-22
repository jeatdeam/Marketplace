Debido a que el proyecto sirve los archivos HTML desde el back-end con node.js no puede ser deployado en github pages, por lo que he usado un Render como hosting para el proyecto. A continuacion adjunto la url para visualizar la pagina https://marketplace-1-daxe.onrender.com


## Estructura (React + Express, todo en TypeScript)

- `Jeatdeam/client/` — frontend en React + TypeScript (`.tsx`, Vite + React Router).
- `Jeatdeam/app.ts` — servidor Express en TypeScript (se ejecuta con `tsx`): expone la API en `/api/...` y sirve el build de React.
- `Jeatdeam/shared/types.ts` — tipos compartidos entre cliente y servidor (productos, carrito, respuestas de la API).
- `Jeatdeam/public/` — imágenes, videos y `css/style.css` (se sirven tal cual).

## Desarrollo

```bash
npm install
npm run dev:server   # API en http://localhost:8080
npm run dev:client   # React en http://localhost:5173 (redirige /api al servidor)
```

## Producción

```bash
npm run typecheck    # verifica tipos del cliente y del servidor
npm run build        # verifica tipos y genera Jeatdeam/client/dist
npm start            # Express sirve la API y la app React en el puerto 8080
```

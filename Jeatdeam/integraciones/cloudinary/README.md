# Cloudinary: imágenes del dashboard

## Qué hace

Cuando subes una imagen en el dashboard (productos, banners, categorías, slider), el backend la manda a Cloudinary y guarda la URL `https://res.cloudinary.com/...` en la tienda.

Sin Cloudinary la imagen se guarda en `Jeatdeam/public/uploads/`. En Render esa carpeta se borra en cada redeploy o reinicio, así que en producción Cloudinary es obligatorio.

## Archivos

| Archivo | Rol |
|---|---|
| `cloudinary.ts` | `cloudinaryActivo()` y `subirACloudinary(dataUrl)` |
| `../../controllers/adminController.ts` → `subirImagen` | valida tipo y peso (5 MB) y llama a Cloudinary si está activo |
| `../../app.ts` (CSP) | ya permite `img-src https://res.cloudinary.com` |

## Pasos

1. Crea una cuenta en https://cloudinary.com (el plan gratis alcanza).
2. Dashboard → **Settings → API Keys**. Copia:
   - **Cloud name**
   - **API Key**
   - **API Secret**
3. Pon los valores en `Jeatdeam/.env` (local) y en Render → *Environment*:
   ```
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxx
   CLOUDINARY_CARPETA=jeatdeam      # opcional, carpeta dentro de Media Library
   ```
4. Reinicia el servidor y sube una imagen desde `/dashboard`. Debe aparecer en **Media Library → jeatdeam**.

## PDF de los pedidos

Cada pedido genera un PDF que se sube a `jeatdeam/pedidos/` (o a tu `CLOUDINARY_CARPETA`). Su URL `https://res.cloudinary.com/...pdf` va en el mensaje de WhatsApp y en el correo, y funciona desde cualquier celular, incluso mientras pruebas en localhost.

**Paso obligatorio:** las cuentas gratis suben los PDF pero no los dejan ver (error 401). Actívalo así:

1. Cloudinary → **Settings** (engranaje) → **Security**.
2. Marca **Allow delivery of PDF and ZIP files** y guarda.

Mientras no esté activo, el servidor lo detecta, usa su propia URL (`/pedido/...pdf`) y avisa en la consola con `Cloudinary no entrega el pdf (401)`.

## Detalles

- La URL devuelta lleva `f_auto,q_auto`: Cloudinary entrega WebP o AVIF y la calidad justa para cada navegador.
- El API Secret solo vive en el backend. El navegador nunca habla con Cloudinary directamente.
- Las imágenes viejas en `/uploads/...` siguen funcionando en local. Si alguna está en la tienda de producción, vuelve a subirla.

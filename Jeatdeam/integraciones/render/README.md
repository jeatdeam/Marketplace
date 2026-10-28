# Render: despliegue de prueba

## Qué hace

Render compila el cliente React (`npm run build`) y arranca Express (`npm start`). Express sirve la API en `/api/...` y la app React. La configuración está en **`render.yaml` en la raíz del repo**: Render solo busca el Blueprint ahí.

## Archivos

| Archivo | Rol |
|---|---|
| `/render.yaml` | Blueprint: servicio web Node 22, build, start, health check y lista de variables |
| `/Jeatdeam/.env.ejemplo` | todas las variables con su explicación |
| `/Jeatdeam/entorno.ts` | lee `Jeatdeam/.env` si existe; en Render usa las variables del panel |
| `/Jeatdeam/app.ts` | `trust proxy`, cookie segura (`secure: 'auto'`), `SESSION_SECRET`, ruta `/api/salud` |

## Orden recomendado

1. **Supabase** primero (ver `../supabase/README.md`): crea las tablas y copia URL y secret key.
2. **Cloudinary** (ver `../cloudinary/README.md`): copia cloud name, API key y secret.
3. **Render**:
   1. Sube los cambios a GitHub (`main`).
   2. https://dashboard.render.com → **New → Blueprint** → elige el repo `jeatdeam/Marketplace`.
   3. Render lee `render.yaml` y pide las variables marcadas `sync: false`:
      | Variable | De dónde sale |
      |---|---|
      | `DASHBOARD_CLAVE` | la clave que quieras para entrar a `/dashboard` |
      | `SECRET_KEY` / `PUBLIC_KEY` | Stripe → Developers → API keys (usa las de **test**) |
      | `EMAIL_USER` / `EMAIL_PASS` | Gmail + contraseña de aplicación |
      | `CLOUDINARY_*` | Cloudinary → Settings → API Keys |
      | `SUPABASE_URL` / `SUPABASE_SECRET_KEY` | Supabase → Project Settings → API Keys |

      `SESSION_SECRET` la genera Render sola.
   4. **Apply**. El primer build tarda unos minutos.
4. Comprueba:
   - `https://<tu-servicio>.onrender.com/api/salud` → `{"ok":true}`
   - En **Logs**: `Datos cargados de Supabase...`
   - Sube una imagen en `/dashboard` y reinicia el servicio (**Manual Deploy → Restart**). La imagen y los cambios deben seguir ahí.

## Si ya tienes el servicio creado a mano

El README del proyecto apunta a `marketplace-1-daxe.onrender.com`. Puedes mantener ese servicio en vez de crear el Blueprint. En **Settings** pon:

- Build Command: `npm ci --include=dev && npm run build`
- Start Command: `npm start`
- Health Check Path: `/api/salud`

Y en **Environment** agrega las variables de la tabla, más `NODE_VERSION=22`, `NODE_ENV=production` y un `SESSION_SECRET` largo.

## Límites del plan gratis

- El servicio se **duerme tras 15 min sin visitas**; la primera visita luego tarda unos 30-60 s.
- El disco se **borra** en cada deploy o reinicio. Por eso los datos van a Supabase y las imágenes a Cloudinary.
- Las sesiones del dashboard viven en memoria: al reiniciar hay que volver a iniciar sesión.
- El **carrito** también vive en memoria del servidor y es compartido. Sirve para la prueba, pero no para producción real.

## Stripe

`success_url` y `cancel_url` se arman con el dominio de la petición, así que funcionan solos con `onrender.com`. Si usas el webhook `/pagorealizado`, regístralo en Stripe con `https://<tu-servicio>.onrender.com/pagorealizado`.

# Supabase: datos de la tienda

## Qué hace

La tienda sigue siendo **un solo JSON** (productos, banners y apariencia, lo mismo que `datos/tienda.json`). Supabase lo guarda en una fila de la tabla `tienda`, así no se pierde cuando Render reinicia.

También guarda los **reclamos** (libro de reclamaciones), los **mensajes de contacto** y los **pedidos**. Antes vivían en memoria y se perdían al reiniciar.

Cada pedido tiene un PDF en una URL pública, `/pedido/KM-000013-<token>.pdf`, que va en el mensaje de WhatsApp. El PDF no se guarda como archivo: se arma con los datos de la tabla `pedidos` cada vez que alguien lo abre. El token aleatorio de 16 caracteres evita que se adivinen los pedidos de otros clientes.

Flujo:

1. Al arrancar se lee `datos/tienda.json` y luego `cargarDeSupabase()`:
   - si Supabase ya tiene la tienda, **Supabase manda** y se sobrescribe el json local;
   - si la tabla está vacía, se sube la tienda local como punto de partida.
2. Cada cambio del dashboard (`guardarAlmacen()`) escribe el json local y hace `upsert` en Supabase, en fila para que no se pisen.
3. Sin las variables de Supabase, todo funciona como antes, solo con el json.

## Archivos

| Archivo | Rol |
|---|---|
| `esquema.sql` | crea las tablas `tienda`, `reclamos`, `mensajes` y `pedidos`, con RLS activo |
| `supabase.ts` | cliente y funciones `leerTienda`, `guardarTienda`, `insertarReclamo`, `insertarMensaje`, `insertarPedido`, `leerPedido` |
| `../../controllers/almacen.ts` | `cargarDeSupabase()` y la subida en `guardarAlmacen()` |
| `../../controllers/atencionController.ts` | reclamos y contacto |
| `../../controllers/pedidosController.ts` | crea el pedido (`POST /api/pedidos`) y arma su PDF (`GET /pedido/:archivo`) |
| `../../app.ts` | `await cargarDeSupabase()` antes de `app.listen` |

## Pasos

1. Crea un proyecto en https://supabase.com. Región sugerida: **South America (São Paulo)** o **East US**, cerca de Render en Virginia.
2. **SQL Editor → New query**: pega `esquema.sql` y dale **Run**.
3. **Project Settings → API Keys** (o *Data API*). Copia:
   - **Project URL** → `SUPABASE_URL`
   - **Secret key** (`sb_secret_...`) o la **service_role** legacy → `SUPABASE_SECRET_KEY`
4. Ponlas en `Jeatdeam/.env` y en Render → *Environment*:
   ```
   SUPABASE_URL=https://xxxxxxxx.supabase.co
   SUPABASE_SECRET_KEY=sb_secret_xxxxxxxx
   ```
5. Arranca el servidor. En la consola debe salir `Supabase estaba vacio: se subio la tienda local.` la primera vez, y luego `Datos cargados de Supabase: N productos...`.
6. Revisa en **Table Editor → tienda** que exista la fila `principal`.

## Seguridad

- La secret key **salta RLS** y da acceso total: solo va en el backend (Render / `.env`), nunca en el cliente React ni en git.
- Las tablas tienen RLS activo **sin políticas**, así que la clave pública (anon/publishable) no puede leer ni escribir nada.
- Para ver reclamos y mensajes usa el **Table Editor** de Supabase.

## Nota sobre el plan gratis

Supabase pausa los proyectos gratis tras ~1 semana sin actividad. Si la tienda no carga datos, entra al panel y dale **Restore**.

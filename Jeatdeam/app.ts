// primero: carga las variables de entorno antes de que los controladores las lean
import { enProduccion } from './entorno.ts';
import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import expressSession from 'express-session';

import taskController from './controllers/taskController.ts';
import atencionController from './controllers/atencionController.ts';
import adminController, { requiereAdmin } from './controllers/adminController.ts';
import pedidosController from './controllers/pedidosController.ts';
import { cargarDeSupabase } from './controllers/almacen.ts';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Render pone un proxy https delante: sin esto req.ip seria la del proxy y la cookie segura no se enviaria
app.set('trust proxy', 1);

// Middlewares básicos
app.use(cors());
app.use(morgan('dev'));

// Helmet sin CSP para que no interfiera
app.use(helmet({ contentSecurityPolicy: false }));

// Tu propia Content Security Policy personalizada
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self' 'unsafe-inline' https:; " +
        "img-src 'self' data: https://res.cloudinary.com; " +
        "font-src 'self' https: data:; " +
        "connect-src 'self' https:; " +
        "frame-src 'self';"
    );
    next();
});

// Middleware para caché
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Middleware de sesión
if (enProduccion && !process.env.SESSION_SECRET) {
    console.warn('⚠️ Falta SESSION_SECRET: las sesiones del dashboard usan un secreto por defecto.');
}
app.use(expressSession({
    secret: process.env.SESSION_SECRET ?? 'tu-secreto-aqui',
    resave: false,
    saveUninitialized: true,
    // 'auto': cookie segura cuando la peticion llega por https (Render), normal en localhost
    cookie: { secure: 'auto', httpOnly: true, sameSite: 'lax' }
}));

// Middlewares de archivos estáticos y datos
// public/ esta en la raiz del repo: la comparte con la tienda Next.js
app.use(express.static(path.join(__dirname, '..', 'public')));
// 8mb: el dashboard sube imagenes en base64 (hasta 5 MB cada una)
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ extended: true }));

// API consumida por el cliente React
const api = express.Router();

// Render la consulta para saber si el servicio esta vivo (healthCheckPath en render.yaml)
api.get("/salud", (_req, res) => { res.json({ ok: true }); });

// GET
api.get("/datos/cliente/compra/estatic", taskController.verificarDatos);
api.get("/extraer/datos/marcas/products", taskController.extraerMarcas);
api.get("/carrito/estado/cuack/cuack", taskController.estadoCarrito);
api.get("/base/datos/json", taskController.baseDatosProducts);

// POST
api.post("/compra/compra/compra/compra", taskController.agregarCarrito);
api.post("/datos/cliente/compra/short", taskController.recibirDatosShort);
api.post("/datos/cliente/compra/complete", taskController.recibirDatosComplete);
api.post("/generar-qr", taskController.controllerQr);
api.post("/reclamaciones", atencionController.registrarReclamo);
api.post("/contacto", atencionController.registrarContacto);
api.post("/pedidos", pedidosController.crearPedido);
api.get("/banners", adminController.listarBanners);
api.get("/apariencia", adminController.verApariencia);

// Dashboard (no se enlaza desde la tienda): la sesión se revisa antes de tocar datos
api.post("/admin/login", adminController.login);
api.post("/admin/logout", adminController.logout);
api.get("/admin/sesion", adminController.sesion);
api.get("/admin/productos", requiereAdmin, adminController.listarProductos);
api.post("/admin/productos", requiereAdmin, adminController.crearProducto);
api.put("/admin/productos/:id", requiereAdmin, adminController.editarProducto);
api.delete("/admin/productos/:id", requiereAdmin, adminController.borrarProducto);
api.put("/admin/banners/:posicion", requiereAdmin, adminController.guardarBanner);
api.delete("/admin/banners/:posicion", requiereAdmin, adminController.borrarBanner);
api.put("/admin/categorias/:slug", requiereAdmin, adminController.guardarCategoria);
api.delete("/admin/categorias/:slug", requiereAdmin, adminController.borrarCategoria);
api.put("/admin/slider/:indice", requiereAdmin, adminController.guardarGrupoSlider);
api.delete("/admin/slider/:indice", requiereAdmin, adminController.borrarGrupoSlider);
api.post("/admin/imagenes", requiereAdmin, adminController.subirImagen);

// DELETE
api.delete("/compra/compra/compra/compra", taskController.deleteCarrito);
api.delete("/datos/cliente/compra", taskController.deleteDatos);

app.use("/api", api);

// PDF del pedido: url publica que va en el mensaje de whatsapp (/pedido/KM-000013-<token>.pdf)
app.get("/pedido/:archivo", pedidosController.verPdf);

// la tienda (Next.js) vive en Vercel: este servidor solo es la API. Cualquier otra ruta GET
// se manda a la tienda si URL_TIENDA esta definida
app.get("*", (req, res) => {
    const tienda = process.env.URL_TIENDA?.split(',')[0]?.trim().replace(/\/+$/, '');
    if (tienda) return res.redirect(`${tienda}${req.originalUrl}`);
    res.status(404).json({ error: 'No encontrado: la tienda está en Vercel y aquí solo vive la API' });
});

// Escuchar servidor (antes se trae la tienda de Supabase, si esta configurado)
await cargarDeSupabase();
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

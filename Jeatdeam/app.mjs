import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import expressSession from 'express-session';
import Stripe from 'stripe';

import taskController from './controllers/taskController.mjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

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
app.use(expressSession({
    secret: 'tu-secreto-aqui',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Carrito en sesión
app.use((req, res, next) => {
    if (!req.session.carrito) req.session.carrito = [];
    res.locals.carrito = req.session.carrito;
    next();
});

// Configuración de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middlewares de archivos estáticos y datos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas estáticas
app.get("/", taskController.index);
app.get("/contacto", taskController.contacto);
app.get("/envios", taskController.envios);
app.get("/productos", taskController.productos);
app.get("/promociones", taskController.promociones);
app.get("/quienes-somos", taskController.quienesSomos);
app.get("/catalogoProducts", taskController.catalogoProducts);
app.get("/producto", taskController.product);
app.get("/compra/compra/compra/compra", taskController.finalizarCompra);
app.get("/datos/cliente/compra/estatic", taskController.verificarDatos);
app.get("/extraer/datos/marcas/products", taskController.extraerMarcas);
app.get("/carrito/estado/cuack/cuack", taskController.estadoCarrito);
app.get("/base/datos/json", taskController.baseDatosProducts);

// Rutas dinámicas
app.get("/:name", taskController.marcaProducts);
app.get("/:brand/:categoria", taskController.categoriaProduct);
app.get("/:brand/:categoria/:product", taskController.detailProduct);

// POST
app.post("/compra/compra/compra/compra", taskController.agregarCarrito);
app.post("/datos/cliente/compra/short", taskController.recibirDatosShort);
app.post("/datos/cliente/compra/complete", taskController.recibirDatosComplete);
app.post("/create-checkout-session", taskController.redireccionamientoToPay);
app.post("/generar-qr", taskController.controllerQr);

// DELETE
app.delete("/compra/compra/compra/compra", taskController.deleteCarrito);
app.delete("/datos/cliente/compra", taskController.deleteDatos);

// Escuchar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

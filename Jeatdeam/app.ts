import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import expressSession from 'express-session';

import taskController from './controllers/taskController.ts';
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

// Middlewares de archivos estáticos y datos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API consumida por el cliente React
const api = express.Router();

// GET
api.get("/datos/cliente/compra/estatic", taskController.verificarDatos);
api.get("/extraer/datos/marcas/products", taskController.extraerMarcas);
api.get("/carrito/estado/cuack/cuack", taskController.estadoCarrito);
api.get("/base/datos/json", taskController.baseDatosProducts);

// POST
api.post("/compra/compra/compra/compra", taskController.agregarCarrito);
api.post("/datos/cliente/compra/short", taskController.recibirDatosShort);
api.post("/datos/cliente/compra/complete", taskController.recibirDatosComplete);
api.post("/create-checkout-session", taskController.redireccionamientoToPay);
api.post("/generar-qr", taskController.controllerQr);

// DELETE
api.delete("/compra/compra/compra/compra", taskController.deleteCarrito);
api.delete("/datos/cliente/compra", taskController.deleteDatos);

app.use("/api", api);

// Webhook de pagos (se mantiene en la raíz porque lo llama un servicio externo)
app.post("/pagorealizado", taskController.pagoRealizado)

// Cliente React compilado (npm run build)
const clientDist = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientDist));

// Cualquier otra ruta GET la resuelve React Router
app.get("*", (req, res) => {
    const indexHtml = path.join(clientDist, 'index.html');
    if (!fs.existsSync(indexHtml)) {
        return res.status(503).send('El cliente React no está compilado. Ejecuta "npm run build".');
    }
    res.sendFile(indexHtml);
});

// Escuchar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

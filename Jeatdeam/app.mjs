import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import expressSession from 'express-session';  // Importamos el middleware de sesión
import Stripe from 'stripe';
// import crypto from "crypto";

import taskController from './controllers/taskController.mjs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// const port = 5000;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
// app.use((req,res,next)=>{
//     res.locals.nonce=crypto.randomBytes(16).toString("base64");
// })


// Configuración del middleware de sesión
app.use(expressSession({
    secret: 'tu-secreto-aqui',  // Cambia esto por una clave secreta
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Cambia a `true` si usas HTTPS
}));

// Middleware para pasar carrito a todas las vistas
app.use((req, res, next) => {
    // Asegúrate de que req.session.carrito esté inicializado
    if (!req.session.carrito) {
        req.session.carrito = [];
    }
    res.locals.carrito = req.session.carrito;
    next();
});




// Configurar las vistas y las rutas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req,res, next) =>{
    res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
   next();
})


// Rutas estaticas
app.get("/", taskController.index);
app.get("/catalogoProducts", taskController.catalogoProducts);
app.get("/producto", taskController.product);
app.get("/compra/compra/compra/compra", taskController.finalizarCompra);
app.get("/datos/cliente/compra/estatic",taskController.verificarDatos);
app.get("/extraer/datos/marcas/products",taskController.extraerMarcas)
//rutas dinamicas
app.get("/:name", taskController.marcaProducts);
app.get("/:brand/:categoria",taskController.categoriaProduct)
app.get("/:brand/:categoria/:product", taskController.detailProduct);


app.get('/carrito/estado/cuack/cuack',taskController.estadoCarrito);
//base de datos
app.get('/base/datos/json',taskController.baseDatosProducts)

// Ruta para agregar al carrito
app.post('/compra/compra/compra/compra', taskController.agregarCarrito);

app.post('/datos/cliente/compra/short',taskController.recibirDatosShort);
app.post('/datos/cliente/compra/complete',taskController.recibirDatosComplete);

app.post('/create-checkout-session',taskController.redireccionamientoToPay);

app.post("/generar-qr",taskController.controllerQr)

//RUTAS DELETE
app.delete('/compra/compra/compra/compra',taskController.deleteCarrito);
app.delete('/datos/cliente/compra',taskController.deleteDatos)


const PORT=process.env.PORT||3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))

// app.listen(port, () => {
//     console.log(`Servidor en http://localhost:${port}`);
// });

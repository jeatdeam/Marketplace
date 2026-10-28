import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import type { NextFunction, Request, Response } from 'express';

import { almacen, guardarAlmacen } from './almacen.ts';
import { GRUPOS_SLIDER, MAX_TEXTO_SLIDER, POSICIONES_BANNER, type Banner, type GrupoSlider, type PosicionBanner, type Product, type ProductoEntrada, type TemaBanner } from '../shared/types.ts';

declare module 'express-session' {
    interface SessionData {
        admin?: boolean;
    }
}

// prototipo: una sola clave para el dashboard; se cambia con DASHBOARD_CLAVE en Jeatdeam/.env
const CLAVE = process.env.DASHBOARD_CLAVE ?? 'admin123';
const CARPETA_SUBIDAS = fileURLToPath(new URL('../public/uploads/', import.meta.url));
const TIPOS_IMAGEN: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' };
const MAX_IMAGEN = 5 * 1024 * 1024;
const TEMAS: TemaBanner[] = ['hielo', 'blanco', 'cielo'];

// bloqueo simple contra fuerza bruta: 5 intentos fallidos por ip y 15 minutos de espera
const intentos = new Map<string, { fallos: number; hasta: number }>();

const iguales = (a: string, b: string) => {
    const x = Buffer.from(a);
    const y = Buffer.from(b);
    return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export const requiereAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.admin) return next();
    res.status(401).json({ error: 'Inicia sesión en el dashboard' });
};

const login = (req: Request<unknown, unknown, { clave?: string }>, res: Response) => {
    const ip = req.ip ?? 'desconocida';
    const registro = intentos.get(ip);
    if (registro && registro.hasta > Date.now()) {
        return res.status(429).json({ error: 'Demasiados intentos. Espera 15 minutos.' });
    }
    if (!iguales(String(req.body?.clave ?? ''), CLAVE)) {
        const fallos = (registro?.fallos ?? 0) + 1;
        intentos.set(ip, { fallos, hasta: fallos >= 5 ? Date.now() + 15 * 60 * 1000 : 0 });
        return res.status(401).json({ error: 'Clave incorrecta' });
    }
    intentos.delete(ip);
    req.session.admin = true;
    res.json({ ok: true });
};

const logout = (req: Request, res: Response) => {
    req.session.admin = false;
    res.json({ ok: true });
};

const sesion = (req: Request, res: Response) => {
    res.json({ admin: Boolean(req.session.admin) });
};

// ---------- productos ----------

// el nombre va en la url del producto (/marca/categoria/nombre), asi que no puede llevar estos signos
const PROHIBIDOS = /[/?#%\\]/;

function validarProducto(body: Partial<ProductoEntrada>, idActual?: string): { error: string } | { datos: ProductoEntrada } {
    const texto = (valor: unknown) => (typeof valor === 'string' ? valor.trim() : '');
    const name = texto(body.name);
    const brand = texto(body.brand);
    const category = texto(body.category).toLowerCase();
    const subtitle = texto(body.subtitle);
    if (!name || !brand || !category || !subtitle) return { error: 'Nombre, marca, categoría y título son obligatorios' };
    if ([name, brand, category].some((valor) => PROHIBIDOS.test(valor))) return { error: 'Nombre, marca y categoría no pueden llevar / ? # % \\' };
    const repetido = almacen.productos.find((p) => p.brand === brand && p.category === category && p.name.toLowerCase() === name.toLowerCase() && String(p.id) !== idActual);
    if (repetido) return { error: 'Ya existe un producto con ese nombre en esa marca y categoría' };

    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) return { error: 'El precio debe ser un número mayor o igual a 0' };
    const descuento = Number(body.descuento ?? 0);
    if (!Number.isInteger(descuento) || descuento < 0 || descuento > 90) return { error: 'El descuento debe ser un entero de 0 a 90' };
    const stock = Number(body.stock ?? 0);
    if (!Number.isInteger(stock) || stock < 0) return { error: 'El stock debe ser un entero mayor o igual a 0' };

    const img = Array.isArray(body.img) ? body.img.map(texto).filter(Boolean) : [];
    if (img.length < 1 || img.length > 8) return { error: 'El producto necesita de 1 a 8 imágenes' };

    return {
        datos: {
            name,
            brand,
            category,
            subtitle,
            price,
            img,
            descuento,
            stock,
            nuevo: Boolean(body.nuevo),
            descripcion: texto(body.descripcion),
            caracteristicas: Array.isArray(body.caracteristicas) ? body.caracteristicas.map(texto).filter(Boolean).slice(0, 10) : [],
        },
    };
}

const aProducto = (datos: ProductoEntrada, base?: Product): Product => ({
    id: base?.id ?? `jd_${crypto.randomBytes(6).toString('hex')}`,
    title: base?.title ?? 'Jeatdeam',
    completed: base?.completed ?? true,
    shortInfo: base?.shortInfo ?? [],
    longInfo: base?.longInfo ?? [],
    ...datos,
    // el resto de la tienda trabaja en centimos (como stripe)
    price: Math.round(datos.price * 100),
});

const listarProductos = (_req: Request, res: Response) => {
    res.json({ productos: almacen.productos });
};

const crearProducto = (req: Request<unknown, unknown, Partial<ProductoEntrada>>, res: Response) => {
    const resultado = validarProducto(req.body ?? {});
    if ('error' in resultado) return res.status(400).json(resultado);
    const producto = aProducto(resultado.datos);
    // al final de la lista: "nuevos ingresos" toma los ultimos productos
    almacen.productos.push(producto);
    guardarAlmacen();
    res.status(201).json({ producto });
};

const editarProducto = (req: Request<{ id: string }, unknown, Partial<ProductoEntrada>>, res: Response) => {
    const indice = almacen.productos.findIndex((p) => String(p.id) === req.params.id);
    if (indice === -1) return res.status(404).json({ error: 'Producto no encontrado' });
    const resultado = validarProducto(req.body ?? {}, req.params.id);
    if ('error' in resultado) return res.status(400).json(resultado);
    const producto = aProducto(resultado.datos, almacen.productos[indice]);
    almacen.productos[indice] = producto;
    guardarAlmacen();
    res.json({ producto });
};

const borrarProducto = (req: Request<{ id: string }>, res: Response) => {
    const indice = almacen.productos.findIndex((p) => String(p.id) === req.params.id);
    if (indice === -1) return res.status(404).json({ error: 'Producto no encontrado' });
    const [borrado] = almacen.productos.splice(indice, 1);
    guardarAlmacen();
    res.json({ borrado: borrado.id });
};

// ---------- banners ----------

const listarBanners = (_req: Request, res: Response) => {
    res.json({ banners: almacen.banners });
};

const guardarBanner = (req: Request<{ posicion: string }, unknown, Partial<Banner>>, res: Response) => {
    const posicion = req.params.posicion as PosicionBanner;
    if (!POSICIONES_BANNER.includes(posicion)) return res.status(404).json({ error: 'Posición de banner desconocida' });
    const body = req.body ?? {};
    const titulo = typeof body.titulo === 'string' ? body.titulo.trim().slice(0, 80) : '';
    const enlace = typeof body.enlace === 'string' ? body.enlace.trim() : '';
    if (!titulo) return res.status(400).json({ error: 'El banner necesita un título' });
    // solo rutas internas: un banner no debe mandar al visitante a otro sitio
    if (!enlace.startsWith('/') || enlace.startsWith('//')) return res.status(400).json({ error: 'El enlace debe ser una ruta de la tienda, ej. /promociones' });

    const banner: Banner = {
        posicion,
        titulo,
        subtitulo: typeof body.subtitulo === 'string' ? body.subtitulo.trim().slice(0, 140) : '',
        etiqueta: typeof body.etiqueta === 'string' ? body.etiqueta.trim().slice(0, 20) : '',
        imagen: typeof body.imagen === 'string' ? body.imagen.trim() : '',
        enlace,
        tema: TEMAS.includes(body.tema as TemaBanner) ? (body.tema as TemaBanner) : 'hielo',
        actualizado: new Date().toISOString(),
    };
    const indice = almacen.banners.findIndex((b) => b.posicion === posicion);
    if (indice === -1) almacen.banners.push(banner);
    else almacen.banners[indice] = banner;
    guardarAlmacen();
    res.json({ banner });
};

// volver a automatico = borrar el banner de esa posicion
const borrarBanner = (req: Request<{ posicion: string }>, res: Response) => {
    const indice = almacen.banners.findIndex((b) => b.posicion === req.params.posicion);
    if (indice !== -1) {
        almacen.banners.splice(indice, 1);
        guardarAlmacen();
    }
    res.json({ ok: true });
};

// ---------- imagenes del inicio: categorias y slider ----------

// solo imagenes subidas a la tienda (/uploads/...) o con https: nada de javascript: ni data: gigantes
const imagenValida = (valor: unknown) => {
    const url = typeof valor === 'string' ? valor.trim() : '';
    return (url.startsWith('/') && !url.startsWith('//')) || url.startsWith('https://') ? url.slice(0, 500) : '';
};
const SLUG = /^[a-z0-9-]{1,40}$/;

const verApariencia = (_req: Request, res: Response) => {
    res.json({ apariencia: almacen.apariencia });
};

const guardarCategoria = (req: Request<{ slug: string }, unknown, { imagen?: string }>, res: Response) => {
    if (!SLUG.test(req.params.slug)) return res.status(404).json({ error: 'Categoría desconocida' });
    const imagen = imagenValida(req.body?.imagen);
    if (!imagen) return res.status(400).json({ error: 'Sube una imagen para la categoría' });
    almacen.apariencia.categorias[req.params.slug] = imagen;
    guardarAlmacen();
    res.json({ apariencia: almacen.apariencia });
};

// volver a la imagen original de la categoria
const borrarCategoria = (req: Request<{ slug: string }>, res: Response) => {
    if (!SLUG.test(req.params.slug)) return res.status(404).json({ error: 'Categoría desconocida' });
    delete almacen.apariencia.categorias[req.params.slug];
    guardarAlmacen();
    res.json({ apariencia: almacen.apariencia });
};

const grupoValido = (indice: string) => /^\d$/.test(indice) && Number(indice) < GRUPOS_SLIDER;

const textoSlider = (valor: unknown) => (typeof valor === 'string' ? valor.trim().slice(0, MAX_TEXTO_SLIDER) : '');

const guardarGrupoSlider = (req: Request<{ indice: string }, unknown, Partial<GrupoSlider>>, res: Response) => {
    if (!grupoValido(req.params.indice)) return res.status(404).json({ error: 'Grupo del slider desconocido' });
    const imagenUno = imagenValida(req.body?.imagenUno);
    const imagenDos = imagenValida(req.body?.imagenDos);
    if (!imagenUno || !imagenDos) return res.status(400).json({ error: 'El grupo necesita la imagen 1 y la imagen 2' });
    const textoUno = textoSlider(req.body?.textoUno);
    const textoDos = textoSlider(req.body?.textoDos);
    if (!textoUno || !textoDos) return res.status(400).json({ error: 'Escribe los dos textos de las esquinas' });
    almacen.apariencia.slider[req.params.indice] = { imagenUno, imagenDos, textoUno, textoDos };
    guardarAlmacen();
    res.json({ apariencia: almacen.apariencia });
};

const borrarGrupoSlider = (req: Request<{ indice: string }>, res: Response) => {
    if (!grupoValido(req.params.indice)) return res.status(404).json({ error: 'Grupo del slider desconocido' });
    delete almacen.apariencia.slider[req.params.indice];
    guardarAlmacen();
    res.json({ apariencia: almacen.apariencia });
};

// ---------- imagenes ----------

// recibe la imagen como data url (base64) para no sumar dependencias; se guarda en public/uploads
const subirImagen = (req: Request<unknown, unknown, { datos?: string }>, res: Response) => {
    const coincide = /^data:(image\/[a-z+]+);base64,(.+)$/.exec(String(req.body?.datos ?? ''));
    if (!coincide || !TIPOS_IMAGEN[coincide[1]]) return res.status(400).json({ error: 'Formato no permitido (JPG, PNG, WEBP, GIF o AVIF)' });
    const buffer = Buffer.from(coincide[2], 'base64');
    if (buffer.length > MAX_IMAGEN) return res.status(400).json({ error: 'La imagen pesa más de 5 MB' });
    fs.mkdirSync(CARPETA_SUBIDAS, { recursive: true });
    const nombre = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${TIPOS_IMAGEN[coincide[1]]}`;
    fs.writeFileSync(path.join(CARPETA_SUBIDAS, nombre), buffer);
    res.status(201).json({ url: `/uploads/${nombre}` });
};

export default {
    login,
    logout,
    sesion,
    listarProductos,
    crearProducto,
    editarProducto,
    borrarProducto,
    listarBanners,
    guardarBanner,
    borrarBanner,
    verApariencia,
    guardarCategoria,
    borrarCategoria,
    guardarGrupoSlider,
    borrarGrupoSlider,
    subirImagen,
};

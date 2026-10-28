import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import type { Apariencia, Banner, Product } from '../shared/types.ts';

// prototipo: todo vive en memoria y se copia a un json del backend para sobrevivir a los reinicios
const CARPETA = fileURLToPath(new URL('../datos/', import.meta.url));
const ARCHIVO = path.join(CARPETA, 'tienda.json');

interface Datos {
    productos: Product[];
    banners: Banner[];
    apariencia: Apariencia;
}

// los arreglos y objetos se modifican en su lugar (push/splice/asignar) para que quien los importe vea siempre lo ultimo
export const almacen: Datos = { productos: [], banners: [], apariencia: { categorias: {}, slider: {} } };

let existiaArchivo = false;

export function cargarAlmacen(semilla: Product[]): Product[] {
    try {
        const guardado = JSON.parse(fs.readFileSync(ARCHIVO, 'utf-8')) as Partial<Datos>;
        almacen.productos.push(...(guardado.productos ?? []));
        almacen.banners.push(...(guardado.banners ?? []));
        Object.assign(almacen.apariencia.categorias, guardado.apariencia?.categorias);
        Object.assign(almacen.apariencia.slider, guardado.apariencia?.slider);
        existiaArchivo = true;
        console.log(`Datos cargados de ${path.relative(process.cwd(), ARCHIVO)}: ${almacen.productos.length} productos, ${almacen.banners.length} banners`);
    } catch {
        // primera vez (o archivo roto): se parte de los productos escritos en el codigo
        almacen.productos.push(...semilla);
    }
    return almacen.productos;
}

// true solo la primera vez: es cuando hace falta traer ids y precios de stripe
export const esPrimeraCarga = () => !existiaArchivo;

// escritura atomica: primero a un temporal y luego se renombra, asi un corte no deja el json a medias
export function guardarAlmacen() {
    fs.mkdirSync(CARPETA, { recursive: true });
    const temporal = `${ARCHIVO}.tmp`;
    fs.writeFileSync(temporal, JSON.stringify(almacen, null, 2));
    fs.renameSync(temporal, ARCHIVO);
    existiaArchivo = true;
}

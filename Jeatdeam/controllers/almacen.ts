import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import type { Apariencia, Banner, Product } from '../shared/types.ts';
import { guardarTienda, leerTienda, supabaseActivo } from '../integraciones/supabase/supabase.ts';

// prototipo: todo vive en memoria y se copia a un json del backend para sobrevivir a los reinicios.
// con Supabase configurado, ese mismo json tambien se guarda alla (en Render el disco se borra al redeplegar)
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

// reemplaza el contenido sin cambiar las referencias (taskController guarda almacen.productos como baseDatos)
function aplicar(guardado: Partial<Datos>) {
    almacen.productos.splice(0, almacen.productos.length, ...(guardado.productos ?? []));
    almacen.banners.splice(0, almacen.banners.length, ...(guardado.banners ?? []));
    for (const clave of Object.keys(almacen.apariencia.categorias)) delete almacen.apariencia.categorias[clave];
    for (const clave of Object.keys(almacen.apariencia.slider)) delete almacen.apariencia.slider[clave];
    Object.assign(almacen.apariencia.categorias, guardado.apariencia?.categorias);
    Object.assign(almacen.apariencia.slider, guardado.apariencia?.slider);
}

export function cargarAlmacen(semilla: Product[]): Product[] {
    try {
        aplicar(JSON.parse(fs.readFileSync(ARCHIVO, 'utf-8')) as Partial<Datos>);
        existiaArchivo = true;
        console.log(`Datos cargados de ${path.relative(process.cwd(), ARCHIVO)}: ${almacen.productos.length} productos, ${almacen.banners.length} banners`);
    } catch {
        // primera vez (o archivo roto): se parte de los productos escritos en el codigo
        almacen.productos.push(...semilla);
    }
    return almacen.productos;
}

// se llama una vez antes de abrir el servidor: si Supabase ya tiene la tienda, manda sobre el json local;
// si la tabla esta vacia, se sube lo que hay en local como punto de partida
export async function cargarDeSupabase() {
    if (!supabaseActivo()) return;
    try {
        const remoto = await leerTienda<Partial<Datos>>();
        if (remoto) {
            aplicar(remoto);
            existiaArchivo = true;
            escribirLocal();
            console.log(`Datos cargados de Supabase: ${almacen.productos.length} productos, ${almacen.banners.length} banners`);
        } else {
            await guardarTienda(almacen);
            console.log('Supabase estaba vacio: se subio la tienda local.');
        }
    } catch (error) {
        console.error('No se pudo leer la tienda de Supabase, se usa la local:', (error as Error).message);
    }
}

// true solo la primera vez: es cuando hay que guardar los productos escritos en el codigo
export const esPrimeraCarga = () => !existiaArchivo;

// escritura atomica: primero a un temporal y luego se renombra, asi un corte no deja el json a medias
function escribirLocal() {
    fs.mkdirSync(CARPETA, { recursive: true });
    const temporal = `${ARCHIVO}.tmp`;
    fs.writeFileSync(temporal, JSON.stringify(almacen, null, 2));
    fs.renameSync(temporal, ARCHIVO);
}

// la tienda (Next.js en Vercel) guarda productos, banners e imagenes en su cache; despues de cada cambio se le
// avisa para que lo muestre al instante. Sin REVALIDAR_SECRETO no se avisa y el cambio aparece en 60 s.
// no se espera la respuesta: si la tienda no contesta, el guardado igual termina bien
function avisarTienda() {
    const secreto = process.env.REVALIDAR_SECRETO;
    if (!secreto) return;
    const tienda = (process.env.URL_TIENDA || 'http://localhost:3000').split(',')[0].trim().replace(/\/+$/, '');
    fetch(`${tienda}/api/revalidar`, { method: 'POST', headers: { 'x-revalidar-secreto': secreto } })
        .catch((error) => console.error('No se pudo avisar a la tienda:', (error as Error).message));
}

// las subidas a Supabase van en fila: si dos cambios llegan seguidos, el ultimo nunca queda pisado por el anterior
let cola = Promise.resolve();

export function guardarAlmacen() {
    escribirLocal();
    existiaArchivo = true;
    avisarTienda();
    if (!supabaseActivo()) return;
    const copia = structuredClone(almacen);
    cola = cola
        .then(() => guardarTienda(copia))
        .catch((error) => console.error('No se pudo guardar la tienda en Supabase:', (error as Error).message));
}

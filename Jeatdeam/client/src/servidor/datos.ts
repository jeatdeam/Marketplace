import type { Apariencia, BaseDatosResponse, Banner, Product, Secciones, SeccionesResponse } from '../../../shared/types';

// solo para el servidor de Next (layouts, paginas y app/api): el navegador sigue usando /api (api.ts)

// direccion del backend (Express, Jeatdeam/app.ts). En Vercel se puede cambiar con API_URL;
// en local es el Express de `npm run dev:server`
export const API_URL = (
    process.env.API_URL || (process.env.NODE_ENV === 'production' ? 'https://marketplace-1-daxe.onrender.com' : 'http://localhost:8080')
).replace(/\/+$/, '');

// productos, secciones, banners e imagenes del inicio se piden desde el servidor de Vercel y quedan en su
// cache (ISR): los visitantes no esperan a que Render despierte. Se vuelven a pedir cada 60 s, o al
// instante cuando el backend avisa a /api/revalidar despues de guardar algo en el dashboard
export const ETIQUETA_TIENDA = 'tienda';
const CACHE = { next: { revalidate: 60, tags: [ETIQUETA_TIENDA] } };

export interface DatosTienda {
    baseDatos: Product[];
    secciones: Secciones | null;
    banners: Banner[];
    apariencia: Apariencia;
}

const VACIO : DatosTienda = { baseDatos: [], secciones: null, banners: [], apariencia: { categorias: {}, slider: {} } };

// si Render falla se lanza el error: una respuesta de error no debe quedar guardada en la cache
const pedir = async <T,>(ruta : string) : Promise<T> => {
    const response = await fetch(`${API_URL}/api${ruta}`, CACHE);
    if (!response.ok) throw new Error(`${ruta} respondio ${response.status}`);
    return response.json();
};

export async function obtenerDatosTienda() : Promise<DatosTienda> {
    try {
        const [productos, secciones, banners, apariencia] = await Promise.all([
            pedir<BaseDatosResponse>('/base/datos/json'),
            pedir<SeccionesResponse>('/extraer/datos/marcas/products'),
            pedir<{ banners : Banner[] }>('/banners'),
            pedir<{ apariencia : Apariencia }>('/apariencia'),
        ]);
        return {
            baseDatos: productos.baseDatos,
            secciones: secciones.seccionProducts,
            banners: banners.banners,
            apariencia: apariencia.apariencia,
        };
    } catch (error) {
        // durante el build Render puede estar caido: las paginas salen sin datos (el navegador los pide igual)
        // y se vuelven a armar a los 60 s. Fuera del build el error se lanza para no guardar una pagina vacia
        if (process.env.NEXT_PHASE === 'phase-production-build') {
            console.warn('No se pudieron traer los datos de la tienda durante el build:', (error as Error).message);
            return VACIO;
        }
        throw error;
    }
}

export const buscarProducto = async (brand : string, name : string) =>
    (await obtenerDatosTienda()).baseDatos.find((producto) => producto.brand === brand && producto.name === name);

// Tipos compartidos entre el servidor Express (Jeatdeam/app.ts) y el cliente React (Jeatdeam/client)

export interface Product {
    id: number | string; // número local, o texto en los productos guardados de antes
    title: string;
    subtitle: string;
    price: number;
    name: string;
    category: string;
    completed: boolean;
    brand: string;
    img: string[];
    shortInfo: string[];
    longInfo: string[];
    // campos que se editan desde el dashboard; si faltan, el cliente inventa valores de ejemplo
    descuento?: number; // 0 a 90
    stock?: number;
    nuevo?: boolean;
    descripcion?: string;
    caracteristicas?: string[];
}

// posiciones fijas del inicio: el banner principal y 3 secundarios de ofertas, y 5 de nuevos ingresos
export const POSICIONES_BANNER = [
    'ofertas-principal',
    'ofertas-1',
    'ofertas-2',
    'ofertas-3',
    'nuevos-1',
    'nuevos-2',
    'nuevos-3',
    'nuevos-4',
    'nuevos-5',
] as const;

export type PosicionBanner = typeof POSICIONES_BANNER[number];

export type TemaBanner = 'hielo' | 'blanco' | 'cielo';

// banner subido desde el dashboard; si una posicion no tiene banner, el inicio la arma sola
export interface Banner {
    posicion: PosicionBanner;
    titulo: string;
    subtitulo?: string;
    etiqueta?: string; // ej. "-30%" o "Nuevo"
    imagen?: string;
    enlace: string; // ruta interna, ej. /promociones
    tema: TemaBanner;
    actualizado: string;
}

// slider del inicio: 4 grupos de dos fotos (imagen 1 a la izquierda, imagen 2 a la derecha)
export const GRUPOS_SLIDER = 4;

// textos de las esquinas (en arco): arriba a la izquierda va el de la imagen 1, abajo a la derecha el de la imagen 2
export const MAX_TEXTO_SLIDER = 18;

export interface GrupoSlider {
    imagenUno: string;
    imagenDos: string;
    textoUno?: string;
    textoDos?: string;
}

// imagenes del inicio cambiadas desde el dashboard; lo que no esta aqui usa la imagen original
export interface Apariencia {
    categorias: Record<string, string>; // slug -> imagen
    slider: Record<string, GrupoSlider>; // "0".."3" -> grupo
}

export interface ProductoEntrada {
    name: string;
    subtitle: string;
    brand: string;
    category: string;
    price: number; // soles; el servidor lo guarda en centimos
    img: string[];
    descuento?: number;
    stock?: number;
    nuevo?: boolean;
    descripcion?: string;
    caracteristicas?: string[];
}

export interface CartItem {
    id: string;
    idCompra: number;
    brand: string;
    img: string;
    price: number;
    name: string;
}

// sección -> categoría -> (por ahora vacío)
export type Secciones = Record<string, Record<string, Record<string, never>>>;

export interface DatosClienteShort {
    correo: string;
    nombre: string;
    tel: string;
    telSec?: string;
}

export interface DatosClienteComplete {
    correo: string;
    nombre: string;
    numOne: string;
    numTwo?: string;
    direccion: string;
    departamento: string;
    distrito: string;
    infoExtra?: string;
    infoCourier?: string;
    eleccionEmpresa?: string;
}

export type DatosCliente = DatosClienteShort | DatosClienteComplete;

// Respuestas de la API

export interface EstadoCarritoResponse {
    carrito: CartItem[];
    carritoL: number;
    baseDatos: Product[];
    lastIdCompra: number;
}

export interface SeccionesResponse {
    seccionProducts: Secciones;
}

export interface BaseDatosResponse {
    baseDatos: Product[];
}

export interface AgregarCarritoResponse {
    message: string;
    carrito: number;
    allProduct: CartItem[];
    lastIdCompra: number;
    baseDatos: Product[];
}

export interface EliminarCarritoResponse {
    message: string;
    carritoLength: number;
    carrito: CartItem[];
}

export interface EliminarCarritoBody {
    id?: string | null;
    idCompra?: number | null;
}

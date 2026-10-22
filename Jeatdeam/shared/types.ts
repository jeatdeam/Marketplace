// Tipos compartidos entre el servidor Express (Jeatdeam/app.ts) y el cliente React (Jeatdeam/client)

export interface Product {
    id: number | string; // número local; el servidor lo reemplaza por el id de precio de Stripe
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

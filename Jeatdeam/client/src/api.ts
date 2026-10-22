// Cliente de la API Express (Jeatdeam/app.ts, montada en /api)
import type {
    AgregarCarritoResponse,
    CartItem,
    EliminarCarritoBody,
    EliminarCarritoResponse,
    EstadoCarritoResponse,
    Secciones,
    SeccionesResponse,
} from '../../shared/types';

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`/api${url}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!response.ok) {
        throw new Error(`hubo un error en la peticion -> ${response.statusText}`);
    }
    return response.json();
}

// { carrito, carritoL, baseDatos, lastIdCompra }
export const getEstadoCarrito = () => request<EstadoCarritoResponse>('/carrito/estado/cuack/cuack');

export const getSecciones = (): Promise<Secciones> =>
    request<SeccionesResponse>('/extraer/datos/marcas/products').then((result) => result.seccionProducts);

// { message, carrito, allProduct, lastIdCompra, baseDatos }
export const agregarCarrito = (product: CartItem) =>
    request<AgregarCarritoResponse>('/compra/compra/compra/compra', {
        method: 'POST',
        body: JSON.stringify(product),
    });

// body: { id } borra todas las unidades de un producto, { idCompra } borra una sola, {} vacía el carrito
export const eliminarCarrito = (body: EliminarCarritoBody = {}) =>
    request<EliminarCarritoResponse>('/compra/compra/compra/compra', {
        method: 'DELETE',
        body: JSON.stringify(body),
    });

export const eliminarDatosCliente = () =>
    fetch('/api/datos/cliente/compra', { method: 'DELETE', keepalive: true });

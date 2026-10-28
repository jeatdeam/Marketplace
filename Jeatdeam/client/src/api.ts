// Cliente de la API Express (Jeatdeam/app.ts, montada en /api)
import type {
    AgregarCarritoResponse,
    Apariencia,
    GrupoSlider,
    Banner,
    PosicionBanner,
    Product,
    ProductoEntrada,
    CartItem,
    EliminarCarritoBody,
    EliminarCarritoResponse,
    DatosClienteComplete,
    DatosClienteShort,
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
        const cuerpo = await response.json().catch(() => null);
        throw new Error(cuerpo?.error ?? `hubo un error en la peticion -> ${response.statusText}`);
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

// datos del formulario de envio (recojo en tienda = short, delivery = complete)
export const enviarDatosShort = (datos: DatosClienteShort) =>
    request<{ estado: string }>('/datos/cliente/compra/short', { method: 'POST', body: JSON.stringify(datos) });

export const enviarDatosComplete = (datos: DatosClienteComplete) =>
    request<{ estado: string }>('/datos/cliente/compra/complete', { method: 'POST', body: JSON.stringify(datos) });

// sesion de checkout de stripe: devuelve la url a la que hay que redirigir
export const crearSesionPago = () =>
    request<{ url: string }>('/create-checkout-session', { method: 'POST' });

// guarda el pedido (carrito + datos de envio) y devuelve la url publica de su pdf
export interface PedidoCreado {
    codigo: string;
    url: string;
    // detalle de compra listo para whatsapp (productos, totales, entrega y enlace al pdf)
    mensaje: string;
}
// el ultimo pedido queda en sessionStorage para ofrecer su pdf en /pago-exitoso (al volver de stripe)
export const CLAVE_ULTIMO_PEDIDO = 'kmoon-ultimo-pedido';
export const crearPedido = (metodo: 'tarjeta' | 'yape' | 'plin', entrega: 'delivery' | 'tienda') =>
    request<PedidoCreado>('/pedidos', { method: 'POST', body: JSON.stringify({ metodo, entrega }) });

// formularios de atencion al cliente (prototipo: el servidor los guarda en memoria)
export const enviarReclamo = (datos: Record<string, string>) =>
    request<{ codigo: string; fecha: string }>('/reclamaciones', { method: 'POST', body: JSON.stringify(datos) });

export const enviarContacto = (datos: Record<string, string>) =>
    request<{ mensaje: string }>('/contacto', { method: 'POST', body: JSON.stringify(datos) });

// banners del inicio (publico) y dashboard (requiere sesion)
export const getBanners = () => request<{ banners: Banner[] }>('/banners').then((r) => r.banners);
export const getApariencia = () => request<{ apariencia: Apariencia }>('/apariencia').then((r) => r.apariencia);

export const admin = {
    sesion: () => request<{ admin: boolean }>('/admin/sesion'),
    login: (clave: string) => request<{ ok: boolean }>('/admin/login', { method: 'POST', body: JSON.stringify({ clave }) }),
    logout: () => request<{ ok: boolean }>('/admin/logout', { method: 'POST' }),
    productos: () => request<{ productos: Product[] }>('/admin/productos').then((r) => r.productos),
    crearProducto: (datos: ProductoEntrada) =>
        request<{ producto: Product }>('/admin/productos', { method: 'POST', body: JSON.stringify(datos) }),
    editarProducto: (id: string, datos: ProductoEntrada) =>
        request<{ producto: Product }>(`/admin/productos/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(datos) }),
    borrarProducto: (id: string) =>
        request<{ borrado: string }>(`/admin/productos/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    guardarBanner: (posicion: PosicionBanner, datos: Omit<Banner, 'posicion' | 'actualizado'>) =>
        request<{ banner: Banner }>(`/admin/banners/${posicion}`, { method: 'PUT', body: JSON.stringify(datos) }),
    borrarBanner: (posicion: PosicionBanner) => request<{ ok: boolean }>(`/admin/banners/${posicion}`, { method: 'DELETE' }),
    guardarCategoria: (slug: string, imagen: string) =>
        request<{ apariencia: Apariencia }>(`/admin/categorias/${encodeURIComponent(slug)}`, { method: 'PUT', body: JSON.stringify({ imagen }) }),
    borrarCategoria: (slug: string) =>
        request<{ apariencia: Apariencia }>(`/admin/categorias/${encodeURIComponent(slug)}`, { method: 'DELETE' }),
    guardarGrupoSlider: (indice: number, grupo: GrupoSlider) =>
        request<{ apariencia: Apariencia }>(`/admin/slider/${indice}`, { method: 'PUT', body: JSON.stringify(grupo) }),
    borrarGrupoSlider: (indice: number) => request<{ apariencia: Apariencia }>(`/admin/slider/${indice}`, { method: 'DELETE' }),
    subirImagen: (datos: string) =>
        request<{ url: string }>('/admin/imagenes', { method: 'POST', body: JSON.stringify({ datos }) }).then((r) => r.url),
};

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import * as api from '../api';
import { categoriasConImagen, gruposSlider, precioFinalCentimos, type Categoria } from '../datos/tienda';
import type { Apariencia, Banner, CartItem, EstadoCarritoResponse, GrupoSlider, Product, Secciones } from '../../../shared/types';

interface StoreValue {
    baseDatos: Product[] | null;
    secciones: Secciones | null;
    carrito: CartItem[] | null;
    banners: Banner[];
    // imagenes del inicio cambiadas en el dashboard, ya mezcladas con las originales
    apariencia: Apariencia;
    categorias: Categoria[];
    gruposSlider: GrupoSlider[];
    // el dashboard la llama despues de guardar para que la tienda muestre los cambios al instante
    recargarDatos: () => Promise<void>;
    refreshCarrito: () => Promise<EstadoCarritoResponse | null>;
    addToCart: (product: Product | CartItem) => Promise<void>;
    removeGroup: (id: string) => Promise<void>;
    removeOne: (idCompra: number | string) => Promise<void>;
    clearCarrito: () => Promise<void>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
    // null = todavía cargando
    const [baseDatos, setBaseDatos] = useState<Product[] | null>(null);
    const [secciones, setSecciones] = useState<Secciones | null>(null);
    const [carrito, setCarrito] = useState<CartItem[] | null>(null);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [apariencia, setApariencia] = useState<Apariencia>({ categorias: {}, slider: {} });

    const refreshCarrito = useCallback(async () => {
        try {
            const result = await api.getEstadoCarrito();
            setCarrito(result.carrito);
            setBaseDatos(result.baseDatos);
            return result;
        } catch (error) {
            console.error('Error al extraer info del carrito: ', error);
            return null;
        }
    }, []);

    const recargarDatos = useCallback(async () => {
        await refreshCarrito();
        try {
            const [nuevosBanners, nuevaApariencia] = await Promise.all([api.getBanners(), api.getApariencia()]);
            setBanners(nuevosBanners);
            setApariencia(nuevaApariencia);
        } catch (error) {
            console.error('No se pudieron cargar los banners ni las imagenes del inicio', error);
        }
    }, [refreshCarrito]);

    useEffect(() => {
        recargarDatos();
        api.getSecciones()
            .then(setSecciones)
            .catch((error) => console.error(`ocurrio un error en la peticion->${error.message}`));
    }, [recargarDatos]);

    const addToCart = useCallback(async (product: Product | CartItem) => {
        try {
            const estado = await api.getEstadoCarrito();
            const lastId = estado.lastIdCompra;
            const idCompra = lastId ? Number(lastId) + 1 : 1;

            const result = await api.agregarCarrito({
                id: String(product.id),
                idCompra,
                brand: product.brand,
                img: Array.isArray(product.img) ? product.img[0] : product.img,
                // un producto entra con su precio final; un item del carrito ya lo trae
                price: 'subtitle' in product ? precioFinalCentimos(product) : Number(product.price),
                name: product.name,
            });
            setCarrito(result.allProduct);
        } catch (error) {
            console.error('Error en postProduct:', error);
        }
    }, []);

    const removeGroup = useCallback(async (id: string) => {
        try {
            const result = await api.eliminarCarrito({ id, idCompra: null });
            setCarrito(result.carrito);
        } catch (error) {
            console.log('ha ocurrido un error con la peticion, intente nuevamente', error);
        }
    }, []);

    const removeOne = useCallback(async (idCompra: number | string) => {
        try {
            const result = await api.eliminarCarrito({ idCompra: Number(idCompra) });
            setCarrito(result.carrito);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const clearCarrito = useCallback(async () => {
        try {
            const result = await api.eliminarCarrito();
            setCarrito(result.carrito);
            api.eliminarDatosCliente();
        } catch (error) {
            console.error('error al eliminar la lista de carrito', error);
        }
    }, []);

    const categorias = useMemo(() => categoriasConImagen(apariencia), [apariencia]);
    const grupos = useMemo(() => gruposSlider(apariencia), [apariencia]);

    const value = useMemo<StoreValue>(() => ({
        baseDatos,
        secciones,
        carrito,
        banners,
        apariencia,
        categorias,
        gruposSlider: grupos,
        recargarDatos,
        refreshCarrito,
        addToCart,
        removeGroup,
        removeOne,
        clearCarrito,
    }), [baseDatos, secciones, carrito, banners, apariencia, categorias, grupos, recargarDatos, refreshCarrito, addToCart, removeGroup, removeOne, clearCarrito]);

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useStore debe usarse dentro de <StoreProvider>');
    return store;
}

// "agregar al carrito" y "comprar" (agrega y va al carrito)
export function useCartActions() {
    const { addToCart } = useStore();
    const navigate = useNavigate();

    const buy = useCallback(async (product: Product | CartItem) => {
        await addToCart(product);
        navigate('/carrito');
    }, [addToCart, navigate]);

    return { add: addToCart, buy };
}

// Agrupa los items del carrito por id de producto, conservando el orden de llegada
export function groupCarrito(carrito: CartItem[] | null): CartItem[][] {
    const groups = new Map<string, CartItem[]>();
    (carrito || []).forEach((item) => {
        const group = groups.get(item.id);
        if (group) group.push(item);
        else groups.set(item.id, [item]);
    });
    return Array.from(groups.values());
}

export function totalCarrito(carrito: CartItem[] | null): number {
    return (carrito || []).reduce((sum, item) => sum + Number(item.price), 0);
}

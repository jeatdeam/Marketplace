import type { Metadata } from 'next';

import ProductDetail from '../../../../../Jeatdeam/client/src/pages/ProductDetail';
import { buscarProducto } from '../../../../../Jeatdeam/client/src/servidor/datos';

interface Props {
    params: Promise<{ brand: string; categoria: string; product: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { brand, product } = await params;
    const producto = await buscarProducto(decodeURIComponent(brand), decodeURIComponent(product));
    return producto ? { title: producto.name, description: producto.subtitle } : {};
}

// se arma en cada visita con los productos de la cache de Vercel (rapido aunque Render este dormido).
// no se guarda como pagina estatica: la primera vez exigiria datos frescos de Render
export default function Pagina() {
    return <ProductDetail />;
}

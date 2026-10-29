import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Marca from '../../../Jeatdeam/client/src/pages/Marca';
import { categoriaPorSlug } from '../../../Jeatdeam/client/src/datos/tienda';

interface Props {
    params: Promise<{ brand: string }>;
    searchParams: Promise<Record<string, string | string[]>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const categoria = categoriaPorSlug(decodeURIComponent((await params).brand));
    return categoria ? { title: categoria.nombre, description: categoria.descripcion } : {};
}

// /dinosaurios, /peluches...: el catalogo con la categoria ya marcada; filtros en la url, igual que /productos.
// una categoria que no existe responde 404 (app/not-found.tsx)
export default async function Pagina({ params, searchParams }: Props) {
    if (!categoriaPorSlug(decodeURIComponent((await params).brand))) notFound();
    await searchParams;
    return <Marca />;
}

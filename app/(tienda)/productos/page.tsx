import type { Metadata } from 'next';

import Catalogo from '../../../Jeatdeam/client/src/pages/Catalogo';

export const metadata: Metadata = { title: 'Todos los productos' };

// los filtros van en la url (?q=...): leer searchParams arma la pagina en cada visita con esos filtros.
// sigue siendo rapido: los productos salen de la cache de Vercel, no de Render
export default async function Pagina({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) {
    await searchParams;
    return <Catalogo />;
}

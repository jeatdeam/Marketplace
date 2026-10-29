import type { Metadata } from 'next';

import Catalogo from '../../../Jeatdeam/client/src/pages/Catalogo';

export const metadata: Metadata = { title: 'Ofertas' };

// filtros en la url, igual que /productos
export default async function Pagina({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) {
    await searchParams;
    return <Catalogo titulo="Ofertas" descripcion="Descuentos de la semana en juguetes seleccionados." soloOfertas />;
}

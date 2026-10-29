import type { Metadata } from 'next';

import LibroReclamaciones from '../../../Jeatdeam/client/src/pages/LibroReclamaciones';

export const metadata: Metadata = { title: 'Libro de reclamaciones' };

export default function Pagina() {
    return <LibroReclamaciones />;
}

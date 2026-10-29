import type { Metadata } from 'next';

import PaginaLegal from '../../../Jeatdeam/client/src/pages/PaginaLegal';

export const metadata: Metadata = { title: 'Términos y condiciones' };

export default function Pagina() {
    return <PaginaLegal tipo="terminos" />;
}

import type { Metadata } from 'next';

import PaginaLegal from '../../../Jeatdeam/client/src/pages/PaginaLegal';

export const metadata: Metadata = { title: 'Política de privacidad' };

export default function Pagina() {
    return <PaginaLegal tipo="privacidad" />;
}

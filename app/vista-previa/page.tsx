import type { Metadata } from 'next';

import VistaPrevia from '../../Jeatdeam/client/src/pages/VistaPrevia';

// la abre el dashboard dentro de iframes para ver los cambios en cada tamaño de pantalla
export const metadata: Metadata = { title: 'Vista previa', robots: { index: false } };

export default function Pagina() {
    return <VistaPrevia />;
}

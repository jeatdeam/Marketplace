import type { Metadata } from 'next';

import Dashboard from '../../Jeatdeam/client/src/pages/Dashboard';

// fuera del grupo (tienda): el dashboard no lleva la barra, el header ni el footer de la tienda
export const metadata: Metadata = { title: 'Dashboard', robots: { index: false } };

export default function Pagina() {
    return <Dashboard />;
}

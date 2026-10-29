import type { Metadata } from 'next';

import Compra from '../../../Jeatdeam/client/src/pages/Compra';

export const metadata: Metadata = { title: 'Carrito de compras' };

export default function Pagina() {
    return <Compra />;
}

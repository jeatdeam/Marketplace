import type { ReactNode } from 'react';

import Layout from '../../Jeatdeam/client/src/components/Layout';

// barra, header y footer de la tienda; el dashboard y la vista previa quedan fuera de este grupo
export default function LayoutTienda({ children }: { children: ReactNode }) {
    return <Layout>{children}</Layout>;
}

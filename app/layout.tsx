import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { StoreProvider } from '../Jeatdeam/client/src/context/StoreContext';
import { obtenerDatosTienda } from '../Jeatdeam/client/src/servidor/datos';
import '../Jeatdeam/client/src/estilos.css';

// las paginas se arman en el servidor de Vercel con los datos de su cache y se rehacen cada 60 s
export const revalidate = 60;

export const metadata: Metadata = {
    title: {
        default: 'Kmoon | Juguetes, peluches y colección',
        template: '%s | Kmoon',
    },
    description: 'Kmoon: juguetes mordelones de dinosaurios, peluches, figuras de anime y regalos con envío a todo el Perú. Paga con Yape o Plin.',
    icons: { icon: '/img/k-moon.png' },
};

export const viewport: Viewport = {
    themeColor: '#172554',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
    const inicial = await obtenerDatosTienda();
    return (
        <html lang="es" className="h-full antialiased">
            <head>
                {/* poppins para todo el sitio y doto (pixelada) solo para los creditos del desarrollador */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Doto:wght@400;700&family=Poppins:wght@300;400;500;600;700;800&display=swap" />
            </head>
            <body className="min-h-full flex flex-col">
                <StoreProvider inicial={inicial}>{children}</StoreProvider>
            </body>
        </html>
    );
}

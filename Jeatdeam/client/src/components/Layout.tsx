import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Outlet, useLocation } from 'react-router-dom';

import BarraSuperior from './BarraSuperior';
import Header from './Header';
import Footer from './Footer';
import BotonWhatsapp from './BotonWhatsapp';
import BarraLateral from './BarraLateral';
import { eliminarDatosCliente } from '../api';

// creditos del desarrollador (github:jeatdeam/creditos-dev): la firma Lottie pesa ~500 KB, va en un chunk aparte
const Creditos = lazy(() => import('creditos-dev').then((modulo) => ({ default: modulo.Creditos })));

export default function Layout() {
    const { pathname } = useLocation();
    const [menuAbierto, setMenuAbierto] = useState(false);

    const cerrarMenu = useCallback(() => setMenuAbierto(false), []);

    // Al navegar: volver arriba y cerrar el menú
    useEffect(() => {
        window.scrollTo(0, 0);
        setMenuAbierto(false);
    }, [pathname]);

    // Los datos del formulario de envío no sobreviven a cerrar/recargar la página
    useEffect(() => {
        const alSalir = () => { eliminarDatosCliente(); };
        window.addEventListener('beforeunload', alSalir);
        return () => window.removeEventListener('beforeunload', alSalir);
    }, []);

    return (
        <div className="relative flex min-h-screen flex-col">
            <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-[8px] focus:left-[8px] focus:z-[100] focus:rounded-[10px] focus:bg-white focus:px-[14px] focus:py-[8px] focus:font-semibold">
                Saltar al contenido
            </a>
            <BarraSuperior />
            <Header menuAbierto={menuAbierto} onAlternarMenu={() => setMenuAbierto((valor) => !valor)} onCerrarMenu={cerrarMenu} />
            <BarraLateral visibleEnCelular={menuAbierto} onCerrar={cerrarMenu} />
            <div id="contenido" className="flex flex-1 flex-col">
                <Outlet />
            </div>
            <Footer />
            <Suspense fallback={null}>
                <Creditos />
            </Suspense>
            <BotonWhatsapp />
            {/* hasta 768px: fondo blanco de vidrio detras de la barra; tocarlo la cierra */}
            {menuAbierto && createPortal(
                <div className="aparecerVidrio fixed inset-0 z-[70] bg-white/40 backdrop-blur-sm min-[769px]:hidden" onClick={cerrarMenu} aria-hidden="true" />,
                document.body,
            )}
        </div>
    );
}

import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Intro from './Intro';
import Header from './Header';
import Footer from './Footer';
import SearchOverlay from './SearchOverlay';
import MenuSmall from './MenuSmall';
import { eliminarDatosCliente } from '../api';
import { useMediaQuery } from '../hooks/useMediaQuery';

// Los Lotties pesan ~370 KB: se cargan en un chunk aparte
const DevCredits = lazy(() => import('./DevCredits'));

function useGlobalBehaviors() {
    useEffect(() => {
        // Evita la selección de texto y el arrastre de imágenes, sin bloquear los campos de formulario
        const onMouseDown = (e: MouseEvent) => {
            if (!(e.target as Element).closest('input, textarea, select')) e.preventDefault();
        };

        // Pequeño "tick" visual al presionar cualquier botón
        const onClick = (e: MouseEvent) => {
            const button = (e.target as Element).closest('button');
            if (!button) return;
            button.classList.add('tickButton');
            setTimeout(() => button.classList.remove('tickButton'), 150);
        };

        // Los datos del formulario de envío no sobreviven a cerrar/recargar la página
        const onBeforeUnload = () => {
            eliminarDatosCliente();
        };

        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('click', onClick);
        window.addEventListener('beforeunload', onBeforeUnload);
        return () => {
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('click', onClick);
            window.removeEventListener('beforeunload', onBeforeUnload);
        };
    }, []);
}

export default function Layout() {
    const { pathname } = useLocation();
    const [searchOpen, setSearchOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 769px)');

    useGlobalBehaviors();

    const closeSearch = useCallback(() => setSearchOpen(false), []);
    const closeMenu = useCallback(() => setMenuOpen(false), []);

    // Al navegar: volver arriba y cerrar overlays
    useEffect(() => {
        window.scrollTo(0, 0);
        setSearchOpen(false);
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isDesktop) setMenuOpen(false);
    }, [isDesktop]);

    useEffect(() => {
        document.body.classList.toggle('activeBody', searchOpen);
    }, [searchOpen]);

    useEffect(() => {
        document.body.style.filter = menuOpen ? 'blur(5px)' : '';
    }, [menuOpen]);

    return (
        <>
            <Intro />
            <Header
                menuOpen={menuOpen}
                onOpenSearch={() => setSearchOpen(true)}
                onToggleMenu={() => setMenuOpen((open) => !open)}
            />
            <Outlet />
            <Footer />
            <Suspense fallback={null}>
                <DevCredits />
            </Suspense>
            <SearchOverlay open={searchOpen} onClose={closeSearch} />
            <MenuSmall open={menuOpen} onClose={closeMenu} />
        </>
    );
}

import { useEffect, useRef } from 'react';

import Icono from './Icono';
import { TIENDA } from '../datos/tienda';

// boton flotante con ondas detras; 48px en celular y 60px desde sm.
// al llegar al final de la pagina no baja mas alla de la fila de redes del footer (#limite-whatsapp):
// se queda a su altura, sobre la linea de la derecha, y no tapa el copyright ni los creditos
export default function BotonWhatsapp() {
    const boton = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const desdeSm = window.matchMedia('(min-width: 640px)');
        let cuadro = 0;

        const ubicar = () => {
            cuadro = 0;
            const elemento = boton.current;
            const limite = document.getElementById('limite-whatsapp');
            if (!elemento) return;
            if (!limite) {
                elemento.style.bottom = '';
                return;
            }
            const margen = desdeSm.matches ? 24 : 16; // bottom-[16px] sm:bottom-[24px]
            const fila = limite.getBoundingClientRect();
            // distancia al borde de abajo para que el centro del boton quede en el centro de la fila
            const hastaLaFila = window.innerHeight - (fila.top + fila.height / 2) - elemento.offsetHeight / 2;
            elemento.style.bottom = hastaLaFila > margen ? `${hastaLaFila}px` : '';
        };

        // un calculo por cuadro, aunque el scroll dispare muchos eventos
        const pedir = () => {
            if (!cuadro) cuadro = requestAnimationFrame(ubicar);
        };

        ubicar();
        window.addEventListener('scroll', pedir, { passive: true });
        window.addEventListener('resize', pedir);
        // el contenido y los creditos cargan despues y cambian el alto de la pagina
        const observador = new ResizeObserver(pedir);
        observador.observe(document.body);

        return () => {
            cancelAnimationFrame(cuadro);
            window.removeEventListener('scroll', pedir);
            window.removeEventListener('resize', pedir);
            observador.disconnect();
        };
    }, []);

    return (
        <a
            ref={boton}
            href={`https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent('Hola JD Store, quiero hacer una consulta')}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Escríbenos por WhatsApp"
            className="ondaWhatsapp fixed z-40 right-[16px] bottom-[16px] sm:right-[24px] sm:bottom-[24px] isolate grid place-items-center size-[48px] sm:size-[60px] rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,.45)] transition-transform hover:-translate-y-[3px] active:scale-90"
        >
            <Icono nombre="whatsapp" className="size-[24px] sm:size-[30px]" />
        </a>
    );
}

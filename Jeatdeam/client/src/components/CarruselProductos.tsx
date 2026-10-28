import { useEffect, useRef, useState } from 'react';

import Icono from './Icono';
import TarjetaProducto from './TarjetaProducto';
import type { Product } from '../../../shared/types';

// flecha estilo ios: circulo de vidrio que aparece en hover desplazandose 8px (siempre visible en tactil)
const CLASE_FLECHA = 'absolute top-1/2 -translate-y-1/2 z-10 grid place-items-center size-[44px] rounded-full bg-white/70 backdrop-blur-md ring-1 ring-black/5 shadow-[0_4px_16px_rgba(15,23,42,.18)] text-slate-900 transition-all duration-300 hover:bg-white active:scale-90 disabled:!opacity-0 disabled:pointer-events-none opacity-0 group-hover/carrusel:opacity-100 [@media(hover:none)]:opacity-100';

export default function CarruselProductos({ productos, etiqueta } : { productos : Product[]; etiqueta : string }) {
    const pista = useRef<HTMLUListElement>(null);
    const [bordes, setBordes] = useState({ inicio: true, fin: false });

    useEffect(() => {
        const elemento = pista.current;
        if (!elemento) return;
        const medir = () => setBordes({
            inicio: elemento.scrollLeft <= 4,
            fin: elemento.scrollLeft + elemento.clientWidth >= elemento.scrollWidth - 4,
        });
        medir();
        elemento.addEventListener('scroll', medir, { passive: true });
        window.addEventListener('resize', medir);
        return () => {
            elemento.removeEventListener('scroll', medir);
            window.removeEventListener('resize', medir);
        };
    }, [productos.length]);

    // avanza casi una pantalla para que la ultima tarjeta visible quede como primera
    const mover = (sentido : number) => {
        const elemento = pista.current;
        if (!elemento) return;
        elemento.scrollBy({ left: sentido * Math.max(295, elemento.clientWidth - 295), behavior: 'smooth' });
    };

    return (
        <div className="group/carrusel relative" role="region" aria-roledescription="carrusel" aria-label={etiqueta}>
            <button type="button" onClick={() => mover(-1)} disabled={bordes.inicio} aria-label="Anteriores" className={`${CLASE_FLECHA} -left-[6px] sm:-left-[22px] group-hover/carrusel:-translate-x-[0px] translate-x-[8px]`}>
                <Icono nombre="izquierda" className="size-[20px]" grosor={2.5} />
            </button>
            <ul
                ref={pista}
                className="flex gap-[20px] overflow-x-auto snap-x snap-mandatory scroll-smooth px-[2px] py-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {productos.map((producto) => (
                    <li key={`${producto.brand}-${producto.name}`} className="snap-start">
                        <TarjetaProducto producto={producto} />
                    </li>
                ))}
            </ul>
            <button type="button" onClick={() => mover(1)} disabled={bordes.fin} aria-label="Siguientes" className={`${CLASE_FLECHA} -right-[6px] sm:-right-[22px] group-hover/carrusel:translate-x-[0px] -translate-x-[8px]`}>
                <Icono nombre="derecha" className="size-[20px]" grosor={2.5} />
            </button>
        </div>
    );
}

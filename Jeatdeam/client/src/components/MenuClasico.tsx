import { useEffect, useRef } from 'react';
import { Link, NavLink } from '../router';

import Icono from './Icono';
import { PANEL_VIDRIO } from './ui';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { AYUDA, type ENLACES } from './BarraLateral';
import { useStore } from '../context/StoreContext';

const TITULO = 'px-[12px] pt-[6px] pb-[4px] text-[11px] font-semibold uppercase tracking-[.14em] text-slate-500';
const ENLACE = 'flex items-center gap-[12px] rounded-[10px] px-[12px] py-[9px] text-[15px] font-medium hover:bg-white/60';

interface MenuClasicoProps {
    // los accesos (Inicio, Productos, Ofertas) que no entraron en el header
    enlacesOcultos : typeof ENLACES;
    abierto : boolean;
    onAlternar : () => void;
    onCerrar : () => void;
}

// menu desde 769px: boton en el header que despliega un panel de vidrio con todo el menu.
// hasta 768px se usa la barra lateral (BarraLateral.tsx)
export default function MenuClasico({ enlacesOcultos, abierto, onAlternar, onCerrar } : MenuClasicoProps) {
    const contenedor = useRef<HTMLDivElement>(null);
    const { categorias } = useStore();
    // el estado "abierto" es el mismo que muestra la barra lateral en celular: solo escuchar en escritorio
    const escritorio = useMediaQuery('(min-width: 769px)');

    // escape o clic fuera lo cierran
    useEffect(() => {
        if (!abierto || !escritorio) return;
        const alTeclear = (e : KeyboardEvent) => { if (e.key === 'Escape') onCerrar(); };
        const alTocar = (e : PointerEvent) => {
            if (!contenedor.current?.contains(e.target as Node)) onCerrar();
        };
        document.addEventListener('keydown', alTeclear);
        document.addEventListener('pointerdown', alTocar);
        return () => {
            document.removeEventListener('keydown', alTeclear);
            document.removeEventListener('pointerdown', alTocar);
        };
    }, [abierto, escritorio, onCerrar]);

    const tab = abierto && escritorio ? 0 : -1;

    return (
        <div ref={contenedor} className="relative hidden min-[769px]:block">
            <button
                type="button"
                onClick={onAlternar}
                aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={abierto}
                className={`backCircle grid place-items-center size-[40px] ${abierto ? 'bg-white/25' : ''}`}
            >
                <Icono nombre={abierto ? 'cerrar' : 'menu'} className="size-[22px]" />
            </button>

            <div className={`absolute right-0 top-full pt-[14px] transition-all duration-200 ${abierto ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-[6px]'}`}>
                <div className={`w-[680px] max-h-[calc(100dvh-140px)] overflow-y-auto scroll-fino rounded-[16px] p-[10px] text-slate-900 grid grid-cols-[220px_1fr] gap-[10px] ${PANEL_VIDRIO}`}>
                    <div className="flex flex-col gap-[6px] border-r border-white/70 pr-[10px]">
                        {/* solo los accesos que no entraron en el header (si entraron los 3, no se repiten aqui) */}
                        {enlacesOcultos.length > 0 && (
                            <>
                                <p className={TITULO}>Tienda</p>
                                <ul>
                                    {enlacesOcultos.map((enlace) => (
                                        <li key={enlace.a}>
                                            <NavLink to={enlace.a} end={enlace.exacto} tabIndex={tab} className={({ isActive }) => `${ENLACE} ${isActive ? 'bg-white/70 text-sky-700' : ''}`}>
                                                <Icono nombre={enlace.icono} className="size-[19px] text-sky-700" />
                                                {enlace.texto}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        <p className={TITULO}>Ayuda</p>
                        <ul>
                            {AYUDA.map((enlace) => (
                                <li key={enlace.a}>
                                    <Link to={enlace.a} tabIndex={tab} className={ENLACE}>
                                        <Icono nombre={enlace.icono} className="size-[19px] text-sky-700" />
                                        {enlace.texto}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className={TITULO}>Categorías</p>
                        <ul className="grid grid-cols-2 gap-[2px]">
                            {categorias.map((categoria) => (
                                <li key={categoria.slug}>
                                    <Link to={`/${categoria.slug}`} tabIndex={tab} className="flex items-center gap-[10px] rounded-[10px] p-[8px] hover:bg-white/60">
                                        <img src={categoria.imagen} alt="" className="size-[38px] rounded-[8px] object-cover" loading="lazy" />
                                        <span className="min-w-0">
                                            <span className="block text-[14px] font-semibold">{categoria.nombre}</span>
                                            <span className="block text-[12px] text-slate-600 truncate">{categoria.descripcion}</span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

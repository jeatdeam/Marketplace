import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import Icono from './Icono';
import CarritoHeader from './CarritoHeader';
import FirmaKmoon, { anchoFirma } from './FirmaKmoon';
import { useMediaQuery } from '../hooks/useMediaQuery';
import Buscador from './Buscador';
import MenuClasico from './MenuClasico';
import { ENLACES } from './BarraLateral';
import { ANCHO_HEADER } from './ui';
import { ALTO_BARRA } from './BarraSuperior';
import { TIENDA } from '../datos/tienda';

// la misma separacion siempre: arriba del todo el header queda 22px debajo de la barra y al bajar
// se despega y queda a 22px del borde de la ventana
const SEPARACION_HEADER = 22;
export const SEPARACION_INICIAL = ALTO_BARRA + SEPARACION_HEADER;
const SEPARACION_SCROLL = SEPARACION_HEADER;

// claro (header marino): el logo Lottie animado, que trae su propia luna.
// sobre fondo claro (footer, dashboard): la luna del png con el nombre en texto
export function Logo({ claro = true } : { claro?: boolean }) {
    // mas alto que el header (72px celular, 80px desde sm): va en absolute y sobresale arriba y abajo;
    // el enlace reserva su ancho para que los botones no se muevan. Sobresale SALIDA px por arriba (menos
    // que SEPARACION_HEADER, asi no toca la barra ni se corta al bajar) y el resto por abajo, sin pasar del slider
    const grande = useMediaQuery('(min-width: 640px)');
    const alto = grande ? 128 : 104;
    const altoHeader = grande ? 80 : 72;
    const salida = grande ? 18 : 16;
    // el enlace (44px) esta centrado en el header: se sube hasta el borde del header y luego la salida
    const arriba = -(altoHeader - 44) / 2 - salida;
    if (claro) {
        return (
            <Link to="/" className="relative block h-[44px] shrink-0" style={{ width: anchoFirma(alto) }} aria-label={`${TIENDA.nombre}, ir al inicio`}>
                <span className="absolute left-0" style={{ top: arriba }}>
                    <FirmaKmoon alto={alto} />
                </span>
            </Link>
        );
    }
    return (
        <Link to="/" className="flex items-center gap-[10px] shrink-0" aria-label={`${TIENDA.nombre}, ir al inicio`}>
            {/* la luna del logo (public/img/k-moon.png) dentro de un circulo blanco: el png trae el centro blanco */}
            <span className="grid place-items-center size-[42px] rounded-full bg-white shadow-[0_0_0_3px_rgba(255,255,255,.25)] overflow-hidden">
                <img src="/img/k-moon.png" alt="" className="size-[46px] max-w-none object-contain" />
            </span>
            <span className={`text-[20px] font-extrabold tracking-tight leading-none ${claro ? 'text-white' : 'text-slate-900'}`}>
                {TIENDA.nombre}
            </span>
        </Link>
    );
}

// hasta 768px (igual que la lupa del buscador): lupa, carrito y boton del menu, que muestra u oculta
// la barra lateral; desde 769px: input, carrito y el boton del menu clasico desplegable (MenuClasico.tsx)

// accesos directos junto al input: se muestran los que entran en el espacio libre del header;
// los que no entran pasan al menu clasico. Todas las cajas miden lo mismo (cabe "Productos")
// y van separadas 10px, como los iconos del header
const ANCHO_ACCESO = 124;
const SEPARACION = 10;
// aire minimo que queda entre el logo y la primera caja
const AIRE = 16;

function AccesosDirectos({ cantidad } : { cantidad : number }) {
    if (!cantidad) return null;
    return (
        <nav aria-label="Accesos directos" className="hidden min-[769px]:flex items-center gap-[10px]">
            {ENLACES.slice(0, cantidad).map((enlace) => (
                <NavLink
                    key={enlace.a}
                    to={enlace.a}
                    end={enlace.exacto}
                    className={({ isActive }) => `flex items-center justify-center gap-[7px] w-[124px] h-[40px] shrink-0 rounded-[10px] text-[14px] font-semibold ring-1 transition-colors ${isActive ? 'bg-white/20 ring-white/40' : 'bg-white/5 ring-white/15 hover:bg-white/15'}`}
                >
                    <Icono nombre={enlace.icono} className="size-[17px]" />
                    {enlace.texto}
                </NavLink>
            ))}
        </nav>
    );
}

// cuantas cajas entran: espacio interior del header menos el logo, lo de la derecha y el aire
function useAccesosQueEntran() {
    const header = useRef<HTMLElement>(null);
    const logo = useRef<HTMLDivElement>(null);
    const resto = useRef<HTMLDivElement>(null);
    const [cantidad, setCantidad] = useState(0);

    useLayoutEffect(() => {
        const medir = () => {
            if (!header.current || !logo.current || !resto.current) return;
            if (!window.matchMedia('(min-width: 769px)').matches) return setCantidad(0);
            const estilo = getComputedStyle(header.current);
            const interior = header.current.clientWidth - parseFloat(estilo.paddingLeft) - parseFloat(estilo.paddingRight);
            const huecoHeader = parseFloat(estilo.columnGap) || 0;
            const libre = interior - logo.current.offsetWidth - huecoHeader - resto.current.offsetWidth - AIRE;
            // cada caja ocupa su ancho mas la separacion que la sigue
            setCantidad(Math.max(0, Math.min(ENLACES.length, Math.floor(libre / (ANCHO_ACCESO + SEPARACION)))));
        };
        medir();
        const observador = new ResizeObserver(medir);
        [header.current, logo.current, resto.current].forEach((elemento) => elemento && observador.observe(elemento));
        window.addEventListener('resize', medir);
        return () => {
            observador.disconnect();
            window.removeEventListener('resize', medir);
        };
    }, []);

    return { header, logo, resto, cantidad };
}

interface HeaderProps {
    menuAbierto : boolean;
    onAlternarMenu : () => void;
    onCerrarMenu : () => void;
}

export default function Header({ menuAbierto, onAlternarMenu, onCerrarMenu } : HeaderProps) {
    const [top, setTop] = useState(SEPARACION_INICIAL);
    const bajado = top < SEPARACION_INICIAL;
    const { header, logo, resto, cantidad } = useAccesosQueEntran();

    useEffect(() => {
        let frame = 0;
        const actualizar = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                setTop(Math.max(SEPARACION_SCROLL, SEPARACION_INICIAL - window.scrollY));
            });
        };
        actualizar();
        window.addEventListener('scroll', actualizar, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', actualizar);
        };
    }, []);

    return (
        <header
            ref={header}
            style={{ top }}
            className={`menuOscuro fixed z-50 isolate ${ANCHO_HEADER} 2xl:w-[60%] h-[72px] sm:h-[80px] rounded-[15px] px-[14px] sm:px-[20px] flex items-center gap-[12px] text-white shadow-[0_0_0_1px_rgba(255,255,255,.14),0_8px_24px_rgba(15,23,42,.18)]`}
        >
            {/* el vidrio va en una capa de fondo y no en el header: asi los desplegables del buscador
                y del carrito (que estan dentro) pueden desenfocar la pagina con su propio backdrop-filter */}
            <span
                aria-hidden="true"
                className={`absolute inset-0 -z-10 rounded-[15px] backdrop-blur-md bg-gradient-to-r ${bajado ? 'from-[#0f172a]/75 to-[#172554]/75' : 'from-[#0f172a]/90 to-[#172554]/90'}`}
            />
            <div ref={logo} className="shrink-0"><Logo /></div>
            <div className="ml-auto flex items-center gap-[10px]">
                <AccesosDirectos cantidad={cantidad} />
                <div ref={resto} className="flex items-center gap-[6px] sm:gap-[10px]">
                <Buscador />
                <CarritoHeader />
                <MenuClasico abierto={menuAbierto} onAlternar={onAlternarMenu} onCerrar={onCerrarMenu} enlacesOcultos={ENLACES.slice(cantidad)} />
                <button
                    type="button"
                    onClick={onAlternarMenu}
                    aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
                    aria-expanded={menuAbierto}
                    className="backCircle grid place-items-center size-[40px] min-[769px]:hidden"
                >
                    <Icono nombre={menuAbierto ? 'cerrar' : 'menu'} className="size-[22px]" />
                </button>
                </div>
            </div>
        </header>
    );
}

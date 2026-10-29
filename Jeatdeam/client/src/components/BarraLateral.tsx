import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from '../router';

import Icono, { type NombreIcono } from './Icono';
import { PANEL_VIDRIO } from './ui';
import { useStore } from '../context/StoreContext';

export const ENLACES : { texto : string; a : string; icono : NombreIcono; exacto?: boolean }[] = [
    { texto: 'Inicio', a: '/', icono: 'inicio', exacto: true },
    { texto: 'Productos', a: '/productos', icono: 'paquete' },
    { texto: 'Ofertas', a: '/promociones', icono: 'etiqueta' },
];

// se abre con el ultimo boton de la barra (y en escritorio desde el menu clasico del header)
export const AYUDA : { texto : string; a : string; icono : NombreIcono }[] = [
    { texto: 'Quiénes somos', a: '/quienes-somos', icono: 'corazon' },
    { texto: 'Envíos y entregas', a: '/envios', icono: 'camion' },
    { texto: 'Contacto y ayuda', a: '/contacto', icono: 'telefono' },
    { texto: 'Libro de reclamaciones', a: '/libro-de-reclamaciones', icono: 'libro' },
    // temporal mientras dure el prototipo: quitar antes de publicar la tienda
    { texto: 'Dashboard', a: '/dashboard', icono: 'panel' },
];

type Panel = 'categorias' | 'ayuda' | null;

const CLASE_BOTON = 'group/item relative grid place-items-center size-[44px] rounded-full text-slate-500 transition-all duration-200 hover:bg-slate-900/5 hover:text-slate-800 active:scale-90';
const ACTIVO = '!text-slate-900 bg-white ring-1 ring-slate-900/10 shadow-[0_2px_8px_rgba(15,23,42,.12)]';

// nombre que aparece a la derecha del icono con hover o con el teclado
function Rotulo({ texto } : { texto : string }) {
    return (
        <span className="pointer-events-none absolute left-full ml-[12px] whitespace-nowrap rounded-[8px] bg-slate-900/85 px-[10px] py-[5px] text-[12px] font-semibold text-white opacity-0 -translate-x-[4px] transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0 group-focus-visible/item:opacity-100 group-focus-visible/item:translate-x-0">
            {texto}
        </span>
    );
}

// panel de vidrio a la derecha de la barra, centrado verticalmente con ella
function PanelLateral({ abierto, children, ancho } : { abierto : boolean; children : ReactNode; ancho : string }) {
    return (
        <div className={`absolute left-full top-1/2 ml-[14px] -translate-y-1/2 transition-all duration-200 ${abierto ? 'visible opacity-100 translate-x-0' : 'invisible opacity-0 -translate-x-[6px]'}`}>
            <div className={`${ancho} max-h-[calc(100dvh-32px)] overflow-y-auto overflow-x-hidden scroll-fino rounded-[16px] p-[6px] text-slate-900 ${PANEL_VIDRIO}`}>
                {children}
            </div>
        </div>
    );
}

interface BarraLateralProps {
    // en celular la barra esta oculta y aparece con el boton del menu del header
    visibleEnCelular : boolean;
    onCerrar : () => void;
}

// barra de navegacion flotante: centrada en el lado izquierdo, vidrio blanco con iconos grises.
// solo existe hasta 768px y aparece con el boton del menu del header (desde 769px esta MenuClasico); los paneles (categorias y ayuda) se abren con sus botones
export default function BarraLateral({ visibleEnCelular, onCerrar } : BarraLateralProps) {
    const { pathname } = useLocation();
    const { categorias } = useStore();
    const [panel, setPanel] = useState<Panel>(null);
    const contenedor = useRef<HTMLDivElement>(null);

    useEffect(() => setPanel(null), [pathname]);
    useEffect(() => { if (!visibleEnCelular) setPanel(null); }, [visibleEnCelular]);

    // escape o clic fuera cierran el panel abierto (y la barra en celular con escape)
    useEffect(() => {
        if (!panel && !visibleEnCelular) return;
        const alTeclear = (e : KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            if (panel) setPanel(null);
            else onCerrar();
        };
        const alTocar = (e : PointerEvent) => {
            if (!contenedor.current?.contains(e.target as Node)) setPanel(null);
        };
        document.addEventListener('keydown', alTeclear);
        document.addEventListener('pointerdown', alTocar);
        return () => {
            document.removeEventListener('keydown', alTeclear);
            document.removeEventListener('pointerdown', alTocar);
        };
    }, [panel, visibleEnCelular, onCerrar]);

    const alternar = (nuevo : Panel) => setPanel((actual) => (actual === nuevo ? null : nuevo));
    const categoriaActiva = categorias.some((categoria) => pathname === `/${categoria.slug}`);
    const ayudaActiva = AYUDA.some((enlace) => pathname === enlace.a);

    return (
        // los paneles van fuera del <nav>: un backdrop-filter dentro de otro no desenfoca la pagina
        <div ref={contenedor} className={`fixed left-[12px] top-1/2 -translate-y-1/2 ${visibleEnCelular ? 'z-[75] block min-[769px]:hidden aparecerVidrio' : 'hidden'}`}>
            <nav
                aria-label="Principal"
                className="flex flex-col items-center gap-[6px] rounded-full p-[6px] bg-white/60 backdrop-blur-xl backdrop-saturate-150 ring-1 ring-white/80 shadow-[0_10px_30px_rgba(15,23,42,.18)]"
            >
                {ENLACES.map((enlace) => (
                    <NavLink
                        key={enlace.a}
                        to={enlace.a}
                        end={enlace.exacto}
                        aria-label={enlace.texto}
                        className={({ isActive }) => `${CLASE_BOTON} ${isActive ? ACTIVO : ''}`}
                    >
                        <Icono nombre={enlace.icono} className="size-[21px]" />
                        <Rotulo texto={enlace.texto} />
                    </NavLink>
                ))}

                <button
                    type="button"
                    aria-label="Categorías"
                    aria-expanded={panel === 'categorias'}
                    onClick={() => alternar('categorias')}
                    className={`${CLASE_BOTON} ${panel === 'categorias' || categoriaActiva ? ACTIVO : ''}`}
                >
                    <Icono nombre="brillo" className="size-[21px]" />
                    {panel !== 'categorias' && <Rotulo texto="Categorías" />}
                </button>

                <span className="h-px w-[26px] bg-slate-300" aria-hidden="true" />

                <button
                    type="button"
                    aria-label="Más opciones"
                    aria-expanded={panel === 'ayuda'}
                    onClick={() => alternar('ayuda')}
                    className={`${CLASE_BOTON} ${panel === 'ayuda' || ayudaActiva ? ACTIVO : ''}`}
                >
                    <Icono nombre="menu" className="size-[21px]" />
                    {panel !== 'ayuda' && <Rotulo texto="Más opciones" />}
                </button>
            </nav>

            <PanelLateral abierto={panel === 'categorias'} ancho="w-[min(440px,calc(100vw-96px))]">
                <ul className="grid sm:grid-cols-2 gap-[2px]">
                    {categorias.map((categoria) => (
                        <li key={categoria.slug}>
                            <Link to={`/${categoria.slug}`} tabIndex={panel === 'categorias' ? 0 : -1} className="flex items-center gap-[10px] rounded-[10px] p-[8px] hover:bg-white/60">
                                <img src={categoria.imagen} alt="" className="size-[38px] rounded-[8px] object-cover" loading="lazy" />
                                <span className="min-w-0">
                                    <span className="block text-[14px] font-semibold">{categoria.nombre}</span>
                                    <span className="block text-[12px] text-slate-600 truncate">{categoria.descripcion}</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </PanelLateral>

            <PanelLateral abierto={panel === 'ayuda'} ancho="w-[min(260px,calc(100vw-96px))]">
                <p className="px-[12px] pt-[6px] pb-[4px] text-[11px] font-semibold uppercase tracking-[.14em] text-slate-500">Ayuda</p>
                <ul>
                    {AYUDA.map((enlace) => (
                        <li key={enlace.a}>
                            <Link to={enlace.a} tabIndex={panel === 'ayuda' ? 0 : -1} className="flex items-center gap-[12px] rounded-[10px] px-[12px] py-[10px] text-[15px] font-medium hover:bg-white/60">
                                <Icono nombre={enlace.icono} className="size-[19px] text-sky-700" />
                                {enlace.texto}
                            </Link>
                        </li>
                    ))}
                </ul>
            </PanelLateral>
        </div>
    );
}

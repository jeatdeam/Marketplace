import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';

import Icono from './Icono';
import { useStore } from '../context/StoreContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { datosProducto, formatoSoles, nombreCategoria, normalizar, rutaProducto } from '../datos/tienda';
import type { Product } from '../../../shared/types';

const MAX_RESULTADOS = 6;

// cada palabra debe aparecer en el nombre, la marca o la categoria (sin importar tildes)
function filtrar(productos : Product[], consulta : string) {
    const palabras = normalizar(consulta).trim().split(/\s+/).filter(Boolean);
    if (!palabras.length) return [];
    return productos.filter((producto) => {
        const texto = normalizar(`${producto.name} ${producto.brand} ${producto.category} ${producto.subtitle}`);
        return palabras.every((palabra) => texto.includes(palabra));
    });
}

// en escritorio es un input dentro del header; en celular (<=768px) una lupa que abre un buscador flotante
export default function Buscador() {
    const escritorio = useMediaQuery('(min-width: 769px)');
    const [abierto, setAbierto] = useState(false);

    useEffect(() => {
        if (escritorio) setAbierto(false);
    }, [escritorio]);

    if (escritorio) {
        return (
            // ancho fijo: el desplegable de resultados toma exactamente este mismo ancho
            <div className="relative w-[360px]">
                <CampoBusqueda oscuro />
            </div>
        );
    }

    return (
        <>
            <button
                type="button"
                aria-label="Buscar productos"
                aria-expanded={abierto}
                onClick={() => setAbierto(true)}
                className="backCircle grid place-items-center size-[40px]"
            >
                <Icono nombre="buscar" className="size-[21px]" />
            </button>
            {abierto && createPortal(
                <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Buscar productos">
                    {/* vidrio esmerilado: tocarlo cierra el buscador */}
                    <div className="aparecerVidrio absolute inset-0 bg-slate-900/25 backdrop-blur-sm" onClick={() => setAbierto(false)} />
                    <div className="relative mx-auto mt-[100px] w-[calc(100%-24px)] max-w-[520px]">
                        <CampoBusqueda autoFocus onCerrar={() => setAbierto(false)} />
                    </div>
                </div>,
                document.body,
            )}
        </>
    );
}

interface CampoBusquedaProps {
    oscuro?: boolean;
    autoFocus?: boolean;
    onCerrar?: () => void;
}

function CampoBusqueda({ oscuro = false, autoFocus = false, onCerrar } : CampoBusquedaProps) {
    const { baseDatos } = useStore();
    const navigate = useNavigate();
    const [consulta, setConsulta] = useState('');
    const [enfocado, setEnfocado] = useState(false);
    const contenedor = useRef<HTMLDivElement>(null);
    const idLista = useId();

    const resultados = filtrar(baseDatos || [], consulta);
    const mostrarPanel = (enfocado || !oscuro) && consulta.trim().length > 0;

    // escape cierra; clic fuera tambien
    useEffect(() => {
        const alTeclear = (e : KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            setEnfocado(false);
            onCerrar?.();
        };
        const alTocar = (e : PointerEvent) => {
            if (!contenedor.current?.contains(e.target as Node)) setEnfocado(false);
        };
        document.addEventListener('keydown', alTeclear);
        document.addEventListener('pointerdown', alTocar);
        return () => {
            document.removeEventListener('keydown', alTeclear);
            document.removeEventListener('pointerdown', alTocar);
        };
    }, [onCerrar]);

    const irAlCatalogo = () => {
        const texto = consulta.trim();
        if (!texto) return;
        navigate(`/productos?q=${encodeURIComponent(texto)}`);
        setEnfocado(false);
        setConsulta('');
        onCerrar?.();
    };

    const alElegir = () => {
        setEnfocado(false);
        setConsulta('');
        onCerrar?.();
    };

    return (
        <div ref={contenedor} className="relative">
            <form
                role="search"
                onSubmit={(e) => { e.preventDefault(); irAlCatalogo(); }}
                className={`flex items-center gap-[8px] rounded-[10px] px-[12px] h-[42px] ${oscuro ? 'bg-white/10 ring-1 ring-white/25 focus-within:bg-white/85 focus-within:text-slate-900' : 'text-slate-900 bg-white/75 backdrop-blur-xl ring-1 ring-white/80 shadow-[0_16px_40px_rgba(15,23,42,.2)]'} transition-colors`}
            >
                <Icono nombre="buscar" className="size-[18px] shrink-0 opacity-80" />
                <input
                    type="search"
                    value={consulta}
                    autoFocus={autoFocus}
                    onChange={(e) => setConsulta(e.target.value)}
                    onFocus={() => setEnfocado(true)}
                    placeholder="Buscar juguetes, peluches…"
                    aria-label="Buscar productos"
                    aria-controls={idLista}
                    className="w-full bg-transparent text-[14px] placeholder:text-current placeholder:opacity-70 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                />
                {onCerrar && (
                    <button type="button" onClick={onCerrar} aria-label="Cerrar buscador" className="grid place-items-center size-[28px] rounded-full hover:bg-slate-100">
                        <Icono nombre="cerrar" className="size-[18px]" />
                    </button>
                )}
            </form>

            {mostrarPanel && (
                <div
                    id={idLista}
                    role="status"
                    className={`${oscuro ? 'absolute inset-x-0 top-full mt-[8px]' : 'mt-[10px]'} text-slate-900 rounded-[12px] p-[6px] bg-white/75 backdrop-blur-xl ring-1 ring-white/80 shadow-[0_16px_40px_rgba(15,23,42,.2)]`}
                >
                    {resultados.length === 0 ? (
                        <div className="flex flex-col items-center text-center gap-[6px] py-[22px] px-[12px]">
                            <span className="grid place-items-center size-[52px] rounded-full bg-sky-50 text-sky-700">
                                <Icono nombre="buscar" className="size-[24px]" />
                            </span>
                            <p className="text-[14px] font-semibold">Sin resultados para “{consulta}”</p>
                            <p className="text-[12px] text-slate-500">Prueba con otra palabra, como “rex” o “dinosaurio”.</p>
                        </div>
                    ) : (
                        <>
                            <ul className="max-h-[360px] overflow-y-auto scroll-fino">
                                {resultados.slice(0, MAX_RESULTADOS).map((producto) => {
                                    const datos = datosProducto(producto);
                                    return (
                                        <li key={`${producto.brand}-${producto.name}`}>
                                            <Link to={rutaProducto(producto)} onClick={alElegir} className="flex items-center gap-[10px] rounded-[8px] p-[6px] hover:bg-sky-50">
                                                <img src={producto.img[0]} alt="" className="size-[44px] shrink-0 rounded-[8px] object-cover bg-[#f3f9fd]" />
                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-[14px] font-semibold truncate">{producto.name}</span>
                                                    <span className="block text-[12px] text-slate-500 truncate">{nombreCategoria(producto.category)} · {producto.brand}</span>
                                                </span>
                                                <span className="shrink-0 text-[13px] font-bold">{formatoSoles(datos.precio)}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                            <button type="button" onClick={irAlCatalogo} className="mt-[4px] w-full flex items-center justify-center gap-[6px] rounded-[8px] py-[9px] text-[13px] font-semibold text-sky-700 hover:bg-sky-50">
                                {resultados.length === 1 ? 'Ver el resultado' : `Ver los ${resultados.length} resultados`} <Icono nombre="flechaDerecha" className="size-[16px]" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

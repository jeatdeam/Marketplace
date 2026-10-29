import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link } from '../router';

import Icono from './Icono';
import { BOTON_PRODUCTO, Estrellas } from './ui';
import { useCartActions } from '../context/StoreContext';
import { datosProducto, formatoSoles, nombreCategoria, rutaProducto } from '../datos/tienda';
import type { Product } from '../../../shared/types';

// tarjeta de tamaño fijo (275 x 445) para que las grillas y carruseles queden parejos
export default function TarjetaProducto({ producto } : { producto : Product }) {
    const { add, buy } = useCartActions();
    const [agregado, setAgregado] = useState(false);
    const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined);
    const datos = datosProducto(producto);

    useEffect(() => () => clearTimeout(temporizador.current), []);

    const agregar = async (e : MouseEvent) => {
        e.preventDefault();
        await add(producto);
        setAgregado(true);
        clearTimeout(temporizador.current);
        temporizador.current = setTimeout(() => setAgregado(false), 1200);
    };

    const comprar = (e : MouseEvent) => {
        e.preventDefault();
        buy(producto);
    };

    return (
        <article className="group/tarjeta relative w-[275px] h-[445px] shrink-0 bg-white/55 backdrop-blur-md rounded-[12px] p-[12px] flex flex-col ring-1 ring-white/80 shadow-[0_8px_30px_rgba(15,23,42,.08)] transition-shadow duration-300 hover:shadow-[0_14px_40px_rgba(15,23,42,.18)]">
            <Link to={rutaProducto(producto)} className="flex flex-col flex-1 min-h-0" aria-label={producto.name}>
                <div className="relative aspect-square overflow-hidden rounded-[8px] bg-[#f3f9fd]">
                    <img
                        src={producto.img[0]}
                        alt=""
                        loading="lazy"
                        draggable={false}
                        className="size-full object-cover transition-transform duration-500 group-hover/tarjeta:scale-105"
                    />
                    {datos.descuento > 0 && (
                        <span className="absolute top-[8px] left-[8px] rounded-full bg-red-600 px-[8px] py-[3px] text-[11px] font-bold text-white">-{datos.descuento}%</span>
                    )}
                    {datos.stock === 0 && (
                        <span className="absolute inset-x-0 bottom-0 bg-slate-900/80 py-[6px] text-center text-[12px] font-bold text-white">Agotado</span>
                    )}
                    {datos.nuevo && (
                        <span className="absolute top-[8px] right-[8px] rounded-full bg-[#facc15] px-[8px] py-[3px] text-[11px] font-bold text-slate-900">Nuevo</span>
                    )}
                </div>
                <p className="mt-[10px] text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{nombreCategoria(producto.category)}</p>
                <h3 className="mt-[2px] text-[14px] font-semibold leading-snug line-clamp-2 min-h-[2.7em]">{producto.name}</h3>
                <p className="text-[12px] text-slate-500 line-clamp-1">{producto.subtitle}</p>
                <div className="mt-auto flex items-end justify-between gap-[8px] pt-[6px]">
                    <div className="leading-tight">
                        {datos.precioAnterior && (
                            <s className="block text-[12px] text-slate-400">{formatoSoles(datos.precioAnterior)}</s>
                        )}
                        <span className={`text-[17px] font-extrabold ${datos.descuento ? 'text-red-600' : 'text-slate-900'}`}>{formatoSoles(datos.precio)}</span>
                    </div>
                    <Estrellas valor={datos.calificacion} tamano="size-[12px]" />
                </div>
            </Link>
            {/* el espacio va en el contenedor y no en el boton para que el texto quede centrado */}
            <div className="flex gap-[8px] pt-[12px]">
                <button
                    type="button"
                    onClick={agregar}
                    disabled={datos.stock === 0}
                    aria-live="polite"
                    className={`${BOTON_PRODUCTO} flex-1 ${agregado ? '!bg-blue-500 !border-blue-500 !text-white' : ''}`}
                >
                    {/* los dos textos comparten celda para que el boton no cambie de tamaño */}
                    <span className="grid">
                        <span className={`[grid-area:1/1] flex items-center gap-[6px] transition-opacity ${agregado ? 'opacity-0' : ''}`}>
                            <Icono nombre="bolsa" className="size-[15px]" /> Agregar
                        </span>
                        <span className={`[grid-area:1/1] flex items-center justify-center gap-[6px] transition-opacity ${agregado ? '' : 'opacity-0'}`}>
                            <Icono nombre="check" className="size-[15px]" grosor={3} /> Agregado
                        </span>
                    </span>
                </button>
                <button type="button" onClick={comprar} disabled={datos.stock === 0} className={`${BOTON_PRODUCTO} flex-1`}>
                    <Icono nombre="tarjeta" className="size-[15px]" /> Comprar
                </button>
            </div>
        </article>
    );
}

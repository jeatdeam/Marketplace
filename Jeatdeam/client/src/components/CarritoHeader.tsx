import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from '../router';

import Icono from './Icono';
import { BOTON_PRINCIPAL, CAJA_ELEVADA } from './ui';
import { groupCarrito, totalCarrito, useStore } from '../context/StoreContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { formatoSoles, precioSoles } from '../datos/tienda';

// bolsa con contador que late; en escritorio el panel se abre con hover o teclado, en celular tocando
export default function CarritoHeader() {
    const { carrito, removeGroup, clearCarrito, refreshCarrito } = useStore();
    const navigate = useNavigate();
    const tactil = useMediaQuery('(hover: none)');
    const [abierto, setAbierto] = useState(false);

    const items = carrito || [];
    const cantidad = items.length;
    const grupos = groupCarrito(items);

    useEffect(() => {
        if (!abierto) return;
        const alTeclear = (e : KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false); };
        document.addEventListener('keydown', alTeclear);
        return () => document.removeEventListener('keydown', alTeclear);
    }, [abierto]);

    const panel = (
        <div className="w-[min(360px,calc(100vw-24px))] text-slate-900 rounded-[12px] p-[14px] bg-white/75 backdrop-blur-xl ring-1 ring-white/80 shadow-[0_16px_40px_rgba(15,23,42,.2)]">
            <div className="flex items-center justify-between pb-[10px] border-b border-slate-100">
                <p className="text-[15px] font-bold">Tu carrito</p>
                <span className="text-[12px] text-slate-500">{cantidad} {cantidad === 1 ? 'producto' : 'productos'}</span>
            </div>
            {grupos.length === 0 ? (
                <div className="flex flex-col items-center gap-[8px] py-[26px] text-center">
                    <span className="grid place-items-center size-[64px] rounded-full bg-sky-50 text-sky-700">
                        <Icono nombre="bolsa" className="size-[30px]" grosor={1.6} />
                    </span>
                    <p className="text-[14px] font-semibold">Tu carrito está vacío</p>
                    <Link to="/productos" onClick={() => setAbierto(false)} className="text-[13px] font-semibold text-sky-700 hover:underline">Ver el catálogo</Link>
                </div>
            ) : (
                <>
                    <ul className="max-h-[300px] overflow-y-auto scroll-fino divide-y divide-slate-100">
                        {grupos.map((grupo) => {
                            const item = grupo[0];
                            const unitario = precioSoles(item.price);
                            return (
                                <li key={item.id} className="flex items-center gap-[10px] py-[10px]">
                                    <img src={item.img} alt="" className={`size-[60px] rounded-[8px] object-cover ${CAJA_ELEVADA}`} />
                                    {/* tres lineas: nombre, precio unitario por cantidad y subtotal */}
                                    <div className="min-w-0 flex-1 leading-tight">
                                        <p className="text-[13px] font-semibold truncate">{item.name}</p>
                                        <p className="text-[12px] text-slate-500">{formatoSoles(unitario)} c/u × {grupo.length}</p>
                                        <p className="text-[13px] font-bold">{formatoSoles(unitario * grupo.length)}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeGroup(item.id)}
                                        aria-label={`Quitar ${item.name}`}
                                        className="grid place-items-center size-[28px] rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Icono nombre="cerrar" className="size-[16px]" />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="flex items-center justify-between pt-[10px] border-t border-slate-100">
                        <span className="text-[13px] text-slate-500">Total</span>
                        <span className="text-[18px] font-extrabold">{formatoSoles(precioSoles(totalCarrito(items)))}</span>
                    </div>
                    <div className="flex gap-[8px] pt-[12px]">
                        <button
                            type="button"
                            onClick={() => { setAbierto(false); navigate('/carrito'); }}
                            className={`${BOTON_PRINCIPAL} flex-1`}
                        >
                            <Icono nombre="tarjeta" className="size-[17px]" /> Ir a pagar
                        </button>
                        <button
                            type="button"
                            onClick={clearCarrito}
                            aria-label="Vaciar carrito"
                            title="Vaciar carrito"
                            className="grid place-items-center w-[44px] rounded-[10px] border-2 border-gray-300 text-slate-600 transition-all hover:border-red-600 hover:text-red-600 active:scale-90"
                        >
                            <Icono nombre="tacho" className="size-[18px]" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="group/carrito relative" onMouseEnter={() => !tactil && refreshCarrito()}>
            <button
                type="button"
                onClick={() => (tactil ? setAbierto((valor) => !valor) : navigate('/carrito'))}
                aria-label={`Ver carrito, ${cantidad} ${cantidad === 1 ? 'producto' : 'productos'}`}
                aria-expanded={tactil ? abierto : undefined}
                className="backCircle relative grid place-items-center size-[40px]"
            >
                <Icono nombre="bolsa" className="size-[22px]" />
                {cantidad > 0 && (
                    <span className="contadorPulso absolute -top-[2px] -right-[2px] grid place-items-center min-w-[19px] h-[19px] px-[4px] rounded-full bg-white text-slate-900 text-[11px] font-bold">
                        {cantidad}
                    </span>
                )}
            </button>

            {tactil ? (
                abierto && createPortal(
                    <div className="fixed inset-0 z-[60]">
                        {/* el toque que cierra el panel no activa lo que hay debajo */}
                        <div className="aparecerVidrio absolute inset-0 bg-slate-900/25 backdrop-blur-sm" onClick={() => setAbierto(false)} />
                        <div className="absolute right-[12px] top-[96px]">{panel}</div>
                    </div>,
                    document.body,
                )
            ) : (
                <div className="absolute right-0 top-full pt-[12px] invisible opacity-0 translate-y-[5px] transition-all duration-200 group-hover/carrito:visible group-hover/carrito:opacity-100 group-hover/carrito:translate-y-0 group-focus-within/carrito:visible group-focus-within/carrito:opacity-100 group-focus-within/carrito:translate-y-0">
                    {panel}
                </div>
            )}
        </div>
    );
}

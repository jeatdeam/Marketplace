import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import Icono, { type NombreIcono } from '../components/Icono';
import ShippingForm, { type Entrega } from '../components/ShippingForm';
import WalletPanel, { WALLETS, type WalletName } from '../components/WalletPanel';
import { ANCHO_SECCION, BOTON_PRINCIPAL, BOTON_SECUNDARIO, CAJA_ELEVADA, TARJETA, EncabezadoPagina } from '../components/ui';
import { crearSesionPago } from '../api';
import { groupCarrito, totalCarrito, useStore } from '../context/StoreContext';
import { TIENDA, formatoSoles, precioSoles } from '../datos/tienda';
import type { CartItem } from '../../../shared/types';

const COSTO_ENVIO = 12;

type Paso = 'carrito' | 'datos' | 'pago';
type Metodo = 'tarjeta' | WalletName;

function FilaProducto({ grupo, onSumar, onRestar, onQuitar } : { grupo : CartItem[]; onSumar : () => void; onRestar : () => void; onQuitar : () => void }) {
    const item = grupo[0];
    const unitario = precioSoles(item.price);
    return (
        <li className="flex gap-[12px] sm:gap-[16px] py-[16px]">
            <img src={item.img} alt="" className={`size-[76px] sm:size-[92px] shrink-0 rounded-[10px] object-cover ${CAJA_ELEVADA}`} />
            <div className="min-w-0 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-[8px]">
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{item.brand}</p>
                        <p className="text-[15px] font-semibold leading-snug">{item.name}</p>
                        <p className="text-[13px] text-slate-500">{formatoSoles(unitario)} c/u</p>
                    </div>
                    <button type="button" onClick={onQuitar} aria-label={`Quitar ${item.name}`} className="grid place-items-center size-[32px] shrink-0 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600">
                        <Icono nombre="tacho" className="size-[17px]" />
                    </button>
                </div>
                <div className="mt-auto pt-[8px] flex items-center justify-between gap-[8px]">
                    <div className="flex items-center rounded-[10px] border-2 border-gray-200" role="group" aria-label={`Cantidad de ${item.name}`}>
                        <button type="button" onClick={onRestar} aria-label="Restar uno" className="grid place-items-center size-[32px] hover:bg-slate-50 active:scale-90">
                            <Icono nombre="menos" className="size-[14px]" />
                        </button>
                        <span key={grupo.length} className="parpadeoCantidad w-[30px] text-center text-[14px] font-bold rounded-full" aria-live="polite">{grupo.length}</span>
                        <button type="button" onClick={onSumar} aria-label="Sumar uno" className="grid place-items-center size-[32px] hover:bg-slate-50 active:scale-90">
                            <Icono nombre="mas" className="size-[14px]" />
                        </button>
                    </div>
                    <p className="text-[16px] font-extrabold">{formatoSoles(unitario * grupo.length)}</p>
                </div>
            </div>
        </li>
    );
}

function Pasos({ actual } : { actual : Paso }) {
    const pasos : { id : Paso; texto : string; icono : NombreIcono }[] = [
        { id: 'carrito', texto: 'Carrito', icono: 'bolsa' },
        { id: 'datos', texto: 'Datos', icono: 'usuario' },
        { id: 'pago', texto: 'Pago', icono: 'tarjeta' },
    ];
    const indiceActual = pasos.findIndex((paso) => paso.id === actual);
    return (
        <ol className="flex items-center gap-[8px]" aria-label="Pasos de la compra">
            {pasos.map((paso, indice) => (
                <li key={paso.id} className="flex items-center gap-[8px] flex-1 last:flex-none">
                    <span
                        aria-current={indice === indiceActual ? 'step' : undefined}
                        className={`inline-flex items-center gap-[6px] rounded-full px-[10px] py-[5px] text-[12px] font-semibold ${indice <= indiceActual ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}
                    >
                        <Icono nombre={indice < indiceActual ? 'check' : paso.icono} className="size-[14px]" /> {paso.texto}
                    </span>
                    {indice < pasos.length - 1 && <span className={`h-[2px] flex-1 rounded-full ${indice < indiceActual ? 'bg-slate-900' : 'bg-slate-200'}`} />}
                </li>
            ))}
        </ol>
    );
}

// /carrito
export default function Compra() {
    const { carrito, addToCart, removeOne, removeGroup, clearCarrito } = useStore();
    const [paso, setPaso] = useState<Paso>('carrito');
    const [entrega, setEntrega] = useState<Entrega>('delivery');
    const [metodo, setMetodo] = useState<Metodo | null>(null);
    const [mostrarQr, setMostrarQr] = useState(false);
    const [redirigiendo, setRedirigiendo] = useState(false);
    const [errorPago, setErrorPago] = useState('');

    if (!carrito) {
        return <main className="flex-1 pt-[180px] text-center text-slate-500" role="status">Cargando carrito…</main>;
    }

    const subtotal = precioSoles(totalCarrito(carrito));
    const envio = entrega === 'tienda' || subtotal >= TIENDA.envioGratisDesde ? 0 : COSTO_ENVIO;
    const total = subtotal + envio;
    const faltaParaGratis = TIENDA.envioGratisDesde - subtotal;
    const grupos = groupCarrito(carrito);

    if (carrito.length === 0) {
        return (
            <main className={`${ANCHO_SECCION} flex-1`}>
                <EncabezadoPagina titulo="Carrito de compras" migas={[{ texto: 'Inicio', a: '/' }, { texto: 'Carrito' }]} />
                <section className={`${TARJETA} flex flex-col items-center gap-[10px] py-[50px] text-center`}>
                    <span className="grid place-items-center size-[84px] rounded-full bg-sky-50 text-sky-700">
                        <Icono nombre="bolsa" className="size-[40px]" grosor={1.5} />
                    </span>
                    <h2 className="text-[20px] font-bold">Tu carrito está vacío</h2>
                    <p className="max-w-[360px] text-[14px] text-slate-500">Agrega tus juguetes favoritos y vuelve aquí para pagar con Yape, Plin o tarjeta.</p>
                    <div className="pt-[10px] flex flex-wrap justify-center gap-[10px]">
                        <Link to="/productos" className={BOTON_PRINCIPAL}>Ver catálogo</Link>
                        <Link to="/promociones" className={BOTON_SECUNDARIO}>Ver ofertas</Link>
                    </div>
                </section>
            </main>
        );
    }

    const pagarConTarjeta = async () => {
        setRedirigiendo(true);
        setErrorPago('');
        try {
            const { url } = await crearSesionPago();
            window.location.href = url;
        } catch {
            setErrorPago('No pudimos abrir la pasarela de pago. Inténtalo de nuevo o paga con Yape o Plin.');
            setRedirigiendo(false);
        }
    };

    const continuar = () => {
        if (metodo === 'tarjeta') pagarConTarjeta();
        else if (metodo) setMostrarQr(true);
    };

    return (
        <main className={`${ANCHO_SECCION} flex-1`}>
            <EncabezadoPagina titulo="Carrito de compras" migas={[{ texto: 'Inicio', a: '/' }, { texto: 'Carrito' }]} />

            <div className="grid gap-[20px] lg:grid-cols-[1fr_400px] items-start">
                <section className={`${TARJETA} !p-[18px] sm:!p-[25px]`} aria-labelledby="titulo-productos">
                    <div className="flex items-center justify-between gap-[10px]">
                        <h2 id="titulo-productos" className="text-[18px] font-bold">
                            Productos <span className="text-slate-400 font-medium">({carrito.length})</span>
                        </h2>
                        <button type="button" onClick={clearCarrito} className="inline-flex items-center gap-[6px] text-[13px] font-semibold text-slate-500 hover:text-red-600">
                            <Icono nombre="tacho" className="size-[15px]" /> Vaciar carrito
                        </button>
                    </div>
                    <ul className="divide-y divide-slate-100">
                        {grupos.map((grupo) => (
                            <FilaProducto
                                key={grupo[0].id}
                                grupo={grupo}
                                onSumar={() => addToCart(grupo[0])}
                                onRestar={() => removeOne(grupo[grupo.length - 1].idCompra)}
                                onQuitar={() => removeGroup(grupo[0].id)}
                            />
                        ))}
                    </ul>
                    {faltaParaGratis > 0 && entrega === 'delivery' && (
                        <div className="mt-[8px] rounded-[12px] bg-[#fef9c3] p-[14px]">
                            <p className="flex items-center gap-[8px] text-[13px] font-medium text-slate-900">
                                <Icono nombre="camion" className="size-[18px]" /> Te faltan <b>{formatoSoles(faltaParaGratis)}</b> para el delivery gratis
                            </p>
                            <div className="mt-[8px] h-[6px] rounded-full bg-white">
                                <div className="h-full rounded-full bg-[#facc15] transition-[width] duration-500" style={{ width: `${Math.min(100, (subtotal / TIENDA.envioGratisDesde) * 100)}%` }} />
                            </div>
                        </div>
                    )}
                </section>

                <aside className={`${TARJETA} !p-[18px] sm:!p-[25px] lg:sticky lg:top-[110px]`} aria-label="Resumen y pago">
                    <Pasos actual={paso} />

                    <dl className="mt-[18px] flex flex-col gap-[8px] text-[14px]">
                        <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd className="font-semibold">{formatoSoles(subtotal)}</dd></div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">{entrega === 'tienda' ? 'Recojo en tienda' : 'Delivery'}</dt>
                            <dd className={`font-semibold ${envio === 0 ? 'text-emerald-700' : ''}`}>{envio === 0 ? 'Gratis' : formatoSoles(envio)}</dd>
                        </div>
                        <div className="flex justify-between items-end pt-[10px] border-t border-slate-100">
                            <dt className="font-semibold">Total</dt>
                            <dd className="text-[24px] font-extrabold leading-none">{formatoSoles(total)}</dd>
                        </div>
                    </dl>

                    <div className="mt-[20px]">
                        {paso === 'carrito' && (
                            <button type="button" onClick={() => setPaso('datos')} className={`${BOTON_PRINCIPAL} w-full !py-[12px]`}>
                                Continuar con mis datos <Icono nombre="flechaDerecha" className="size-[17px]" />
                            </button>
                        )}

                        {paso === 'datos' && (
                            <>
                                <button type="button" onClick={() => setPaso('carrito')} className="mb-[12px] inline-flex items-center gap-[6px] text-[13px] font-semibold text-slate-600 hover:text-slate-900">
                                    <Icono nombre="flechaIzquierda" className="size-[16px]" /> Volver
                                </button>
                                <ShippingForm onListo={(tipo) => { setEntrega(tipo); setPaso('pago'); }} />
                            </>
                        )}

                        {paso === 'pago' && (mostrarQr && metodo && metodo !== 'tarjeta' ? (
                            <WalletPanel billetera={metodo} total={total} onVolver={() => setMostrarQr(false)} />
                        ) : (
                            <>
                                <button type="button" onClick={() => setPaso('datos')} className="mb-[12px] inline-flex items-center gap-[6px] text-[13px] font-semibold text-slate-600 hover:text-slate-900">
                                    <Icono nombre="flechaIzquierda" className="size-[16px]" /> Editar mis datos
                                </button>
                                <p className="mb-[10px] text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-600">Elige cómo pagar</p>
                                <div role="radiogroup" aria-label="Medio de pago" className="flex flex-col gap-[10px]">
                                    <OpcionPago activa={metodo === 'tarjeta'} onElegir={() => setMetodo('tarjeta')} titulo="Tarjeta de crédito o débito" texto="Visa, Mastercard, Amex · pasarela segura">
                                        <span className="grid place-items-center size-[40px] rounded-[10px] bg-slate-900 text-white"><Icono nombre="tarjeta" className="size-[20px]" /></span>
                                    </OpcionPago>
                                    {(Object.keys(WALLETS) as WalletName[]).map((nombre) => (
                                        <OpcionPago key={nombre} activa={metodo === nombre} onElegir={() => setMetodo(nombre)} titulo={WALLETS[nombre].nombre} texto="Escanea el QR desde tu celular">
                                            <span className="grid place-items-center size-[40px] rounded-[10px] bg-white ring-1 ring-black/10 p-[4px]"><img src={WALLETS[nombre].logo} alt="" className="max-h-full object-contain" /></span>
                                        </OpcionPago>
                                    ))}
                                </div>
                                {errorPago && <p role="alert" className="mt-[10px] text-[13px] font-medium text-red-600">{errorPago}</p>}
                                <div className="pt-[16px]">
                                    <button type="button" onClick={continuar} disabled={!metodo || redirigiendo} className={`${BOTON_PRINCIPAL} w-full !py-[12px]`}>
                                        <Icono nombre={metodo === 'tarjeta' ? 'candado' : 'qr'} className="size-[17px]" />
                                        {redirigiendo ? 'Abriendo pasarela…' : metodo === 'tarjeta' ? `Pagar ${formatoSoles(total)}` : metodo ? `Ver QR de ${WALLETS[metodo].nombre}` : 'Elige un medio de pago'}
                                    </button>
                                </div>
                            </>
                        ))}
                    </div>

                    <p className="mt-[16px] flex items-center justify-center gap-[6px] text-[12px] text-slate-500">
                        <Icono nombre="escudo" className="size-[14px]" /> Pago protegido · comprobante electrónico
                    </p>
                </aside>
            </div>
        </main>
    );
}

function OpcionPago({ activa, onElegir, titulo, texto, children } : { activa : boolean; onElegir : () => void; titulo : string; texto : string; children : ReactNode }) {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={activa}
            onClick={onElegir}
            className={`flex items-center gap-[12px] rounded-[12px] p-[12px] text-left ring-2 transition-all ${activa ? 'ring-slate-900 bg-slate-50' : 'ring-slate-200 hover:ring-slate-400'}`}
        >
            {children}
            <span className="flex-1">
                <span className="block text-[14px] font-semibold">{titulo}</span>
                <span className="block text-[12px] text-slate-500">{texto}</span>
            </span>
            <span className={`grid place-items-center size-[20px] rounded-full ring-2 ${activa ? 'ring-slate-900 bg-slate-900 text-white' : 'ring-slate-300'}`}>
                {activa && <Icono nombre="check" className="size-[12px]" grosor={3} />}
            </span>
        </button>
    );
}

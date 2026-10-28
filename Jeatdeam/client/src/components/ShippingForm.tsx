import { useState, type FormEvent, type ReactNode } from 'react';

import Icono from './Icono';
import { BOTON_PRINCIPAL, ETIQUETA_CAMPO, INPUT } from './ui';
import { enviarDatosComplete, enviarDatosShort } from '../api';
import { TIENDA } from '../datos/tienda';

const COURIERS = [
    { empresa: 'shalom', label: 'Shalom' },
    { empresa: 'olva', label: 'Olva Courier' },
    { empresa: 'dinocourier', label: 'Dinocourier' },
    { empresa: 'otros', label: 'Otro' },
];

export type Entrega = 'delivery' | 'tienda';

// lo que se lleno: al volver desde el pago el formulario aparece con estos datos para corregirlos
export interface ValoresEnvio {
    entrega : Entrega;
    courier : string;
    campos : Record<string, string>;
}

function Campo({ etiqueta, children, className = '' } : { etiqueta : string; children : ReactNode; className?: string }) {
    return (
        <label className={`block ${className}`}>
            <span className={ETIQUETA_CAMPO}>{etiqueta}</span>
            {children}
        </label>
    );
}

// formulario "datos de envio" del carrito; al validarse se envia al servidor y pasa al pago
export default function ShippingForm({ inicial, onListo } : { inicial?: ValoresEnvio; onListo : (valores : ValoresEnvio) => void }) {
    const [entrega, setEntrega] = useState<Entrega>(inicial?.entrega ?? 'delivery');
    const [courier, setCourier] = useState(inicial?.courier ?? '');
    const [errorCourier, setErrorCourier] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');
    const delivery = entrega === 'delivery';

    const onSubmit = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (delivery && !courier) {
            setErrorCourier(true);
            return;
        }
        const campos = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
        setEnviando(true);
        setError('');
        try {
            if (delivery) {
                await enviarDatosComplete({
                    correo: campos.correo,
                    nombre: campos.nombre,
                    numOne: campos.telefono,
                    numTwo: campos.telefono2,
                    direccion: campos.direccion,
                    departamento: campos.departamento,
                    distrito: campos.distrito,
                    infoExtra: campos.referencia,
                    infoCourier: campos.infoCourier,
                    eleccionEmpresa: courier,
                });
            } else {
                await enviarDatosShort({ correo: campos.correo, nombre: campos.nombre, tel: campos.telefono, telSec: campos.telefono2 });
            }
            onListo({ entrega, courier, campos });
        } catch {
            setError('No pudimos guardar tus datos. Revisa tu conexión e inténtalo otra vez.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-[16px]">
            {/* tarjetas seleccionables para el tipo de entrega */}
            <div role="radiogroup" aria-label="Tipo de entrega" className="grid grid-cols-2 gap-[10px]">
                {([
                    { valor: 'delivery', icono: 'camion', titulo: 'Delivery', texto: 'Lima y provincias' },
                    { valor: 'tienda', icono: 'tienda', titulo: 'Recojo en tienda', texto: 'Gratis, Cercado de Lima' },
                ] as const).map((opcion) => (
                    <button
                        key={opcion.valor}
                        type="button"
                        role="radio"
                        aria-checked={entrega === opcion.valor}
                        onClick={() => setEntrega(opcion.valor)}
                        className={`flex items-start gap-[10px] rounded-[12px] p-[12px] text-left ring-2 transition-all ${entrega === opcion.valor ? 'ring-slate-900 bg-slate-50' : 'ring-slate-200 hover:ring-slate-400'}`}
                    >
                        <Icono nombre={opcion.icono} className="size-[20px] shrink-0 text-sky-700" />
                        <span>
                            <span className="block text-[14px] font-semibold">{opcion.titulo}</span>
                            <span className="block text-[12px] text-slate-500">{opcion.texto}</span>
                        </span>
                    </button>
                ))}
            </div>

            <Campo etiqueta="Correo electrónico">
                <input type="email" name="correo" defaultValue={inicial?.campos.correo} required autoComplete="email" placeholder="tucorreo@ejemplo.com" className={INPUT} />
            </Campo>
            <Campo etiqueta="Nombre y apellidos">
                <input type="text" name="nombre" defaultValue={inicial?.campos.nombre} required autoComplete="name" placeholder="Ana Torres Quispe" className={INPUT} />
            </Campo>
            <div className="grid sm:grid-cols-2 gap-[12px]">
                <Campo etiqueta="Celular">
                    <input type="tel" name="telefono" defaultValue={inicial?.campos.telefono} required pattern="9\d{8}" title="9 dígitos, empieza con 9" inputMode="numeric" autoComplete="tel-national" placeholder="987654321" className={INPUT} />
                </Campo>
                <Campo etiqueta="Celular alternativo (opcional)">
                    <input type="tel" name="telefono2" defaultValue={inicial?.campos.telefono2} pattern="9\d{8}" title="9 dígitos, empieza con 9" inputMode="numeric" placeholder="912345678" className={INPUT} />
                </Campo>
            </div>

            {delivery ? (
                <>
                    <Campo etiqueta="Dirección">
                        <input type="text" name="direccion" defaultValue={inicial?.campos.direccion} required autoComplete="street-address" placeholder="Av. Arequipa 1234, dpto. 502" className={INPUT} />
                    </Campo>
                    <div className="grid grid-cols-2 gap-[12px]">
                        <Campo etiqueta="Departamento">
                            <input type="text" name="departamento" defaultValue={inicial?.campos.departamento} required placeholder="Lima" className={INPUT} />
                        </Campo>
                        <Campo etiqueta="Distrito">
                            <input type="text" name="distrito" defaultValue={inicial?.campos.distrito} required placeholder="Miraflores" className={INPUT} />
                        </Campo>
                    </div>
                    <Campo etiqueta="Referencia (opcional)">
                        <textarea name="referencia" defaultValue={inicial?.campos.referencia} rows={2} placeholder="Frente al parque, portón verde" className={`${INPUT} resize-none`} />
                    </Campo>
                    <fieldset>
                        <legend className={ETIQUETA_CAMPO}>Courier (provincias)</legend>
                        <div className="flex flex-wrap gap-[8px]">
                            {COURIERS.map(({ empresa, label }) => (
                                <button
                                    key={empresa}
                                    type="button"
                                    aria-pressed={courier === empresa}
                                    onClick={() => { setCourier(empresa); setErrorCourier(false); }}
                                    className={`rounded-full px-[14px] py-[7px] text-[13px] font-semibold ring-2 transition-all active:scale-95 ${courier === empresa ? 'bg-slate-900 text-white ring-slate-900' : 'bg-white ring-slate-200 hover:ring-slate-400'}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        {errorCourier && (
                            <p role="alert" className="mt-[8px] flex items-center gap-[6px] text-[13px] font-medium text-red-600">
                                <Icono nombre="alerta" className="size-[15px]" /> Elige un courier para continuar
                            </p>
                        )}
                        {courier && (
                            <textarea
                                name="infoCourier" defaultValue={inicial?.campos.infoCourier}
                                rows={2}
                                required
                                placeholder={`${COURIERS.find((c) => c.empresa === courier)?.label}: sede, nombre y DNI de quien recoge`}
                                className={`${INPUT} mt-[10px] resize-none`}
                            />
                        )}
                    </fieldset>
                </>
            ) : (
                <p className="flex items-start gap-[10px] rounded-[12px] bg-sky-50 p-[14px] text-[13px] text-sky-900">
                    <Icono nombre="ubicacion" className="size-[18px] shrink-0" />
                    Recoge tu pedido en {TIENDA.direccion} · {TIENDA.horario}. Te avisamos por WhatsApp cuando esté listo.
                </p>
            )}

            {error && <p role="alert" className="text-[13px] font-medium text-red-600">{error}</p>}

            <div className="pt-[4px]">
                <button type="submit" disabled={enviando} className={`${BOTON_PRINCIPAL} w-full !py-[12px]`}>
                    {enviando ? 'Guardando…' : <>Continuar al pago <Icono nombre="flechaDerecha" className="size-[17px]" /></>}
                </button>
            </div>
        </form>
    );
}

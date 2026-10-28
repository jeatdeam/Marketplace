import { useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import Icono from '../components/Icono';
import { ANCHO_SECCION, BOTON_PRINCIPAL, BOTON_SECUNDARIO, ETIQUETA_CAMPO, INPUT, TARJETA, EncabezadoPagina } from '../components/ui';
import { enviarReclamo } from '../api';
import { TIENDA } from '../datos/tienda';

function Campo({ etiqueta, children, className = '' } : { etiqueta : string; children : ReactNode; className?: string }) {
    return (
        <label className={`block ${className}`}>
            <span className={ETIQUETA_CAMPO}>{etiqueta}</span>
            {children}
        </label>
    );
}

function Bloque({ numero, titulo, children } : { numero : number; titulo : string; children : ReactNode }) {
    return (
        <fieldset className="rounded-[12px] ring-1 ring-slate-200 p-[16px] sm:p-[20px]">
            <legend className="flex items-center gap-[10px] px-[6px] text-[15px] font-bold">
                <span className="grid place-items-center size-[26px] rounded-full bg-slate-900 text-[12px] text-white">{numero}</span>
                {titulo}
            </legend>
            <div className="grid sm:grid-cols-2 gap-[14px]">{children}</div>
        </fieldset>
    );
}

// hoja de reclamacion virtual (codigo de proteccion y defensa del consumidor, ley 29571)
export default function LibroReclamaciones() {
    const [tipo, setTipo] = useState<'reclamo' | 'queja'>('reclamo');
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');
    const [respuesta, setRespuesta] = useState<{ codigo : string; fecha : string; correo : string } | null>(null);

    const onSubmit = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
        setEnviando(true);
        setError('');
        try {
            const resultado = await enviarReclamo({ ...datos, tipo });
            setRespuesta({ ...resultado, correo: datos.correo });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {
            setError('No pudimos registrar tu hoja. Inténtalo de nuevo o escríbenos a ' + TIENDA.correo);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <main className={`${ANCHO_SECCION} flex-1`}>
            <EncabezadoPagina
                titulo="Libro de reclamaciones"
                descripcion="Conforme al Código de Protección y Defensa del Consumidor, contamos con un Libro de Reclamaciones virtual a tu disposición."
                migas={[{ texto: 'Inicio', a: '/' }, { texto: 'Libro de reclamaciones' }]}
            />

            <div className="grid gap-[20px] lg:grid-cols-[320px_1fr] items-start">
                <aside className={`${TARJETA} flex flex-col items-center text-center lg:sticky lg:top-[110px]`}>
                    <img src="/img/libro-de-reclamaciones.png" alt="Libro de Reclamaciones" className="w-[220px] max-w-full" />
                    <dl className="mt-[14px] w-full text-left text-[13px] flex flex-col gap-[8px]">
                        <div><dt className="text-slate-500">Razón social</dt><dd className="font-semibold">{TIENDA.razonSocial}</dd></div>
                        <div><dt className="text-slate-500">RUC</dt><dd className="font-semibold">{TIENDA.ruc}</dd></div>
                        <div><dt className="text-slate-500">Dirección</dt><dd className="font-semibold">{TIENDA.direccion}</dd></div>
                    </dl>
                    <div className="mt-[16px] w-full rounded-[12px] bg-sky-50 p-[14px] text-left text-[12px] text-sky-900 flex flex-col gap-[6px]">
                        <p><b>Reclamo:</b> disconformidad con el producto o servicio.</p>
                        <p><b>Queja:</b> malestar por la atención, sin relación con el producto.</p>
                        <p>Respondemos en un plazo máximo de <b>15 días hábiles</b>.</p>
                    </div>
                </aside>

                {respuesta ? (
                    <section className={`${TARJETA} flex flex-col items-center text-center py-[40px]`} role="status">
                        <span className="grid place-items-center size-[72px] rounded-full bg-emerald-100 text-emerald-700">
                            <Icono nombre="check" className="size-[36px]" grosor={2.5} />
                        </span>
                        <h2 className="mt-[14px] text-[22px] font-bold">Hoja registrada</h2>
                        <p className="mt-[6px] max-w-[440px] text-[14px] text-slate-600">
                            Guardamos tu {tipo} con el código <b className="text-slate-900">{respuesta.codigo}</b> (registrado el {new Date(respuesta.fecha).toLocaleString('es-PE')}). Te enviaremos una copia y la respuesta a <b className="text-slate-900">{respuesta.correo}</b>.
                        </p>
                        <div className="mt-[20px] flex flex-wrap justify-center gap-[10px]">
                            <button type="button" onClick={() => window.print()} className={BOTON_SECUNDARIO}>
                                <Icono nombre="descargar" className="size-[16px]" /> Imprimir constancia
                            </button>
                            <Link to="/" className={BOTON_PRINCIPAL}>Volver al inicio</Link>
                        </div>
                    </section>
                ) : (
                    <form onSubmit={onSubmit} className={`${TARJETA} !p-[18px] sm:!p-[25px] flex flex-col gap-[20px]`}>
                        <Bloque numero={1} titulo="Datos del consumidor">
                            <Campo etiqueta="Nombres y apellidos" className="sm:col-span-2">
                                <input name="nombre" required autoComplete="name" className={INPUT} placeholder="Ana Torres Quispe" />
                            </Campo>
                            <Campo etiqueta="Tipo de documento">
                                <select name="tipoDocumento" className={INPUT} defaultValue="DNI">
                                    <option>DNI</option>
                                    <option>Carné de extranjería</option>
                                    <option>Pasaporte</option>
                                    <option>RUC</option>
                                </select>
                            </Campo>
                            <Campo etiqueta="Número de documento">
                                <input name="documento" required inputMode="numeric" pattern="[0-9A-Za-z]{8,12}" title="De 8 a 12 caracteres" className={INPUT} placeholder="45678912" />
                            </Campo>
                            <Campo etiqueta="Correo electrónico">
                                <input type="email" name="correo" required autoComplete="email" className={INPUT} placeholder="tucorreo@ejemplo.com" />
                            </Campo>
                            <Campo etiqueta="Celular">
                                <input type="tel" name="telefono" required pattern="9\d{8}" title="9 dígitos, empieza con 9" inputMode="numeric" className={INPUT} placeholder="987654321" />
                            </Campo>
                            <Campo etiqueta="Dirección" className="sm:col-span-2">
                                <input name="direccion" required autoComplete="street-address" className={INPUT} placeholder="Av. Arequipa 1234, Lince, Lima" />
                            </Campo>
                            <label className="sm:col-span-2 flex items-center gap-[10px] text-[13px] text-slate-600">
                                <input type="checkbox" name="menorEdad" value="si" className="size-[16px] accent-slate-900" />
                                Soy menor de edad (lo presenta mi padre, madre o apoderado)
                            </label>
                        </Bloque>

                        <Bloque numero={2} titulo="Producto o servicio contratado">
                            <Campo etiqueta="Tipo">
                                <select name="bien" className={INPUT} defaultValue="Producto">
                                    <option>Producto</option>
                                    <option>Servicio</option>
                                </select>
                            </Campo>
                            <Campo etiqueta="Monto reclamado (S/)">
                                <input type="number" name="monto" min={0} step="0.01" className={INPUT} placeholder="80.00" />
                            </Campo>
                            <Campo etiqueta="Descripción del producto o N.° de pedido" className="sm:col-span-2">
                                <input name="descripcionBien" required className={INPUT} placeholder="Juguete mordelón T-rex, pedido #1024" />
                            </Campo>
                        </Bloque>

                        <Bloque numero={3} titulo="Detalle de la reclamación">
                            <div className="sm:col-span-2" role="radiogroup" aria-label="Tipo de hoja">
                                <span className={ETIQUETA_CAMPO}>Tipo de hoja</span>
                                <div className="grid grid-cols-2 gap-[10px]">
                                    {(['reclamo', 'queja'] as const).map((opcion) => (
                                        <button
                                            key={opcion}
                                            type="button"
                                            role="radio"
                                            aria-checked={tipo === opcion}
                                            onClick={() => setTipo(opcion)}
                                            className={`rounded-[10px] px-[14px] py-[10px] text-[14px] font-semibold capitalize ring-2 transition-all ${tipo === opcion ? 'bg-slate-900 text-white ring-slate-900' : 'ring-slate-200 hover:ring-slate-400'}`}
                                        >
                                            {opcion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Campo etiqueta="Detalle" className="sm:col-span-2">
                                <textarea name="detalle" required rows={4} minLength={20} className={`${INPUT} resize-y`} placeholder="Cuéntanos qué pasó, cuándo y cómo." />
                            </Campo>
                            <Campo etiqueta="Pedido del consumidor" className="sm:col-span-2">
                                <textarea name="pedido" required rows={3} className={`${INPUT} resize-y`} placeholder="Qué solución esperas: cambio, devolución, etc." />
                            </Campo>
                        </Bloque>

                        <label className="flex items-start gap-[10px] text-[13px] text-slate-600">
                            <input type="checkbox" required className="mt-[2px] size-[16px] accent-slate-900" />
                            <span>Declaro que los datos son verdaderos y acepto la <Link to="/privacidad" className="font-semibold text-sky-700 hover:underline">política de privacidad</Link>.</span>
                        </label>

                        {error && <p role="alert" className="text-[13px] font-medium text-red-600">{error}</p>}

                        <div className="flex flex-wrap justify-end gap-[10px]">
                            <button type="reset" className={BOTON_SECUNDARIO}>Limpiar</button>
                            <button type="submit" disabled={enviando} className={BOTON_PRINCIPAL}>
                                <Icono nombre="enviar" className="size-[16px]" /> {enviando ? 'Enviando…' : 'Enviar hoja'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </main>
    );
}

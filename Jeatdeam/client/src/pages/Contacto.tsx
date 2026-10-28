import { useState, type FormEvent } from 'react';

import Icono, { type NombreIcono } from '../components/Icono';
import { ANCHO_SECCION, BOTON_PRINCIPAL, ETIQUETA_CAMPO, INPUT, TARJETA, EncabezadoPagina } from '../components/ui';
import { enviarContacto } from '../api';
import { TIENDA } from '../datos/tienda';

const CANALES : { icono : NombreIcono; titulo : string; valor : string; href?: string }[] = [
    { icono: 'whatsapp', titulo: 'WhatsApp', valor: TIENDA.telefono, href: `https://wa.me/${TIENDA.whatsapp}` },
    { icono: 'correo', titulo: 'Correo', valor: TIENDA.correo, href: `mailto:${TIENDA.correo}` },
    { icono: 'ubicacion', titulo: 'Tienda', valor: TIENDA.direccion },
    { icono: 'reloj', titulo: 'Horario', valor: TIENDA.horario },
];

const PREGUNTAS = [
    { pregunta: '¿Cuánto demora mi pedido?', respuesta: 'En Lima entregamos el mismo día si compras antes de la 1 p. m. A provincias, entre 48 y 72 horas hábiles.' },
    { pregunta: '¿Puedo cambiar un juguete?', respuesta: 'Sí, tienes 7 días para cambiarlo si llega con fallas de fábrica. Debe estar con su empaque original.' },
    { pregunta: '¿Emiten factura?', respuesta: 'Sí. Al pagar, escríbenos tu RUC por WhatsApp y te enviamos la factura electrónica.' },
    { pregunta: '¿Los juguetes son seguros para niños?', respuesta: 'Todos son libres de BPA y están indicados para niños de 3 años a más.' },
];

export default function Contacto() {
    const [enviado, setEnviado] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');

    const onSubmit = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEnviando(true);
        setError('');
        try {
            await enviarContacto(Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>);
            setEnviado(true);
        } catch {
            setError('No pudimos enviar tu mensaje. Escríbenos por WhatsApp mientras tanto.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <main className={`${ANCHO_SECCION} flex-1`}>
            <EncabezadoPagina
                titulo="Contacto y ayuda"
                descripcion="¿Dudas con tu pedido o buscas un juguete en especial? Te respondemos en menos de 2 horas en horario de atención."
                migas={[{ texto: 'Inicio', a: '/' }, { texto: 'Contacto' }]}
            />

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px]">
                {CANALES.map((canal) => {
                    const contenido = (
                        <>
                            <span className="grid place-items-center size-[42px] shrink-0 rounded-[12px] bg-sky-50 text-sky-700">
                                <Icono nombre={canal.icono} className="size-[20px]" />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">{canal.titulo}</span>
                                <span className="block text-[14px] font-semibold [overflow-wrap:anywhere]">{canal.valor}</span>
                            </span>
                        </>
                    );
                    const clase = 'flex items-center gap-[12px] h-full bg-white/55 backdrop-blur-md rounded-[12.5px] p-[16px] ring-1 ring-white/80 shadow-[0_8px_30px_rgba(15,23,42,.08)] transition-shadow';
                    return (
                        <li key={canal.titulo}>
                            {canal.href
                                ? <a href={canal.href} target="_blank" rel="noreferrer" className={`${clase} hover:shadow-[0_14px_40px_rgba(15,23,42,.18)]`}>{contenido}</a>
                                : <div className={clase}>{contenido}</div>}
                        </li>
                    );
                })}
            </ul>

            <div className="mt-[20px] grid gap-[20px] lg:grid-cols-2 items-start">
                <section className={TARJETA} aria-labelledby="titulo-mensaje">
                    <h2 id="titulo-mensaje" className="text-[18px] font-bold">Escríbenos</h2>
                    {enviado ? (
                        <div role="status" className="mt-[16px] flex flex-col items-center gap-[8px] py-[30px] text-center">
                            <span className="grid place-items-center size-[64px] rounded-full bg-emerald-100 text-emerald-700">
                                <Icono nombre="check" className="size-[32px]" grosor={2.5} />
                            </span>
                            <p className="text-[16px] font-semibold">¡Mensaje enviado!</p>
                            <p className="text-[14px] text-slate-500">Te responderemos al correo que nos dejaste.</p>
                            <button type="button" onClick={() => setEnviado(false)} className="mt-[6px] text-[13px] font-semibold text-sky-700 hover:underline">Enviar otro mensaje</button>
                        </div>
                    ) : (
                        <form onSubmit={onSubmit} className="mt-[16px] flex flex-col gap-[14px]">
                            <div className="grid sm:grid-cols-2 gap-[14px]">
                                <label><span className={ETIQUETA_CAMPO}>Nombre</span><input name="nombre" required autoComplete="name" className={INPUT} placeholder="Ana Torres" /></label>
                                <label><span className={ETIQUETA_CAMPO}>Correo</span><input type="email" name="correo" required autoComplete="email" className={INPUT} placeholder="tucorreo@ejemplo.com" /></label>
                            </div>
                            <label>
                                <span className={ETIQUETA_CAMPO}>Asunto</span>
                                <select name="asunto" className={INPUT} defaultValue="Consulta de producto">
                                    <option>Consulta de producto</option>
                                    <option>Estado de mi pedido</option>
                                    <option>Compras por volumen</option>
                                    <option>Otro</option>
                                </select>
                            </label>
                            <label><span className={ETIQUETA_CAMPO}>Mensaje</span><textarea name="mensaje" required rows={5} minLength={10} className={`${INPUT} resize-y`} placeholder="¿En qué te ayudamos?" /></label>
                            {error && <p role="alert" className="text-[13px] font-medium text-red-600">{error}</p>}
                            <div className="pt-[4px]">
                                <button type="submit" disabled={enviando} className={`${BOTON_PRINCIPAL} w-full sm:w-auto`}>
                                    <Icono nombre="enviar" className="size-[16px]" /> {enviando ? 'Enviando…' : 'Enviar mensaje'}
                                </button>
                            </div>
                        </form>
                    )}
                </section>

                <section className={TARJETA} aria-labelledby="titulo-preguntas">
                    <h2 id="titulo-preguntas" className="text-[18px] font-bold">Preguntas frecuentes</h2>
                    <div className="mt-[10px] divide-y divide-slate-100">
                        {PREGUNTAS.map((item) => (
                            <details key={item.pregunta} className="group py-[12px]">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-[10px] text-[14px] font-semibold [&::-webkit-details-marker]:hidden">
                                    {item.pregunta}
                                    <Icono nombre="abajo" className="size-[18px] shrink-0 transition-transform duration-300 group-open:rotate-180" />
                                </summary>
                                <p className="mt-[8px] text-[14px] text-slate-600">{item.respuesta}</p>
                            </details>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}

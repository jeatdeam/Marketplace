import { Link } from 'react-router-dom';

import Icono, { type NombreIcono } from './Icono';
import { Logo } from './Header';
import { BOTON_PRINCIPAL, BOTON_SECUNDARIO, VIDRIO } from './ui';
import { CATEGORIAS, REDES, TIENDA } from '../datos/tienda';

export const MEDIOS_PAGO = [
    { nombre: 'Yape', src: '/img/yape.png' },
    { nombre: 'Plin', src: '/img/plin.webp' },
    { nombre: 'Visa', src: '/img/visa.jpg' },
    { nombre: 'Mastercard', src: '/img/mastercard.jpg' },
    { nombre: 'American Express', src: '/img/americanExpress.png' },
];

const TITULO_COLUMNA = 'text-[12px] font-semibold uppercase tracking-[.14em] text-slate-900 mb-[14px]';

export function MediosPago({ className = '' } : { className?: string }) {
    return (
        <ul className={`flex flex-wrap gap-[8px] ${className}`} aria-label="Medios de pago">
            {MEDIOS_PAGO.map((medio) => (
                <li key={medio.nombre} className="grid place-items-center w-[64px] h-[40px] rounded-[8px] bg-white ring-1 ring-black/10 p-[5px]">
                    <img src={medio.src} alt={medio.nombre} className="max-h-full max-w-full object-contain" loading="lazy" />
                </li>
            ))}
        </ul>
    );
}

function EnlaceFooter({ a, children, icono } : { a : string; children : string; icono?: NombreIcono }) {
    return (
        <li>
            <Link to={a} className="group/enlace inline-flex items-center gap-[8px] py-[4px] text-[14px] text-slate-700 hover:text-slate-900">
                {icono && <Icono nombre={icono} className="size-[16px] text-slate-400 transition-colors group-hover/enlace:text-sky-700" />}
                <span className="transition-transform duration-200 group-hover/enlace:translate-x-[3px]">{children}</span>
            </Link>
        </li>
    );
}

function DatoContacto({ icono, children, href } : { icono : NombreIcono; children : string; href?: string }) {
    const contenido = (
        <>
            <span className="grid place-items-center size-[32px] shrink-0 rounded-[8px] bg-white/60 ring-1 ring-white text-sky-700">
                <Icono nombre={icono} className="size-[16px]" />
            </span>
            <span className="text-[14px] text-slate-700 [overflow-wrap:anywhere]">{children}</span>
        </>
    );
    return (
        <li>
            {href
                ? <a href={href} className="flex items-center gap-[10px] hover:text-slate-900">{contenido}</a>
                : <span className="flex items-center gap-[10px]">{contenido}</span>}
        </li>
    );
}

export default function Footer() {
    return (
        <footer className="relative mt-[40px] sm:mt-[56px] overflow-hidden bg-gradient-to-b from-[#d6ecf8] to-[#b9dff3]">
            {/* brillo blanco difuminado arriba */}
            <div className="pointer-events-none absolute -top-[200px] left-1/2 -translate-x-1/2 w-[70%] h-[300px] rounded-full bg-white blur-[120px]" aria-hidden="true" />

            {/* 90% de la ventana y 80% de 800 a 1023px (tab), como el cuerpo en ese rango */}
            <div className="relative w-[90%] tab:w-[80%] mx-auto pt-[40px] pb-[24px]">
                {/* llamado a la accion */}
                <section className={`${VIDRIO} rounded-[20px] p-[22px] sm:p-[30px] flex flex-col md:flex-row md:items-center gap-[18px]`}>
                    <div className="flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[.15em] text-sky-700">Ventas corporativas</p>
                        <h2 className="mt-[4px] text-[20px] sm:text-[24px] font-bold leading-tight">¿Regalos para un colegio, evento o empresa?</h2>
                        <p className="mt-[6px] text-[14px] text-slate-600">Precios por volumen desde 12 unidades, envoltura incluida y factura electrónica.</p>
                    </div>
                    <div className="flex flex-wrap gap-[10px]">
                        <a
                            href={`https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent('Hola JD Store, quiero cotizar una compra por volumen')}`}
                            target="_blank"
                            rel="noreferrer"
                            className={BOTON_PRINCIPAL}
                        >
                            <Icono nombre="whatsapp" className="size-[18px]" /> Cotizar por WhatsApp
                        </a>
                        <Link to="/productos" className={`${BOTON_SECUNDARIO} group/ver`}>
                            Ver catálogo <Icono nombre="flechaDerecha" className="size-[16px] transition-transform group-hover/ver:translate-x-[4px]" />
                        </Link>
                    </div>
                </section>

                <div className="mt-[40px] grid gap-[32px] sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                    <div>
                        <Logo claro={false} />
                        <p className="mt-[14px] max-w-[320px] text-[14px] text-slate-600">
                            {TIENDA.lema}. Juguetes seguros, revisados uno por uno y enviados a todo el Perú.
                        </p>
                        <MediosPago className="mt-[16px]" />
                    </div>
                    <div>
                        <h3 className={TITULO_COLUMNA}>Contáctanos</h3>
                        <ul className="flex flex-col gap-[10px]">
                            <DatoContacto icono="whatsapp" href={`https://wa.me/${TIENDA.whatsapp}`}>{TIENDA.telefono}</DatoContacto>
                            <DatoContacto icono="correo" href={`mailto:${TIENDA.correo}`}>{TIENDA.correo}</DatoContacto>
                            <DatoContacto icono="ubicacion">{TIENDA.direccion}</DatoContacto>
                            <DatoContacto icono="reloj">{TIENDA.horario}</DatoContacto>
                        </ul>
                    </div>
                    <div>
                        <h3 className={TITULO_COLUMNA}>Tienda</h3>
                        <ul>
                            <EnlaceFooter a="/productos" icono="paquete">Todos los productos</EnlaceFooter>
                            <EnlaceFooter a="/promociones" icono="etiqueta">Ofertas</EnlaceFooter>
                            {CATEGORIAS.slice(0, 4).map((categoria) => (
                                <EnlaceFooter key={categoria.slug} a={`/${categoria.slug}`} icono="brillo">{categoria.nombre}</EnlaceFooter>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className={TITULO_COLUMNA}>Servicio al cliente</h3>
                        <ul>
                            <EnlaceFooter a="/quienes-somos" icono="corazon">Quiénes somos</EnlaceFooter>
                            <EnlaceFooter a="/envios" icono="camion">Envíos y entregas</EnlaceFooter>
                            <EnlaceFooter a="/contacto" icono="telefono">Contacto</EnlaceFooter>
                            <EnlaceFooter a="/terminos" icono="info">Términos y condiciones</EnlaceFooter>
                            <EnlaceFooter a="/privacidad" icono="candado">Privacidad</EnlaceFooter>
                        </ul>
                        {/* imagen oficial del libro de reclamaciones (ley 29571): debe verse en el pie de pagina */}
                        <Link
                            to="/libro-de-reclamaciones"
                            aria-label="Libro de reclamaciones"
                            className="mt-[14px] inline-block rounded-[12px] bg-white p-[8px] ring-1 ring-black/10 shadow-[0_4px_0_rgba(15,23,42,.07)] transition-transform hover:-translate-y-[2px]"
                        >
                            <img src="/img/libro-de-reclamaciones.png" alt="Libro de reclamaciones" className="w-[150px] h-auto" loading="lazy" />
                        </Link>
                    </div>
                </div>

                {/* redes entre dos lineas que se desvanecen; el boton de whatsapp no baja mas alla de esta fila */}
                <div id="limite-whatsapp" className="mt-[36px] flex items-center gap-[16px]">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent to-sky-400/70" aria-hidden="true" />
                    <ul className="flex gap-[10px]">
                        {REDES.map((red) => (
                            <li key={red.nombre}>
                                <a
                                    href={red.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={red.nombre}
                                    className="grid place-items-center size-[40px] rounded-full bg-white/70 ring-1 ring-white text-slate-900 transition-all hover:-translate-y-[2px] hover:bg-slate-900 hover:text-white"
                                >
                                    <Icono nombre={red.icono} className="size-[18px]" />
                                </a>
                            </li>
                        ))}
                    </ul>
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent to-sky-400/70" aria-hidden="true" />
                </div>

                <div className="mt-[24px] flex flex-col md:flex-row md:items-center justify-between gap-[14px] text-[13px] text-slate-600">
                    <p>© {new Date().getFullYear()} {TIENDA.razonSocial} · RUC {TIENDA.ruc}</p>
                    <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[10px]">
                        <Link to="/terminos" className="hover:text-slate-900">Términos</Link>
                        <Link to="/privacidad" className="hover:text-slate-900">Privacidad</Link>
                        <Link to="/libro-de-reclamaciones" className="hover:text-slate-900">Libro de reclamaciones</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

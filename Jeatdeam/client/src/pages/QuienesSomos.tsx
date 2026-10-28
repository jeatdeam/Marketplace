import { Link } from 'react-router-dom';

import Icono, { type NombreIcono } from '../components/Icono';
import { ANCHO_SECCION, BOTON_PRINCIPAL, BOTON_SECUNDARIO, MARINO_HIELO, TARJETA, EncabezadoPagina } from '../components/ui';
import { TIENDA } from '../datos/tienda';

const VALORES : { icono : NombreIcono; titulo : string; texto : string }[] = [
    { icono: 'escudo', titulo: 'Seguridad primero', texto: 'Solo vendemos juguetes con materiales libres de BPA y piezas pensadas para su edad.' },
    { icono: 'corazon', titulo: 'Hechos para jugar', texto: 'Probamos cada modelo: si no aguanta una semana de juego, no entra al catálogo.' },
    { icono: 'camion', titulo: 'Cerca de ti', texto: 'Enviamos desde Lima a todo el Perú y te avisamos en cada paso.' },
];

export default function QuienesSomos() {
    return (
        <main className={`${ANCHO_SECCION} flex-1`}>
            <EncabezadoPagina titulo="Quiénes somos" migas={[{ texto: 'Inicio', a: '/' }, { texto: 'Quiénes somos' }]} />

            <section className={`relative overflow-hidden rounded-[18px] p-[26px] sm:p-[40px] text-white ${MARINO_HIELO}`}>
                <p className="text-[12px] font-semibold uppercase tracking-[.15em] text-[#facc15]">Nuestra historia</p>
                <h2 className="mt-[8px] max-w-[620px] text-[26px] sm:text-[34px] font-extrabold leading-tight">Una tienda pequeña con una caja de juguetes muy grande</h2>
                <p className="mt-[12px] max-w-[560px] text-[15px] text-white/85">
                    {TIENDA.nombre} nació en el Cercado de Lima vendiendo dinosaurios mordelones a los amigos del barrio. Hoy enviamos juguetes, peluches y regalos a todo el país, con la misma idea: que cada caja llegue como si la hubiéramos armado para nuestros sobrinos.
                </p>
                <div className="mt-[20px] flex flex-wrap gap-[10px]">
                    <Link to="/productos" className="inline-flex items-center gap-[6px] rounded-full bg-white px-[16px] py-[10px] text-[14px] font-semibold text-slate-900 transition-transform hover:-translate-y-[2px]">
                        Ver catálogo <Icono nombre="flechaDerecha" className="size-[16px]" />
                    </Link>
                </div>
                <Icono nombre="regalo" className="pointer-events-none absolute -right-[30px] -bottom-[40px] size-[220px] text-white/10" grosor={1.2} />
            </section>

            <ul className="mt-[20px] grid gap-[16px] md:grid-cols-3">
                {VALORES.map((valor) => (
                    <li key={valor.titulo} className={TARJETA}>
                        <span className="grid place-items-center size-[46px] rounded-[12px] bg-[#facc15] text-slate-900">
                            <Icono nombre={valor.icono} className="size-[22px]" />
                        </span>
                        <h3 className="mt-[12px] text-[16px] font-bold">{valor.titulo}</h3>
                        <p className="mt-[4px] text-[14px] text-slate-600">{valor.texto}</p>
                    </li>
                ))}
            </ul>

            <section className={`${TARJETA} mt-[20px] flex flex-col md:flex-row md:items-center gap-[16px]`}>
                <div className="flex-1">
                    <p className="text-[16px] font-bold">¿Quieres visitarnos?</p>
                    <p className="text-[14px] text-slate-600">{TIENDA.direccion} · {TIENDA.horario}</p>
                </div>
                <div className="flex flex-wrap gap-[10px]">
                    <Link to="/contacto" className={BOTON_SECUNDARIO}>Contáctanos</Link>
                    <a href={`https://wa.me/${TIENDA.whatsapp}`} target="_blank" rel="noreferrer" className={BOTON_PRINCIPAL}>
                        <Icono nombre="whatsapp" className="size-[17px]" /> WhatsApp
                    </a>
                </div>
            </section>
        </main>
    );
}

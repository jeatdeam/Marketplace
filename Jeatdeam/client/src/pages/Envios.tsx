import { Link } from 'react-router-dom';

import Icono, { type NombreIcono } from '../components/Icono';
import { ANCHO_SECCION, BOTON_PRINCIPAL, TARJETA, EncabezadoPagina } from '../components/ui';
import { TIENDA } from '../datos/tienda';

const ZONAS = [
    { zona: 'Lima Metropolitana', plazo: 'Mismo día (antes de la 1 p. m.)', costo: 'S/ 12 · gratis desde S/ 300' },
    { zona: 'Callao', plazo: '24 horas', costo: 'S/ 12 · gratis desde S/ 300' },
    { zona: 'Provincias (Shalom / Olva)', plazo: '48 a 72 horas hábiles', costo: 'Pago en destino según courier' },
    { zona: 'Recojo en tienda', plazo: 'Desde 2 horas después de pagar', costo: 'Gratis' },
];

const PASOS : { icono : NombreIcono; titulo : string; texto : string }[] = [
    { icono: 'bolsa', titulo: 'Compras', texto: 'Arma tu carrito y paga con tarjeta, Yape o Plin.' },
    { icono: 'paquete', titulo: 'Empacamos', texto: 'Revisamos cada juguete y lo protegemos con burbupack.' },
    { icono: 'camion', titulo: 'Enviamos', texto: 'Te mandamos el número de seguimiento por WhatsApp.' },
    { icono: 'regalo', titulo: 'Recibes', texto: 'Y si es regalo, lo enviamos con tarjeta y sin precio.' },
];

export default function Envios() {
    return (
        <main className={`${ANCHO_SECCION} flex-1`}>
            <EncabezadoPagina
                titulo="Envíos y entregas"
                descripcion="Llegamos a todo el Perú. Estos son los plazos y costos de referencia."
                migas={[{ texto: 'Inicio', a: '/' }, { texto: 'Envíos' }]}
            />

            <ol className="grid grid-cols-2 lg:grid-cols-4 gap-[12px]">
                {PASOS.map((paso, indice) => (
                    <li key={paso.titulo} className={`${TARJETA} !p-[18px] relative`}>
                        <span className="absolute top-[14px] right-[16px] text-[30px] font-extrabold leading-none text-slate-900/10">{indice + 1}</span>
                        <span className="grid place-items-center size-[44px] rounded-[12px] bg-[#facc15] text-slate-900">
                            <Icono nombre={paso.icono} className="size-[22px]" />
                        </span>
                        <p className="mt-[10px] text-[15px] font-bold">{paso.titulo}</p>
                        <p className="mt-[2px] text-[13px] text-slate-600">{paso.texto}</p>
                    </li>
                ))}
            </ol>

            <section className={`${TARJETA} mt-[20px] !p-0 overflow-hidden`} aria-labelledby="titulo-zonas">
                <h2 id="titulo-zonas" className="px-[25px] pt-[22px] text-[18px] font-bold">Zonas, plazos y costos</h2>
                <div className="overflow-x-auto">
                    <table className="mt-[12px] w-full min-w-[520px] text-left text-[14px]">
                        <thead className="bg-[#f3f9fd] text-[12px] uppercase tracking-[0.08em] text-slate-500">
                            <tr>
                                <th scope="col" className="px-[25px] py-[10px] font-semibold">Zona</th>
                                <th scope="col" className="px-[25px] py-[10px] font-semibold">Plazo</th>
                                <th scope="col" className="px-[25px] py-[10px] font-semibold">Costo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {ZONAS.map((fila) => (
                                <tr key={fila.zona}>
                                    <th scope="row" className="px-[25px] py-[14px] font-semibold">{fila.zona}</th>
                                    <td className="px-[25px] py-[14px] text-slate-600">{fila.plazo}</td>
                                    <td className="px-[25px] py-[14px] text-slate-600">{fila.costo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className={`${TARJETA} mt-[20px] flex flex-col md:flex-row md:items-center gap-[16px]`}>
                <span className="grid place-items-center size-[52px] shrink-0 rounded-full bg-sky-50 text-sky-700">
                    <Icono nombre="tienda" className="size-[26px]" />
                </span>
                <div className="flex-1">
                    <p className="text-[16px] font-bold">Recojo gratis en tienda</p>
                    <p className="text-[14px] text-slate-600">{TIENDA.direccion} · {TIENDA.horario}</p>
                </div>
                <Link to="/productos" className={BOTON_PRINCIPAL}>Empezar a comprar</Link>
            </section>
        </main>
    );
}

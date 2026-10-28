import Icono from './Icono';
import { BOTON_PRINCIPAL, BotonAtras } from './ui';
import { TIENDA, formatoSoles } from '../datos/tienda';
import type { PedidoCreado } from '../api';

export type WalletName = 'yape' | 'plin';

export const WALLETS : Record<WalletName, { nombre : string; color : string; logo : string; qr : string }> = {
    yape: {
        nombre: 'Yape',
        color: '#6A1B9A',
        logo: '/img/yape.png',
        qr: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1745297417/codigoYape_c0wwou.png',
    },
    plin: {
        nombre: 'Plin',
        color: '#00C6FF',
        logo: '/img/plin.webp',
        qr: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1743736943/Imagen_de_WhatsApp_2025-03-25_a_las_20.33.16_73a6986c_frpub0.jpg',
    },
};

interface WalletPanelProps {
    billetera : WalletName;
    total : number;
    pedido : PedidoCreado | null;
    // detalle armado en la pagina: se usa si el servidor no pudo guardar el pedido (queda sin enlace al pdf)
    mensajeRespaldo : string;
    onVolver : () => void;
    onCorregir : () => void;
}

// qr de yape o plin con el monto y el paso para enviar la constancia
export default function WalletPanel({ billetera, total, pedido, mensajeRespaldo, onVolver, onCorregir } : WalletPanelProps) {
    const datos = WALLETS[billetera];
    const mensaje = pedido?.mensaje ?? mensajeRespaldo;

    return (
        <div className="flex flex-col items-center text-center">
            <div className="self-stretch flex flex-wrap items-center justify-between gap-[10px]">
                <BotonAtras onClick={onVolver}>Elegir otro medio</BotonAtras>
                <button type="button" onClick={onCorregir} className="text-[13px] font-semibold text-sky-700 hover:text-sky-900 hover:underline">
                    Corregir mis datos
                </button>
            </div>
            <img src={datos.logo} alt={datos.nombre} className="mt-[8px] h-[34px] object-contain" />
            <p className="mt-[10px] text-[14px] text-slate-600">Escanea el código y paga</p>
            <p className="text-[28px] font-extrabold">{formatoSoles(total)}</p>
            <div className="mt-[10px] rounded-[16px] p-[10px] ring-4" style={{ ['--tw-ring-color' as string]: datos.color }}>
                <img src={datos.qr} alt={`Código QR de ${datos.nombre}`} className="size-[200px] object-contain" />
            </div>
            <ol className="mt-[16px] w-full text-left text-[13px] text-slate-600 flex flex-col gap-[6px]">
                <li className="flex gap-[8px]"><b className="text-slate-900">1.</b> Abre {datos.nombre} y escanea el código.</li>
                <li className="flex gap-[8px]"><b className="text-slate-900">2.</b> Paga el monto exacto a nombre de {TIENDA.razonSocial}</li>
                <li className="flex gap-[8px]"><b className="text-slate-900">3.</b> Envíanos la captura por WhatsApp para confirmar tu pedido.</li>
            </ol>
            <div className="w-full pt-[16px] flex flex-col gap-[10px]">
                {pedido && (
                    <a href={pedido.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-[6px] text-[13px] font-semibold text-sky-700 hover:text-sky-900 hover:underline">
                        <Icono nombre="descargar" className="size-[16px]" /> Ver mi pedido {pedido.codigo.split('-').slice(0, 2).join('-')} (PDF)
                    </a>
                )}
                <a
                    href={`https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent(mensaje)}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`${BOTON_PRINCIPAL} w-full !bg-[#25D366] hover:!bg-[#1fb257]`}
                >
                    <Icono nombre="whatsapp" className="size-[18px]" /> Enviar constancia
                </a>
            </div>
        </div>
    );
}

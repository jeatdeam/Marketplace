import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Icono from './Icono';
import { TIENDA } from '../datos/tienda';

export const ALTO_BARRA = 34;
// velocidad constante: la duracion depende del ancho de la barra y del mensaje
const PX_POR_SEGUNDO = 70;

const MENSAJES = [
    { titulo: `Delivery gratis desde S/ ${TIENDA.envioGratisDesde}`, descripcion: 'Envíos a Lima en el día y a provincias en 48 h' },
    { titulo: 'Paga con Yape, Plin o tarjeta', descripcion: 'Compra segura y comprobante electrónico al instante' },
];

// franja marino con un camion que cruza la pantalla arrastrando el mensaje; se pausa con el cursor
export default function BarraSuperior() {
    const { pathname } = useLocation();
    const barraRef = useRef<HTMLDivElement>(null);
    const grupoRef = useRef<HTMLDivElement>(null);
    const [indice, setIndice] = useState(0);
    const mensaje = MENSAJES[indice];
    // un solo h1 por pagina: en el inicio es este mensaje; en el resto, el titulo de cada pagina
    const Titulo = pathname === '/' ? 'h1' : 'p';

    useLayoutEffect(() => {
        const barra = barraRef.current;
        const grupo = grupoRef.current;
        if (!barra || !grupo) return;
        const medir = () => {
            const anchoBarra = barra.offsetWidth;
            const duracion = (anchoBarra + grupo.offsetWidth) / PX_POR_SEGUNDO;
            grupo.style.setProperty('--duracion-barra', `${duracion}s`);
            grupo.style.setProperty('--ancho-barra', `${anchoBarra}px`);
        };
        medir();
        const observador = new ResizeObserver(medir);
        observador.observe(barra);
        observador.observe(grupo);
        return () => observador.disconnect();
    }, []);

    return (
        <div
            ref={barraRef}
            className="barraSuperior menuOscuro absolute top-0 inset-x-0 z-40 overflow-hidden bg-gradient-to-r from-[#0f172a] to-[#172554] text-white"
            style={{ height: ALTO_BARRA }}
        >
            <div
                ref={grupoRef}
                className="barraMovil absolute top-0 left-0 h-full flex items-center gap-[10px] whitespace-nowrap px-[12px] text-[12px] sm:text-[13px]"
                // un mensaje por pasada
                onAnimationIteration={() => setIndice((valor) => (valor + 1) % MENSAJES.length)}
            >
                <Icono nombre="camion" className="size-[18px] text-[#facc15] -scale-x-100" />
                <Titulo className="font-semibold text-[#facc15]">{mensaje.titulo}</Titulo>
                <span className="text-white/85">· {mensaje.descripcion}</span>
            </div>
        </div>
    );
}

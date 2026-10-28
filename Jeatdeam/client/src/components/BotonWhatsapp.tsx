import Icono from './Icono';
import { TIENDA } from '../datos/tienda';

// boton flotante con ondas detras; 48px en celular y 60px desde sm
export default function BotonWhatsapp() {
    return (
        <a
            href={`https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent('Hola JD Store, quiero hacer una consulta')}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Escríbenos por WhatsApp"
            className="ondaWhatsapp fixed z-40 right-[16px] bottom-[16px] sm:right-[24px] sm:bottom-[24px] isolate grid place-items-center size-[48px] sm:size-[60px] rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,.45)] transition-transform hover:-translate-y-[3px] active:scale-90"
        >
            <Icono nombre="whatsapp" className="size-[24px] sm:size-[30px]" />
        </a>
    );
}

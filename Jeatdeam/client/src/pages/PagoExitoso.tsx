import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import Icono from '../components/Icono';
import { ANCHO_SECCION, BOTON_PRINCIPAL, BOTON_SECUNDARIO, TARJETA } from '../components/ui';
import { useStore } from '../context/StoreContext';
import { TIENDA } from '../datos/tienda';

// stripe vuelve aqui despues de un pago correcto (success_url)
export default function PagoExitoso() {
    const { clearCarrito } = useStore();

    useEffect(() => {
        clearCarrito();
    }, [clearCarrito]);

    return (
        <main className={`${ANCHO_SECCION} flex-1 pt-[150px]`}>
            <section className={`${TARJETA} flex flex-col items-center text-center py-[40px]`} role="status">
                <span className="grid place-items-center size-[80px] rounded-full bg-emerald-100 text-emerald-700">
                    <Icono nombre="check" className="size-[40px]" grosor={2.5} />
                </span>
                <h1 className="mt-[16px] text-[26px] font-bold">¡Gracias por tu compra!</h1>
                <p className="mt-[6px] max-w-[440px] text-[14px] text-slate-600">
                    Recibimos tu pago. Te enviamos el comprobante por correo y te escribiremos por WhatsApp ({TIENDA.telefono}) con el seguimiento de tu pedido.
                </p>
                <div className="mt-[22px] flex flex-wrap justify-center gap-[10px]">
                    <Link to="/productos" className={BOTON_PRINCIPAL}>Seguir comprando</Link>
                    <Link to="/contacto" className={BOTON_SECUNDARIO}>¿Necesitas ayuda?</Link>
                </div>
            </section>
        </main>
    );
}

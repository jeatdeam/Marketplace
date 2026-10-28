import { ANCHO_SECCION, TARJETA, EncabezadoPagina } from '../components/ui';
import { TIENDA } from '../datos/tienda';

// textos de ejemplo para el prototipo: deben revisarse con un abogado antes de publicar
const TEXTOS = {
    terminos: {
        titulo: 'Términos y condiciones',
        secciones: [
            { titulo: 'Sobre nosotros', texto: `Este sitio es operado por ${TIENDA.razonSocial} (RUC ${TIENDA.ruc}), con domicilio en ${TIENDA.direccion}.` },
            { titulo: 'Precios y pagos', texto: 'Los precios están expresados en soles e incluyen IGV. Aceptamos tarjetas de crédito y débito, Yape y Plin. El pedido se confirma cuando el pago es validado.' },
            { titulo: 'Envíos', texto: 'Los plazos de entrega son referenciales y empiezan a contar desde la confirmación del pago. Más detalles en la página de envíos.' },
            { titulo: 'Cambios y devoluciones', texto: 'Puedes solicitar el cambio de un producto con fallas de fábrica dentro de los 7 días de recibido, con su empaque original.' },
            { titulo: 'Libro de reclamaciones', texto: 'Conforme a la Ley 29571, ponemos a tu disposición un Libro de Reclamaciones virtual. Respondemos en un plazo máximo de 15 días hábiles.' },
        ],
    },
    privacidad: {
        titulo: 'Política de privacidad',
        secciones: [
            { titulo: 'Qué datos guardamos', texto: 'Tu nombre, correo, celular y dirección de entrega, solo para procesar y entregar tu pedido.' },
            { titulo: 'Pagos', texto: 'Los datos de tu tarjeta los procesa la pasarela de pago; nosotros nunca los vemos ni los guardamos.' },
            { titulo: 'Con quién los compartimos', texto: 'Solo con el courier que entrega tu pedido. No vendemos ni cedemos tus datos.' },
            { titulo: 'Tus derechos', texto: `Puedes pedir acceso, corrección o eliminación de tus datos (Ley 29733) escribiendo a ${TIENDA.correo}.` },
        ],
    },
};

export default function PaginaLegal({ tipo } : { tipo : keyof typeof TEXTOS }) {
    const { titulo, secciones } = TEXTOS[tipo];
    return (
        <main className={`${ANCHO_SECCION} flex-1`}>
            <EncabezadoPagina titulo={titulo} descripcion="Última actualización: octubre de 2026" migas={[{ texto: 'Inicio', a: '/' }, { texto: titulo }]} />
            <article className={`${TARJETA} max-w-[820px]`}>
                {secciones.map((seccion, indice) => (
                    <section key={seccion.titulo} className={indice ? 'mt-[22px]' : ''}>
                        <h2 className="text-[16px] font-bold">{indice + 1}. {seccion.titulo}</h2>
                        <p className="mt-[6px] text-[14px] leading-relaxed text-slate-600">{seccion.texto}</p>
                    </section>
                ))}
            </article>
        </main>
    );
}

import { v2 as cloudinary } from 'cloudinary';

// imagenes del dashboard: con las 3 variables se suben a Cloudinary (sobreviven a los reinicios de Render);
// sin ellas se sigue guardando en public/uploads como en local
const CARPETA = process.env.CLOUDINARY_CARPETA ?? 'jeatdeam';

export const cloudinaryActivo = () =>
    Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

let configurado = false;

function configurar() {
    if (configurado) return;
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
    configurado = true;
}

// recibe la misma data url (base64) que manda el dashboard y devuelve la url publica.
// f_auto,q_auto: Cloudinary entrega webp/avif y la calidad justa segun el navegador
export async function subirACloudinary(dataUrl: string): Promise<string> {
    configurar();
    const subida = await cloudinary.uploader.upload(dataUrl, { folder: CARPETA, resource_type: 'image' });
    return subida.secure_url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
}

// pdf de un pedido: se sube como archivo "raw" (tal cual, sin transformaciones) y su url publica va en el
// mensaje de whatsapp y en el correo. El nombre lleva el token del pedido, asi la url no se puede adivinar
export async function subirPdfACloudinary(pdf: Buffer, nombre: string): Promise<string> {
    configurar();
    const subida = await cloudinary.uploader.upload(`data:application/pdf;base64,${pdf.toString('base64')}`, {
        folder: `${CARPETA}/pedidos`,
        public_id: `${nombre}.pdf`,
        resource_type: 'raw',
        overwrite: false,
    });
    return subida.secure_url;
}

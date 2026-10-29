import crypto from 'crypto';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import type { Request, Response } from 'express';

import { correoSinConfigurar, lineasCarrito, transporter, ultimoCliente } from './taskController.ts';
import { insertarPedido, leerPedido, supabaseActivo } from '../integraciones/supabase/supabase.ts';
import { cloudinaryActivo, subirPdfACloudinary } from '../integraciones/cloudinary/cloudinary.ts';
import { TIENDA } from '../shared/tienda.ts';
import type { DatosCliente, DatosClienteComplete } from '../shared/types.ts';

// pedido = foto del carrito y de los datos de envio al elegir el medio de pago. El mismo detalle de compra
// va en el mensaje de whatsapp, en el correo al cliente (con el pdf adjunto) y en el pdf. El pdf vive en una
// url publica (/pedido/KM-000013-<token>.pdf); se arma cada vez que se abre, asi no hay archivos que se
// pierdan cuando Render reinicia

const METODOS = { yape: 'Yape', plin: 'Plin' } as const;
type Metodo = keyof typeof METODOS;
type Entrega = 'delivery' | 'tienda';

interface Pedido {
    fecha: string;
    metodo: Metodo;
    entrega: Entrega;
    cliente: DatosCliente;
    lineas: ReturnType<typeof lineasCarrito>;
    // en centimos, como el resto de la tienda
    subtotal: number;
    envio: number;
    total: number;
}

// version chica del logo (240px): con el original de 1026px el pdf pesaba ~440 KB
const LOGO = fileURLToPath(new URL('../../public/img/k-moon-pdf.png', import.meta.url));
// mismos nombres que muestra el formulario (ShippingForm.tsx)
const COURIERS: Record<string, string> = { shalom: 'Shalom', olva: 'Olva Courier', dinocourier: 'Dinocourier', otros: 'Otro' };
const ARCHIVO_PDF = /^KM-(\d{1,9})-([a-f0-9]{16})\.pdf$/;

// sin Supabase los pedidos quedan en memoria (se pierden al reiniciar)
const enMemoria: { numero: number; token: string; pedido: Pedido }[] = [];

const codigoPedido = (numero: number, token: string) => `KM-${String(numero).padStart(6, '0')}-${token}`;
// lo que se le muestra a la gente: KM-000013 (el token solo va en la url)
const codigoCorto = (codigo: string) => codigo.split('-').slice(0, 2).join('-');

const soles = (centimos: number) =>
    `S/ ${(centimos / 100).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// mismo dominio desde el que se compro: localhost en desarrollo, onrender.com en produccion
const origen = (req: Pick<Request, 'get' | 'protocol'>) => req.get('origin') ?? `${req.protocol}://${req.get('host')}`;

const crearPedido = async (req: Request<unknown, unknown, { metodo?: string; entrega?: string }>, res: Response) => {
    const metodo = req.body?.metodo as Metodo;
    if (!(metodo in METODOS)) return res.status(400).json({ error: 'Medio de pago desconocido' });
    const entrega: Entrega = req.body?.entrega === 'tienda' ? 'tienda' : 'delivery';

    const lineas = lineasCarrito();
    if (!lineas.length) return res.status(400).json({ error: 'El carrito está vacío' });
    const cliente = ultimoCliente();
    if (!cliente) return res.status(400).json({ error: 'Faltan tus datos de envío' });

    // mismo calculo que el resumen del carrito (Compra.tsx)
    const subtotal = lineas.reduce((suma, linea) => suma + linea.unitario * linea.cantidad, 0);
    const envio = entrega === 'tienda' || subtotal >= TIENDA.envioGratisDesde * 100 ? 0 : TIENDA.costoEnvio * 100;
    const pedido: Pedido = { fecha: new Date().toISOString(), metodo, entrega, cliente, lineas, subtotal, envio, total: subtotal + envio };

    const token = crypto.randomBytes(8).toString('hex');
    let numero: number;
    if (supabaseActivo()) {
        try {
            numero = await insertarPedido(token, pedido);
        } catch (error) {
            console.error((error as Error).message);
            return res.status(502).json({ error: 'No se pudo registrar el pedido' });
        }
    } else {
        numero = enMemoria.length + 1;
        enMemoria.push({ numero, token, pedido });
    }

    const codigo = codigoPedido(numero, token);
    const url = await urlPdf(pedido, codigo, req);
    res.status(201).json({ codigo, url, mensaje: mensajeWhatsapp(pedido, codigo, url) });

    // el correo no frena la compra: si gmail falla, solo queda en el log
    enviarCorreo(pedido, codigo, url).catch((error) => console.error('No se pudo enviar el pedido por correo:', (error as Error).message));
};

// con Cloudinary el pdf se sube y su url funciona desde cualquier celular (tambien probando en localhost);
// sin Cloudinary, o si la subida falla, se usa la ruta propia /pedido/...pdf del servidor
async function urlPdf(pedido: Pedido, codigo: string, req: Pick<Request, 'get' | 'protocol'>) {
    const propia = `${origen(req)}/pedido/${codigo}.pdf`;
    if (!cloudinaryActivo()) return propia;
    try {
        const url = await subirPdfACloudinary(await pdfBuffer(pedido, codigo), codigo);
        // las cuentas gratis de Cloudinary suben el pdf pero no lo entregan (401) hasta activar la opcion:
        // se revisa antes de mandar al cliente un enlace roto
        const prueba = await fetch(url, { method: 'HEAD' });
        if (prueba.ok) return url;
        console.warn(`Cloudinary no entrega el pdf (${prueba.status}). Activa en Cloudinary: Settings > Security > "Allow delivery of PDF and ZIP files". Mientras tanto se usa la url del servidor.`);
        return propia;
    } catch (error) {
        console.error('No se pudo subir el pdf a Cloudinary, se usa la url del servidor:', (error as Error).message);
        return propia;
    }
}

// ---------- detalle de compra (whatsapp, correo y pdf) ----------

// datos del cliente y de la entrega, en el orden en que se muestran
function datosEntrega(pedido: Pedido): [string, string][] {
    const cliente = pedido.cliente;
    const completo = 'direccion' in cliente ? (cliente as DatosClienteComplete) : null;
    const celular = completo ? completo.numOne : 'tel' in cliente ? cliente.tel : '';
    const alterno = completo ? completo.numTwo : 'telSec' in cliente ? cliente.telSec : '';
    const filas: [string, string | undefined][] = [
        ['Nombre', cliente.nombre],
        ['Correo', cliente.correo],
        ['Celular', [celular, alterno].filter(Boolean).join(' / ')],
    ];
    if (pedido.entrega === 'tienda' || !completo) {
        filas.push(['Entrega', `Recojo en tienda: ${TIENDA.direccion} (${TIENDA.horario})`]);
    } else {
        filas.push(
            ['Entrega', 'Delivery'],
            ['Dirección', `${completo.direccion}, ${completo.distrito}, ${completo.departamento}`],
            ['Referencia', completo.infoExtra],
            ['Courier', completo.eleccionEmpresa && [COURIERS[completo.eleccionEmpresa] ?? completo.eleccionEmpresa, completo.infoCourier].filter(Boolean).join(': ')],
        );
    }
    return filas.filter((fila): fila is [string, string] => Boolean(fila[1]));
}

const filaEnvio = (pedido: Pedido): [string, string] =>
    [pedido.entrega === 'tienda' ? 'Recojo en tienda' : 'Delivery', pedido.envio ? soles(pedido.envio) : 'Gratis'];

// whatsapp entiende *negritas*; el cliente solo tiene que adjuntar la captura del pago y enviar
function mensajeWhatsapp(pedido: Pedido, codigo: string, url: string) {
    const [envioTexto, envioValor] = filaEnvio(pedido);
    return [
        `Hola ${TIENDA.nombre}, ya pagué ${soles(pedido.total)} con ${METODOS[pedido.metodo]}. Adjunto la constancia.`,
        '',
        `*Pedido ${codigoCorto(codigo)}*`,
        ...pedido.lineas.map((l) => `• ${l.cantidad} x ${l.nombre} (${l.marca}): ${soles(l.unitario * l.cantidad)}`),
        `Subtotal: ${soles(pedido.subtotal)}`,
        `${envioTexto}: ${envioValor}`,
        `*Total: ${soles(pedido.total)}*`,
        '',
        ...datosEntrega(pedido).map(([etiqueta, valor]) => `*${etiqueta}:* ${valor}`),
        '',
        `Detalle en PDF: ${url}`,
    ].join('\n');
}

const ENTIDADES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapar = (texto: string) => texto.replace(/[&<>"']/g, (c) => ENTIDADES[c]);

// correo al cliente con copia oculta a la tienda; el pdf va adjunto y tambien enlazado
async function enviarCorreo(pedido: Pedido, codigo: string, url: string) {
    if (correoSinConfigurar || !process.env.EMAIL_PASS) return;
    const corto = codigoCorto(codigo);
    const [envioTexto, envioValor] = filaEnvio(pedido);
    const celda = 'padding:8px 0;border-bottom:1px solid #e2e8f0';
    const estado = `Lo confirmamos apenas verifiquemos tu pago con ${METODOS[pedido.metodo]} por WhatsApp (${TIENDA.telefono}).`;

    const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#0f172a">
  <h1 style="color:#1e3a5f;margin:0 0 4px">${escapar(TIENDA.nombre)}</h1>
  <p style="margin:0 0 20px;color:#64748b;font-size:13px">${escapar(TIENDA.razonSocial)} · RUC ${TIENDA.ruc}</p>
  <p>Hola <b>${escapar(pedido.cliente.nombre)}</b>, recibimos tu pedido <b>${corto}</b>.</p>
  <p style="color:#475569">${escapar(estado)}</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">
    <tr><th align="left" style="${celda}">Producto</th><th style="${celda}">Cant.</th><th align="right" style="${celda}">Importe</th></tr>
    ${pedido.lineas.map((l) => `<tr><td style="${celda}">${escapar(l.nombre)} · ${escapar(l.marca)}</td><td align="center" style="${celda}">${l.cantidad}</td><td align="right" style="${celda}">${soles(l.unitario * l.cantidad)}</td></tr>`).join('')}
    <tr><td colspan="2" align="right" style="padding:8px 0">Subtotal</td><td align="right">${soles(pedido.subtotal)}</td></tr>
    <tr><td colspan="2" align="right" style="padding:8px 0">${envioTexto}</td><td align="right">${envioValor}</td></tr>
    <tr><td colspan="2" align="right" style="padding:8px 0;font-size:16px"><b>Total</b></td><td align="right" style="font-size:16px"><b>${soles(pedido.total)}</b></td></tr>
  </table>
  <p style="font-size:14px;line-height:1.6">${datosEntrega(pedido).map(([etiqueta, valor]) => `<b>${etiqueta}:</b> ${escapar(valor)}`).join('<br>')}</p>
  <p style="margin:24px 0"><a href="${escapar(url)}" style="background:#0f172a;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold">Ver pedido en PDF</a></p>
  <p style="color:#64748b;font-size:12px">Adjuntamos el PDF de tu pedido. No es un comprobante de pago electrónico (boleta o factura).</p>
</div>`;

    await transporter.sendMail({
        from: `"${TIENDA.nombre}" <${process.env.EMAIL_USER}>`,
        to: pedido.cliente.correo,
        bcc: process.env.EMAIL_USER,
        subject: `Tu pedido ${corto} en ${TIENDA.nombre} · ${soles(pedido.total)}`,
        html,
        attachments: [{ filename: `Pedido-${corto}.pdf`, content: await pdfBuffer(pedido, codigo), contentType: 'application/pdf' }],
    });
    console.log(`Pedido ${corto} enviado por correo a ${pedido.cliente.correo}`);
}

const verPdf = async (req: Request<{ archivo: string }>, res: Response) => {
    const coincide = ARCHIVO_PDF.exec(req.params.archivo);
    if (!coincide) return res.status(404).send('Pedido no encontrado');
    const numero = Number(coincide[1]);
    const token = coincide[2];

    let pedido: Pedido | null | undefined;
    try {
        pedido = supabaseActivo() ? await leerPedido<Pedido>(numero, token) : enMemoria.find((p) => p.numero === numero && p.token === token)?.pedido;
    } catch (error) {
        console.error((error as Error).message);
        return res.status(502).send('No se pudo leer el pedido');
    }
    if (!pedido) return res.status(404).send('Pedido no encontrado');

    const codigo = codigoPedido(numero, token);
    res.setHeader('Content-Type', 'application/pdf');
    // inline: se abre en el navegador o en el visor de whatsapp en vez de descargarse directo
    res.setHeader('Content-Disposition', `inline; filename="${codigo}.pdf"`);
    dibujarPdf(pedido, codigo).pipe(res);
};

// ---------- pdf ----------

const MARINO = '#1e3a5f';
const GRIS = '#64748b';

// el pdf como Buffer, para adjuntarlo al correo
const pdfBuffer = (pedido: Pedido, codigo: string) => new Promise<Buffer>((resolver, rechazar) => {
    const partes: Buffer[] = [];
    dibujarPdf(pedido, codigo)
        .on('data', (parte: Buffer) => partes.push(parte))
        .on('end', () => resolver(Buffer.concat(partes)))
        .on('error', rechazar);
});

// devuelve el documento ya cerrado: es un stream que se manda a la respuesta o se junta en un Buffer
function dibujarPdf(pedido: Pedido, codigo: string) {
    const doc = new PDFDocument({ size: 'A4', margin: 50, info: { Title: `Pedido ${codigo}`, Author: TIENDA.nombre } });
    const izquierda = doc.page.margins.left;
    const ancho = doc.page.width - izquierda - doc.page.margins.right;

    // encabezado: logo y datos de la tienda
    doc.image(LOGO, izquierda, 40, { width: 80 });
    doc.fillColor(MARINO).font('Helvetica-Bold').fontSize(22).text(TIENDA.nombre, izquierda + 95, 55);
    doc.fillColor(GRIS).font('Helvetica').fontSize(9)
        .text(`${TIENDA.razonSocial} · RUC ${TIENDA.ruc}`)
        .text(TIENDA.direccion)
        .text(`WhatsApp ${TIENDA.telefono} · ${TIENDA.correo}`);

    // titulo y codigo
    const fecha = new Date(pedido.fecha).toLocaleString('es-PE', { timeZone: 'America/Lima', dateStyle: 'long', timeStyle: 'short' });
    doc.moveDown(2.2);
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(16).text('Constancia de pedido', izquierda);
    doc.font('Helvetica').fontSize(10).fillColor(GRIS).text(`Código: ${codigo}`).text(`Fecha: ${fecha}`)
        .text(`Medio de pago: ${METODOS[pedido.metodo]}`);
    doc.moveDown();

    // cliente y entrega
    seccion(doc, 'Cliente', izquierda, ancho);
    datosEntrega(pedido).forEach(([etiqueta, valor]) => dato(doc, etiqueta, valor));
    doc.moveDown();

    // productos
    seccion(doc, 'Productos', izquierda, ancho);
    const columnas = [
        { titulo: 'Producto', x: izquierda, ancho: ancho - 230, alinear: 'left' as const },
        { titulo: 'Cant.', x: izquierda + ancho - 230, ancho: 50, alinear: 'center' as const },
        { titulo: 'P. unit.', x: izquierda + ancho - 180, ancho: 85, alinear: 'right' as const },
        { titulo: 'Importe', x: izquierda + ancho - 95, ancho: 95, alinear: 'right' as const },
    ];
    const fila = (valores: string[], negrita = false) => {
        const y = doc.y;
        doc.font(negrita ? 'Helvetica-Bold' : 'Helvetica').fontSize(10).fillColor('#0f172a');
        const altos = valores.map((valor, i) => doc.heightOfString(valor, { width: columnas[i].ancho }));
        valores.forEach((valor, i) => doc.text(valor, columnas[i].x, y, { width: columnas[i].ancho, align: columnas[i].alinear }));
        doc.y = y + Math.max(...altos) + 6;
    };
    fila(columnas.map((c) => c.titulo), true);
    pedido.lineas.forEach((linea) =>
        fila([`${linea.nombre} · ${linea.marca}`, String(linea.cantidad), soles(linea.unitario), soles(linea.unitario * linea.cantidad)]));
    linea(doc, izquierda, ancho);

    // totales a la derecha
    const total = (etiqueta: string, valor: string, negrita = false) => {
        const y = doc.y;
        doc.font(negrita ? 'Helvetica-Bold' : 'Helvetica').fontSize(negrita ? 12 : 10).fillColor('#0f172a');
        doc.text(etiqueta, izquierda + ancho - 230, y, { width: 135, align: 'right' });
        doc.text(valor, izquierda + ancho - 95, y, { width: 95, align: 'right' });
        doc.moveDown(0.3);
    };
    total('Subtotal', soles(pedido.subtotal));
    total(...filaEnvio(pedido));
    total('Total', soles(pedido.total), true);

    // aviso: es una constancia, no un comprobante electronico
    doc.moveDown(2);
    doc.font('Helvetica').fontSize(9).fillColor(GRIS).text(
        `Este documento resume tu pedido. Se confirma cuando ${TIENDA.nombre} verifica tu pago por WhatsApp.`,
        izquierda, doc.y, { width: ancho, align: 'center' },
    ).text('No es un comprobante de pago electrónico (boleta o factura).', { width: ancho, align: 'center' });

    doc.end();
    return doc;
}

function seccion(doc: PDFKit.PDFDocument, titulo: string, x: number, ancho: number) {
    doc.font('Helvetica-Bold').fontSize(11).fillColor(MARINO).text(titulo.toUpperCase(), x, doc.y, { characterSpacing: 1 });
    linea(doc, x, ancho);
}

function linea(doc: PDFKit.PDFDocument, x: number, ancho: number) {
    doc.moveDown(0.3);
    doc.moveTo(x, doc.y).lineTo(x + ancho, doc.y).lineWidth(0.5).strokeColor('#cbd5e1').stroke();
    doc.moveDown(0.5);
}

function dato(doc: PDFKit.PDFDocument, etiqueta: string, valor: string) {
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a').text(`${etiqueta}: `, doc.page.margins.left, doc.y, { continued: true })
        .font('Helvetica').text(valor);
}

export default { crearPedido, verPdf };

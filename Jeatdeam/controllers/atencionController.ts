import type { Request, Response } from 'express';

import { insertarMensaje, insertarReclamo, supabaseActivo } from '../integraciones/supabase/supabase.ts';

// prototipo: con Supabase configurado las hojas de reclamacion y los mensajes se guardan alla;
// sin el, quedan en memoria (se pierden al reiniciar)
interface Reclamo {
    codigo: string;
    fecha: string;
    datos: Record<string, string>;
}

const reclamos: Reclamo[] = [];
const mensajes: { fecha: string; datos: Record<string, string> }[] = [];

const CAMPOS_RECLAMO = ['nombre', 'documento', 'correo', 'telefono', 'direccion', 'descripcionBien', 'detalle', 'pedido', 'tipo'];
const CAMPOS_CONTACTO = ['nombre', 'correo', 'mensaje'];

const faltantes = (body: Record<string, unknown>, campos: string[]) =>
    campos.filter((campo) => typeof body[campo] !== 'string' || !(body[campo] as string).trim());

// solo se guardan textos y con un largo razonable
function limpiar(body: Record<string, unknown>): Record<string, string> {
    return Object.fromEntries(
        Object.entries(body)
            .filter(([, valor]) => typeof valor === 'string')
            .map(([clave, valor]) => [clave, (valor as string).slice(0, 2000)])
    );
}

const registrarReclamo = async (req: Request<unknown, unknown, Record<string, unknown>>, res: Response) => {
    const body = req.body ?? {};
    const sinLlenar = faltantes(body, CAMPOS_RECLAMO);
    if (sinLlenar.length) {
        return res.status(400).json({ error: `Faltan datos: ${sinLlenar.join(', ')}` });
    }
    const fecha = new Date().toISOString();
    const datos = limpiar(body);
    let numero = reclamos.length + 1;
    if (supabaseActivo()) {
        try {
            numero = await insertarReclamo(fecha, datos);
        } catch (error) {
            console.error((error as Error).message);
            return res.status(502).json({ error: 'No se pudo registrar el reclamo, intenta de nuevo' });
        }
    }
    const codigo = `RC-${fecha.slice(0, 4)}-${String(numero).padStart(6, '0')}`;
    if (!supabaseActivo()) reclamos.push({ codigo, fecha, datos });
    res.status(201).json({ codigo, fecha });
};

const registrarContacto = async (req: Request<unknown, unknown, Record<string, unknown>>, res: Response) => {
    const body = req.body ?? {};
    const sinLlenar = faltantes(body, CAMPOS_CONTACTO);
    if (sinLlenar.length) {
        return res.status(400).json({ error: `Faltan datos: ${sinLlenar.join(', ')}` });
    }
    const mensaje = { fecha: new Date().toISOString(), datos: limpiar(body) };
    if (supabaseActivo()) {
        try {
            await insertarMensaje(mensaje.fecha, mensaje.datos);
        } catch (error) {
            console.error((error as Error).message);
            return res.status(502).json({ error: 'No se pudo enviar el mensaje, intenta de nuevo' });
        }
    } else {
        mensajes.push(mensaje);
    }
    res.status(201).json({ mensaje: 'Mensaje recibido' });
};

export default { registrarReclamo, registrarContacto };

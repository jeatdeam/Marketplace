import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// prototipo: la tienda sigue siendo un solo json; Supabase lo guarda en una fila (tabla tienda, columna jsonb)
// para que no se pierda cuando Render reinicia o redepliega. Sin las variables, todo queda en datos/tienda.json
const FILA = 'principal';

export const supabaseActivo = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);

let cliente: SupabaseClient | null = null;

// se crea al primer uso: asi las variables ya estan cargadas (entorno.ts) aunque este modulo se importe antes
function db() {
    cliente ??= createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
    return cliente;
}

export async function leerTienda<T>(): Promise<T | null> {
    const { data, error } = await db().from('tienda').select('datos').eq('id', FILA).maybeSingle();
    if (error) throw new Error(`Supabase (leer tienda): ${error.message}`);
    return (data?.datos as T) ?? null;
}

export async function guardarTienda(datos: unknown) {
    const { error } = await db().from('tienda').upsert({ id: FILA, datos, actualizado: new Date().toISOString() });
    if (error) throw new Error(`Supabase (guardar tienda): ${error.message}`);
}

// el numero lo pone la base (identity), asi el codigo del reclamo no se repite tras un reinicio
export async function insertarReclamo(fecha: string, datos: Record<string, string>): Promise<number> {
    const { data, error } = await db().from('reclamos').insert({ fecha, datos }).select('numero').single();
    if (error) throw new Error(`Supabase (reclamo): ${error.message}`);
    return data.numero as number;
}

export async function insertarMensaje(fecha: string, datos: Record<string, string>) {
    const { error } = await db().from('mensajes').insert({ fecha, datos });
    if (error) throw new Error(`Supabase (mensaje): ${error.message}`);
}

// pedidos: el numero lo pone la base y el token (aleatorio) evita que se adivinen los pdf de otros clientes
export async function insertarPedido(token: string, datos: unknown): Promise<number> {
    const { data, error } = await db().from('pedidos').insert({ token, datos }).select('numero').single();
    if (error) throw new Error(`Supabase (pedido): ${error.message}`);
    return data.numero as number;
}

export async function leerPedido<T>(numero: number, token: string): Promise<T | null> {
    const { data, error } = await db().from('pedidos').select('datos').eq('numero', numero).eq('token', token).maybeSingle();
    if (error) throw new Error(`Supabase (leer pedido): ${error.message}`);
    return (data?.datos as T) ?? null;
}

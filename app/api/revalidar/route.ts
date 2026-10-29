import type { NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';

import { ETIQUETA_TIENDA } from '../../../Jeatdeam/client/src/servidor/datos';

// el backend (Render) llama aqui despues de guardar productos, banners o imagenes desde el dashboard,
// asi la tienda muestra el cambio sin esperar los 60 s de la cache.
// REVALIDAR_SECRETO debe tener el mismo valor en Vercel y en Render.
// las demas rutas /api/* van a Render (rewrites de next.config.mjs); esta la atiende Next
export async function POST(request: NextRequest) {
    const secreto = process.env.REVALIDAR_SECRETO;
    if (!secreto || request.headers.get('x-revalidar-secreto') !== secreto) {
        return Response.json({ revalidado: false }, { status: 401 });
    }

    // expire: 0 porque el aviso viene de fuera (el backend): la siguiente visita ya trae los datos nuevos
    revalidateTag(ETIQUETA_TIENDA, { expire: 0 });
    return Response.json({ revalidado: true });
}

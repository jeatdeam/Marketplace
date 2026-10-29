'use client';
import { useParams } from '../router';

import Catalogo from './Catalogo';
import NotFound from './NotFound';
import { categoriaPorSlug } from '../datos/tienda';

// /:brand -> catalogo con la categoria ya marcada (dinosaurios, peluches, ...); la carpeta de next es [brand]
export default function Marca() {
    const { brand: name = '' } = useParams<'brand'>();
    const categoria = categoriaPorSlug(name);
    if (!categoria) return <NotFound />;

    return (
        <Catalogo
            key={categoria.slug}
            titulo={categoria.nombre}
            descripcion={categoria.descripcion}
            categoriaFija={categoria.slug}
        />
    );
}

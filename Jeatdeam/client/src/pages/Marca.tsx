import { useParams } from 'react-router-dom';

import Catalogo from './Catalogo';
import NotFound from './NotFound';
import { categoriaPorSlug } from '../datos/tienda';

// /:name -> catalogo con la categoria ya marcada (dinosaurios, peluches, ...)
export default function Marca() {
    const { name = '' } = useParams();
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

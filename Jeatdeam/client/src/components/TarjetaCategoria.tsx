import { Link } from 'react-router-dom';

import type { Categoria } from '../datos/tienda';

// caja del mosaico de categorias del inicio. El dashboard la usa con "vista" (no navega) para las vistas previas
export default function TarjetaCategoria({ categoria, vista } : { categoria : Categoria; vista?: boolean }) {
    const clase = 'group relative block size-full overflow-hidden rounded-[16px] shadow-[0px_4px_14px_rgba(0,0,0,.12)] transition-shadow duration-300 hover:shadow-[0px_10px_28px_rgba(0,0,0,.22)]';
    const contenido = (
        <>
            <img src={categoria.imagen} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <span className="absolute inset-0 bg-black/45 transition-colors duration-500 group-hover:bg-black/60" aria-hidden="true" />
            <span className="absolute inset-x-[16px] bottom-[14px] text-white">
                <span className="block text-[18px] sm:text-[22px] font-bold leading-tight" aria-hidden="true">
                    {categoria.nombre.split('').map((letra, i) => (
                        <span key={i} className="letraCascada" style={{ ['--i' as string]: i }}>{letra}</span>
                    ))}
                </span>
                <span className="hidden sm:block text-[12px] text-white/80">{categoria.descripcion}</span>
            </span>
        </>
    );
    return vista
        ? <div className={clase}>{contenido}</div>
        : <Link to={`/${categoria.slug}`} aria-label={categoria.nombre} className={clase}>{contenido}</Link>;
}

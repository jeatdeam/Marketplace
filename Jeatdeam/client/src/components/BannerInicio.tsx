import type { ReactNode } from 'react';
import { Link } from '../router';

import Icono from './Icono';
import { MARINO_BLANCO, MARINO_CIELO, MARINO_HIELO, PILDORA_BANNER } from './ui';
import { datosProducto, formatoSoles, rutaProducto } from '../datos/tienda';
import type { Banner, Product, TemaBanner } from '../../../shared/types';

// banners del inicio (Ofertas y Nuevos ingresos). Los usa el inicio y tambien el dashboard,
// que los dibuja en miniatura para mostrar "asi se ve actualmente" y "asi se vera despues"

export const TEMAS_BANNER : Record<TemaBanner, string> = { hielo: MARINO_HIELO, blanco: MARINO_BLANCO, cielo: MARINO_CIELO };
// las 4 tarjetas de Ofertas (principal y 3 secundarios) miden lo mismo
const CAJA_OFERTA = 'min-h-[230px] sm:min-h-[260px] p-[20px] sm:p-[26px]';
const SOMBRA_BANNER = 'shadow-[0px_4px_14px_rgba(0,0,0,.12)] transition-shadow duration-300 hover:shadow-[0px_10px_28px_rgba(0,0,0,.22)]';

// un banner del dashboard sin los datos que pone el servidor
export type DatosBanner = Omit<Banner, 'posicion' | 'actualizado'>;

// lo que pinta un banner chico, venga del dashboard o armado a partir de un producto
export interface ContenidoBanner {
    titulo : string;
    texto?: ReactNode;
    etiqueta?: string;
    imagen?: string;
    enlace : string;
    tema : string;
}

export const desdeBanner = (banner : DatosBanner) : ContenidoBanner => ({
    titulo: banner.titulo,
    texto: banner.subtitulo,
    etiqueta: banner.etiqueta,
    imagen: banner.imagen,
    enlace: banner.enlace,
    tema: TEMAS_BANNER[banner.tema],
});

// productos con descuento, del mayor al menor: arman las ofertas automaticas
export const productosEnOferta = (productos : Product[]) => productos
    .map((producto) => ({ producto, datos: datosProducto(producto) }))
    .filter(({ datos }) => datos.descuento > 0)
    .sort((a, b) => b.datos.descuento - a.datos.descuento);

// secundario n (1..3) de Ofertas: el del dashboard o el producto con el 4.º, 5.º y 6.º mayor descuento
export function contenidoOferta(n : 1 | 2 | 3, productos : Product[], subido?: DatosBanner) : ContenidoBanner | null {
    if (subido) return desdeBanner(subido);
    const auto = productosEnOferta(productos)[2 + n];
    if (!auto) return null;
    return {
        titulo: auto.producto.name,
        etiqueta: `-${auto.datos.descuento}%`,
        imagen: auto.producto.img[0],
        enlace: rutaProducto(auto.producto),
        tema: [MARINO_BLANCO, MARINO_CIELO, MARINO_HIELO][n - 1],
        texto: <>{formatoSoles(auto.datos.precio)} {auto.datos.precioAnterior && <s className="text-white/60">{formatoSoles(auto.datos.precioAnterior)}</s>}</>,
    };
}

// banner n (1..5) de Nuevos ingresos: el del dashboard o uno de los ultimos productos
export function contenidoNuevo(n : 1 | 2 | 3 | 4 | 5, productos : Product[], subido?: DatosBanner) : ContenidoBanner | null {
    if (subido) return desdeBanner(subido);
    const producto = productos.slice(-5).reverse()[n - 1];
    if (!producto) return null;
    return {
        titulo: producto.name,
        etiqueta: 'Nuevo',
        imagen: producto.img[0],
        enlace: rutaProducto(producto),
        tema: [MARINO_HIELO, MARINO_CIELO, MARINO_BLANCO, MARINO_HIELO, MARINO_CIELO][n - 1],
        texto: formatoSoles(datosProducto(producto).precio),
    };
}

// en la tienda el banner es un enlace; en las vistas previas del dashboard es una caja que no navega
function Caja({ vista, to, className, children } : { vista?: boolean; to : string; className : string; children : ReactNode }) {
    return vista ? <div className={className}>{children}</div> : <Link to={to} className={className}>{children}</Link>;
}

// foto dentro de un circulo blanco que sale un poco del borde
function CirculoFoto({ src, className } : { src?: string; className : string }) {
    if (!src) return null;
    return (
        <span className={`absolute -right-[18px] -bottom-[18px] aspect-square rounded-full bg-white/90 grid place-items-center transition-transform duration-500 group-hover:scale-[1.03] ${className}`}>
            <img src={src} alt="" className="size-[86%] rounded-full object-cover" loading="lazy" />
        </span>
    );
}

// banner grande de Ofertas: el del dashboard o, si no hay, la categoria con el mayor descuento y 3 productos flotando
export function BannerPrincipal({ productos, subido, vista } : { productos : Product[]; subido?: DatosBanner; vista?: boolean }) {
    const enOferta = productosEnOferta(productos);
    const maximo = enOferta[0]?.datos.descuento ?? 0;

    return (
        <Caja
            vista={vista}
            to={subido?.enlace ?? '/promociones'}
            className={`group relative block overflow-hidden rounded-[16px] ${CAJA_OFERTA} text-white ${subido ? TEMAS_BANNER[subido.tema] : MARINO_HIELO} ${SOMBRA_BANNER}`}
        >
            <p className="text-[12px] font-semibold uppercase tracking-[.15em] text-white/80">{subido ? 'Promoción' : 'Dinosaurios mordelones'}</p>
            {subido ? (
                <p className="mt-[6px] max-w-[62%] text-[26px] sm:text-[32px] font-extrabold leading-none">
                    {subido.titulo} {subido.etiqueta && <span className="text-[#facc15]">{subido.etiqueta}</span>}
                </p>
            ) : (
                <p className="mt-[6px] text-[30px] sm:text-[38px] font-extrabold leading-none">
                    Hasta <span className="text-[#facc15]">-{maximo}%</span>
                </p>
            )}
            <p className="mt-[8px] max-w-[55%] text-[13px] text-white/85">
                {subido ? subido.subtitulo : 'Articulados, texturizados y listos para la aventura.'}
            </p>
            <span className={`${PILDORA_BANNER} mt-[14px] !py-[8px]`}>
                Ver ofertas <Icono nombre="flechaDerecha" className="size-[16px] transition-transform group-hover:translate-x-[4px]" />
            </span>
            {subido ? (
                <CirculoFoto src={subido.imagen} className="w-[42%]" />
            ) : (
                <div className="pointer-events-none absolute right-[-10px] bottom-[-10px] flex items-end">
                    {enOferta.slice(0, 3).map(({ producto }, indice) => (
                        <span
                            key={producto.name}
                            className={`grid place-items-center rounded-full bg-white/90 shadow-[0_8px_24px_rgba(15,23,42,.25)] transition-transform duration-500 group-hover:scale-[1.03] ${indice === 1 ? 'size-[96px] sm:size-[130px] -ml-[24px] z-10 mb-[24px]' : 'size-[72px] sm:size-[96px] -ml-[24px]'}`}
                        >
                            <img src={producto.img[0]} alt="" className="size-[86%] rounded-full object-cover" loading="lazy" />
                        </span>
                    ))}
                </div>
            )}
        </Caja>
    );
}

// los otros 3 banners de Ofertas (del mismo tamaño que el principal)
export function BannerOferta({ item, vista } : { item : ContenidoBanner; vista?: boolean }) {
    return (
        <Caja vista={vista} to={item.enlace} className={`group relative block overflow-hidden rounded-[16px] ${CAJA_OFERTA} text-white ${item.tema} ${SOMBRA_BANNER}`}>
            {item.etiqueta && <span className="inline-block rounded-full bg-red-600 px-[8px] py-[2px] text-[12px] font-bold">{item.etiqueta}</span>}
            <p className="mt-[8px] max-w-[55%] text-[20px] sm:text-[24px] font-bold leading-tight">{item.titulo}</p>
            {item.texto && <p className="mt-[4px] max-w-[55%] text-[14px] text-white/85">{item.texto}</p>}
            <CirculoFoto src={item.imagen} className="w-[42%]" />
        </Caja>
    );
}

// Nuevos ingresos: 2 grandes arriba y 3 chicos abajo; "ubicacion" son las columnas que ocupa en el inicio
export function BannerNuevo({ item, grande, ubicacion = '', vista } : { item : ContenidoBanner; grande : boolean; ubicacion?: string; vista?: boolean }) {
    return (
        <Caja
            vista={vista}
            to={item.enlace}
            className={`group relative block overflow-hidden rounded-[16px] text-white ${item.tema} ${SOMBRA_BANNER} ${ubicacion} ${grande ? 'min-h-[220px] p-[22px]' : 'min-h-[170px] p-[16px]'}`}
        >
            {item.etiqueta && (
                <span className="inline-flex items-center gap-[4px] rounded-full bg-[#facc15] px-[8px] py-[2px] text-[11px] font-bold text-slate-900">
                    <Icono nombre="brillo" className="size-[12px]" /> {item.etiqueta}
                </span>
            )}
            <p className={`mt-[8px] max-w-[55%] font-bold leading-tight ${grande ? 'text-[22px] sm:text-[26px]' : 'text-[16px]'}`}>{item.titulo}</p>
            {item.texto && <p className="mt-[4px] max-w-[55%] text-[13px] text-white/85">{item.texto}</p>}
            {grande && (
                <span className={`${PILDORA_BANNER} mt-[14px] !py-[8px]`}>
                    Ver más <Icono nombre="flechaDerecha" className="size-[15px] transition-transform group-hover:translate-x-[4px]" />
                </span>
            )}
            <CirculoFoto src={item.imagen} className={grande ? 'w-[48%] sm:w-[42%]' : 'w-[58%]'} />
        </Caja>
    );
}

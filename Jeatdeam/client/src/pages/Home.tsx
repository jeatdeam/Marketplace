import { BeforeAfterSlider } from '../components/beforeAfterSlider';
import { BannerNuevo, BannerOferta, BannerPrincipal, contenidoNuevo, contenidoOferta, productosEnOferta, type ContenidoBanner } from '../components/BannerInicio';
import CarruselProductos from '../components/CarruselProductos';
import Icono from '../components/Icono';
import TarjetaCategoria from '../components/TarjetaCategoria';
import { ANCHO_SECCION, ESPACIO_BLOQUES, Aparecer, TARJETA, TituloSeccion } from '../components/ui';
import { useStore } from '../context/StoreContext';
import type { Categoria } from '../datos/tienda';
import type { Banner, PosicionBanner, Product } from '../../../shared/types';

// patron del mosaico hasta 1023px: un bloque grande y cuatro chicos, dos veces, sin dejar huecos en 6 columnas.
// desde lg (12 columnas): 1 caja en la primera fila, 2 en la segunda, 3 en la tercera (de una fila de alto)
// y 4 en la ultima, que mide el doble de alto
const SPANS = [
    'md:col-span-2 md:row-span-2 lg:col-span-12',
    'md:col-span-2 lg:col-span-6',
    'md:col-span-2 lg:col-span-6',
    'md:col-span-2 lg:col-span-4',
    'md:col-span-2 lg:col-span-4',
    'md:col-span-2 md:row-span-2 lg:col-span-4',
    'md:col-span-2 lg:col-span-3',
    'md:col-span-2 lg:col-span-3',
    'md:col-span-2 lg:col-span-3',
    'md:col-span-2 lg:col-span-3',
].map((clases, i) => `${clases} ${i >= 6 ? 'lg:row-span-2' : 'lg:row-span-1'}`);

export default function Home() {
    const { baseDatos, categorias, banners } = useStore();
    const productos = baseDatos || [];

    return (
        // la misma distancia entre todos los bloques: header -> slider -> ... -> footer
        <main className={`flex flex-col ${ESPACIO_BLOQUES}`}>
            <BeforeAfterSlider />

            <SeccionOfertas productos={productos} banners={banners} />

            <SeccionCategorias categorias={categorias} />

            <section className={ANCHO_SECCION} aria-labelledby="titulo-vendidos">
                <TituloSeccion id="titulo-vendidos" sobretitulo="Los favoritos" pegado>más vendidos</TituloSeccion>
                <Aparecer>
                    {productos.length ? (
                        <CarruselProductos productos={productos} etiqueta="Productos más vendidos" />
                    ) : (
                        <EstadoCarga />
                    )}
                </Aparecer>
            </section>

            <SeccionNuevos productos={productos} banners={banners} />
        </main>
    );
}

function EstadoCarga() {
    return (
        <div role="status" className={`${TARJETA} flex flex-col items-center gap-[10px] text-slate-500`}>
            <Icono nombre="recargar" className="size-[28px] animate-spin text-sky-700" />
            <p className="text-[14px]">Cargando productos…</p>
        </div>
    );
}

// las secciones reciben los datos por props: asi la vista previa del dashboard (/vista-previa)
// las dibuja con el cambio que se esta editando, antes de publicarlo

const buscadorBanner = (banners : Banner[]) => (posicion : PosicionBanner) => banners.find((banner) => banner.posicion === posicion);

export function SeccionCategorias({ categorias } : { categorias : Categoria[] }) {
    return (
        <section className={ANCHO_SECCION} aria-labelledby="titulo-categorias">
            <TituloSeccion id="titulo-categorias" sobretitulo="Explora" pegado>categorías</TituloSeccion>
            <Aparecer>
                <ul className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 grid-flow-dense auto-rows-[160px] md:auto-rows-[220px] xl:auto-rows-[240px] gap-[12px] sm:gap-[16px]">
                    {categorias.map((categoria, indice) => (
                        <li key={categoria.slug} className={`${SPANS[indice]} ${indice === 0 || indice === categorias.length - 1 ? 'col-span-2' : ''}`}>
                            <TarjetaCategoria categoria={categoria} />
                        </li>
                    ))}
                </ul>
            </Aparecer>
        </section>
    );
}

// banner principal y 3 secundarios, todos del mismo tamaño: los del dashboard o, si no hay, armados con los productos en oferta
export function SeccionOfertas({ productos, banners } : { productos : Product[]; banners : Banner[] }) {
    const bannerSubido = buscadorBanner(banners);
    const principal = bannerSubido('ofertas-principal');
    const secundarios = ([1, 2, 3] as const)
        .map((n) => contenidoOferta(n, productos, bannerSubido(`ofertas-${n}`)))
        .filter((item) : item is ContenidoBanner => item !== null);

    if (!principal && productosEnOferta(productos).length < 3) return null;

    return (
        <section className={ANCHO_SECCION} aria-labelledby="titulo-ofertas">
            <TituloSeccion id="titulo-ofertas" sobretitulo="Solo por esta semana" pegado>ofertas</TituloSeccion>
            {/* las 4 tarjetas del mismo tamaño: una columna en celular y 2x2 desde sm */}
            <Aparecer className="grid auto-rows-fr gap-[16px] sm:grid-cols-2">
                <BannerPrincipal productos={productos} subido={principal} />
                {secundarios.map((item, indice) => <BannerOferta key={indice} item={item} />)}
            </Aparecer>
        </section>
    );
}

// 2 banners grandes y 3 pequeños: los del dashboard o, si no hay, los ultimos productos
export function SeccionNuevos({ productos, banners } : { productos : Product[]; banners : Banner[] }) {
    const bannerSubido = buscadorBanner(banners);
    const items = ([1, 2, 3, 4, 5] as const).map((n) => contenidoNuevo(n, productos, bannerSubido(`nuevos-${n}`)));
    const completos = items.filter((item) : item is ContenidoBanner => item !== null);
    if (completos.length < items.length) return null;

    return (
        <section className={ANCHO_SECCION} aria-labelledby="titulo-nuevos">
            <TituloSeccion id="titulo-nuevos" sobretitulo="Recién llegados" pegado>nuevos ingresos</TituloSeccion>
            <Aparecer className="grid gap-[16px] grid-cols-2 lg:grid-cols-6">
                {completos.map((item, indice) => (
                    <BannerNuevo
                        key={indice}
                        item={item}
                        grande={indice < 2}
                        ubicacion={indice < 2 ? 'col-span-2 lg:col-span-3' : `${indice === 4 ? 'col-span-2' : ''} lg:col-span-2`}
                    />
                ))}
            </Aparecer>
        </section>
    );
}

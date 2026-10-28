import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Icono from '../components/Icono';
import CarruselProductos from '../components/CarruselProductos';
import { MediosPago } from '../components/Footer';
import { ANCHO_SECCION, BOTON_PRODUCTO, EncabezadoPagina, Estrellas, TARJETA, TituloSeccion } from '../components/ui';
import NotFound from './NotFound';
import { useCartActions, useStore } from '../context/StoreContext';
import { TIENDA, caracteristicas, datosProducto, descripcionProducto, fichaTecnica, formatoSoles, nombreCategoria } from '../datos/tienda';

const DURACION_IMAGEN = 5000;
// el mismo tamaño que los botones de las cards de producto (TarjetaProducto)
const TAMANO_BOTON = 'w-[122px] h-[37px] shrink-0';
const PESTANAS = ['Especificaciones', 'Descripción', 'Envío y garantía'] as const;

// galeria cuadrada: un punto por imagen que se estira y se llena como barra de carga
function Galeria({ imagenes, nombre } : { imagenes : string[]; nombre : string }) {
    const [activa, setActiva] = useState(0);
    const total = imagenes.length;

    useEffect(() => setActiva(0), [imagenes]);

    const mover = (paso : number) => setActiva((valor) => (valor + paso + total) % total);

    return (
        // la barra se pausa sola con el cursor encima (.galeria:hover en estilos.css)
        <div className="galeria flex flex-col gap-[14px] md:w-[70%] lg:w-[90%] mx-auto">

            <div className="relative aspect-square overflow-hidden rounded-[12px] bg-[#f3f9fd]">
                <img key={activa} src={imagenes[activa]} alt={`${nombre}, foto ${activa + 1} de ${total}`} className="animateElement size-full object-cover" draggable={false} />
                <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 flex items-center gap-[6px] rounded-full bg-black/25 backdrop-blur-md px-[10px] py-[7px]">
                    {imagenes.map((_, indice) => (
                        <button
                            key={indice}
                            type="button"
                            onClick={() => setActiva(indice)}
                            aria-label={`Ver foto ${indice + 1}`}
                            aria-current={indice === activa}
                            className={`relative h-[7px] rounded-full overflow-hidden bg-white/50 transition-[width] duration-500 ${indice === activa ? 'w-[32px]' : 'w-[7px]'}`}
                        >
                            {indice === activa && (
                                <span
                                    key={activa}
                                    className="barraCarga absolute inset-0 bg-white rounded-full"
                                    style={{ animationDuration: `${DURACION_IMAGEN}ms` }}
                                    onAnimationEnd={() => mover(1)}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-[10px]">
                <button type="button" onClick={() => mover(-1)} aria-label="Foto anterior" className="grid place-items-center size-[36px] shrink-0 rounded-full bg-white ring-1 ring-black/10 shadow-[0_4px_12px_rgba(15,23,42,.1)] hover:bg-slate-50 active:scale-90">
                    <Icono nombre="izquierda" className="size-[18px]" grosor={2.5} />
                </button>
                {/* miniaturas de las otras fotos: la que se ve en grande no se repite abajo */}
                <ul className="flex-1 grid gap-[8px]" style={{ gridTemplateColumns: `repeat(${Math.min(Math.max(total - 1, 1), 4)}, minmax(0, 1fr))` }}>
                    {imagenes.map((src, indice) => indice !== activa && (
                        <li key={src}>
                            <button
                                type="button"
                                onClick={() => setActiva(indice)}
                                aria-label={`Ver foto ${indice + 1}`}
                                className="block aspect-square w-full overflow-hidden rounded-[8px] bg-[#f3f9fd] ring-2 ring-transparent transition-all hover:ring-slate-300"
                            >
                                <img src={src} alt="" className="size-full object-cover" loading="lazy" />
                            </button>
                        </li>
                    ))}
                </ul>
                <button type="button" onClick={() => mover(1)} aria-label="Foto siguiente" className="grid place-items-center size-[36px] shrink-0 rounded-full bg-white ring-1 ring-black/10 shadow-[0_4px_12px_rgba(15,23,42,.1)] hover:bg-slate-50 active:scale-90">
                    <Icono nombre="derecha" className="size-[18px]" grosor={2.5} />
                </button>
            </div>
        </div>
    );
}

// /:brand/:categoria/:product
export default function ProductDetail() {
    const { brand, product: name } = useParams();
    const { baseDatos } = useStore();
    const { add, buy } = useCartActions();
    const [cantidad, setCantidad] = useState(1);
    const [pestana, setPestana] = useState<typeof PESTANAS[number]>('Especificaciones');
    const [agregado, setAgregado] = useState(false);

    useEffect(() => {
        setCantidad(1);
        setAgregado(false);
    }, [name]);

    if (!baseDatos) {
        return <main className="flex-1 pt-[180px] text-center text-slate-500" role="status">Cargando producto…</main>;
    }

    const producto = baseDatos.find((item) => item.brand === brand && item.name === name);
    if (!producto) return <NotFound />;

    const datos = datosProducto(producto);
    const ficha = fichaTecnica(producto);
    const recomendados = baseDatos.filter((item) => item.name !== producto.name).slice(0, 10);

    // el servidor guarda una fila por unidad, asi que se agrega una vez por cada unidad elegida
    const agregarVarios = async () => {
        for (let i = 0; i < cantidad; i++) await add(producto);
        setAgregado(true);
        setTimeout(() => setAgregado(false), 1500);
    };
    const comprarAhora = async () => {
        for (let i = 1; i < cantidad; i++) await add(producto);
        buy(producto);
    };

    return (
        <main className={`${ANCHO_SECCION} flex-1`}>
            <EncabezadoPagina
                titulo={producto.name}
                migas={[
                    { texto: 'Inicio', a: '/' },
                    { texto: nombreCategoria(producto.category), a: `/${producto.category}` },
                    { texto: producto.name },
                ]}
            />

            <section className="grid gap-[20px] lg:grid-cols-2 ">
                <div className={`${TARJETA} !p-[16px] sm:!p-[22px]`}>
                    <Galeria imagenes={producto.img} nombre={producto.name} />
                </div>

                <div className={`${TARJETA} flex flex-col`}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{nombreCategoria(producto.category)} · {producto.brand}</p>
                    <h2 className="mt-[6px] text-[20px] sm:text-[24px] font-bold leading-snug">{producto.subtitle}</h2>
                    <div className="mt-[10px] flex flex-wrap items-center gap-x-[14px] gap-y-[6px]">
                        <Estrellas valor={datos.calificacion} resenas={datos.resenas} />
                        <span className="text-[12px] text-slate-500">SKU {datos.sku}</span>
                    </div>

                    <div className="mt-[16px] flex items-end gap-[12px]">
                        <span className={`text-[30px] font-extrabold leading-none ${datos.descuento ? 'text-red-600' : ''}`}>{formatoSoles(datos.precio)}</span>
                        {datos.precioAnterior && (
                            <>
                                <s className="text-[16px] text-slate-400">{formatoSoles(datos.precioAnterior)}</s>
                                <span className="rounded-full bg-red-600 px-[8px] py-[2px] text-[12px] font-bold text-white">-{datos.descuento}%</span>
                            </>
                        )}
                    </div>
                    <p className={`mt-[8px] inline-flex items-center gap-[6px] text-[13px] font-medium ${datos.stock === 0 ? 'text-red-600' : datos.stock < 8 ? 'text-amber-600' : 'text-emerald-700'}`}>
                        <span className="size-[8px] rounded-full bg-current" aria-hidden="true" />
                        {datos.stock === 0 ? 'Agotado por ahora' : datos.stock < 8 ? `¡Quedan solo ${datos.stock} unidades!` : `En stock (${datos.stock} unidades)`}
                    </p>

                    <ul className="mt-[16px] flex flex-wrap gap-[6px]" aria-label="Certificaciones">
                        {['Libre de BPA', 'No tóxico', '+3 años'].map((chip) => (
                            <li key={chip} className="inline-flex items-center gap-[5px] rounded-full bg-sky-50 px-[10px] py-[4px] text-[12px] font-semibold text-sky-900 ring-1 ring-sky-200">
                                <Icono nombre="escudo" className="size-[13px]" /> {chip}
                            </li>
                        ))}
                    </ul>

                    <ul className="mt-[16px] flex flex-col gap-[8px] text-[14px] text-slate-700">
                        {caracteristicas(producto).slice(0, 3).map((texto) => (
                            <li key={texto} className="flex gap-[8px]">
                                <Icono nombre="check" className="mt-[3px] size-[16px] shrink-0 text-sky-700" grosor={2.5} /> {texto}
                            </li>
                        ))}
                    </ul>

                    {/* cantidad y botones del mismo alto (37px); los botones miden lo mismo que los de las cards */}
                    <div className="mt-auto pt-[22px] flex flex-wrap items-center gap-[10px]">
                        <div className="flex h-[37px] items-center rounded-[10px] border-2 border-gray-300" role="group" aria-label="Cantidad">
                            <button type="button" onClick={() => setCantidad((valor) => Math.max(1, valor - 1))} aria-label="Restar uno" className="grid place-items-center size-[33px] hover:bg-slate-50 active:scale-90">
                                <Icono nombre="menos" className="size-[16px]" />
                            </button>
                            <span key={cantidad} className="parpadeoCantidad w-[34px] text-center text-[15px] font-bold rounded-full" aria-live="polite">{cantidad}</span>
                            <button type="button" onClick={() => setCantidad((valor) => Math.min(datos.stock, valor + 1))} aria-label="Sumar uno" className="grid place-items-center size-[33px] hover:bg-slate-50 active:scale-90">
                                <Icono nombre="mas" className="size-[16px]" />
                            </button>
                        </div>
                        {/* textos cortos como en las cards: "Agregar al carrito" y "Comprar ahora" no entran en 122px */}
                        <button type="button" onClick={agregarVarios} disabled={datos.stock === 0} aria-label={agregado ? 'Agregado al carrito' : 'Agregar al carrito'} className={`${BOTON_PRODUCTO} ${TAMANO_BOTON} ${agregado ? '!bg-blue-500 !border-blue-500 !text-white' : ''}`}>
                            <Icono nombre={agregado ? 'check' : 'bolsa'} className="size-[15px] shrink-0" /> <span className="truncate">{agregado ? 'Agregado' : 'Agregar'}</span>
                        </button>
                        <button type="button" onClick={comprarAhora} disabled={datos.stock === 0} aria-label="Comprar ahora" className={`${BOTON_PRODUCTO} ${TAMANO_BOTON} !border-slate-900 bg-slate-900 text-white hover:!bg-slate-700`}>
                            <Icono nombre="tarjeta" className="size-[15px] shrink-0" /> <span className="truncate">Comprar</span>
                        </button>
                    </div>

                    <div className="mt-[18px] pt-[16px] border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-[10px]">
                        <p className="flex items-center gap-[8px] text-[13px] text-slate-600">
                            <Icono nombre="camion" className="size-[18px] text-sky-700" /> Envío gratis desde S/ {TIENDA.envioGratisDesde}
                        </p>
                        <MediosPago />
                    </div>
                </div>
            </section>

            <section className={`${TARJETA} mt-[20px]`}>
                {/* sin scroll: si no entran en una linea pasan a la siguiente (el scroll recortaba la linea animada) */}
                <div role="tablist" aria-label="Información del producto" className="flex flex-wrap gap-[4px] border-b border-slate-100">
                    {PESTANAS.map((nombre) => (
                        <button
                            key={nombre}
                            type="button"
                            role="tab"
                            aria-selected={pestana === nombre}
                            onClick={() => setPestana(nombre)}
                            className={`relative whitespace-nowrap px-[14px] py-[10px] text-[14px] font-semibold transition-colors ${pestana === nombre ? 'text-slate-900 after:absolute after:inset-x-[10px] after:-bottom-px after:h-[2px] after:bg-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            {nombre}
                        </button>
                    ))}
                </div>
                <div role="tabpanel" className="pt-[18px] text-[14px] text-slate-700">
                    {pestana === 'Especificaciones' && (
                        <dl className="grid sm:grid-cols-2 gap-x-[30px]">
                            {ficha.map((fila) => (
                                <div key={fila.etiqueta} className="flex justify-between gap-[12px] py-[10px] border-b border-slate-100">
                                    <dt className="text-slate-500">{fila.etiqueta}</dt>
                                    <dd className="font-medium text-slate-900 text-right">{fila.valor}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                    {pestana === 'Descripción' && (
                        <div className="max-w-[720px] flex flex-col gap-[10px]">
                            <p className="whitespace-pre-line">{descripcionProducto(producto)}</p>
                            <ul className="list-disc pl-[20px] flex flex-col gap-[4px]">
                                {caracteristicas(producto).map((texto) => <li key={texto}>{texto}</li>)}
                            </ul>
                        </div>
                    )}
                    {pestana === 'Envío y garantía' && (
                        <ul className="grid sm:grid-cols-3 gap-[14px]">
                            {[
                                { icono: 'camion' as const, titulo: 'Envío', texto: 'Lima en el día (pedidos antes de la 1 p. m.). Provincias en 48–72 h por Shalom u Olva.' },
                                { icono: 'recargar' as const, titulo: 'Cambios', texto: 'Tienes 7 días para cambiarlo si llega con fallas de fábrica.' },
                                { icono: 'tienda' as const, titulo: 'Recojo en tienda', texto: `Gratis en ${TIENDA.direccion}.` },
                            ].map((item) => (
                                <li key={item.titulo} className="rounded-[12px] bg-[#f3f9fd] p-[16px]">
                                    <Icono nombre={item.icono} className="size-[22px] text-sky-700" />
                                    <p className="mt-[8px] font-semibold text-slate-900">{item.titulo}</p>
                                    <p className="mt-[2px] text-[13px]">{item.texto}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            {recomendados.length > 0 && (
                <section aria-labelledby="titulo-recomendados">
                    <TituloSeccion id="titulo-recomendados">también te puede gustar</TituloSeccion>
                    <CarruselProductos productos={recomendados} etiqueta="Productos recomendados" />
                </section>
            )}
        </main>
    );
}

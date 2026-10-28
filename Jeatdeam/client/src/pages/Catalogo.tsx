import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import Icono from '../components/Icono';
import TarjetaProducto from '../components/TarjetaProducto';
import { ANCHO_SECCION, BOTON_PRINCIPAL, BOTON_SECUNDARIO, EncabezadoPagina, INPUT } from '../components/ui';
import { useStore } from '../context/StoreContext';
import { CATEGORIAS, datosProducto, nombreCategoria, normalizar } from '../datos/tienda';
import type { Product } from '../../../shared/types';

const ORDENES = [
    { valor: 'relevancia', texto: 'Relevancia' },
    { valor: 'recientes', texto: 'Más recientes' },
    { valor: 'descuento', texto: 'Mayor descuento' },
    { valor: 'precio-asc', texto: 'Precio: menor a mayor' },
    { valor: 'precio-desc', texto: 'Precio: mayor a menor' },
    { valor: 'nombre', texto: 'Nombre A–Z' },
    { valor: 'calificacion', texto: 'Mejor calificados' },
];

const CALIFICACIONES = [4, 3, 2];

interface Filtros {
    q : string;
    categoria : string;
    min : string;
    max : string;
    oferta : boolean;
    nuevos : boolean;
    calificacion : number;
}

function aplicar(productos : Product[], filtros : Filtros, ignorar?: keyof Filtros) {
    const palabras = normalizar(filtros.q).split(/\s+/).filter(Boolean);
    return productos.filter((producto) => {
        const datos = datosProducto(producto);
        if (ignorar !== 'categoria' && filtros.categoria && producto.category !== filtros.categoria) return false;
        if (filtros.min && datos.precio < Number(filtros.min)) return false;
        if (filtros.max && datos.precio > Number(filtros.max)) return false;
        if (filtros.oferta && !datos.descuento) return false;
        if (filtros.nuevos && !datos.nuevo) return false;
        if (ignorar !== 'calificacion' && filtros.calificacion && datos.calificacion < filtros.calificacion) return false;
        if (palabras.length) {
            const texto = normalizar(`${producto.name} ${producto.brand} ${producto.category} ${producto.subtitle}`);
            if (!palabras.every((palabra) => texto.includes(palabra))) return false;
        }
        return true;
    });
}

function ordenar(productos : Product[], orden : string) {
    const lista = productos.map((producto, indice) => ({ producto, indice, datos: datosProducto(producto) }));
    const comparar : Record<string, (a : typeof lista[number], b : typeof lista[number]) => number> = {
        recientes: (a, b) => b.indice - a.indice,
        descuento: (a, b) => b.datos.descuento - a.datos.descuento,
        'precio-asc': (a, b) => a.datos.precio - b.datos.precio,
        'precio-desc': (a, b) => b.datos.precio - a.datos.precio,
        nombre: (a, b) => a.producto.name.localeCompare(b.producto.name, 'es'),
        calificacion: (a, b) => b.datos.calificacion - a.datos.calificacion,
    };
    if (comparar[orden]) lista.sort(comparar[orden]);
    return lista.map(({ producto }) => producto);
}

interface CatalogoProps {
    titulo?: string;
    descripcion?: string;
    // en /:categoria la categoria viene de la ruta y no se puede quitar
    categoriaFija?: string;
    soloOfertas?: boolean;
}

export default function Catalogo({ titulo = 'Todos los productos', descripcion, categoriaFija, soloOfertas } : CatalogoProps) {
    const { baseDatos } = useStore();
    const [params, setParams] = useSearchParams();
    const [cajonAbierto, setCajonAbierto] = useState(false);

    // los filtros viven en la url para poder compartir o recargar la busqueda
    const filtros : Filtros = {
        q: params.get('q') ?? '',
        categoria: categoriaFija ?? params.get('categoria') ?? '',
        min: params.get('min') ?? '',
        max: params.get('max') ?? '',
        oferta: soloOfertas || params.get('oferta') === '1',
        nuevos: params.get('nuevos') === '1',
        calificacion: Number(params.get('calificacion') ?? 0),
    };
    const orden = params.get('orden') ?? (soloOfertas ? 'descuento' : 'relevancia');

    const cambiar = (clave : string, valor : string | null) => {
        const siguiente = new URLSearchParams(params);
        if (valor) siguiente.set(clave, valor);
        else siguiente.delete(clave);
        setParams(siguiente, { replace: true });
    };

    const productos = baseDatos || [];
    const resultados = useMemo(() => ordenar(aplicar(productos, filtros), orden), [productos, params, categoriaFija, soloOfertas]); // eslint-disable-line react-hooks/exhaustive-deps

    // conteo de cada opcion sin aplicar su propia faceta; las que darian 0 se deshabilitan
    const conteoCategorias = useMemo(() => {
        const base = aplicar(productos, filtros, 'categoria');
        return Object.fromEntries(CATEGORIAS.map((categoria) => [categoria.slug, base.filter((producto) => producto.category === categoria.slug).length]));
    }, [productos, params]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!cajonAbierto) return;
        const alTeclear = (e : KeyboardEvent) => { if (e.key === 'Escape') setCajonAbierto(false); };
        document.addEventListener('keydown', alTeclear);
        return () => document.removeEventListener('keydown', alTeclear);
    }, [cajonAbierto]);

    const chips : { texto : string; quitar : () => void }[] = [];
    if (filtros.q) chips.push({ texto: `“${filtros.q}”`, quitar: () => cambiar('q', null) });
    if (!categoriaFija && filtros.categoria) chips.push({ texto: nombreCategoria(filtros.categoria), quitar: () => cambiar('categoria', null) });
    if (filtros.min) chips.push({ texto: `Desde S/ ${filtros.min}`, quitar: () => cambiar('min', null) });
    if (filtros.max) chips.push({ texto: `Hasta S/ ${filtros.max}`, quitar: () => cambiar('max', null) });
    if (!soloOfertas && filtros.oferta) chips.push({ texto: 'En oferta', quitar: () => cambiar('oferta', null) });
    if (filtros.nuevos) chips.push({ texto: 'Nuevos ingresos', quitar: () => cambiar('nuevos', null) });
    if (filtros.calificacion) chips.push({ texto: `${filtros.calificacion}★ o más`, quitar: () => cambiar('calificacion', null) });

    const limpiar = () => setParams(new URLSearchParams(), { replace: true });

    const panelFiltros = (
        <div className="flex flex-col gap-[22px]">
            <GrupoFiltro titulo="Buscar">
                <div className="relative">
                    <Icono nombre="buscar" className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[16px] text-slate-400" />
                    <input
                        type="search"
                        value={filtros.q}
                        onChange={(e) => cambiar('q', e.target.value)}
                        placeholder="Nombre o tipo"
                        aria-label="Buscar en el catálogo"
                        className={`${INPUT} pl-[36px]`}
                    />
                </div>
            </GrupoFiltro>

            {!categoriaFija && (
                <GrupoFiltro titulo="Categoría">
                    <ul className="flex flex-col gap-[2px]">
                        {CATEGORIAS.map((categoria) => {
                            const conteo = conteoCategorias[categoria.slug] ?? 0;
                            const activa = filtros.categoria === categoria.slug;
                            return (
                                <li key={categoria.slug}>
                                    <label className={`flex items-center gap-[10px] rounded-[8px] px-[8px] py-[6px] text-[14px] ${conteo === 0 && !activa ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-sky-50'}`}>
                                        <input
                                            type="radio"
                                            name="categoria"
                                            checked={activa}
                                            disabled={conteo === 0 && !activa}
                                            onChange={() => cambiar('categoria', categoria.slug)}
                                            className="size-[16px] accent-slate-900"
                                        />
                                        <span className="flex-1">{categoria.nombre}</span>
                                        <span className="text-[12px] text-slate-400">{conteo}</span>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </GrupoFiltro>
            )}

            <GrupoFiltro titulo="Precio (S/)">
                <div className="flex items-center gap-[8px]">
                    <input type="number" min={0} inputMode="numeric" value={filtros.min} onChange={(e) => cambiar('min', e.target.value)} placeholder="Mín." aria-label="Precio mínimo" className={INPUT} />
                    <span className="text-slate-400">–</span>
                    <input type="number" min={0} inputMode="numeric" value={filtros.max} onChange={(e) => cambiar('max', e.target.value)} placeholder="Máx." aria-label="Precio máximo" className={INPUT} />
                </div>
            </GrupoFiltro>

            <GrupoFiltro titulo="Mostrar">
                <div className="flex flex-col gap-[6px]">
                    {!soloOfertas && (
                        <Interruptor activo={filtros.oferta} onCambiar={(valor) => cambiar('oferta', valor ? '1' : null)}>En oferta</Interruptor>
                    )}
                    <Interruptor activo={filtros.nuevos} onCambiar={(valor) => cambiar('nuevos', valor ? '1' : null)}>Nuevos ingresos</Interruptor>
                </div>
            </GrupoFiltro>

            <GrupoFiltro titulo="Calificación">
                <div className="flex flex-wrap gap-[6px]">
                    {CALIFICACIONES.map((estrellas) => (
                        <button
                            key={estrellas}
                            type="button"
                            aria-pressed={filtros.calificacion === estrellas}
                            onClick={() => cambiar('calificacion', filtros.calificacion === estrellas ? null : String(estrellas))}
                            className={`inline-flex items-center gap-[4px] rounded-full px-[12px] py-[6px] text-[13px] font-semibold ring-1 transition-colors ${filtros.calificacion === estrellas ? 'bg-slate-900 text-white ring-slate-900' : 'bg-white ring-slate-200 hover:ring-slate-900'}`}
                        >
                            {estrellas} <Icono nombre="estrella" className="size-[13px] fill-amber-400 text-amber-400" grosor={1.5} /> o más
                        </button>
                    ))}
                </div>
            </GrupoFiltro>
        </div>
    );

    return (
        <main className={`${ANCHO_SECCION} flex-1`}>
            <EncabezadoPagina
                titulo={titulo}
                descripcion={descripcion}
                migas={[{ texto: 'Inicio', a: '/' }, { texto: titulo }]}
            />

            <section className="bg-white/55 backdrop-blur-md rounded-[12.5px] p-[16px] sm:p-[25px] ring-1 ring-white/80 shadow-[0_8px_30px_rgba(15,23,42,.08)]">
                <div className="flex flex-wrap items-center justify-between gap-[12px]">
                    <p role="status" className="text-[14px] text-slate-600">
                        <b className="text-slate-900">{resultados.length}</b> {resultados.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                    </p>
                    <div className="flex items-center gap-[10px]">
                        <button type="button" onClick={() => setCajonAbierto(true)} className={`${BOTON_SECUNDARIO} lg:hidden !py-[7px]`}>
                            <Icono nombre="filtros" className="size-[16px]" /> Filtros
                            {chips.length > 0 && <span className="grid place-items-center size-[20px] rounded-full bg-slate-900 text-[11px] text-white">{chips.length}</span>}
                        </button>
                        <label className="flex items-center gap-[8px] text-[13px] text-slate-600">
                            <span className="hidden sm:inline">Ordenar por</span>
                            <select
                                value={orden}
                                onChange={(e) => cambiar('orden', e.target.value)}
                                className="rounded-[10px] border-2 border-white/80 bg-white/70 backdrop-blur px-[10px] py-[7px] text-[13px] font-semibold text-slate-900 focus:border-sky-700 focus:outline-none"
                            >
                                {ORDENES.map((opcion) => <option key={opcion.valor} value={opcion.valor}>{opcion.texto}</option>)}
                            </select>
                        </label>
                    </div>
                </div>

                {chips.length > 0 && (
                    <ul className="mt-[14px] flex flex-wrap items-center gap-[8px]">
                        {chips.map((chip) => (
                            <li key={chip.texto}>
                                <button type="button" onClick={chip.quitar} aria-label={`Quitar filtro ${chip.texto}`} className="inline-flex items-center gap-[6px] rounded-full bg-sky-50 px-[12px] py-[5px] text-[13px] font-medium text-sky-900 ring-1 ring-sky-200 hover:bg-sky-100">
                                    {chip.texto} <Icono nombre="cerrar" className="size-[13px]" grosor={2.5} />
                                </button>
                            </li>
                        ))}
                        <li><button type="button" onClick={limpiar} className="text-[13px] font-semibold text-sky-700 hover:underline">Limpiar filtros</button></li>
                    </ul>
                )}

                <div className="mt-[20px] grid gap-[24px] lg:grid-cols-[260px_1fr]">
                    <aside aria-label="Filtros" className="hidden lg:block rounded-[12px] p-[18px] ring-1 ring-slate-200 self-start sticky top-[110px]">
                        {panelFiltros}
                    </aside>

                    <div>
                        {!baseDatos ? (
                            <p role="status" className="py-[60px] text-center text-slate-500">Cargando productos…</p>
                        ) : resultados.length === 0 ? (
                            <div className="flex flex-col items-center gap-[10px] py-[50px] text-center">
                                <span className="grid place-items-center size-[72px] rounded-full bg-sky-50 text-sky-700">
                                    <Icono nombre="paquete" className="size-[34px]" grosor={1.6} />
                                </span>
                                <p className="text-[17px] font-semibold">
                                    {categoriaFija ? `Pronto tendremos ${nombreCategoria(categoriaFija).toLowerCase()}` : 'No encontramos productos con esos filtros'}
                                </p>
                                <p className="max-w-[380px] text-[14px] text-slate-500">
                                    {categoriaFija ? 'Estamos armando esta categoría. Mientras tanto, mira nuestros dinosaurios mordelones.' : 'Prueba quitando algún filtro o buscando con otra palabra.'}
                                </p>
                                <div className="pt-[10px] flex flex-wrap justify-center gap-[10px]">
                                    {chips.length > 0 && <button type="button" onClick={limpiar} className={BOTON_SECUNDARIO}>Limpiar filtros</button>}
                                    {categoriaFija && <Link to="/dinosaurios" className={BOTON_PRINCIPAL}>Ver dinosaurios</Link>}
                                </div>
                            </div>
                        ) : (
                            <ul className="grid grid-cols-[repeat(auto-fill,275px)] justify-center gap-[20px]">
                                {resultados.map((producto) => (
                                    <li key={`${producto.brand}-${producto.name}`}><TarjetaProducto producto={producto} /></li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </section>

            {/* cajon de filtros en celular, desde la izquierda */}
            <div className={`fixed inset-0 z-[70] lg:hidden ${cajonAbierto ? 'visible' : 'invisible'}`}>
                <div className={`absolute inset-0 bg-slate-900/25 backdrop-blur-sm transition-opacity duration-300 ${cajonAbierto ? 'opacity-100' : 'opacity-0'}`} onClick={() => setCajonAbierto(false)} />
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Filtros"
                    className={`absolute left-0 top-0 h-full w-[300px] max-w-[85vw] flex flex-col bg-white/75 backdrop-blur-xl ring-1 ring-white/80 transition-transform duration-300 ${cajonAbierto ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className="flex items-center justify-between px-[18px] h-[64px] border-b border-slate-100">
                        <p className="text-[16px] font-bold">Filtros</p>
                        <button type="button" onClick={() => setCajonAbierto(false)} aria-label="Cerrar filtros" className="grid place-items-center size-[36px] rounded-full hover:bg-slate-100">
                            <Icono nombre="cerrar" className="size-[20px]" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto scroll-fino p-[18px]">{panelFiltros}</div>
                    <div className="flex gap-[10px] p-[14px] border-t border-slate-100">
                        <button type="button" onClick={limpiar} className={`${BOTON_SECUNDARIO} flex-1`}>Limpiar</button>
                        <button type="button" onClick={() => setCajonAbierto(false)} className={`${BOTON_PRINCIPAL} flex-1`}>Ver {resultados.length}</button>
                    </div>
                </div>
            </div>
        </main>
    );
}

function GrupoFiltro({ titulo, children } : { titulo : string; children : ReactNode }) {
    return (
        <fieldset>
            <legend className="mb-[10px] text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">{titulo}</legend>
            {children}
        </fieldset>
    );
}

function Interruptor({ activo, onCambiar, children } : { activo : boolean; onCambiar : (valor : boolean) => void; children : ReactNode }) {
    return (
        <label className="flex items-center justify-between gap-[10px] rounded-[8px] px-[8px] py-[6px] text-[14px] cursor-pointer hover:bg-sky-50">
            {children}
            <input type="checkbox" checked={activo} onChange={(e) => onCambiar(e.target.checked)} className="peer sr-only" />
            <span className="relative h-[22px] w-[38px] shrink-0 rounded-full bg-slate-300 transition-colors peer-checked:bg-slate-900 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-sky-700 after:absolute after:left-[3px] after:top-[3px] after:size-[16px] after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-[16px]" />
        </label>
    );
}

import { useState, type FormEvent } from 'react';

import Modal from './Modal';
import SubirImagenes from './SubirImagenes';
import { AntesDespues, VistaBanner, VistaPantallas } from './Vistas';
import Icono from '../Icono';
import { BOTON_PRINCIPAL, BOTON_SECUNDARIO, ETIQUETA_CAMPO, INPUT, MARINO_BLANCO, MARINO_CIELO, MARINO_HIELO, TARJETA } from '../ui';
import { admin } from '../../api';
import { useStore } from '../../context/StoreContext';
import { CATEGORIAS, rutaProducto } from '../../datos/tienda';
import type { DatosBanner } from '../BannerInicio';
import { POSICIONES_BANNER, type Banner, type PosicionBanner, type TemaBanner } from '../../../../shared/types';

const NOMBRES : Record<PosicionBanner, { titulo : string; ayuda : string }> = {
    'ofertas-principal': { titulo: 'Ofertas · principal', ayuda: 'El banner grande de la sección Ofertas' },
    'ofertas-1': { titulo: 'Ofertas · secundario 1', ayuda: 'A la derecha, arriba' },
    'ofertas-2': { titulo: 'Ofertas · secundario 2', ayuda: 'A la derecha, al medio' },
    'ofertas-3': { titulo: 'Ofertas · secundario 3', ayuda: 'A la derecha, abajo' },
    'nuevos-1': { titulo: 'Nuevos ingresos · grande 1', ayuda: 'Fila de arriba, izquierda' },
    'nuevos-2': { titulo: 'Nuevos ingresos · grande 2', ayuda: 'Fila de arriba, derecha' },
    'nuevos-3': { titulo: 'Nuevos ingresos · pequeño 1', ayuda: 'Fila de abajo' },
    'nuevos-4': { titulo: 'Nuevos ingresos · pequeño 2', ayuda: 'Fila de abajo' },
    'nuevos-5': { titulo: 'Nuevos ingresos · pequeño 3', ayuda: 'Fila de abajo' },
};

const TEMAS : { valor : TemaBanner; texto : string; clase : string }[] = [
    { valor: 'hielo', texto: 'Marino → hielo', clase: MARINO_HIELO },
    { valor: 'blanco', texto: 'Marino → blanco', clase: MARINO_BLANCO },
    { valor: 'cielo', texto: 'Marino → cielo', clase: MARINO_CIELO },
];

type Borrador = DatosBanner;

export default function PanelBanners({ onAviso } : { onAviso : (mensaje : string) => void }) {
    const { banners, baseDatos, recargarDatos } = useStore();
    const productos = baseDatos ?? [];
    const [editando, setEditando] = useState<PosicionBanner | null>(null);

    const restablecer = async (posicion : PosicionBanner) => {
        try {
            await admin.borrarBanner(posicion);
            await recargarDatos();
            onAviso(`${NOMBRES[posicion].titulo} vuelve a ser automático`);
        } catch (e) {
            onAviso((e as Error).message);
        }
    };

    return (
        <div className="flex flex-col gap-[16px]">
            <p className="flex items-start gap-[10px] rounded-[12px] bg-sky-50 p-[14px] text-[13px] text-sky-900">
                <Icono nombre="info" className="size-[18px] shrink-0" />
                Cada posición del inicio es <b>automática</b> (se arma con los productos en oferta o los más recientes) hasta que le subas un banner. Con “Volver a automático” se quita el tuyo.
            </p>
            <ul className="grid gap-[14px] sm:grid-cols-2 xl:grid-cols-3">
                {POSICIONES_BANNER.map((posicion) => {
                    const banner = banners.find((item) => item.posicion === posicion);
                    return (
                        <li key={posicion} className={`${TARJETA} !p-[16px] flex flex-col gap-[12px]`}>
                            <div className="flex items-start justify-between gap-[10px]">
                                <div>
                                    <p className="text-[14px] font-bold">{NOMBRES[posicion].titulo}</p>
                                    <p className="text-[12px] text-slate-500">{NOMBRES[posicion].ayuda}</p>
                                </div>
                                <span className={`shrink-0 rounded-full px-[8px] py-[3px] text-[11px] font-bold ${banner ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                                    {banner ? 'Personalizado' : 'Automático'}
                                </span>
                            </div>
                            <figure>
                                <figcaption className="mb-[6px] flex items-center gap-[6px] text-[11px] font-semibold uppercase tracking-[.08em] text-slate-500">
                                    <Icono nombre="ojo" className="size-[13px]" /> Así se ve actualmente en el inicio
                                </figcaption>
                                <VistaBanner posicion={posicion} subido={banner} productos={productos} />
                            </figure>
                            {banner && <p className="text-[12px] text-slate-500">Lleva a <code className="rounded bg-slate-100 px-[4px]">{banner.enlace}</code> · {new Date(banner.actualizado).toLocaleDateString('es-PE')}</p>}
                            <div className="mt-auto flex gap-[8px]">
                                <button type="button" onClick={() => setEditando(posicion)} className={`${BOTON_PRINCIPAL} flex-1 !py-[8px] !text-[13px]`}>
                                    <Icono nombre={banner ? 'lapiz' : 'mas'} className="size-[15px]" /> {banner ? 'Editar' : 'Subir banner'}
                                </button>
                                {banner && (
                                    <button type="button" onClick={() => restablecer(posicion)} title="Volver a automático" className={`${BOTON_SECUNDARIO} !py-[6px] !px-[12px] !text-[13px]`}>
                                        <Icono nombre="recargar" className="size-[15px]" /> Automático
                                    </button>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>

            {editando && (
                <FormularioBanner
                    posicion={editando}
                    banner={banners.find((item) => item.posicion === editando)}
                    onCerrar={() => setEditando(null)}
                    onGuardado={async () => {
                        const nombre = NOMBRES[editando].titulo;
                        setEditando(null);
                        await recargarDatos();
                        onAviso(`Se guardó ${nombre}`);
                    }}
                />
            )}
        </div>
    );
}

interface FormularioBannerProps {
    posicion : PosicionBanner;
    banner?: Banner;
    onCerrar : () => void;
    onGuardado : () => void;
}

function FormularioBanner({ posicion, banner, onCerrar, onGuardado } : FormularioBannerProps) {
    const { baseDatos } = useStore();
    const productos = baseDatos ?? [];
    const [datos, setDatos] = useState<Borrador>({
        titulo: banner?.titulo ?? '',
        subtitulo: banner?.subtitulo ?? '',
        etiqueta: banner?.etiqueta ?? (posicion.startsWith('ofertas') ? '-20%' : 'Nuevo'),
        imagen: banner?.imagen ?? '',
        enlace: banner?.enlace ?? '/promociones',
        tema: banner?.tema ?? 'hielo',
    });
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');

    const vistaDespues = { ...datos, titulo: datos.titulo || 'Título del banner' };
    const cambiar = <K extends keyof Borrador>(clave : K, valor : Borrador[K]) => setDatos((actual) => ({ ...actual, [clave]: valor }));

    // destinos sugeridos; "Otra ruta" deja escribir cualquier ruta interna
    const destinos = [
        { valor: '/promociones', texto: 'Ofertas' },
        { valor: '/productos', texto: 'Todos los productos' },
        ...CATEGORIAS.map((categoria) => ({ valor: `/${categoria.slug}`, texto: `Categoría: ${categoria.nombre}` })),
        ...productos.map((producto) => ({ valor: rutaProducto(producto), texto: `Producto: ${producto.name}` })),
    ];
    const destinoConocido = destinos.some((destino) => destino.valor === datos.enlace);

    const onSubmit = async (e : FormEvent) => {
        e.preventDefault();
        setGuardando(true);
        setError('');
        try {
            await admin.guardarBanner(posicion, datos);
            onGuardado();
        } catch (e) {
            setError((e as Error).message);
            setGuardando(false);
        }
    };

    return (
        <Modal
            titulo={`Banner: ${NOMBRES[posicion].titulo}`}
            onCerrar={onCerrar}
            ancho="max-w-[1100px]"
            pie={
                <>
                    {error && <p role="alert" className="mr-auto self-center text-[13px] font-medium text-red-600">{error}</p>}
                    <button type="button" onClick={onCerrar} className={BOTON_SECUNDARIO}>Cancelar</button>
                    <button type="submit" form="formulario-banner" disabled={guardando} className={BOTON_PRINCIPAL}>
                        <Icono nombre="check" className="size-[16px]" grosor={2.5} /> {guardando ? 'Guardando…' : 'Publicar banner'}
                    </button>
                </>
            }
        >
            <div className="grid gap-[20px] lg:grid-cols-[1fr_440px]">
                <form id="formulario-banner" onSubmit={onSubmit} className="flex flex-col gap-[14px]">
                    <label>
                        <span className={ETIQUETA_CAMPO}>Título</span>
                        <input required maxLength={80} value={datos.titulo} onChange={(e) => cambiar('titulo', e.target.value)} className={INPUT} placeholder="Semana del dinosaurio" />
                    </label>
                    <label>
                        <span className={ETIQUETA_CAMPO}>Texto (opcional)</span>
                        <input maxLength={140} value={datos.subtitulo} onChange={(e) => cambiar('subtitulo', e.target.value)} className={INPUT} placeholder="Todos los mordelones con envío gratis" />
                    </label>
                    <label>
                        <span className={ETIQUETA_CAMPO}>Etiqueta (opcional)</span>
                        <input maxLength={20} value={datos.etiqueta} onChange={(e) => cambiar('etiqueta', e.target.value)} className={INPUT} placeholder="-30% · Nuevo · 2x1" />
                    </label>
                    <fieldset>
                        <legend className={ETIQUETA_CAMPO}>Color</legend>
                        <div className="flex flex-wrap gap-[8px]">
                            {TEMAS.map((tema) => (
                                <button
                                    key={tema.valor}
                                    type="button"
                                    aria-pressed={datos.tema === tema.valor}
                                    onClick={() => cambiar('tema', tema.valor)}
                                    className={`flex items-center gap-[8px] rounded-full py-[5px] pl-[5px] pr-[12px] text-[13px] font-semibold ring-2 ${datos.tema === tema.valor ? 'ring-slate-900' : 'ring-slate-200 hover:ring-slate-400'}`}
                                >
                                    <span className={`size-[24px] rounded-full ${tema.clase}`} /> {tema.texto}
                                </button>
                            ))}
                        </div>
                    </fieldset>
                    <label>
                        <span className={ETIQUETA_CAMPO}>Al hacer clic lleva a</span>
                        <select value={destinoConocido ? datos.enlace : 'otra'} onChange={(e) => cambiar('enlace', e.target.value === 'otra' ? '/' : e.target.value)} className={INPUT}>
                            {destinos.map((destino) => <option key={destino.valor} value={destino.valor}>{destino.texto}</option>)}
                            <option value="otra">Otra ruta de la tienda…</option>
                        </select>
                    </label>
                    {!destinoConocido && (
                        <label>
                            <span className={ETIQUETA_CAMPO}>Ruta</span>
                            <input required pattern="/.*" value={datos.enlace} onChange={(e) => cambiar('enlace', e.target.value)} className={INPUT} placeholder="/contacto" />
                        </label>
                    )}
                    <div>
                        <span className={ETIQUETA_CAMPO}>Imagen (opcional)</span>
                        <SubirImagenes imagenes={datos.imagen ? [datos.imagen] : []} onCambiar={(lista) => cambiar('imagen', lista[0] ?? '')} maximo={1} portada={false} />
                        {!datos.imagen && productos.length > 0 && (
                            <select value="" onChange={(e) => cambiar('imagen', e.target.value)} className={`${INPUT} mt-[8px]`} aria-label="Usar la foto de un producto">
                                <option value="">…o usar la foto de un producto</option>
                                {productos.map((producto) => <option key={String(producto.id)} value={producto.img[0]}>{producto.name}</option>)}
                            </select>
                        )}
                    </div>
                </form>
                <div className="lg:sticky lg:top-0 self-start">
                    <AntesDespues
                        antes={<VistaBanner posicion={posicion} subido={banner} productos={productos} />}
                        despues={<VistaBanner posicion={posicion} subido={vistaDespues} productos={productos} />}
                    />
                </div>
            </div>
            <div className="mt-[24px] border-t border-slate-200 pt-[20px]">
                <VistaPantallas mensaje={{ tipo: 'banner', posicion, banner: vistaDespues }} />
            </div>
        </Modal>
    );
}

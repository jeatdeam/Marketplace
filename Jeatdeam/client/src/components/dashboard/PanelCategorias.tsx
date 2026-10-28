import { useState } from 'react';

import Modal from './Modal';
import SubirImagenes from './SubirImagenes';
import { AntesDespues, SinVista, VistaCategoria, VistaPantallas } from './Vistas';
import Icono from '../Icono';
import { BOTON_PRINCIPAL, BOTON_SECUNDARIO, ETIQUETA_CAMPO, TARJETA } from '../ui';
import { admin } from '../../api';
import { useStore } from '../../context/StoreContext';
import type { Categoria } from '../../datos/tienda';

// imagenes del mosaico de categorias del inicio (tambien salen en los menus)
export default function PanelCategorias({ onAviso } : { onAviso : (mensaje : string) => void }) {
    const { categorias, apariencia, recargarDatos } = useStore();
    const [editando, setEditando] = useState<number | null>(null);

    const restaurar = async (categoria : Categoria) => {
        try {
            await admin.borrarCategoria(categoria.slug);
            await recargarDatos();
            onAviso(`${categoria.nombre} vuelve a su imagen original`);
        } catch (e) {
            onAviso((e as Error).message);
        }
    };

    return (
        <div className="flex flex-col gap-[16px]">
            <p className="flex items-start gap-[10px] rounded-[12px] bg-sky-50 p-[14px] text-[13px] text-sky-900">
                <Icono nombre="info" className="size-[18px] shrink-0" />
                Son las cajas del mosaico “Categorías” del inicio, en el mismo orden. La imagen también aparece en los menús. Con “Original” vuelve la imagen de siempre.
            </p>
            <ul className="grid gap-[14px] sm:grid-cols-2 xl:grid-cols-3">
                {categorias.map((categoria, indice) => {
                    const cambiada = Boolean(apariencia.categorias[categoria.slug]);
                    return (
                        <li key={categoria.slug} className={`${TARJETA} !p-[16px] flex flex-col gap-[12px]`}>
                            <div className="flex items-start justify-between gap-[10px]">
                                <div>
                                    <p className="text-[14px] font-bold">{categoria.nombre}</p>
                                    <p className="text-[12px] text-slate-500">Caja {indice + 1} del mosaico</p>
                                </div>
                                <span className={`shrink-0 rounded-full px-[8px] py-[3px] text-[11px] font-bold ${cambiada ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                                    {cambiada ? 'Personalizada' : 'Original'}
                                </span>
                            </div>
                            <figure>
                                <figcaption className="mb-[6px] flex items-center gap-[6px] text-[11px] font-semibold uppercase tracking-[.08em] text-slate-500">
                                    <Icono nombre="ojo" className="size-[13px]" /> Así se ve actualmente en el inicio
                                </figcaption>
                                <VistaCategoria categoria={categoria} indice={indice} />
                            </figure>
                            <div className="mt-auto flex gap-[8px]">
                                <button type="button" onClick={() => setEditando(indice)} className={`${BOTON_PRINCIPAL} flex-1 !py-[8px] !text-[13px]`}>
                                    <Icono nombre="imagen" className="size-[15px]" /> Cambiar imagen
                                </button>
                                {cambiada && (
                                    <button type="button" onClick={() => restaurar(categoria)} title="Volver a la imagen original" className={`${BOTON_SECUNDARIO} !py-[6px] !px-[12px] !text-[13px]`}>
                                        <Icono nombre="recargar" className="size-[15px]" /> Original
                                    </button>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>

            {editando !== null && (
                <FormularioCategoria
                    categoria={categorias[editando]}
                    indice={editando}
                    onCerrar={() => setEditando(null)}
                    onGuardado={async () => {
                        const nombre = categorias[editando].nombre;
                        setEditando(null);
                        await recargarDatos();
                        onAviso(`Se cambió la imagen de ${nombre}`);
                    }}
                />
            )}
        </div>
    );
}

interface FormularioCategoriaProps {
    categoria : Categoria;
    indice : number;
    onCerrar : () => void;
    onGuardado : () => void;
}

function FormularioCategoria({ categoria, indice, onCerrar, onGuardado } : FormularioCategoriaProps) {
    const [imagen, setImagen] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');

    const guardar = async () => {
        setGuardando(true);
        setError('');
        try {
            await admin.guardarCategoria(categoria.slug, imagen);
            onGuardado();
        } catch (e) {
            setError((e as Error).message);
            setGuardando(false);
        }
    };

    return (
        <Modal
            titulo={`Categoría: ${categoria.nombre}`}
            onCerrar={onCerrar}
            ancho="max-w-[900px]"
            pie={
                <>
                    {error && <p role="alert" className="mr-auto self-center text-[13px] font-medium text-red-600">{error}</p>}
                    <button type="button" onClick={onCerrar} className={BOTON_SECUNDARIO}>Cancelar</button>
                    <button type="button" onClick={guardar} disabled={guardando || !imagen} className={BOTON_PRINCIPAL}>
                        <Icono nombre="check" className="size-[16px]" grosor={2.5} /> {guardando ? 'Guardando…' : 'Publicar imagen'}
                    </button>
                </>
            }
        >
            <div className="flex flex-col gap-[20px]">
                <div>
                    <span className={ETIQUETA_CAMPO}>Nueva imagen</span>
                    <SubirImagenes imagenes={imagen ? [imagen] : []} onCambiar={(lista) => setImagen(lista[0] ?? '')} maximo={1} portada={false} />
                    <p className="mt-[4px] text-[12px] text-slate-500">Se recorta para llenar la caja y lleva un velo oscuro para que el nombre se lea. Mejor una foto horizontal.</p>
                </div>
                <AntesDespues
                    lado
                    antes={<VistaCategoria categoria={categoria} indice={indice} />}
                    despues={imagen ? <VistaCategoria categoria={{ ...categoria, imagen }} indice={indice} /> : <SinVista texto="Sube una imagen para ver cómo quedará" />}
                />
                {imagen && <VistaPantallas mensaje={{ tipo: 'categoria', slug: categoria.slug, imagen }} />}
            </div>
        </Modal>
    );
}

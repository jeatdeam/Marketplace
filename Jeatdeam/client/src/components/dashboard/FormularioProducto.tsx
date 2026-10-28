import { useState, type FormEvent, type ReactNode } from 'react';

import Modal from './Modal';
import SubirImagenes from './SubirImagenes';
import Icono from '../Icono';
import { BOTON_PRINCIPAL, BOTON_SECUNDARIO, ETIQUETA_CAMPO, INPUT } from '../ui';
import { admin } from '../../api';
import { CATEGORIAS, formatoSoles, precioSoles } from '../../datos/tienda';
import type { Product, ProductoEntrada } from '../../../../shared/types';

function Campo({ etiqueta, children, className = '', ayuda } : { etiqueta : string; children : ReactNode; className?: string; ayuda?: string }) {
    return (
        <label className={`block ${className}`}>
            <span className={ETIQUETA_CAMPO}>{etiqueta}</span>
            {children}
            {ayuda && <span className="mt-[4px] block text-[12px] text-slate-500">{ayuda}</span>}
        </label>
    );
}

interface FormularioProductoProps {
    producto : Product | null; // null = nuevo
    onCerrar : () => void;
    onGuardado : (mensaje : string) => void;
}

export default function FormularioProducto({ producto, onCerrar, onGuardado } : FormularioProductoProps) {
    const [datos, setDatos] = useState<ProductoEntrada>(() => ({
        name: producto?.name ?? '',
        subtitle: producto?.subtitle ?? '',
        brand: producto?.brand ?? 'Juguete mordelon',
        category: producto?.category ?? 'dinosaurios',
        price: producto ? precioSoles(producto.price) : 0,
        img: producto?.img ?? [],
        descuento: producto?.descuento ?? 0,
        stock: producto?.stock ?? 10,
        nuevo: producto?.nuevo ?? !producto,
        descripcion: producto?.descripcion ?? '',
        caracteristicas: producto?.caracteristicas ?? [],
    }));
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');

    const cambiar = <K extends keyof ProductoEntrada>(clave : K, valor : ProductoEntrada[K]) => setDatos((actual) => ({ ...actual, [clave]: valor }));

    const precioFinal = datos.price * (1 - (datos.descuento ?? 0) / 100);

    const onSubmit = async (e : FormEvent) => {
        e.preventDefault();
        if (!datos.img.length) {
            setError('Agrega al menos una imagen');
            return;
        }
        setGuardando(true);
        setError('');
        try {
            if (producto) await admin.editarProducto(String(producto.id), datos);
            else await admin.crearProducto(datos);
            onGuardado(producto ? `Se guardaron los cambios de "${datos.name}"` : `"${datos.name}" ya está en la tienda`);
        } catch (e) {
            setError((e as Error).message);
            setGuardando(false);
        }
    };

    return (
        <Modal
            titulo={producto ? `Editar ${producto.name}` : 'Nuevo producto'}
            onCerrar={onCerrar}
            pie={
                <>
                    {error && <p role="alert" className="mr-auto self-center text-[13px] font-medium text-red-600">{error}</p>}
                    <button type="button" onClick={onCerrar} className={BOTON_SECUNDARIO}>Cancelar</button>
                    <button type="submit" form="formulario-producto" disabled={guardando} className={BOTON_PRINCIPAL}>
                        <Icono nombre="check" className="size-[16px]" grosor={2.5} /> {guardando ? 'Guardando…' : producto ? 'Guardar cambios' : 'Crear producto'}
                    </button>
                </>
            }
        >
            <form id="formulario-producto" onSubmit={onSubmit} className="flex flex-col gap-[18px]">
                <div className="grid sm:grid-cols-2 gap-[14px]">
                    <Campo etiqueta="Nombre corto" ayuda="Va en la URL: sin / ? # %">
                        <input required value={datos.name} onChange={(e) => cambiar('name', e.target.value)} className={INPUT} placeholder="T-rex" maxLength={60} />
                    </Campo>
                    <Campo etiqueta="Marca">
                        <input required value={datos.brand} onChange={(e) => cambiar('brand', e.target.value)} className={INPUT} placeholder="Juguete mordelon" maxLength={60} />
                    </Campo>
                    <Campo etiqueta="Título completo" className="sm:col-span-2">
                        <input required value={datos.subtitle} onChange={(e) => cambiar('subtitle', e.target.value)} className={INPUT} placeholder="Juguete mordelón tipo dinosaurio, articulado y texturizado" maxLength={140} />
                    </Campo>
                    <Campo etiqueta="Categoría">
                        <select value={datos.category} onChange={(e) => cambiar('category', e.target.value)} className={INPUT}>
                            {CATEGORIAS.map((categoria) => <option key={categoria.slug} value={categoria.slug}>{categoria.nombre}</option>)}
                        </select>
                    </Campo>
                    <Campo etiqueta="Stock (unidades)">
                        <input type="number" min={0} step={1} required value={datos.stock} onChange={(e) => cambiar('stock', Number(e.target.value))} className={INPUT} />
                    </Campo>
                </div>

                <fieldset className="rounded-[12px] ring-1 ring-slate-200 p-[14px]">
                    <legend className="px-[6px] text-[14px] font-bold">Precio y promoción</legend>
                    <div className="grid sm:grid-cols-3 gap-[14px]">
                        <Campo etiqueta="Precio (S/)">
                            <input type="number" min={0} step="0.01" required value={datos.price} onChange={(e) => cambiar('price', Number(e.target.value))} className={INPUT} />
                        </Campo>
                        <Campo etiqueta="Descuento (%)" ayuda="0 = sin oferta">
                            <input type="number" min={0} max={90} step={1} value={datos.descuento} onChange={(e) => cambiar('descuento', Number(e.target.value))} className={INPUT} />
                        </Campo>
                        <div className="rounded-[10px] bg-[#f3f9fd] p-[12px]">
                            <span className={ETIQUETA_CAMPO}>Así se verá</span>
                            {datos.descuento ? (
                                <>
                                    <s className="block text-[12px] text-slate-400">{formatoSoles(datos.price)}</s>
                                    <span className="text-[18px] font-extrabold text-red-600">{formatoSoles(precioFinal)}</span>
                                    <span className="ml-[6px] rounded-full bg-red-600 px-[6px] py-[1px] text-[11px] font-bold text-white">-{datos.descuento}%</span>
                                </>
                            ) : (
                                <span className="text-[18px] font-extrabold">{formatoSoles(datos.price)}</span>
                            )}
                        </div>
                    </div>
                    <label className="mt-[12px] flex items-center gap-[10px] text-[14px]">
                        <input type="checkbox" checked={Boolean(datos.nuevo)} onChange={(e) => cambiar('nuevo', e.target.checked)} className="size-[16px] accent-slate-900" />
                        Marcar como <b>Nuevo</b> (etiqueta amarilla en la tarjeta)
                    </label>
                </fieldset>

                <div>
                    <span className={ETIQUETA_CAMPO}>Imágenes (1 a 8)</span>
                    <SubirImagenes imagenes={datos.img} onCambiar={(img) => cambiar('img', img)} />
                </div>

                <Campo etiqueta="Descripción">
                    <textarea rows={3} value={datos.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} className={`${INPUT} resize-y`} placeholder="Cuenta qué lo hace especial" maxLength={1200} />
                </Campo>
                <Campo etiqueta="Características" ayuda="Una por línea; se muestran con un check en el detalle">
                    <textarea
                        rows={4}
                        value={(datos.caracteristicas ?? []).join('\n')}
                        onChange={(e) => cambiar('caracteristicas', e.target.value.split('\n'))}
                        className={`${INPUT} resize-y`}
                        placeholder={'Mandíbula articulada\nMaterial libre de BPA'}
                    />
                </Campo>
            </form>
        </Modal>
    );
}

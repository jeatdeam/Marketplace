import { useState } from 'react';
import { Link } from 'react-router-dom';

import FormularioProducto from './FormularioProducto';
import Modal from './Modal';
import Icono, { type NombreIcono } from '../Icono';
import { BOTON_PRINCIPAL, BOTON_SECUNDARIO, INPUT, TARJETA } from '../ui';
import { admin } from '../../api';
import { useStore } from '../../context/StoreContext';
import { datosProducto, formatoSoles, nombreCategoria, normalizar, rutaProducto } from '../../datos/tienda';
import type { Product } from '../../../../shared/types';

const STOCK_BAJO = 5;

export default function PanelProductos({ onAviso } : { onAviso : (mensaje : string) => void }) {
    const { baseDatos, recargarDatos } = useStore();
    const [editando, setEditando] = useState<Product | null | 'nuevo'>(null);
    const [borrando, setBorrando] = useState<Product | null>(null);
    const [consulta, setConsulta] = useState('');
    const [filtro, setFiltro] = useState<'todos' | 'oferta' | 'bajo'>('todos');

    const productos = baseDatos ?? [];
    const conDatos = productos.map((producto) => ({ producto, datos: datosProducto(producto) }));
    const palabras = normalizar(consulta).split(/\s+/).filter(Boolean);
    const visibles = conDatos.filter(({ producto, datos }) => {
        if (filtro === 'oferta' && !datos.descuento) return false;
        if (filtro === 'bajo' && datos.stock > STOCK_BAJO) return false;
        const texto = normalizar(`${producto.name} ${producto.brand} ${producto.category}`);
        return palabras.every((palabra) => texto.includes(palabra));
    });

    const estadisticas : { icono : NombreIcono; texto : string; valor : number; filtro : typeof filtro }[] = [
        { icono: 'paquete', texto: 'Productos', valor: productos.length, filtro: 'todos' },
        { icono: 'etiqueta', texto: 'En oferta', valor: conDatos.filter(({ datos }) => datos.descuento > 0).length, filtro: 'oferta' },
        { icono: 'alerta', texto: `Stock bajo (≤ ${STOCK_BAJO})`, valor: conDatos.filter(({ datos }) => datos.stock <= STOCK_BAJO).length, filtro: 'bajo' },
    ];

    const alGuardar = async (mensaje : string) => {
        setEditando(null);
        await recargarDatos();
        onAviso(mensaje);
    };

    const confirmarBorrado = async () => {
        if (!borrando) return;
        try {
            await admin.borrarProducto(String(borrando.id));
            await recargarDatos();
            onAviso(`Se eliminó "${borrando.name}"`);
        } catch (e) {
            onAviso((e as Error).message);
        }
        setBorrando(null);
    };

    return (
        <div className="flex flex-col gap-[16px]">
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-[12px]">
                {estadisticas.map((item) => (
                    <li key={item.texto}>
                        <button
                            type="button"
                            onClick={() => setFiltro(item.filtro)}
                            aria-pressed={filtro === item.filtro}
                            className={`w-full flex items-center gap-[12px] bg-white/55 backdrop-blur-md rounded-[12.5px] p-[16px] text-left transition-shadow ${filtro === item.filtro ? 'shadow-[0_0_0_2px_#0f172a]' : 'ring-1 ring-white/80 shadow-[0_8px_30px_rgba(15,23,42,.08)] hover:shadow-[0_14px_40px_rgba(15,23,42,.18)]'}`}
                        >
                            <span className={`grid place-items-center size-[44px] rounded-[12px] ${item.filtro === 'bajo' && item.valor ? 'bg-amber-100 text-amber-700' : 'bg-sky-50 text-sky-700'}`}>
                                <Icono nombre={item.icono} className="size-[22px]" />
                            </span>
                            <span>
                                <span className="block text-[24px] font-extrabold leading-none">{item.valor}</span>
                                <span className="block text-[13px] text-slate-500">{item.texto}</span>
                            </span>
                        </button>
                    </li>
                ))}
            </ul>

            <section className={`${TARJETA} !p-0 overflow-hidden`}>
                <div className="flex flex-wrap items-center gap-[10px] p-[16px] border-b border-slate-100">
                    <div className="relative flex-1 min-w-[200px]">
                        <Icono nombre="buscar" className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[16px] text-slate-400" />
                        <input type="search" value={consulta} onChange={(e) => setConsulta(e.target.value)} placeholder="Buscar por nombre, marca o categoría" aria-label="Buscar productos" className={`${INPUT} pl-[36px]`} />
                    </div>
                    <button type="button" onClick={() => setEditando('nuevo')} className={BOTON_PRINCIPAL}>
                        <Icono nombre="mas" className="size-[17px]" grosor={2.5} /> Nuevo producto
                    </button>
                </div>

                {visibles.length === 0 ? (
                    <p className="p-[30px] text-center text-[14px] text-slate-500">No hay productos con ese filtro.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-[14px]">
                            <thead className="bg-[#f3f9fd] text-[12px] uppercase tracking-[0.08em] text-slate-500">
                                <tr>
                                    <th scope="col" className="px-[16px] py-[10px] font-semibold">Producto</th>
                                    <th scope="col" className="px-[16px] py-[10px] font-semibold">Categoría</th>
                                    <th scope="col" className="px-[16px] py-[10px] font-semibold">Precio</th>
                                    <th scope="col" className="px-[16px] py-[10px] font-semibold">Stock</th>
                                    <th scope="col" className="px-[16px] py-[10px] font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {visibles.map(({ producto, datos }) => (
                                    <tr key={String(producto.id)} className="hover:bg-slate-50/60">
                                        <td className="px-[16px] py-[10px]">
                                            <div className="flex items-center gap-[12px]">
                                                <img src={producto.img[0]} alt="" className="size-[48px] shrink-0 rounded-[8px] object-cover bg-[#f3f9fd]" />
                                                <div className="min-w-0">
                                                    <p className="font-semibold flex items-center gap-[6px]">
                                                        {producto.name}
                                                        {datos.nuevo && <span className="rounded-full bg-[#facc15] px-[6px] py-[1px] text-[10px] font-bold">Nuevo</span>}
                                                    </p>
                                                    <p className="text-[12px] text-slate-500 truncate max-w-[260px]">{producto.brand}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-[16px] py-[10px] text-slate-600">{nombreCategoria(producto.category)}</td>
                                        <td className="px-[16px] py-[10px]">
                                            <span className="font-bold">{formatoSoles(datos.precio)}</span>
                                            {datos.descuento > 0 && <span className="ml-[6px] rounded-full bg-red-600 px-[6px] py-[1px] text-[11px] font-bold text-white">-{datos.descuento}%</span>}
                                        </td>
                                        <td className="px-[16px] py-[10px]">
                                            <span className={`inline-flex items-center gap-[6px] font-semibold ${datos.stock === 0 ? 'text-red-600' : datos.stock <= STOCK_BAJO ? 'text-amber-600' : 'text-emerald-700'}`}>
                                                <span className="size-[7px] rounded-full bg-current" aria-hidden="true" />
                                                {datos.stock === 0 ? 'Agotado' : datos.stock}
                                            </span>
                                        </td>
                                        <td className="px-[16px] py-[10px]">
                                            <div className="flex justify-end gap-[6px]">
                                                <Link to={rutaProducto(producto)} target="_blank" aria-label={`Ver ${producto.name} en la tienda`} title="Ver en la tienda" className="grid place-items-center size-[34px] rounded-[8px] text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                                                    <Icono nombre="externo" className="size-[17px]" />
                                                </Link>
                                                <button type="button" onClick={() => setEditando(producto)} aria-label={`Editar ${producto.name}`} title="Editar" className="grid place-items-center size-[34px] rounded-[8px] text-slate-500 hover:bg-sky-50 hover:text-sky-700">
                                                    <Icono nombre="lapiz" className="size-[17px]" />
                                                </button>
                                                <button type="button" onClick={() => setBorrando(producto)} aria-label={`Eliminar ${producto.name}`} title="Eliminar" className="grid place-items-center size-[34px] rounded-[8px] text-slate-500 hover:bg-red-50 hover:text-red-600">
                                                    <Icono nombre="tacho" className="size-[17px]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {editando && (
                <FormularioProducto
                    producto={editando === 'nuevo' ? null : editando}
                    onCerrar={() => setEditando(null)}
                    onGuardado={alGuardar}
                />
            )}

            {borrando && (
                <Modal
                    titulo="Eliminar producto"
                    ancho="max-w-[440px]"
                    onCerrar={() => setBorrando(null)}
                    pie={
                        <>
                            <button type="button" onClick={() => setBorrando(null)} className={BOTON_SECUNDARIO}>Cancelar</button>
                            <button type="button" onClick={confirmarBorrado} className={`${BOTON_PRINCIPAL} !bg-red-600 hover:!bg-red-700`}>
                                <Icono nombre="tacho" className="size-[16px]" /> Eliminar
                            </button>
                        </>
                    }
                >
                    <div className="flex items-center gap-[12px]">
                        <img src={borrando.img[0]} alt="" className="size-[56px] rounded-[10px] object-cover" />
                        <p className="text-[14px] text-slate-600">¿Eliminar <b className="text-slate-900">{borrando.name}</b> de la tienda? Esta acción no se puede deshacer.</p>
                    </div>
                </Modal>
            )}
        </div>
    );
}

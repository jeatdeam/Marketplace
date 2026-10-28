import { useState } from 'react';

import Modal from './Modal';
import SubirImagenes from './SubirImagenes';
import { AntesDespues, VistaPantallas, VistaSlider } from './Vistas';
import Icono from '../Icono';
import { BOTON_PRINCIPAL, BOTON_SECUNDARIO, ETIQUETA_CAMPO, INPUT, TARJETA } from '../ui';
import { admin } from '../../api';
import { useStore } from '../../context/StoreContext';
import { MAX_TEXTO_SLIDER, type GrupoSlider } from '../../../../shared/types';

// los 4 grupos del slider "imagen 1 / imagen 2" que abre el inicio
export default function PanelSlider({ onAviso } : { onAviso : (mensaje : string) => void }) {
    const { gruposSlider, apariencia, recargarDatos } = useStore();
    const [editando, setEditando] = useState<number | null>(null);

    const restaurar = async (indice : number) => {
        try {
            await admin.borrarGrupoSlider(indice);
            await recargarDatos();
            onAviso(`El grupo ${indice + 1} vuelve a sus fotos originales`);
        } catch (e) {
            onAviso((e as Error).message);
        }
    };

    return (
        <div className="flex flex-col gap-[16px]">
            <p className="flex items-start gap-[10px] rounded-[12px] bg-sky-50 p-[14px] text-[13px] text-sky-900">
                <Icono nombre="info" className="size-[18px] shrink-0" />
                El slider del inicio pasa por 4 grupos. En cada uno la línea separa la imagen 1 (izquierda) de la imagen 2 (derecha). Usa fotos horizontales (16:9).
            </p>
            <ul className="grid gap-[14px] md:grid-cols-2">
                {gruposSlider.map((grupo, indice) => {
                    const cambiado = Boolean(apariencia.slider[indice]);
                    return (
                        <li key={indice} className={`${TARJETA} !p-[16px] flex flex-col gap-[12px]`}>
                            <div className="flex items-start justify-between gap-[10px]">
                                <div>
                                    <p className="text-[14px] font-bold">Grupo {indice + 1}</p>
                                    <p className="text-[12px] text-slate-500">Se muestra {indice === 0 ? 'primero' : `en el lugar ${indice + 1}`}</p>
                                </div>
                                <span className={`shrink-0 rounded-full px-[8px] py-[3px] text-[11px] font-bold ${cambiado ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                                    {cambiado ? 'Personalizado' : 'Original'}
                                </span>
                            </div>
                            <figure>
                                <figcaption className="mb-[6px] flex items-center gap-[6px] text-[11px] font-semibold uppercase tracking-[.08em] text-slate-500">
                                    <Icono nombre="ojo" className="size-[13px]" /> Así se ve actualmente en el inicio
                                </figcaption>
                                <VistaSlider grupo={grupo} />
                            </figure>
                            <div className="mt-auto flex gap-[8px]">
                                <button type="button" onClick={() => setEditando(indice)} className={`${BOTON_PRINCIPAL} flex-1 !py-[8px] !text-[13px]`}>
                                    <Icono nombre="imagen" className="size-[15px]" /> Cambiar fotos
                                </button>
                                {cambiado && (
                                    <button type="button" onClick={() => restaurar(indice)} title="Volver a las fotos originales" className={`${BOTON_SECUNDARIO} !py-[6px] !px-[12px] !text-[13px]`}>
                                        <Icono nombre="recargar" className="size-[15px]" /> Original
                                    </button>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>

            {editando !== null && (
                <FormularioGrupo
                    indice={editando}
                    grupo={gruposSlider[editando]}
                    onCerrar={() => setEditando(null)}
                    onGuardado={async () => {
                        const numero = editando + 1;
                        setEditando(null);
                        await recargarDatos();
                        onAviso(`Se guardó el grupo ${numero} del slider`);
                    }}
                />
            )}
        </div>
    );
}

interface FormularioGrupoProps {
    indice : number;
    grupo : GrupoSlider;
    onCerrar : () => void;
    onGuardado : () => void;
}

// parte de las fotos actuales: se puede cambiar solo una de las dos
function FormularioGrupo({ indice, grupo, onCerrar, onGuardado } : FormularioGrupoProps) {
    const [borrador, setBorrador] = useState<GrupoSlider>(grupo);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const completo = Boolean(borrador.imagenUno && borrador.imagenDos && borrador.textoUno?.trim() && borrador.textoDos?.trim());
    const cambio = (['imagenUno', 'imagenDos', 'textoUno', 'textoDos'] as const).some((clave) => borrador[clave] !== grupo[clave]);

    // mientras falte una foto, la vista previa usa la actual en ese lado
    const despues = { ...borrador, imagenUno: borrador.imagenUno || grupo.imagenUno, imagenDos: borrador.imagenDos || grupo.imagenDos };

    const guardar = async () => {
        setGuardando(true);
        setError('');
        try {
            await admin.guardarGrupoSlider(indice, borrador);
            onGuardado();
        } catch (e) {
            setError((e as Error).message);
            setGuardando(false);
        }
    };

    const campo = (imagen : 'imagenUno' | 'imagenDos', texto : 'textoUno' | 'textoDos', titulo : string, esquina : string) => (
        <div className="flex flex-col gap-[12px]">
            <div>
                <span className={ETIQUETA_CAMPO}>{titulo}</span>
                <SubirImagenes
                    imagenes={borrador[imagen] ? [borrador[imagen]] : []}
                    onCambiar={(lista) => setBorrador((actual) => ({ ...actual, [imagen]: lista[0] ?? '' }))}
                    maximo={1}
                    portada={false}
                />
            </div>
            <label>
                <span className={ETIQUETA_CAMPO}>Texto de la esquina {esquina}</span>
                <input
                    required
                    maxLength={MAX_TEXTO_SLIDER}
                    value={borrador[texto] ?? ''}
                    onChange={(e) => setBorrador((actual) => ({ ...actual, [texto]: e.target.value }))}
                    className={INPUT}
                    placeholder="Ej. Edición limitada"
                />
                <span className="mt-[4px] block text-[12px] text-slate-500">{(borrador[texto] ?? '').length} de {MAX_TEXTO_SLIDER} · va en arco, siguiendo la esquina</span>
            </label>
        </div>
    );

    return (
        <Modal
            titulo={`Slider: grupo ${indice + 1}`}
            onCerrar={onCerrar}
            ancho="max-w-[1000px]"
            pie={
                <>
                    {error && <p role="alert" className="mr-auto self-center text-[13px] font-medium text-red-600">{error}</p>}
                    {!completo && <p className="mr-auto self-center text-[13px] text-slate-500">Faltan imágenes o textos del grupo</p>}
                    <button type="button" onClick={onCerrar} className={BOTON_SECUNDARIO}>Cancelar</button>
                    <button type="button" onClick={guardar} disabled={guardando || !completo || !cambio} className={BOTON_PRINCIPAL}>
                        <Icono nombre="check" className="size-[16px]" grosor={2.5} /> {guardando ? 'Guardando…' : 'Publicar fotos'}
                    </button>
                </>
            }
        >
            <div className="flex flex-col gap-[20px]">
                <p className="text-[13px] text-slate-500">Quita con el tacho la foto que quieras reemplazar y sube la nueva. Los textos van en las esquinas del slider: escribe algo corto y llamativo.</p>
                <div className="grid gap-[16px] sm:grid-cols-2">
                    {campo('imagenUno', 'textoUno', 'Imagen 1 (izquierda)', 'superior izquierda')}
                    {campo('imagenDos', 'textoDos', 'Imagen 2 (derecha)', 'inferior derecha')}
                </div>
                <AntesDespues
                    lado
                    antes={<VistaSlider grupo={grupo} />}
                    despues={<VistaSlider grupo={despues} />}
                />
                <VistaPantallas mensaje={{ tipo: 'slider', grupo: despues }} />
            </div>
        </Modal>
    );
}

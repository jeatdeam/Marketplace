import { useRef, useState } from 'react';

import Icono from '../Icono';
import { INPUT } from '../ui';
import { admin } from '../../api';

const MAX_MB = 5;

const leerComoDataUrl = (archivo : File) => new Promise<string>((resolver, rechazar) => {
    const lector = new FileReader();
    lector.onload = () => resolver(String(lector.result));
    lector.onerror = () => rechazar(lector.error);
    lector.readAsDataURL(archivo);
});

interface SubirImagenesProps {
    imagenes : string[];
    onCambiar : (imagenes : string[]) => void;
    maximo?: number;
    // con una sola imagen (banner, categoria, slider) no tiene sentido marcar la "Portada"
    portada?: boolean;
}

// lista de imagenes: se suben archivos al backend o se pega una url; la primera es la portada
export default function SubirImagenes({ imagenes, onCambiar, maximo = 8, portada = true } : SubirImagenesProps) {
    const entrada = useRef<HTMLInputElement>(null);
    const [subiendo, setSubiendo] = useState(false);
    const [error, setError] = useState('');
    const [url, setUrl] = useState('');
    const lleno = imagenes.length >= maximo;

    const subir = async (archivos : FileList | null) => {
        if (!archivos?.length) return;
        setError('');
        setSubiendo(true);
        const nuevas : string[] = [];
        try {
            for (const archivo of Array.from(archivos).slice(0, maximo - imagenes.length)) {
                if (archivo.size > MAX_MB * 1024 * 1024) throw new Error(`"${archivo.name}" pesa más de ${MAX_MB} MB`);
                nuevas.push(await admin.subirImagen(await leerComoDataUrl(archivo)));
            }
        } catch (e) {
            setError((e as Error).message);
        } finally {
            if (nuevas.length) onCambiar([...imagenes, ...nuevas]);
            setSubiendo(false);
            if (entrada.current) entrada.current.value = '';
        }
    };

    const agregarUrl = () => {
        const limpia = url.trim();
        if (!limpia || lleno) return;
        onCambiar([...imagenes, limpia]);
        setUrl('');
    };

    const mover = (indice : number, paso : number) => {
        const copia = [...imagenes];
        const [item] = copia.splice(indice, 1);
        copia.splice(indice + paso, 0, item);
        onCambiar(copia);
    };

    return (
        <div>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-[10px]">
                {imagenes.map((src, indice) => (
                    <li key={src + indice} className="group/foto relative aspect-square overflow-hidden rounded-[10px] bg-[#f3f9fd] ring-1 ring-black/10">
                        <img src={src} alt={`Imagen ${indice + 1}`} className="size-full object-cover" />
                        {portada && indice === 0 && <span className="absolute left-[6px] top-[6px] rounded-full bg-slate-900 px-[7px] py-[2px] text-[10px] font-bold text-white">Portada</span>}
                        <div className="absolute inset-x-0 bottom-0 flex justify-between gap-[4px] p-[4px] bg-gradient-to-t from-black/50 to-transparent">
                            <button type="button" disabled={indice === 0} onClick={() => mover(indice, -1)} aria-label="Mover a la izquierda" className="grid place-items-center size-[26px] rounded-full bg-white/90 disabled:opacity-30">
                                <Icono nombre="izquierda" className="size-[14px]" grosor={2.5} />
                            </button>
                            <button type="button" onClick={() => onCambiar(imagenes.filter((_, i) => i !== indice))} aria-label={`Quitar imagen ${indice + 1}`} className="grid place-items-center size-[26px] rounded-full bg-white/90 text-red-600">
                                <Icono nombre="tacho" className="size-[14px]" />
                            </button>
                            <button type="button" disabled={indice === imagenes.length - 1} onClick={() => mover(indice, 1)} aria-label="Mover a la derecha" className="grid place-items-center size-[26px] rounded-full bg-white/90 disabled:opacity-30">
                                <Icono nombre="derecha" className="size-[14px]" grosor={2.5} />
                            </button>
                        </div>
                    </li>
                ))}
                {!lleno && (
                    <li>
                        <button
                            type="button"
                            onClick={() => entrada.current?.click()}
                            disabled={subiendo}
                            className="flex size-full aspect-square flex-col items-center justify-center gap-[4px] rounded-[10px] border-2 border-dashed border-slate-300 text-[12px] font-semibold text-slate-500 transition-colors hover:border-slate-900 hover:text-slate-900 disabled:opacity-60"
                        >
                            <Icono nombre={subiendo ? 'recargar' : 'mas'} className={`size-[22px] ${subiendo ? 'animate-spin' : ''}`} />
                            {subiendo ? 'Subiendo…' : 'Subir foto'}
                        </button>
                    </li>
                )}
            </ul>
            <input ref={entrada} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" multiple={maximo > 1} hidden onChange={(e) => subir(e.target.files)} />
            {!lleno && (
                <div className="mt-[10px] flex gap-[8px]">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); agregarUrl(); } }}
                        placeholder="…o pega la URL de una imagen"
                        aria-label="URL de imagen"
                        className={INPUT}
                    />
                    <button type="button" onClick={agregarUrl} className="shrink-0 rounded-[10px] border-2 border-gray-300 px-[14px] text-[13px] font-semibold hover:border-slate-900">Agregar</button>
                </div>
            )}
            <p className="mt-[6px] text-[12px] text-slate-500">{imagenes.length} de {maximo} · JPG, PNG, WEBP, GIF o AVIF de hasta {MAX_MB} MB</p>
            {error && <p role="alert" className="mt-[6px] text-[13px] font-medium text-red-600">{error}</p>}
        </div>
    );
}

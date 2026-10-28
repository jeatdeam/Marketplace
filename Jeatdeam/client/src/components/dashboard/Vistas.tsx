import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

import Icono from '../Icono';
import TarjetaCategoria from '../TarjetaCategoria';
import { BannerNuevo, BannerOferta, BannerPrincipal, contenidoNuevo, contenidoOferta, type DatosBanner } from '../BannerInicio';
import type { Categoria } from '../../datos/tienda';
import { PANTALLAS, type MensajeVista } from '../../datos/vistaPrevia';
import type { GrupoSlider, PosicionBanner, Product } from '../../../../shared/types';

// vistas previas del dashboard: dibujan cada pieza del inicio con el mismo componente que usa la tienda,
// a su tamaño real en escritorio (cuerpo de 1065px), y la achican para que entre en la tarjeta o el modal

interface MiniaturaProps {
    ancho : number; // ancho real en el inicio (px)
    alto?: number; // si se omite, el alto natural del contenido
    children : ReactNode;
}

export function Miniatura({ ancho, alto, children } : MiniaturaProps) {
    const caja = useRef<HTMLDivElement>(null);
    const contenido = useRef<HTMLDivElement>(null);
    const [medidas, setMedidas] = useState({ escala: 1, alto: 0 });

    useLayoutEffect(() => {
        const medir = () => {
            if (!caja.current || !contenido.current) return;
            const escala = Math.min(1, caja.current.clientWidth / ancho);
            setMedidas({ escala, alto: contenido.current.offsetHeight * escala });
        };
        medir();
        const observador = new ResizeObserver(medir);
        if (caja.current) observador.observe(caja.current);
        if (contenido.current) observador.observe(contenido.current);
        return () => observador.disconnect();
    }, [ancho]);

    return (
        <div ref={caja} className="relative w-full overflow-hidden" style={{ height: medidas.alto }} aria-hidden="true">
            <div
                ref={contenido}
                className="pointer-events-none absolute left-0 top-0 origin-top-left"
                style={{ width: ancho, height: alto, transform: `scale(${medidas.escala})` }}
            >
                {children}
            </div>
        </div>
    );
}

// "asi se ve actualmente" junto a "asi se vera despues" (uno debajo del otro en pantallas chicas)
export function AntesDespues({ antes, despues, lado = false } : { antes : ReactNode; despues : ReactNode; lado?: boolean }) {
    return (
        <div className={`grid gap-[14px] ${lado ? 'md:grid-cols-[1fr_auto_1fr] md:items-center' : ''}`}>
            <figure className="min-w-0">
                <figcaption className="mb-[6px] flex items-center gap-[6px] text-[12px] font-semibold uppercase tracking-[.08em] text-slate-500">
                    <Icono nombre="ojo" className="size-[14px]" /> Así se ve actualmente
                </figcaption>
                {antes}
            </figure>
            <Icono nombre={lado ? 'flechaDerecha' : 'abajo'} className={`mx-auto size-[20px] text-sky-700 ${lado ? 'rotate-90 md:rotate-0' : ''}`} />
            <figure className="min-w-0">
                <figcaption className="mb-[6px] flex items-center gap-[6px] text-[12px] font-semibold uppercase tracking-[.08em] text-sky-700">
                    <Icono nombre="brillo" className="size-[14px]" /> Así se verá después
                </figcaption>
                {despues}
            </figure>
        </div>
    );
}

// lo que se ve cuando todavia no hay nada que mostrar
export function SinVista({ texto, alto = 'min-h-[110px]' } : { texto : string; alto?: string }) {
    return (
        <div className={`grid place-items-center rounded-[14px] border-2 border-dashed border-slate-200 px-[12px] text-center text-[12px] text-slate-400 ${alto}`}>
            <span><Icono nombre="imagen" className="mx-auto mb-[4px] size-[20px]" />{texto}</span>
        </div>
    );
}

// ---------- banners ----------

const ANCHO_BANNER : Record<PosicionBanner, number> = {
    'ofertas-principal': 525,
    'ofertas-1': 525,
    'ofertas-2': 525,
    'ofertas-3': 525,
    'nuevos-1': 525,
    'nuevos-2': 525,
    'nuevos-3': 344,
    'nuevos-4': 344,
    'nuevos-5': 344,
};

// el banner de una posicion tal como lo pinta el inicio: el subido o, si no hay, el automatico
export function VistaBanner({ posicion, subido, productos } : { posicion : PosicionBanner; subido?: DatosBanner; productos : Product[] }) {
    if (posicion === 'ofertas-principal') {
        return <Miniatura ancho={ANCHO_BANNER[posicion]}><BannerPrincipal productos={productos} subido={subido} vista /></Miniatura>;
    }
    const n = Number(posicion.slice(-1));
    const oferta = posicion.startsWith('ofertas');
    const item = oferta ? contenidoOferta(n as 1 | 2 | 3, productos, subido) : contenidoNuevo(n as 1 | 2 | 3 | 4 | 5, productos, subido);
    if (!item) return <SinVista texto="Hoy no se muestra: faltan productos para armarlo solo" />;
    return (
        <Miniatura ancho={ANCHO_BANNER[posicion]}>
            {oferta ? <BannerOferta item={item} vista /> : <BannerNuevo item={item} grande={n <= 2} vista />}
        </Miniatura>
    );
}

// ---------- categorias ----------

// tamaño de cada caja del mosaico en escritorio, con el cuerpo de 1065px (1 + 2 + 3 + 4 cajas por fila)
const TAMANO_CATEGORIA = [[1065, 240], [525, 240], [525, 240], [344, 240], [344, 240], [344, 240], [254, 496], [254, 496], [254, 496], [254, 496]];

export function VistaCategoria({ categoria, indice } : { categoria : Categoria; indice : number }) {
    const [ancho, alto] = TAMANO_CATEGORIA[indice] ?? [344, 240];
    return (
        // las cajas altas de la ultima fila se ven a lo mas de 140px de ancho para no estirar la tarjeta
        <div className={alto > ancho ? 'mx-auto max-w-[140px]' : ''}>
            <Miniatura ancho={ancho} alto={alto}><TarjetaCategoria categoria={categoria} vista /></Miniatura>
        </div>
    );
}

// ---------- slider ----------

const ANCHO_SLIDER = 1065;
const RADIO_SLIDER = 48;

// el slider detenido con la linea al centro: imagen 1 a la izquierda, imagen 2 a la derecha
export function VistaSlider({ grupo } : { grupo : GrupoSlider }) {
    return (
        <Miniatura ancho={ANCHO_SLIDER}>
            <div className="relative aspect-[16/9] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,.35)]" style={{ borderRadius: RADIO_SLIDER }}>
                <img src={grupo.imagenDos} alt="" className="absolute inset-0 size-full object-cover" />
                <img src={grupo.imagenUno} alt="" className="absolute inset-0 size-full object-cover" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                {/* linea y tirador mas gruesos que en el inicio (2px y 10x25): la miniatura se ve a ~1/3 del tamaño */}
                <div className="absolute inset-y-0 left-1/2 w-[6px] -translate-x-1/2 bg-white shadow-[0_0_8px_rgba(0,0,0,.35)]">
                    <span className="absolute left-1/2 top-1/2 h-[75px] w-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                </div>
                <span className="absolute left-[40px] top-[30px] rounded-full bg-black/40 px-[18px] py-[6px] text-[32px] font-extrabold text-white">{grupo.textoUno || 'Imagen 1'}</span>
                <span className="absolute bottom-[30px] right-[40px] rounded-full bg-black/40 px-[18px] py-[6px] text-[32px] font-extrabold text-white">{grupo.textoDos || 'Imagen 2'}</span>
            </div>
        </Miniatura>
    );
}

// ---------- cada tamaño de pantalla ----------

// la seccion del inicio con el cambio, en un iframe de /vista-previa con el ancho real de la pantalla
// (asi aplican las media queries de verdad) y achicado para que entre en la columna
function Pantalla({ nombre, ancho, mensaje } : { nombre : string; ancho : number; mensaje : MensajeVista }) {
    const caja = useRef<HTMLDivElement>(null);
    const marco = useRef<HTMLIFrameElement>(null);
    const [lista, setLista] = useState(false);
    const [alto, setAlto] = useState(400);
    const [escala, setEscala] = useState(0.25);

    useEffect(() => {
        const alRecibir = (e : MessageEvent) => {
            if (e.origin !== window.location.origin || e.source !== marco.current?.contentWindow) return;
            if (e.data?.vistaPreviaLista) setLista(true);
            if (typeof e.data?.vistaPreviaAlto === 'number') setAlto(e.data.vistaPreviaAlto);
        };
        window.addEventListener('message', alRecibir);
        return () => window.removeEventListener('message', alRecibir);
    }, []);

    // se compara por contenido: el modal arma un objeto nuevo en cada render
    const clave = JSON.stringify(mensaje);
    useEffect(() => {
        if (lista) marco.current?.contentWindow?.postMessage({ vistaPrevia: JSON.parse(clave) }, window.location.origin);
    }, [lista, clave]);

    useLayoutEffect(() => {
        const elemento = caja.current;
        if (!elemento) return;
        const medir = () => setEscala(elemento.clientWidth / ancho);
        medir();
        const observador = new ResizeObserver(medir);
        observador.observe(elemento);
        return () => observador.disconnect();
    }, [ancho]);

    return (
        <figure className="min-w-0">
            <figcaption className="mb-[6px] flex items-center justify-between gap-[6px] text-[12px] font-semibold text-slate-600">
                {nombre} <span className="font-normal text-slate-400">{ancho}px</span>
            </figcaption>
            <div ref={caja} className="relative overflow-hidden rounded-[10px] bg-[#eaf5fc] ring-1 ring-slate-200" style={{ height: alto * escala }}>
                <iframe
                    ref={marco}
                    src="/vista-previa"
                    title={`Vista previa en ${nombre.toLowerCase()}`}
                    tabIndex={-1}
                    className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
                    style={{ width: ancho, height: alto, transform: `scale(${escala})` }}
                />
            </div>
        </figure>
    );
}

// "asi se vera en cada pantalla": celular, tablet y escritorio
export function VistaPantallas({ mensaje } : { mensaje : MensajeVista }) {
    return (
        <section>
            <p className="mb-[8px] flex items-center gap-[6px] text-[12px] font-semibold uppercase tracking-[.08em] text-sky-700">
                <Icono nombre="panel" className="size-[14px]" /> Así se verá en cada pantalla
            </p>
            <div className="grid items-start gap-[14px] md:grid-cols-[1fr_1.5fr_2.3fr]">
                {PANTALLAS.map((pantalla) => <Pantalla key={pantalla.ancho} nombre={pantalla.nombre} ancho={pantalla.ancho} mensaje={mensaje} />)}
            </div>
        </section>
    );
}

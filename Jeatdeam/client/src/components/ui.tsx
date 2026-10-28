import { createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import Icono from './Icono';

// clases que se repiten en toda la tienda (guia ANDESEPPS, 02-sistema-visual)
export const BOTON_PRINCIPAL = 'inline-flex items-center justify-center gap-[8px] bg-slate-900 text-white rounded-[10px] px-[18px] py-[10px] text-[14px] font-semibold transition-all duration-300 ease-out hover:bg-slate-700 hover:-translate-y-[2px] active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
export const BOTON_SECUNDARIO = 'inline-flex items-center justify-center gap-[8px] border-2 border-gray-300 rounded-[10px] px-[18px] py-[8px] text-[14px] font-semibold text-slate-900 bg-white/60 transition-all duration-300 ease-out hover:border-slate-900 hover:-translate-y-[2px] active:translate-y-0 active:scale-95';
export const BOTON_PRODUCTO = 'border-2 border-gray-300 flex items-center justify-center gap-[6px] p-[7.5px] text-[12px] font-semibold rounded-[10px] transition-all duration-300 ease-out hover:bg-slate-900 hover:text-white hover:border-slate-900 hover:-translate-y-[2px] active:translate-y-0 active:scale-95 disabled:opacity-40 disabled:pointer-events-none';
export const PILDORA_BANNER = 'inline-flex items-center gap-[6px] rounded-full px-[14px] py-[10px] text-[13px] font-semibold bg-white text-slate-900';
// efecto vidrio en toda la tienda: blanco translucido, desenfoque del fondo hielo y borde blanco de 1px
export const TARJETA = 'bg-white/55 backdrop-blur-md rounded-[12.5px] p-[25px] ring-1 ring-white/80 shadow-[0_8px_30px_rgba(15,23,42,.08)]';
// desplegables (buscador, carrito, categorias, menus): mas opacos para que el texto se lea sobre cualquier fondo
export const PANEL_VIDRIO = 'bg-white/45 backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-white/70 shadow-[0_16px_40px_rgba(15,23,42,.2)]';
export const CAJA_ELEVADA = 'bg-white shadow-[0_0_0_1px_rgba(15,23,42,.08),0_4px_0_rgba(15,23,42,.07)]';
export const VIDRIO = 'bg-white/55 ring-1 ring-white backdrop-blur';
export const ESPACIO_BLOQUES = 'gap-[40px] sm:gap-[56px]';
// ancho del cuerpo: 90% hasta 799px (celular, sm y md), 80% de 800 a 1023px (tab), 90% de 1024 a 1279px (lg),
// fijo en 1065px de 1280 a 1535px (xl) y 55% desde 1536px (2xl)
export const ANCHO_SECCION = 'w-[90%] tab:w-[80%] lg:w-[90%] xl:w-[1065px] 2xl:w-[55%] mx-auto';
// el header (fixed) sigue al cuerpo (ANCHO_SECCION) y sobresale 25px por lado; en celulares angostos
// nunca queda a menos de 8px del borde. Se centra con inset-x-0 + mx-auto (en un fixed, mx-auto solo
// centra si left y right son 0): cada media query define solo el ancho, sin calcular el "left"
export const ANCHO_HEADER = [
    'inset-x-0 mx-auto',
    'w-[min(calc(90%_+_50px),calc(100%_-_16px))]',
    'tab:w-[calc(80%_+_50px)]',
    'lg:w-[calc(90%_+_50px)]',
    'xl:w-[1115px]',
].join(' ');
export const INPUT = 'w-full rounded-[10px] border-2 border-white/80 bg-white/70 backdrop-blur px-[14px] py-[10px] text-[14px] text-slate-900 placeholder:text-slate-400 transition-colors focus:border-sky-700 focus:outline-none';
export const ETIQUETA_CAMPO = 'block text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-600 mb-[6px]';

// degradados de los banners: texto blanco arriba a la izquierda (zona oscura)
export const MARINO_HIELO = 'bg-gradient-to-br from-[#0f172a] via-[#172554] to-[#a8d5ef] ring-1 ring-white/10';
export const MARINO_BLANCO = 'bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#f3f9fd] ring-1 ring-white/10';
export const MARINO_CIELO = 'bg-gradient-to-br from-[#172554] via-[#1e3a8a] to-[#d3ebf8] ring-1 ring-white/10';

// solo esconde lo que empieza debajo de la pantalla: lo que ya se ve al cargar no se anima
// la vista previa del dashboard (un iframe) muestra todo de una: sin esperar al scroll
export const SinAparecer = createContext(false);

export function Aparecer({ children, className = '' } : { children : ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [oculto, setOculto] = useState(false);
    const desactivado = useContext(SinAparecer);

    useLayoutEffect(() => {
        const elemento = ref.current;
        if (!elemento || desactivado) return;
        if (elemento.getBoundingClientRect().top < window.innerHeight) return;
        setOculto(true);
        const observador = new IntersectionObserver(([entrada]) => {
            if (entrada.isIntersecting) {
                setOculto(false);
                observador.disconnect();
            }
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        observador.observe(elemento);
        return () => observador.disconnect();
    }, [desactivado]);

    return (
        <div ref={ref} className={`aparecer ${oculto ? 'aparecer-oculto' : ''} ${className}`}>
            {children}
        </div>
    );
}

// h2 centrado entre dos lineas blancas de 1px
// pegado: sin aire arriba, para paginas donde la separacion entre bloques la da el contenedor (inicio)
export function TituloSeccion({ children, sobretitulo, id, pegado = false } : { children : ReactNode; sobretitulo?: string; id?: string; pegado?: boolean }) {
    return (
        <div className={`${pegado ? '' : 'pt-[24px] sm:pt-[40.5px]'} pb-[16px] sm:pb-[30.5px] text-center`}>
            {sobretitulo && (
                <p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[.15em] text-sky-700 mb-[8px]">{sobretitulo}</p>
            )}
            <div className="flex items-center justify-center gap-[16px]">
                <span className="h-px flex-1 max-w-[450px] bg-white" aria-hidden="true" />
                <h2 id={id} className="text-[24px] sm:text-[26px] md:text-[35px] leading-none font-bold text-slate-900 first-letter:uppercase">
                    {children}
                </h2>
                <span className="h-px flex-1 max-w-[450px] bg-white" aria-hidden="true" />
            </div>
        </div>
    );
}

export function Estrellas({ valor, resenas, tamano = 'size-[14px]' } : { valor : number; resenas?: number; tamano?: string }) {
    return (
        <span className="inline-flex items-center gap-[4px] text-[12px] text-slate-600" aria-label={`Calificación ${valor} de 5`}>
            <span className="flex" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                    <Icono
                        key={n}
                        nombre="estrella"
                        className={`${tamano} ${n <= Math.round(valor) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                        grosor={1.5}
                    />
                ))}
            </span>
            <span className="font-semibold text-slate-900">{valor.toFixed(1)}</span>
            {resenas !== undefined && <span>({resenas})</span>}
        </span>
    );
}

// pagina de error/404: codigo gigante con un circulo amarillo detras
interface PaginaEstadoProps {
    codigo : string;
    titulo : string;
    descripcion : string;
    principal?: { texto : string; a : string };
    secundario?: { texto : string; a : string };
}

export function PaginaEstado({ codigo, titulo, descripcion, principal, secundario } : PaginaEstadoProps) {
    return (
        <main className={`${ANCHO_SECCION} flex-1 pt-[150px] pb-[60px]`}>
            <section className={`${TARJETA} text-center flex flex-col items-center`}>
                <div className="relative grid place-items-center h-[150px] sm:h-[200px]">
                    <span className="absolute size-[110px] sm:size-[150px] rounded-full bg-[#facc15]" aria-hidden="true" />
                    <span className="relative text-[110px] sm:text-[170px] font-extrabold leading-none text-slate-900/10 select-none" aria-hidden="true">{codigo}</span>
                    <Icono nombre="paquete" className="absolute size-[54px] sm:size-[70px] text-slate-900" grosor={1.6} />
                </div>
                <h1 className="mt-[10px] text-[24px] sm:text-[30px] font-bold">{titulo}</h1>
                <p className="mt-[8px] max-w-[460px] text-[14px] text-slate-600">{descripcion}</p>
                <div className="mt-[22px] flex flex-wrap justify-center gap-[12px]">
                    {principal && <Link to={principal.a} className={BOTON_PRINCIPAL}>{principal.texto}</Link>}
                    {secundario && <Link to={secundario.a} className={BOTON_SECUNDARIO}>{secundario.texto}</Link>}
                </div>
            </section>
        </main>
    );
}

// encabezado de las paginas internas: deja aire para la barra superior y el header flotante
export function EncabezadoPagina({ titulo, descripcion, migas } : { titulo : string; descripcion?: string; migas?: { texto : string; a?: string }[] }) {
    return (
        <header className="pt-[150px] sm:pt-[160px] pb-[20px]">
            {migas && (
                <nav aria-label="Ruta" className="mb-[10px]">
                    <ol className="flex flex-wrap items-center gap-[6px] text-[12px] text-slate-500">
                        {migas.map((miga, indice) => (
                            <li key={miga.texto} className="flex items-center gap-[6px]">
                                {indice > 0 && <Icono nombre="derecha" className="size-[12px]" grosor={2.5} />}
                                {miga.a ? <Link to={miga.a} className="hover:text-sky-700">{miga.texto}</Link> : <span aria-current="page" className="text-slate-900 font-medium">{miga.texto}</span>}
                            </li>
                        ))}
                    </ol>
                </nav>
            )}
            <h1 className="text-[26px] sm:text-[32px] md:text-[38px] font-bold leading-tight first-letter:uppercase">{titulo}</h1>
            {descripcion && <p className="mt-[8px] max-w-[640px] text-[14px] sm:text-[15px] text-slate-600">{descripcion}</p>}
        </header>
    );
}

'use client';
import { useEffect, useRef, useState } from 'react';

import { BeforeAfterSlider } from '../components/beforeAfterSlider';
import { SinAparecer } from '../components/ui';
import { useStore } from '../context/StoreContext';
import { SeccionCategorias, SeccionNuevos, SeccionOfertas } from './Home';
import type { MensajeVista } from '../datos/vistaPrevia';
import type { Banner } from '../../../shared/types';

// pagina que el dashboard abre en iframes de 360, 768 y 1440px: dibuja la seccion del inicio con el
// cambio que se esta editando, asi las media queries son las de verdad. Solo acepta mensajes de su ventana madre
export default function VistaPrevia() {
    const { baseDatos, banners, categorias } = useStore();
    const [mensaje, setMensaje] = useState<MensajeVista | null>(null);
    const raiz = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // sin barra de scroll: el iframe toma el alto del contenido
        document.documentElement.style.overflow = 'hidden';
        const alRecibir = (e : MessageEvent) => {
            if (e.origin !== window.location.origin || e.source !== window.parent) return;
            if (e.data?.vistaPrevia) setMensaje(e.data.vistaPrevia as MensajeVista);
        };
        window.addEventListener('message', alRecibir);
        window.parent.postMessage({ vistaPreviaLista: true }, window.location.origin);
        return () => window.removeEventListener('message', alRecibir);
    }, []);

    // avisa el alto para que el dashboard ajuste el iframe
    useEffect(() => {
        const elemento = raiz.current;
        if (!elemento) return;
        const observador = new ResizeObserver(() => {
            window.parent.postMessage({ vistaPreviaAlto: elemento.offsetHeight }, window.location.origin);
        });
        observador.observe(elemento);
        return () => observador.disconnect();
    }, []);

    const productos = baseDatos ?? [];
    let contenido = null;
    if (mensaje?.tipo === 'banner') {
        const otros = banners.filter((banner) => banner.posicion !== mensaje.posicion);
        const lista : Banner[] = mensaje.banner ? [...otros, { ...mensaje.banner, posicion: mensaje.posicion, actualizado: '' }] : otros;
        contenido = mensaje.posicion.startsWith('ofertas')
            ? <SeccionOfertas productos={productos} banners={lista} />
            : <SeccionNuevos productos={productos} banners={lista} />;
    } else if (mensaje?.tipo === 'categoria') {
        contenido = <SeccionCategorias categorias={categorias.map((categoria) => (categoria.slug === mensaje.slug ? { ...categoria, imagen: mensaje.imagen } : categoria))} />;
    } else if (mensaje?.tipo === 'slider') {
        contenido = <BeforeAfterSlider grupos={[mensaje.grupo]} sinHeader />;
    }

    return (
        <SinAparecer.Provider value>
            <div ref={raiz} className="py-[24px]">
                {contenido ?? <p className="py-[40px] text-center text-[14px] text-slate-500">Cargando vista previa…</p>}
            </div>
        </SinAparecer.Provider>
    );
}

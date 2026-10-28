import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import Icono from '../Icono';

interface ModalProps {
    titulo : string;
    onCerrar : () => void;
    children : ReactNode;
    pie?: ReactNode;
    ancho?: string;
}

// cabecera y pie fijos, el medio se desplaza; bloquea el scroll y devuelve el foco al cerrar
export default function Modal({ titulo, onCerrar, children, pie, ancho = 'max-w-[760px]' } : ModalProps) {
    const panel = useRef<HTMLDivElement>(null);
    // en un ref para que el efecto corra una sola vez: si dependiera de onCerrar, cada render
    // devolveria el foco al primer campo mientras se escribe
    const cerrar = useRef(onCerrar);
    cerrar.current = onCerrar;

    useEffect(() => {
        const anterior = document.activeElement as HTMLElement | null;
        // primero el primer campo; si no hay, el boton de cerrar
        (panel.current?.querySelector<HTMLElement>('input, select, textarea') ?? panel.current?.querySelector<HTMLElement>('button'))?.focus();
        document.body.style.overflow = 'hidden';
        const alTeclear = (e : KeyboardEvent) => {
            if (e.key === 'Escape') cerrar.current();
            // mantiene el foco dentro del modal con tab
            if (e.key !== 'Tab' || !panel.current) return;
            const enfocables = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select, textarea');
            const primero = enfocables[0];
            const ultimo = enfocables[enfocables.length - 1];
            if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
            else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
        };
        document.addEventListener('keydown', alTeclear);
        return () => {
            document.removeEventListener('keydown', alTeclear);
            document.body.style.overflow = '';
            anterior?.focus();
        };
    }, []);

    return createPortal(
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-[16px]">
            <div className="aparecerVidrio absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCerrar} />
            <div
                ref={panel}
                role="dialog"
                aria-modal="true"
                aria-label={titulo}
                className={`relative w-full ${ancho} max-h-[100dvh] sm:max-h-[92dvh] flex flex-col bg-white/80 backdrop-blur-xl ring-1 ring-white/80 rounded-t-[16px] sm:rounded-[16px] shadow-[0_20px_60px_rgba(15,23,42,.35)]`}
            >
                <div className="flex items-center justify-between gap-[10px] px-[20px] h-[60px] border-b border-slate-100 shrink-0">
                    <h2 className="text-[17px] font-bold">{titulo}</h2>
                    <button type="button" onClick={onCerrar} aria-label="Cerrar" className="grid place-items-center size-[36px] rounded-full hover:bg-slate-100">
                        <Icono nombre="cerrar" className="size-[20px]" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto scroll-fino px-[20px] py-[18px]">{children}</div>
                {pie && <div className="flex flex-wrap justify-end gap-[10px] px-[20px] py-[14px] border-t border-slate-100 shrink-0">{pie}</div>}
            </div>
        </div>,
        document.body,
    );
}

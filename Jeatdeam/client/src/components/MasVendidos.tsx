import { useEffect, useRef, type RefObject } from 'react';
import { useNavigate } from 'react-router-dom';

import ProductCard, { productPath } from './ProductCard';
import type { Product } from '../../../shared/types';

const SPEED = 300; // px por segundo (antes: 5px por frame)
const START_DELAY = 4000; // espera a que termine la intro de la página

// Desplazamiento infinito: la fila contiene la lista duplicada, así que basta con
// mantener el desplazamiento dentro de un "periodo" (el ancho de una copia).
function useMarquee(
    trackRef: RefObject<HTMLDivElement>,
    wrapperRef: RefObject<HTMLDivElement>,
    direction: number,
    itemCount: number,
) {
    const wasDragged = useRef(false);

    useEffect(() => {
        const track = trackRef.current;
        const wrapper = wrapperRef.current;
        if (!track || !wrapper || itemCount === 0) return;

        let offset = 0;
        let rafId: number | null = null;
        let last: number | null = null;
        let started = false;
        let hovering = false;
        let dragging = false;
        let startX = 0;
        let settleTimer: ReturnType<typeof setTimeout> | undefined;

        const period = () => {
            const half = track.children.length / 2;
            const children = track.children as HTMLCollectionOf<HTMLElement>;
            return children[half].offsetLeft - children[0].offsetLeft;
        };
        const normalize = () => {
            const p = period();
            if (p > 0) offset = ((offset % p) + p) % p - p;
        };
        const apply = () => {
            track.style.transform = `translateX(${offset}px)`;
        };

        const frame = (time: number) => {
            if (last !== null) {
                offset += direction * SPEED * (time - last) / 1000;
                normalize();
                apply();
            }
            last = time;
            rafId = requestAnimationFrame(frame);
        };
        const play = () => {
            if (!started || rafId !== null || dragging) return;
            last = null;
            rafId = requestAnimationFrame(frame);
        };
        const stop = () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
            rafId = null;
        };

        const pointerX = (e: MouseEvent | TouchEvent) =>
            'touches' in e ? (e.touches[0] || e.changedTouches[0]).clientX : e.clientX;

        const onDown = (e: MouseEvent | TouchEvent) => {
            if (dragging) return;
            stop();
            clearTimeout(settleTimer);
            startX = pointerX(e);
            wasDragged.current = false;
            track.classList.add('addTransition');
            dragging = true;
        };
        const onUp = (e: MouseEvent | TouchEvent) => {
            if (!dragging) return;
            const distance = pointerX(e) - startX;
            wasDragged.current = Math.abs(distance) > 5;
            offset += distance;
            apply();
            settleTimer = setTimeout(() => {
                track.classList.remove('addTransition');
                normalize();
                apply();
                dragging = false;
                if (!hovering) play();
            }, 300);
        };

        const onEnter = () => { hovering = true; stop(); };
        const onLeave = () => { hovering = false; play(); };
        const onTouchPause = () => stop();
        const onTouchResume = () => { if (!dragging) play(); };

        track.addEventListener('mousedown', onDown);
        track.addEventListener('touchstart', onDown);
        document.addEventListener('mouseup', onUp);
        document.addEventListener('touchend', onUp);
        wrapper.addEventListener('mouseenter', onEnter);
        wrapper.addEventListener('mouseleave', onLeave);
        wrapper.addEventListener('touchstart', onTouchPause);
        wrapper.addEventListener('touchend', onTouchResume);

        const startTimer = setTimeout(() => {
            started = true;
            offset = -period();
            apply();
            if (!hovering) play();
        }, START_DELAY);

        return () => {
            stop();
            clearTimeout(startTimer);
            clearTimeout(settleTimer);
            track.removeEventListener('mousedown', onDown);
            track.removeEventListener('touchstart', onDown);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('touchend', onUp);
            wrapper.removeEventListener('mouseenter', onEnter);
            wrapper.removeEventListener('mouseleave', onLeave);
            wrapper.removeEventListener('touchstart', onTouchPause);
            wrapper.removeEventListener('touchend', onTouchResume);
            track.classList.remove('addTransition');
            track.style.transform = '';
        };
    }, [trackRef, wrapperRef, direction, itemCount]);

    return wasDragged;
}

interface MarqueeRowProps {
    products: Product[];
    direction: number;
    wrapperClass: string;
    trackClass: string;
    cardClass: string;
}

function MarqueeRow({ products, direction, wrapperClass, trackClass, cardClass }: MarqueeRowProps) {
    const navigate = useNavigate();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const wasDragged = useMarquee(trackRef, wrapperRef, direction, products.length);

    const open = (product: Product) => () => {
        if (wasDragged.current) {
            wasDragged.current = false;
            return;
        }
        navigate(productPath(product));
    };

    const copy = (copyIndex: number) =>
        products.map((product, indice) => (
            <ProductCard
                key={`${copyIndex}-${indice}`}
                product={product}
                className={`${cardClass} ${cardClass}_${indice + 1}`}
                onOpen={open(product)}
            />
        ));

    return (
        <div className={wrapperClass} ref={wrapperRef}>
            <div className={trackClass} ref={trackRef}>
                {products.length > 0 ? (
                    <>
                        {copy(0)}
                        {copy(1)}
                    </>
                ) : (
                    <>
                        <p>No se encontraron productos</p>
                        <p>No se encontraron productos</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default function MasVendidos({ products }: { products: Product[] }) {
    return (
        <section className="masVendidos">
            <h1>PRODUCTOS MAS VENDIDOS</h1>
            <MarqueeRow
                products={products}
                direction={-1}
                wrapperClass="movimientoMasVendidos"
                trackClass="containerMasVendidos_one"
                cardClass="masVendidoElement"
            />
            <MarqueeRow
                products={products}
                direction={1}
                wrapperClass="movimientoMasVendidos_2"
                trackClass="containerMasVendidos_2_one"
                cardClass="masVendidoElement_two"
            />
        </section>
    );
}

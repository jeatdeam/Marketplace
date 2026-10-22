import { useEffect, useRef, useState } from 'react';

import Icon from './Icon';
import { useTimedFlag } from '../hooks/useTimedClass';

const BANNERS = ['/img/bannerOne.png', '/img/bannerTwo.png', '/img/bannerThree.png', '/img/bannerFour.png'];

export default function HeroCarousel() {
    const [index, setIndex] = useState(0);
    const [animating, triggerAnimation] = useTimedFlag(350);
    const interval = useRef<ReturnType<typeof setInterval>>();

    const startAutoSlide = () => {
        clearInterval(interval.current);
        interval.current = setInterval(() => {
            setIndex((current) => (current + 1) % BANNERS.length);
            triggerAnimation();
        }, 3000);
    };

    useEffect(() => {
        triggerAnimation();
        startAutoSlide();
        return () => clearInterval(interval.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const move = (step: number) => {
        setIndex((current) => (current + step + BANNERS.length) % BANNERS.length);
        triggerAnimation();
        startAutoSlide();
    };

    return (
        <section className="carouselImages">
            <div
                className={`containerImages${animating ? ' animate-image' : ''}`}
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {BANNERS.map((src) => <img key={src} src={src} alt="" draggable={false} />)}
            </div>
            <ul id="containerArrows">
                <li>
                    <Icon name="chevronLeft" fill="#FFFFFF" className="arrowLeft" onClick={() => move(-1)} />
                </li>
                <li>
                    <Icon name="chevronRight" fill="#FFFFFF" className="arrowRight" onClick={() => move(1)} />
                </li>
            </ul>
            <ul id="lista_circulos">
                {BANNERS.map((src, indice) => (
                    <li
                        key={src}
                        className={`circulo_contador circulo_contador_${indice}`}
                        style={{ background: indice === index ? 'black' : '' }}
                    />
                ))}
            </ul>
        </section>
    );
}

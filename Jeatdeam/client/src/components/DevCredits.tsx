// Build ligera de lottie: sin motor de expresiones (no usa eval, así respeta la CSP del servidor)
import { LottieLight } from 'lottie-react';
import { useEffect, useState } from 'react';

import jeatdeamAnimation from '../assets/lotties/jeatdeam_footer.json';
import pochitaAnimation from '../assets/lotties/pochita_pixel.json';
import './DevCredits.css';

// Color principal de la firma en el Lottie original -> #0369A1 (Tailwind sky-700)
const FIRMA_ORIGINAL = [0.6588235294117647, 0.9019607843137255, 1, 1];
const FIRMA_SKY_700 = [3 / 255, 105 / 255, 161 / 255, 1];

function recolor(node: unknown): unknown {
    if (Array.isArray(node)) return node.map(recolor);
    if (!node || typeof node !== 'object') return node;
    const copy: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) copy[key] = recolor(value);
    const color = copy.c as { k?: unknown } | undefined;
    if (copy.ty === 'fl' && color && JSON.stringify(color.k) === JSON.stringify(FIRMA_ORIGINAL)) {
        copy.c = { ...color, k: FIRMA_SKY_700 };
    }
    return copy;
}

const firmaJeatdeam = recolor(jeatdeamAnimation) as typeof jeatdeamAnimation;

const TEXTO = 'Diseñado y desarrollado por:';
const ESCRIBIR_MS = 80;
const BORRAR_MS = 40;
const PAUSA_ESCRITO_MS = 2000;
const PAUSA_BORRADO_MS = 600;

// Escribe el texto letra por letra, lo deja un momento y lo borra, en bucle
function useTipeo(texto: string) {
    const [largo, setLargo] = useState(0);
    const [borrando, setBorrando] = useState(false);

    useEffect(() => {
        let espera: number;
        if (!borrando && largo < texto.length) espera = ESCRIBIR_MS;
        else if (!borrando) espera = PAUSA_ESCRITO_MS;
        else if (largo > 0) espera = BORRAR_MS;
        else espera = PAUSA_BORRADO_MS;

        const timer = setTimeout(() => {
            if (!borrando && largo < texto.length) setLargo(largo + 1);
            else if (!borrando) setBorrando(true);
            else if (largo > 0) setLargo(largo - 1);
            else setBorrando(false);
        }, espera);
        return () => clearTimeout(timer);
    }, [texto, largo, borrando]);

    return texto.slice(0, largo);
}

// Créditos del desarrollador, debajo del footer
export default function DevCredits() {
    const escrito = useTipeo(TEXTO);

    return (
        <section className="devCredits">
            <p className="devCredits_text" aria-label={TEXTO}>
                {/* Copia invisible del texto completo: reserva el ancho para que los Lotties no se muevan */}
                <span className="devCredits_reserva" aria-hidden="true">{TEXTO}|</span>
                <span className="devCredits_tipeo" aria-hidden="true">
                    {escrito}
                    <span className="devCredits_cursor">|</span>
                </span>
            </p>
            <div className="devCredits_lotties">
                <a href="https://www.linkedin.com/in/paulo-aylas/" aria-label="Jeatdeam en LinkedIn">
                    <LottieLight className="devCredits_firma" src={firmaJeatdeam} autoplay loop />
                </a>
                <LottieLight className="devCredits_pochita" src={pochitaAnimation} autoplay loop />
            </div>
        </section>
    );
}

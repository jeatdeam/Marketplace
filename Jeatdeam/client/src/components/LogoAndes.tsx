import { LottieLight } from 'lottie-react';
import { Link } from 'react-router-dom';

import logoAnimation from '../assets/lotties/los_andes_epps.json';
import { useMediaQuery } from '../hooks/useMediaQuery';

// el Lottie viene en azul #1E3A5F con un contorno blanco en el casco (pensado para fondo marino).
// sobre el fondo blanco del dashboard: letras en el marino de la tienda y contorno del casco en marino
const TEXTO_ORIGINAL = [0.11764705882352941, 0.22745098039215686, 0.37254901960784315, 1];
const BLANCO = [1, 1, 1, 1];
const MARINO = [15 / 255, 23 / 255, 42 / 255, 1];

function recolor(node : unknown, enMascara = false) : unknown {
    if (Array.isArray(node)) return node.map((hijo) => recolor(hijo, enMascara));
    if (!node || typeof node !== 'object') return node;
    const original = node as Record<string, unknown>;
    // las capas "(máscara)" son mates: su blanco no se ve y no se toca
    const mascara = enMascara || (typeof original.nm === 'string' && original.nm.includes('máscara'));
    const copia : Record<string, unknown> = {};
    for (const [clave, valor] of Object.entries(original)) copia[clave] = recolor(valor, mascara);
    const color = copia.c as { k?: unknown } | undefined;
    if ((copia.ty === 'fl' || copia.ty === 'st') && color) {
        const k = JSON.stringify(color.k);
        if (k === JSON.stringify(TEXTO_ORIGINAL) || (!mascara && copia.ty === 'st' && k === JSON.stringify(BLANCO))) {
            copia.c = { ...color, k: MARINO };
        }
    }
    return copia;
}

const logoAndes = recolor(logoAnimation) as typeof logoAnimation;
// cuadro con el casco ya puesto: es donde se queda con "reducir movimiento"
const CUADRO_REPOSO = 200;

// solo el Lottie de Los Andes EPPS (sin texto aparte); el lienzo es 1000x600 y la marca ocupa
// ~22-74% del ancho y ~13-86% del alto, asi que los margenes negativos recortan ese aire vacio
export default function LogoAndes({ ancho = 170 } : { ancho?: number }) {
    const quieto = useMediaQuery('(prefers-reduced-motion: reduce)');

    return (
        <Link to="/" aria-label="Los Andes EPPS, ir a la tienda" className="block shrink-0 overflow-hidden">
            <LottieLight
                src={logoAndes}
                loop={!quieto}
                autoplay={!quieto}
                segment={quieto ? [CUADRO_REPOSO, CUADRO_REPOSO + 1] : undefined}
                aria-hidden="true"
                style={{ width: ancho, height: ancho * 0.6, margin: `${-0.11 * ancho}px ${-0.23 * ancho}px ${-0.06 * ancho}px ${-0.19 * ancho}px` }}
            />
        </Link>
    );
}

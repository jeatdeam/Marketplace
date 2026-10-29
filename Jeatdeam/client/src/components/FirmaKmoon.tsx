import { useEffect, useState, type ComponentType } from 'react';
import type { LottieLightProps } from 'lottie-react';

import { useMediaQuery } from '../hooks/useMediaQuery';

// logo "K-moon" con luna creciente (Desktop/lotties-react/firma-kmoon/logo/kmoon_logo.json).
// Dura 150 cuadros a 30 fps = 5 s: se escribe, queda escrito y se desvanece (137-145); en bucle se repite
// cada 5 s. Texto en blanco, al 112% y 60 unidades mas abajo (cambiado en el json). Lienzo de 1140x900: el dibujo
// ocupa ~41-1139 de ancho (la filigrana de fuera llega al borde) y ~105-837 de alto, los margenes negativos recortan el resto
const ANCHO = 1140;
const ALTO = 900;
const RECORTE = { izquierda: 32, derecha: 1140, arriba: 90, abajo: 845 };
// todo dibujado y aun sin desvanecer: es donde se queda con "reducir movimiento"
const CUADRO_REPOSO = 130;

// el json pesa ~400 KB: va en un chunk aparte para no frenar la primera carga de la tienda.
// lottie tambien se carga aqui y no arriba: usa document, que no existe al armar la pagina en el servidor
const cargarLogo = () => Promise.all([
    import('lottie-react').then((modulo) => modulo.LottieLight as ComponentType<LottieLightProps>),
    import('../assets/lotties/kmoon_logo.json').then((modulo) => modulo.default as object),
]);

// ancho que ocupa el logo para un alto dado
export const anchoFirma = (alto : number) => (RECORTE.derecha - RECORTE.izquierda) * (alto / (RECORTE.abajo - RECORTE.arriba));

export default function FirmaKmoon({ alto } : { alto : number }) {
    const [logo, setLogo] = useState<{ Lottie : ComponentType<LottieLightProps>; datos : object } | null>(null);
    const quieto = useMediaQuery('(prefers-reduced-motion: reduce)');
    const escala = alto / (RECORTE.abajo - RECORTE.arriba);

    useEffect(() => {
        let vigente = true;
        cargarLogo().then(([Lottie, datos]) => { if (vigente) setLogo({ Lottie, datos }); });
        return () => { vigente = false; };
    }, []);

    return (
        <span aria-hidden="true" className="pointer-events-none block overflow-hidden" style={{ width: anchoFirma(alto), height: alto }}>
            {logo && (
                <logo.Lottie
                    src={logo.datos}
                    loop={!quieto}
                    autoplay
                    segment={quieto ? [CUADRO_REPOSO, CUADRO_REPOSO + 1] : undefined}
                    style={{
                        width: ANCHO * escala,
                        height: ALTO * escala,
                        margin: `${-RECORTE.arriba * escala}px ${-(ANCHO - RECORTE.derecha) * escala}px ${-(ALTO - RECORTE.abajo) * escala}px ${-RECORTE.izquierda * escala}px`,
                    }}
                />
            )}
        </span>
    );
}

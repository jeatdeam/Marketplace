import type { DatosBanner } from '../components/BannerInicio';
import type { GrupoSlider, PosicionBanner } from '../../../shared/types';

// lo que el dashboard le manda (postMessage) al iframe de /vista-previa para dibujar el cambio sin publicarlo.
// banner sin "banner" = la posicion vuelve a ser automatica
export type MensajeVista =
    | { tipo : 'banner'; posicion : PosicionBanner; banner?: DatosBanner }
    | { tipo : 'categoria'; slug : string; imagen : string }
    | { tipo : 'slider'; grupo : GrupoSlider };

// los anchos en los que se revisa cada cambio: celular, tablet y escritorio
export const PANTALLAS = [
    { nombre: 'Celular', ancho: 360 },
    { nombre: 'Tablet', ancho: 768 },
    { nombre: 'Escritorio', ancho: 1440 },
] as const;

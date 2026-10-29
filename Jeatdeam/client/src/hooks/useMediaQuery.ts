import { useEffect, useState } from 'react';

// en el servidor no hay pantalla: empieza en false y se corrige apenas carga en el navegador
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        const update = () => setMatches(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, [query]);

    return matches;
}

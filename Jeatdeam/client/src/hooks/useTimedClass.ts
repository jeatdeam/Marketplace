import { useCallback, useEffect, useRef, useState } from 'react';

// Activa una clase durante `ms` milisegundos (animaciones de entrada/salida del CSS)
export function useTimedFlag(ms: number): [boolean, () => void] {
    const [active, setActive] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    const trigger = useCallback(() => {
        clearTimeout(timer.current);
        setActive(false);
        requestAnimationFrame(() => {
            setActive(true);
            timer.current = setTimeout(() => setActive(false), ms);
        });
    }, [ms]);

    useEffect(() => () => clearTimeout(timer.current), []);

    return [active, trigger];
}

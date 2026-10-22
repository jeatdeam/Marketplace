import { useEffect, useRef, useState, type CSSProperties } from 'react';

const STAGGER = 25;

// Tarjeta de "NUESTRAS MARCAS": al pasar el mouse (o tocarla) el nombre cae letra por letra
interface BrandTileProps {
    className: string;
    image: string;
    name: string;
    onOpen: () => void;
}

// idle: sin texto | start: letras arriba e invisibles | shown: visibles | leave: saliendo hacia abajo
type Phase = 'idle' | 'start' | 'shown' | 'leave';

export default function BrandTile({ className, image, name, onOpen }: BrandTileProps) {
    const [phase, setPhase] = useState<Phase>('idle');
    const [round, setRound] = useState(0);
    const frame = useRef(0);

    useEffect(() => () => cancelAnimationFrame(frame.current), []);

    const enter = () => {
        cancelAnimationFrame(frame.current);
        setRound((value) => value + 1);
        setPhase('start');
        // Dos frames para que el navegador pinte la posición inicial antes de animar
        frame.current = requestAnimationFrame(() => {
            frame.current = requestAnimationFrame(() => setPhase('shown'));
        });
    };

    const leave = () => {
        cancelAnimationFrame(frame.current);
        setPhase((current) => (current === 'idle' ? 'idle' : 'leave'));
    };

    const letters = name.split('');

    const letterStyle = (indice: number): CSSProperties => {
        const base: CSSProperties = {
            color: 'white',
            transition: 'all 0.25s linear',
            display: 'inline-block',
            whiteSpace: 'pre',
            fontWeight: 'bold',
        };
        if (phase === 'shown') {
            return { ...base, transform: 'translateY(10px)', opacity: 1, transitionDelay: `${indice * STAGGER}ms` };
        }
        if (phase === 'leave') {
            return { ...base, transform: 'translateY(50px)', opacity: 0, transitionDelay: `${(letters.length - 1 - indice) * STAGGER}ms` };
        }
        return { ...base, transform: 'translateY(-100%)', opacity: 0, transition: 'none' };
    };

    return (
        <div
            className={className}
            style={{ backgroundImage: `url('${image}')`, position: 'relative' }}
            data-name={name}
            onMouseEnter={enter}
            onMouseLeave={leave}
            onTouchStart={enter}
            onTouchEnd={leave}
            onClick={onOpen}
        >
            {phase !== 'idle' && (
                <div
                    key={round}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        whiteSpace: 'nowrap',
                        transform: 'translateY(-50%)',
                        top: '50%',
                        pointerEvents: 'none',
                    }}
                >
                    {letters.map((letter, indice) => (
                        <span key={indice} style={letterStyle(indice)}>{letter}</span>
                    ))}
                </div>
            )}
        </div>
    );
}

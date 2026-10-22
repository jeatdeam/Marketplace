import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const TEXT = 'K-moon';

// Pantalla de bienvenida que escribe "K-moon" al entrar a la página principal
export default function Intro() {
    const [active, setActive] = useState(() => window.location.pathname === '/');
    const [text, setText] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!active) return;
        const body = document.body;
        body.style.display = 'none';

        const timers = TEXT.split('').map((_, index) =>
            setTimeout(() => {
                setText(TEXT.slice(0, index + 1));
                if (index === TEXT.length - 1) {
                    setDone(true);
                    body.classList.add('animate-showBody');
                }
            }, index * 150)
        );

        return () => {
            timers.forEach(clearTimeout);
            body.style.display = '';
        };
    }, [active]);

    const finish = () => {
        document.body.style.opacity = '1';
        document.body.style.display = 'block';
        setActive(false);
    };

    // Respaldo por si el navegador no dispara animationend (la animación dura 0.5s)
    useEffect(() => {
        if (!active || !done) return;
        const timer = setTimeout(finish, 1000);
        return () => clearTimeout(timer);
    }, [active, done]);

    if (!active) return null;

    return createPortal(
        <section
            className={`centerItem colorSection${done ? ' animate-color' : ''}`}
            style={{ height: '100vh', width: '100%', position: 'absolute' }}
        >
            <div style={{ width: '550px', position: 'relative', fontWeight: '100' }}>
                <h1
                    className={`prePage${done ? ' animate-item' : ''}`}
                    style={{ textAlign: 'center', fontWeight: '300' }}
                    onAnimationEnd={finish}
                >
                    {text && `${text}|`}
                </h1>
                <small
                    className="animate-sub"
                    style={{
                        position: 'absolute',
                        right: '15px',
                        top: '100%',
                        fontFamily: 'Roboto Flex',
                        fontWeight: '100',
                    }}
                >
                    by Jeatdeam
                </small>
            </div>
        </section>,
        document.documentElement
    );
}

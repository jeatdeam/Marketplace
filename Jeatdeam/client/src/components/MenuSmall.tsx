import { useEffect, useState, type CSSProperties, type TouchEvent } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import Icon from './Icon';
import { useStore } from '../context/StoreContext';

const LIST_CLASSES = ['listaOne', 'listaTwo', 'listaThree', 'listaFour', 'listaFive', 'listaSix'];
const DEFAULT_TITLES = ['TOCOBO', 'CELIMAX', 'COSRX', 'SKINNI1004', 'BEAUTY OF JOSEON', 'CENTELLA'];
const OTRAS_MARCAS = 'OTRAS MARCAS';

const pressIn = (e: TouchEvent<HTMLElement>) => { e.currentTarget.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.8)'; };
const pressOut = (e: TouchEvent<HTMLElement>) => { e.currentTarget.style.boxShadow = ''; };

interface SmallListProps {
    className: string;
    title: string;
    items: string[];
    onTitleClick: () => void;
    onItemClick: (item: string) => void;
}

function SmallList({ className, title, items, onTitleClick, onItemClick }: SmallListProps) {
    // undefined = estado inicial definido por el CSS
    const [expanded, setExpanded] = useState<boolean | undefined>(undefined);

    const listStyle: CSSProperties | undefined = expanded === undefined
        ? undefined
        : expanded
            ? { opacity: 1, height: '100%', display: 'block' }
            : { opacity: 0, height: 0, display: 'none' };

    return (
        <div className={`listaSmall ${className}`}>
            <div className="listaMarcaIcon">
                <b onClick={onTitleClick}>{title}</b>
                <Icon name="expand" fill="#999999" onClick={() => setExpanded((value) => !value)} />
            </div>
            <ul style={listStyle}>
                {items.map((item) => (
                    <li key={item} onTouchStart={pressIn} onTouchEnd={pressOut} onClick={() => onItemClick(item)}>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Menú lateral para pantallas pequeñas (se abre con el ícono de engranaje)
interface MenuSmallProps {
    open: boolean;
    onClose: () => void;
}

interface SmallListData {
    className: string;
    key?: string;
    title: string;
    items: string[];
}

export default function MenuSmall({ open, onClose }: MenuSmallProps) {
    const navigate = useNavigate();
    const { secciones } = useStore();

    useEffect(() => {
        if (!open) return;
        const onClick = (e: MouseEvent) => {
            const target = e.target as Element;
            if (target.closest('.containerMenuSmallWindow') || target.closest('[data-menu-opener]')) return;
            onClose();
        };
        // Igual que antes: el clic fuera solo cuenta cuando el menú terminó de abrirse
        const timer = setTimeout(() => document.addEventListener('click', onClick), 300);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('click', onClick);
        };
    }, [open, onClose]);

    const keys = secciones ? Object.keys(secciones) : [];
    const lists = LIST_CLASSES.map((className, indice): SmallListData => {
        if (indice < LIST_CLASSES.length - 1) {
            const key = keys[indice];
            return {
                className,
                key,
                title: key ? key.toUpperCase() : DEFAULT_TITLES[indice],
                items: key && secciones ? Object.keys(secciones[key]) : [],
            };
        }
        return {
            className,
            title: secciones ? OTRAS_MARCAS : DEFAULT_TITLES[indice],
            items: keys.slice(LIST_CLASSES.length - 1),
        };
    });

    return createPortal(
        <section
            className="containerMenuSmallWindow"
            style={open
                ? { opacity: 1, pointerEvents: 'auto', left: '0' }
                : { opacity: 0, pointerEvents: 'none', left: '-300px' }}
        >
            <div className="titleAndExit">
                <h1>K-moon</h1>
                <Icon name="close" fill="#999999" onClick={onClose} />
            </div>
            {lists.map((list) => (
                <SmallList
                    key={list.className}
                    className={list.className}
                    title={list.title}
                    items={list.items}
                    onTitleClick={() => {
                        if (list.key) navigate(`/${list.key}`);
                    }}
                    onItemClick={(item) => navigate(list.key ? `/${list.key}/${item}` : `/${item}`)}
                />
            ))}
        </section>,
        document.documentElement
    );
}

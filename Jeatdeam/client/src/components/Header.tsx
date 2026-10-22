import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Icon from './Icon';
import CartBox from './CartBox';
import { useStore } from '../context/StoreContext';

const MENU_GROUPS = 5;
const OTROS = 'OTROS';

// Texto que se escribe y borra solo debajo del nombre de la tienda
function TypewriterLine() {
    const [text, setText] = useState('');

    useEffect(() => {
        const texts = ['Lo mejor en skincare coreano.', 'Tienda especializada en K-beauty.'];
        const timers = new Set<ReturnType<typeof setTimeout>>();
        const later = (fn: () => void, ms: number) => {
            const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
            timers.add(id);
        };
        let interval: ReturnType<typeof setInterval>;
        let active = 0;

        const escribirTexto = () => {
            const showTxt = texts[active];
            showTxt.split('').forEach((_, indice) => {
                later(() => setText(showTxt.slice(0, indice + 1) + '|'), indice * 50);
            });
            later(() => borrarTexto(showTxt.length), showTxt.length * 100 + 500);
        };

        const borrarTexto = (length: number) => {
            let current = length;
            interval = setInterval(() => {
                if (current > 0) {
                    current--;
                    setText(texts[active].slice(0, current) + '|');
                } else {
                    clearInterval(interval);
                    setText('');
                    active = active === 0 ? 1 : 0;
                    later(escribirTexto, 500);
                }
            }, 50);
        };

        later(escribirTexto, 1000);

        return () => {
            timers.forEach(clearTimeout);
            clearInterval(interval);
        };
    }, []);

    return (
        <div style={{
            position: 'absolute',
            top: '75.5%',
            left: '20%',
            fontSize: 'clamp(11.5px, 5vw, 13.5px)',
            fontWeight: '100',
        }}>
            {text}
        </div>
    );
}

// Grupo del menú de escritorio: el título lleva a la sección y la lista aparece al pasar el mouse
interface MenuGroupProps {
    title: string;
    items: string[];
    disabled: boolean;
    onTitleClick: () => void;
    onItemClick: (item: string) => void;
}

function MenuGroup({ title, items, disabled, onTitleClick, onItemClick }: MenuGroupProps) {
    const [open, setOpen] = useState(false);
    const hovering = useRef(false);
    const timer = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => () => clearTimeout(timer.current), []);

    const show = () => {
        hovering.current = true;
        setOpen(true);
    };
    const hide = () => {
        hovering.current = false;
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            if (!hovering.current) setOpen(false);
        }, 100);
    };

    return (
        <div className="containerGroup">
            <b
                className="nombreElement"
                style={disabled ? { pointerEvents: 'none' } : undefined}
                onMouseEnter={show}
                onMouseLeave={hide}
                onClick={onTitleClick}
            >
                {title}
            </b>
            <ul
                className={`listaInicio${open ? ' active_list_menu' : ''}`}
                onMouseEnter={() => { hovering.current = true; }}
                onMouseLeave={hide}
            >
                {items.map((item, indice) => (
                    <li
                        key={item}
                        style={open
                            ? { transition: `opacity ${indice * 0.2}s ease-in-out`, opacity: 1 }
                            : { transition: 'opacity 0.35s linear', opacity: 0 }}
                        onClick={() => onItemClick(item)}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function PromoBanner() {
    return (
        <h1 className="c_partOne">
            <Icon name="cart" />
            por la compra de productos mayores a S/.300, delivery gratis
            <Icon name="truck" />
        </h1>
    );
}

interface HeaderProps {
    menuOpen: boolean;
    onOpenSearch: () => void;
    onToggleMenu: () => void;
}

interface Group {
    title: string;
    key?: string;
    items: string[];
}

export default function Header({ menuOpen, onOpenSearch, onToggleMenu }: HeaderProps) {
    const navigate = useNavigate();
    const { secciones, carrito, refreshCarrito } = useStore();
    const [cartBoxOpen, setCartBoxOpen] = useState(false);
    const insideBox = useRef(false);
    const hideTimer = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => () => clearTimeout(hideTimer.current), []);

    const count = carrito ? carrito.length : 0;

    // Las primeras secciones van con sus categorías; el último grupo lista el resto de secciones
    const keys = secciones ? Object.keys(secciones) : [];
    const groups = Array.from({ length: MENU_GROUPS }, (_, indice): Group => {
        if (indice < MENU_GROUPS - 1) {
            const key = keys[indice];
            return key && secciones ? { title: key.toUpperCase(), key, items: Object.keys(secciones[key]) } : { title: '', items: [] };
        }
        return { title: keys.length >= MENU_GROUPS ? OTROS : '', items: keys.slice(MENU_GROUPS - 1) };
    });

    const showCartBox = () => {
        insideBox.current = true;
        clearTimeout(hideTimer.current);
        refreshCarrito();
        setCartBoxOpen(true);
    };
    const scheduleHide = (ms: number) => {
        insideBox.current = false;
        clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => {
            if (!insideBox.current) setCartBoxOpen(false);
        }, ms);
    };

    return (
        <header id="header">
            <div className="carousel">
                <div className="containerCarrito">
                    <PromoBanner />
                    <PromoBanner />
                </div>
            </div>
            <nav id="nav">
                <div className="navegador">
                    <div>
                        <Link className="nameStore" to="/"> JD-store</Link>
                        <div className="containerIcons">
                            <ul id="iconsNav">
                                <li data-search-opener onClick={onOpenSearch}>
                                    <Icon name="search" />
                                </li>
                                <li
                                    style={{ position: 'relative' }}
                                    onTouchStart={showCartBox}
                                    onTouchEnd={() => scheduleHide(750)}
                                >
                                    <Icon
                                        name="bag"
                                        id="carrito"
                                        onMouseEnter={showCartBox}
                                        onMouseLeave={() => scheduleHide(200)}
                                        onClick={() => navigate('/carrito')}
                                    />
                                    <div
                                        id="contador-carrito"
                                        style={{
                                            position: 'absolute',
                                            top: '-12px',
                                            right: '-12px',
                                            width: '12.5px',
                                            height: '12.5px',
                                            borderRadius: '50%',
                                            textAlign: 'center',
                                            fontSize: '10px',
                                            padding: '9px',
                                            transition: 'all 0.25s linear',
                                            opacity: count ? 1 : 0,
                                            transform: count ? 'scale(1)' : 'scale(0)',
                                        }}
                                    >
                                        {count || ''}
                                    </div>
                                    <CartBox
                                        open={cartBoxOpen}
                                        onMouseEnter={() => { insideBox.current = true; }}
                                        onMouseLeave={() => scheduleHide(200)}
                                        onTouchStart={(e) => { e.stopPropagation(); insideBox.current = true; }}
                                        onTouchEnd={(e) => { e.stopPropagation(); scheduleHide(750); }}
                                    />
                                </li>
                                <li>
                                    <Icon name="settings" data-menu-opener onClick={onToggleMenu} />
                                </li>
                            </ul>
                        </div>
                    </div>
                    <TypewriterLine />
                </div>
                <div className="menu" style={menuOpen ? { pointerEvents: 'none' } : undefined}>
                    {groups.map((group, indice) => (
                        <MenuGroup
                            key={indice}
                            title={group.title}
                            items={group.items}
                            disabled={cartBoxOpen}
                            onTitleClick={() => {
                                if (group.key) navigate(`/${group.key}`);
                            }}
                            onItemClick={(item) => {
                                navigate(group.key ? `/${group.key}/${item}` : `/${item}`);
                            }}
                        />
                    ))}
                </div>
                <div className="menuDesglosable"></div>
            </nav>
            <hr />
        </header>
    );
}

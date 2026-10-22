import type { CSSProperties, HTMLAttributes, MouseEvent, TouchEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { groupCarrito, totalCarrito, useStore } from '../context/StoreContext';

const hoverGradient = 'radial-gradient(circle, rgba(251,254,255,0.9164040616246498) 23%, rgba(150,211,249,0.8883928571428571) 68%, rgba(79,178,244,0.6138830532212884) 92%)';

// Resumen del carrito que se despliega bajo el ícono de la bolsa
interface CartBoxProps extends HTMLAttributes<HTMLElement> {
    open: boolean;
}

export default function CartBox({ open, ...handlers }: CartBoxProps) {
    const navigate = useNavigate();
    const { carrito } = useStore();
    const items = carrito || [];

    const style: CSSProperties = {
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
    };

    if (items.length === 0) {
        return (
            <section className="cajitaCompras sinCompras" style={style} {...handlers}>
                0
            </section>
        );
    }

    type ButtonEvent = MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>;

    const highlight = (e: ButtonEvent) => {
        e.currentTarget.style.background = hoverGradient;
        e.currentTarget.style.transition = 'all 0.25s ease-in-out';
    };
    const unhighlight = (e: ButtonEvent) => {
        e.currentTarget.style.background = '';
    };

    return (
        <section className="cajitaCompras" style={style} {...handlers}>
            <div className="containerBox">
                {groupCarrito(items).map((group, index) => {
                    const product = group[0];
                    return (
                        <section key={product.id} className={`productCarrito productCarrito_${index + 1}`} data-price={product.id}>
                            <div>
                                <b>{product.brand}</b>
                                <span>{product.name}</span>
                                <span>S/.{product.price}</span>
                                <span className="countProduct">{group.length}</span>
                            </div>
                            <img src={product.img} className="product-image" alt={product.name} />
                        </section>
                    );
                })}
            </div>
            <div style={{ fontWeight: 'bold' }}>
                <span>Total: </span>
                <span className="cuentaTotal">{totalCarrito(items)}</span>
            </div>
            <button
                style={{ padding: '7.5px', borderRadius: '7.5px', transition: 'all 0.25s ease-in-out' }}
                onMouseEnter={highlight}
                onMouseLeave={unhighlight}
                onTouchStart={highlight}
                onTouchEnd={unhighlight}
                onClick={() => navigate('/carrito')}
            >
                ir al carrito
            </button>
        </section>
    );
}

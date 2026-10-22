import { useEffect, useRef, useState } from 'react';

import Icon from '../components/Icon';
import ShippingForm from '../components/ShippingForm';
import WalletPanel from '../components/WalletPanel';
import { groupCarrito, totalCarrito, useStore } from '../context/StoreContext';
import type { CartItem } from '../../../shared/types';

const ANIMATION_MS = 350;
const CARD_OPTIONS = ['payCardOptions_one', 'payCardOptions_two'];
const VIRTUAL_OPTIONS = ['payVirtualOptions_one', 'payVirtualOptions_two', 'payVirtualOptions_three'];

// Estado de un panel con animación de entrada/salida
type PanelState = 'closed' | 'opening' | 'open' | 'closing';

function usePanel() {
    const [state, setState] = useState<PanelState>('closed');
    const timer = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => () => clearTimeout(timer.current), []);

    const transition = (temporary: PanelState, final: PanelState) => {
        clearTimeout(timer.current);
        setState(temporary);
        timer.current = setTimeout(() => setState(final), ANIMATION_MS);
    };

    const isVisible = state !== 'closed';
    return {
        state,
        isVisible,
        open: () => transition('opening', 'open'),
        close: () => transition('closing', 'closed'),
        toggle: () => (state === 'open' || state === 'opening' ? transition('closing', 'closed') : transition('opening', 'open')),
    };
}

interface CompraGroupProps {
    group: CartItem[];
    index: number;
    blinking: boolean;
    onAdd: (product: CartItem) => void;
    onRemoveOne: (idCompra: number) => void;
    onRemoveGroup: (id: string) => void;
}

function CompraGroup({ group, index, blinking, onAdd, onRemoveOne, onRemoveGroup }: CompraGroupProps) {
    const product = group[0];

    return (
        <div className={`group_products group_products_${index + 1}${blinking ? ' blinkEffect' : ''}`} style={{ position: 'relative' }}>
            <div className={`compraElement compraElement_${index + 1}`}>
                <img src={product.img} alt={product.brand} />
                <h3>{product.brand}</h3>
                <span>{product.name}</span>
                <p>
                    <b>Total:</b>
                    <small> S/.  {product.price}</small>
                </p>
                <div id="deleteElementCompra" onClick={() => onRemoveGroup(product.id)}>
                    <Icon name="close" />
                </div>
                <div className="controllerCountProducts">
                    <Icon name="minus" id="arrowLeft" fill="#999999" onClick={() => onRemoveOne(product.idCompra)} />
                    <div className="contadorElementsCompra">
                        <small>{group.length}</small>
                    </div>
                    <Icon name="plus" id="arrowRight" fill="#999999" onClick={() => onAdd(product)} />
                </div>
            </div>
        </div>
    );
}

// /carrito
export default function Compra() {
    const { carrito, addToCart, removeOne, removeGroup, clearCarrito } = useStore();
    const [cleared, setCleared] = useState(false);
    const [blinkId, setBlinkId] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const [tick, setTick] = useState(0);
    const form = usePanel();
    const wallet = usePanel();
    const blinkTimer = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => () => clearTimeout(blinkTimer.current), []);

    // Tras validar los datos, los botones de pago alternan las imágenes de los medios de pago
    useEffect(() => {
        if (!sent) return;
        const interval = setInterval(() => setTick((value) => value + 1), 2000);
        return () => clearInterval(interval);
    }, [sent]);

    if (!carrito) return <main><section className="compraPage" /></main>;

    const addOne = async (product: CartItem) => {
        await addToCart(product);
        clearTimeout(blinkTimer.current);
        setBlinkId(product.id);
        blinkTimer.current = setTimeout(() => setBlinkId(null), 125);
    };

    const clearAll = async () => {
        await clearCarrito();
        setCleared(true);
    };

    const onFormSuccess = () => {
        setSent(true);
        form.close();
    };

    const formClass = ({ closed: '', opening: 'active_form', open: 'active_form', closing: 'active_form desactive_form' } as const)[form.state];
    const walletClass = ({ closed: '', opening: 'templateYapePlin', open: '', closing: 'templateYapePlin_two' } as const)[wallet.state];

    if (carrito.length === 0 && !cleared) {
        return (
            <main>
                <section className="compraPage">
                    <h2 style={{ textAlign: 'center' }}>El carrito está vacío.</h2>
                </section>
            </main>
        );
    }

    return (
        <main>
            <section className="compraPage">
                <div>
                    <h1>Carrito de compras</h1>
                    <button className="deleteAllProducts" onClick={clearAll}>borrar todo</button>
                </div>
                <section className="productsAndPay">
                    {cleared ? (
                        <h2>El carrito ha sido eliminado</h2>
                    ) : (
                        <>
                            <section className="containerElementsCompra">
                                {groupCarrito(carrito).map((group, index) => (
                                    <CompraGroup
                                        key={group[0].id}
                                        group={group}
                                        index={index}
                                        blinking={blinkId === group[0].id}
                                        onAdd={addOne}
                                        onRemoveOne={removeOne}
                                        onRemoveGroup={removeGroup}
                                    />
                                ))}
                            </section>
                            <ShippingForm
                                className={formClass}
                                focusOnOpen={form.state === 'opening'}
                                onSuccess={onFormSuccess}
                            />
                            {wallet.isVisible && <WalletPanel className={walletClass} onClose={wallet.close} />}
                        </>
                    )}
                </section>
                {!cleared && (
                    <>
                        <hr />
                        <section className="buttonsFinalizar">
                            <h2 className="totalCompra">Total: S/{totalCarrito(carrito).toFixed(2)}</h2>
                            <button
                                id="formularioEnvio"
                                style={sent ? { display: 'none' } : undefined}
                                onClick={form.toggle}
                            >
                                Rellenar Datos
                            </button>
                            <button
                                id="payCard"
                                className={sent ? CARD_OPTIONS[tick % CARD_OPTIONS.length] : undefined}
                                style={sent ? { display: 'block' } : undefined}
                                onClick={wallet.toggle}
                            >
                                {sent ? '' : 'pagar con tarjeta'}
                            </button>
                            <button
                                id="payVirtualWallet"
                                className={sent ? VIRTUAL_OPTIONS[tick % VIRTUAL_OPTIONS.length] : undefined}
                                style={sent ? { display: 'block' } : undefined}
                            >
                                {sent ? '' : 'pagar con billeteras digital'}
                            </button>
                        </section>
                    </>
                )}
            </section>
        </main>
    );
}

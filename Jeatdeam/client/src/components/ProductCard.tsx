import type { MouseEvent } from 'react';

import { useCartActions } from '../context/StoreContext';
import type { Product } from '../../../shared/types';

interface ProductCardProps {
    product: Product;
    className: string;
    onOpen?: () => void;
    addLabel?: string;
    buyLabel?: string;
    addClassName?: string;
    buyClassName?: string;
    priceTag?: 'small' | 'b';
    pricePrefix?: string;
}

// Tarjeta de producto usada en "más vendidos", marcas, categorías y recomendados
export default function ProductCard({
    product,
    className,
    onOpen,
    addLabel = 'agregar al carrito',
    buyLabel = 'comprar',
    addClassName,
    buyClassName,
    priceTag: PriceTag = 'small',
    pricePrefix = 'S/.',
}: ProductCardProps) {
    const { add, buy } = useCartActions();

    const handle = (action: (product: Product) => Promise<void>) => (e: MouseEvent) => {
        e.stopPropagation();
        action(product);
    };

    return (
        <div
            className={className}
            data-categoria={product.category}
            data-brand={product.brand}
            data-name={product.name}
            onClick={onOpen}
        >
            <img src={product.img[0]} alt={product.name} draggable={false} />
            <b>{product.subtitle}</b>
            <PriceTag>{pricePrefix}{product.price}</PriceTag>
            <div>
                <button className={addClassName} onClick={handle(add)}>{addLabel}</button>
                <button className={buyClassName} onClick={handle(buy)}>{buyLabel}</button>
            </div>
        </div>
    );
}

export const productPath = (product: Product) => `/${product.brand}/${product.category}/${product.name}`;

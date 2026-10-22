import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import Icon from './Icon';
import { useStore } from '../context/StoreContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import type { Product } from '../../../shared/types';

const sentence = (product: Product) => `${product.brand.toLowerCase()} ${product.name.toLowerCase()}`;

function filterProducts(baseDatos: Product[], query: string): Product[] {
    const texto = query.toLowerCase().trim();
    if (!texto) return [];
    const words = texto.split(/\s+/);
    return baseDatos.filter((product) => words.every((word) => sentence(product).includes(word)));
}

// Buscador flotante que se abre con la lupa del header
interface SearchOverlayProps {
    open: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
    const navigate = useNavigate();
    const { baseDatos } = useStore();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const priceInside = useMediaQuery('(max-width: 480px)');

    // Clic fuera del buscador: cerrarlo y limpiar la lista
    useEffect(() => {
        if (!open) return;
        const onClick = (e: MouseEvent) => {
            const target = e.target as Element;
            if (target.closest('.busquedaInteractiva') || target.closest('[data-search-opener]')) return;
            setResults([]);
            onClose();
        };
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, [open, onClose]);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setResults(filterProducts(baseDatos || [], e.target.value));
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const texto = query.trim();
        if (e.key === 'Enter' && texto) navigate(`/${texto}`);
    };

    return createPortal(
        <section className={`busquedaInteractiva${open ? ' activeBusqueda' : ''}`}>
            <div className="iconsBusqueda" onClick={() => inputRef.current?.focus()}>
                <Icon name="search" fill="#999999" />
                <input
                    ref={inputRef}
                    type="search"
                    placeholder="Buscar producto"
                    value={query}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                />
                <Icon
                    name="exit"
                    fill="#999999"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                />
            </div>
            <div className="searchAndOptions">
                <ul key={query} className={results.length ? 'show-animation-busqueda' : undefined} style={{ opacity: 1 }}>
                    {results.map((product) => {
                        const price = (
                            <span style={{ fontWeight: priceInside ? 'bold' : '500', fontSize: '16px' }}>
                                S/. {product.price}
                            </span>
                        );
                        return (
                            <li
                                key={`${product.brand}-${product.name}`}
                                onClick={() => navigate(`/${product.brand}/${product.category}/${product.name}`)}
                            >
                                <img src={product.img[0]} data-category={product.category} alt={product.name} />
                                <div>
                                    <span style={{ fontSize: '16px', fontWeight: '500' }}>{product.brand}</span>
                                    <span>
                                        {product.name.split(' ').map((word, indice) => (
                                            <span key={indice} style={{ fontSize: '16px' }}>{word}</span>
                                        ))}
                                    </span>
                                    {priceInside && price}
                                </div>
                                {!priceInside && price}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>,
        document.documentElement
    );
}

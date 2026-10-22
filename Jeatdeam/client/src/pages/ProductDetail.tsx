import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import NotFound from './NotFound';
import { useCartActions, useStore } from '../context/StoreContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import type { Product } from '../../../shared/types';

const SHORT_INFO_LABELS = ['tipo', 'color', 'estado', 'rango de edad', 'caracteristicas'];

// Galería: las 4 imágenes rotan de posición cada 2s; las flechas mueven una posición
function Gallery({ images }: { images: string[] }) {
    const [step, setStep] = useState(0);
    const interval = useRef<ReturnType<typeof setInterval>>();
    const total = images.length;

    const startInterval = () => {
        clearInterval(interval.current);
        interval.current = setInterval(() => setStep((value) => value + 1), 2000);
    };

    useEffect(() => {
        setStep(0);
        startInterval();
        return () => clearInterval(interval.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images]);

    const move = (delta: number) => {
        setStep((value) => value + delta);
        startInterval();
    };

    const imageAt = (position: number) => images[(((position - step) % total) + total) % total];
    const active = ((step % total) + total) % total;

    return (
        <div className="sideLeft">
            <div className="topLeft">
                <img src={imageAt(0)} alt="" draggable={false} />
            </div>
            <div className="botLeft">
                <img src={imageAt(1)} alt="" draggable={false} />
                <img src={imageAt(2)} alt="" draggable={false} />
                <img src={imageAt(3)} alt="" draggable={false} />
                <div className="arrowsLeftSide">
                    <Icon name="chevronLeft" fill="#999999" onClick={() => move(-1)} />
                    <Icon name="chevronRight" fill="#999999" onClick={() => move(1)} />
                </div>
                <div className="circlesLeftSide">
                    {images.map((src, indice) => (
                        <div key={indice} style={{ background: indice === active ? 'black' : '' }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function BottomInfo({ producto }: { producto: Product }) {
    return (
        <div className="bottomInfo">
            <h1>Sobre este árticulo</h1>
            <ul>
                <li>{producto.longInfo[0]}</li>
                <li>{producto.longInfo[0]}</li>
                <li>{producto.longInfo[0]}</li>
                <li>{producto.longInfo[0]}</li>
            </ul>
        </div>
    );
}

// /:brand/:categoria/:product
export default function ProductDetail() {
    const { brand, product: name } = useParams();
    const { baseDatos } = useStore();
    const { add, buy } = useCartActions();
    // En pantallas medianas/pequeñas la descripción va debajo de la ficha
    const stacked = useMediaQuery('(max-width: 1024px)');

    if (!baseDatos) return null;

    const producto = baseDatos.find((item) => item.brand === brand && item.name === name);
    if (!producto) return <NotFound />;

    const recomendados = baseDatos.filter((item) => item.brand === brand);

    return (
        <main className="container_productDetail">
            <h1>{producto.brand}</h1>
            <section className="info_productDetail">
                <Gallery images={producto.img} />
                <div className="sideRight">
                    <h2>{producto.subtitle}</h2>
                    <div className="priceStar">
                        <b style={{ fontWeight: 600 }}>{`S/. ${producto.price}`}</b>
                    </div>
                    <hr />
                    {SHORT_INFO_LABELS.map((label, indice) => (
                        <div className="middleInfo" key={label}>
                            <b>{label}</b>
                            <h4>{producto.shortInfo[indice]}</h4>
                        </div>
                    ))}
                    <hr />
                    {!stacked && <BottomInfo producto={producto} />}
                    <div className="lastMove">
                        <button onClick={() => add(producto)}>enviar al carrito</button>
                        <button onClick={() => buy(producto)}>comprar</button>
                    </div>
                </div>
            </section>
            {stacked && <BottomInfo producto={producto} />}

            <section className="productsRecomended">
                <h1>Productos Recomendados</h1>
                <div className="containerElementsRecomended">
                    {recomendados.map((element) => (
                        <ProductCard
                            key={element.id}
                            product={element}
                            className={`product${element.category} productRecomendent`}
                            priceTag="b"
                            pricePrefix="S/. "
                            addClassName="btn-carrito"
                            buyClassName="btn-comprar"
                            buyLabel="compra"
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}

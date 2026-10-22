import { useNavigate, useParams } from 'react-router-dom';

import ProductCard, { productPath } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

// /:name -> productos de una sección de la tienda (dinosaurios, tendencias, ...)
export default function Marca() {
    const { name = '' } = useParams();
    const navigate = useNavigate();
    const { baseDatos } = useStore();

    if (!baseDatos) return <main className="containerBrands" />;

    const productosPorMarca = baseDatos.filter((product) => product.category === name);

    return (
        <main className="containerBrands">
            <h1>{name.toUpperCase()}</h1>
            {productosPorMarca.length > 0 ? (
                <section className="productsBrands">
                    {productosPorMarca.map((product, indice) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            className={`elementProduct elementProduct_${indice + 1}`}
                            onOpen={() => navigate(productPath(product))}
                        />
                    ))}
                </section>
            ) : (
                <h1>no existe elementos de esta marca</h1>
            )}
        </main>
    );
}

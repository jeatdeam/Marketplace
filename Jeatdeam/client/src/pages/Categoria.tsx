import { useNavigate, useParams } from 'react-router-dom';

import ProductCard, { productPath } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

// /:brand/:categoria
export default function Categoria() {
    const { brand, categoria = '' } = useParams();
    const navigate = useNavigate();
    const { baseDatos } = useStore();

    const productos = (baseDatos || []).filter(
        (producto) => producto.brand === brand && producto.category === categoria
    );

    return (
        <main className="containerCategorias">
            <h1>{categoria.toUpperCase()}</h1>
            <div className={`category category_${categoria}`}>
                {productos.map((product, indice) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        className={`categoryElement categoryElement_${indice + 1}`}
                        addClassName="btn-carrito"
                        onOpen={() => navigate(productPath(product))}
                    />
                ))}
            </div>
        </main>
    );
}

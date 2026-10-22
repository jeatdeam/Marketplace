import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import Marca from './pages/Marca';
import Categoria from './pages/Categoria';
import ProductDetail from './pages/ProductDetail';
import Compra from './pages/Compra';
import Catalogo from './pages/Catalogo';
import QuienesSomos from './pages/QuienesSomos';
import SimplePage from './pages/SimplePage';
import NotFound from './pages/NotFound';

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/carrito" element={<Compra />} />
                <Route path="/catalogoProducts" element={<Catalogo />} />
                <Route path="/quienes-somos" element={<QuienesSomos />} />
                <Route path="/contacto" element={<SimplePage title="este es el contacto pug" />} />
                <Route path="/envios" element={<SimplePage title="este es la pagina de envios" />} />
                <Route path="/productos" element={<SimplePage title="este es la pagina de productos" />} />
                <Route path="/promociones" element={<SimplePage title="este es la pagina de las promociones" />} />
                <Route path="/producto" element={<SimplePage title="aqui esta un producto elegido" />} />

                {/* Rutas dinámicas: categoría de la tienda, marca/categoría y detalle de producto */}
                <Route path="/:name" element={<Marca />} />
                <Route path="/:brand/:categoria" element={<Categoria />} />
                <Route path="/:brand/:categoria/:product" element={<ProductDetail />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

import { Navigate, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import Marca from './pages/Marca';
import Categoria from './pages/Categoria';
import ProductDetail from './pages/ProductDetail';
import Compra from './pages/Compra';
import Catalogo from './pages/Catalogo';
import QuienesSomos from './pages/QuienesSomos';
import Contacto from './pages/Contacto';
import Envios from './pages/Envios';
import LibroReclamaciones from './pages/LibroReclamaciones';
import PaginaLegal from './pages/PaginaLegal';
import PagoExitoso from './pages/PagoExitoso';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import VistaPrevia from './pages/VistaPrevia';

export default function App() {
    return (
        <Routes>
            {/* fuera del layout: el dashboard no lleva la barra, el header ni el footer de la tienda */}
            <Route path="/dashboard" element={<Dashboard />} />
            {/* la abre el dashboard dentro de iframes para ver los cambios en cada tamaño de pantalla */}
            <Route path="/vista-previa" element={<VistaPrevia />} />
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/carrito" element={<Compra />} />
                <Route path="/productos" element={<Catalogo />} />
                <Route path="/catalogoProducts" element={<Navigate to="/productos" replace />} />
                <Route
                    path="/promociones"
                    element={<Catalogo titulo="Ofertas" descripcion="Descuentos de la semana en juguetes seleccionados." soloOfertas />}
                />
                <Route path="/quienes-somos" element={<QuienesSomos />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/envios" element={<Envios />} />
                <Route path="/libro-de-reclamaciones" element={<LibroReclamaciones />} />
                <Route path="/terminos" element={<PaginaLegal tipo="terminos" />} />
                <Route path="/privacidad" element={<PaginaLegal tipo="privacidad" />} />
                <Route path="/pago-exitoso" element={<PagoExitoso />} />

                {/* Rutas dinámicas: categoría de la tienda, marca/categoría y detalle de producto */}
                <Route path="/:name" element={<Marca />} />
                <Route path="/:brand/:categoria" element={<Categoria />} />
                <Route path="/:brand/:categoria/:product" element={<ProductDetail />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

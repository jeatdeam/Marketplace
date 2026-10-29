import Layout from '../Jeatdeam/client/src/components/Layout';
import NotFound from '../Jeatdeam/client/src/pages/NotFound';

// rutas que no existen: la pagina 404 con la barra, el header y el footer de la tienda
export default function NoEncontrado() {
    return (
        <Layout>
            <NotFound />
        </Layout>
    );
}

import { Navigate, useParams } from 'react-router-dom';

// /:brand/:categoria -> el catalogo ya filtra por categoria y busca la marca
export default function Categoria() {
    const { brand = '', categoria = '' } = useParams();
    return <Navigate to={`/${encodeURIComponent(categoria)}?q=${encodeURIComponent(brand)}`} replace />;
}

'use client';
import { PaginaEstado } from '../components/ui';

export default function NotFound() {
    return (
        <PaginaEstado
            codigo="404"
            titulo="Esta página se escondió en la caja de juguetes"
            descripcion="El enlace puede estar roto o el producto ya no está disponible. Revisa el catálogo o vuelve al inicio."
            principal={{ texto: 'Ver catálogo', a: '/productos' }}
            secundario={{ texto: 'Ir al inicio', a: '/' }}
        />
    );
}

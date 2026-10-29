import { redirect } from 'next/navigation';

// /:brand/:categoria -> el catalogo ya filtra por categoria y busca la marca
export default async function Pagina({ params }: { params: Promise<{ brand: string; categoria: string }> }) {
    const { brand, categoria } = await params;
    redirect(`/${categoria}?q=${brand}`);
}

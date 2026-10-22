// Páginas que por ahora solo muestran un título (contacto, envíos, productos, promociones)
export default function SimplePage({ title }: { title: string }) {
    return (
        <main>
            <h1>{title}</h1>
        </main>
    );
}

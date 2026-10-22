import { useStore } from '../context/StoreContext';

export default function QuienesSomos() {
    const { baseDatos } = useStore();

    return (
        <main>
            {baseDatos ? (
                baseDatos.map((element) => (
                    <div key={element.id}>
                        <h1>esta es la pagina de quienes somos</h1>
                        <p>{element.img[0]}</p>
                        <img src={element.img[0]} alt={element.name} />
                        <a href={element.img[0]}>aaaaaaaaaaaaaaaaaaaaaaa</a>
                    </div>
                ))
            ) : (
                <h1>probando gaaaaaaaaaaaaaaa</h1>
            )}
        </main>
    );
}

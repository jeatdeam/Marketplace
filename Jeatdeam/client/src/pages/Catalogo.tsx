import { Link } from 'react-router-dom';

import { useStore } from '../context/StoreContext';

export default function Catalogo() {
    const { baseDatos } = useStore();

    return (
        <main>
            <h1></h1>
            <section className="containerCards">
                {baseDatos && baseDatos.length > 1 ? (
                    baseDatos.map((el, indice) => (
                        <Link key={indice} className={`cardElement cardElement-${indice}`} id={`${indice}`} to={`/producto/${indice}`}>
                            <h1>{indice}</h1>
                        </Link>
                    ))
                ) : (
                    <p>no hay datos</p>
                )}
            </section>
        </main>
    );
}

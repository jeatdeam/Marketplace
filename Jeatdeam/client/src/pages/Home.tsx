import { useNavigate } from 'react-router-dom';

import HeroCarousel from '../components/HeroCarousel';
import BrandTile from '../components/BrandTile';
import MasVendidos from '../components/MasVendidos';
import Icon from '../components/Icon';
import { useStore } from '../context/StoreContext';

const MARCAS = [
    { className: 'marcaOne', name: 'dinosaurios', image: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744210274/dino-mejoado_fsiyf0.png' },
    { className: 'marcaTwo', name: 'tendencias', image: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221205/font-two_sdp354.webp' },
    { className: 'marcaThree', name: 'animales', image: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221203/fondo-three_wcsgat.webp' },
    { className: 'marcaFour', name: 'peluches', image: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221161/fondo-four_ozisxd.webp' },
    { className: 'marcaFive', name: 'anime', image: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221141/fondo-five_ke60f1.webp' },
    { className: 'marcaSix', name: 'mascotas', image: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221198/fondo-six_r2ltrw.webp' },
    { className: 'marcaSeven', name: 'dormitorio', image: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221196/fondo-seven_v4dkvt.webp' },
    { className: 'marcaEight', name: 'tecnologia', image: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221131/fondo-eight_iim4bj.webp' },
    { className: 'marcaNine', name: 'regalos', image: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221192/fondo-nine_t1ac60.webp' },
    { className: 'marcaTen', name: 'coleccion', image: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221247/fondo-ten_bfrawo.webp' },
];

const CATALOGO = ['SERUMS', 'CREMAS', 'MAQUILLAJE', 'BLOQUEADORES', 'LABIALES', 'OTROS'];

export default function Home() {
    const navigate = useNavigate();
    const { baseDatos } = useStore();

    return (
        <main>
            <HeroCarousel />

            <section className="infoCenter">
                <div className="elementInfo_one">
                    <div>
                        <Icon name="truck" fill="#999999" />
                        <b>Delivery y envios a todo el Perú</b>
                        <small>¡recibelos en casa hasta en el mismo dia de compra!</small>
                    </div>
                    <div>
                        <Icon name="payments" fill="#999999" />
                        <b>Opciones de pago variados</b>
                        <small>¡aceptamos todos los medios de pago; incluso yape y plin!</small>
                    </div>
                </div>
                <div className="elementInfo_two">
                    <div>
                        <Icon name="shield" fill="#999999" />
                        <b>Compras seguras y protegidas</b>
                        <small>¡realiza compras con total confianza, sus  datos estan protegidos!</small>
                    </div>
                    <div>
                        <Icon name="pets" fill="#999999" />
                        <b>Contamos con productos cruelty free</b>
                        <small>¡apoyamos un estilo de vida mas etico y sostenible para los animales!</small>
                    </div>
                </div>
            </section>

            <section className="marcas">
                <h1> NUESTRAS MARCAS</h1>
                <div className="containerMarcas">
                    {MARCAS.map((marca) => (
                        <BrandTile
                            key={marca.name}
                            className={`marca ${marca.className}`}
                            image={marca.image}
                            name={marca.name}
                            onOpen={() => navigate(`/${marca.name}`)}
                        />
                    ))}
                </div>
            </section>

            {baseDatos && <MasVendidos products={baseDatos} />}

            <section className="catalogo">
                <h1>DESCUBRE NUESTRO CATALOGO</h1>
                <div className="catalogoElements">
                    {CATALOGO.map((title) => (
                        <div className="elemento" key={title}>
                            <h2>{title}</h2>
                            <video className="video" autoPlay muted loop playsInline>
                                <source src="/video/celimax/celimax.mp4" type="video/mp4" />
                                Tu navegador no soporta el elemento de video.
                            </video>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

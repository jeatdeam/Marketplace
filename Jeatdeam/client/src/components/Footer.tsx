import { Link } from 'react-router-dom';

import { socialIcons } from './socialIcons';

export default function Footer() {
    return (
        <>
            <hr />
            <footer id="footer">
                <div className="descriptionTop">
                    <b>K-MOON</b>
                    <h3>K-MOON TE TRAE LO MEJOR EN PRODUCTOS DE BELLEZA</h3>
                    <h4>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, alias deserunt distinctio earum et illo in ipsum iste iure magni maiores molestias odit pariatur perspiciatis, quia saepe similique voluptate voluptates.</h4>
                    <Link to="/catalogoProducts">Conoce más aqui</Link>
                </div>
                <div className="descriptionMid">
                    <hr className="lineHorizontal" />
                    <ul id="socialMedia">
                        {/* SVG estáticos propios, copiados de la versión Pug */}
                        {socialIcons.map((svg, indice) => (
                            <li key={indice} dangerouslySetInnerHTML={{ __html: svg }} />
                        ))}
                    </ul>
                    <hr className="lineHorizontal" />
                </div>
                <ul id="categoriasFooter">
                    <li><Link to="/quienes-somos">Quienes somos</Link></li>
                    <li><Link to="/contacto">Contacto</Link></li>
                    <li><Link to="/productos">Productos</Link></li>
                    <li><Link to="/promociones">Promociones</Link></li>
                    <li><Link to="/envios">Envios</Link></li>
                </ul>
                <h3>Encuentranos en Elvira García y Garcia 2514, Cercado de Lima</h3>
                <div
                    className="infoDev"
                    onClick={(e) => {
                        if ((e.target as Element).closest('a')) return;
                        window.location.href = 'https://www.bumeran.com.pe/postulantes/curriculum';
                    }}
                >
                    <small>@2024 k-moon todos los derechos reservados, desarrollado por</small>
                    <a href="https://www.linkedin.com/in/paulo-aylas/"> Jeatdeam</a>
                </div>
            </footer>
        </>
    );
}

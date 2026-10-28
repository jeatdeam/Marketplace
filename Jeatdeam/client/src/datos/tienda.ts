// datos de la tienda y del catalogo; lo que el servidor no trae se inventa aqui para el prototipo
import type { Apariencia, GrupoSlider, Product } from '../../../shared/types';

export { TIENDA } from '../../../shared/tienda';

export const REDES = [
    { nombre: 'Facebook', icono: 'facebook', url: 'https://facebook.com' },
    { nombre: 'Instagram', icono: 'instagram', url: 'https://instagram.com' },
    { nombre: 'TikTok', icono: 'tiktok', url: 'https://tiktok.com' },
    { nombre: 'YouTube', icono: 'youtube', url: 'https://youtube.com' },
] as const;

export interface Categoria {
    slug: string;
    nombre: string;
    descripcion: string;
    imagen: string;
}

// mismas secciones que devuelve el servidor (seccionProducts), con nombre bonito e imagen
export const CATEGORIAS: Categoria[] = [
    { slug: 'dinosaurios', nombre: 'Dinosaurios', descripcion: 'Mordelones articulados y texturizados', imagen: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744210274/dino-mejoado_fsiyf0.png' },
    { slug: 'tendencias', nombre: 'Tendencias', descripcion: 'Lo que todos están pidiendo', imagen: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221205/font-two_sdp354.webp' },
    { slug: 'animales', nombre: 'Animales', descripcion: 'Granja, selva y océano', imagen: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221203/fondo-three_wcsgat.webp' },
    { slug: 'peluches', nombre: 'Peluches', descripcion: 'Suaves, lavables y antialérgicos', imagen: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221161/fondo-four_ozisxd.webp' },
    { slug: 'anime', nombre: 'Anime', descripcion: 'Figuras y llaveros de tus series', imagen: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221141/fondo-five_ke60f1.webp' },
    { slug: 'mascotas', nombre: 'Mascotas', descripcion: 'Juguetes para perros y gatos', imagen: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221198/fondo-six_r2ltrw.webp' },
    { slug: 'dormitorio', nombre: 'Dormitorio', descripcion: 'Lámparas, cojines y decoración', imagen: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221196/fondo-seven_v4dkvt.webp' },
    { slug: 'tecnologia', nombre: 'Tecnología', descripcion: 'Gadgets y juguetes con luces', imagen: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221131/fondo-eight_iim4bj.webp' },
    { slug: 'regalos', nombre: 'Regalos', descripcion: 'Packs listos para regalar', imagen: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221192/fondo-nine_t1ac60.webp' },
    { slug: 'coleccion', nombre: 'Colección', descripcion: 'Ediciones limitadas', imagen: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1744221247/fondo-ten_bfrawo.webp' },
];

// imagen 1 (izquierda) vs imagen 2 (derecha) de cada grupo del slider del inicio.
// fotos de wikimedia commons: si se publica la tienda, hay que dar credito segun su licencia
const TEXTOS_SLIDER = [
    ['Era jurásica', 'Rugido fósil'],
    ['Peluches', 'Abrazos suaves'],
    ['Mascotas', 'Amigos fieles'],
    ['Colección', 'Edición limitada'],
];

export const SLIDER_ORIGINAL : GrupoSlider[] = TEXTOS_SLIDER.map(([textoUno, textoDos], i) => ({
    imagenUno: `/beforeAfter/imagen1-${i + 1}.jpg`,
    imagenDos: `/beforeAfter/imagen2-${i + 1}.jpg`,
    textoUno,
    textoDos,
}));

// lo que el dashboard cambio reemplaza a la imagen original; lo demas queda igual
export const categoriasConImagen = (apariencia : Apariencia) : Categoria[] =>
    CATEGORIAS.map((categoria) => ({ ...categoria, imagen: apariencia.categorias[categoria.slug] ?? categoria.imagen }));

// un grupo guardado antes de que existieran los textos usa los textos originales
export const gruposSlider = (apariencia : Apariencia) : GrupoSlider[] =>
    SLIDER_ORIGINAL.map((original, indice) => {
        const guardado = apariencia.slider[indice];
        if (!guardado) return original;
        return { ...guardado, textoUno: guardado.textoUno || original.textoUno, textoDos: guardado.textoDos || original.textoDos };
    });

export const categoriaPorSlug = (slug : string) => CATEGORIAS.find((categoria) => categoria.slug === slug);

export const nombreCategoria = (slug : string) =>
    categoriaPorSlug(slug)?.nombre ?? slug.charAt(0).toUpperCase() + slug.slice(1);

// el servidor guarda los precios en centimos (unit_amount de stripe)
export const precioSoles = (centimos : number) => centimos / 100;

export const formatoSoles = (soles : number) =>
    `S/ ${soles.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// hash estable para que los datos inventados no cambien entre recargas
function hash(texto : string) {
    let valor = 0;
    for (const letra of texto) valor = (valor * 31 + letra.charCodeAt(0)) >>> 0;
    return valor;
}

// mismo calculo que el servidor al cobrar (controllers/taskController.ts)
export const precioFinalCentimos = (producto : Product) =>
    Math.round((producto.price * (100 - (producto.descuento ?? 0))) / 100);

const DESCUENTOS = [0, 10, 0, 15, 20, 0, 25, 0, 30, 10];

// el precio real no se toca (stripe cobra ese); el descuento se muestra con un "precio anterior" inventado
export function datosProducto(producto : Product) {
    const semilla = hash(producto.name);
    // lo que se guardo en el dashboard manda; si falta, se inventa un valor estable
    // con descuento guardado en el dashboard: price es el precio normal y se le resta el descuento.
    // sin el: price ya es el precio final y el "precio anterior" es inventado para el prototipo
    const guardado = producto.descuento !== undefined;
    const descuento = producto.descuento ?? DESCUENTOS[semilla % DESCUENTOS.length];
    const precio = guardado ? precioSoles(precioFinalCentimos(producto)) : precioSoles(producto.price);
    const precioAnterior = !descuento ? null : guardado ? precioSoles(producto.price) : Math.round(precio / (1 - descuento / 100));
    const calificacion = 3.8 + (semilla % 13) / 10; // 3.8 a 5.0
    const resenas = 12 + (semilla % 140);
    const stock = producto.stock ?? 3 + (semilla % 28);
    return {
        descuento,
        precio,
        precioAnterior,
        calificacion: Math.min(5, Math.round(calificacion * 10) / 10),
        resenas,
        stock,
        sku: `KM-${producto.category.slice(0, 3).toUpperCase()}-${String(semilla % 10000).padStart(4, '0')}`,
        nuevo: producto.nuevo ?? semilla % 4 === 0,
    };
}

// la base de datos trae "a, b, c..." en shortInfo; se reemplaza por una ficha tecnica de ejemplo
export function fichaTecnica(producto : Product) {
    const semilla = hash(producto.name);
    const tamanos = ['12 cm', '15 cm', '18 cm', '22 cm', '25 cm'];
    const colores = ['Verde bosque', 'Café arena', 'Gris piedra', 'Azul océano', 'Naranja lava'];
    return [
        { etiqueta: 'Tipo', valor: 'Juguete mordelón articulado' },
        { etiqueta: 'Material', valor: 'Vinilo flexible libre de BPA' },
        { etiqueta: 'Tamaño', valor: tamanos[semilla % tamanos.length] },
        { etiqueta: 'Color', valor: colores[(semilla >> 3) % colores.length] },
        { etiqueta: 'Edad', valor: '3 años a más' },
        { etiqueta: 'Marca', valor: producto.brand },
    ];
}

export function caracteristicas(producto : Product) {
    if (producto.caracteristicas?.length) return producto.caracteristicas;
    return [
        `Mandíbula que se abre y cierra: el ${producto.name} "muerde" sin lastimar.`,
        'Patas y cola articuladas para armar poses y escenas.',
        'Textura en relieve con acabado mate pintado a mano.',
        'Material resistente a caídas, fácil de limpiar con agua y jabón.',
    ];
}

export const descripcionProducto = (producto : Product) =>
    producto.descripcion || `${producto.subtitle}. Un compañero de aventuras resistente, pensado para jugar todos los días y para lucirse en la repisa.`;

export const rutaProducto = (producto : Product) =>
    `/${encodeURIComponent(producto.brand)}/${encodeURIComponent(producto.category)}/${encodeURIComponent(producto.name)}`;

// quita tildes y mayusculas para que "dinosaurio" encuentre "Dinosáurio"
export const normalizar = (texto : string) =>
    texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

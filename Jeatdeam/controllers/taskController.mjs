import Stripe from 'stripe';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Carga el archivo .env
const result = dotenv.config();

if (result.error) {
    console.error("⚠️ Error al cargar .env:", result.error);
} else {
    console.log("✅ Archivo .env cargado correctamente.");
}


const stripe = new Stripe(process.env.SECRET_KEY);

console.log("Stripe API Key:", process.env.SECRET_KEY);

async function verificarMoneda() {
    try {
        const precios = await stripe.prices.list({ limit: 10 });

        precios.data.forEach(precio => {
            console.log(`ID: ${precio.id}, Moneda: ${precio.currency}, Monto: ${precio.unit_amount / 100}`);
        });
    } catch (error) {
        console.error("Error al obtener precios desde Stripe:", error.message);
    }
}
verificarMoneda();


const productsToPay=()=>{

    let products=[]
    carrito.forEach((element,index)=>{
        let quantity=0;
        let price=element.id;
        carrito.forEach((el,index)=>{
            if(element.id===el.id){
                quantity++;
            }

        })
        if(products.price){
            console.log('ya existe el grupo con idPrice->',price)
        }else{
            products.push({price: price,quantity});
        }

    })
    console.log('aqui esta los productos comprimidos->',products);

    let   array=products.reduce((acc, el)=>{
        if(!acc.some(element=>element.price===el.price)){
            acc.push(el);
        }
        return acc;
    },[])

    console.log('aqui esta los productos filtrados->',array);

    return array;
}
function getProducts() {
    const urlProducts="https://api.stripe.com/v1/products?limit=100";
    const urlPrices = "https://api.stripe.com/v1/prices?limit=100";

    const options={
        headers:{
            Authorization:`Bearer ${process.env.SECRET_KEY}`
        }
    }
    const peticionId = async () => {
        const response=await fetch(urlPrices,options);

        if(!response.ok){
            throw new Error(`Hubo un error en la peticion -> ${response.statusText}`);
        }
        const result=await response.json();


        const productData=result.data;

        if(productData){
            // productData.forEach(el=>console.log(el.id))
        }
        baseDatos.forEach((product, indice) => {
            product.id = productData[indice].id;  // Actualiza el id de cada producto
        });

    }
    peticionId();
}
getProducts();

function getPrices(){
    const urlProducts="https://api.stripe.com/v1/products?limit=100";
    const urlPrices = "https://api.stripe.com/v1/prices?limit=100";


    const options={
        headers:{
            authorization:`Bearer ${process.env.SECRET_KEY}`
        }
    }
    const peticionPrice=async()=>{
        const response=await fetch(urlPrices,options);

        if(!response.ok){
            throw new Error(`Hubo un error en la peticion -> ${response.statusText}`);
        }
        const result=await response.json();
        const resultData=result.data

        baseDatos.forEach((product,indice)=>{

            product.price=result.data[indice].unit_amount;

        })
    }
    peticionPrice();

}
getPrices();


const redireccionamientoToPay= async (req,res)=> {

    try {
        // Crear la sesión de Checkout en Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: productsToPay(),
            mode: 'payment',
            success_url: `http://localhost:5000/catalogoProducts`,
            cancel_url: `http://localhost:5000/carrito/estado`,
        });

        // Enviar la URL de la sesión de Stripe
        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creando la sesión de Stripe:', error.message);
        console.error(error.stack);
        res.status(500).send('Error interno del servidor');
    }

};


// const productsToPay = () => [
//     {
//         price_data: {
//             currency: 'usd',
//             product_data: {
//                 name: 'Camiseta Negra',
//                 description: 'Talla M',
//             },
//             unit_amount: 2500, // 25.00 USD
//         },
//         quantity: 2, // Cantidad de productos
//     },
// ];

let seccionProducts={
    dinosaurios: {
        "bloqueadores": {

        },
        "contorno de ojos":{

        },
        jabon:{

        },
        mascarilla:{

        },
        parches:{

        },
        serum:{

        }
    },
    tendencias:  {
        "bloqueadores": {

        },
        "contorno de ojos":{

        },
        jabon:{

        },
        mascarilla:{

        },
        parches:{

        },
        serum:{

        }
    },
    animales:  {
        "bloqueadores": {

        },
        "contorno de ojos":{

        },
        jabon:{

        },
        mascarilla:{

        },
        parches:{

        },
        serum:{

        }
    },
    peluches:  {
        "bloqueadores": {

        },
        "contorno de ojos":{

        },
        jabon:{

        },
        mascarilla:{

        },
        parches:{

        },
        serum:{

        }
    },
    anime: {
        "bloqueadores": {

        },
        "contorno de ojos":{

        },
        jabon:{

        },
        mascarilla:{

        },
        parches:{

        },
        serum:{

        }
    },
    mascotas:  {
        "bloqueadores": {

        },
        "contorno de ojos":{

        },
        jabon:{

        },
        mascarilla:{

        },
        parches:{

        },
        serum:{

        }
    },
    dormitorio:  {
        "bloqueadores": {

        },
        "contorno de ojos":{

        },
        jabon:{

        },
        mascarilla:{

        },
        parches:{

        },
        serum:{

        }
    },
    tecnologia:  {
        "bloqueadores": {

        },
        "contorno de ojos":{

        },
        jabon:{

        },
        mascarilla:{

        },
        parches:{

        },
        serum:{

        }
    },
    regalos:  {
        "bloqueadores": {

        },
        "contorno de ojos":{

        },
        jabon:{

        },
        mascarilla:{

        },
        parches:{

        },
        serum:{

        }
    },
    coleccion:  {
        "bloqueadores": {

        },
        "contorno de ojos":{

        },
        jabon:{

        },
        mascarilla:{

        },
        parches:{

        },
        serum:{

        }
    },
    // eucerin:  {
    //     "bloqueadores": {
    //
    //     },
    //     "contorno de ojos":{
    //
    //     },
    //     jabon:{
    //
    //     },
    //     mascarilla:{
    //
    //     },
    //     parches:{
    //
    //     },
    //     serum:{
    //
    //     }
    // },
}

 let baseDatos = [
    {
        id: 1,
        title: "Jeatdeam",
        subtitle:"Juguete Mordelón Tipo Dinosaurio - Tyrannosaurus Rex Miniatura Texturizado y Articulado",
        price: 5,
        name: "T-rex",
        category:"dinosaurios",
        completed: true,
        brand:"Juguete mordelon",
        img:["https://res.cloudinary.com/dfwtyxxba/image/upload/v1743969575/t-rex-three_sndvmv.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743969578/t-rex-two_donttz.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743969574/t-rex-one_htqvvm.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743969574/t-rex-four_dprqwk.webp"],
        shortInfo: ["a","b","c","d","e"],
        longInfo: ["cuack 1","cuack 2","cuack 3","cuack 4"]

    },
    {
        id: 2,
        title: "Jeatdeam",
        subtitle:"Juguete Mordelon Tipo Dinosaurio - Ankylosaurus Miniatura Texturizado y Articulado ",
        price: 5,
        name: "Ankylosaurus",
        category:"dinosaurios",
        completed: true,
        brand:"Juguete mordelon",
        img:["https://res.cloudinary.com/dfwtyxxba/image/upload/v1743982937/anquilosaurio-one_gpass7.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743982937/anquilosaurio-two_apwoil.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743982937/anquilosaurio-three_ojwluy.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743982937/anquilosaurio-four_mmgzlg.webp"],
        shortInfo: ["a","b","c","d","e"],
        longInfo: ["cuack 1","cuack 2","cuack 3","cuack 4"]
    },
    {
        id: 3,
        title: "Jeatdeam",
        subtitle:"Juguete Mordelon Tipo Dinosaurio - Mosasaurus Miniatura Texturizado y Articulado",
        price: 5,
        name: "Mosasaurus",
        category:"dinosaurios",
        completed: true,
        brand:"Juguete mordelon",
        img:["https://res.cloudinary.com/dfwtyxxba/image/upload/v1743984890/mosasaurio-three_rska49.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743984890/mosasaurio-two_voqxvm.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743984890/mosasaurio-one_txgkam.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743984890/mosasaurio-four_tbtjim.webp"],
        shortInfo: ["a","b","c","d","e"],
        longInfo: ["cuack 1","cuack 2","cuack 3","cuack 4"]
    },
    {
        id: 4,
        title: "Jeatdeam",
        subtitle:"Juguete Mordelon Tipo Dinosaurio - Triceratops Miniatura Texturizado y Articulado",
        price: 5,
        name: "Triceratops",
        category:"dinosaurios",
        completed: true,
        brand:"Juguete mordelon",
        img:["https://res.cloudinary.com/dfwtyxxba/image/upload/v1743985913/triceratops-two_smwtem.png","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743985912/triceratops-three_kkspxl.png","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743985912/triceratops-four_bjlegf.png","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743985912/triceratops-one_vto4hb.png"],
        shortInfo: ["a","b","c","d","e"],
        longInfo: ["cuack 1","cuack 2","cuack 3","cuack 4"]
    },
    {
        id: 5,
        title: "Jeatdeam",
        subtitle:"Juguete Mordelon Tipo Dinosaurio - Indoraptor Miniatura Texturizado y Articulado",
        price: 5,
        name: "Indoraptor",
        category:"dinosaurios",
        completed: true,
        brand:"Juguete mordelon",
        img:["https://res.cloudinary.com/dfwtyxxba/image/upload/v1743986597/indoraptopr-two_jfsddk.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743986596/indoraptopr-one_aamn94.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743986596/indoraptopr-three_vu3gxc.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743986595/indoraptopr-four_ldq29w.webp"],
        shortInfo: ["a","b","c","d","e"],
        longInfo: ["cuack 1","cuack 2","cuack 3","cuack 4"]
    },
    {
        id: 6,
        title: "QuienesSomos",
        subtitle:"Juguete Mordelon Tipo Dinosaurio - Dilophosaurus Minuatura Texturizado y Articulado",
        price: 5,
        name: "Dilophosaurus",
        category:"dinosaurios",
        completed: false,
        brand: 'Juguete mordelon',
        img:["https://res.cloudinary.com/dfwtyxxba/image/upload/v1743989211/dilofosaurio-three_hwjrgo.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743989185/dilofosaurio-one_dkqvui.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743989212/dilofosaurio-two_uaeryz.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743989184/dilofosaurio-four_mo86j7.webp"],
        shortInfo: ["a","b","c","d","e"],
        longInfo: ["cuack 1","cuack 2","cuack 3","cuack 4"]

    },
    {
        id: 7,
        title: "MasVendidos",
        subtitle:"Juguete Mordelon Tipo Dinosaurio - Carnotaurus Miniatura Texturizado y Articulado",
        price: 5,
        name: "Carnotaurus",
        category:"dinosaurios",
        completed: false,
        brand: 'Juguete mordelon',
        img:["https://res.cloudinary.com/dfwtyxxba/image/upload/v1743991321/carnotauro-four_vvef0n.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743991321/carnotauro-one_njmu1o.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743991324/carnotauro-two_avsert.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743991323/carnotauro-three_tdrfel.webp"],
        shortInfo: ["a","b","c","d","e"],
        longInfo: ["cuack 1","cuack 2","cuack 3","cuack 4"]
    },
    {
        id: 8,
        title: "MasVendidos",
        subtitle:"Juguete Mordelon Tipo Dinosaurio - Espinosaurio Miniatura Texturizado y Articulado ",
        price: 5,
        name: "Espinosaurio",
        category:"dinosaurios",
        completed: false,
        brand: 'Juguete mordelon',

        img:["https://res.cloudinary.com/dfwtyxxba/image/upload/v1743996477/espinosaurio-three_vrvqv1.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743996475/espinosaurio-one_f8o5pg.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743996478/espinosaurio-two_dq7hz5.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743996474/espinosaurio-four_imotlm.webp"],
        shortInfo: ["a","b","c","d","e"],
        longInfo: ["cuack 1","cuack 2","cuack 3","cuack 4"]
    },
    {
        id: 9,
        title: "MasVendidos",
        subtitle:"Juguete Mordelon Tipo Dinosaurio - Dimorphodon Miniatura Texturizado y Articulado ",
        price: 5,
        name: "Dimorphodon",
        category:"dinosaurios",
        completed: false,
        brand: 'Juguete mordelon',
        img:["https://res.cloudinary.com/dfwtyxxba/image/upload/v1743997348/dimorphodon-four_f8nyzw.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743997357/dimorphodon-three_ofbgu9.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743997356/dimorphodon-one_pg7fkq.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743997359/dimorphodon-two_ys9scb.webp"],
        shortInfo: ["a","b","c","d","e"],
        longInfo: ["cuack 1","cuack 2","cuack 3","cuack 4"]
    },
    {
        id: 10,
        title: "MasVendidos",
        subtitle:"Juguete Mordelon Tipo Dinosaurio - Estegosaurios Miniatura Texturizado y Articulado ",
        price: 5,
        name: "Estegosaurios",
        category:"dinosaurios",
        completed: false,
        brand: 'Juguete mordelon',
        img:["https://res.cloudinary.com/dfwtyxxba/image/upload/v1743998504/estegosauro-one_dkzhqy.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743998507/estegosauro-two_isejx7.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743998506/estegosauro-three_n7ftvf.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1743998503/estegosauro-four_ssbd9l.webp"],
        shortInfo: ["a","b","c","d","e"],
        longInfo: ["cuack 1","cuack 2","cuack 3","cuack 4"]
    },
    {
        id: 11,
        title: "MasVendidos",
        subtitle:"Juguete Mordelon Tipo Dinosaurio - Velociraptor Miniatura Texturizado y Articulado",
        price: 7,
        name: "Velociraptor",
        category:"dinosaurios",
        completed: false,
        brand: 'Juguete mordelon',
        img:["https://res.cloudinary.com/dfwtyxxba/image/upload/v1744125980/velociraptor-four_mti8em.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1744125980/velociraptor-three_anvoyx.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1744125980/velociraptor-two_ocbszi.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1744125979/velociraptor-one_massey.webp"],
        shortInfo: ["a","b","c","d","e"],
        longInfo: ["cuack 1","cuack 2","cuack 3","cuack 4"]
    },
    {
        id: 12,
        title: "MasVendidos",
        subtitle:"Juguete Mordelon Tipo Dinosaurio - Pterodactilo Miniatura Texturizado y Articulado",
        price: 10,
        name: "Pterodactilo",
        category:"dinosaurios",
        completed: false,
        brand: 'Juguete mordelon',
        img:["https://res.cloudinary.com/dfwtyxxba/image/upload/v1744126559/trerodactilo-three_jnxxxj.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1744126559/trerodactilo-two_bizlbk.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1744126558/trerodactilo-four_p2vdoz.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1744126559/trerodactilo-one_qqqhxc.webp"],
        shortInfo: ["a","b","c","d","e"],
        longInfo: ["cuack 1","cuack 2","cuack 3","cuack 4"]
    },
    {
        id: 13,
        title: "MasVendidos",
        subtitle:"Juguete Mordelon Tipo Dinosaurio - Parasaurolophus Miniatura Texturizado y Articulado",
        price: 5,
        name: "Parasaurolophus",
        category:"dinosaurios",
        completed: false,
        brand: 'Juguete mordelon',
        img:["https://res.cloudinary.com/dfwtyxxba/image/upload/v1744127150/parasaurolophus-four_elj5ps.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1744127151/parasaurolophus-two_d5msxf.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1744127150/parasaurolophus-three_h0mydf.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1744127150/parasaurolophus-one_cexhfz.webp"],
        shortInfo: ["a","b","c","d","e"],
        longInfo: ["cuack 1","cuack 2","cuack 3","cuack 4"]
    },
    {
        id: 14,
        title: "MasVendidos",
        subtitle:"Juguete Mordelon Tipo Dinosaurio - Agresivosaurio Miniatura Texturizado y Articulado",
        price: 7,
        name: "Agresivosaurio",
        category:"dinosaurios",
        completed: false,
        brand: 'Juguete mordelon',
        img:["https://res.cloudinary.com/dfwtyxxba/image/upload/v1744128098/agresivo-four_xmobis.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1744128098/agresivo-one_tselei.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1744128099/agresivo-two_zh22jb.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1744128098/agresivo-three_jbct5e.webp"],
        shortInfo: ["a","b","c","d","e"],
        longInfo: ["cuack 1","cuack 2","cuack 3","cuack 4"]
    },
    {
         id: 15,
         title: "MasVendidos",
         subtitle:"Juguetes Mordelones Tipo Dinosaurios - Pack Miniatura Texturizado y Articulado",
         price: 50,
         name: "Pack de dinosaurios",
         category:"dinosaurios",
         completed: false,
         brand: 'Juguete mordelon',
         img:["https://res.cloudinary.com/dfwtyxxba/image/upload/v1744134468/pack-two_wit2wn.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1744134469/pack-three_mpnzhq.webp","https://res.cloudinary.com/dfwtyxxba/image/upload/v1744134679/pack-four_thyt9e.png","https://res.cloudinary.com/dfwtyxxba/image/upload/v1744134468/pack-one_kjsa2u.webp"],
        shortInfo: ["a","b","c","d","e"],
        longInfo: ["cuack 1","cuack 2","cuack 3","cuack 4"]
    },

]


 let carrito=[

 ]

let datosCliente=[


]
const transporter=nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})

transporter.verify((error,success)=>{
    if(error){
        console.error('Error en el transporte de correo',error);
    }else{
        console.log('servidor de correo listo para enviar mensajes');
    }

})

const extraerMarcas=(req,res)=>{


    res.json({
        seccionProducts,
    })
}


const baseDatosProducts=(req,res)=>{

    res.json({baseDatos})
}

const index=(req,res)=>{

    // res.redirect("/")
    console.log(carrito);
    res.render('index',{baseDatos})
}

const product=(req,res)=>{

    res.render('product',{title: 'aqui esta un producto elegido'})

}
const catalogoProducts=(req,res)=>{
    res.render('catalogoProductos',{title:'Catalogo de productos', baseDatos})

}

const marcaProducts=(req, res)=>{

    const brand=req.params.name;
    const productosPorMarca=baseDatos.filter((product)=>product.category===brand)

    res.render('marca',{title: `${brand}`, productosPorMarca,carrito})

}

const detailProduct=(req,res)=>{

    const brand=req.params.brand;
    const categoria=req.params.categoria;
    const name=req.params.product;

    console.log(brand,name,categoria);

    const producto=baseDatos.find((item)=>item.brand===brand&&item.name===name)
    const recomendados = baseDatos.filter((item)=>item.brand===brand)

    if(!producto){
        return res.status(404).render('error',{title: 'producto no encontrado',carrito})
    }

    res.render('product_detail',{name:`${name}`,producto,baseDatos,carrito,recomendados})
}

const categoriaProduct=(req,res)=>{

    const {brand, categoria} = req.params;

    console.log('brand: ',brand);
    console.log('categoria: ',categoria)

    const productos=baseDatos.filter(producto=>producto.brand===brand&&producto.category===categoria)

    console.log('productos filtrados: ',productos);

        if(productos){
            res.render('categoria',{productos, categoria})
        }

}

const finalizarCompra=(req,res)=>{

    res.render('compra',{carrito})
}
const agregarCarrito = (req, res) => {
    const { id, idCompra, brand, img, price, name } = req.body;

    if (!id || !idCompra || !brand || !img || !price || !name) {
        return res.status(400).json({ error: "Faltan datos en la petición" });
    }

    carrito.push({ id, idCompra, brand, img, price, name });

    const lastIdCompra = carrito[carrito.length - 1].idCompra;

    res.json({
        message: 'Producto agregado al carrito',
        carrito: carrito.length,
        allProduct: carrito,
        lastIdCompra,
        baseDatos,
    });
};


const estadoCarrito=(req,res)=>{

    let lastIdCompra;

    if(carrito.length>0){
        lastIdCompra=carrito[carrito.length-1].idCompra;
    }else{
        lastIdCompra=0;
    }



    res.json({
        carrito,
        carritoL:carrito.length,
        baseDatos,
        lastIdCompra,
    });

}

const deleteCarrito=(req,res)=>{

    const {id,idCompra}=req.body;

    if(id){
        console.log(`aqui esta el id del product->${id}`);
        carrito=carrito.filter((el)=>el.id !== id);
        res.json({
            message: `los elementos con el id->${id} fueron eliminados`,
            carritoLength: carrito.length,
            carrito,
        })}else if(idCompra){
        carrito=carrito.filter((el)=>el.idCompra!==idCompra)
        res.json(
            {
             message: 'el elemento ha sido eliminado del carrito',
             carritoLength:carrito.length,
             carrito,
            })
        }
        else {
                carrito = [];
                res.json({
                    message: 'el carrito ha sido desmantelado',
                    carritoLength: carrito.length,
                    carrito,
                });
            }


}


const recibirDatosShort = async (req, res) => {
    const { correo, nombre, tel, telSec } = req.body;

    datosCliente.push({ correo, nombre, tel, telSec });

    const mailOptions = {
        from: "firtsadic3@gmail.com",
        to: correo,
        subject: "Confirmación de recepción de datos",
        text: `Hola ${nombre}, hemos recibido tu información. Teléfono: ${tel}, Teléfono Secundario: ${telSec}.`,
    };

        // await transporter.sendMail(mailOptions);
        transporter.sendMail(mailOptions)
            .then(result=>{
                console.log('correo enviado: ',result)
            })
            .catch(error=>{
                console.error('error al enviar el correo: ',error);
            });

        return res.json({
            estado: `✅ Datos recibidos y correo enviado -> ${correo}`,
            datosCliente,
        });
    // } catch (error) {
    //     console.error("❌ Error al enviar el correo:", error);
    //     return res.status(500).json({ error: "Error al enviar el correo" });
    // }
};


const recibirDatosComplete=(req,res)=>{
        const {correo,nombre,numOne,numTwo,direccion,departamento,distrito,infoExtra,infoCourier,eleccionEmpresa}=req.body;

        datosCliente.push({correo,nombre,numOne,numTwo,direccion,departamento,distrito,infoExtra,infoCourier,eleccionEmpresa});

        res.json({
            estado: `los datos completos fueron recibidos ->${correo}-${nombre}-${numOne}-${numTwo}-${direccion}-${departamento}-${infoExtra}-${infoCourier}-${eleccionEmpresa}`,
            datosCliente,

        })


}
const deleteDatos=(req,res)=>{

     datosCliente=[];

     res.json({
         existencia: `ya no existen datos del formulario->${datosCliente.length}`,
     })
}

const verificarDatos=(req,res)=>{


     res.json({
         existencia: `si existen datos del cliente->${datosCliente.length}-${datosCliente}`,
         datosCliente,
     })
}

const controllerQr = async (req, res) => {
    const { monto, numero } = req.body;
    if (!monto || !numero) {
        return res.status(400).json({ error: "Faltan datos para generar el QR" });
    }

    let montoTotal=5204;
    try {
        const qrData = `0002010102113932afff84da0aab5715a5d3a3d69e9a136e${montoTotal}561153036045802PE5906YAPERO6004Lima630405BC`;
        const qrImage = await QRCode.toDataURL(qrData);
        console.log(qrImage);  // Verifica la imagen de datos
        res.json({ qr: qrImage });
    } catch (error) {
        res.status(500).json({ error: "Error generando el QR" });
    }
};



const getAllTask = (req, res) => {
}
const getAddTaskForm = (req, res) => {
}
const addTasks = (req, res) => {
}
const getEditTaskForm = (req, res) => {
}
const editTask = (req, res) => {
}
const completeTask = (req, res) => {
}
const uncompleteTask = (req, res) => {
}
const deleteTask = (req, res) => {
}


const contacto = (req, res) => {
    res.render('contacto');
}
const envios = (req, res)=>{
    res.render('envios');
}
const productos = (req, res) => {
    res.render('productos');
}
const promociones = (req, res) => {
    res.render('promociones');
}
const quienesSomos = (req, res) => {
    res.render('quienesSomos', {baseDatos});
}


export default {
    contacto,
    envios,
    productos,
    promociones,
    quienesSomos,
    categoriaProduct,
    extraerMarcas,
    deleteDatos,
    verificarDatos,
    recibirDatosShort,
    recibirDatosComplete,
    controllerQr,
    redireccionamientoToPay,
    catalogoProducts,
    baseDatosProducts,
    deleteCarrito,
    estadoCarrito,
    agregarCarrito,
    finalizarCompra,
    detailProduct,
    index,
    marcaProducts,
    product,
    getAllTask,
    getAddTaskForm,
    addTasks,
    getEditTaskForm,
    editTask,
    completeTask,
    uncompleteTask,
    deleteTask,

}

// console.log(carrito);




// console.log("Aqui esta la base de datos actualizado->",baseDatos)
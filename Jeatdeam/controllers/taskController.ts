import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import type { Request, Response } from 'express';

import type {
    CartItem,
    DatosCliente,
    DatosClienteComplete,
    DatosClienteShort,
    EliminarCarritoBody,
    Product,
    Secciones,
} from '../shared/types.ts';
import { cargarAlmacen, esPrimeraCarga, guardarAlmacen } from './almacen.ts';

// el carrito agrupado por producto con el precio del backend (nunca el del navegador); lo usan los pedidos (pedidosController.ts)
export function lineasCarrito() {
    const cantidades = new Map<string, number>();
    carrito.forEach((item) => cantidades.set(item.id, (cantidades.get(item.id) ?? 0) + 1));

    return Array.from(cantidades, ([id, cantidad]) => {
        const producto = baseDatos.find((el) => String(el.id) === id);
        const item = carrito.find((el) => el.id === id)!;
        return {
            nombre: producto?.name ?? item.name,
            marca: producto?.brand ?? item.brand,
            cantidad,
            // precio final en centimos: el normal menos el descuento puesto en el dashboard
            unitario: producto ? Math.round((producto.price * (100 - (producto.descuento ?? 0))) / 100) : item.price,
        };
    });
}

// los ultimos datos que se llenaron en el formulario de envio
export const ultimoCliente = (): DatosCliente | undefined => datosCliente[datosCliente.length - 1];


let seccionProducts:Secciones={
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

const semillaProductos:Product[] = [
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

const baseDatos: Product[] = cargarAlmacen(semillaProductos);
// la primera vez (sin datos/tienda.json) se guardan los productos escritos en el codigo
if (esPrimeraCarga()) guardarAlmacen();


 let carrito:CartItem[]=[

 ]

let datosCliente:DatosCliente[]=[


]
// tambien lo usa pedidosController.ts para mandar el pedido al correo del cliente
export const transporter=nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        // la contraseña de aplicacion de google se copia como "abcd efgh ijkl mnop": se quitan los espacios
        pass: process.env.EMAIL_PASS?.replace(/\s/g, ''),
    }
})

// con el correo de ejemplo de .env.ejemplo gmail rechaza el login y, tras varios intentos, bloquea la cuenta un rato
export const correoSinConfigurar = !process.env.EMAIL_USER || process.env.EMAIL_USER === 'correo@gmail.com';

if(correoSinConfigurar){
    console.warn('Correo sin configurar: pon tu gmail en EMAIL_USER y la contraseña de aplicacion en EMAIL_PASS (Jeatdeam/.env)');
}else{
    transporter.verify((error,success)=>{
        if(error){
            console.error('Error en el transporte de correo',error);
        }else{
            console.log('servidor de correo listo para enviar mensajes');
        }

    })
}

const extraerMarcas=(req:Request,res:Response)=>{


    res.json({
        seccionProducts,
    })
}


const baseDatosProducts=(req:Request,res:Response)=>{

    res.json({baseDatos})
}

const agregarCarrito = (req:Request<unknown, unknown, Partial<CartItem>>, res:Response) => {
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


const estadoCarrito=(req:Request,res:Response)=>{

    let lastIdCompra:number;

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

const deleteCarrito=(req:Request<unknown, unknown, EliminarCarritoBody>,res:Response)=>{

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


const recibirDatosShort = async (req:Request<unknown, unknown, DatosClienteShort>, res:Response) => {
    const { correo, nombre, tel, telSec } = req.body;

    datosCliente.push({ correo, nombre, tel, telSec });

    // el correo al cliente sale al elegir el medio de pago, con el detalle de compra y el pdf (pedidosController.ts)
    return res.json({
        estado: `✅ Datos recibidos -> ${correo}`,
        datosCliente,
    });
};


const recibirDatosComplete=(req:Request<unknown, unknown, DatosClienteComplete>,res:Response)=>{
        const {correo,nombre,numOne,numTwo,direccion,departamento,distrito,infoExtra,infoCourier,eleccionEmpresa}=req.body;

        datosCliente.push({correo,nombre,numOne,numTwo,direccion,departamento,distrito,infoExtra,infoCourier,eleccionEmpresa});

        res.json({
            estado: `los datos completos fueron recibidos ->${correo}-${nombre}-${numOne}-${numTwo}-${direccion}-${departamento}-${infoExtra}-${infoCourier}-${eleccionEmpresa}`,
            datosCliente,

        })


}
const deleteDatos=(req:Request,res:Response)=>{

     datosCliente=[];

     res.json({
         existencia: `ya no existen datos del formulario->${datosCliente.length}`,
     })
}

const verificarDatos=(req:Request,res:Response)=>{


     res.json({
         existencia: `si existen datos del cliente->${datosCliente.length}-${datosCliente}`,
         datosCliente,
     })
}

const controllerQr = async (req:Request<unknown, unknown, { monto?: number; numero?: string }>, res:Response) => {
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


export default {
    extraerMarcas,
    deleteDatos,
    verificarDatos,
    recibirDatosShort,
    recibirDatosComplete,
    controllerQr,
    baseDatosProducts,
    deleteCarrito,
    estadoCarrito,
    agregarCarrito,

}

// console.log(carrito);




// console.log("Aqui esta la base de datos actualizado->",baseDatos)
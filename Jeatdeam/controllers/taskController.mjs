import Stripe from 'stripe';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


console.log('EMAIL_USER:->', process.env.EMAIL_USER);
console.log('EMAIL_PASS:=', process.env.EMAIL_PASS ? 'cargado':'no cargado');

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

let seccionProducts={
    boj: {
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
    celimax:  {
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
    cosrx:  {
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
    haruharu:  {
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
    nacific: {
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
    numbuzin:  {
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
    skinni1004:  {
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
    tocobo:  {
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
    centella:  {
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
    avene:  {
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
    eucerin:  {
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
}

 let baseDatos = [
    {
        id: 1,
        title: "Jeatdeam",
        subtitle:"lorem ipsum dolor sit amet, consetetur->lorem ipsum dolor sit amet, consetetur",
        price: 155,
        name: "bloqueador en barra",
        category:"bloqueadores",
        completed: true,
        brand:"tocobo",
        img:["/img/tocobo/bloqueador-barra/tocoboBarraOne.png","/img/tocobo/bloqueador-barra/tocoboBarraTwo.png","/img/tocobo/bloqueador-barra/tocoboBarraThree.png","/img/tocobo/bloqueador-barra/tocoboBarraFour.png"]
    },
    {

        id: 2,
        title: "Jeatdeam",
        subtitle:"lorem ipsum dolor sit amet, consetetur->lorem ipsum dolor sit amet, consetetur",
        price: 255,
        name: "bloqueador en crema",
        category:"bloqueadores",
        completed: true,
        brand:"tocobo",
        img:["/img/tocobo/bloqueador-crema/tocoboCremaOne.png","/img/tocobo/bloqueador-crema/tocoboCremaTwo.png","/img/tocobo/bloqueador-crema/tocoboCremaThree.png","/img/tocobo/bloqueador-crema/tocoboCremaFour.png"]
    },
    {
        id: 3,
        title: "Jeatdeam",
        subtitle:"lorem ipsum dolor sit amet, consetetur->lorem ipsum dolor sit amet, consetetur",
        price: 305,
        name: "contorno de ojos",
        category:"contorno de ojos",
        completed: true,
        brand:"tocobo",
        img:["/img/tocobo/contorno-de-ojos/tocoboContornoOjosOne.png","/img/tocobo/contorno-de-ojos/tocoboContornoOjosTwo.png","/img/tocobo/contorno-de-ojos/tocoboContornoOjosThree.png","/img/tocobo/contorno-de-ojos/tocoboContornoOjosFour.png"]
    },
    {
        id: 4,
        title: "Jeatdeam",
        subtitle:"lorem ipsum dolor sit amet, consetetur->lorem ipsum dolor sit amet, consetetur",
        price: 425,
        name: "bifida biome essence",
        category:"serum",
        completed: true,
        brand:"tocobo",
        img:["/img/tocobo/serum/tocoboSerumOne.png","/img/tocobo/serum/tocoboSerumTwo.png","/img/tocobo/serum/tocoboSerumThree.png","/img/tocobo/serum/tocoboSerumFour.png"]

    },
    {
        id: 5,
        title: "Jeatdeam",
        subtitle:"lorem ipsum dolor sit amet, consetetur->lorem ipsum dolor sit amet, consetetur",
        price: 585,
        name: "bloqueador en barra",
        category:"bloqueadores",
        completed: true,
        brand:"boj",
        img:["/img/beautyofjoseon/bloqueador-barra/bojBarraOne.png","/img/beautyofjoseon/bloqueador-barra/bojBarraTwo.png","/img/beautyofjoseon/bloqueador-barra/bojBarraThree.png","/img/beautyofjoseon/bloqueador-barra/bojBarraFour.png"]
    },
    {
        id: 6,
        title: "QuienesSomos",
        subtitle:"lorem ipsum dolor sit amet, consetetur->lorem ipsum dolor sit amet, consetetur",
        price: 685,
        name: "bloqueador en crema",
        category:"bloqueadores",
        completed: false,
        brand: 'boj',
        img:["/img/beautyofjoseon/bloqueador-crema/bojCremaOne.png","/img/beautyofjoseon/bloqueador-crema/bojCremaTwo.png","/img/beautyofjoseon/bloqueador-crema/bojCremaThree.png","/img/beautyofjoseon/bloqueador-bcrema/bojCremaFour.png"]

    },
    {
        id: 7,
        title: "MasVendidos",
        subtitle:"lorem ipsum dolor sit amet, consetetur->lorem ipsum dolor sit amet, consetetur",
        price: 785,
        name: "contorno de ojos",
        category:"contorno de ojos",
        completed: false,
        brand: 'boj',
        img:["/img/beautyofjoseon/contorno-de-ojos/bojContornoOjosOne.png","/img/beautyofjoseon/contorno-de-ojos/bojContornoOjosTwo.png","/img/beautyofjoseon/contorno-de-ojos/bojContornoOjosThree.png","/img/beautyofjoseon/contorno-de-ojos/bojContornoOjosFour.png"]
    },
    {
        id: 8,
        title: "MasVendidos",
        subtitle:"lorem ipsum dolor sit amet, consetetur->lorem ipsum dolor sit amet, consetetur",
        price: 885,
        name: "jabon",
        category:"jabon",
        completed: false,
        brand: 'boj',
        img:["/img/beautyofjoseon/jabon/bojJabonOne.png","/img/beautyofjoseon/jabon/bojJabonTwo.png","/img/beautyofjoseon/jabon/bojJabonThree.png","/img/beautyofjoseon/jabon/bojJabonFour.png"]
    },
    {
        id: 9,
        title: "MasVendidos",
        subtitle:"lorem ipsum dolor sit amet, consetetur->lorem ipsum dolor sit amet, consetetur",
        price: 985,
        name: "bloqueador en barra",
        category:"mascarilla",
        completed: false,
        brand: 'boj',
        img:["/img/beautyofjoseon/mascarilla/bojMascarillaOne.png","/img/beautyofjoseon/mascarilla/bojMascarillaTwo.png","/img/beautyofjoseon/mascarilla/bojMascarillaThree.png","/img/beautyofjoseon/mascarilla/bojMascarillaFour.png"]
    },
    {
        id: 10,
        title: "MasVendidos",
        subtitle:"lorem ipsum dolor sit amet, consetetur->lorem ipsum dolor sit amet, consetetur",
        price: 1085,
        name: "serum",
        category:"serum",
        completed: false,
        brand: 'boj',
        img:["/img/beautyofjoseon/serum/bojSerumOne.png","/img/beautyofjoseon/serum/bojSerumTwo.png","/img/beautyofjoseon/serum/bojSerumThree.png","/img/beautyofjoseon/serum/bojSerumFour.png"]
    },
    {
        id: 11,
        title: "MasVendidos",
        subtitle:"lorem ipsum dolor sit amet, consetetur->lorem ipsum dolor sit amet, consetetur",
        price: 1185,
        name: "bloqueador en crema",
        category:"bloqueadores",
        completed: false,
        brand: 'celimax',
        img:["/img/celimax/bloqueador-crema/celimaxCremaOne.png","/img/celimax/bloqueador-crema/celimaxCremaTwo.png","/img/celimax/bloqueador-crema/celimaxCremaThree.png","/img/celimax/bloqueador-crema/celimaxCremaFour.png"]
    },
    {
        id: 12,
        title: "MasVendidos",
        subtitle:"lorem ipsum dolor sit amet, consetetur->lorem ipsum dolor sit amet, consetetur",
        price: 1285,
        name: "contorno de ojos",
        category:"contorno de ojos",
        completed: false,
        brand: 'celimax',
        img:["/img/celimax/contorno-de-ojos/celimaxContornoOjosOne.png","/img/celimax/contorno-de-ojos/celimaxContornoOjosTwo.png","/img/celimax/contorno-de-ojos/celimaxContornoOjosThree.png","/img/celimax/contorno-de-ojos/celimaxContornoOjosFour.png"]
    },
    {
        id: 13,
        title: "MasVendidos",
        subtitle:"lorem ipsum dolor sit amet, consetetur->lorem ipsum dolor sit amet, consetetur",
        price: 1385,
        name: "espuma facial",
        category:"jabon",
        completed: false,
        brand: 'celimax',
        img:["/img/celimax/jabon/celimaxJabonOne.png","/img/celimax/jabon/celimaxJabonTwo.png","/img/celimax/jabon/celimaxJabonThree.png","/img/celimax/jabon/celimaxJabonFour.png"]
    },
    {
        id: 14,
        title: "MasVendidos",
        subtitle:"lorem ipsum dolor sit amet, consetetur->lorem ipsum dolor sit amet, consetetur",
        price: 1485,
        name: "serum antimanchas",
        category:"serum",
        completed: false,
        brand: 'celimax',
        img:["/img/celimax/mascarilla/celimaxMascarillaOne.png","/img/celimax/mascarilla/celimaxMascarillaTwo.png","/img/celimax/mascarilla/celimaxMascarillaThree.png","/img/celimax/mascarilla/celimaxMascarillaFour.png"]
    },
    // {
    //      id: 15,
    //      title: "MasVendidos",
    //      subtitle:"lorem ipsum dolor sit amet, consetetur->lorem ipsum dolor sit amet, consetetur",
    //      price: 1485,
    //      name: "noni ampoule",
    //      category:"serum",
    //      completed: false,
    //      brand: 'celimax',
    //      img:["/img/celimax/serum/celimaxSerumOne.png","/img/celimax/serum/celimaxSerumTwo.png","/img/celimax/serum/celimaxSerumThree.png","/img/celimax/serum/celimaxSerumFour.png"]
    // },

]


 let carrito=[

 ]

let datosCliente=[


]

 function getProducts() {

    const secretKey="sk_test_51QanTtLhyJyLDtVvyz4Iwnm3SoX9uVsoKlvQs40nJ3xsTzvSLGQ4BBekJ5skqMOKRm7w6KZNpJCT6Vgf38JAo2ub00xvmMzFjJ";
    const publicKey="sk_test_51QanTtLhyJyLDtVvyz4Iwnm3SoX9uVsoKlvQs40nJ3xsTzvSLGQ4BBekJ5skqMOKRm7w6KZNpJCT6Vgf38JAo2ub00xvmMzFjJ";
    const urlProducts="https://api.stripe.com/v1/products?limit=100";
     const urlPrices = "https://api.stripe.com/v1/prices?limit=100";

     const options={
             headers:{
                 Authorization:`Bearer ${secretKey}`
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
    const secretKey="sk_test_51QanTtLhyJyLDtVvyz4Iwnm3SoX9uVsoKlvQs40nJ3xsTzvSLGQ4BBekJ5skqMOKRm7w6KZNpJCT6Vgf38JAo2ub00xvmMzFjJ";
    const publicKey="sk_test_51QanTtLhyJyLDtVvyz4Iwnm3SoX9uVsoKlvQs40nJ3xsTzvSLGQ4BBekJ5skqMOKRm7w6KZNpJCT6Vgf38JAo2ub00xvmMzFjJ";
    const urlProducts="https://api.stripe.com/v1/products?limit=100";
    const urlPrices = "https://api.stripe.com/v1/prices?limit=100";


    const options={
        headers:{
            authorization:`Bearer ${secretKey}`
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
    const productosPorMarca=baseDatos.filter((product)=>product.brand===brand)

    res.render('marca',{title: `${brand}`, productosPorMarca,carrito})

}

const detailProduct=(req,res)=>{

    const brand=req.params.brand;
    const categoria=req.params.categoria;
    const name=req.params.product;

    console.log(brand,name,categoria);

    const producto=baseDatos.find((item)=>item.brand===brand&&item.name===name)


    if(!producto){
        return res.status(404).render('error',{title: 'producto no encontrado',carrito})
    }

    res.render('product_detail',{name:`${name}`,producto,baseDatos,carrito})
}

const categoriaProduct=(req,res)=>{

    const {brand, categoria} = req.params;

    if(brand && categoria) {
        res.render('categoria',{title: 'cuacksito'})
    }else{

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
const deleteElementCarrito=(req,res)=>{}


const public2="pk_test_51QanTtLhyJyLDtVv34AWEc4azCeKb5Ldg4KRfU1k2kewEYVziB7YSCgnROMYfis9xpsPXhxg1yf7QSJhjGwnNAh800CDZmMelK";
const secret2="sk_test_51QanTtLhyJyLDtVvyz4Iwnm3SoX9uVsoKlvQs40nJ3xsTzvSLGQ4BBekJ5skqMOKRm7w6KZNpJCT6Vgf38JAo2ub00xvmMzFjJ";

 const stripe=Stripe(secret2)


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

export default {
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
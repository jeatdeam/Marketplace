// import {loadStripe} from "@stripe/stripe-js";
// import { loadStripe } from "https://js.stripe.com/v3/";
// import stripe from './stripe.mjs';
// import Stripe from "stripe";
import {apiladoInfoProductSmall} from './moveElements.mjs'
import {masVendidosScroll} from "./eventosEscritorio.mjs";
import keysFromStripe from './keysFromStripe.mjs';
import {masVendidosElement} from './masVendidos.mjs';
import {redirectMarca} from './redireccionamientos.mjs'
import {redirectMasVendidoElement} from './masVendidos.mjs'
import {asignarNombresHeader} from "./listaProducts.mjs";
import {menuSmallWindowEvents} from "./menuSmall.mjs";
import {ocultarMenuSmall, moveBottomInfo, moveSpan} from "./moveElements.mjs";
import {marcaEvent} from "./cascadaText.mjs"
import {eventsPhone} from "./eventosPhone.js"
import {postProduct} from "./peticionPost.js"
import {productInfo} from "./productDescription.mjs";
import {movMasVendidos} from "./masVendidos.mjs";
import {envio, yapePlin} from "./formularioEnvio.mjs"


envio();
yapePlin();

// Prevenir la selección y el arrastre de imágenes
document.addEventListener('mousedown', e => {
    e.preventDefault();  // Prevenir la selección en mousedown
});

// Prevenir el arrastre de cualquier imagen
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', e => {
        e.preventDefault();  // Prevenir el arrastre de la imagen
    });
});



setTimeout(movMasVendidos,4000)

productInfo()
masVendidosScroll();
eventsPhone();
marcaEvent();
moveSpan();

window.addEventListener('resize',apiladoInfoProductSmall)
window.addEventListener('resize', ocultarMenuSmall);
window.addEventListener('resize', moveBottomInfo);
window.onload=()=>{
    apiladoInfoProductSmall();
}

if(window.location.pathname==="/"){
    startApp()
}

function startApp() {
    const $body = document.querySelector('body');
    const section=document.createElement('section');
    const div = document.createElement('div');
    const h1=document.createElement('h1')
    const small=document.createElement('small');

    $body.insertAdjacentElement('beforebegin', section);
    $body.style.display="none";
    section.appendChild(div)
    section.classList.add('centerItem','colorSection');
    h1.classList.add('prePage')
    div.appendChild(h1)
    div.appendChild(small);
    small.classList.add('animate-sub')


    Object.assign(section.style,{
        height: '100vh',
        width: '100%',
        position:'absolute',
    })
    Object.assign(div.style,{
        width: '550px',
        position: 'relative',
        fontWeight: '100',
    })
    Object.assign(small.style,{
        position: 'absolute',
        right: '15px',
        top: '100%',
        fontFamily: 'Roboto Flex',
        fontWeight: '100',
    })
    Object.assign(h1.style,{
        textAlign: 'center',
        fontWeight: '300',
    })

    small.textContent="by Jeatdeam"

    const txt = "K-moon";
    let render = "";

    txt.split('').forEach((word, index) => {
        setTimeout(() => {
            render += word;
            // console.log(render);
            h1.textContent = render+'|';
            if (render.length === txt.length) {
                h1.classList.add('animate-item');
                section.classList.add('animate-color')
                // console.log('llegamos a pasa-la condicion');
                $body.classList.add('animate-showBody')
            }
        }, index * 150);
    });


    h1.addEventListener("animationend", () => {
        $body.style.opacity="1";
        $body.style.display="block";
        section.remove();
    });

}


function checkAndApplyStyles(){
    apiladoInfoProductSmall();
}

window.addEventListener('load', checkAndApplyStyles);

redirectMarca();


document.addEventListener('DOMContentLoaded',()=>{
    moveBottomInfo();
    menuSmallWindowEvents();
    apiladoInfoProductSmall();
    moveSpan();
})

masVendidosElement();
asignarNombresHeader();
redirectMasVendidoElement();

window.addEventListener('unload', () => {});

window.addEventListener('beforeunload', async()=>{

    deleteDatos();
})

document.addEventListener('click',e=>{
    if(e.target.closest('.infoDev')){
     window.location.href="https://www.bumeran.com.pe/postulantes/curriculum"
    }
})

async function deleteDatos(){
    const response= await fetch("/datos/cliente/compra", {method:'DELETE'});

    const result= await response.json();

    console.log(result.existencia);
}



function textoDashed() {
    let active = true;
    let txtOne = "Lo mejor en skincare coreano.";
    let txtTwo = "Tienda especializada en K-beauty.";
    let showTxt = active ? txtOne : txtTwo;

    const $navegador = document.querySelector(".navegador");
    const containerTxt = document.createElement("div");

    containerTxt.style.position = "absolute";
    containerTxt.style.top = "75.5%";
    containerTxt.style.left="20%";
    containerTxt.style.fontSize="clamp(11.5px, 5vw, 13.5px)";
    containerTxt.style.fontWeight="100";

    let txt = "";

    $navegador.appendChild(containerTxt);

    function escribirTexto() {
        txt = ""; // Reiniciar el texto
        showTxt.split("").forEach((letra, indice) => {
            setTimeout(() => {
                txt += letra;
                containerTxt.textContent = txt + "|";
            }, indice * 50);
        });

        setTimeout(borrarTexto, showTxt.length * 100 + 500); // Espera antes de borrar
    }

    function borrarTexto() {
        let intervalo = setInterval(() => {
            if (txt.length > 0) {
                txt = txt.slice(0, -1); // Elimina el último carácter
                containerTxt.textContent = txt + "|";
            } else {
                clearInterval(intervalo);
                containerTxt.textContent="";
                active = !active;
                showTxt = active ? txtOne : txtTwo; // Alterna entre los textos
                setTimeout(escribirTexto, 500); // Espera antes de volver a escribir
            }
        }, 50);
    }

    setTimeout(escribirTexto,1000); // Inicia la animación
}

textoDashed();



function activeEnvio() {
    const $nameUser = document.querySelector('.nameUser');
    const $nameCountry = document.querySelector('.nameCountry');
    const $couriersContainer = document.querySelector('.couriersContainer');
    const $form = document.getElementById("myForm");
    const colorActivo = "rgb(173, 216, 230)"; // Color referencia para botón

    document.addEventListener("click", (e) => {
        if (e.target.closest(".titleForm>button")) {
            e.preventDefault();
            const button = e.target;
            const isHidden = $nameUser.style.display === "none";

            if (isHidden) {
                $nameUser.style.display = "flex";
                $nameCountry.style.display = "flex";
                $couriersContainer.style.display = "flex";
                button.style.backgroundColor = "";

                $form.direccion.setAttribute('required', 'true');
                $form.departamento.setAttribute('required', 'true');
                $form.distrito.setAttribute('required', 'true');
                $form.infoCourier.setAttribute('required', 'true');
            } else {
                $nameUser.style.display = "none";
                $nameCountry.style.display = "none";
                $couriersContainer.style.display = "none";
                button.style.backgroundColor = colorActivo;

                $form.direccion.removeAttribute('required');
                $form.departamento.removeAttribute('required');
                $form.distrito.removeAttribute('required');
                $form.infoCourier.removeAttribute('required');
            }
        }
    });
}

// activeEnvio();


// function insertCheck() {
//     const template = document.getElementById('checkDatos');
//
//     if (!template) {
//         console.error("❌ No se encontró el template con id 'checkDatos'.");
//         return;
//     }
//
//     const productsAndPay = document.querySelector('.productsAndPay');
//
//     if (!productsAndPay) {
//         console.error("❌ No se encontró el contenedor '.containerElementsCompra'.");
//         return;
//     }
//
//     // Clonamos el contenido del template con importNode
//     const clone = document.importNode(template.content, true);
//
//     // ✅ insertAdjacentElement necesita un elemento, no un fragmento
//
//     const $pasarelaPago=document.querySelector('.pasarelaPago')
//
//     // if(!$pasarelaPago)
//
//     productsAndPay.appendChild(clone);
//
//     console.log("Elemento insertado correctamente");
//
//
//
//     setTimeout(()=>{
//         const $containerCheck=document.querySelector('.containerCheck');
//         if($containerCheck) {
//             $containerCheck.style.opacity="1";
//         }
//     },200)
//
//
//
//
//     setTimeout(()=>{
//         const $containerCheck=document.querySelector('.containerCheck');
//
//         if($containerCheck){
//             // $containerCheck.style.transform="scale(0)";
//             $containerCheck.style.opacity="0";
//         }
//
//     },1200)
//     setTimeout(()=>{
//         const $containerCheck=document.querySelector('.containerCheck');
//
//         if($containerCheck){
//             $containerCheck.style.display="none";
//         }
//
//     },1400)
//
//     const $containerCheck=document.querySelector('.containerCheck');
//     const computedCheck=getComputedStyle($containerCheck).display;
//     const $formularioEnvio=document.getElementById('formularioEnvio');
//
//     if($formularioEnvio)  $formularioEnvio.style.display="none";
//
//
//
// }



// function activeBoton(){
//
//     const $payVirtualWallet = document.querySelector("#payVirtualWallet");
//     const $payCard = document.querySelector("#payCard");
//
//     const yapeBackground = "url(/img/yape.png)";
//     const plinBackground = "url(/img/plin.webp)";
//
//     const americanExpressBackground="url(/img/americanExpress.png)";
//     const mastercardBackground="url(/img/mastercard.jpg)";
//     const visaBackground="url(/img/visa.jpg)";
//
//
//     $payVirtualWallet.textContent="";
//
//
//     const $yape=document.querySelector('.yape');
//     const $plin=document.querySelector('.plin');
//
//     // Object.assign()
//
//
//     // Estilos iniciales
//     Object.assign($payVirtualWallet.style, {
//         opacity: "1",
//         width: "175px",
//         minWidth: "175px",
//         pointerEvents: "auto",
//         display: "block",
//         backgroundImage: yapeBackground,
//         backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "center",
//     });
//
//     Object.assign($payCard.style, {
//         opacity: "1",
//         width: "175px",
//         minWidth: "175px",
//         pointerEvents: "auto",
//         display: "block",
//         backgroundImage: visaBackground,
//         backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "center",
//
//     });
//
//     // Cambia la imagen cada 1.5 segundos
//     setInterval(() => {
//         if ($payVirtualWallet.style.backgroundImage.includes("yape.png")) {
//             $payVirtualWallet.style.backgroundImage = plinBackground;
//         } else {
//             $payVirtualWallet.style.backgroundImage = yapeBackground;
//         }
//     }, 1500);
//
//     $payCard.textContent="";
//
//     setInterval(()=>{
//         if($payCard.style.backgroundImage.includes('visa.jpg')){
//             $payCard.style.backgroundImage=mastercardBackground;
//         }else if($payCard.style.backgroundImage.includes('mastercard.jpg')){
//             $payCard.style.backgroundImage=americanExpressBackground;
//         }else{
//             $payCard.style.backgroundImage=visaBackground;
//         }
//     },1500)
//
//
//
//     insertCheck();
//
// }


// function enviarDatosCliente() {
//     const $form = document.getElementById("myForm");
//     const $couriers = document.querySelectorAll('.couriers button');
//     let eleccionEmpresa;
//
//     // Guardar la empresa seleccionada
//     $couriers.forEach(button => {
//         button.addEventListener('click', function () {
//             eleccionEmpresa = button.dataset.empresa;
//             console.log(eleccionEmpresa);
//         });
//     });
//
//     $form.addEventListener('submit', async e => {
//         e.preventDefault();
//         const $user = document.querySelector('.nameUser');
//         const computedUser = getComputedStyle($user).display;
//         console.log(computedUser);
//
//         if (computedUser === "none") {
//             $form.direccion.removeAttribute('required');
//             $form.departamento.removeAttribute('required');
//             $form.distrito.removeAttribute('required');
//             $form.infoCourier.removeAttribute('required');
//
//         } else {
//             $form.direccion.setAttribute('required', 'true');
//             $form.departamento.setAttribute('required', 'true');
//             $form.distrito.setAttribute('required', 'true');
//             $form.infoCourier.setAttribute('required', 'true');
//
//             // Asegurar que el usuario pueda ver los errores antes de enviar
//             if (!$form.checkValidity()) {
//                 console.log('Formulario inválido');
//                 $form.reportValidity();
//                 return;
//             }
//         }
//
//         // **Si pasa la validación, enviar los datos**
//         const correo = $form.correo.value.trim();
//         const nombre = $form.nombre.value.trim();
//         const numOne = $form.firtsPhone.value.trim();
//         const numTwo = $form.secondPhone.value.trim();
//         const direccion = $form.direccion.value.trim();
//         const departamento = $form.departamento.value.trim();
//         const distrito = $form.distrito.value.trim();
//         const infoExtra = $form.infoExtra.value.trim();
//         const infoCourier = $form.infoCourier.value.trim();
//
//         const url = computedUser === "none" ? "/datos/cliente/compra/short" : "/datos/cliente/compra/complete";
//         const datosCliente = {
//             correo,
//             nombre,
//             numOne: parseInt(numOne),
//             numTwo: parseInt(numTwo) || 123456789,
//             direccion: computedUser === "none" ? "" : direccion,
//             departamento: computedUser === "none" ? "" : departamento,
//             distrito: computedUser === "none" ? "" : distrito,
//             infoExtra: infoExtra || "Sin referencias",
//             infoCourier,
//             eleccionEmpresa
//         };
//
//         const options = {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(datosCliente),
//         };
//
//         try {
//             const response = await fetch(url, options);
//             const result = await response.json();
//             console.log(" Datos enviados correctamente:", result);
//             // alert("Datos enviados correctamente.");
//
//             const verificar = await verificarDatosCliente();
//             if (verificar.length > 0) {
//                 console.log(verificar);
//                 activeBoton();
//                 AfterSendData();
//             }
//         } catch (error) {
//             console.error("Error al enviar datos:", error);
//             alert("Hubo un error al enviar los datos.");
//         }
//     });
// }




function AfterSendData(){
    const $pasarelaPago=document.querySelector('.pasarelaPago')

    if($pasarelaPago) {
        $pasarelaPago.style.opacity="0";
        setTimeout(()=>{
            $pasarelaPago.style.display="none";
        },250)
        // $pasarelaPago.style.display="none";
    }


}

async function verificarDatosCliente(){

    const url="/datos/cliente/compra/estatic";
    const options={
        method: 'GET',
        headers:{"Content-Type":"application/json"}
    }

    const response=await fetch(url, options);

    if(!response.ok) throw new Error(`hubo un error en la peticion->${response.statusText}`)

    const result=await response.json();

    console.log(result.existencia);

    return result.datosCliente;
}


// function absorberDatosFormulario(){
//
//     const $form=document.getElementById('myForm');
//
//     const $textarea=document.querySelector('.couriers~textarea')
//
// document.addEventListener('click',e=>{
//
//     if(e.target.closest('.couriers>button')){
//
//         const computedOpacityTextArea=getComputedStyle($textarea).display;
//         $textarea.value=""
//
//         if(computedOpacityTextArea==="flex"||computedOpacityTextArea==="block"){
//             $textarea.style.display="none";
//         }
//
//         const allButton=document.querySelectorAll('.couriers>button');
//         if(allButton.length>0){
//             allButton.forEach(button=>button.style.background="");
//         }
//         if(e.target.closest('.couriers>button:nth-of-type(1)')){
//
//             e.target.style.background="red";
//             $textarea.placeholder="Ejemplo:\n\nEmpresa: shalom - Agencia: parque industrial.";
//             $textarea.style.display="block";
//         }
//
//         if(e.target.closest('.couriers>button:nth-of-type(2)')) {
//             e.target.style.background = "yellow";
//             $textarea.placeholder="Ejemplo:\n\nEmpresa: olva courier - Agencia: sumar.";
//             $textarea.style.display="block";
//         }
//         if(e.target.closest('.couriers>button:nth-of-type(3)')) {
//             e.target.style.background = "green";
//             $textarea.placeholder="Delivery solo en Lima metropolitana y el callao";
//             $textarea.style.display="block"
//         }
//         if(e.target.closest('.couriers>button:nth-of-type(4)')) {
//             e.target.style.background = "gray";
//             $textarea.placeholder="Ejemplo:\n\nEmpresa: Expreso nacional - Agencia: ciudad universitaria."
//             $textarea.style.display="block"
//         }
//
//
//     }
// })
//
// }
// absorberDatosFormulario()



const $sideLeft=document.querySelector('.sideLeft');
if($sideLeft) navegationImgs()

function navegationImgs() {
    const $sideLeft = document.querySelector('.sideLeft');
    const allImgs = $sideLeft.querySelectorAll('img');

    const array = [];
    allImgs.forEach(img => {
        array.push(img.src);
    });

    const $allCirclesNavegation = document.querySelectorAll('.circlesLeftSide > div');

    let contador = 0;
    const totalImgs = array.length;

    let movAutomatico; // Guardaremos el intervalo aquí

    function startInterval() {
        movAutomatico = setInterval(() => {
            $allCirclesNavegation[contador].style.background = "";

            allImgs[0].src = array[((3 + (totalImgs - contador) % totalImgs)) % totalImgs];
            allImgs[1].src = array[((totalImgs - contador) % totalImgs)];
            allImgs[2].src = array[((1 + (totalImgs - contador)) % totalImgs) % totalImgs];
            allImgs[3].src = array[((2 + (totalImgs - contador)) % totalImgs) % totalImgs];

            contador++;

            $allCirclesNavegation[contador % totalImgs].style.background = "black";

            if (contador === totalImgs) contador = 0;
        }, 2000);
    }

    $allCirclesNavegation[contador].style.background="black";

    startInterval();

    document.addEventListener('click', e => {
        if (e.target.closest('.arrowsLeftSide > svg:nth-of-type(1)')) {
            clearInterval(movAutomatico); // Detener el intervalo

            console.log(contador,"<- aqui ta el contador")
            $allCirclesNavegation[(contador+totalImgs)%totalImgs].style.background="";

            allImgs[0].src = array[(0 - (totalImgs - 1 - contador) % totalImgs + totalImgs) % totalImgs];
            allImgs[1].src = array[(1 - (totalImgs - 1 - contador) % totalImgs + totalImgs) % totalImgs];
            allImgs[2].src = array[(2 - (totalImgs - 1 - contador) % totalImgs + totalImgs) % totalImgs];
            allImgs[3].src = array[(3 - (totalImgs - 1 - contador) % totalImgs + totalImgs) % totalImgs];

            contador--;

            $allCirclesNavegation[(contador+totalImgs)%totalImgs].style.background="black";

            if(contador===-4) contador=0;

            startInterval(); // Reiniciar el intervalo
        }

        if (e.target.closest('.arrowsLeftSide > svg:nth-of-type(2)')) {
            clearInterval(movAutomatico);
            $allCirclesNavegation[(contador+totalImgs)%totalImgs].style.background = "";

            allImgs[0].src = array[((3 + (totalImgs - contador) % totalImgs)) % totalImgs];
            allImgs[1].src = array[((totalImgs - contador) % totalImgs)];
            allImgs[2].src = array[((1 + (totalImgs - contador)) % totalImgs) % totalImgs];
            allImgs[3].src = array[((2 + (totalImgs - contador)) % totalImgs) % totalImgs];

            contador++;

            $allCirclesNavegation[contador % totalImgs].style.background = "black";

            if (contador === totalImgs) contador = 0;

            startInterval(); // Reiniciar el intervalo
        }
    });
}



function animationButton(){

    const $body=document.querySelector('body');

    document.addEventListener('click',e=>{

        if(e.target.tagName==="BUTTON"){
            e.target.classList.add('tickButton');
            const idTimeOut=setTimeout(()=>{
                e.target.classList.remove('tickButton');
            },150);
        }
    })
}

animationButton();

async function ocultarContadorCarrito(){
    const $contadorCarrito=document.getElementById('contador-carrito');
    const $containerElementsCompra=document.querySelector('.containerElementsCompra');

    if($containerElementsCompra){
        if($containerElementsCompra.children.length===0){
            $contadorCarrito.style.opacity="0";
        }
        const carrito=await datosCarrito();
        if(carrito.carritoL==='0'){
            $contadorCarrito.style.opacity="0";
        }
    }
}
ocultarContadorCarrito();

const create_circles_carousel = () => {
    const $section_carousel = document.querySelector('.carouselImages');
    const $container_imagenes = document.querySelector('.containerImages');
    const $imagenes_carousel = document.querySelectorAll('.containerImages>img');

    const contenedor_circulos = document.createElement('ul');
    contenedor_circulos.setAttribute('id', 'lista_circulos');

    $imagenes_carousel.forEach((img, indice) => {
        const elemento_circulo = document.createElement('li');
        elemento_circulo.classList.add('circulo_contador', `circulo_contador_${indice}`);
        contenedor_circulos.appendChild(elemento_circulo);
    });

    if (contenedor_circulos) {
        $section_carousel.appendChild(contenedor_circulos);
    } else {
        console.log('no se ha podido agregar el contenedor de circulos');
    }

    const all_circles = document.querySelectorAll('.circulo_contador');

    let currentIndex = 0; // Índice actual de la imagen
    let autoSlideInterval; // Identificador del intervalo automático

    // Función para actualizar la posición del carrusel
    const updateCarousel = (index) => {
        // Mover imágenes
        $container_imagenes.style.transform = `translateX(-${index * 100}%)`;

            $container_imagenes.classList.add('animate-image');
        setTimeout(()=>{
            $container_imagenes.classList.remove('animate-image');
        },350)


        all_circles.forEach(circle => circle.style.background = "");
        all_circles[index].style.background = "black";
    };

    // Función para iniciar el auto-slide
    const startAutoSlide = () => {
        stopAutoSlide(); // Limpiar cualquier intervalo previo
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % $imagenes_carousel.length;
            updateCarousel(currentIndex);
        }, 3000); // Intervalo de 3 segundos
    };

    // Función para detener el auto-slide temporalmente
    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };

    // Eventos para las flechas
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains("arrowLeft")) {
            stopAutoSlide(); // Pausar el intervalo automático temporalmente
            currentIndex = (currentIndex - 1 + $imagenes_carousel.length) % $imagenes_carousel.length;
            updateCarousel(currentIndex);
            startAutoSlide(); // Reanudar el intervalo automático
        }

        if (e.target.classList.contains("arrowRight")) {
            stopAutoSlide(); // Pausar el intervalo automático temporalmente
            currentIndex = (currentIndex + 1) % $imagenes_carousel.length;
            updateCarousel(currentIndex);
            startAutoSlide(); // Reanudar el intervalo automático
        }
    });

    // Inicializar carrusel
    updateCarousel(currentIndex);
    startAutoSlide();
};


let controllerInterval;

export function carritoContadorDOM() {
    const $carrito = document.getElementById('carrito').parentNode;
    const $contador_carrito = document.getElementById('contador-carrito');

    $carrito.style.position = "relative";

    $contador_carrito.style.position = "absolute";
    $contador_carrito.style.top = "-12px";
    $contador_carrito.style.right = "-12px";
    $contador_carrito.style.width = "12.5px";
    $contador_carrito.style.height = "12.5px";
    // $contador_carrito.style.lineHeight = "19px"; // Centrar el número
    // $contador_carrito.style.border = "1px solid white";
    // $contador_carrito.style.background = "lightblue";
    // $contador_carrito.style.borderColor="black";
    $contador_carrito.style.borderRadius = "50%";
    $contador_carrito.style.textAlign = "center";
    $contador_carrito.style.fontSize = "10px";
    $contador_carrito.style.padding = "9px";
    $contador_carrito.style.transition = "opacity 0.35s ease-in-out, transform 0.35s ease-in-out"; // Añadimos una transición de tamaño

    const url = "/carrito/estado/cuack/cuack";
    const options = {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
    };

    const peticionCarrito = async () => {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Hubo un error en la petición -> ' + response.statusText);
        }
        const result = await response.json();
        const longitudCarrito = result.carritoL;

        if (!longitudCarrito) {
            $contador_carrito.style.opacity = "0";
            $contador_carrito.style.transform = "scale(0)";

            setTimeout(() => {
                $contador_carrito.textContent = "";
            }, 500);
            clearInterval(controllerInterval);
        } else {
            $contador_carrito.textContent = longitudCarrito;
            $contador_carrito.style.opacity = "1";
            $contador_carrito.style.transform = "scale(1)";
            $contador_carrito.style.transition="all 0.25s linear"
            $contador_carrito.style.textAlign = "center";


        }
    };

    peticionCarrito();
}

document.addEventListener('DOMContentLoaded', (e) => {
    carritoContadorDOM();
})


if(window.location.pathname==="/"){
    create_circles_carousel()
}


/*---LOGICA DE AGREGAR PRODUCTOS CON EL BOTON COMPRAR Y AGREGAR CARRITO----*/
/*---LOGICA DE REDIRECCIONAMIENTO CUANDO HACEMOS CLICK A UN ELEMENTO*/
/*---LOGICA DE REDIRECCIONAMIENTO DE ACUERDO A LA MARCA*/

export let isActive=false;


document.addEventListener('click', async (e) => {

    if (e.target.classList.contains('marca')) {
        console.log('el elemento fue presionado');
        const dataName = e.target.dataset.name;

        // Redirige a la URL correspondiente
        window.location.href = `/${dataName}`;
    }

    const elementProduct = e.target.closest('.elementProduct'); // Busca el contenedor más cercano

    if(!isActive){
        if (elementProduct) {

            const dataBrand = elementProduct.dataset.brand;
            const categoria=elementProduct.dataset.categoria;
            const dataName = elementProduct.dataset.name;
            console.log(dataBrand,categoria,dataName);
            window.location.href = `/${dataBrand}/${categoria}/${dataName}`;
        }
    }


    if (e.target.nodeName === 'BUTTON' && e.target.classList.contains('btn-carrito')) {

        await postProduct(e)
        carritoContadorDOM();
    }

    if(e.target.classList.contains('btn-comprar')){

        await postProduct(e)
        carritoContadorDOM();
        window.location.href="/compra/compra/compra/compra";
    }

    if(e.target.classList.contains('deleteAllProducts')){
        console.log('si tamos funcioanando')
        const url="/compra/compra/compra/compra";
        const products={

        }
        const options={
            method: 'DELETE',
            headers:{'Content-type':'application/json'},
            // body: JSON.stringify(products),
        }

        const peticionDelete=async()=>{
            const response=await fetch(url,options);
            if(response.ok){
                const result=await response.json();
                console.log(result);
                console.log(result.carrito);

                const productsAndPay=document.querySelector('.productsAndPay');
                const buttonsFinalizar=document.querySelector('.buttonsFinalizar');
                const hr=document.querySelector('.productsAndPay~hr');
                hr.remove();
                buttonsFinalizar.remove();
                productsAndPay.innerHTML="<h2>El carrito ha sido eliminado</h2>";
                const lastH2=document.querySelector('.totalCompra');
                lastH2.textContent="Total: S/0.00"
                const contadorCarrito=document.getElementById('contador-carrito');
                contadorCarrito.textContent=0;

                deleteDatos();

            }else{
                console.error('error al eliminar la lista de carrito')
            }
        }
        peticionDelete();
        carritoContadorDOM();

    }
});


function eventsProductMarcaAddCarrito(){
    //active=false;
    const $buttonAddAll=document.querySelectorAll('.elementProduct>div>button:nth-of-type(1)')

    $buttonAddAll.forEach(button=>{

        button.addEventListener('mouseenter',e=>{
            isActive=true;
        })
        button.addEventListener('mouseleave',e=>{
            isActive=false;
        })

    })

    document.addEventListener('click',async e=>{

        if(e.target.matches('.elementProduct>div>button:nth-of-type(1)')){
            await postProduct(e);
            carritoContadorDOM();
        }

    })

}
eventsProductMarcaAddCarrito()

function eventsProductMarcaComprar(){

    const $buttonComprarAll=document.querySelectorAll('.elementProduct>div>button:nth-of-type(2)');

    if($buttonComprarAll){

        $buttonComprarAll.forEach(button=>{
            button.addEventListener('mouseenter',e=>{
                isActive=true;
                console.log('entro al boton comprar')

            })
            button.addEventListener('mouseleave',e=>{
                isActive=false;
                console.log('salio del boton comprar')
            })
        })
    }

        document.addEventListener('click',async e=>{

            if(e.target.closest('.elementProduct>div>button:nth-of-type(2)')) {

                if (isActive) {
                    await postProduct(e)
                    window.location.href="/compra/compra/compra/compra";

                }
            }
        })
    // }

}
eventsProductMarcaComprar();

/*----click en el nombre de busqueda-----*/

document.addEventListener('click',(e)=>{
    if(e.target.classList.contains('nombreElement')){
        const marcaDirection=e.target.textContent.trim().toLowerCase();

            if(marcaDirection==="otras marcas"){
                console.warn('ups otras marcas no tiene redireccion')
            }else{
                window.location.href=`/${marcaDirection}`;
            }
    }
    if(e.target.matches('.listaInicio>li')){
        const categoria=e.target.textContent.trim().toLowerCase();
        const title=e.target.closest('.listaInicio').previousElementSibling.textContent.toLowerCase();
        if(title==="otras marcas") {
            window.location.href=`/${categoria}`;
        }else{
            window.location.href=`/${title}/${categoria}`;
        }
    }

})
/*contador de productos repetidos*/
function ordenGroup(){

    const allElements=document.querySelectorAll('.compraElement');
    const mapProducts=new Map();


    allElements.forEach(element=>{
        if(mapProducts.has(element.dataset.id)){
            mapProducts.get(element.dataset.id).push(element);
        }else{
            mapProducts.set(element.dataset.id,[element]);
        }
    })
    Array.from(mapProducts).forEach(([key,value],indice)=>{
        value.forEach(product=>{
            if(product!==value[0]){
                product.style.opacity="0";
                product.style.position="absolute";
                product.style.pointerEvents="none";
            }else{
                product.style.opacity="1";
                product.style.pointerEvents="auto";
                product.style.position="relative";

                const $contador=product.querySelector('.contadorElementsCompra');
                if($contador){
                    $contador.textContent=value.length;
                }
            }
        })
    })
}

function renderAllProducts(){

    const allElementsProducts=Array.from(document.querySelectorAll('.compraElement'));
    const mapProducts=new Map();

    allElementsProducts.forEach((el)=>{
        if(mapProducts.has(el.dataset.id)){
            mapProducts.get(el.dataset.id).push(el);
        }else{
            mapProducts.set(el.dataset.id,[el])
        }
    })

    const containerElementsCompra=document.querySelector('.containerElementsCompra');
    Array.from(mapProducts).forEach(([key, value], indice) => {

        const groupProducts = document.createElement('div');
        groupProducts.className = `group_products group_products_${indice + 1}`;
        groupProducts.style.position="relative";

        value.forEach((el) => {
            if(el!==value[0]){
                el.style.opacity="0";
                el.style.position = "absolute";
                el.style.pointerEvents="none";
            }else{
                el.style.position="relative";
                el.style.opacity = "1";
                el.style.pointerEvents="auto";
            }
            const contadorElementsCompra=document.querySelector('.contadorElementsCompra');
            contadorElementsCompra.textContent=value.length;
            groupProducts.appendChild(el); // Aquí 'el' sí es un Node
        });
        containerElementsCompra.appendChild(groupProducts);
    });
}

async function deleteProductRender(node){

    const $groupProducts=node.closest('.group_products');
    const $compraElement=node.closest('.compraElement');

    if($groupProducts){
        if($compraElement){
            $compraElement.remove();
        }

        const existenciaCompras=$groupProducts.querySelectorAll('.compraElement');

        if(existenciaCompras.length===0){
            $groupProducts.remove();
            if(!$groupProducts){
            }
        }
        console.log('aqui esta el grupo del elemento presionado->', $groupProducts);
    }else{
        console.log('el nodo no existe')
    }
    if($compraElement){
        console.log('aqui esta el elemento presionado->',$compraElement);
    }
    ordenGroup();
    console.log([...document.querySelectorAll('.compraElement')]); // Para ver qué elementos quedan realmente

}


async function addProductRender(node) {
    const $groupProducts = node.closest('.group_products');

    let lastId = await lastIdCompra();

    if ($groupProducts) {
        console.log('Aquí está el nodo presionado con toda la info ->', node.closest('svg'));

        const { id, brand, img, price, name } = node.closest('svg').dataset;
        const totalElementsGroup = parseInt($groupProducts.querySelectorAll('.compraElement').length);

        console.log('Aquí está el grupo del elemento presionado ->', $groupProducts);
        console.log('Aquí está el lastId ->', lastId);

        const elementProductAdd = document.createElement('div');
        elementProductAdd.classList.add(`compraElement`, `compraElement_${lastId}`);
        elementProductAdd.style.transition = "opacity 0.35s linear, transform 0.35s linear";
        elementProductAdd.dataset.id = id;
        elementProductAdd.dataset.idCompra = lastId;
        elementProductAdd.dataset.brand = brand;
        elementProductAdd.dataset.img = img;
        elementProductAdd.dataset.price = price;
        elementProductAdd.dataset.name = name;

        elementProductAdd.innerHTML = `
            <img src="${img}" alt="${brand}">
            <h3>${brand}</h3>
            <span>${name}</span>
            <p><b>Precio: </b><small>S/. ${price}</small></p>    
            <div id="deleteElementCompra" data-id-compra=${lastId}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </div>
            <div class="controllerCountProducts">
                <svg id="arrowLeft" data-id-compra=${lastId} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#999999"><path d="M200-440v-80h560v80H200Z"></path>               
                </svg>
                <div class="contadorElementsCompra">
                    <small>${totalElementsGroup + 1}</small>
                </div>
                <svg id="arrowRight" data-id=${id} data-brand=${brand} data-img=${img} data-price=${price} data-name=${name} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#999999"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"></path>
                </svg>
            </div>                  
        `;

        $groupProducts.appendChild(elementProductAdd);

        // Aplica la animación de parpadeo a todo el grupo de productos
        $groupProducts.classList.add("blinkEffect");




        setTimeout(() => {
            $groupProducts.classList.remove("blinkEffect");
        }, 125);

        ordenGroup();

    } else {
        console.log('El nodo no existe');
    }
}



function deleteGroup(node){

    const $group=node.closest('.group_products');

    console.log('cuack->',$group)

    if($group){
        console.log('aqui esta el grupo que queremos eliminar->',$group)
        $group.remove();
        ordenGroup();
    }

}

function renderAfterAction(carrito) {
    const containerElements = document.querySelector('.containerElementsCompra');
    containerElements.innerHTML = ''; // Limpia el contenedor principal

    const mapProducts = new Map();

    // Agrupar los productos en un Map por ID
    carrito.forEach((item) => {
        if (mapProducts.has(item.id)) {
            mapProducts.get(item.id).push(item);
        } else {
            mapProducts.set(item.id, [item]);
        }
    });

    // Renderizar los productos agrupados
    mapProducts.forEach((products, id) => {
        const groupProducts = document.createElement('div');
        groupProducts.className = `group_products group_products_${id}`;
        groupProducts.style.position = 'relative';

        products.forEach((product, index) => {
            const productElement = document.createElement('div');
            productElement.className = `compraElement compraElement_${index + 1}`;
            productElement.dataset.id = product.id;
            productElement.dataset.idCompra = product.idCompra;
            productElement.dataset.brand = product.brand;
            productElement.dataset.img = product.img;
            productElement.dataset.price = product.price;
            productElement.dataset.name=product.name;

            productElement.innerHTML = `
                <img src="${product.img}" alt="${product.brand}">
                <b>${product.brand}</b>
                <span>${product.name}</span>
                <p><b>Precio:</b><small> S/.${product.price}</small></p>
                <div id="deleteElementCompra" data-id-compra="${product.idCompra}">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </div>
                <div class="controllerCountProducts">
                    <svg id="arrowLeft" style="transition: background 0.35s linear;border-radius:50%" class="activeAfter" data-id-compra="${product.idCompra}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#999999"><path class="desativeEvents" d="M200-440v-80h560v80H200Z"></svg>
                    <div class="contadorElementsCompra">
                        <small>${products.length}</small>
                    </div>
                    <svg id="arrowRight" style="transition: background 0.35s linear;border-radius:50%" class="activeAfter" data-id="${product.id}" data-brand="${product.brand}" data-img="${product.img}" data-price="${product.price}" data-name="${product.name}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#999999"><path class="desactiveEvents" d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"></svg>
                </div>
            `;



            const $arrowLeftAll=document.querySelectorAll('#arrowLeft');
            const $arrowRightAll=document.querySelectorAll('#arrowRight');


            if($arrowLeftAll.length>0){
                $arrowLeftAll.forEach(svgLeft=>{

                    svgLeft.style.zIndex="3";


                    svgLeft.addEventListener('mouseenter',e=>{
                        svgLeft.style.background="lightblue"
                    })
                    svgLeft.addEventListener('mouseleave',e=>{
                        svgLeft.style.background="";
                    })
                })

            }
            if($arrowRightAll.length>0){
                $arrowRightAll.forEach(svgRight=>{

                    svgRight.style.zIndex="3";

                    svgRight.addEventListener('mouseenter',e=>{
                        svgRight.style.background="lightblue"

                    })
                    svgRight.addEventListener('mouseleave',e=>{
                        svgRight.style.background=""
                    })
                })

            }

            const $pathLeftAll=document.querySelectorAll('#arrowLeft>path')
            const $pathRightAll=document.querySelectorAll('#arrowRight>path')

            // Estilos para el primer elemento del grupo (visible)
            if (index === 0) {
                productElement.style.opacity = '1';
                productElement.style.position = 'relative';
            } else {
                // Estilos para los elementos ocultos
                productElement.style.opacity = '0';
                productElement.style.position = 'absolute';
                productElement.style.top = '25px';
                productElement.style.right = '25px';
            }

            groupProducts.appendChild(productElement);
        });

        containerElements.appendChild(groupProducts);
    });

    console.log('Carrito actualizado:', mapProducts);
}


/*----LOGICA PARA AGREGAR Y ELIMINAR CON LAS FLECHAS Y EL ICONO X DE COMPRAR*/


export async function lastIdCompra(){
    const url="/carrito/estado/cuack/cuack";
    const options={
        method: "GET",
        headers: {"Content-Type":"application/json"},
    }

    const peticionIdCompra=async()=>{
        const response=await fetch(url,options);

        if(!response.ok){
            throw new Error(`hubo un error en la peticion->${response.statusText}`);
        }
        const result=await response.json();

        return result.lastIdCompra;
    }

    return peticionIdCompra();
}


document.addEventListener('click',async(e)=>{
    if(e.target.id==='carrito'){
        window.location.href="/compra/compra/compra/compra"
    }

    if(e.target.id==="deleteElementCompra"){

        console.log(e.target)

        const parentElement=e.target;
        let id=parentElement.parentNode.dataset.id;

        console.log(parentElement.parentNode);

        const url="/compra/compra/compra/compra";
        const bodyElements={
            id,
            idCompra:null,
        }
        const options={
            method: 'DELETE',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(bodyElements),
        }
        const peticionDeleteElement=async()=>{
            const response=await fetch(url,options);

            if(response.ok){
                const result=await response.json();
                console.log(result);
                const totalCompra=document.querySelector('.totalCompra');
                const contadorCarrito=document.getElementById('contador-carrito');
                contadorCarrito.textContent=result.carritoLength;
                totalCompra.textContent=`Total: S/${result.carrito.reduce((sum,el)=>sum+el.price,0)}.00`

                // renderAfterAction(result.carrito);
                // renderAllProducts();
                deleteGroup(e.target.parentNode)
                ocultarContadorCarrito();
                // deleteProductRender()
            }else{
                console.log('ha ocurrido un error con la peticion, intente nuevamente');
            }
        }
        peticionDeleteElement();

    }
    if (e.target.closest( "#arrowLeft")) {
        const svg=e.target.closest('svg');
        const idCompra = svg.dataset.idCompra;
        const url = "/compra/compra/compra/compra";
        const producto = {
            idCompra: parseInt(idCompra),
        };
        const options = {
            method: 'DELETE',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify(producto),
        };

        const peticionArrowLeft = async () => {
            const response = await fetch(url, options);

            if (response.ok) {
                const result = await response.json();

                // Actualizar el contador del carrito y el total
                const contadorCarrito = document.getElementById('contador-carrito');
                const totalCompra = document.querySelector('.totalCompra');

                contadorCarrito.textContent = result.carritoLength;
                totalCompra.textContent = `Total: S/${result.carrito.reduce((suma, el) => suma + el.price, 0)}.00`;

                deleteProductRender(e.target);
                ocultarContadorCarrito();
                // ordenGroup()
            }
        };
        peticionArrowLeft();
        carritoDesplegado();
    }

    if (e.target.closest("#arrowRight")) {
        // const svg=e.target.closest('svg');

        await postProduct(e);
        const url = "/carrito/estado/cuack/cuack";
        const options = {
            method: "GET",
        };
        const refreshCount = async () => {
                const response = await fetch(url,options);

            if(response) {
                const result = await response.json();
                const totalCompra = document.querySelector('.totalCompra');
                totalCompra.textContent = `Total: S/${result.carrito.reduce((suma, el) => suma + el.price, 0)}.00`;
            }
        }
        await refreshCount();
        carritoContadorDOM()
        addProductRender(e.target);
        await carritoDesplegado();

    }

})

renderAllProducts()

/*LOGICA PARA LA TRANSICION DEL MENU DESPLEGABLAE*/

const container_group = document.querySelectorAll('.containerGroup');
container_group.forEach(container => {
    const texto = container.querySelector('b');
    const listaSeleccionada = container.querySelector('.listaInicio');

    if (!texto || !listaSeleccionada) return;

    // Variable para controlar si el mouse está dentro de la lista o el título
    let isHovering = false;

    // Función para mostrar la lista
    const mostrarLista = () => {
        isHovering = true;
        listaSeleccionada.classList.add('active_list_menu');
        listaSeleccionada.querySelectorAll('li').forEach((li, indice) => {
            li.style.transition = `opacity ${indice * 0.2}s ease-in-out`;
            li.style.opacity = "1";
        });
    };

    // Función para ocultar la lista
    const ocultarLista = () => {
        setTimeout(() => {
            if (!isHovering) {
                listaSeleccionada.classList.remove('active_list_menu');
                listaSeleccionada.querySelectorAll('li').forEach(li => {
                    li.style.opacity = "0";
                    li.style.transition = "opacity 0.35s linear";
                });
            }
        }, 100); // Retraso opcional para una mejor experiencia
    };

    // Agregar eventos para el título
    texto.addEventListener('mouseenter', mostrarLista);
    texto.addEventListener('mouseleave', () => {
        isHovering = false;
        ocultarLista();
    });

    // Agregar eventos para la lista
    listaSeleccionada.addEventListener('mouseenter', () => {
        isHovering = true;
    });
    listaSeleccionada.addEventListener('mouseleave', () => {
        isHovering = false;
        ocultarLista();
    });
});

/*---------------redireccionamiento de stripe-------------------*/

document.addEventListener("click", async (e) => {
        if (e.target.id === "payCard") {
            //
            // const  verificarData=await verificarDatosCliente();
            //
            // if(verificarData.length>0){
            //     const options={
            //         method:'POST',
            //     }
            //     const checkout=async ()=> {
            //         try {
            //             const response = await fetch('/create-checkout-session', {method: 'POST'})
            //
            //             if (!response.ok) {
            //                 throw new Error('No se pudo crear la session de pago')
            //             }
            //
            //             const session = await response.json();
            //
            //             window.location.href = session.url;
            //
            //         }catch(error){
            //             console.log('Error en el proceso de pago:',error);
            //         }
            //     }
            //     await checkout();
            //     console.log("Lo hicimos bien");
            // }else{
            //     alert('Es requerido ingresar los datos para proceder con la compra')
            // }
            //


        }
        //

    });


/*----------------Pagos mediante QR---------------------------------------*/
function generarCodigoQr(){


    const url="/carrito/estado/cuack/cuack";
    const options={
        method:'GET',
        headers:{'Content-Type':'application/json'},
    }
    const peticionCarrito=async()=>{
        const response=await fetch(url,options);

        if(!response.ok){
            throw new Error(`Hubo un error en la peticion -> ${response.statusText}`)
        }
        const result = await response.json();

        console.log("que fue->",result.carritoL);

        const carrito=result.carritoL;


            const fragment=document.createDocumentFragment();
            const $qrTemplate=document.getElementById('qrTemplate').content;

            const $productsAndPay=document.querySelector('.productsAndPay');

            const clone=document.importNode($qrTemplate,true);

            fragment.appendChild(clone);
            $productsAndPay.appendChild(fragment);
            textoDashedYapePlin();
            colorYapePlin()
            // returnYapePlin();


        // }else{
        //     alert('Aun no tiene productos para realizar un pago');
        // }

    }

    peticionCarrito();
}

// function selectOption(target){
//     const $button=document.querySelector('.boxYapePlin~button');
//     const $colorButton=getComputedStyle($button).backgroundColor;
//
//     // if (bgColor === "rgb(128, 0, 128)" || bgColor === "rgb(0, 128, 0)") { // Purple y Green en RGB
//
//     if(target==="yape"){
//         if($colorButton==="rgb(128, 0, 128)"){
//             $button.style.background=""
//         }else{
//             $button.style.background="purple";
//         }
//     }else{
//         if($colorButton==="rgb(0, 128, 0)"){
//             $button.style.background="";
//         }else{
//             $button.style.background="green";
//         }
//     }
//
// }
// function codigoQr() {
//     const $button = document.querySelector('.boxYapePlin~button');
//     const bgColor = window.getComputedStyle($button).backgroundColor; // Obtener el color real
//
//     if (bgColor === "rgb(128, 0, 128)" || bgColor === "rgb(0, 128, 0)") { // Purple y Green en RGB
//         const $containerYapePlin = document.querySelector('.containerYapePlin');
//         const $boxYapePlin = document.querySelector('.boxYapePlin');
//
//         if ($boxYapePlin) {
//             // $boxYapePlin.remove();
//             $boxYapePlin.style.display="none";
//         }
//
//         // Estilos del botón
//         $button.style.padding = "12.5px";
//         $button.style.borderRadius = "10px";
//         $button.style.minWidth="100px";
//         $button.style.width="125px";
//         $button.textContent = "Enviar";
//
//         // Agregar QR al DOM
//         // $containerYapePlin.prepend(containerQr);
//
//         peticionQr(275,'999888777');
//
//
//         // Esperar a que el contenedor esté en el DOM antes de generar el QR
//     } else {
//         alert('Selecciona una opción');
//     }
//
//
// }
// function returnYapePlin(){
//
//     const $boxYapePlin=document.querySelector('.boxYapePlin');
//     const $returnYapePlin=document.querySelector('.returnYapePlin');
//     // const computedDisplay=getComputedStyle($boxYapePlin).display;
//     const textoDashed=document.querySelector('.textContainer>h1:nth-of-type(2)')
//     if(textoDashed){
//         const computedDisplay=getComputedStyle(textoDashed).display;
//         if(computedDisplay==='none'){
//             $returnYapePlin.style.display="block";
//         }
//     }
//
// }

// document.addEventListener('click',e=>{
//     const $boxYapePlin=document.querySelector('.boxYapePlin');
//     const textoDashed=document.querySelector('.textContainer>h1:nth-of-type(2)')
//     const titleYapePlin=document.querySelector('.textContainer>h1:nth-of-type(1)');
//     const img=document.querySelector('.containerYapePlin>img');
//     const $containerYapePlin=document.querySelector('.containerYapePlin')
//     const button=document.querySelector('.containerYapePlin>button');
//
//     if(e.target.closest(".containerYapePlin>svg:nth-of-type(2)")){
//
//         const svg=e.target.closest('svg');
//         titleYapePlin.textContent="Escoja el medio de pago";
//         textoDashed.style.display="block";
//         textoDashed.textContent="";
//         $containerYapePlin.style.alignItems="";
//         $boxYapePlin.style.display="flex";
//         img.remove();
//         svg.style.display="none";
//         button.textContent="Generar código de pago"
//         button.style.background="";
//         button.style.width="200px";
//     }
// })


// function peticionQr(monto,numero){
//     const url="/generar-qr"
//     const options={
//         method: 'POST',
//         headers:{'Content-Type':'application/json'},
//         body: JSON.stringify({monto,numero}),
//     }
//     const qr=async()=> {
//         const response =await fetch(url, options);
//         if (!response.ok) {
//             throw new Error('hubo un error con la peticion de qr->', response.status);
//         } else {
//             const result =await response.json();
//             console.log(result.qr);
//
//             const $containerYapePlin=document.querySelector('.containerYapePlin');
//             const cajaQR=document.createElement('img');
//             const $button=$containerYapePlin.querySelector('button')
//             const $h1=$containerYapePlin.querySelector('h1');
//
//             const computedStyleButton=window.getComputedStyle($button).backgroundColor;
//
//             const $textContainer=document.querySelector('.textContainer');
//
//             cajaQR.src=result.qr;
//
//             if(computedStyleButton==="rgb(128, 0 ,128)"){
//                 $h1.textContent="Yape";
//             }else{
//                 $h1.textContent="Plin"
//             }
//
//
//             const textDashed=document.querySelector('.textContainer>h1:nth-of-type(2)')
//             $textContainer.insertAdjacentElement('afterend',cajaQR);
//
//             if(textDashed) {
//                 $containerYapePlin.style.alignItems="center";
//                 textDashed.style.display="none";
//                 returnYapePlin()
//             }
//
//
//         }
//     }
//
//     qr();
// }
// function rellenarDatos(){
//
//
//     document.addEventListener('click',e=>{
//
//         const $pasarelaPago=document.querySelector('.pasarelaPago');
//         // const computedPasarela=getComputedStyle($pasarelaPago);
//
//         if(e.target.id==="formularioEnvio"){
//             const input = $pasarelaPago.querySelectorAll('input');
//             if(input){
//                 input.forEach((el)=>{
//                     el.style.backgroundColor="red"
//                     el.focus();
//                 })
//                 // input.style.background = "orange"
//                 console.log('gaaaaa')
//                 // input.focus()
//             }
//
//             $pasarelaPago.style.pointerEvents="auto";
//
//             enviarDatosCliente();
//             const $containerYapePlin=document.querySelector('.containerYapePlin');
//             const form = $pasarelaPago.querySelector('form')
//             // form.style.pointerEvents="auto";
//             form.focus()
//             if($containerYapePlin){
//                 const computedStyleYapePlin=getComputedStyle($containerYapePlin);
//
//                 console.log('aqui ta todo->',computedStyleYapePlin)
//                 console.log($pasarelaPago,"<-pasarelaPago")
//
//                 $containerYapePlin.remove();
//
//                 if($pasarelaPago){
//
//                     $pasarelaPago.style.height="100%";
//                     // $pasarelaPago.style.pointerEvents="auto";
//                     $pasarelaPago.style.display="flex";
//                 }
//
//             }else{
//                 const computedOpacityPasarela=getComputedStyle($pasarelaPago).display;
//
//                 if(computedOpacityPasarela==="flex"){
//
//                     // $pasarelaPago.style.pointerEvents="none";
//                     $pasarelaPago.style.display="none";
//                 }else {
//                     $pasarelaPago.style.height = "100%";
//                     // $pasarelaPago.style.pointerEvents="auto";
//                     $pasarelaPago.style.display="flex";
//                     // form.style.pointerEvents="auto";
//                 }
//             }
//
//         }
//
//
//     })
// }
// rellenarDatos()


// document.addEventListener('click',async e=>{
//     if(e.target.id==="payVirtualWallet") {
//
//         const verificarData= await verificarDatosCliente();
//
//         if(verificarData.length>0){
//             const $containerYapePlin = document.querySelector('.containerYapePlin');
//             const $pasarelaPago=document.querySelector('.pasarelaPago');
//
//             if($pasarelaPago){
//                 const computedOpacityPasarela=getComputedStyle($pasarelaPago).display;
//
//                 if(computedOpacityPasarela==="flex"){
//                     $pasarelaPago.style.display="none";
//                     $pasarelaPago.style.pointerEvents="none";
//                 }
//             }
//
//             if($containerYapePlin){
//                 const computedOpacityYapePlin=getComputedStyle($containerYapePlin).opacity;
//
//                 if(computedOpacityYapePlin==="1"){
//                     $containerYapePlin.style.opacity="0";
//                     $containerYapePlin.style.width="0";
//                     $containerYapePlin.style.minWidth="0";
//                     $containerYapePlin.style.height="0";
//                     $containerYapePlin.style.pointerEvents="none";
//                 }else{
//                     $containerYapePlin.style.opacity="1";
//                     // $containerYapePlin.style.width="500px";
//                     // $containerYapePlin.style.minWidth="500px";
//                     $containerYapePlin.style.height="800px";
//                     $containerYapePlin.style.pointerEvents="auto";
//                 }
//
//             }else{
//                 generarCodigoQr()
//             }
//         }else{
//             alert('usted no ha rellenados los datos de envio');
//         }
//
//
//     }
//
//
//     if(e.target.closest('.containerYapePlin>svg:nth-of-type(1)')){
//
//         const $containerYapePlin = document.querySelector('.containerYapePlin');
//
//         if($containerYapePlin){
//             $containerYapePlin.remove();
//         }
//
//     }
//
//     if(e.target.classList.contains("yape")){
//         selectOption("yape");
//     }
//     if(e.target.classList.contains("plin")){
//         selectOption("plin")
//     }
//     if(e.target.matches(".boxYapePlin ~ button")){
//         codigoQr();
//     }
//
//
// })

// function textoDashedYapePlin(){
//     const textYapePlin = document.querySelector('.textContainer>h1:nth-of-type(2)');
//     let textOne="Te damos la opcion de elegir tu billetera digital favorita.";
//     let textTwo="Yapea o Plinea en Jeatdeam."
//     let changeText = true;
//     let textShow = changeText ? textOne : textTwo;
//     let showText = "";
//
//     function escribirText() {
//         textShow.split('').forEach((letra, indice) => {
//             setTimeout(() => {
//                 showText = showText + letra;
//                 textYapePlin.textContent = showText + "|";  // Mostrar el texto con el cursor "|"
//             }, 50 * indice);
//         });
//
//         setTimeout(deleteText, textShow.length * 50 + 500); // Ajustamos el tiempo de espera después de la escritura
//     }
//
//     escribirText();

//     function deleteText() {
//         const handleInterval = setInterval(() => {
//             if (showText.length > 0) {
//                 showText = showText.slice(0, -1);
//                 textYapePlin.textContent = showText + "|";  // Mostrar el texto con el cursor "|"
//             } else {
//                 // Aquí cambiamos el texto y luego reiniciamos el ciclo
//                 changeText = !changeText;
//                 textYapePlin.textContent = ""; // Limpiar el texto de la pantalla
//                 clearInterval(handleInterval);
//                 // Cambiar el texto y escribirlo después de un pequeño retraso
//                 setTimeout(() => {
//                     textShow = changeText ? textOne: textTwo;
//                     escribirText();
//                 }, 200); // Esperar un momento antes de comenzar a escribir el nuevo texto
//             }
//         }, 50);
//     }
// }
//


// function colorYapePlin(){
//
//     const $buttonYape=document.querySelector('.yape')
//     const $buttonPlin=document.querySelector('.plin')
//
//     if($buttonYape) {
//         $buttonYape.addEventListener('mouseenter', e => {
//             $buttonYape.style.boxShadow="0 0 5px rgba(0,0,0,0.8)"
//             $buttonYape.style.transform="scale(1.10)"
//             $buttonYape.style.transition="all 0.25s linear"
//         })
//         $buttonYape.addEventListener('mouseleave', e => {
//             $buttonYape.style.filter="";
//             $buttonYape.style.transform="";
//             $buttonYape.style.boxShadow="0 0 5px rgba(0,0,0,0.5)";
//         })
//     }
//
//     if($buttonPlin){
//         $buttonPlin.addEventListener('mouseenter',e=>{
//             $buttonPlin.style.boxShadow="0 0 5px rgba(0,0,0,0.8)"
//             $buttonPlin.style.transform="scale(1.10)";
//             $buttonPlin.style.transition="all 0.25s linear";
//         })
//         $buttonPlin.addEventListener('mouseleave',e=>{
//             $buttonPlin.style.boxShadow="0 0 5px rgba(0,0,0,0.5)"
//             $buttonPlin.style.filter="";
//             $buttonPlin.style.transform="";
//         })
//
//
//     }
//
// }


async function extraerDatos() {
    const url = "/carrito/estado/cuack/cuack";
    const options = {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Error en la petición: ${response.statusText}`);
        const result = await response.json();
        return result.baseDatos;
    } catch (error) {
        console.error('Error al extraer datos:', error);
        return [];
    }
}


async function addPriceAndImg(oracionesFiltradas,textoIngresado){

    const baseDatos=await extraerDatos();


    const $searchAndOptions=document.querySelector('.searchAndOptions')

    const $ul=$searchAndOptions.querySelector('ul');

    const fragmentUL=document.createDocumentFragment();

    if($ul) {


        oracionesFiltradas.forEach((oracion, indice) => {

            const element = baseDatos.find(el => [el.brand.toLowerCase(), el.name.toLowerCase()].join(' ') === oracion)

            const fragmentLi = document.createDocumentFragment();
            const liProduct = document.createElement('li');
            const spanBrand = document.createElement('span');
            const containerName = document.createElement('span');
            const imgProduct = document.createElement('img');
            imgProduct.dataset.category = element.category;
            const spanPrice = document.createElement('span');
            const containerBrandName = document.createElement('div');

            spanBrand.textContent = element.brand;
            spanBrand.style.fontSize = "16px";
            spanBrand.style.fontWeight = "500";


            element.name.split(' ').forEach((word, indice) => {

                const spanWord = document.createElement('span');

                spanWord.textContent = word;
                spanWord.style.fontSize = "16px";
                containerName.appendChild(spanWord);

            })

            containerBrandName.appendChild(spanBrand);
            containerBrandName.appendChild(containerName);


            imgProduct.src = element.img[0];

            spanPrice.textContent = `S/. ${element.price}`;
            spanPrice.style.fontWeight = "500";
            spanPrice.style.fontSize = "16px";

            fragmentLi.appendChild(imgProduct);
            fragmentLi.appendChild(containerBrandName)
            fragmentLi.appendChild(spanPrice);

            liProduct.appendChild(fragmentLi);
            fragmentUL.appendChild(liProduct)
        })

        return fragmentUL;

        // $ul.appendChild(fragmentUL);


        // let textoLimpio=limpiarTexto(oracionesFiltradas)
        // const element=baseDatos.find(element=>{
        //
        //     if([element.brand.toLowerCase(),element.name.toLowerCase()].join(' ')===textoLimpio){
        //         // console.log('brand: ',element.brand);
        //         // console.log('name: ',element.name);
        //         return element;
        //     }
        // })


        //     const regex = new RegExp(`\\b\\w*${textoIngresado}\\w*\\b`, 'gi');
        //     const coincidencias = textoIngresado.match(regex);
        //
        //         // const fragmentLi=document.createDocumentFragment();
        //         // const li=document.createElement('li');
        //         // const spanBrand=document.createElement('span');
        //         // const div=document.createElement('div');
        //         //
        //         // spanBrand.textContent= element.brand;
        //         // spanBrand.style.fontSize = "16px";
        //         // spanBrand.style.fontWeight="500";
        //     // const spanName=document.createElement('span');
        //     //
        //     //     element.name.split(' ').forEach((word,indice)=>{
        //     //         const span=document.createElement('span');
        //     //         span.textContent=word;
        //     //         span.style.fontSize = "16px";
        //     //
        //     //         spanName.appendChild(span);
        //     //     })
        //
        //         // const img=document.createElement("img")
        //         // img.src=element.img[0];
        //         // const price=document.createElement("span");
        //         // price.style.fontWeight="500";
        //         // price.style.fontSize="16px";
        //         // price.textContent="S/."+element.price;
        //
        //         fragmentLi.appendChild(img);
        //         div.appendChild(spanBrand)
        //         div.appendChild(spanName)
        //
        //         const width= window.innerWidth;
        //         if(width<=480) {
        //             fragmentLi.appendChild(img);
        //             div.appendChild(spanBrand);
        //             div.appendChild(spanName);
        //             div.appendChild(price)
        //             fragmentLi.appendChild(div);
        //             li.appendChild(fragmentLi);
        //             fragmentUL.appendChild(li);
        //
        //
        //         }else{
        //             fragmentLi.appendChild(img);
        //             div.appendChild(spanBrand);
        //             div.appendChild(spanName);
        //             fragmentLi.appendChild(div);
        //             fragmentLi.appendChild(price)
        //             li.appendChild(fragmentLi)
        //             fragmentUL.appendChild(li);
        //         }
        //
        // }else{
        //     console.log('creo que el nodo no fue restituido correctamente')
        // }
        // $ul.appendChild(fragmentUL)
    }
}
function pintarTexto(textoIngresado){

    const textoFiltrado=textoIngresado.split(' ');


    const $ul=document.querySelector('.searchAndOptions');
    const $liAll=$ul.querySelectorAll('li');

    const arrayText=[];

    $liAll.forEach((node,indice)=>{

        // arrayText.push(node.querySelector('span:nth-of-type').textContent);
        const spanOne=node.querySelector('div>span:nth-of-type(1)');
        // let txtOne=spanOne.textContent;
        const spanTwo=node.querySelectorAll('div>span:nth-of-type(2)>span');
        // let txtTwo=spanTwo.textContent;

        spanTwo.forEach(span=>{
            span.style.color="";
        })

        textoFiltrado.forEach(word=>{
            spanTwo.forEach(span=>{
                if(span.textContent===word) {
                    span.style.color="cornflowerblue";
                    // span.style.fontWeight="bold";
                }
            })
        })
    })


}


function limpiarTexto(texto){

    const onlyText=texto.replace(/\d+\.+/g,"").trim();
    return onlyText;
}

function createContainerSearchProducts() {
    const $template = document.getElementById('optionsBusqueda').content;
    const fragment=document.createDocumentFragment();
    const clone=document.importNode($template,true)

    fragment.appendChild(clone);

    const $html=document.querySelector('html');
    $html.appendChild(fragment);

    const $searchAndOptions=document.querySelector('.searchAndOptions');
    const $busquedaInteractiva=document.querySelector('.busquedaInteractiva');
    const $body=document.querySelector('body')

    $busquedaInteractiva.appendChild($searchAndOptions);

    let isFocus=false;


    document.addEventListener('click',e=>{


        if(!e.target.closest('.busquedaInteractiva')&&isFocus){

            if(isFocus){
                $body.classList.remove('activeBody');
                $busquedaInteractiva.classList.remove('activeBusqueda')
                isFocus=false;
            }

        }

        if(e.target.matches("#iconsNav>li:nth-child(1)>svg")||e.target.matches('#iconsNav>li:nth-child(1)')){

                if(!isFocus) {

                    if ($busquedaInteractiva && $body) {
                        $body.classList.toggle('activeBody')
                        $busquedaInteractiva.classList.toggle('activeBusqueda')
                        isFocus = true;

                    }
                }
        }
    })
}
// Llamar a la función
createContainerSearchProducts();

function eventoExitSearch(){

    document.addEventListener('click',e=>{

        if(e.target.closest('.iconsBusqueda>svg:nth-of-type(2)')){

            const $body=document.querySelector('body');
            const $busquedaInteractiva=document.querySelector('.busquedaInteractiva');

            if($body&&$busquedaInteractiva){
                $body.classList.remove('activeBody')
                $busquedaInteractiva.classList.remove('activeBusqueda')
            }
        }
    })

}
eventoExitSearch()

/*----------SearchProducts------------*/


const $input_search = document.querySelector('input[type="search"]');
const $iconsBusqueda = document.querySelector('.iconsBusqueda');

$iconsBusqueda.addEventListener('click', () => {
    $input_search.focus();
});



async function searchProducts() {

    const baseDatos = await extraerDatos();

    const $input_search = document.querySelector('input[type="search"]');
    const ul_search = document.createElement('ul');
    const $searchAndOptions = document.querySelector('.searchAndOptions');

    ul_search.style.opacity = "1";

    if($searchAndOptions){

        $searchAndOptions.appendChild(ul_search);

    }
    const oraciones = baseDatos.map(cadena => {
        return [
            cadena.brand.toLowerCase(),
            cadena.name.toLowerCase(),
        ].join(' ');
    });

    // console.log(oraciones)

    let arrayExistente = [];
    let aux = [];

    $input_search.addEventListener('input', async e => {

        if (e.target.tagName === "INPUT" && e.target.type === "search") {

            const $ul = $searchAndOptions.querySelector('ul');

            // if(e.target.value.length > 3){

                const textoIngresado = e.target.value.toLowerCase().trim();
                // let arrayExistente = [];
                let active=true;

                // $ul.innerHTML = "";

                // pintarTexto(textoIngresado);

                // if (!textoIngresado) {
                //     const li = document.createElement('li');
                //     while($ul.firstChild) $ul.removeChild($ul.firstChild);
                //     li.textContent = 'Ingrese texto para buscar';
                //     li.style.padding = "10px"
                //     li.style.transition="all 0.25s ease-in-out";
                //     $ul.appendChild(li);
                //
                //     setTimeout(()=>{
                //         li.style.opacity="0";
                //     },100)
                //     setTimeout(()=>{
                //         li.remove();
                //         active=!active;
                //     },350)
                //     return;
                // }
                const textoArray = textoIngresado.split(/\s+/); // Manejar múltiples espacios
                const arrayFiltrado = oraciones.filter(cadena =>
                    textoArray.every(word => cadena.includes(word))
                );

                const $liExistente = $ul.querySelectorAll('li')

                if(textoIngresado === ""){
                    $ul.textContent = "";
                    arrayExistente = [];
                    aux = [];
                } else {
                    $ul.textContent = "";

                    // setTimeout(async () => {
                        if ($ul.children.length > 0) {
                            // const allDiv = $ul.querySelectorAll('li>div');
                            // if (allDiv.length > 0) {
                            //
                            //     const prevProducts = $ul.querySelectorAll('li > div')
                            //
                            //     prevProducts.forEach(el => {
                            //         const arrayText = []
                            //         Array.from(el.children).forEach(node => {
                            //             if (node.children.length === 0) {
                            //                 arrayText.push(node.textContent.split(' '))
                            //             } else {
                            //                 Array.from(node.children).forEach(word => {
                            //                     arrayText.push(word.textContent.split(' '));
                            //                 })
                            //             }
                            //         })
                            //         arrayExistente.push(arrayText.flat().join(' '))
                            //     })
                            //     // console.log(arrayExistente)
                            //
                            //     const listaFiltrada = await addPriceAndImg(arrayFiltrado, textoIngresado);
                            //
                            //     const allDiv = listaFiltrada.querySelectorAll('li > div');
                            //     allDiv.forEach(el => {
                            //         const arrayTextTwo = [];
                            //         Array.from(el.children).forEach(node => {
                            //
                            //             if (node.children.length === 0) {
                            //                 arrayTextTwo.push(node.textContent.split(' '));
                            //             } else {
                            //                 Array.from(node.children).forEach(word => {
                            //                     arrayTextTwo.push(word.textContent.split(' '));
                            //                 })
                            //             }
                            //         })
                            //         aux.push(arrayTextTwo.flat().join(' '))
                            //     })
                            //
                            //     console.log('los elementos previos -> ', arrayExistente)
                            //     console.log('los elementos nuevos -> ', aux);
                            //
                            //     const indiceCoincidencias = [];
                            //
                            //     arrayExistente.forEach((producto, indice) => {
                            //
                            //         aux.forEach((productoTwo, index) => {
                            //             if (producto !== productoTwo) {
                            //                 // $ul.children[indice].remove();
                            //             } else {
                            //                 console.log('encontramos coincidencia : ', producto, "-", productoTwo)
                            //                 indiceCoincidencias.push(indice);
                            //             }
                            //
                            //         })
                            //     })
                            //
                            //     Array.from(prevProducts).forEach((el, indice) => {
                            //         if (!indiceCoincidencias.includes(indice)) {
                            //             el.parentElement.remove(); // O $ul.children[indice].remove();
                            //         }
                            //     });
                            // }
                        } else {
                            const listaMostrada = await addPriceAndImg(arrayFiltrado, textoIngresado);
                            $ul.classList.add('show-animation-busqueda');
                            $ul.appendChild(listaMostrada)
                            setTimeout(()=>{$ul.classList.remove('show-animation-busqueda')},250)
                            console.log('gaaaaaaaaaaaaaaaaaa')
                        }
                    // },200)

                }

                // if($liExistente.length > 0 ) {

                    // console.log('ya hay elementos aqui')



                // }else{

                // }
                //
                // arrayFiltrado.forEach((oracion,indice) => {
                //
                //     addPriceAndImg(oracion, textoIngresado);
                //
                //
                // })

                // if ($liExistente.length > 0) {
                //     // if (arrayFiltrado.length < $liExistente.length) {
                //     //
                //     //     $liExistente.forEach((li, indice) => {
                //     //         // const preTxt=$liExistente[indice].querySelector('span:nth-of-type(1)');
                //     //         const span = li.querySelector('span:nth-of-type(1)');
                //     //
                //     //         if (arrayFiltrado[indice] !== span.textContent) li.remove();
                //     //
                //     //         console.log('si funciona')
                //     //     })
                //     // }
                //     if (arrayFiltrado.length > $liExistente.length) {
                //
                //         arrayFiltrado.forEach((text, indice) => {
                //
                //             if ($liExistente[indice]) {
                //                 const span = $liExistente[indice].querySelector('span:nth-of-type(1)');
                //             } else {
                //                 addPriceAndImg(text,textoIngresado);
                //                 arrayExistente.push(text);
                //             }
                //         })
                //         // if($liExistente.length>0) apiladoInfoProductSmall()
                //     }
                //
                // } else {
                //     arrayFiltrado.forEach(filtrado => {
                //
                //         addPriceAndImg(filtrado,textoIngresado)
                //         arrayExistente.push(filtrado);
                //
                //         const $liExistente = $ul.querySelectorAll('li')
                //
                //         // if($liExistente.length>0) apiladoInfoProductSmall()
                //     })
                //
                // }

            // }else{
            //     console.log('aun no ha ingresado mas de 3 letras');
            // }

        }
    });


    document.addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.target.tagName === "INPUT" && e.target.type === "search") {
            const textoIngresado = e.target.value.trim();

            if (textoIngresado) {
                window.location.href = `/${encodeURIComponent(textoIngresado)}`;
            }
        }
    });

    document.addEventListener('click', e => {
        const searchContainer = document.querySelector('.searchAndOptions');

        if (e.target.matches('input[type="search"]')) {
            return;
        }

        // Si el clic ocurrió fuera del contenedor, limpiar la lista
        if(searchContainer){
            if (!searchContainer.contains(e.target)) {
                const $ul = document.querySelector('.searchAndOptions > ul');
                if ($ul) {
                    $ul.innerHTML = ""; // Limpia el contenido de la lista
                }
                return; // Terminar aquí para evitar procesar más lógica
            }

        }

        if(e.target.closest('.searchAndOptions>ul>li')){
            const li=e.target.closest('.searchAndOptions>ul>li');

            const firtSpan=li.querySelector('div>span:nth-of-type(1)');
            const brand=firtSpan.textContent;
            const category = li.querySelector('img').dataset.category

            const allSpan=li.querySelectorAll('div>span:nth-of-type(2)>span');
            let name=[];
            allSpan.forEach(span=>{
                name.push(span.textContent);
            })
            window.location.href=`/${brand}/${category}/${name.join(' ')}`
        }
    });


}

searchProducts();

export async function datosCarrito(){
    const url="/carrito/estado/cuack/cuack";
    const options={
        method: 'GET',
        headers: {"Content-Type":"application/json"},
    }
    try{
        const response=await fetch(url,options);
        if(!response.ok){
            throw new Error(`hubo un error en la peticion ${response.statusText}`);
        }
        const result= await response.json();

        return result.carrito
    }catch(err){
        console.error('Error al extraer info del carrito: ',err);
        return [];
    }

}

/*-----------------Interfaz de carrito en todas las paginas---------------------*/

export async function carritoDesplegado() {
    const $iconCarrito = document.querySelector('#carrito');
    const $carritoBoxTemplate = document.getElementById('carritoBox').content;
    const fragment = document.createDocumentFragment();
    const clone = document.importNode($carritoBoxTemplate, true);

    // Añade el clon al fragment y luego al contenedor
    fragment.appendChild(clone);
    $iconCarrito.parentElement.appendChild(fragment);


    const $cajitaCompras = document.querySelector('.cajitaCompras');
    $cajitaCompras.style.pointerEvents = 'none';

    let isInside = false;

    function showCajita() {
        $cajitaCompras.style.opacity = "1";
        $cajitaCompras.style.pointerEvents="auto";

        const $nombreElement=document.querySelectorAll('.nombreElement');
        $nombreElement.forEach(b=>{
            b.style.pointerEvents="none";
        })
    }
    function hideCajita() {
        if (!isInside) {
            $cajitaCompras.style.opacity = "0";
            $cajitaCompras.style.pointerEvents="none";

            const $nombreElement=document.querySelectorAll('.nombreElement');
            $nombreElement.forEach(b=>{

                b.style.pointerEvents="auto";

            })

        }
    }

   async function mostrarCompras(){
        const nuevosDatos=await datosCarrito()

        if(nuevosDatos.length>0){
            console.log('aqui estan los nuevos datos',nuevosDatos);

            const $cajitaCompras=document.querySelector('.cajitaCompras');
            $cajitaCompras.classList.remove('sinCompras');
            $cajitaCompras.style.pointerEvents="auto";
            $cajitaCompras.innerHTML=`
                            <div class="containerBox">                       
                            </div>
                            <div style="font-weight: bold">
                                <span >Total: </span>
                                <span class="cuentaTotal">S/0.00<span>
                            </div>
                            <button style="padding: 7.5px; border-radius: 7.5px;
                             transition: all 0.25s ease-in-out;"> ir al carrito</button>                          
                       `
            const $containerBox=document.querySelector('.containerBox');

            // redireccionamiento ir al carrito
            const botonCarrito=document.querySelector('.cajitaCompras>button')

            if(botonCarrito){

                botonCarrito.addEventListener('mouseenter',e=>{
                    botonCarrito.style.background = "rgb(251,254,255);";
                    botonCarrito.style.background = "radial-gradient(circle, rgba(251,254,255,0.9164040616246498) 23%, rgba(150,211,249,0.8883928571428571) 68%, rgba(79,178,244,0.6138830532212884) 92%)";
                    botonCarrito.style.transition="all 0.25s ease-in-out";
                })
                botonCarrito.addEventListener('mouseleave',e=>{
                    botonCarrito.style.background=""
                })
            }
            nuevosDatos.forEach((product, index) => {

                if($containerBox) {

                    const $section = document.createElement('section');
                    $section.classList.add(
                        `productCarrito`,
                        `productCarrito_${index + 1}`,
                    );
                    $section.dataset.price = `${product.id}`;
                    $section.innerHTML = `                 
                       <div>
                           <b>${product.brand}</b>
                           <span>${product.name}</span>
                           <span>S/.${product.price}</span>
                           <span class="countProduct">7</span>
                       </div>
                       <img src="${product.img}" class="product-image">
               `;
                    $containerBox.appendChild($section);

                }
            });

            if($containerBox){
                flatListProducts();
            }else{
                console.log('ups se creo muy rapido los elementos')
            }

            isInside = true;
            showCajita();
        }else{
            const $cajitaCompras=document.querySelector('.cajitaCompras');
            $cajitaCompras.innerHTML="0"
            $cajitaCompras.classList.add('sinCompras');


            isInside = true;
            showCajita();
        }
   }

    $iconCarrito.addEventListener('mouseenter', mostrarCompras);

    $iconCarrito.addEventListener('mouseleave', () => {
        isInside = false;

            setTimeout(hideCajita, 200);
    });

    $cajitaCompras.addEventListener('mouseenter', () => {
        isInside = true;
    });
    $cajitaCompras.addEventListener('mouseleave',()=>{
        isInside=false;
        setTimeout(hideCajita,200);
    })

    document.addEventListener('click',e=>{
        if(e.target.matches(".containerBox~button")){
            window.location.href="/compra/compra/compra/compra";
        }
    })
}

carritoDesplegado();


export function flatListProducts() {
    const cajitaCompras = document.querySelector('.cajitaCompras');
    const containerBox = document.querySelector('.containerBox');
    const allProductCarrito = document.querySelectorAll('.productCarrito');

    const mapProducts = new Map();

    allProductCarrito.forEach(product => {
        if (mapProducts.has(product.dataset.price)) {
            mapProducts.get(product.dataset.price).push(product);
        } else {
            mapProducts.set(product.dataset.price, [product]);
        }
    });

    console.log(mapProducts);

    let total=0;

    mapProducts.forEach((products, price) => {
        products.forEach((element, index) => {
            if (index === 0) {
                element.style.opacity = "1";
            } else {
                element.style.display = "none";
            }

            const elementPrice=element.querySelector('div>span:nth-of-type(2)')

            if(elementPrice){
                total+=parseInt(elementPrice.textContent.replace(/\D/g,''));
                console.log(total);
            }
            // console.log(element);
            // console.log(elementPrice.textContent.replace(/\D/g,''));

            const contador = element.querySelector('.countProduct');
            if (contador) {
                contador.textContent = `${products.length}`;
            }
        });
    });

    const mostrador=document.querySelector('.cuentaTotal')

    if(mostrador) mostrador.textContent=total;

}

/*---------------------menu<@media 640px---------------------------*/

function createTemplateMenuSmall(){

    const $template=document.getElementById('menuSmallWindow').content;
    const fragment=document.createDocumentFragment();
    const clone=document.importNode($template,true);

    fragment.appendChild(clone);

    const $html=document.querySelector('html');

    $html.appendChild(fragment);



    document.addEventListener('click',e=>{
//listaSmall>dov>svg

        const svgElement=e.target.closest('.listaMarcaIcon svg')


        if(svgElement){

            const listaCercana=e.target.closest('.listaMarcaIcon').nextElementSibling;

            console.log(listaCercana);

            if(listaCercana){
                const propiedadOpacityActive=getComputedStyle(listaCercana).opacity
                if(propiedadOpacityActive==="1"){
                    listaCercana.style.opacity="0";
                    listaCercana.style.height="0";
                    listaCercana.style.display="none";
                    // listaCercana.style.padding="";
                }else{
                    listaCercana.style.opacity="1";
                    listaCercana.style.height="100%";
                    listaCercana.style.display="block";

                }
            }

        }
    })

}

createTemplateMenuSmall()

function menuMediaVerySmall() {
    const $menu = document.querySelector('.menu');

    const $containerMenuSmallWindow=document.querySelector('.containerMenuSmallWindow');

    let isActive=false;



    /*-------Salir del menu small con closest----------------------------------*/
    document.addEventListener('click',e=>{

        if(!e.target.closest(".containerMenuSmallWindow")){

            const $body=document.querySelector('body');
            const opacityActive=getComputedStyle($containerMenuSmallWindow).opacity;
            const $menu=document.querySelector('.menu');

            const pointerEventsMenu=getComputedStyle($menu).pointerEvents;


            if(isActive&&pointerEventsMenu==="none"){
                    if(opacityActive==="1") {
                        $containerMenuSmallWindow.style.opacity = "0";
                        $containerMenuSmallWindow.style.pointerEvents = "none";
                        $body.style.filter = "";
                        $containerMenuSmallWindow.style.left="-300px";
                        $menu.style.pointerEvents="auto";
                    }
                isActive=false;
            }
        }
    })

    /*------Salir del menu small---------------*/
    document.addEventListener('click',e=>{

        if(e.target.closest('.titleAndExit>svg:nth-of-type(1)')){

            const $body=document.querySelector('body');
            const opacityActive=getComputedStyle($containerMenuSmallWindow).opacity;
            const $menu=document.querySelector('.menu')


            if(opacityActive==="1") {
                $containerMenuSmallWindow.style.opacity = "0";
                $containerMenuSmallWindow.style.pointerEvents = "none";
                $body.style.filter = "";
                $containerMenuSmallWindow.style.left="-300px"

            }
            console.log(e.target,"<- el icono si fue presionado")

            isActive=false;
        }

    })


    /*----Eventos activar menu small ENGINE------*/
    document.addEventListener('click', e => {

        if (e.target.closest('#iconsNav>li:nth-child(3)>svg')) {


                const opacityActive=getComputedStyle($containerMenuSmallWindow).opacity;
                const $body=document.querySelector('body');


                if(isActive) {
                    if (opacityActive === "1") {
                        $containerMenuSmallWindow.style.opacity = "0";
                        $body.style.filter = "";
                        $containerMenuSmallWindow.style.left="-300px";
                        // $body.style.pointerEvents="auto";


                        $containerMenuSmallWindow.style.pointerEvents = "none";
                        $menu.style.pointerEvents = "auto";
                        isActive = false;
                    }
                } else{
                    if(!isActive){
                        $containerMenuSmallWindow.style.opacity="1";
                        $containerMenuSmallWindow.style.pointerEvents="auto";
                        $containerMenuSmallWindow.style.left="0";
                        $body.style.filter="blur(5px)"
                        // $body.style.pointerEvents="none";
                        $menu.style.pointerEvents="none";

                        const $menu_events=getComputedStyle($menu).pointerEvents;
                        setTimeout(()=>{

                            if($menu_events==="none"){
                                isActive=true;
                            }
                        },300)
                    }
                }
            }else{
                const $icon=document.querySelector('#iconsNav>li:nth-of-type(3)>svg')
                const pointerState=getComputedStyle($icon).pointerEvents
                if(pointerState){

                }

        }

    });

}

menuMediaVerySmall();

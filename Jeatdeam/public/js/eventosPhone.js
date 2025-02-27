import { opacityBrand, cascadaBrand } from "./cascadaText.js";
import { datosCarrito } from "./main.mjs";

export function eventsPhone() {
  const allMarca = document.querySelectorAll(".marca");

  if (allMarca.length > 0) {
    allMarca.forEach((marca) => {
      marca.addEventListener("touchstart", (e) => {
        console.log("touchstart detectado");
        cascadaBrand(e.target);
      });
      marca.addEventListener("touchend", (e) => {
        console.log("touchend detectado");
        opacityBrand(e.target);
      });
    });
  }

  mostrarCarritoCompras();
}

export function mostrarCarritoCompras() {
  const bagShopping = document.querySelector("#iconsNav>li:nth-of-type(2)");

  let activeCajita = false;

  async function manejarTouchStart(e) {
    e.stopPropagation();
    const cajitaCompras = document.querySelector(".cajitaCompras");

    const datosProducts = await datosCarrito();

    if (datosProducts.length > 0) {
      console.log(datosProducts);
      cajitaCompras.classList.remove("sinCompras");
      cajitaCompras.classList.add("cajitaCompras");
      cajitaCompras.innerHTML = `
                            <div class="containerBox">                       
                            </div>
                            <div style="font-weight: bold">
                                <span></span>
                                <span><span>
                            </div>
                            <button style="padding: 7.5px; border-radius: 7.5px;"> ir al carrito</button>                          
                       `;
      const $containerBox = document.querySelector(".containerBox");

      datosProducts.forEach((product, index) => {
        if ($containerBox) {
          const $section = document.createElement("section");

          $section.innerHTML = `
                           <section class="productCarrito productCarrito_${index + 1}">
                               <div>
                                   <span><b>${product.brand}</b> ${product.name}</span>
                                   <span>S/.${product.price}</span>
                               </div>
                               <img src="${product.img}" class="product-image">
                           </section>
                         `;
          $containerBox.appendChild($section);
        }
      });

      // const productCarritoAll = document.querySelectorAll(".productCarrito");
      //
      // if (productCarritoAll.length > 0) {
      //   productCarritoAll.forEach((product) => {
      //     product.addEventListener("touchstart", (e) => {
      //       e.stopPropagation();
      //       console.log("ingresamos en el evento touchstart product");
      //       product.style.border = "5px solid black";
      //       product.style.transition = "all 0.25s ease-in-out";
      //       // activeCajita = true;
      //     });
      //     product.addEventListener("touchend", (e) => {
      //       e.stopPropagation();
      //       console.log("salimos del evento touchend product");
      //       product.style.border = "";
      //     });
      //   });
      // }

      cajitaCompras.style.opacity = "1";
      cajitaCompras.style.pointerEvents = "auto";
      console.log("antes de invertir el valor: ", activeCajita);
      activeCajita = !activeCajita;
      console.log("despues de invertir el valor: ", activeCajita);

      cajitaCompras.addEventListener("touchstart", (e) => {
        e.stopPropagation();
        activeCajita = false;
        console.log("entramos en el touchstart->", activeCajita);
        cajitaCompras.style.opacity = "1";
        cajitaCompras.style.pointerEvents = "auto";
      });
      cajitaCompras.addEventListener("touchend", (e) => {
        e.stopPropagation();

        setTimeout(() => {
          if (!activeCajita) {
            cajitaCompras.style.opacity = "0";
            cajitaCompras.style.pointerEvents = "none";
            activeCajita = true;
            console.log("entramos en el touchend->", activeCajita);
          }
        }, 500);
      });
    } else {
      cajitaCompras.style.opacity = "1";
      cajitaCompras.classList.add("sinCompras");
      cajitaCompras.innerHTML = datosProducts.length.toString();
      activeCajita = true;
    }
  }
  async function manejarTouchEnd(e) {
    e.stopPropagation();
    const cajitaCompras = document.querySelector(".cajitaCompras");
    console.log(activeCajita, "<-valor bagend");
    setTimeout(() => {
      if (activeCajita) {
        cajitaCompras.style.opacity = "0";
        cajitaCompras.style.pointerEvents = "none";
        activeCajita = false;
      }
    }, 500);
  }

  bagShopping.addEventListener("touchstart", manejarTouchStart);

  bagShopping.addEventListener("touchend", manejarTouchEnd);

  // bagShopping.addEventListener("touchend", manejarTouchEnd);
}

//  export async function carritoDesplegadoPhone() {
//   const $iconCarrito = document.querySelector('#carrito');
//   const $carritoBoxTemplate = document.getElementById('carritoBox').content;
//   const fragment = document.createDocumentFragment();
//   const clone = document.importNode($carritoBoxTemplate, true);
//
//   // Añade el clon al fragment y luego al contenedor
//   fragment.appendChild(clone);
//   $iconCarrito.parentElement.appendChild(fragment);
//
//
//   const $cajitaCompras = document.querySelector('.cajitaCompras');
//   $cajitaCompras.style.pointerEvents = 'none';
//
//   let isInside = false;
//
//   function showCajita() {
//     $cajitaCompras.style.opacity = "1";
//     $cajitaCompras.style.pointerEvents="auto";
//
//     const $nombreElement=document.querySelectorAll('.nombreElement');
//     $nombreElement.forEach(b=>{
//
//       b.style.pointerEvents="none";
//
//     })
//
//   }
//
//   function hideCajita() {
//     if (!isInside) {
//       $cajitaCompras.style.opacity = "0";
//       $cajitaCompras.style.pointerEvents="none";
//
//       const $nombreElement=document.querySelectorAll('.nombreElement');
//       $nombreElement.forEach(b=>{
//
//         b.style.pointerEvents="auto";
//
//       })
//
//     }
//   }
//
//   $iconCarrito.addEventListener('touchstart', async () => {
//
//     const nuevosDatos=await datosCarrito()
//
//     if(nuevosDatos.length>0){
//       console.log('aqui estan los nuevos datos',nuevosDatos);
//
//       const $cajitaCompras=document.querySelector('.cajitaCompras');
//       $cajitaCompras.classList.remove('sinCompras');
//       $cajitaCompras.style.pointerEvents="auto";
//       $cajitaCompras.innerHTML=`
//                             <div class="containerBox">
//                             </div>
//                             <div style="font-weight: bold">
//                                 <span>Total: </span>
//                                 <span >S/.11234<span>
//                             </div>
//                             <button style="padding: 7.5px; border-radius: 7.5px;"> ir al carrito</button>
//                        `
//       const $containerBox=document.querySelector('.containerBox');
//
//
//       nuevosDatos.forEach((product, index) => {
//
//         if($containerBox) {
//
//           const $section = document.createElement('section');
//
//           $section.innerHTML = `
//                    <section class="productCarrito productCarrito_${index}">
//                        <div>
//                            <span><b>${product.brand}</b> ${product.name}</span>
//                            <span>S/.${product.price}</span>
//                        </div>
//                        <img src="${product.img}" class="product-image">
//                    </section>
//                `;
//           $containerBox.appendChild($section);
//         }
//       });
//       isInside = true;
//       showCajita();
//     }else{
//       const $cajitaCompras=document.querySelector('.cajitaCompras');
//       $cajitaCompras.innerHTML="0"
//       $cajitaCompras.classList.add('sinCompras');
//
//
//       isInside = true;
//       showCajita();
//     }
//
//   });
//
//   // Mantener la caja visible si el mouse está dentro de ella
//   $cajitaCompras.addEventListener('touchstart', () => {
//     isInside = true;
//   });
//
//   // Ocultar la caja si el mouse sale de ella
//   $cajitaCompras.addEventListener('touchend', () => {
//     isInside = false;
//     setTimeout(hideCajita, 100); // Verifica si el mouse no regresa al ícono
//   });
//   document.addEventListener('click',e=>{
//     if(e.target.matches(".containerBox~button")){
//       window.location.href="/compra/compra/compra/compra";
//     }
//   })
// }

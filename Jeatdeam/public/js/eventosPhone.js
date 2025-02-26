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

  const bagShopping = document.querySelector("#iconsNav>li:nth-of-type(2)");

  bagShopping.addEventListener("touchstart", (e) => {});

  bagShopping.addEventListener("touchend", (e) => {});
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

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
  let activeSecondCajita = false;

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

      cajitaCompras.style.opacity = "1";
      cajitaCompras.style.pointerEvents = "auto";
      console.log("antes de invertir el valor: ", activeCajita);
      activeCajita = !activeCajita;
      console.log("despues de invertir el valor: ", activeCajita);

      cajitaCompras.addEventListener("touchstart", (e) => {
        e.stopPropagation();
        activeCajita = false;
        activeSecondCajita = true;
        console.log("entramos en el touchstart cajitaCompras->", activeCajita);
        cajitaCompras.style.opacity = "1";
        cajitaCompras.style.pointerEvents = "auto";
      });
      cajitaCompras.addEventListener("touchend", (e) => {
        e.stopPropagation();
        activeSecondCajita = false;
        setTimeout(() => {
          if (!activeSecondCajita) {
            if (!activeCajita) {
              cajitaCompras.style.opacity = "0";
              cajitaCompras.style.pointerEvents = "none";
              activeCajita = true;
              console.log(
                "entramos en el touchend cajitaCompras->",
                activeCajita,
              );
            }
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
}

// export function mostrarCarritoCompras() {
//   const bagShopping = document.querySelector("#iconsNav>li:nth-of-type(2)");
//   const cajitaCompras = document.querySelector(".cajitaCompras");
//
//   let isCartOpen = false;
//   let isTouchingCart = false;
//
//   function toggleCartDisplay(show) {
//     cajitaCompras.style.opacity = show ? "1" : "0";
//     cajitaCompras.style.pointerEvents = show ? "auto" : "none";
//   }
//
//   async function manejarTouchStart(e) {
//     e.stopPropagation();
//     const datosProducts = await datosCarrito();
//
//     if (datosProducts.length > 0) {
//       renderCarrito(datosProducts);
//       isCartOpen = true;
//     } else {
//       cajitaCompras.innerHTML = "Carrito vacío";
//       cajitaCompras.classList.add("sinCompras");
//       isCartOpen = true;
//     }
//
//     toggleCartDisplay(true);
//   }
//
//   function manejarTouchEnd(e) {
//     e.stopPropagation();
//     setTimeout(() => {
//       if (!isTouchingCart) {
//         isCartOpen = false;
//         toggleCartDisplay(false);
//       }
//     }, 500);
//   }
//
//   function renderCarrito(productos) {
//     cajitaCompras.innerHTML = `
//       <div class="containerBox"></div>
//       <div style="font-weight: bold">
//         <span></span>
//         <span></span>
//       </div>
//       <button style="padding: 7.5px; border-radius: 7.5px;">Ir al carrito</button>
//     `;
//
//     const containerBox = cajitaCompras.querySelector(".containerBox");
//
//     productos.forEach((product, index) => {
//       const section = document.createElement("section");
//       section.classList.add("productCarrito", `productCarrito_${index + 1}`);
//       section.innerHTML = `
//         <div>
//           <span><b>${product.brand}</b> ${product.name}</span>
//           <span>S/.${product.price}</span>
//         </div>
//         <img src="${product.img}" class="product-image">
//       `;
//       containerBox.appendChild(section);
//     });
//
//     cajitaCompras.addEventListener("touchstart", (e) => {
//       e.stopPropagation();
//       isCartOpen = false;
//       isTouchingCart = true;
//       toggleCartDisplay(true);
//     });
//
//     cajitaCompras.addEventListener("touchend", (e) => {
//       e.stopPropagation();
//       isTouchingCart = false;
//       setTimeout(() => {
//         if (!isTouchingCart && !isCartOpen) {
//           toggleCartDisplay(false);
//           isCartOpen = true;
//         }
//       }, 500);
//     });
//   }
//
//   bagShopping.addEventListener("touchstart", manejarTouchStart);
//   bagShopping.addEventListener("touchend", manejarTouchEnd);
// }

import { opacityBrand, cascadaBrand } from "./cascadaText.js";
import { datosCarrito } from "./main.mjs";
import { flatListProducts } from "./main.mjs";

flatListProducts();

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

  async function showShopping(e) {
    e.stopPropagation();

    const datosProducts = await datosCarrito();

    const cajitaCompras = document.querySelector(".cajitaCompras");

    if (datosProducts.length > 0) {
      console.log(datosProducts);
      cajitaCompras.classList.remove("sinCompras");
      cajitaCompras.classList.add("cajitaCompras");
      cajitaCompras.innerHTML = `
                            <div class="containerBox">                       
                            </div>
                            <div style="font-weight: bold">
                                <span >Total: </span>
                                <span class="cuentaTotal">S/0.00<span>                              
                            </div>
                            <button style="padding: 7.5px; border-radius: 7.5px; transition: all 0.25s ease-in-out;"> ir al carrito</button>                                            
                       `;

      const botonCarrito = document.querySelector(".cajitaCompras>button");

      if (botonCarrito) {
        botonCarrito.addEventListener("touchstart", (e) => {
          botonCarrito.style.background = "rgb(251,254,255);";
          botonCarrito.style.background =
            "radial-gradient(circle, rgba(251,254,255,0.9164040616246498) 23%, rgba(150,211,249,0.8883928571428571) 68%, rgba(79,178,244,0.6138830532212884) 92%)";
          botonCarrito.style.transition = "all 0.25s ease-in-out";
        });
        botonCarrito.addEventListener("touchend", (e) => {
          botonCarrito.style.background = "";
        });
      }

      const $containerBox = document.querySelector(".containerBox");

      datosProducts.forEach((product, index) => {
        if ($containerBox) {
          const $section = document.createElement("section");

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
                                   <small class="countProduct">10</small>
                               </div>
                               <img src="${product.img}" class="product-image">
                         `;
          $containerBox.appendChild($section);
        }
      });
      cajitaCompras.style.opacity = "1";
      cajitaCompras.style.pointerEvents = "auto";
      activeCajita = true;

      if ($containerBox) flatListProducts();
    } else {
      cajitaCompras.style.opacity = "1";
      cajitaCompras.classList.add("sinCompras");
      cajitaCompras.innerHTML = datosProducts.length.toString();
      activeCajita = true;
    }

    cajitaCompras.addEventListener("touchstart", keepShowShopping);

    cajitaCompras.addEventListener("touchend", stopShowingPurchases);
  }

  function keepShowShopping(e) {
    e.stopPropagation();

    activeCajita = false;
  }

  async function stopShowingPurchases(e) {
    e.stopPropagation();
    const cajitaCompras = document.querySelector(".cajitaCompras");

    activeCajita = !activeCajita;

    setTimeout(() => {
      if (activeCajita) {
        cajitaCompras.style.opacity = "0";
        cajitaCompras.style.pointerEvents = "none";
      }
    }, 750);

    // console.log("el valor de secondCajita es: ", activeSecondCajita);
    // setTimeout(() => {
    //   console.log(
    //     "el valor depues del tiempo de espera es: ",
    //     activeSecondCajita,
    //   );
    //   if (activeSecondCajita) {
    //     cajitaCompras.style.opacity = "0";
    //     cajitaCompras.style.pointerEvents = "none";
    //   }
    // }, 500);
    //
    // setTimeout(() => {
    //   activeSecondCajita = false;
    // }, 500);
  }

  function hideShopping(e) {
    e.stopPropagation();
    const cajitaCompras = document.querySelector(".cajitaCompras");
    // const compras = document.querySelector(".cajitaCompras");
    // activeCajita = !activeCajita;

    setTimeout(() => {
      if (activeCajita) {
        cajitaCompras.style.pointerEvents = "none";
        cajitaCompras.style.opacity = "0";
      }
    }, 750);
  }

  bagShopping.addEventListener("touchstart", showShopping);

  bagShopping.addEventListener("touchend", hideShopping);
}

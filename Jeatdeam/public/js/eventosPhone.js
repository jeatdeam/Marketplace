import { opacityBrand, cascadaBrand } from "./cascadaText.js";

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
}

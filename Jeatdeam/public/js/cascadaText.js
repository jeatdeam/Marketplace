export function marcaEvent() {
  const allElement = document.querySelectorAll(".marca");

  if (allElement.length > 0) {
    allElement.forEach((brand) => {
      brand.addEventListener("mouseenter", (e) => {
        cascadaBrand(e.target);
      });
      brand.addEventListener("mouseleave", (e) => {});
    });
  }

  document.addEventListener("click", () => {});
}

export function cascadaBrand(target) {
  const brand = target.dataset.name;
  const arrayBrand = brand.split("");
  target.textContent = "";

  const contenedorTxt = document.createElement("div");
  contenedorTxt.style.position = "absolute";
  contenedorTxt.style.width = "100%";
  // contenedorTxt.style.opacity = "0";
  // contenedorTxt.style.height = "30px";
  contenedorTxt.style.transform = "translateY(-50%)";

  contenedorTxt.style.top = "50%";

  target.style.position = "relative";
  target.appendChild(contenedorTxt);

  let activeEvent = false;

  arrayBrand.forEach((word, indice) => {
    const span = document.createElement("span");
    span.textContent = word;
    span.style.transition = "all 0.50s linear";
    span.style.display = "inline-block";
    span.style.transform = `translateY(-100%)`;
    span.style.opacity = `0`;

    contenedorTxt.appendChild(span);

    if (indice === arrayBrand.length - 1) activeEvent = !activeEvent;
  });

  if (activeEvent) {
    const allSpan = target.querySelectorAll("span");

    console.log(allSpan);

    allSpan.forEach((span, indice) => {
      setTimeout(() => {
        span.style.transform = "translateY(10px)";
        span.style.opacity = "1";
      }, indice * 50);
    });
  }
}

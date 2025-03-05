export function marcaEvent() {
  const allElement = document.querySelectorAll(".marca");

  if (allElement.length > 0) {
    allElement.forEach((brand) => {
      brand.addEventListener("mouseenter", (e) => {
        cascadaBrand(e.target);
      });
      brand.addEventListener("mouseleave", (e) => {
        opacityBrand(e.target);
      });
    });
  }

  document.addEventListener("click", () => {});
}

export function opacityBrand(target) {
  const allSpan = target.querySelectorAll("div>span");

  let contador = 0;

  allSpan.forEach((span) => {
    const computedOpacity = getComputedStyle(span).opacity;

    if (computedOpacity === "1") contador++;
  });

  if (contador === allSpan.length) {
    for (let i = allSpan.length - 1; i >= 0; i--) {
      setTimeout(
        () => {
          allSpan[i].style.transform = "translateY(50px)";
          allSpan[i].style.opacity = "0";
        },
        25 * (allSpan.length - 1 - i),
      );
    }
  } else {
    // allSpan.forEach((span, index) => {
    //   const computedOpacity = getComputedStyle(span).opacity;
    //
    //   if (computedOpacity === "1") span.style.opacity = "0";
    // });
    setTimeout(
      () => {
        target.textContent = "";
      },
      contador * 75, //agregamos 50 po la transicion de cada span
    );
  }
}
//
// [...allSpan].reverse().forEach((span, index) => {
//   setTimeout(() => {
//     span.style.transform = "translateY(70px)";
//     span.style.opacity = "0";
//   }, 50 * index);
// });

export function cascadaBrand(target) {
  const brand = target.dataset.name;
  const arrayBrand = brand.split("");

  target.style.transition = "all 0.25 ease-in-out";
  target.textContent = "";

  const contenedorTxt = document.createElement("div");

  contenedorTxt.style.position = "absolute";
  contenedorTxt.style.width = "100%";
  contenedorTxt.style.whiteSpace = "nowrap";
  // contenedorTxt.style.overflowY = "hidden";
  contenedorTxt.style.transform = "translateY(-50%)";
  contenedorTxt.style.top = "50%";
  contenedorTxt.style.pointerEvents = "none";

  target.style.position = "relative";
  target.appendChild(contenedorTxt);

  let activeEvent = false;

  arrayBrand.forEach((word, indice) => {
    const span = document.createElement("span");
    span.textContent = word;
    span.style.color = "white";
    span.style.transition = "all 0.25s linear";
    span.style.display = "inline-block";
    span.style.transform = `translateY(-100%)`;
    span.style.opacity = `0`;
    span.style.whiteSpace = "pre";
    span.style.fontWeight = "bold";

    contenedorTxt.appendChild(span);

    if (indice === arrayBrand.length - 1) activeEvent = !activeEvent;
  });

  if (activeEvent) {
    const allSpan = target.querySelectorAll("span");
    allSpan.forEach((span, indice) => {
      setTimeout(() => {
        span.style.transform = "translateY(10px)";
        span.style.opacity = "1";
      }, indice * 25);
      if (indice === allSpan.length - 1)
        setTimeout(
          () => {
            contenedorTxt.style.color = "red";
          },
          indice * 25 + 250,
        );
    });
  }
}

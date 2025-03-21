import { lastIdCompra } from "./main.mjs";

export async function postProduct(e) {
  try {
    const { id, brand, img, price, name } = e.target.dataset;
    let idCompra = await lastIdCompra();

    idCompra = idCompra ? parseInt(idCompra) + 1 : 1;

    const url = "/compra/compra/compra/compra";
    const product = {
      id,
      idCompra,
      brand,
      img,
      price: parseFloat(price),
      name,
    };

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Hubo un error en la petición: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.ok) {
      console.log("Datos enviados correctamente, respuesta ->", result);
    }
  } catch (error) {
    console.error("Error en postProduct:", error);
  }
}

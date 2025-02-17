import {datosCarrito} from '/main.mjs'

export async function masVendidosElement(){
    const $masVend=document.querySelector('.masVendidoElement')

    const datos=await datosCarrito();

    console.log(datos);
}


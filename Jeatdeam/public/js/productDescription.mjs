import {lastIdCompra} from "./main.mjs";
import {postProduct} from "./peticionPost.js";
import {carritoContadorDOM} from "./main.mjs";

export function productInfo () {


    document.addEventListener('click',async e =>{

        if(e.target.matches('.lastMove>button:nth-of-type(1)')){
            await postProduct(e);
            carritoContadorDOM();
        }
        if(e.target.matches('.lastMove>button:nth-of-type(2)')){
            await postProduct(e);
            carritoContadorDOM();
            window.location.href="/compra/compra/compra/compra"
        }

    })



}
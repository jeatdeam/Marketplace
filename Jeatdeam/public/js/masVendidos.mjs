import {datosCarrito} from './main.mjs'
import {lastIdCompra} from './main.mjs'
import {addProduct} from './main.mjs'

export async function masVendidosElement(){

    document.addEventListener('click',async e=>{
        if(e.target.closest('.masVendidoElement>div>button:nth-child(1)')||e.target.closest('.masVendidoElement_two>div>button:nth-child(1)')){
            addProduct(e.target);
        }
        if(e.target.closest('.masVendidoElement>div>button:nth-child(2)')||e.target.closest('.masVendidoElement_two>div>button:nth-child(2)')){
            addProduct(e.target);
        }


    })

}



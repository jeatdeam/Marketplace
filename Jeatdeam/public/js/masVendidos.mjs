import {datosCarrito} from './main.mjs'
import {lastIdCompra} from './main.mjs'
import {addProduct} from './main.mjs'
// import {activeButton} from './main.mjs';

export async function masVendidosElement(){

    document.addEventListener('click',async e=>{
        if(e.target.closest('.masVendidoElement>div>button:nth-child(1)')||e.target.closest('.masVendidoElement_two>div>button:nth-child(1)')){
            addProduct(e.target);
        }
        if(e.target.closest('.masVendidoElement>div>button:nth-child(2)')||e.target.closest('.masVendidoElement_two>div>button:nth-child(2)')){
            addProduct(e.target);
        }
        if(e.target.closest('.masVendidoElement')){

        }

    })

}

let activeButton=true;

export function redirectMasVendidoElement(){

    const $masVendidoElement=document.querySelector('.masVendidoElement');
    const $masVendidoElement_two=document.querySelector('.masVendidoElement_two');
    const $buttonAddCarritoAll=document.querySelectorAll('.masVendidoElement>div>button:nth-child(1)')
    const $buttonComprarAll=document.querySelectorAll('.masVendidoElement>div>button:nth-child(2)')

    $buttonAddCarritoAll.forEach(button=>{
        button.addEventListener('mouseenter',e=>{
            activeButton=!activeButton;
        })
        button.addEventListener('mouseleave',e=>{
            activeButton=true;
        })
    })
    $buttonComprarAll.forEach(button=>{
        button.addEventListener('mouseenter',e=>{
            activeButton=!activeButton;
        })
        button.addEventListener('mouseleave',e=>{
            activeButton=true;
        })
    })
    
    const $buttonAddCarritoAll_two=document.querySelectorAll('.masVendidoElement_two>div>button:nth-child(1)');
    const $buttonComprarAll_two=document.querySelectorAll('.masVendidoElement_two>div>button:nth-child(2)');
 
    $buttonAddCarritoAll_two.forEach(button=>{
      button.addEventListener('mouseenter',e=>{
          activeButton=!activeButton;
      })
      button.addEventListener('mouseleave',e=>{
          activeButton=true;
      })
    })
    $buttonComprarAll_two.forEach(button=>{
        button.addEventListener('mouseenter',e=>{
            activeButton=!activeButton;
        })
        button.addEventListener('mouseleave',e=>{
            activeButton=true;
        })
        
    })

    document.addEventListener('click',e=>{
        if(activeButton){
            if(e.target.closest('.masVendidoElement')){
                    const element = e.target.closest('.masVendidoElement')
                if(element) {
                    const {brand,name}=element.dataset;
                    window.location.href=`/${brand}/${name}`;
                }
            }
            if(e.target.closest('.masVendidoElement_two')){
                const element =e.target.closest('.masVendidoElement_two')
               if(element){
                   const {brand,name}=element.dataset;
                   window.location.href=`/${brand}/${name}`;
               }
            }
        }

    })
}



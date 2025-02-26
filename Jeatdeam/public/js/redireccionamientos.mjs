import {carritoContadorDOM, lastIdCompra} from "./main.mjs";
// import {carritoContadorDOM} from "./main.mjs";

let isActive=false;

export function redirectMarca(){

    document.addEventListener('click',e=>{

        if(e.target.matches('.nombreElement')){
            console.log(e.target);
        }

    })

    const allButtonAdd=document.querySelectorAll('.categoryElement>div>button:nth-of-type(1)');

    allButtonAdd.forEach(button=>{
        button.addEventListener('mouseenter',e=>{
            isActive=true;
        })
        button.addEventListener('mouseleave',e=>{
            isActive=false;
        })

    })

    const allButtonBuy=document.querySelectorAll('.categoryElement>div>button:nth-of-type(2)');

    allButtonBuy.forEach(button=>{
        button.addEventListener('mouseenter',e=>{
            isActive=true;
        })
        button.addEventListener('mouseleave',e=>{
            isActive=false;
        })

    })



    document.addEventListener('click',async e=>{
        const categoryElement=e.target.closest('.categoryElement')
        if(!isActive) {
            if (categoryElement) {
                const {categoria, brand, name} = categoryElement.dataset;
                window.location.href = `/${brand}/${categoria}/${name}`;
            }
        }
        if(e.target.matches('.categoryElement>div>button:nth-of-type(2)')){

            const lastId=await lastIdCompra()

            let idCompra= lastId ? lastId + 1 : 1;

            const {id, brand, img, price, name}=e.target.dataset;
            const product={
                id,
                idCompra: parseInt(idCompra),
                brand,
                img,
                price: parseFloat(price),
                name,
            }
            const options={
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(product)
            }
            const url="/compra/compra/compra/compra"
            const comprarProduct=async ()=>{
                const response=await fetch(url,options)
                if(!response) throw new Error(`hubo un error en la peticion: ${response.statusText}`);
                const result=await response.json();

            }
            comprarProduct();
            carritoContadorDOM();
            window.location.href="/compra/compra/compra/compra";
        }

    })


}
import {extraerHeaders} from './listaProducts.mjs'

export function menuSmallWindowEvents(){

    extraerHeaders().then((seccionProducts)=>{
        console.log(seccionProducts);

        const $listaSmall=document.querySelectorAll('.listaMarcaIcon');

        const keysProducts=Object.keys(seccionProducts);

        keysProducts.forEach((brand,indice)=>{

            if($listaSmall.length-1>indice){
                const title=$listaSmall[indice].querySelector('b');
                title.textContent=brand.toUpperCase();

                const ul=$listaSmall[indice].nextElementSibling;

                Object.keys(seccionProducts[brand]).forEach(categoria=>{

                    const li=document.createElement("li");
                    li.textContent=categoria;
                    ul.appendChild(li);

                })

            }else{
                if($listaSmall.length-1===indice) {
                    const title=$listaSmall[indice].querySelector('b');
                    title.textContent='OTRAS MARCAS';

                    console.log(indice)
                    const ul=$listaSmall[indice].nextElementSibling;
                    console.log(ul)
                    keysProducts.forEach((marca,index)=>{

                        if($listaSmall.length-1+index<keysProducts.length){
                            const li=document.createElement("li");

                            li.textContent=keysProducts[$listaSmall.length-1+index]
                            ul.appendChild(li);
                        }else{
                            return;
                        }

                    })

                }
                console.log(indice);
                return;
            }

        })
    })





    document.addEventListener('click',e=>{

        const titulo=e.target.closest('.listaMarcaIcon>b')

        if(titulo){
            const nombre=titulo.textContent.toLowerCase();

            console.log(nombre.toLowerCase());

            window.location.href=`/${nombre}`

        }

    })

}
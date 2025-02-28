import {extraerHeaders} from './listaProducts.mjs'

export function menuSmallWindowEvents(){

    extraerHeaders().then((seccionProducts)=>{

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

                    const ul=$listaSmall[indice].nextElementSibling;
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
                return;
            }

        })
    })

    // const listaMenuSmall=document.querySelectorAll('.')

    document.addEventListener('touchstart',e=>{
        if(e.target.matches('.listaSmall>ul>li')){
            e.target.style.boxShadow="0 0 5px rgba(0, 0, 0, 0.8)";
        }
    })
    document.addEventListener('touchend',e=>{
        if(e.target.matches('.listaSmall>ul>li')){
            e.target.style.boxShadow="";
        }
    })


    document.addEventListener('click',e=>{

        const titleListSmall=e.target.closest('.listaMarcaIcon>b')

        if(titleListSmall){
            const name=titleListSmall.textContent.toLowerCase();
            console.log(name);
            if(name==="otras marcas"){
                console.log('ups este no es un enlace');
            } else{
                window.location.href=`/${name}`
            }

        }

        if(e.target.matches('.listaSmall>ul>li')){
            console.log(e.target);
            const categoria=e.target.textContent;
            const ul= e.target.parentNode;
            const containerName= ul.previousElementSibling
            const name=containerName.querySelector('b').textContent.toLowerCase();
            if(name==="otras marcas"){
                window.location.href=`/${categoria}`;
            }else{
                window.location.href=`/${name}/${categoria}`;
            }

        }

        const allLi=document.querySelectorAll('.listaSmall>ul>li')

        allLi.forEach((li)=>{
            li.addEventListener('touchstart',e=>{
                li.style.boxShadow="0 0 5px rgba(0,0,0,0.5)";
            })
            li.addEventListener('touchend',e=>{
                li.style.boxShadow="";
            })
        })
    })

}
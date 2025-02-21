
export function menuSmallWindowEvents(){


    document.addEventListener('click',e=>{

        const titulo=e.target.closest('.listaMarcaIcon>b')

        if(titulo){
            const nombre=titulo.textContent.toLowerCase();

            console.log(nombre.toLowerCase());

            window.location.href=`/${nombre}`

        }

    })

}
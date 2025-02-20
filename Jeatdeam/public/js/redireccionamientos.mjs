

export function redirectMarca(){

    document.addEventListener('click',e=>{

        if(e.target.matches('.nombreElement')){
            console.log(e.target);
        }

    })

}
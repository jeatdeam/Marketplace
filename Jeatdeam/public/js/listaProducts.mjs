

export function asignarNombresHeader(){


    extraerHeaders()
        .then(seccionProducts=>{
            const $nombreElement=document.querySelectorAll('.nombreElement')
            const keysMarca=Object.keys(seccionProducts)

            console.log($nombreElement,"<-todo aqui")

            keysMarca.forEach((marca,indice)=> {

                const seccion = $nombreElement[indice];

                if(indice < $nombreElement.length-1){
                    seccion.textContent=marca.toUpperCase();

                    const ul=seccion.nextElementSibling;
                    Object.keys(seccionProducts[marca]).forEach(tipo=>{

                        const li=document.createElement("li");

                        li.textContent=tipo;
                        ul.appendChild(li);

                    })


                }else{
                    if($nombreElement.length-1===indice){
                        seccion.textContent="OTRAS MARCAS";

                        const ul=seccion.nextElementSibling;

                        keysMarca.forEach((brand,index)=>{
                            if($nombreElement.length-1+index>keysMarca.length-1){
                                return;
                            }else{
                                const li=document.createElement("li");

                                li.textContent=keysMarca[$nombreElement.length-1+index]
                                ul.appendChild(li);
                            }
                        })
                    }

                }


            })

        });

}
export function extraerHeaders(){
    const url="/extraer/datos/marcas";
    return fetch(url)
        .then(response=>response.json())
        .then(result=>{
          return result.seccionProducts;
        })
        .catch(err=>{
            console.error(new Error(`ocurrio un error en la peticion->${err.statusText}`));
            throw err;
        })

}
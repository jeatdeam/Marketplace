

export function asignarNombresHeader(){


    extraerHeaders()
        .then(seccionProducts=>console.log(seccionProducts));

}
function extraerHeaders(){
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
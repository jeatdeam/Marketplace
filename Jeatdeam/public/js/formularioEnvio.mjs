


export function envio(){



        function pickStore (active) {

            const $nameUser = document.querySelector('.nameUser')
            const $nameCountry = document.querySelector('.nameCountry')
            const $couriersContainer = document.querySelector('.couriersContainer')

            if(!$nameUser || !$nameCountry || !$couriersContainer) return;

            if(active) {
                $nameUser.style.display = "none";
                $nameCountry.style.display = "none";
                $couriersContainer.style.display = "none";
            } else {
                $nameUser.style.display = "flex";
                $nameCountry.style.display = "flex";
                $couriersContainer.style.display = "flex";
            }


        }
















    document.addEventListener("click", e=>{

        if(e.target.id === "formularioEnvio"){
                const $pasarelaPago = document.querySelector('.pasarelaPago');
            if($pasarelaPago) {

                if($pasarelaPago.classList.contains('active_form')){
                    $pasarelaPago.classList.add('desactive_form');
                    setTimeout(()=> {
                        $pasarelaPago.classList.remove('active_form')
                        $pasarelaPago.classList.remove('desactive_form')
                    },350)
                }else{
                    $pasarelaPago.classList.add('active_form');
                }

                const firtsInput = $pasarelaPago.querySelectorAll('input')

                firtsInput[0].focus();
                firtsInput.forEach(el=>{
                    el.addEventListener('click', ()=>{
                        el.focus();
                    })
                })
            }
        }
        if(e.target.matches('.nameCountry>textarea')){
                e.target.focus();
        }
        if(e.target.matches('.recojoTienda')) {
            e.preventDefault();

            if(e.target.classList.contains('active_pick_store')) {
                e.target.classList.remove('active_pick_store');
                pickStore(false);
            } else {
                e.target.classList.add('active_pick_store')
                pickStore(true);
            }

        }
        if(e.target.matches('form > button')) {
            // e.preventDefault()

        }


    })


}
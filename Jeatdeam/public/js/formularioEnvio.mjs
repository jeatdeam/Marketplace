// import $couriers from "nodemailer/lib/mime-node/index.js";



let isActive = false;

function eventBorderOption () {

    const $yape = document.querySelector('.yape')
    const $plin = document.querySelector('.plin')

    function addEventYape (e) {
        e.target.classList.add('activeBorder');
    }
    function removeEventYape (e) {
        e.target.classList.remove('activeBorder')
    }

    if($yape) {
        $yape.addEventListener('mouseenter', addEventYape)
        $yape.addEventListener('mouseleave', removeEventYape)
    }
    if($plin) {
        $plin.addEventListener('mouseenter', addEventYape)
        $plin.addEventListener('mouseleave', removeEventYape)
    }


}

function optionChased (e) {

    const $options = document.querySelectorAll('.boxYapePlin > div');
    const $button = document.querySelector('.containerYapePlin > button')
    $options.forEach(el=>el.classList.remove('clickOption'))

    e.target.classList.add('clickOption')

    if($button) {
        const name = e.target.dataset.option;
        name === "yape" ? $button.style.backgroundColor = "#6A1B9A" : $button.style.backgroundColor = "#00C6FF"
        $button.textContent = `Generar codigo de ${name}`;
        $button.style.color = "white";
    }

}



export function envio(){


    function insertYapePlin() {

            const $productsAndPay = document.querySelector('.productsAndPay')
            const templateYape = document.getElementById('qrTemplate').content;
            const clone = document.importNode(templateYape,true);

            const sectionYapePlin = $productsAndPay.querySelector('section:nth-of-type(3)')

            if(sectionYapePlin){
                sectionYapePlin.classList.add('templateYapePlin_two')
                setTimeout(()=>sectionYapePlin.remove(), 350);
            } else {
                $productsAndPay.appendChild(clone);
                const newSection = $productsAndPay.querySelector('section:nth-of-type(3)')
                newSection.classList.add('templateYapePlin')
                setTimeout(()=>{
                    newSection.classList.remove('templateYapePlin')
                },350)
            }

            eventBorderOption();

        }



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

        function backgroundImage(){

            const $payCard = document.querySelector('#payCard');
            const $payVirtualWallet = document.querySelector('#payVirtualWallet');


            $payCard.textContent = "";
            $payCard.classList.add('payCardOptions_one');

            setInterval(()=>{
                if($payCard.classList.contains('payCardOptions_one')) {
                    $payCard.classList.remove('payCardOptions_one');
                    $payCard.classList.add('payCardOptions_two');
                } else {
                    $payCard.classList.remove('payCardOptions_two');
                    $payCard.classList.add('payCardOptions_one')
                }

            },2000)

            $payVirtualWallet.textContent = "";
            $payVirtualWallet.classList.add('payVirtualOptions_one');

            setInterval(()=>{
                if($payVirtualWallet.classList.contains('payVirtualOptions_one')){
                    $payVirtualWallet.classList.remove('payVirtualOptions_one');
                    $payVirtualWallet.classList.add('payVirtualOptions_two');
                } else if($payVirtualWallet.classList.contains('payVirtualOptions_two')) {
                    $payVirtualWallet.classList.remove('payVirtualOptions_two');
                    $payVirtualWallet.classList.add('payVirtualOptions_three')
                } else {
                    $payVirtualWallet.classList.remove('payVirtualOptions_three');
                    $payVirtualWallet.classList.add('payVirtualOptions_one');
                }
            },2000)


        }

        function requiredPickStore (active) {

        const $addres = document.querySelector('.nameUser > input')
        const $apartament = document.querySelector('.region > input:nth-of-type(1)');
        const $district = document.querySelector('.region > input:nth-of-type(2)');
        const $textareaCouriers = document.querySelector('.couriersContainer textarea');

        if(active) {
            if($addres){
                $addres.removeAttribute('required');
                $apartament.removeAttribute('required');
                $district.removeAttribute('required');
                $textareaCouriers.removeAttribute('required');
            }
        } else {
                $addres.setAttribute('required',"");
                $apartament.setAttribute('required',"");
                $district.setAttribute('required',"")
        }
    }


    function validarButton ( ) {

        const allButtonColor = document.querySelectorAll('.couriers > button')

        return Array.from(allButtonColor).some( button => button.classList.contains('selectButton') )

    }

    function successfulSend () {
            const $payCard = document.querySelector('#payCard');
            const $payVirtualWallet = document.querySelector('#payVirtualWallet');
            const $formularioEnvio = document.querySelector('#formularioEnvio');
            const $pasarelaPago = document.querySelector('.pasarelaPago');

            $formularioEnvio.style.display = "none";
            $payVirtualWallet.style.display = "block";
            $payCard.style.display = "block";
            $pasarelaPago.classList.add('desactive_form');
            setTimeout(()=>{
                $pasarelaPago.style.display = "none";
                $pasarelaPago.classList.remove('desactive_form')
            }, 350);

    }

    function insertMessage () {

    const $couriers = document.querySelector('.couriers');
    $couriers.style.position = "relative";

    const allInputs = document.querySelectorAll('#myForm input[required]')

    const everyValue = Array.from(allInputs).every(input=> input.value.trim() !=="")

        if(everyValue) {

            if (!$couriers.querySelector('span')) {
                const span = document.createElement('span');
                span.classList.add('spanAdd');
                span.style.border = "1px solid gray";
                span.style.backgroundColor = "red";
                span.style.padding = "5px"
                span.style.borderRadius = "8px";
                span.style.fontSize = "12.5px";
                span.style.position = "absolute";
                span.style.top = "110%";
                span.style.left = "0";
                span.style.display = "block";
                span.style.transition = "all 0.35s ease-in-out";
                span.textContent = "! Debe escoger un courier ¡"
                span.classList.add('message')
                if ($couriers) {
                    $couriers.appendChild(span);
                    setTimeout(()=>span.classList.remove('message'),350)
                } else {
                    console.log('no se pudo insertar')
                }
            } else {
                const spanExistente = $couriers.querySelector('span');
                spanExistente.classList.add('message')
                setTimeout(()=>spanExistente.classList.remove('message'),350)
            }

        }
    }

    function optionsCouriers (courier) {

            const option = courier.dataset.empresa;
            const textarea = courier.closest('.couriersContainer').querySelector('textarea');
            const spanAdd = document.querySelector('.spanAdd');
            if(spanAdd) spanAdd.remove();
            if(textarea) {
                textarea.placeholder = `${option} - sede de la empresa, encargado de recojo, dni, celular, etc.`;
                textarea.value = "";
                textarea.style.display = "block";
                textarea.focus();
                textarea.setAttribute('required',"");
            }

            const allSibling = courier.parentNode.querySelectorAll('button');

            allSibling.forEach( el => {
                el.style.backgroundColor=""
                el.classList.remove('selectButton');
            });

            switch(option) {
                case 'shalom' : {
                    courier.style.backgroundColor = "red";
                    courier.classList.add('selectButton');
                    break;
                }
                case 'olva' : {
                    courier.style.backgroundColor = "yellow";
                    courier.classList.add('selectButton');
                    break;
                }
                case 'dinocourier' : {
                    courier.style.backgroundColor = "lightgreen";
                    courier.classList.add('selectButton');
                    break;
                }
                case 'otros' : {
                    courier.style.backgroundColor = "lightgray";
                    courier.classList.add('selectButton');
                    break;
                }
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
                requiredPickStore(false)
            } else {
                e.target.classList.add('active_pick_store')
                pickStore(true);
                requiredPickStore(true)
            }

        }
        if(e.target.matches('form > button')) {
            const paint = validarButton();
            if(paint) {

                const textarea = document.querySelector('.couriersContainer textarea');

                if(textarea.value.trim() !== ""){
                    e.preventDefault();
                    successfulSend()
                    backgroundImage()
                } else {

                }

            } else {
                e.preventDefault();
                insertMessage();
                successfulSend()
                backgroundImage()
            }

        }
        if(e.target.matches('.couriers > button')){
            optionsCouriers(e.target);
        }
        if(e.target.matches('.couriersContainer > textarea')){
            e.target.focus();
        }
        if(e.target.matches('#payCard')){

            insertYapePlin();
            if(isActive) {
                isActive = false;
            }

        }
        
    })


}

export function yapePlin() {
    let cloneBox = null;

    function chaseOption() {
        const prevSiblingYapePlin = document.querySelector('.textContainer');
        const containerYapePlin = document.querySelector('.boxYapePlin');
        const button = document.querySelector('.containerYapePlin > button');
        const backArrow = document.querySelector('.returnYapePlin')
        const img = document.createElement('img');

        if (containerYapePlin) {
            if (!cloneBox) {
                cloneBox = containerYapePlin.cloneNode(true);
            }
            containerYapePlin.classList.add('templateYapePlin_two');
            setTimeout(() => {
                containerYapePlin.remove()
                backArrow.classList.add('activeElement','templateYapePlin');
                button.textContent = 'Enviar';
                button.style.backgroundColor === "rgb(106, 27, 154)" ? img.src = "https://res.cloudinary.com/dfwtyxxba/image/upload/v1745297417/codigoYape_c0wwou.png" : img.src = "https://res.cloudinary.com/dfwtyxxba/image/upload/v1743736943/Imagen_de_WhatsApp_2025-03-25_a_las_20.33.16_73a6986c_frpub0.jpg"

                prevSiblingYapePlin.insertAdjacentElement('afterend', img)
            } , 350);
        } else if (cloneBox) {
            const imgInsert = document.querySelector('.containerYapePlin > img')
            imgInsert.remove();
            backArrow.classList.add('templateYapePlin_two');
            setTimeout(()=>{
                backArrow.classList.remove('activeElement','templateYapePlin_two','templateYapePlin');
            },350)
            prevSiblingYapePlin.insertAdjacentElement('afterend', cloneBox);
            button.textContent = 'Generar codigo de pago';
            cloneBox.classList.add('templateYapePlin');
            cloneBox = null;
        }

        eventBorderOption();


    }

    function deleteYapePlin(){

        const containerYapePlin = document.querySelector('.containerYapePlin');

        if(containerYapePlin) {
            containerYapePlin.classList.add('templateYapePlin_two');
            setTimeout(()=>{
                containerYapePlin.remove();
            },350)
        }


    }


    document.addEventListener('click', (e) => {
        if (e.target.matches('.containerYapePlin > button')) {
            const button = e.target.closest('button');
            const colorButton = getComputedStyle(button).backgroundColor

            if(colorButton === "rgb(255, 255, 255)"){
                // alert('escoja una opcion');
                insertAlert();
            } else {
                if(!isActive){
                    chaseOption();
                    isActive = true;
                } else {
                    console.log('gaaaaaaaaaaaaaaaaaaa')
                }
            }

        }
        if(e.target.closest('.deleteYapePlin')) {
        deleteYapePlin()
            isActive = false;
        }
        if(e.target.closest('.returnYapePlin')) {
            if(isActive){
                chaseOption();
                isActive = true;
                setTimeout(()=>isActive=false,350)
            }
        }
        if(e.target.closest('.boxYapePlin > div')) {
            // e.target.classList.toggle('clickOption')
            const $smallExistente = document.querySelector('.containerYapePlin > small')
            $smallExistente? $smallExistente.remove() : "";

            if($smallExistente) {
                $smallExistente.classList.add('desactive_form')
                setTimeout(()=>$smallExistente.remove() ,350)
            }
            optionChased(e)
        }

    });
}

function insertAlert(){

    const $smallExistente = document.querySelector('.containerYapePlin > small')

    if($smallExistente) $smallExistente.remove();

    const $boxYapePlin = document.querySelector('.boxYapePlin');
    const small = document.createElement('small');

    small.textContent = "Error! Escoja una billetera virtual"
    small.style.color = "red";
    small.style.fontSize = "15px";
    small.style.display = "block";
    small.classList.add('show-animation-busqueda')

    $boxYapePlin.insertAdjacentElement('afterend', small);

}


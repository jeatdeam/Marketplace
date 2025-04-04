import {carritoContadorDOM} from './main.mjs'
import {postProduct} from './peticionPost.js'

export async function masVendidosElement(){

    document.addEventListener('click',async e=>{
        if(e.target.closest('.masVendidoElement>div>button:nth-child(1)')||e.target.closest('.masVendidoElement_two>div>button:nth-child(1)')){
            await postProduct(e);
            carritoContadorDOM()
        }
        if(e.target.closest('.masVendidoElement>div>button:nth-child(2)')||e.target.closest('.masVendidoElement_two>div>button:nth-child(2)')){
            await postProduct(e);
            carritoContadorDOM()
            window.location.href="/compra/compra/compra/compra"
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
                    const {categoria, brand,name}=element.dataset;
                    window.location.href=`/${brand}/${categoria}/${name}`;
                }
            }
            if(e.target.closest('.masVendidoElement_two')){
                const element =e.target.closest('.masVendidoElement_two')
               if(element){
                   const {categoria, brand,name}=element.dataset;
                   window.location.href=`/${brand}/${categoria}/${name}`;
               }
            }
        }

    })
}


export function movMasVendidos() {
    const masVendidosOne = document.querySelector('.containerMasVendidos_one');
    const masVendidosTwo = document.querySelector('.containerMasVendidos_2_one');
    const movMasVendidos = document.querySelector('.movimientoMasVendidos')
    const movMasVendidosTwo = document.querySelector('.movimientoMasVendidos_2')

    if (!masVendidosOne) return;

    let isMovingOne = false;
    let isMovingTwo = false;

    let contador = -(masVendidosOne.offsetWidth / 2)
    let contadorTwo= -(masVendidosTwo.offsetWidth / 2);

    let distanciaEventoOne = 0;
    let distanciaEventoTwo = 0;
    let idAnimateOne;
    let idAnimateTwo;


    let positionXInicial;
    let positionXFinal;

    let positionXInicialTwo;
    let positionXFinalTwo;

    function animate() {

        contador -= 5;

            if(contador < - (masVendidosOne.offsetWidth)) {
                contador = -(masVendidosOne.offsetWidth / 2);
                masVendidosOne.style.transform = `translateX(${contador}px)`;
            }
        masVendidosOne.style.transform = `translateX(${(contador)}px)`;
        reposicionamiento();
        idAnimateOne = requestAnimationFrame(animate);
        // }
        //     console.log(contador)
    }
        animate();

    function reposicionamiento() {
        let positionLeftSlider = masVendidosOne.getBoundingClientRect().left;
        let reftLeftSlider =   masVendidosOne.offsetWidth/2;
        let positionLeftContainer = movMasVendidos.getBoundingClientRect().left;
        let gapMasVendidosOne = parseInt(getComputedStyle(masVendidosOne).gap.replace(/\D/g, ""), 10);
        let reftWidthElement = masVendidosOne.children[0].offsetWidth;
        let elementoTotalWidth = reftWidthElement + gapMasVendidosOne;

        // console.log('contador antes del condicional es->',contador)
        // console.log('el positionLeftSlider es->',positionLeftSlider);
        // console.log('el reftLeftSlider es->',reftLeftSlider);

        if (positionLeftSlider < positionLeftContainer ) {
            let desplazamiento = Math.abs(reftLeftSlider + positionLeftSlider);
            let elementosMovidos = Math.floor(desplazamiento / elementoTotalWidth);

            for (let i = 0; i < elementosMovidos; i++) {
                masVendidosOne.appendChild(masVendidosOne.children[0]); // Mueve el primer hijo al final
                contador += elementoTotalWidth;
                // console.log('el positionLeftSlider dentro del for es->',positionLeftSlider);
            }

            masVendidosOne.style.transform = `translateX(${contador}px)`;

        }

        reposicionamientoOne(distanciaEventoOne)

    }


    function reposicionamientoOne(distance) {

        const widthElement = masVendidosOne.children[0].offsetWidth;
        const gapElement = parseFloat(getComputedStyle(masVendidosOne).gap);
        const widthMoreGap = widthElement + gapElement;
        const elementosMovibles = Math.floor(Math.abs(distance) / widthMoreGap);
        let extraDistance = Math.abs(distance);

        // console.log('Moviendo elementos al inicio...');
        // console.log('tamaño element es = ', widthMoreGap)
        // console.log('la distancia actual del leftSlider es = ', masVendidosOne.getBoundingClientRect().left);

        if (distance > 0) {
            // console.log('moveremos: ',elementosMovibles);
            for (let i = 0; i < elementosMovibles; i++) {
                const lastElement = masVendidosOne.children[masVendidosOne.children.length-1];
                masVendidosOne.prepend(lastElement);
                contador -= widthMoreGap;
                // extraDistance -= widthMoreGap;
            }
            // console.log('la distancia sobrante es = ',extraDistance)
            //     contador += extraDistance;
            masVendidosOne.style.transform = `translateX(${contador}px)`;
        }
    }


    function downSliderOne(e){
        if(!isMovingOne){
            cancelAnimationFrame(idAnimateOne)
            positionXInicial = e.clientX;
            masVendidosOne.classList.add('addTransition');
            isMovingOne = true;
        }
    }
    function upSliderOne(e){
        if(isMovingOne) {
            positionXFinal = e.clientX;
            if(positionXFinal) {
                let distance = positionXFinal - positionXInicial;
                distanciaEventoOne = distance;

                contador+=distance;

                masVendidosOne.style.transform = `translateX(${contador}px)`;

                setTimeout(()=>{
                    masVendidosOne.classList.remove('addTransition');
                    animate();
                    isMovingOne=false;
                },300)
            }
        }
    }


    masVendidosOne.addEventListener('mousedown',downSliderOne)
    masVendidosOne.addEventListener('touchstart', downSliderOne)
    masVendidosOne.addEventListener('mouseup',upSliderOne)
    masVendidosOne.addEventListener('touchend', upSliderOne);




    function animateTwo() {
            contadorTwo += 5;
            if(contadorTwo > 0) {
                contadorTwo = - (masVendidosTwo.offsetWidth / 2);
                masVendidosTwo.style.transform = `translateX(${contadorTwo}px)`;
            }
            // else if(contadorTwo < -masVendidosTwo.offsetWidth){
            //     contadorTwo = - (masVendidosTwo.offsetWidth / 2);
            //     masVendidosTwo.style.transform = `translateX(${contadorTwo}px)`;
            // }
            masVendidosTwo.style.transform = `translateX(${contadorTwo}px)`;
            reposicionamiento_2()
            idAnimateTwo = requestAnimationFrame(animateTwo);

    }

    animateTwo();


    function reposicionamiento_2() {
        let positionRightSlider = masVendidosTwo.getBoundingClientRect().right;
        let positionLeftSlider = masVendidosTwo.getBoundingClientRect().left;
        let halfWidthSlider =   masVendidosTwo.offsetWidth/2;
        let positionRightContainer = movMasVendidos.getBoundingClientRect().right;
        let gapMasVendidosTwo = parseInt(getComputedStyle(masVendidosTwo).gap.replace(/\D/g, ""), 10);
        let reftWidthElement = masVendidosTwo.children[0].offsetWidth;
        let elementoTotalWidth = reftWidthElement + gapMasVendidosTwo;


        if (positionRightSlider > halfWidthSlider ) {
            let desplazamiento = Math.abs( positionRightSlider - halfWidthSlider );
            // console.log('la distancia entre el slider y su contenedor es->', desplazamiento);
            let elementosMovidos = Math.floor(desplazamiento / elementoTotalWidth);
            // console.log('los elementos a mover seran ->', elementosMovidos)

            for (let i = 0; i < elementosMovidos; i++) {
                masVendidosTwo.prepend(masVendidosTwo.children[masVendidosTwo.children.length - 1]); // Mueve el primer hijo al final
                contadorTwo -= elementoTotalWidth;
            }
            masVendidosTwo.style.transform = `translateX(${contadorTwo}px)`;
        }
        if(positionLeftSlider < - halfWidthSlider) {

            let desplazamiento = Math.abs( positionLeftSlider + halfWidthSlider);
            // console.log('el desplazamiento es->', desplazamiento)
            let elementosMovidos = Math.floor(desplazamiento / elementoTotalWidth);
            // console.log('la cantidad de elementos a mover son->', elementosMovidos);

            for(let i = 0; i < elementosMovidos; i++){
                // let firtsElement = masVendidosTwo.children[0];
                // console.log('el contador es->', contadorTwo)
                masVendidosTwo.appendChild(masVendidosTwo.children[0]);
                contadorTwo += elementoTotalWidth;

            }
            // contadorTwo += desplazamiento;
            masVendidosTwo.style.transform = `translateX(${contadorTwo}px)`;

        }

        // masVendidosTwo.style.transform = `translateX(${contadorTwo}px)`;


        // reposicionamientoTwo(distanciaEventoTwo)

    }

    function reposicionamientoTwo(distance) {

        const widthElement = masVendidosTwo.children[0].offsetWidth;
        const gapElement = parseFloat(getComputedStyle(masVendidosTwo).gap);
        const widthMoreGap = widthElement + gapElement;
        const elementosMovibles = Math.floor(Math.abs(distance) / widthMoreGap);
        let extraDistance = Math.abs(distance);


        console.log('contador two es->',contadorTwo);
        console.log('distanceTwo es->', distanciaEventoTwo)

        // console.log('Moviendo elementos al inicio...');
        // console.log('tamaño element es = ', widthMoreGap)
        // console.log('la distancia actual del leftSlider es = ', masVendidosTwo.getBoundingClientRect().left);

        if (distance < 0) {
            console.log('moveremos: ',elementosMovibles);
            console.log('el contadorTwo antes de reordenar es: ',contadorTwo)
            for (let i = 0; i < elementosMovibles; i++) {
                let firtsElement= masVendidosTwo.children[0];
                masVendidosTwo.appendChild(firtsElement);
                contadorTwo += widthMoreGap;
                // extraDistance -= widthMoreGap;
                console.log('el contador ahoa es->', contadorTwo)
            }
            // console.log('la distancia sobrante es = ',extraDistance)
            //     contador += extraDistance;
            masVendidosTwo.style.transform = `translateX(${contadorTwo}px)`;

            distanciaEventoTwo = 0;
        }
    }



    function downSliderTwo(e){
        if(!isMovingTwo){
            cancelAnimationFrame(idAnimateTwo)
            positionXInicialTwo = e.clientX;
            masVendidosTwo.classList.add('addTransition');
            isMovingTwo = true;
        }
    }

    function upSliderTwo(e){
        if(isMovingTwo) {
            positionXFinalTwo = e.clientX;
            if(positionXFinalTwo) {
                let distance = positionXFinalTwo - positionXInicialTwo;
                distanciaEventoTwo = distance;

                contadorTwo+=distance;

                masVendidosTwo.style.transform = `translateX(${contadorTwo}px)`;

                setTimeout(()=>{
                    masVendidosTwo.classList.remove('addTransition');
                    animateTwo();
                    isMovingTwo=false;
                },300)
            }
        }
    }

    masVendidosTwo.addEventListener('mousedown', downSliderTwo)
    masVendidosTwo.addEventListener('mouseup', upSliderTwo)
    masVendidosTwo.addEventListener('touchstart', downSliderTwo)
    masVendidosTwo.addEventListener('touchend', upSliderTwo)

}



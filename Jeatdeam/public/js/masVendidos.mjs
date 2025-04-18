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
    let isUncompleteOne = false;
    let isUncompleteTwo = false;

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

    }
        animate();

    function reposicionamiento() {
        let positionLeftSlider = masVendidosOne.getBoundingClientRect().left;
        let positionrightSlider = masVendidosOne.getBoundingClientRect().right;
        let reftLeftSlider =   masVendidosOne.offsetWidth/2;
        let positionLeftContainer = movMasVendidos.getBoundingClientRect().left;
        let gapMasVendidosOne = parseInt(getComputedStyle(masVendidosOne).gap.replace(/\D/g, ""), 10);
        let reftWidthElement = masVendidosOne.children[0].offsetWidth;
        let elementoTotalWidth = reftWidthElement + gapMasVendidosOne;
        let rightSlider = masVendidosOne.getBoundingClientRect().right;

        if (positionLeftSlider < -reftLeftSlider ) {
            let desplazamiento = Math.abs(reftLeftSlider + positionLeftSlider);
            let elementosMovidos = Math.floor(desplazamiento / elementoTotalWidth);

            for (let i = 0; i < elementosMovidos; i++) {
                masVendidosOne.appendChild(masVendidosOne.children[0]); // Mueve el primer hijo al final
                contador += elementoTotalWidth;
                // console.log('el positionLeftSlider dentro del for es->',positionLeftSlider);
            }
            masVendidosOne.style.transform = `translateX(${contador}px)`;
        }

        if(positionrightSlider > reftLeftSlider){
            let desplazamiento = Math.abs(positionrightSlider - reftLeftSlider);
            let elementosMovidos = Math.floor(desplazamiento / elementoTotalWidth);

            for(let i = 0; i < elementosMovidos; i++) {
                let lastElement = masVendidosOne.children[masVendidosOne.children.length - 1];
                masVendidosOne.prepend(lastElement);
                contador -= elementoTotalWidth
            }
            masVendidosOne.style.transform = `translateX(${contador}px)`;

        }

    }

    function downSliderOne(e){
        if(!isMovingOne){
            cancelAnimationFrame(idAnimateOne)
            positionXInicial = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            masVendidosOne.classList.add('addTransition');
            isMovingOne = true;
            isUncompleteOne = true;
        }
    }
    function upSliderOne(e){
        if(isMovingOne) {
            positionXFinal = e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX;
            if(positionXFinal) {
                let distance = positionXFinal - positionXInicial;
                distanciaEventoOne = distance;

                contador+=distance;
                masVendidosOne.style.transform = `translateX(${contador}px)`;
                setTimeout(()=>{
                    reposicionamiento();
                    masVendidosOne.classList.remove('addTransition');
                    // animate();
                    isMovingOne = false;
                    isUncompleteOne = false;
                },300)
            }
        }
    }


    masVendidosOne.addEventListener('mousedown',downSliderOne)
    masVendidosOne.addEventListener('mouseup',upSliderOne)

    masVendidosOne.addEventListener('touchstart', downSliderOne)
    masVendidosOne.addEventListener('touchend', upSliderOne);


    movMasVendidos.addEventListener('touchstart', e=>{
        cancelAnimationFrame(idAnimateOne)
    });
    movMasVendidos.addEventListener('touchend',e=>{
        if(!isMovingOne){
            animate();
        }
    });

    document.addEventListener('touchend', e=> {
        if (isMovingOne) {
            positionXFinal = e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX;
            if (positionXFinal) {
                let distance = positionXFinal - positionXInicial;
                // distanciaEventoTwo = distance;
                contador += distance;
                masVendidosOne.style.transform = `translateX(${contador}px)`;

                setTimeout(() => {
                    reposicionamiento();
                    masVendidosOne.classList.remove('addTransition');
                    isMovingOne = false;
                    if(!isMovingOne) animate();
                }, 300);
            }
        }
    })

    movMasVendidos.addEventListener('mouseenter', e => {
        cancelAnimationFrame(idAnimateOne)
        isMovingOne = false;
        isUncompleteOne = false;
    })
    movMasVendidos.addEventListener('mouseleave', e =>{
        if(!isMovingOne){
            if(!isUncompleteOne){
                animate()
            }
        }
    })

    document.addEventListener('mouseup', e=>{
        if (isMovingOne) {
            positionXFinal = e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX;
            if (positionXFinal) {
                let distance = positionXFinal - positionXInicial;
                // distanciaEventoTwo = distance;
                contador += distance;
                masVendidosOne.style.transform = `translateX(${contador}px)`;

                setTimeout(() => {
                    reposicionamiento();
                    masVendidosOne.classList.remove('addTransition');
                    isMovingOne = false;
                    if(isUncompleteOne) animate();
                }, 300);
            }
        }

    });

    function animateTwo() {
            contadorTwo += 5;
            if(contadorTwo > 0) {
                contadorTwo = - (masVendidosTwo.offsetWidth / 2);
                masVendidosTwo.style.transform = `translateX(${contadorTwo}px)`;
            }
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
            let elementosMovidos = Math.floor(desplazamiento / elementoTotalWidth);

            for(let i = 0; i < elementosMovidos; i++){
                masVendidosTwo.appendChild(masVendidosTwo.children[0]);
                contadorTwo += elementoTotalWidth;
            }
            masVendidosTwo.style.transform = `translateX(${contadorTwo}px)`;
        }
    }

    function downSliderTwo(e) {
        console.log('funcionooooo one')
        if (!isMovingTwo) {
            cancelAnimationFrame(idAnimateTwo);
            positionXInicialTwo = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            masVendidosTwo.classList.add('addTransition');
            isMovingTwo = true;
            isUncompleteTwo = true;
        }
    }

    function upSliderTwo(e) {
        console.log('funcionoooo two')
        if (isMovingTwo) {
            // Detectar si es touch o mouse
            positionXFinalTwo = e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX;
            if (positionXFinalTwo) {
                let distance = positionXFinalTwo - positionXInicialTwo;
                distanciaEventoTwo = distance;
                contadorTwo += distance;
                masVendidosTwo.style.transform = `translateX(${contadorTwo}px)`;
                // reposicionamiento_2();
                setTimeout(() => {
                    reposicionamiento_2();
                    masVendidosTwo.classList.remove('addTransition');
                    // animateTwo();
                    isMovingTwo = false;
                    isUncompleteTwo = false;
                }, 300);
            }
        }
    }


    masVendidosTwo.addEventListener('mousedown', downSliderTwo)
    masVendidosTwo.addEventListener('mouseup', upSliderTwo)

    masVendidosTwo.addEventListener('touchstart', downSliderTwo)
    masVendidosTwo.addEventListener('touchend', upSliderTwo)


    movMasVendidosTwo.addEventListener('touchstart', e=>{
        cancelAnimationFrame(idAnimateTwo);
        // isMovingTwo = false;
        // isUncompleteTwo = false;
    })
    movMasVendidosTwo.addEventListener('touchend', e=>{
        if(!isMovingTwo){
            // if(!isUncompleteTwo){
                animateTwo();
            // }
        }
    })

    document.addEventListener('touchend', e=>{
        if (isMovingTwo) {
            positionXFinalTwo = e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX;
            if (positionXFinalTwo) {
                let distance = positionXFinalTwo - positionXInicialTwo;
                distanciaEventoTwo = distance;
                contadorTwo += distance;
                masVendidosTwo.style.transform = `translateX(${contadorTwo}px)`;

                setTimeout(() => {
                    reposicionamiento_2();
                    masVendidosTwo.classList.remove('addTransition');
                    isMovingTwo = false;
                    if(!isMovingTwo) animateTwo();
                }, 300);
            }
        }

    })


    movMasVendidosTwo.addEventListener('mouseenter',e=>{
        cancelAnimationFrame(idAnimateTwo)
        isMovingTwo = false;
        isUncompleteTwo = false;

    })
    movMasVendidosTwo.addEventListener('mouseleave',e=>{
        if(!isMovingTwo) {
            if(!isUncompleteTwo){
                animateTwo();
            }
        }
    })

    document.addEventListener('mouseup', e=>{
        if (isMovingTwo) {
            positionXFinalTwo = e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX;
            if (positionXFinalTwo) {
                let distance = positionXFinalTwo - positionXInicialTwo;
                distanciaEventoTwo = distance;
                contadorTwo += distance;
                masVendidosTwo.style.transform = `translateX(${contadorTwo}px)`;

                setTimeout(() => {
                    reposicionamiento_2();
                    masVendidosTwo.classList.remove('addTransition');
                    isMovingTwo = false;
                    if(isUncompleteTwo) animateTwo();
                }, 300);
            }
        }

    });
    

}



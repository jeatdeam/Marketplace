

export function masVendidosScroll(){

    const movMasVendidosOne=document.querySelector('.containerMasVendidos_one');
    const movMasVendidosTwo=document.querySelector('.containerMasVendidos_two');

    const masVendidoElementAll=document.querySelectorAll('.masVendidoElement');

    masVendidoElementAll.forEach(element=>{

        element.addEventListener('mouseenter',e=>{
            movMasVendidosOne.style.animationPlayState="paused";
            movMasVendidosTwo.style.animationPlayState="paused";
        })
        element.addEventListener('touchstart',e=>{
            movMasVendidosOne.style.animationPlayState="paused";
            movMasVendidosTwo.style.animationPlayState="paused";
        })
        element.addEventListener('mouseleave',e=>{
            movMasVendidosOne.style.animationPlayState="running";
            movMasVendidosTwo.style.animationPlayState="running";
        })
        element.addEventListener('touchend',e=>{
            movMasVendidosOne.style.animationPlayState="running";
            movMasVendidosTwo.style.animationPlayState="running";
        })
    })

    const movMasVendidosOne_1=document.querySelector('.containerMasVendidos_2_one');
    const movMasVendidosTwo_2=document.querySelector('.containerMasVendidos_2_two');

    const masVendidoElementAll_two=document.querySelectorAll('.masVendidoElement_two');

    masVendidoElementAll_two.forEach(element=>{

        element.addEventListener('mouseenter',e=>{
            movMasVendidosOne_1.style.animationPlayState="paused";
            movMasVendidosTwo_2.style.animationPlayState="paused";
        })
        element.addEventListener('touchstart',e=>{
            movMasVendidosOne_1.style.animationPlayState="paused";
            movMasVendidosTwo_2.style.animationPlayState="paused";
        })
        element.addEventListener('mouseleave',e=>{
            movMasVendidosOne_1.style.animationPlayState="running";
            movMasVendidosTwo_2.style.animationPlayState="running";
        })
        element.addEventListener('touchend',e=>{
            movMasVendidosOne_1.style.animationPlayState="running";
            movMasVendidosTwo_2.style.animationPlayState="running";
        })


    })

}
// import spanParent from "nodemailer/lib/mime-node/index.js";


export function moveSpan(){

    const width=window.innerWidth;


    if(width<=480){
        const allDiv=document.querySelectorAll('.searchAndOptions>ul>li>div');
        allDiv.forEach(div=>{
            const spanPrice=div.nextElementSibling;
            spanPrice.style.fontWeight="bold"
            div.insertAdjacentElement('beforeend',spanPrice);
        })

    }

    console.log(width,"<- aqui esta el width");

}

export function moveBottomInfo(){

    const media_1=matchMedia('(max-width: 320px)')
    if(media_1.matches){
        const bottomInfo=document.querySelector('.bottomInfo');
        if(bottomInfo){
            const infoProductDetails=document.querySelector('.info_productDetail');
            infoProductDetails.insertAdjacentElement('afterend',bottomInfo)
        }
    }
    const media_2=matchMedia('(min-width: 321px) and (max-width: 480px)');
    if(media_2.matches){
        const bottomInfo=document.querySelector('.bottomInfo');
        if(bottomInfo){

            const infoProductDetails=document.querySelector('.info_productDetail');
            infoProductDetails.insertAdjacentElement('afterend',bottomInfo)
        }

    }
    const media_3=matchMedia('(min-width: 481px) and (max-width: 640px)');
    if(media_3.matches){
        const bottomInfo=document.querySelector('.bottomInfo');

        if(bottomInfo){
            const infoProductDetails=document.querySelector('.info_productDetail');
            infoProductDetails.insertAdjacentElement('afterend',bottomInfo)
        }
    }
    const media_4=matchMedia('(min-width: 641px) and (max-width:768px)');
    if(media_4.matches){
        const bottomInfo=document.querySelector('.bottomInfo');

        if(bottomInfo){
            const infoProductDetails=document.querySelector('.info_productDetail');
            infoProductDetails.insertAdjacentElement('afterend',bottomInfo)
        }
    }

    const mediaOne=matchMedia('(min-width: 769px) and (max-width:1024px)');

    if(mediaOne.matches){
        const bottomInfo=document.querySelector('.bottomInfo');
        if(bottomInfo){
            const infoProductDetails=document.querySelector('.info_productDetail');
            infoProductDetails.insertAdjacentElement('afterend',bottomInfo)
        }
    }


    const mediaTwo=matchMedia('(min-width: 1025px) and (max-width:1280px)');

    if(mediaTwo.matches){
        const bottomInfo=document.querySelector('.bottomInfo');
        if(bottomInfo) {
            const lastMove=document.querySelector('.lastMove');
            lastMove.insertAdjacentElement('beforebegin',bottomInfo)
        }
    }

    const mediaThree=matchMedia('(min-width: 1281px) and (max-width:1440px)')
    if(mediaThree.matches){
        const bottomInfo=document.querySelector('.bottomInfo');

        if(bottomInfo){
            const lastMove=document.querySelector('.lastMove');
            lastMove.insertAdjacentElement('beforebegin',bottomInfo)
        }
    }
    const mediaFour=matchMedia('(min-width: 1441px) and (max-width:1536px)');
    if(mediaFour.matches){
        const bottomInfo=document.querySelector('.bottomInfo');

        if(bottomInfo){
            const lastMove=document.querySelector('.lastMove');
            lastMove.insertAdjacentElement('beforebegin',bottomInfo)
        }
    }
    const mediaFive=matchMedia('(min-width: 1537px)');
    if(mediaFive.matches){
        const bottomInfo=document.querySelector('.bottomInfo');

        if(bottomInfo){
            const lastMove=document.querySelector('.lastMove');
            lastMove.insertAdjacentElement('beforebegin',bottomInfo)
        }
    }
}



export function apiladoInfoProductSmall(){

    const media=window.matchMedia('(max-width: 320px)');

    if(media.matches) {

        const allDiv=document.querySelectorAll('.searchAndOptions>ul>li>div');
        const ulBusqueda=document.querySelector('.searchAndOptions>ul');

        if(ulBusqueda.children.length>0) {
            console.log(ulBusqueda.children,'aqui esta la cantidad de hijos 2')
            allDiv.forEach(div => {

                const spanPrice = div.nextElementSibling;
                spanPrice.style.fontWeight = "bold"
                div.insertAdjacentElement('beforeend', spanPrice);

            })

        }

    }
    const mediaTwo=window.matchMedia('(min-width: 321px) and (max-width: 480px)');

    if(mediaTwo.matches){

        const allDiv=document.querySelectorAll('.searchAndOptions>ul>li>div');
        const ulBusqueda=document.querySelector('.searchAndOptions>ul');


if(ulBusqueda) {
    if (ulBusqueda.children.length > 0) {
        console.log(ulBusqueda.children, 'aqui esta la cantidad de hijos 2')
        allDiv.forEach(div => {

            const spanPrice = div.nextElementSibling;
            spanPrice.style.fontWeight = "bold"
            div.insertAdjacentElement('beforeend', spanPrice);

        })

    }
}
    }

    const mediaThree=window.matchMedia('(min-width: 481px) and (max-width: 640px)');

    if(mediaThree.matches){
        const allLi=document.querySelectorAll('.searchAndOptions>ul>li');


        allLi.forEach(li=>{

            const price=li.querySelector('div>span:nth-child(3)');

            if(price){
                console.log(price,"<-aqui esta la etiqueta span con el precio")

                const div=li.querySelector('div');

                div.insertAdjacentElement('afterend',price);
            }else{
                console.error(`no hay la etiqueta span con el precio->${price}`)
            }

        })


    }

    const mediaFour=window.matchMedia('(min-width: 641px) and (max-width:768px)');

    if(mediaFour.matches){

        const allPrice=document.querySelectorAll('.searchAndOptions>ul>li>div>span:nth-child(3)');

        allPrice.forEach(spanPrice=>{

            const divParent=spanPrice.closest('.searchAndOptions>ul>li>div');

            divParent.insertAdjacentElement('afterend',spanPrice);

        })
    }

}


export function ocultarMenuSmall(){

    const query=window.matchMedia('(min-width: 769px) and (max-width:1024px)');
    const menuSmall=document.querySelector('.containerMenuSmallWindow')
    const computedMenu=getComputedStyle(menuSmall).opacity;

    if(query.matches){
        if(computedMenu==="1"){
            menuSmall.style.opacity="0";
            menuSmall.style.pointerEvents = "none";
            document.body.style.filter="";
            menuSmall.style.left="-300px"
        }
    }
    const queryTwo=window.matchMedia('(min-width: 1025px) and (max-width:1280px)');

    if(queryTwo.matches) {
        if (computedMenu === "1") {
            menuSmall.style.opacity = "0";
            menuSmall.style.pointerEvents = "none";
            document.body.style.filter="";
            menuSmall.style.left="-300px"
        }
    }
    const queryThree=window.matchMedia('(min-width: 1281px) and (max-width:1440px)');

    if(queryThree.matches) {
        if (computedMenu === "1") {
            menuSmall.style.opacity = "0";
            menuSmall.style.pointerEvents = "none";
            document.body.style.filter="";
            menuSmall.style.left="-300px"
        }
    }
    const queryFour=window.matchMedia('(min-width: 1441px) and (max-width:1536px)');

    if(queryFour.matches) {
        if (computedMenu === "1") {
            menuSmall.style.opacity = "0";
            menuSmall.style.pointerEvents = "none";
            document.body.style.filter="";
            menuSmall.style.left="-300px"
        }
    }
    const queryFive = window.matchMedia('(min-width: 1537px)');

    if (queryFive.matches) {
        if (computedMenu === "1") {
            menuSmall.style.opacity = "0";
            menuSmall.style.pointerEvents = "none";
            document.body.style.filter="";
            menuSmall.style.left="-300px"
        }


    }
}


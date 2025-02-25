// import spanParent from "nodemailer/lib/mime-node/index.js";


export function moveSpan(){


    if(window.innerWidth<=480){
        // const spanAll=document.querySelectorAll('.searchAndOptions>ul>li>span:nth-of-type(1)')
        // const divAll=document.querySelectorAll('.searchAndOptions>ul>li>div');
        // divAll.forEach( (div,index)=>{
        //
        //     if(spanAll[index]){
        //         div.appendChild(spanAll[index]);
        //     }
        //
        // })
    }

    if(window.innerWidth>=481){
    //     const spanAll=document.querySelectorAll('.searchAndOptions>ul>li>div>span:nth-of-type(3)')
    //     const divAll=document.querySelectorAll('.searchAndOptions>ul>li>div')
    //
    //     divAll.forEach( (div,index)=>{
    //         div.insertAdjacentElement('afterend',spanAll[index])
    //     })
    }

}

export function moveBottomInfo(){

    if(window.innerWidth <= 1024){
        // const bottomInfo=document.querySelector('.bottomInfo');
        // const infoProduct=document.querySelector('.info_productDetail')
        //
        // infoProduct.insertAdjacentElement('afterend',bottomInfo)
        //

    }
    if(window.innerWidth >=1025){
        // const bottomInfo=document.querySelector('.bottomInfo');
        // const lastMove=document.querySelector('.lastMove');
        //
        // lastMove.insertAdjacentElement('beforebegin',bottomInfo)

    }

}

export function apiladoInfoProductSmall(){

    const media=window.matchMedia('(max-width: 320px)');

    if(media.matches) {

        const allDiv=document.querySelectorAll('.searchAndOptions>ul>li>div');


        allDiv.forEach(div=>{

            const spanPrice=div.nextElementSibling;
            spanPrice.style.fontWeight="bold"
            div.insertAdjacentElement('beforeend',spanPrice);

        })



    }
    const mediaTwo=window.matchMedia('(min-width: 321px) and (max-width: 480px)');

    if(mediaTwo.matches){

        const allDiv=document.querySelectorAll('.searchAndOptions>ul>li>div');


        allDiv.forEach(div=>{

            const spanPrice=div.nextElementSibling;
            if(spanPrice){
                spanPrice.style.fontWeight="bold"
                div.insertAdjacentElement('beforeend',spanPrice);
            }


        })

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


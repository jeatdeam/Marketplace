

export function moveSpan(){


    if(window.innerWidth<=480){
        const spanAll=document.querySelectorAll('.searchAndOptions>ul>li>span:nth-of-type(1)')
        const divAll=document.querySelectorAll('.searchAndOptions>ul>li>div');
        divAll.forEach( (div,index)=>{

            if(spanAll[index]){
                div.appendChild(spanAll[index]);
            }

        })
    }

    if(window.innerWidth>=481){
        const spanAll=document.querySelectorAll('.searchAndOptions>ul>li>div>span:nth-of-type(3)')
        const divAll=document.querySelectorAll('.searchAndOptions>ul>li>div')

        divAll.forEach( (div,index)=>{
            div.insertAdjacentElement('afterend',spanAll[index])
        })
    }

}
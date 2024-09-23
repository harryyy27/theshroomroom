import Image from 'next/image'
function keyHandler(el:HTMLElement,key:string){
    if(key==="Enter"){
        el.click()

    }
    return
}
function toggleQuestion(index:number){
    const crosses=document.querySelectorAll(".cross-container");
    const clickable=document.querySelectorAll(".bullet-wrapper");
    const paragraphs=document.querySelectorAll(".bullet-para");
    if(crosses[index].classList.length===1){
        crosses[index].classList.add("cross-transform");
        paragraphs[index].classList.add("display");
        clickable[index].setAttribute("aria-expanded","true")
        paragraphs[index].setAttribute("aria-hidden","false")
    }
    else {
        crosses[index].classList.remove("cross-transform");
        paragraphs[index].classList.remove("display");
        clickable[index].setAttribute("aria-expanded","false")
        paragraphs[index].setAttribute("aria-hidden","true")
    }
}
export default function List(props:any){
    return(
        <section>
            <div className={"faq-wrapper"}>
            <ul className="list-wrapper">
                {
                    props.config.map((el:any,index:number)=>{
                        return(
                                <li key={index} className={"question"} >
                                    <div className="bullet-wrapper" onClick={(e)=>toggleQuestion(index)} onKeyDown={(e)=>keyHandler(e.target as HTMLElement,e.key)} aria-expanded={"false"} aria-controls={`para${index}`} role="button" tabIndex={0}>

                                        {/* <div className="cross-container mobile"></div> */}
                                        <h2 className="bullet-heading">{el.question}</h2>
                                        <div className="cross-container"></div>
                                    </div>
                                    {
                                        typeof el.answer==="string"?

                                    <p id={`para${index}`}className="bullet-para" aria-hidden={"true"}>{el.answer}</p>
                                        :
                                        <ul id={`para${index}`} className="bullet-para" aria-hidden={"true"}>
                                            {

                                            el.answer.map((elAns:string)=><li style={{"listStyle":"outside"}}>{elAns}</li>
                                            )
                                            }
                                        </ul>
                                    }
                                </li>
                        )
                    })
                }
            </ul>
            </div>
        </section>
    )
}
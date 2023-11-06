import homeStyles from '../../styles/Pages/Home.module.css'
import Image from 'next/image'
import config from './config/faqConfig.js';
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
export default function Faq(){
    return(
        <section className={homeStyles["banner-container"]}>
            <div className={homeStyles["faq-wrapper"]}>
            <h1 className={homeStyles["home-section-heading"]}>FAQs</h1>
            <ul>
                {
                    config.map((el,index)=>{
                        return(
                                <li key={index} className={homeStyles["question"]} >
                                    <div className="bullet-wrapper" onClick={(e)=>toggleQuestion(index)} onKeyDown={(e)=>keyHandler(e.target as HTMLElement,e.key)} aria-expanded={"false"} aria-controls={`para${index}`} role="button" tabIndex={0}>
                                        <Image className="mush-bullet"src="/bullet-ter2.jpg" alt="bullet point" width="50" height="50" />
                                        <h2 className="bullet-heading">{el.question}</h2>
                                        <div className="cross-container"></div>
                                    </div>
                                    <p id={`para${index}`}className="bullet-para" aria-hidden={"true"}>{el.answer}</p>
                                </li>
                        )
                    })
                }
            </ul>
            </div>
        </section>
    )
}
import homeStyles from '../../styles/Pages/Home.module.css';
import Image from "next/image";
import Link from 'next/link';
export default function Wholesale(){
    return(
        
        <section className={homeStyles["wholesale-container"]}>
        <div className={homeStyles["wholesale-wrapper"]}>
            
        <div className={homeStyles["right"]+ " " +homeStyles["text-section"]}>
            <h1 className={homeStyles["hero-heading"]+" light"}>Are you a business hoping to sell lion's mane mushrooms?</h1>
            <button className="cta"><Link href="/wholesale">Purchase Wholesale</Link></button>
        </div>
        <div className={homeStyles["image-section"]}>
            <figure className={homeStyles["hero-image-wrap"]}>
                <Image alt="hero mush" className={homeStyles["banner-image"]} fill sizes="(max-width: 480px) 480px, (max-width:767px) 767px, (max-width:1024px) 1024px,(max-width:1200px) 1200px" loading="lazy" src='/home/wholesale.jpg' placeholder="blur" blurDataURL='/home/wholesale.jpg' />
                </figure>
        </div>
        </div>
        </section>
    )
}
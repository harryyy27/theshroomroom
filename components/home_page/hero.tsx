import React from 'react';
// import globalStyles from '../../styles/globals.css'
import homeStyles from '../../styles/Pages/Home.module.css'
import Image from 'next/image'
import Link from 'next/link'
import {sendGTMEvent} from '@next/third-parties/google'
export default function Hero(){
    return(
        <>
            <section className={homeStyles["hero-container"]}>

                <div className={homeStyles["text-section"]+ " " + homeStyles["left"]}>
                    <h1 className={homeStyles["hero-heading"]}>Boost Your Brain With Lion's Mane</h1>
                    <h2 className={homeStyles["hero-sub-heading"]}>Fresh, tasty, locally cultivated lion's mane mushrooms</h2>
                    <p className={homeStyles["hero-text"]}>Are you ready for your Mane Course?</p>
                    <button id="heroCta" className="cta"><Link id="heroCtaLink" href="/products">BUY NOW</Link></button>
                </div>
                <div className={homeStyles["image-section"]}>
                    <figure className={homeStyles["hero-image-wrap"]}>
                        <Image alt="hero mush" className={homeStyles["banner-image"]} fill sizes="(max-width: 480px) 480px, (max-width:767px) 767px, (max-width:1024px) 1024px,(max-width:1200px) 1200px" priority src='/home/hero.jpg'placeholder="blur" blurDataURL='/home/hero.jpg' />
                        {/* picture of product */}
                        <figcaption></figcaption>
                    </figure>
                </div>
            </section>
        </>
    )
}
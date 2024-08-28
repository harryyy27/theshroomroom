import {useState,useEffect} from 'react';
import Link from 'next/link'
import Head from 'next/head';
import {Metadata} from '../utils/metadata/metadata';
import Subscribe from '../components/subscriptionForm'
export default function WhatWeGrow(props:any) {
    const [mushArr,setMushArr] = useState([])
    // useEffect(()=>{
    //     setMushArr(props)
    // },[])

    return (
        <div className="static-container">
            <Head>
                <title>{Metadata["whatwegrow"]["title"]}</title>
                <meta name="description" content={Metadata["whatwegrow"]["description"]}/>
                <meta property="og:title" content={Metadata["whatwegrow"]["title"]}/>
                <meta property="og:description" content={Metadata["whatwegrow"]["description"]}/>
            </Head>
            <h1>What we grow</h1>

            <h2>Lion's Mane (Hericium Erinaceus): Nature's Neuroprotective Treasure</h2>

            <p>The lion's mane mushroom, scientifically known as hericium erinaceus, is a marvel of the fungal kingdom, revered for its stunning appearance, delectable taste and remarkable health benefits. Often referred to as the "Pom Pom" mushroom due to its distinctive appearance or the monkey head mushroom in east Asia, lion's mane is saprophytic meaning it feeds on dead organic matter (dead trees in the case of lion's mane).</p>
            <ul>
                <li>
                    <h3>Physical Appearance:</h3>
                    <p>In its wild form, lion's mane mushroom grows on trees, resembling a cascading waterfall of spine-like structures. Its pure white, shaggy mane bears a striking resemblance to the mane of a lion, which inspired its name. As it matures, the spines elongate and become more pronounced, creating a truly majestic sight in the forest.</p>
                    {/* <Image />  */}
                </li>
                <li>
                    <h3>Culinary Delight:</h3>
                    <p>Beyond its aesthetic allure, Lion's Mane is celebrated in culinary traditions worldwide. When cooked, this mushroom takes on a tender, succulent texture with a delicate seafood-like flavor. Its ability to absorb surrounding flavors makes it a versatile ingredient in various cuisines. It can be sautéed, grilled, roasted, or used in soups,sauces and stews, adding a unique taste and texture to dishes. It's meaty texture also makes it a great substitute for meat making it a great option for vegans</p>
                </li>
                <li>
                <h3>Health Benefits:</h3>
                    <p>Lion's mane mushrooms are not just a culinary delight but also renowned for their potent medicinal properties. Rich in bioactive compounds, including <a className="link" href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5987239/">hericenones and erinacines</a><sup>[1]</sup>, lion's mane is believed to offer a wide array of health benefits. It is particularly famous for its potential neuroprotective effects, <a className="link" href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10675414/">supporting brain health and cognitive function</a><sup>[2]</sup>. Studies suggest that lion's mane may <cite><a className="link"href="https://pubmed.ncbi.nlm.nih.gov/24266378/">stimulate nerve growth factor (NGF) production</a></cite><sup>[3]</sup>, aiding in nerve regeneration and potentially offering <a className="link"href="https://pubmed.ncbi.nlm.nih.gov/20834180/">therapeutic benefits for neurological disorders</a><sup>[4]</sup>.</p>
                    <p>Additionally, lion's mane are valued for their anti-inflammatory, immune-modulating and antioxidant properties. It has been traditionally used in herbal medicine for centuries, particularly in Chinese medicine as a tonic for all 5 internal organs.</p>
                    <p>In vitro studies have demonstrated lion's mane may also exhibit <a className="link" href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3835629/">gastroprotective effects</a><sup>[5]</sup> as well as <a className="link" href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6044372/">anticancer properties</a><sup>[6]</sup>. Some evidence suggests that the extracts "stimulated the activities of natural killer cells and macrophages on one hand and blocked angiogenesis on the other."</p>
                </li>
                
                
                <li>
                    <h3>A Fungus of Fascination:</h3>
                    <p>Beyond its practical uses, lion's mane mushrooms continue to captivate mycologists, herbalists, and nature enthusiasts. Its unique appearance and multifaceted benefits make it a subject of scientific research and culinary exploration, contributing to its growing popularity in modern gastronomy and natural medicine.</p>
                </li>
            

            </ul>
            <h2>References</h2>
                <ol>
                    <li><cite id="ref_1">I-Chen Li, 1 Li-Ya Lee, 1 Tsai-Teng Tzeng, 2 Wan-Ping Chen, 1 Yen-Po Chen, 1 Young-Ju Shiao, 2 and Chin-Chu Chen (2008) Neurohealth Properties of Hericium erinaceus Mycelia Enriched with Erinacines</cite></li>
                    <li><cite id="ref_2">Sarah Docherty, Faye L. Doughty, Ellen F. Smith (2023) The Acute and Chronic Effects of Lion’s Mane Mushroom Supplementation on Cognitive Function, Stress and Mood in Young Adults: A Double-Blind, Parallel Groups, Pilot Study</cite></li>
                    <li><cite id="ref_3">Puei-Lene Lai 1, Murali Naidu, Vikineswary Sabaratnam, Kah-Hui Wong, Rosie Pamela David, Umah Rani Kuppusamy, Noorlidah Abdullah, Sri Nurestri A Malek (2013-2015) Neurotrophic properties of the Lion's mane medicinal mushroom, Hericium erinaceus (Higher Basidiomycetes) from Malaysia</cite></li>
                    <li><cite id="ref_4">Mayumi Nagano 1, Kuniyoshi Shimizu, Ryuichiro Kondo, Chickako Hayashi, Daigo Sato, Katsuyuki Kitagawa, Koichiro Ohnuki(2010) Reduction of depression and anxiety by 4 weeks Hericium erinaceus intake</cite></li>
                    <li><cite id="ref_5">Jing-Yang Wong, 1 , 2 Mahmood Ameen Abdulla, 1 , 3 ,* Jegadeesh Raman, 1 Chia-Wei Phan, 1 , 2 Umah Rani Kuppusamy, 1 , 3 Shahram Golbabapour, 2 , 3 and Vikineswary Sabaratnam 1 , 3 (2013) Gastroprotective Effects of Lion's Mane Mushroom Hericium erinaceus (Bull.:Fr.) Pers. (Aphyllophoromycetideae) Extract against Ethanol-Induced Ulcer in Rats</cite></li>
                    <li><cite id="ref_6">Artem Blagodatski,1,2,* Margarita Yatsunskaya,3,* Valeriia Mikhailova,1 Vladlena Tiasto,1 Alexander Kagansky,1 and Vladimir L. Katanaev1,2 (2018) Medicinal mushrooms as an attractive new source of natural compounds for future cancer therapy</cite></li>
                </ol>
            <p>Shop for <Link className="link" href="/products">lion's mane</Link></p>
            
        </div>
    )
}

export async function getStaticProps(){
    return {
        props:{
            mushies:[]
        }
    }
}
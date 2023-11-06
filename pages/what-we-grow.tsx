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
            <p>For now, we are only growing lion's mane mushrooms. We are currently not working with a lot of space and in order to optimise growing conditions, we decided to commit to the temperature and humidity requirements of 1 type of mushroom rather than work with averages, which inevitably leads to an inferior product and slower growth process. However, we will soon be renting out a warehouse which should give us the space we need to grow a broad range of mushrooms for your consumption. Stay tuned!</p>

            <h2>Lion's Mane Mushroom: Nature's Neuroprotective Treasure</h2>

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
                    <p>Lion's mane mushrooms are not just a culinary delight but also renowned for their potent medicinal properties. Rich in bioactive compounds, including <cite>hericenones and erinacines</cite>, lion's mane is believed to offer a wide array of health benefits. It is particularly famous for its potential neuroprotective effects, <cite>supporting brain health and cognitive function</cite>. Studies suggest that lion's mane may <cite>stimulate nerve growth factor (NGF) production</cite>, aiding in nerve regeneration and potentially offering therapeutic benefits for neurological disorders. Countless small studies have demonstrated this including </p>
                    <p>Additionally, lion's mane are valued for their anti-inflammatory, immune-modulating and antioxidant properties. It has been traditionally used in herbal medicine for centuries, particularly in Chinese medicine as a <cite>tonic for all 5 internal organs</cite>.</p>
                    <p>In vitro studies have demonstrated lion's mane can also exhibit <cite><a href="">gastroprotective effects</a></cite> as well as <cite>anticancer properties</cite>. It has been demonstrated that the extracts stimulated the activities of natural killer cells and macrophages on one hand and blocked angiogenesis on the other.</p>
                </li>
                
                <li>
                    <h3>Cultural Significance:</h3>
                    <p>The lion's mane mushroom has a rich cultural and historical significance. In traditional Chinese and Japanese medicine, it has been cherished for its healing properties, often regarded as a symbol of longevity, mental clarity, and spiritual potency. Ancient texts and scrolls extol its benefits, frequently associating it with wisdom and enlightenment.</p>
                </li>
                
                <li>
                    <h3>A Fungus of Fascination:</h3>
                    <p>Beyond its practical uses, lion's mane mushrooms continue to captivate mycologists, herbalists, and nature enthusiasts. Its unique appearance and multifaceted benefits make it a subject of scientific research and culinary exploration, contributing to its growing popularity in modern gastronomy and natural medicine.</p>
                </li>
            

            </ul>

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
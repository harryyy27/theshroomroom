import {Metadata} from '../utils/metadata/metadata';
import Head from 'next/head';
import Link from 'next/link'
export default function Mushrooms(){
    return(
        <div className="static-container">
            <Head>
                <title>{Metadata["about"]["title"]}</title>
                <meta name="description" content={Metadata["about"]["description"]}/>
                <meta property="og:title" content={Metadata["about"]["title"]}/>
                <meta property="og:description" content={Metadata["about"]["description"]}/>
            </Head>
            <h1 className="main-heading">Welcome to Mega Mushrooms: Cultivating Nature's Finest Fungi</h1>
            <section>
                <p>Mega Mushrooms are a small, London based start up with a passion for all things fungi. We've seen many of the wonderful applications of fungi at work over the years, such as the yeasts used to brew the alcohol you drink or the penicillin used to treat the sick. We felt that it was time to explore this kingdom further; by first bringing all the culinary delights it has to offer to your dinner plates.</p>

                <p>We currently specialise in high quality lion's mane mushrooms and we are proud say, that after many iterations of research and refining our process, we are finally ready to offer you these delicious and potent mushrooms at the best possible prices.</p>
                <p>In order to optimise growing conditions, we decided to commit to the temperature and humidity requirements of one type of mushroom rather than work with averages, which leads to better growth, higher yields and some of the most beautiful, healthy and mouth watering mushrooms we've ever seen. We at Mega Mushrooms are committed to offering you the best the world of fungi has to offer as we plan to acquire land with the intention of using it to fill your plates with a myriad of culinary treasures. Join us by <Link className="link" href="/auth/signup">signing up now</Link> if you want to hear about our secret projects, recipes and upcoming products. Stay tuned!</p>
            </section>
        </div>
    )
}
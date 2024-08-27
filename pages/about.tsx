import {Metadata} from '../utils/metadata/metadata';
import Head from 'next/head';
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
                <p>Mega Mushrooms are a small, London based start up with a passion for all things fungi. We've seen many of the wonderful applications of fungi at work over the years, such as the yeasts used to brew the alcohol you drink and the penicillin used to cure the infections that plague us and felt that it was time to explore the fungal kingdom further; by first bringing all the culinary delights it has to offer to your dinner plates.</p>

                <p>We are proud say, that after many iterations of research and refinining our process, we are now ready to offer you delicious and potent lion's mane mushrooms at the best possible prices.</p>
                <p>We currently specialise in high quality lion's mane mushrooms. In order to optimise growing conditions, we decided to commit to the temperature and humidity requirements of 1 type of mushroom rather than work with averages, which leads to better growth, higher yields and some of the most strange, beautiful and delicious mushrooms we've seen. However, we at Mega Mushrooms are committed to offering you the best the fungal world has to offer and plan to acquire land and fill your plates with a myriad of culinary treasures. Stay tuned!</p>
            </section>
        </div>
    )
}
import Head from 'next/head';
import {Metadata} from '../utils/metadata/metadata';

export default function Returns(){
    return(
        <div className="static-container">
            <Head>
                <title>{Metadata["returns"]["title"]}</title>
                <meta name="description" content={Metadata["returns"]["description"]}/>
                <meta property="og:title" content={Metadata["returns"]["title"]}/>
                <meta property="og:description" content={Metadata["returns"]["description"]}/>
            </Head>
        <h1 className="main-heading">Returns</h1>
        <section>
        <h2>Perishable goods</h2>
        <p>Refunds are not offered on perishable goods.</p>
        <ul>
            <li>Mushies</li>
            {/* <li>Spore syringes</li> */}
        </ul>
        </section>
        {/* <section>
            <h2>Non-perishable</h2>
            <p>You may enquire</p>
            <ul>
                <li>Grow bags</li>
                <li>Flow hoods</li>
            </ul>
        </section> */}
        </div>
    )
}
import Head from 'next/head';
import {Metadata} from '../utils/metadata/metadata';
import Link from 'next/link'
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
        <p>Refunds are not offered on perishable goods and as such, we will not be offering refunds on fresh lion's mane.</p>
        <p>However, if dried mushroom packaging remains unopened, sealed and undamaged, we will offer you a refund upon its arrival at the return address below:</p>
        <ul>
            <li>2 Overbrae,</li>
            <li>Beckenham,</li>
            <li>Kent,</li>
            <li>BR3 1SX</li>
        </ul>
        <p>If you have any further queries <Link className="link" href="/contact-us">contact us here.</Link></p>
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
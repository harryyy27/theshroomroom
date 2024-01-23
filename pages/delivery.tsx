import Head from 'next/head';
import {Metadata} from '../utils/metadata/metadata';

export default function Delivery(){
    return (
        <div className="static-container">
            <Head>
                <title>{Metadata["delivery"]["title"]}</title>
                <meta name="description" content={Metadata["delivery"]["description"]}/>
                <meta property="og:title" content={Metadata["delivery"]["title"]}/>
                <meta property="og:description" content={Metadata["delivery"]["description"]}/>
            </Head>
        <h1 className="main-heading">Delivery</h1>
        <section>
            <h2>Mushies</h2>
            <p>
                For the time being we will be limiting the delivery of fresh mushrooms to the postcodes listed at the bottom of this page. However, dried mushrooms and seasoning can be delivered to anywhere in the country.
            </p>
            <p>
                Please contact if you have any special enquiries.
            </p>

        </section>
        </div>
    )
}
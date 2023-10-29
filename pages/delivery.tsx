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
                In our free local home delivery zone, we self-fulfil orders with a refrigerated vehicle.
                Outside of this zone, deliveries will be fulfilled using a third-party courier e.g. Royal Mail, DHL, Hermes; this delivery will NOT be temperature controlled. 
                Because of this we cannot take responsibility of the condition that the mushrooms will arrive in, despite doing our best to package the order. 
                So far, courier-fulfilled deliveries arrived without issues. However, you can request that mushrooms be dried and vacuum sealed which should preserve their shelf life sufficiently for deliveries that go beyond the aforementioned locations.
            </p>
            <p>
                Please contact if you have any special enquiries.
            </p>

        </section>
        </div>
    )
}
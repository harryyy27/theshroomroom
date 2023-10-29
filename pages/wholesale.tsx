import ContactForm from '../components/contactForm'
import Head from 'next/head';

import {Metadata} from '../utils/metadata/metadata'
export default function ContactUs(){
    return(
        <div className="static-container">
        <Head>
            <title>{Metadata["wholesale"]["title"]}</title>
            <meta name="description" content={Metadata["wholesale"]["description"]}/>
            <meta property="og:title" content={Metadata["wholesale"]["title"]}/>
            <meta property="og:description" content={Metadata["wholesale"]["description"]}/>
        </Head>
            <h1 className="main-heading">Wholesale</h1>
            <p>We currently supply restaurants, cafe's, health stores and more with our mushrooms. We currently primarily operate within the South East but would be willing to deliver further for larger orders. If you would like a quote, please contact us using the form below.</p>
            <ContactForm/>
        </div>
    )
}
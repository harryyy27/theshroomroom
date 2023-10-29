import ContactForm from '../components/contactForm'
import Head from 'next/head';
import {Metadata} from '../utils/metadata/metadata';
export default function ContactUs(){
    return(
        <div className="static-container">
            <Head>
                <title>{Metadata["contact"]["title"]}</title>
                <meta name="description" content={Metadata["contact"]["description"]}/>
                <meta property="og:title" content={Metadata["contact"]["title"]}/>
                <meta property="og:description" content={Metadata["contact"]["description"]}/>
            </Head>
            <h1 className="main-heading">Contact Us</h1>
            <p>If you have any queries or suggestions, please don&apos;t hesitate to drop us a line</p>
            <ContactForm/>

        </div>
    )
}

import Head from 'next/head';
import {Metadata} from '../utils/metadata/metadata';
import Spinner from '../components/loadingIndicator';
export default function Privacy(){
    return(
        <div className="static-container">
            <Head>
                <title>{Metadata["privacy"]["title"]}</title>
                <meta name="description" content={Metadata["privacy"]["description"]}/>
                <meta property="og:title" content={Metadata["privacy"]["title"]}/>
                <meta property="og:description" content={Metadata["privacy"]["description"]}/>
            </Head>
            <Spinner />
            
        </div>


    )
    
}
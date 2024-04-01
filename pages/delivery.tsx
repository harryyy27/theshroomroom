import Head from 'next/head';
import {Metadata} from '../utils/metadata/metadata';
import ZedPostcodes from '../utils/zedPostcodes/postcodes'
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
                For the time being we will be limiting the delivery of fresh mushrooms to the postcodes listed at the bottom of this page. However, dried mushrooms and seasoning can be delivered to anywhere in the country. Deliveries will arrive in 1-4 working days.
            </p>
            <p>
                Please contact if you have any special enquiries.
            </p>
            <ul>
                <li>
                    <h2>Bristol</h2>
                    <p>
                {
                    ZedPostcodes.bristol.map((el:any,idx)=>{
                        return(
                            <span key={idx}>{el}  </span>
                        )
                    })
                }
                </p>
                </li>
                <li>
                    <h2>Brighton</h2>
                    <p>
                    {
                    ZedPostcodes.brighton.map((el:any,idx)=>{
                        return(
                            <span key={idx}>{el}  </span>
                        )
                    })
                }
                    </p>
                
                </li>
                <li>
                    <h2>London</h2>
                    <p>
                    {
                    ZedPostcodes.hoxton.map((el:any,idx)=>{
                        return(
                            <span key={idx}>{el} </span>
                        )
                    })
                }
                {
                    ZedPostcodes.battersea.map((el:any,idx)=>{
                        return(
                            <span key={idx}>{el} </span>
                        )
                    })
                }
                {ZedPostcodes.waltham_forest.map((el:any,idx)=>{
                        return(
                            <span key={idx}>{el} </span>
                        )
                    })}
                    </p>
                
                
                </li>
                <li>
                    <h2>Norwich</h2>
                    <p>
                    {
                        ZedPostcodes.norwich.map((el:any,idx)=>{
                            return(
                                <span key={idx}>{el} </span>
                            )
                        })
                    }
                    </p>
                    
                </li>
                <li>
                    <h2>Manchester</h2>
                    <p>
                    {
                        ZedPostcodes.manchester.map((el:any,idx)=>{
                            return(
                                <span key={idx}>{el} </span>
                            )
                        })
                    }
                    </p>
                </li>
                <li>
                    <h2>Cambridge</h2>
                    <p>
                    {
                        ZedPostcodes.cambridge.map((el:any,idx)=>{
                            return(
                                <span key={idx}>{el} </span>
                            )
                        })
                    }
                    </p>
                </li>
            </ul>
        </section>
        </div>
    )
}
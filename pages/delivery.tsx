import Head from 'next/head';
import {Metadata} from '../utils/metadata/metadata';
import ZedPostcodes from '../utils/zedPostcodes/postcodes'

import localPostcodes from '../utils/localPostcodes/postcodes'
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
            <p>
                We will exclusively deliver fresh mushrooms to Bromley and South East London (see postcodes below). However, dried mushrooms and seasoning can be delivered to anywhere in the country. Dried deliveries will arrive in 1-4 working days but fresh deliveries will be arrive within 1-2 working days and will be shipped the morning they are harvested.
            </p>
            <p>
                If you don't mind receiving fresh mushrooms via Royal Mail, please contact us to be added to an exemption list.
            </p>
            <p>
                Also, please contact if you have any other special enquiries.
            </p>
            <ul>
                {
                    Object.keys(localPostcodes).map((el:any,idx:number)=>{
                        return(
                            <li key={idx}>
                                {
                                el!=="exemption"?
                                <>
                                <h2>{el.split('_').join(' ')}</h2>
                                {
                                localPostcodes[el as keyof typeof localPostcodes].map((elPost:any,idx:any)=>{
                                        return(
                                            <span key={idx}>{elPost}  </span>
                                        )
                                    })
                                }
                                    </>:
                                    null
                                }
                            </li>
                        )
                    })
                }
                {/* <li>
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
                </li> */}
            </ul>
        </section>
        </div>
    )
}
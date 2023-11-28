
import Head from 'next/head';
import {Metadata} from '../../../utils/metadata/metadata';
import {useState,useEffect} from 'react';
import {useRouter} from 'next/router'
import Link from 'next/link'
export default function Thanks(){
    const router = useRouter();
    const [orderNumber,setOrderNumber]=useState('')
    const [date,setDate]=useState('');
    useEffect(()=>{
        if(router.query.id){
            var url = router.query.id as string;
            if(url.split('SKU-').length==2&&url.split('date').length==2){
                setOrderNumber(url.split('SKU-')[1].split('date')[0])
            }
            if(url.split('-date-')){
                setDate(url.split('-date-')[1])
            }
        }
    },[router])
    
    return(
        <div className="static-container">
            <Head>
                <title>{Metadata["thankyou"]["title"]}</title>
                <meta name="description" content={Metadata["thankyou"]["description"]}/>
                <meta property="og:title" content={Metadata["thankyou"]["title"]}/>
                <meta property="og:description" content={Metadata["thankyou"]["description"]}/>
            </Head>
            <h1 className="main-heading center">Thank You</h1>
            {
                orderNumber&&date?
                <div>

                    <p className="center"><b>Order number:</b> {orderNumber}</p>
                    <p className="center"><b>Date:</b> {date}</p>
                </div>
                :null 
            }
            
            <h2 className="static-para center"><i>Thank you for shopping at Mega Mushrooms. Tuck in</i></h2>
            <p className="link center"><Link href="/products">Continue shopping</Link></p>
        </div>


    )
    
}
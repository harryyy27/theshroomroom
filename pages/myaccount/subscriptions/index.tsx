import { getCsrfToken, getSession } from "next-auth/react";
import {Session} from 'next-auth';
import {useRouter} from "next/router";
import { useEffect,useState,FormEvent } from "react";
import authenticate from '../../../utils/authenticationRequired';
import Link from 'next/link';
import Head from 'next/head'
import {Metadata} from '../../../utils/metadata/metadata'
export default function MyAccountSubscriptions({setComponentLoading}:any){
    const [subscriptions,setSubscriptions]=useState([])
    const [error,setError]=useState<string|null>(null)
    const router = useRouter()
    useEffect(()=>{
        async function getSubscriptions(sesh:Session){
            try{
                setComponentLoading(true)
                const subscriptionData = await fetch(`/api/subscriptions/?user_id=${sesh.user.id}`,{
                    method:"GET"
                })
                const subscriptionDataJson = await subscriptionData.json()
                setSubscriptions(subscriptionDataJson.subscriptions.reverse())
                setComponentLoading(false)
            }
            catch(e:any){
                await fetch('/api/clientSideError',{
                    method:"POST",
                    headers: {
                        "csrfToken": await getCsrfToken() as string,
                        "client-error": "true"
                    },
                    body:JSON.stringify({
                        error:e.message,
                        stack:e.stack
                    })
                })
                setError(e)
                setComponentLoading(false)

            }

        }
        const initiate=async()=>{
            try{
                const sesh = await getSession()
                if(!sesh){
                    throw new Error("You should be logged in to view this page")
                }
                await getSubscriptions(sesh)

            }
            catch(e:any){
                console.log(e)
                router.push("/")
            }
        }
        initiate()
    },[router,setComponentLoading])
    
    return(
        <div className="static-container">

<Head>
            <title>{Metadata["general"]["title"]}</title>
                <meta name="description" content={Metadata["general"]["description"]}/>
                <meta property="og:title" content={Metadata["general"]["title"]}/>
                <meta property="og:description" content={Metadata["general"]["description"]}/>
            </Head>
        <h1 className="main-heading center">My Subscriptions</h1>
        {
        error?
            <p>{error}</p>:
            null    
        }
        {
            subscriptions&&subscriptions.length?
            subscriptions.map((el:any,idx)=>{
                return(
                    <Link key={idx }href={`/myaccount/subscriptions/${el._id}`}>
                    <div className={"order-sub-wrapper"+(idx%2==0?" order-sub-alt":"")}>
                        
                        <p>Subscription ID: {el.subscriptionId}</p>
                        <p>Subscription status: {el.status}</p>
                        <p>Date initiated: {el.dateOfPurchase}</p>
                        <ul>
                            {el.products.items.map((el_product:any,idxPr:number)=>{
                                return(
                                    <li key={idxPr}>
                                        <p><span>{el_product.name}</span><span> - £{el_product.price.toFixed(2)} {el_product.quantity>1?`x${el_product.quantity}`:''}</span></p>
                                    </li>
        
                                )
                            })}
                        </ul>
                        <p>Subtotal: £{el.subtotal.toFixed(2)}</p>
                        <p>Shipping cost: £{el.shippingCost.toFixed(2)}</p>
                        <p>Total: £{el.total.toFixed(2)}</p>
                        

                    </div>
                    </Link>
                )
            }):
            <p>You do not currently have any subscriptions. Would you like to <button style={{"display":"inline-block"}}className="cta"><Link href="/products">SHOP</Link></button></p>
        }

        </div>
    )
}
export async function getServerSideProps(ctx:any){

    return authenticate(ctx,({sesh}:any)=>{
        return {
            props: sesh
        }
    })
}
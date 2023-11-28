import { getCsrfToken, getSession } from "next-auth/react";
import {Session} from 'next-auth';
import {useRouter} from "next/router";
import { useEffect,useState,FormEvent } from "react";
import authenticate from '../../utils/authenticationRequired';
import Link from 'next/link';

export default function MyAccountOrders(){
    const [subscriptions,setSubscriptions]=useState([])
    const [cancelSubscriptionId,setCancelSubscriptionId]=useState('');
    const [cancelError, setCancelError]=useState<string|null>(null)
    const [error,setError]=useState<string|null>(null)
    const router = useRouter()
    useEffect(()=>{
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
    },[router])
    async function getSubscriptions(sesh:Session){
        try{
            const subscriptionData = await fetch(`/api/subscriptions/?id=${sesh.user.id}`,{
                method:"GET"
            })
            const subscriptionDataJson = await subscriptionData.json()
            setSubscriptions(subscriptionDataJson.subscriptions)

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

        }

    }
    async function cancelSubscription(e:FormEvent,idx:number){
        try{
                e.preventDefault()
                const csrftoken=await getCsrfToken()
                if(!csrftoken){
                    throw new Error("No csrfin here")
                }
                const res = await fetch('/api/subscriptions',{
                    method:"DELETE",
                    headers: {
                        csrftoken: csrftoken
                    },
                    body: JSON.stringify({
                        subscription_id: cancelSubscriptionId
                    })
                })
                const json = await res.json()
                console.log(json)
                if(json.success){
                    console.log('subscriptions here')
                    showCancelledModal(true,idx)
                }
                else {
                    setCancelError('Cancellation failed')
                }
            

        }
        catch(error:any){
            
            await fetch('/api/clientSideError',{
                method:"POST",
                headers: {
                    "csrfToken": await getCsrfToken() as string,
                    "client-error": "true"
                },
                body:JSON.stringify({
                    error:error.message,
                    stack:error.stack
                })
            })
            setError(error)
        }

    }
    function showModal(open:boolean,id:string,idx:number){
        try{
            console.log(`.SUBSCRIPTION_ACTIVE${idx}`)
            let modal = document.querySelectorAll(`.SUBSCRIPTION_ACTIVE${idx} .cancel-modal`)[0]

            console.log(modal)
            if(open){
                modal?.classList.remove("hidden")
                
            }
            else {
                modal?.classList.add("hidden")
            }
            setCancelSubscriptionId(id)

        }
        catch(e:any){

            setError(e)
        }
    }
    function showCancelledModal(open:boolean,idx:number){
        try{
            let modal = document.querySelectorAll(`.SUBSCRIPTION_ACTIVE${idx} .cancelled-modal`)[0]
            let cancelbtn= document.querySelectorAll(`.SUBSCRIPTION_ACTIVE${idx} .cta`)[0]
            console.log(modal)
            if(open){
                console.log('true')
                console.log(modal)
                modal?.classList.remove("hidden")
                cancelbtn?.classList.add("hidden")
                
            }
            else {
                console.log('false')
                modal?.classList.add("hidden")
            }

        }
        catch(e:any){

            setError(e)
        }
    }
    return(
        <div className="static-container">
        <h1 className="main-heading center">My Orders</h1>
        {
        error?
            <p>{error}</p>:
            null    
        }
        {
            subscriptions.length?
            subscriptions.map((el:any,idx)=>{
                return(
                    <div key={idx}>
                        
                        <p>Subscription ID: {el.subscriptionId}</p>
                        <p>Subscription status: {el.status}</p>
                        <p>Date initiated: {el.dateOfPurchase}</p>
                        <ul>
                            {el.products.items.map((el_product:any)=>{
                                return(
                                    <li>
                                        <p><span>{el_product.name}</span><span> - £{el_product.price}</span></p>
                                    </li>
        
                                )
                            })}
                        </ul>
                        <p>Subtotal: {el.subtotal}</p>
                        <p>Shipping cost: {el.shippingCost}</p>
                        <p>Total: {el.total}</p>
                        {
                            el.status === "SUBSCRIPTION_ACTIVE"?
                        <div className={el.status+idx}>
                            <button className="cta left" onClick={(e)=>{
                                showModal(true,el.subscriptionId,idx)
                            }}>Cancel</button>
                            <div className={`cancel-modal hidden`}>
                                <p>Are you sure you&apos;d like to cancel this subscription? If you would also like to cancel any orders generated by this subscription, please <Link className={"link"}href="/myaccount/orders">go to orders</Link>.</p>
                                <button onClick={(e)=>{
                                    cancelSubscription(e,idx)
                                    showModal(false,'',idx)
                                }}>Yes</button>
                                <button onClick={(e)=>{
                                    showModal(false,'',idx)
                                }}>No</button>
                                {
                                    cancelError?
                                    <p>{cancelError}</p>:null
                                }

                            </div> 
                            
                            <div className={'cancelled-modal hidden'}>
                                <p>Your subscription has been cancelled</p>
                                <button onClick={(e)=>{
                                    showCancelledModal(false,idx)
                                    router.reload()
                                }}>ok</button>
                            </div>             
                        </div>
                        :
                        null

                        }

                    </div>
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
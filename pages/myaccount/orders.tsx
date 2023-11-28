import { getCsrfToken, getSession } from "next-auth/react";
import {Session} from 'next-auth';
import {useRouter} from "next/router";
import { useEffect,useState,FormEvent } from "react";
import authenticate from '../../utils/authenticationRequired';
import Link from 'next/link';

export default function MyAccountOrders({setComponentLoading}:any){
    const [orders,setOrders]=useState([])
    const [cancelOrderId,setCancelOrderId]=useState('');
    const [cancelError, setCancelError]=useState<string|null>(null)
    const [error,setError]=useState<string|null>(null)
    const router = useRouter()
    useEffect(()=>{
        async function getOrders(sesh:Session){
            try{
                setComponentLoading(true)
                const orderData = await fetch(`/api/order/?id=${sesh.user.id}`,{
                    method:"GET"
                })
                const orderDataJson = await orderData.json()
                setOrders(orderDataJson.orders)
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
                setComponentLoading(false)
                setError(e)
    
            }
    
        }
        const initiate=async()=>{
            try{
                const sesh = await getSession()
                if(!sesh){
                    throw new Error("You should be logged in to view this page")
                }
                await getOrders(sesh)

            }
            catch(e:any){
                console.log(e)
                router.push("/")
            }
        }
        initiate()
    },[router,setComponentLoading])
    
    async function cancelOrder(e:FormEvent,idx:number){
        try{
            setComponentLoading(true)
            e.preventDefault()
            const csrftoken=await getCsrfToken()
            if(!csrftoken){
                throw new Error("No csrfin here")
            }
            const res = await fetch('/api/order',{
                method:"DELETE",
                headers: {
                    csrftoken: csrftoken
                },
                body: JSON.stringify({
                    _id: cancelOrderId
                })
            })
            const json = await res.json()
            if(json.success){
                showCancelledModal(true,idx)
            }
            else {
                setCancelError('Cancel fucked')
            }
            setComponentLoading(false)
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
            setComponentLoading(false)
            setError(error)
        }

    }
    function showModal(open:boolean,id:string,idx:number){
        try{
            let modal = document.querySelectorAll(`.ORDER_RECEIVED${idx} .cancel-modal`)[0]
            if(open){
                modal?.classList.remove("hidden")
                
            }
            else {
                modal?.classList.add("hidden")
            }
            setCancelOrderId(id)

        }
        catch(e:any){

            setError(e)
        }
    }
    function showCancelledModal(open:boolean,idx:number){
        try{
            let modal = document.querySelectorAll(`.ORDER_RECEIVED${idx} .cancelled-modal`)[0]
            let cancelbtn= document.querySelectorAll(`.ORDER_RECEIVED${idx} .cta`)[0]
            if(open){
                modal?.classList.remove("hidden")
                cancelbtn?.classList.add("hidden")
                
            }
            else {
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
            orders.length?
            orders.map((el:any,idx:number)=>{
                return(
                    <div key={idx}>
                        
                        <p>Subscription ID: {el._id}</p>
                        <p>Subscription status: {el.status}</p>
                        <p>Date initiated: {el.dateOfPurchase}</p>
                        <ul>
                            {el.products.items.map((el_product:any,idxPr:number)=>{
                                return(
                                    <li key={idxPr}>
                                        <p><span>{el_product.name}</span><span> - £{el_product.price}</span></p>
                                    </li>
        
                                )
                            })}
                        </ul>
                        <p>Subtotal: {el.subtotal}</p>
                        <p>Shipping cost: {el.shippingCost}</p>
                        <p>Total: {el.total}</p>
                        {
                            el.status === "ORDER_RECEIVED"?
                        <div className={el.status+idx}>
                            <button className="cta left" onClick={(e)=>{
                                showModal(true,el._id,idx)
                            }}>Cancel</button>
                            <div className={`cancel-modal hidden`}>
                                <p>Are you sure you&apos;d like to cancel this order?</p>
                                <button onClick={(e)=>{
                                    cancelOrder(e,idx)
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
                                <p>Your order has been cancelled</p>
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
            <p>You do not currently have any orders. Would you like to <button style={{"display":"inline-block"}}className="cta"><Link href="/products">SHOP</Link></button></p>
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
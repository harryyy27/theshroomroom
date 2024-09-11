import {useContext,useEffect,useState} from 'react';
import {CartContext} from '../context/cart'
import Link from 'next/link';
import {Metadata} from '../utils/metadata/metadata';
import {getSession} from 'next-auth/react'

import saleDates from '../utils/saleDates/saleDates';
import Head from 'next/head';
import CartElement from '../components/cartElement'

export default function Cart({setComponentLoading}:any){
    let context=useContext(CartContext)
    const [user,setUser]=useState(false);
    const [isSale,setIsSale]=useState(false);
    useEffect(()=>{
        setComponentLoading(true)
        const todayDate=Date.now()
        if(+new Date(saleDates.countdownDate)-todayDate<0 && +new Date(saleDates.saleEndDate)-todayDate>0){
            setIsSale(true)
        }
        async function initiate(){
            const session = await getSession()
            if(session?.user){
                setUser(true)
            }
            
            setComponentLoading(false)
        }
        initiate()
    },[setComponentLoading])

    return(
        <div className="static-container">
                    <Head>
                        <title>Mega Mushrooms - rare, healthy, London grown lion's mane mushrooms</title>
                        <meta name="description" content="Discover the Power of Lion's Mane Mushrooms! 🍄 Elevate your well-being with our premium Lion's Mane mushrooms - nature's brain booster and immunity enhancer. Handpicked for quality and potency, our organic Lion's Mane products are a natural path to mental clarity and vitality. Explore our range of fresh and dried Lion's Mane mushrooms today and experience the unmatched benefits of this extraordinary fungi. Your journey to optimal health starts here."/>
                        <meta property="og:title" content="Mega Mushrooms - buy our high quality lion's mane mushrooms here"/>
                        <meta property="og:description" content="Reap the rewards of adding this healthy, medicinal and delicious mushroom to your diet"/>
                    </Head>
                    {
                    context.state.cart.items.length?
                    <>
                    <h1 className="main-heading center">Cart</h1>
                        <div className="cart-summary">
                            <p><b>Sub-total: </b>{(!isSale?<span>£{String(Number(context.state.subTotal).toFixed(2))}</span>:<><span style={{textDecoration:"line-through"}}>£{String(Number(context.state.subTotal).toFixed(2))}</span><span style={{marginLeft:"0.25rem",color:"red",fontWeight:"700"}}>£{String((Number(context.state.subTotal)*0.9).toFixed(2))}</span></>)}</p>
                            <button disabled={!context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)} className={`cta ${!context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)?"button-disabled":""}`}><Link  href="/checkout"><span id="checkoutSide">One Time Purchase</span></Link></button>
                            {
                                user?
                                <>
                                <button style={{"marginTop":"1rem"}}disabled={!context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)} className={`cta ${!context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)?"button-disabled":""}`}><Link  href="/checkout?subscription=true"><span id="subscriptionSide">Receive monthly</span></Link></button>
                                </>:
                                null
                            }
                            
                            {
                                !context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)?<p>Please delete the unavailable items from your cart</p>:null
                            }
                
                        </div>
                        <div className="cart-header">
                            <ul className="cart-header-wrapper">
                                <li className="cart-header-element col-2">Name</li>
                                <li className="cart-header-element col-3">Quantity</li>
                                <li className="cart-header-element col-4">Price</li>
                            </ul>
                        </div>
                        <div className="cart-container">
                            { 
                            context&&context.state.cart&&context.state.cart.items?
                                context.state.cart.items.map(({_id,name,quantity,price,fresh,size,stripeProductId,stripeId,stockAvailable},idx:number)=>{
                                    return(
                                        <CartElement key={idx} _id={_id} idx={idx} name={name}quantity={quantity} price={price} fresh={fresh} size={size} stripeProductId={stripeProductId} stripeId={stripeId} stockAvailable={stockAvailable}  />
                                    )}
                                )
                                :null
                            }
                        </div>
                        
                            </>
                        :
                        <h2>PLEASE ADD SOME SHROOMS TO YOUR BASKET</h2>}
                        </div>
    )
}
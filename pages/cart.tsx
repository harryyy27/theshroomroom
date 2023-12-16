import {useContext,useEffect,useState} from 'react';
import {CartContext} from '../context/cart'
import Link from 'next/link';
import {Metadata} from '../utils/metadata/metadata';
import {getSession} from 'next-auth/react'

import Head from 'next/head';
import CartElement from '../components/cartElement'

export default function Cart({setComponentLoading}:any){
    let context=useContext(CartContext)
    const [user,setUser]=useState(false);
    const [itemsUnavailable,setItemsUnavailable]=useState(true);
    function handleItemsAvailable(){
        console.log(console.log(context.state.cart.items))
        if(context.state.cart.items.every((el:any)=>{
            console.log(el.stockAvailable)
            console.log(el.quantity)
            return el.stockAvailable>=el.quantity
        })){
            console.log('set false')
            setItemsUnavailable(false)
        }
        else{
            console.log('set true')
            setItemsUnavailable(true)
        }
    }
    useEffect(()=>{
        setComponentLoading(true)
        async function initiate(){
            const session = await getSession()
            if(session?.user){
                setUser(true)
            }
            handleItemsAvailable()
            
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
                    <div>
                    <h1 className="main-heading center">Cart</h1>
                        <div >
                        <div className="cart-summary">
                            <p><b>Sub-total: </b>{"£"+String(context.state.subTotal)}</p>
                            <button disabled={!context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)} className={`cta ${!context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)?"button-disabled":""}`}><Link  href="/checkout"><span id="checkoutSide">Checkout</span></Link></button>
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
                                context.state.cart.items.map(({_id,name,quantity,price,fresh,size,stripeProductId,stockAvailable},idx:number)=>{
                                    return(
                                        <CartElement key={idx} _id={_id} idx={idx} name={name}quantity={quantity} price={price} fresh={fresh} size={size} stripeProductId={stripeProductId} stockAvailable={stockAvailable} handleItemsAvailable={handleItemsAvailable} />
                                    )}
                                )
                                :null
                            }
                        </div>
                        <p className="total-text"><b>Sub-total: </b>{"£"+String(context.state.subTotal)}</p>
                        <button disabled={!context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)} className={`cta ${!context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)?"button-disabled":""}`}><Link  href="/checkout"><span id="checkout">Checkout</span></Link></button>
                        {
                                !context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)?<p className="items-unavailable-cart">Please delete the unavailable items from your cart</p>:null
                        }
                            </div>
                            </div>
                        :
                        <h2>PLEASE ADD SOME SHROOMS TO YOUR BASKET</h2>}
                        </div>
    )
}
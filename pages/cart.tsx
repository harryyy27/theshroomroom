import {useContext,useEffect,useState} from 'react';
import LoadingIndicator from '../components/loadingIndicator'
import {getSession} from 'next-auth/react'
import {CartContext} from '../context/cart'
import Link from 'next/link';
import Image from 'next/image';
import {imageMap} from '../utils/imageMap/imageMap';
import {Metadata} from '../utils/metadata/metadata';
import Head from 'next/head';
interface Product{
    _id:String,
    name: string,
    quantity:number,
    price: number,
    fresh:boolean,
    size:number,
    image:string
}
export default function Cart(){
    let context=useContext(CartContext)

    return(
        <div className="static-container">
                    <Head>
                        <title>Mycotanical garden - rare, healthy, London grown lion's mane mushrooms</title>
                        <meta name="description" content="Discover the Power of Lion's Mane Mushrooms! 🍄 Elevate your well-being with our premium Lion's Mane mushrooms - nature's brain booster and immunity enhancer. Handpicked for quality and potency, our organic Lion's Mane products are a natural path to mental clarity and vitality. Explore our range of fresh and dried Lion's Mane mushrooms today and experience the unmatched benefits of this extraordinary fungi. Your journey to optimal health starts here."/>
                        <meta property="og:title" content="Mycotanical garden - buy our high quality lion's mane mushrooms here"/>
                        <meta property="og:description" content="Reap the rewards of adding this healthy, medicinal and delicious mushroom to your diet"/>
                    </Head>
                    {
                    context.state.cart.items.length?
                    <div>
                    <h1 className="main-heading center">BASKET CASE</h1>
                        <div >
                        <div className="cart-summary">
                            <p><b>Sub-total: </b>{"£"+String(context.state.subTotal)}</p>
                            <button className="cta"><Link  href="/checkout"><span id="checkout">Checkout</span></Link></button>

                        </div>
                        <div className="cart-container">
                            { 
                            context&&context.state.cart&&context.state.cart.items?
                                context.state.cart.items.map(({_id,name,quantity,price,fresh,size},idx:number)=>{
                                    return(
                                        <div className="cart-wrapper"key={idx}>
                                            <div className="cart-left">
                                                
                                                {
                                                    name?

                                                    <Image className="cart-product-image"  fill sizes={`(max-width:767px) 50vw,(min-width:767px) ${imageMap[name].width}px`} src={`${imageMap[name].path}.${imageMap[name].fileType}`} alt={name}/>
                                                    :
                                                    null
                                                }
                                            </div>
                                            <div className="cart-right">

                                                <h2 className="cart-product-name">{fresh?"Fresh ":"Dry "}{name}{` ${size}`}</h2>
                                                <div>
                                                <span><b>Qty:</b> </span><select className="product-quantity"id={`quantity${idx}`}name={"quantity"} defaultValue={String(quantity)}>
                                                {
                                                    [1,2,3,4,5,6,7,8,9,10].map((el:number)=>{
                                                        return (
                                                            <option key={String(el)}value={String(el)}>{String(el)}</option>
                                                        )
                                                    })
                                                }

                                            </select>
                                            </div>
                                            <div>
                                            <button className="cart-btn" onClick={async(e)=>{
                                                const input = document.getElementById(`quantity${idx}`) as HTMLInputElement
                                                context.saveCart?
                                                context.saveCart({
                                                    _id:_id,
                                                    name:name,
                                                    fresh:fresh,
                                                    size:size,
                                                    quantity:Number(input.value),
                                                    price:Number(price)
                                                }):null}
                                            }>Save</button>
                                            <button className="cart-btn"onClick={async(e)=>{
                                                context.saveCart?
                                                context.saveCart({
                                                    _id:_id,
                                                    name:name,
                                                    fresh:fresh,
                                                    size:size,
                                                    quantity:0,
                                                    price: Number(price)
                                                }):null}
                                            }>Delete</button>
                                            </div>
                                            <p className="product-price"><b>Price: </b> £{quantity*price}</p>
                                            </div>
                                        </div>
                                    )}
                                )
                                :null
                            }
                        </div>
                        <p className="total-text"><b>Sub-total: </b>{"£"+String(context.state.subTotal)}</p>
                      
                            </div>
                            </div>
                        :
                        <h2>PLEASE ADD SOME SHROOMS TO YOUR BASKET</h2>}
                        </div>
    )
}
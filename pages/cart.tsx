import { ifError } from 'assert';
import {useContext,useEffect,useState} from 'react';
import LoadingIndicator from '../components/loadingIndicator'
import {getSession} from 'next-auth/react'
import {CartContext} from '../context/cart'
import Link from 'next/link'

export default function Cart(){
    let context=useContext(CartContext)
    useEffect(()=>{
        console.log(context)
        console.log(context.cart.items)
    })

    return(
        <>
                    <h1>BASKET PAGE</h1>
                    {
                        context.loaded?
                        <div>
                            {
                            context.cart.items.map(({_id,name,quantity,price},idx:Number)=>{
                                console.log(name)
                                return(
                                    <div key={String(idx)}>
                                        <h2>{name}</h2>
                                        <select id={`quantity${idx}`}name={"quantity"} defaultValue={String(quantity)}>
                                            {
                                                [1,2,3,4,5,6,7,8,9,10].map((el:Number)=>{
                                                    return (
                                                        <option value={String(el)}>{String(el)}</option>
                                                    )
                                                })
                                            }

                                        </select>
                                        <p>price</p><p>{quantity*price}</p>
                                        <button onClick={async(e)=>{
                                            const session = await getSession()
                                            console.log("id",_id)
                                            context.saveCart(e,{
                                                _id:_id,
                                                name:name,
                                                quantity:document.getElementById(`quantity${idx}`).value,
                                                price:price,
                                            })}
                                        }>Save</button>
                                        <button onClick={async(e)=>{
                                            const session = await getSession()
                                            console.log("id",_id)
                                            context.saveCart(e,{
                                                _id:_id,
                                                name:name,
                                                quantity:0,
                                                price: price
                                            })}
                                        }>Delete</button>
                                    </div>
                                )
                            })
                        }
                        <p>sub total</p>
                        <p>{String(context.subTotal)}</p>
                        <p>shipping</p>
                    <p>{String(context.shipping)}</p>
                        <p>total</p>
                        <p>{String(context.total)}</p>
                        <Link href="/checkout">Checkout</Link>
                            </div>
                            :
                            <p>Your basket is empty, please return to the products page and get some shrooms</p>
                            
                    }
                   
        </>
    )
}
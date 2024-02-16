import Image from 'next/image'
import {useContext,useState,useEffect} from 'react';
import {CartContext} from '../context/cart'
import {imageMap} from '../utils/imageMap/imageMap';
import Link from 'next/link'
interface Product{
    _id:String,
    idx:number,
    name: string,
    quantity:number,
    price: number,
    fresh:boolean,
    size:string,
    stripeProductId:string,
    stockAvailable:number
}
export default function CartElement({_id,idx,name,quantity,price,fresh,size,stripeProductId,stockAvailable}:any){
    let context=useContext(CartContext)
    
    
    return(
        <div className={`cart-wrapper ${stockAvailable<quantity?"cart-out-of-stock":""}`}>
            <div className="cart-left">
                
                {
                    name?
                    <Link  href={`/products/${name.replace(/[\s]/gi,'-')}`} ><Image className="cart-product-image"  fill sizes={`(max-width:767px) 50vw,(min-width:768px) ${imageMap[name].width}px`} src={`${imageMap[name].path}_${fresh?"fresh":"dry"}.${imageMap[name].fileType}`} priority alt={name}/></Link>
                    :
                    null
                }
            </div>
            <div className="cart-right">

                <h2 className="cart-product-name col-1">{fresh?"Fresh ":"Dry "}{name}{` ${size}`}</h2>
                <div className="quantity-wrapper col-2">
                <select className="product-quantity col-3"id={`quantity${idx}`}name={"quantity"} defaultValue={String(quantity)} onChange={(e)=>{
                    if(context.saveCart){
                        context.saveCart({
                            _id:_id,
                            name:name,
                            fresh:fresh,
                            size:size,
                            quantity:Number(e.target.value),
                            price: Number(price),
                            stripeProductId:stripeProductId,
                            stockAvailable:stockAvailable
                        })
                    }
                }}>
                {
                    [1,2,3,4,5,6,7,8,9,10].map((el:number)=>{
                        return (
                            <option key={String(el)}value={String(el)}>{String(el)}</option>
                        )
                    })
                }

            </select>
            </div>
            
            <p className="product-price col-3">£{quantity*price}</p>

            <div className="col-4">
            <button className="cart-btn"onClick={async(e)=>{
                if(context.saveCart){
                    context.saveCart({
                        _id:_id,
                        name:name,
                        fresh:fresh,
                        size:size,
                        quantity:0,
                        price: Number(price),
                        stripeProductId:stripeProductId,
                        stockAvailable:stockAvailable
                    })
                }
                
            }
            }>Delete</button>
            </div>
            {
                stockAvailable===0?
                <p>This product is currently unavailable.</p>
                :
                stockAvailable<quantity
                ?
                <p>This product is not available in the quantity you desire</p>
                :null
            }
            </div>
        </div>
    )
}
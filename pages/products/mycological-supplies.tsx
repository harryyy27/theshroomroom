import Link from 'next/link'
import Image from 'next/image'
import {useEffect, useState, FormEvent,useContext} from 'react';
import { getSession,useSession } from 'next-auth/react';
import {CartContext} from '../../context/cart';
import {imageMap} from '../imageMap/imageMap'

interface ProductInterface{
    name:String;
    description: String;
    price: Number;
    quantity: Number;
    
}
export default function Product(props:{mushrooms:ProductInterface[]}){
    const [products,setProducts]=useState<ProductInterface[]>([])
    console.log(products)
    useEffect(()=>{
        setProducts(props.mushrooms)

    },[])
    const context=useContext(CartContext)
    return(
        <>
        <h1>Productttttt</h1>

        <p>Liquid cultures, agar... whatever tickles your pickle</p>
        {
            products&&products.length>0?
        <ul>
        {
            products.map(({_id,name,description,price}:any,idx)=>{
                return(
                    <div key={idx}>
                        <Link  href={`/products/${name.replace(/[\s]/gi,'-').replace(/['\'']/gi,'&apos')}`} >
                            <a>
                                <h2>{name}</h2>

                                {
                                    name?

                                    <Image width={imageMap[name].width} height={imageMap[name].height} src={`${imageMap[name].path}.${imageMap[name].fileType}`}/>
                                    :
                                    null
                                }

                            </a>
                        </Link>
                            <p>£{price}</p>
                            <p>{description}</p>
                        <select id={`quantity${idx}`}name={"quantity"}>
                            {
                                [1,2,3,4,5,6,7,8,9,10].map((el:Number)=>{
                                    return (
                                        <option value={String(el)}>{String(el)}</option>
                                    )
                                })
                            }

                        </select>
                        
                        <button onClick={async(e)=>{
                            const session = await getSession()
                            console.log("id",_id)
                            const input = document.getElementById(`quantity${idx}`) as HTMLInputElement;
                            context.saveCart? context.saveCart({
                                _id:_id,
                                name:name,
                                quantity:Number(input.value),
                                price: Number(price)
                            }):null}
                        }>Add to basket</button>

                    </div>
                )
            })
        }

        </ul>:
        <p>Unusual this, but nothing available</p>
    }
        </>
    )
}
export async function getServerSideProps(){
    const data= await fetch(`http://localhost:3000/api/products?type=mycological-supplies`)
    const res = await data.json()
   
    return {
        props:{
            mushrooms:[...res]
        }
    }
}
import Link from 'next/link'
import Image from 'next/image'
import {useEffect, useState, FormEvent,useContext} from 'react';
import { getSession,useSession } from 'next-auth/react';
import {CartContext} from '../../context/cart'

interface ProductInterface{
    name:String;
    description: String;
    price: Number;
    quantity: Number;
    
}
export default function Product(props){
    const [products,setProducts]=useState([])
    useEffect(()=>{
        setProducts(props.mushrooms)

    },[])
    const context=useContext(CartContext)
    return(
        <>
        <h1>Productttttt</h1>
        <ul>
        {
            products.map(({_id,name,description,price}:any,idx)=>{
                return(
                    <div key={idx}>
                        <Link  href={`product/${name}`} >
                            <a>
                                <h2>{name}</h2>

                            </a>
                        </Link>
                            <p>{price}</p>
                            <p>{description}</p>
                        <select id={`quantity${idx}`}name={"quantity"}>
                            {
                                [1,2,3,4,5,6,7,8,9,10].map((el:Number)=>{
                                    return (
                                        <option value={el}>{el}</option>
                                    )
                                })
                            }

                        </select>
                        <button onClick={async(e)=>{
                            const session = await getSession()
                            console.log("id",_id)
                            context.saveCart(e,{
                                _id:_id,
                                name:name,
                                quantity:Number(document.getElementById(`quantity${idx}`).value),
                                price: Number(price)
                            })}
                        }>Add to basket</button>

                    </div>
                )
            })
        }

        </ul>
        </>
    )
}
export async function getServerSideProps(){
    const data= await fetch(`http://localhost:3000/api/products/`)
    const res = await data.json()
   
    return {
        props:{
            mushrooms:[...res]
        }
    }
}
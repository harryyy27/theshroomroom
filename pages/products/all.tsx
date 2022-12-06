import Link from 'next/link'
import Image from 'next/image'
import {useEffect, useState, useContext} from 'react';
import {CartContext} from '../../context/cart';
import {imageMap} from '../../utils/imageMap/imageMap'

interface ProductInterface{
    name:String;
    description: String;
    price: Number;
    quantity: Number;
    
}
export default function Product(props:{mushrooms:ProductInterface[]}){
    const [products,setProducts]=useState<ProductInterface[]>([])
    const [filteredProducts,setFilteredProducts]=useState<ProductInterface[]>([])
    useEffect(()=>{
        setProducts(props.mushrooms)
        setFilteredProducts(products)
    },[])
    const context=useContext(CartContext)
    return(
        <>
        <h1>All products</h1>
        
        {/* <select id={`quantity${idx}`}name={"quantity"}>
                            {
                                [1,2,3,4,5,6,7,8,9,10].map((el:Number)=>{
                                    return (
                                        <option value={String(el)}>{String(el)}</option>
                                    )
                                })
                            }

                        </select> */}
        {
            products&&products.length>0?
        <ul>
        {
            products.length?products.map(({_id,name,description,price}:any,idx)=>{
                return(
                    <div className="product" key={name}>
                        <Link  href={`/products/${name.replace(/[\s]/gi,'-').replace(/['\'']/gi,'&apos')}`} >
                            <a>
                                <h2 className="product-name">{name}</h2>

                                {
                                    name?

                                    <Image className="product-image"  width={imageMap[name].width} height={imageMap[name].height} src={`${imageMap[name].path}.${imageMap[name].fileType}`} alt={name}/>
                                    :
                                    null
                                }

                            </a>
                        </Link>
                            <p className="product-price">£{price}</p>
                            <p className="product-description">{description}</p>
                        <select className="product-quantity" id={`quantity${idx}`}name={"quantity"} >
                            {
                                [1,2,3,4,5,6,7,8,9,10].map((el:Number,idxSelect)=>{
                                    return (
                                        <option className="product-quantity-options" key={String(el)}value={String(el)}>{String(el)}</option>
                                    )
                                })
                            }

                        </select>
                        
                        <button onClick={async(e)=>{
                            const input = document.getElementById(`quantity${idx}`) as HTMLInputElement;
                            context.saveCart? context.saveCart({
                                _id:_id,
                                name:name,
                                quantity:Number(input.value),
                                price: Number(price)
                            }):null}
                        }
                        className="product-add-to-cart-button"
                        >Add to basket</button>

                    </div>
                )
            }):null
        }

        </ul>:
        <p id="noProducts">No products available.</p>
    }
        </>
    )
}
export async function getServerSideProps(ctx:any){
    const {req,res} = ctx
    console.log('EVEN MORE PRE CONNECT')
    console.log(req.headers.host)
    try {
        const data= await fetch(`http://${req.headers.host}/api/products/`)
        var response = await data.json()
    
       

    }
    catch(e:any){
        console.log('error yo',e)
    }
    return {
        props:{
            mushrooms:[...response]
        }
    }
}
import Link from 'next/link'
import Image from 'next/image'
import {useEffect, useState, useContext} from 'react';
import {CartContext} from '../../context/cart';
import {imageMap} from '../../utils/imageMap/imageMap'
import Head from 'next/head';
import {Metadata} from '../../utils/metadata/metadata'
interface ProductInterface{
    name:String;
    description: String;
    price_fresh_100g: Number;
    quantity: Number;
    
}
export default function Product(props:{mushrooms:ProductInterface[]}){
    const [products,setProducts]=useState<ProductInterface[]>([])
    const [filteredProducts,setFilteredProducts]=useState<ProductInterface[]>([])
    useEffect(()=>{
        setProducts(props.mushrooms)
        setFilteredProducts(products)
    },[products,props.mushrooms])
    const context=useContext(CartContext)
    return(
        <div className="static-container">
            <Head>
            <title>{Metadata["plp"]["title"]}</title>
            <meta name="description" content={Metadata["plp"]["description"]}/>
            </Head>
        <h1 className="main-heading">All products</h1>
        <p></p>
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
            <>
        <ul className="product-list">
        {
            products.length?products.map(({_id,name,price}:any,idx)=>{
                return(
                    <li className="product" key={name}>
                        <Link  href={`/products/${name.replace(/[\s]/gi,'-')}`} >
                            <span>
                                <h2 className="product-name">{name}</h2>
                                <figure className="plp-image-wrapper">
                                {
                                    name?

                                    <Image className="product-image" priority blurDataURL={`${imageMap[name].path}.${imageMap[name].fileType}`} fill sizes={`(min-width:768px) ${imageMap[name].width}px, (max-width:767px): 40vw`} src={`${imageMap[name].path}.${imageMap[name].fileType}`} alt={name+ " mushrooms"}/>
                                    :
                                    null
                                }
                                </figure>

                            </span>
                        </Link>
                            <p className="product-price">£{price}</p>
                        {/* <select className="product-quantity" id={`quantity${idx}`}name={"quantity"} >
                            {
                                [1,2,3,4,5,6,7,8,9,10].map((el:Number,idxSelect)=>{
                                    return (
                                        <option className="product-quantity-options" key={String(el)}value={String(el)}>{String(el)}</option>
                                    )
                                })
                            }

                        </select> */}
                        
                        {/* <button 
                            className="cta"
                            onClick={async(e)=>{
                            const input = document.getElementById(`quantity${idx}`) as HTMLInputElement;
                            context.saveCart? context.saveCart({
                                _id:_id,
                                name:name,
                                quantity:Number(input.value),
                                price: price_100g
                            }):null}
                        }
                        >Add to basket</button> */}

                    </li>
                )
            }):null
        }

        </ul>
        {/* <p className="total-products-text">{products.length<10?`${products.length}/${products.length} products`:`10/${products.length}`}</p> */}
        </>
        :
        <p id="noProducts">No products available.</p>
    }
        </div>
    )
}
export async function getServerSideProps(ctx:any){
    const {req,res} = ctx
    
    try {
        const data= await fetch(`http://${req.headers.host}/api/products/`)
        var response = await data.json()
        if(response){
            var resp = response.reduce((acc:any,b:any)=>{
                for(var i = 0;i<acc.length;i++){
                    if(acc[i].name===b.name){
                        if(acc[i].price>b.price){
                            return [...acc.slice(0,i),b,...acc.slice(i+1,acc.length)]
                        }
                        else{
                            return acc
                        }
                    }
                }
                return [...acc,b]
            },[])
    }
        
        else {
            var resp = response
        }
    }

    catch(e:any){
        console.log('error yo',e)
    }
    return {
        props:{
            mushrooms:[...resp]
        }
    }
}
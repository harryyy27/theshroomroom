import Link from 'next/link'
import Image from 'next/image'
import {useEffect, useState, useContext} from 'react';
import {CartContext} from '../../context/cart';
import {imageMap} from '../../utils/imageMap/imageMap'
import Head from 'next/head';
import {Metadata} from '../../utils/metadata/metadata'
import saleDates from '../../utils/saleDates/saleDates';
interface ProductInterface{
    _id:String;
    name:String;
    description: String;
    price_fresh_100g: Number;
    quantity: Number;
    new: Boolean;
    
}
export default function Product(props:{mushrooms:ProductInterface[]}){
    const [products,setProducts]=useState<ProductInterface[]>([])
    const [isSale,setIsSale]=useState(false);
    const [filteredProducts,setFilteredProducts]=useState<ProductInterface[]>([])
    useEffect(()=>{
        setProducts(props.mushrooms)
        setFilteredProducts(products)
        const todayDate=Date.now()
        if(+new Date(saleDates.countdownDate)-todayDate<0 && +new Date(saleDates.saleEndDate)-todayDate>0){
            setIsSale(true)
        }
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
            products.length?products.map(({_id,name,price,fresh,new_product}:any,idx)=>{
                var fullName=(fresh?"Fresh ":"Dried ")+name
                return(
                    <li className="product" key={idx}>
                        <Link  href={`/products/${fullName.replace(/[\s]/gi,'-')}`} >
                            <span>
                                <h2 className="product-name">{fullName}</h2>
                                <figure className="plp-image-wrapper">
                                {
                                    name&&imageMap[fullName]!==undefined?

                                    <Image className="product-image" priority blurDataURL={`${imageMap[fullName].path}.${imageMap[fullName].fileType}`} fill sizes={`(min-width:768px) ${imageMap[fullName].width}px, (max-width:767px): 40vw`} src={`${imageMap[fullName].path}.${imageMap[fullName].fileType}`} alt={fullName+ " mushrooms"}/>
                                    :
                                    null
                                }
                                </figure>

                            </span>
                        </Link>
                        {
                            new_product?
                            <h2 className="new">NEW!</h2>:
                            null
                        }
                            <p className="product-price">{!isSale?<span>£{Number(price).toFixed(2)}</span>:<><span style={{textDecoration:"line-through"}}>£{Number(price).toFixed(2)}</span><span style={{marginLeft:"0.25rem",color:"red",fontWeight:"700"}}>£{Number(price*0.9).toFixed(2)}</span></>}</p>
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
        response=response.filter((el:any)=>el.name!=="Shipping")
        if(response){
            var resp = response.reduce((acc:any,b:any)=>{
                for(var i = 0;i<acc.length;i++){
                    var acc_name = (acc[i].fresh?"Fresh ":"Dried ")+acc[i].name
                    var b_name = (b.fresh?"Fresh ":"Dried ")+b.name
                    if(acc_name===b_name){
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
            const prods=resp.map((el:any)=>{
                el["new_product"]=el["new"]
            })
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
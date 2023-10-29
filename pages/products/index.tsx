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
        <p>Welcome to Mycotanical Garden, where nature's wonders meet cutting-edge wellness. We take immense pride in curating and cultivating the finest Lion's Mane mushrooms, revered for their extraordinary health benefits and exquisite flavor. At the heart of our garden, nestled among verdant greens and thriving mycelium, our Lion's Mane mushrooms are meticulously grown, harvested, and prepared with utmost care.\n\nOur commitment to quality knows no bounds. Each batch of Lion's Mane undergoes rigorous testing, ensuring purity and potency. With their rich nutty taste and a myriad of health-enhancing compounds, our Lion's Mane mushrooms are not just a culinary delight but also a pathway to enhanced cognitive function, immune support, and overall well-being.\n\nExplore our virtual garden, where you can discover the allure of Lion's Mane mushrooms. From our sustainable cultivation practices to our dedication to preserving the environment, Mycotanical Garden stands as a testament to the harmonious coexistence of humans and fungi. Delve into a world where tradition meets innovation, and let the power of Lion's Mane mushrooms enrich your life. \n\nJoin us on this remarkable journey, and let the legacy of Lion's Mane mushrooms unfold in your daily rituals. Mycotanical Garden: Nurturing Nature, Nourishing Lives.</p>
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
            products.length?products.map(({_id,name,price_fresh_100g}:any,idx)=>{
                return(
                    <li className="product" key={name}>
                        <Link  href={`/products/${name.replace(/[\s]/gi,'-')}`} >
                            <span>
                                <h2 className="product-name">{name}</h2>
                                <figure className="plp-image-wrapper">
                                {
                                    name?

                                    <Image className="product-image" priority blurDataURL={`${imageMap[name].path}.${imageMap[name].fileType}`} fill sizes={`(min-width:768px) ${imageMap[name].width}px, (max-width:767px): 40vw`} src={`${imageMap[name].path}.${imageMap[name].fileType}`} alt={name}/>
                                    :
                                    null
                                }
                                </figure>

                            </span>
                        </Link>
                            <p className="product-price">£{price_fresh_100g}</p>
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
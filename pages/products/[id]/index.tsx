import {useEffect,useState,useContext} from 'react';
import Image from 'next/image';
import {imageMap} from '../../../utils/imageMap/imageMap';
import {CartContext} from '../../../context/cart';
import Head from 'next/head';
import {Metadata} from '../../../utils/metadata/metadata';
import Link from 'next/link'
import {getSession,getCsrfToken}from 'next-auth/react'
interface Product {
    _id:string,
    name:string,
    description:string,
    product_type:string,
    stock_available:number,
    mass:string,
    price:number,
    stripe_product_id:string,
    fresh:boolean,
}
export default function ProductDetails({setComponentLoading}:any){
    const context = useContext(CartContext);
    const [product,setProduct]=useState<Product[]>([])
    const [freshSizeList,setFreshSizeList]=useState<string[]>([])
    const [drySizeList,setDrySizeList]=useState<string[]>([])
    const [name,setName]=useState('');
    const [description,setDescription]=useState('');
    const [imageUrl,setImageUrl]=useState('');
    const [type,setType]=useState('');
    const [stockAvailable,setStockAvailable]=useState(1);
    const [price,setPrice]=useState('');
    const [productAvailable,setProductAvailable]=useState(true)
    const [id,setId]=useState('');
    const [fresh,setFresh]=useState(true);
    const [size,setSize]=useState('');
    const [qty,setQty]=useState(1);
    const [user,setUser]=useState(false);
    const [stripeProductId,setStripeProductId]=useState('');
    const [itemsAvailable,setItemsAvailable]=useState(false);
    const [err,setErr]=useState('');

    useEffect(()=>{
        setComponentLoading(true)
        const urlArr =window.location.href.split('/')
        const productName = urlArr[urlArr.length-1].replace(/[\-]/gi,' ').replace('\&apos','\'');
        setImageUrl(urlArr[urlArr.length-1].replace(/[\-]/gi,'_').replace('\&apos','').toLowerCase());
        const initiate = async()=>{
            const session = await getSession()
            if(session?.user){
                setUser(true)
            }
            const productDetailsJson = await fetch(`/api/products?product=${productName}`)
            const productDetails = await productDetailsJson.json()
            const freshList:string[] = []
            const dryList:string[] = []
            productDetails.forEach((el:any)=>{
                if(el.fresh){
                    freshList.push(el.mass);
                }
                else {
                    dryList.push(el.mass)
                }
            })
            freshList.sort((a:string,b:string)=>{
                if(a.slice(-2)==='kg'&&b.slice(-2)==='kg'){
                    return Number(a.slice(0,a.length-2))-Number(b.slice(0,b.length-2))
                }
                else if(a.slice(-2)==='kg'&&b.slice(-2)!=='kg'){
                    return Number(a.slice(0,a.length-2))*1000-Number(b.slice(0,b.length-1))
                }
                else if(a.slice(-2)!=='kg'&&b.slice(-2)==='kg'){
                    return Number(a.slice(0,a.length-1))-Number(b.slice(0,b.length-2))*1000

                }
                else {

                    return Number(a.slice(0,a.length-1))-Number(b.slice(0,b.length-1))
                }
            })
            dryList.sort((a:string,b:string)=>{
                if(a.slice(-2)==='kg'&&b.slice(-2)==='kg'){
                    return Number(a.slice(0,a.length-2))-Number(b.slice(0,b.length-2))
                }
                else if(a.slice(-2)==='kg'&&b.slice(-2)!=='kg'){
                    return Number(a.slice(0,a.length-2))*1000-Number(b.slice(0,b.length-1))
                }
                else if(a.slice(-2)!=='kg'&&b.slice(-2)==='kg'){
                    return Number(a.slice(0,a.length-1))-Number(b.slice(0,b.length-2))*1000

                }
                else {

                    return Number(a.slice(0,a.length-1))-Number(b.slice(0,b.length-1))
                }
            })
            setFreshSizeList(freshList)
            setDrySizeList(dryList)
            if(productDetails.every((el:string)=>productDetails.stock_available===0)){
                setItemsAvailable(false)
                setProductAvailable(false)
            }
            else{
                setItemsAvailable(true)
            }
            setProduct(productDetails)
            setName(productDetails[0].name);
            setDescription(productDetails[0].description);
            setType(productDetails[0].type)
            setComponentLoading(false)



        }
        initiate()


    },[setComponentLoading])
    function toggleBackground(button:HTMLElement | null,targetClass:string){
        const buttons= document.querySelectorAll('.'+targetClass);
        buttons.forEach((el)=>el.classList.remove('select-active'));
        buttons.forEach((el)=>el.ariaSelected="false");
        if(button){
            button.classList.add("select-active")
            button.ariaSelected="true"
        }
    }
    return(
        <div className="product-container">
        <Head>
            <title>{Metadata["pdp"]["title"]}</title>
            <meta name="description" content={Metadata["pdp"]["description"]}/>
            <meta property="og:title" content={Metadata["pdp"]["title"]}/>
            <meta property="og:description" content={Metadata["pdp"]["description"]}/>
        </Head>
            <section className="image-section">
                {
                    name?

                    <Image id="productImage" fill src={`${imageMap[name].path}_${fresh?"fresh":"dry"}.${imageMap[name].fileType}`} alt={name} sizes="(min-width:1025px) 40vw, (max-width:767px) 80vw"priority placeholder="blur" blurDataURL={`${imageMap[name].path}.${imageMap[name].fileType}`} />
                    :
                    null
                }

            </section>
            <section className="text-section">
                <h1 className="main-heading product-heading" id="productName">{name?name:null} </h1>
                <p id="productDescription">{description?description:null} Learn more about <Link className="link"href="/what-we-grow">{name}</Link>.</p>
                {
                    itemsAvailable?

                    <>
                <div role="listbox" aria-label="select fresh or dry">
                <button role="option"className="select-custom fresh-dry select-active" aria-selected={true}onClick={(e)=>{
                    setFresh(true);
                    setPrice('');
                    setSize('');
                    setStripeProductId('');
                    setProductAvailable(true);
                    toggleBackground(e.target as HTMLElement,"fresh-dry")
                    toggleBackground(null,"size-select")
                }}>Fresh</button>
                <button role="option" className="select-custom fresh-dry" aria-selected={false} onClick={(e)=>{
                    setFresh(false)
                    setPrice('');
                    setSize('');
                    setStripeProductId('');
                    setProductAvailable(true);
                    toggleBackground(e.target as HTMLElement,"fresh-dry")
                    toggleBackground(null,"size-select")
                    }}>Dry</button>
                </div>
                
                

                <p id="sizeLabel">Select a size:</p>
                <div role="listbox" aria-labelledby="sizeLabel">
                    {
                        fresh&&freshSizeList.length>0?freshSizeList.map((el:string,idx:number)=>{
                            return(
                                <div key={idx}className={"size-button-wrapper"}>
                                <button key={idx} className={`select-custom size-select ${product.filter((prod:any)=>{return prod.fresh===true&&prod.mass===el})[0].stock_available<=0?'button-disabled':''}`} role="option" aria-selected={false}
                                onClick={(e)=>{
                                    var text=(e.target as HTMLInputElement).textContent as string;
                                    const chosenProduct:Product=product.filter((prod:any)=>{
                                        return prod.fresh===true&&prod.mass===el
                                    })[0]
                                    if(chosenProduct.stock_available as number>=qty){
                                        setProductAvailable(true)
                                    }
                                    else {
                                        setProductAvailable(false)

                                    }
                                    setId(chosenProduct._id)
                                    setStockAvailable(chosenProduct.stock_available)
                                    setPrice(chosenProduct.price.toString())
                                    setStripeProductId(chosenProduct.stripe_product_id)
                                    setSize(el)
                                    toggleBackground(e.target as HTMLElement,"size-select")

                                }}>{el}</button>{product.filter((prod:any)=>{return prod.fresh===true&&prod.mass===el})[0].stock_available<=0?<span className="size-btn-message">Out of stock</span>:null}</div>
                            )
                        })
                        :
                        drySizeList.length?drySizeList.map((el:string)=>{
                            return(
                            <div key={el}className={"size-button-wrapper"}>
                                <button key={el} disabled={product.filter((prod:any)=>{return prod.fresh===false&&prod.mass===el})[0].stock_available<=0}className={`select-custom size-select ${product.filter((prod:any)=>{return prod.fresh===false&&prod.mass===el})[0].stock_available<=0?'button-disabled':''}`} role="option"aria-selected={false}
                                onClick={(e)=>{
                                    const chosenProduct:Product=product.filter((prod:any)=>{
                                        return prod.fresh===false&&prod.mass===el
                                    })[0]
                                    if(chosenProduct.stock_available as number>=qty){
                                        setProductAvailable(true)
                                    }
                                    else {
                                        setProductAvailable(false)
                                    }
                                    setId(chosenProduct._id)
                                    setStockAvailable(chosenProduct.stock_available)
                                    setPrice(chosenProduct.price.toString())
                                    setStripeProductId(chosenProduct.stripe_product_id)
                                    setSize(el)
                                    toggleBackground(e.target as HTMLElement,"size-select")

                                }}>{el}</button>{product.filter((prod:any)=>{return prod.fresh===false&&prod.mass===el})[0].stock_available<=0?<span className="size-btn-message">Out of stock</span>:null}</div>
                            )
                        }):
                        null
                    }
                </div>
                <p id="productPrice"> Price: £{price?qty*Number(price):null}</p>
                <div>
                    <label htmlFor={"productQuantity"}>Qty: </label>
                    <input id={`productQuantity`} className="form-input"name={"quantity"} type="number" value={qty} onChange={(e)=>{
                        setQty(Number(e.target.value))
                        var freshLabel = fresh?true:false
                        if(size!==''){

                            const chosenProduct:Product=product.filter((prod:any)=>{
                                return freshLabel===true&&prod.mass===size
                            })[0]
                            if(chosenProduct.stock_available>=Number(e.target.value)){
                                setProductAvailable(true)
                                setErr('');
                            }
                            else {
                                setProductAvailable(false)
                                if(chosenProduct.stock_available==0){
                                    setErr('This item is out of stock :(')

                                }
                                else {
                                    setErr('We do not have this many items available. Please select a lower quantity')
                                }

                            }
                        }
                        
                    }
                    }/>
                                 
                </div></>:
                    <p>This product is currently unavailable. We will have more available in the coming days :).</p>
                }
               {
                    err?
                    <p>{err}</p>:
                    null
               }
                <button id="productAddToCart" disabled={!productAvailable}className="cta"onClick={async(e)=>{
                            try{
                                setComponentLoading(true)
                                const input = document.getElementById(`productQuantity`) as HTMLInputElement;
                                if(size!==''&&input.value!==''){
                                    context.saveCart? context.saveCart({
                                        _id:id,
                                        name:name,
                                        fresh:fresh,
                                        size:size,
                                        quantity:Number(input.value),
                                        price: Number(price),
                                        stripeProductId:stripeProductId,
                                        stockAvailable:stockAvailable
                                    }):null}
                                    setComponentLoading(false)
                                }
                
                            catch(e){
                                console.log(e)
                                setComponentLoading(false)
                            }
                        }
                            
                        }>Add to basket</button>
            </section>
            

        </div>

    )
}
export async function getServerSideProps(ctx:any){
    return {
        props:{}
    }
}
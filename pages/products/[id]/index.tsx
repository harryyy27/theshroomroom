import {useEffect,useState,useContext} from 'react';
import Image from 'next/image';
import {imageMap} from '../../../utils/imageMap/imageMap';
import {CartContext} from '../../../context/cart';
import Head from 'next/head';
import {Metadata} from '../../../utils/metadata/metadata';
import Link from 'next/link'
import {getSession,getCsrfToken}from 'next-auth/react'
import {notFound} from 'next/navigation';

import {Product} from '../../../utils/schema';
import connect from '../../../utils/connection'
interface Product {
    _id:string,
    name:string,
    description:string,
    product_type:string,
    stock_available:number,
    mass:string,
    price:number,
    stripe_product_id:string,
    stripe_id:string,
    fresh:boolean,
    coming_soon:boolean,
}
export default function ProductDetails(props:any){
    const context = useContext(CartContext);
    const [product,setProduct]=useState<Product[]>([])
    const [productSizeList,setProductSizeList]=useState<string[]>([])
    const [drySizeList,setDrySizeList]=useState<string[]>([])
    const [name,setName]=useState('');
    const [description,setDescription]=useState('');
    const [imageUrl,setImageUrl]=useState('');
    const [type,setType]=useState('');
    const [stockAvailable,setStockAvailable]=useState(1);
    const [price,setPrice]=useState('');
    const [productAvailable,setProductAvailable]=useState(true)
    const [id,setId]=useState('');
    const [fresh,setFresh]=useState(false);
    const [size,setSize]=useState('');
    const [qty,setQty]=useState(1);
    const [user,setUser]=useState(false);
    const [stripeProductId,setStripeProductId]=useState('');
    const [stripeId,setStripeId]=useState('');
    const [itemsAvailable,setItemsAvailable]=useState(false);
    const [err,setErr]=useState('');

    useEffect(()=>{
        props.setComponentLoading(true)
        setImageUrl(props.urlArr[props.urlArr.length-1].replace(/[\-]/gi,'_').replace('\&apos','').toLowerCase());
        const initiate = async()=>{
            const session = await getSession()
            if(session?.user){
                setUser(true)
            }
            setFresh(props.freshUrl)
            const productDetails=props.productDetails
            if(productDetails.length===0){
                notFound()
                return
            }
            const productList:string[] = []
            productDetails.forEach((el:any)=>{
                    productList.push(el.mass)
                
            })
            
            productList.sort((a:string,b:string)=>{
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
            productDetails.sort((a:any,b:any)=>{
                if(a.mass.slice(-2)==='kg'&&b.mass.slice(-2)==='kg'){
                    return Number(a.mass.slice(0,a.mass.length-2))-Number(b.mass.slice(0,b.mass.length-2))
                }
                else if(a.mass.slice(-2)==='kg'&&b.mass.slice(-2)!=='kg'){
                    return Number(a.mass.slice(0,a.mass.length-2))*1000-Number(b.mass.slice(0,b.mass.length-1))
                }
                else if(a.mass.slice(-2)!=='kg'&&b.mass.slice(-2)==='kg'){
                    return Number(a.mass.slice(0,a.mass.length-1))-Number(b.mass.slice(0,b.mass.length-2))*1000

                }
                else {

                    return Number(a.mass.slice(0,a.mass.length-1))-Number(b.mass.slice(0,b.mass.length-1))
                }
            })
            
            setProductSizeList(productList)
            if(productDetails.every((el:string)=>productDetails.stock_available===0||productDetails.coming_soon)){
                setItemsAvailable(false)
                setProductAvailable(false)
            }
            else{
                setItemsAvailable(true)
            }
            setProduct(productDetails)
            setName((props.freshUrl?"Fresh ":"Dried ")+productDetails[0].name);
            setDescription(productDetails[0].description);
            setType(productDetails[0].type)
            props.setComponentLoading(false)
            var i = 0;
            var productSet=false;
            while(i<productDetails.length&&productSet===false){

                if((productDetails[i] as any)["stock_available"]!==0&&productDetails[i].coming_soon!==true){
                    setId((productDetails[i] as any)._id)
                    setStockAvailable((productDetails[i] as any).stock_available)
                    setPrice((productDetails[i] as any).price.toString())
                    setStripeProductId((productDetails[i] as any).stripe_product_id)
                    setStripeId((productDetails[i] as any).stripe_id)
                    setSize((productDetails[i] as any).mass)
                    setProductAvailable(true)
                    productSet=true
                }
                i++
            }


        }
        initiate()


    },[props.setComponentLoading])
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

                    <Image id="productImage" fill src={`${imageMap[name].path}.${imageMap[name].fileType}`} alt={name} sizes="(min-width:1025px) 40vw, (max-width:767px) 80vw"priority placeholder="blur" blurDataURL={`${imageMap[name].path}.${imageMap[name].fileType}`} />
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
                
                
                

                <p id="sizeLabel">Select a size:</p>
                <div role="listbox" aria-labelledby="sizeLabel">
                    {
                        productSizeList.length>0?productSizeList.map((el:string,idx:number)=>{
                            return(
                                <div key={idx}className={"size-button-wrapper"}>
                                <button key={idx} className={`select-custom size-select ${el===size?"select-active":""} ${product.filter((prod:any)=>{return prod.mass===el})[0].stock_available<=0||product.filter((prod:any)=>{return prod.mass===el})[0].coming_soon?'button-disabled':''}`} role="option" aria-selected={false}
                                onClick={(e)=>{
                                    var text=(e.target as HTMLInputElement).textContent as string;
                                    const chosenProduct:Product=product.filter((prod:any)=>{
                                        return prod.mass===el
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
                                    setStripeId(chosenProduct.stripe_id)
                                    setSize(el)
                                    toggleBackground(e.target as HTMLElement,"size-select")

                                }}>{el}</button>{product.filter((prod:any)=>{return prod.mass===el})[0].coming_soon? <span className="coming-soon-message">Coming soon!</span>: product.filter((prod:any)=>{return prod.mass===el})[0].stock_available<=0?<span className="size-btn-message">Out of stock</span>:null}</div>
                            )
                        })
                        :null
                    }
                    
                </div>
                <p id="productPrice"> Price: £{price?qty*Number(price):null}</p>
                <div>
                    <label htmlFor={"productQuantity"}>Qty: </label>
                    <input id={`productQuantity`} className="form-input"name={"quantity"} type="number" value={qty} onChange={(e)=>{
                        if(e.target.value==''||e.target.value=="0"){
                            setQty(0)
                        }
                        else{
                            e.target.value=e.target.value.replace(/^0+/, '')
                            setQty(parseInt(e.target.value.replace(/^0+/, ''),10))
                        if(size!==''){

                            const chosenProduct:Product=product.filter((prod:any)=>{
                                return prod.mass===size
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
                        
                        
                    }
                    }
                    />
                                 
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
                                props.setComponentLoading(true)
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
                                        stripeId:stripeId,
                                        stockAvailable:stockAvailable
                                    }):null}
                                    props.setComponentLoading(false)
                                }
                
                            catch(e){
                                console.log(e)
                                props.setComponentLoading(false)
                            }
                        }
                            
                        }>Add to basket</button>
            </section>
            

        </div>

    )
}
export async function getServerSideProps({req,res,resolvedUrl}:any){
    const urlArr =resolvedUrl.split('/')
    const freshUrl = urlArr[urlArr.length-1].includes("Fresh");
    let productDetailsDb:any;

    if(!urlArr[urlArr.length-1].includes("Shipping")){
        const productName = urlArr[urlArr.length-1].replace(/[\-]/gi,' ').replace('\&apos','\'').replace('Fresh ','').replace('Dried ','');
        await connect()
        productDetailsDb=await Product().find({name:productName,fresh:freshUrl}).lean()
        productDetailsDb.forEach((el:any)=>{
            el._id=el._id.toString()
            el.price=Number(el.price)
        })
    }
    if(productDetailsDb.length===0){
        return {
                notFound:true
            

        }
        
    }
    else{
        return {
            props:{
                urlArr:urlArr,
                freshUrl:freshUrl,
                productDetails:productDetailsDb
            }
        }
    }
    
}
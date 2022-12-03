import {useEffect,useState,useContext} from 'react';
import Image from 'next/image';
import {imageMap} from '../../imageMap/imageMap';
import {CartContext} from '../../../context/cart';
import {getSession} from 'next-auth/react'
export default function ProductDetails(){
    const context = useContext(CartContext)
    const [name,setName]=useState('');
    const [description,setDescription]=useState('');
    const [imageUrl,setImageUrl]=useState('');
    const [type,setType]=useState('');
    const [price,setPrice]=useState('');
    const [id,setId]=useState('');

    useEffect(()=>{
        const urlArr =window.location.href.split('/')
        const product = urlArr[urlArr.length-1].replace(/[\-]/gi,' ').replace('\&apos','\'');
        setImageUrl(urlArr[urlArr.length-1].replace(/[\-]/gi,'_').replace('\&apos','').toLowerCase());
        const initiate = async()=>{
            const productDetailsJson = await fetch(`/api/products?product=${product}`)
            const productDetails = await productDetailsJson.json()
            setName(productDetails.name);
            setDescription(productDetails.description);
            setType(productDetails.type)
            setPrice(productDetails.price)
            setId(productDetails._id)


        }
        initiate()


    })
    return(
        <>
            <h1>{name?name:null} </h1>
            {
                name?

                <Image width={imageMap[name].width} height={imageMap[name].height} src={`${imageMap[name].path}.${imageMap[name].fileType}`}/>
                :
                null
            }
            <p>{description?description:null}</p>
            <p> Price: {price?price:null}</p>

            <select id={`quantity`}name={"quantity"}>
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
                const input = document.getElementById(`quantity`) as HTMLInputElement;
                context.saveCart? context.saveCart({
                    _id:id,
                    name:name,
                    quantity:Number(input.value),
                    price: Number(price)
                }):null}
            }>Add to basket</button>

        </>

    )
}
export async function getServerSideProps(ctx:any){
    console.log(ctx)
    return {
        props:{}
    }
}
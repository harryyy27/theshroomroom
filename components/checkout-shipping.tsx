import { useState, FormEvent, useContext,useEffect } from "react"

import { useRouter } from 'next/router'
import { getCsrfToken } from 'next-auth/react'
import { destroyCookie } from 'nookies'
import styles from '../styles/Components/Form.module.css'
import { CartContext } from '../context/cart';
import Link from 'next/link'
import FormComponent from "./form-component"
import discountLogic from '../utils/discountLogic'
export default function CheckoutForm(props: any) {

    const context = useContext(CartContext);
    
    const [checkoutError, setCheckoutError] = useState('');
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [deliveryHub,setDeliveryHub]=useState('');
    const [local,setLocal]=useState(false);
    const [success,setSuccess]=useState(false);
    const [discountErr,setDiscountErr]=useState('')
    const [discountTotal,setDiscountTotal]=useState<number | null>(null)
    const [discountDescription,setDiscountDescription]=useState('')
    const [code,setCode]=useState('')
    const setComponentLoading = props.setComponentLoading;
    // const postCodeValidate=(formPostcode:string,validPostcodesArr:any)=>{
        
    //     const keys = Object.keys(validPostcodesArr)
    //     let validPostcode=false
    //     let postcodeArea=''
    //     const containsFresh = !context.state.cart.items.every((el:any)=>el.fresh===false)
    //     keys.forEach((key:string)=>{
    //         if(!validPostcodesArr[key as string].every((el:string)=>!formPostcode.toLowerCase().trim().startsWith(el.toLowerCase()))){
    //             validPostcode=true
    //             postcodeArea=key
    //         }
    //     })
    //     if(containsFresh===false&&formPostcode.length>0){
    //         validPostcode=true
    //     }
    //     if(validPostcode&&postcodeArea!==''){
    //         setDeliveryHub(postcodeArea)
    //         setDeliveryHubVal(true)
    //         return true
    //     }
    //     else if(validPostcode){
    //         setDeliveryHub('')
    //         setDeliveryHubVal(true)
    //         return true
    //     }
    //     else {
    //         setDeliveryHub('')
    //         setDeliveryHubVal(false)
    //         return false
    //     }
        
    // }
    useEffect(()=>{
        console.log(props.subscription)
        console.log(props.user)
        if(props.local){
            props.setShippingCost(0)
            props.setShippingCostVal(true)
            props.setShippingType("free")
            props.setShippingTypeVal(true)

        }
        else if(context.state.cart.items.every((el:any)=>!el.fresh)){
            props.setShippingCost(5)
            props.setShippingCostVal(true)
            props.setShippingType("standard")
            props.setShippingTypeVal(true)
        }
        else{

        }
    },[])
    const handleUnavailableItems = () => {
        context.state.cart.items.forEach((el)=>{
            if(el.stockAvailable<el.quantity &&context.saveCart){
                context.saveCart(
                    {
                        ...el,
                        quantity:0
                    }
                )
            }
        })
    }
    const validateShipping=()=>{
        try {
            if(props.shippingCostVal===true&&props.shippingTypeVal===true){
                return true
            }
            else {
                return false
            }
        }
        catch(e){
            console.log(e)
            setCheckoutError('Something has gone wrong, please refresh and try again.')
            return false
        }
    }

    const handleChangeShipping=(e:any)=>{
        try{
            props.setShippingCost(e.target.value)
            props.setShippingCostVal(true)
            props.setShippingType(e.target.id)
            props.setShippingTypeVal(true)

        }
        catch(e){
            console.log(e)
            setCheckoutError("Something has gone wrong, please refresh and try again.")
            
        }
    }
    const goPay = async (e: FormEvent) => {
        props.setComponentLoading(true)
        setProcessing(true)
        e.preventDefault()
        try {

            if(!validateShipping()){
                throw new Error('Something has gone wrong, please refresh and start again')
            }
            if (!(props.shippingCost>=0)) {
                throw new Error('Please select shipping option.')
            }
            
            setProcessing(false)
            props.handlePhaseChange(3)
            props.setComponentLoading(false)
        }
        catch (e: any) {
            console.log(e)
            setProcessing(false)
            setCheckoutError(e.message)
            props.setComponentLoading(false)
        }

    }
    async function handleCheckCode(e:FormEvent){
        e.preventDefault()
        const res = await fetch(`/api/discount-code?codeName=${code}`)
        const resJson = await res.json()
        if(resJson.success){
            if(discountLogic.hasOwnProperty(code)){
                console.log('yeh')
                const indexCode = code
                const discountFunction = discountLogic[indexCode].newTotal
                const newDiscountTotal = discountFunction(context.state.subTotal)
                props.setCode(code)
                props.setDiscountId(resJson.discountId)
                setDiscountTotal(newDiscountTotal)
                setDiscountDescription(discountLogic[indexCode].description)
                setSuccess(true)
                setDiscountErr(resJson.error)
            }
        }
        else {
            setDiscountErr(resJson.error)
            setSuccess(false)
        }
    }
    return (
        <div className="static-container">
        {
            checkoutSuccess?<div id="success" style={{color:"green",position:"fixed",display:"block",width:"100vw",height:"400px",lineHeight:"400px",top:"100px",opacity:0.001}}><p>Success</p></div>:
            null
        }
        
            <h1 className="main-heading center">{props.subscription?"Subscription ":""}Checkout</h1>
            
                <form className={styles["form"]}>
                <fieldset style={{backgroundColor:"white"}}>
                <legend>Select a shipping method:</legend>
                <div>
                    <input type="radio" id="free" name="shipping" value={0} disabled={!props.local} checked={props.shippingType==="free"} onChange={(e)=>handleChangeShipping(e)}/>
                    <label htmlFor="free">Free Shipping</label>
                </div>
                {
                    !props.local?
                        <p>Not eligible for free shipping? Check our <Link className="link" href="/delivery">free shipping postcodes</Link>!</p>
                        :null
                }
                <div>
                    <input type="radio" id="standard" name="shipping" value={5} checked={props.shippingType==="standard"}disabled={!context.state.cart.items.every((el:any)=>!el.fresh)} onChange={(e)=>handleChangeShipping(e)} />
                    <label htmlFor="standard">Standard</label>
                </div>
                {
                    !context.state.cart.items.every((el:any)=>!el.fresh)?
                        <p>We do not currently deliver fresh mushrooms via post</p>
                        :null
                }
                </fieldset>
                {
                    props.user&&!props.subscription?
                    <FormComponent user={props.user} labelName={"Discount Code"} variable={code} variableName={Object.keys( code)[0]} setVariable={setCode} inputType={"text"} required={false} />:
                    null
                }
                
                {
                    discountErr!==''?
                    <p style={{"color":"red"}}>{discountErr}</p>:
                    null
                }
                {
                    success?
                    <p style={{"color":"green"}}>Discount code applied!</p>:
                    null
                }
                <button className="cta inline" onClick={(e)=>handleCheckCode(e)}>Apply Code</button>
                    
                </form>
                {
                    context.cartLoaded &&
                    <div style={{"marginTop":"1rem"}}>
                        <ul>
                                    {
                                        context.state.cart.items.map((el:any,idx:number)=><li key={idx}className={"product-list-element"}>{el.name} {el.size} x {el.quantity}</li>)
                                    }
                        </ul>
                        <p>Subtotal: £<span id="subTotal">{context.state.subTotal.toString()}</span></p>
                        <p>Shipping: £<span id="shipping">{props.shippingCost}</span></p>
                        {
                            discountTotal?
                            <p>Discount applied: {discountDescription}</p>:
                            null

                        }
                        <p>Total: £<span id="total" style={{"textDecoration":discountTotal?"lineThrough":"none"}}>{(Number(discountTotal!==null?discountTotal:context.state.subTotal)+Number(props.shippingCost)).toString()}</span></p>

                    </div>
                }
            <button className="cta"type="submit" disabled={processing||!context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)} onClick={(e)=>goPay(e)}>PAY NOW</button>
            {
                errorMessage !== '' ?
                    <p>{errorMessage}</p> :
                    null
            }
            {
                !context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)?
                <div className="checkout-stock-message">
                <p className="checkout-stock-lines">Please delete the unavailable items from your <Link className="link" href="/cart">cart</Link> to continue checking out</p>
                <button className="checkout-delete-stock-btn"onClick={(e)=>handleUnavailableItems()}>DELETE</button>
                </div>
                :null
            }
<form>
{
                context.state.cart.items.length<=0&&!checkoutSuccess?
                <div className="checkout-stock-message">
                <p className="checkout-stock-lines">You have no items in your basket, please select some products from our <Link className="link" href="/products">store</Link> to make a purchase.</p>
                </div>
                :null
            }
           
            {
                context.state.cart.items.length<=0&&!checkoutSuccess?
                <div className="checkout-stock-message">
                <p className="checkout-stock-lines">You have no items in your basket, please select some products from our <Link className="link" href="/products">store</Link> to make a purchase.</p>
                </div>
                :null
            }
            </form>
            {checkoutError && <p className="form-error" style={{ color: "red" }}>{checkoutError}</p>}
        </div>
    )
}
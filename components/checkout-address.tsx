import { getSession } from "next-auth/react"
import { useEffect, useState, FormEvent, useContext } from "react"
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js'
import Link from 'next/link'
import Dropdown from '../components/dropdown'
import styles from '../styles/Components/Form.module.css'
import { useRouter } from 'next/router'
import { getCsrfToken } from 'next-auth/react'
import { destroyCookie } from 'nookies'
import { CartContext } from '../context/cart';
import FormComponent from './form-component';
import postcodes from '../utils/zedPostcodes/postcodes'
import localPostcodes from '../utils/localPostcodes/postcodes'
export interface Product {
    _id: String,
    price: number,
    quantity: number,
    name: string,
    size: string,
    fresh: boolean,
    stripeProductId: string,
    stripeId:string,
    subscription: string,
}

export default function CheckoutForm(props: any) {

    const context = useContext(CartContext);
    const [validPostcodes,setValidPostcodes]=useState<any | null>(null);
    const [processing,setProcessing]=useState(false);
    const [updateErr,setUpdateErr]=useState(false);
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
    const localPostcodeValidate=async(formPostcode:string,validPostcodesArr:any)=>{
        const keys = Object.keys(validPostcodesArr)
        let validPostcode=false
        let postcodeArea=''
        const containsFresh = !context.state.cart.items.every((el:any)=>el.fresh===false)
        keys.forEach((key:string)=>{
            if(!validPostcodesArr[key as string].every((el:string)=>{
                return !formPostcode.toLowerCase().trim().startsWith(el.toLowerCase())}
            )){
                validPostcode=true
                postcodeArea=key
            }
        })
        if(containsFresh===false&&formPostcode.length>0){
            validPostcode=true
        }
        if(validPostcode&&postcodeArea!==''){
                    props.setLocal(true)
                    return true
        }
        else if(validPostcode){
            
                    props.setLocal(false)
                    return true
        }
        else {
            props.setLocal(false)
            return false
        }
    }
    useEffect(() => {
        setValidPostcodes(localPostcodes)
    },[])
    const validate_form = async() => {
        try{
            if (props.dFirstNameVal && props.dSurnameVal && props.dFirstLineVal && props.dCityVal && props.dPostcodeVal && props.dPhoneNumberVal && (props.billingDelivery||(props.bFirstNameVal && props.bSurnameVal && props.bFirstLineVal && props.bCityVal && props.bPostcodeVal && props.bPhoneNumberVal))) {
                if (props.guestEmailAddressVal || props.user) {
                    return true
                }
                else {
                    props.setCheckoutError('Please either sign in or provide a valid email for guest checkout')
                    setFormPosition()
                    return false
                }
            }
            else {
                if (!props.dFirstNameVal) {
                    props.setDFirstNameVal(false)
                }
                if (!props.dSurnameVal) {
                    props.setDSurnameVal(false)
                }
                if (!props.dFirstLineVal) {
                    props.setDFirstLineVal(false)
                }
                if (!props.dCityVal) {
                    props.setDCityVal(false)
                }
                if (!props.dPostcodeVal) {
                    props.setDPostcodeVal(false)
                }
                if (!props.dPhoneNumberVal) {
                    props.setDPhoneNumberVal(false)
                }
    
                if (!props.bFirstNameVal) {
                    props.setBFirstNameVal(false)
                }
                if (!props.bSurnameVal) {
                    props.setBSurnameVal(false)
                }
                if (!props.bFirstLineVal) {
                    props.setBFirstLineVal(false)
                }
                if (!props.bCityVal) {
                    props.setBCityVal(false)
                }
                if (!props.bPostcodeVal) {
                    props.setBPostcodeVal(false)
                }
                if (!props.bPhoneNumberVal) {
                    props.setBPhoneNumberVal(false)
                }
                
                props.setCheckoutError('Please fill in all required fields')
                setFormPosition()
                return false
            }
        }
        catch(error:any){
            await fetch('/api/clientSideError',{
                method:"POST",
                headers: {
                    "csrftoken": await getCsrfToken() as string,
                    "client-error": "true"
                },
                body:JSON.stringify({
                    error:error.message,
                    stack:error.stack
                })
            })
        }
        

    }
    const setFormPosition = () => {
        const first_error = document.querySelector('.error-text, .Error')
        if (first_error) {
            var rect = first_error.getBoundingClientRect()
            const x = rect.left + first_error.clientWidth
            const y = rect.top + first_error.clientHeight
            window.scrollTo(x, y)

        }
    }
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
    
    const goShipping = async (e: FormEvent) => {
        props.setComponentLoading(true)
        setProcessing(true)
        e.preventDefault()
        try {
            let valid = await validate_form()

            if (!valid) {
                throw new Error('Please enter form details correctly')
            }
            var emailAddress;
            var userId = null;
            if (props.guestEmailAddress) {
                var guestCheckout = true;
                emailAddress = props.guestEmailAddress;
            }
            else {
                var guestCheckout = false;
                emailAddress = props.user?.email
                userId = props.user?.id
            }
            setProcessing(false)
            props.handlePhaseChange(2)
            props.setComponentLoading(false)
        }
        catch (e: any) {
            setProcessing(false)
            props.setCheckoutError(e.message)
            props.setComponentLoading(false)
        }

    }
    return (
        <div className="static-container">
        {
            props.checkoutSuccess?<div id="success" style={{color:"green",position:"fixed",display:"block",width:"100vw",height:"400px",lineHeight:"400px",top:"100px",opacity:0.001}}><p>Success</p></div>:
            null
        }
        
            <h1 className="main-heading center">{props.subscription?"Subscription ":""}Checkout</h1>
            {
                props.errorMessage !== '' ?
                    <p>{props.errorMessage}</p> :
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

{
                context.state.cart.items.length<=0&&!props.checkoutSuccess?
                <div className="checkout-stock-message">
                <p className="checkout-stock-lines">You have no items in your basket, please select some products from our <Link className="link" href="/products">store</Link> to make a purchase.</p>
                </div>
                :null
            }
            <form className={styles["form"]}  autoComplete="complete">
                <input autoComplete="new-password" name="hidden" type="text" style={{ "display": "none" }} />
                {
                    context.cartLoaded && props.user === null &&
                    <>
                        <h2>Guest Checkout</h2>
                        <FormComponent user={props.user} labelName={"Email Address"} variable={props.guestEmailAddress} variableName={Object.keys(props.guestEmailAddress)[0]} setVariable={props.setGuestEmailAddress} variableVal={props.guestEmailAddressVal} setVariableVal={props.setGuestEmailAddressVal} inputType={"email"} required={!props.user} alternative={'sign in'} />

                    </>

                }
                <h2>Delivery Address</h2>
                <FormComponent user={props.user} labelName={"First Name"} variable={props.dFirstName} variableName={Object.keys(props.dFirstName)[0]} setVariable={props.setDFirstName} variableVal={props.dFirstNameVal} setVariableVal={props.setDFirstNameVal} inputType={"text"} required={true} />
                <FormComponent user={props.user} labelName={"Surname"} variable={props.dSurname} variableName={Object.keys(props.dSurname)[0]} setVariable={props.setDSurname} variableVal={props.dSurnameVal} setVariableVal={props.setDSurnameVal} inputType={"text"} required={true} />
                <FormComponent user={props.user} labelName={"Street name and number"} variable={props.dFirstLine} variableName={Object.keys(props.dFirstLine)[0]} setVariable={props.setDFirstLine} variableVal={props.dFirstLineVal} setVariableVal={props.setDFirstLineVal} inputType={"text"} required={true} />

                <FormComponent user={props.user} labelName={"2nd Line of address"} variable={props.dSecondLine} variableName={Object.keys(props.dSecondLine)[0]} setVariable={props.setDSecondLine} inputType={"text"} required={false} />
                <FormComponent user={props.user} labelName={"City"} variable={props.dCity} setVariable={props.setDCity} variableName={Object.keys(props.dCity)[0]} variableVal={props.dCityVal} setVariableVal={props.setDCityVal} inputType={"text"} required={true} />
                <FormComponent user={props.user} labelName={"Postcode"} variable={props.dPostcode} variableName={Object.keys(props.dPostcode)[0]} setVariable={props.setDPostcode} variableVal={props.dPostcodeVal} setVariableVal={props.setDPostcodeVal} inputType={"text"} required={true} callback={localPostcodeValidate} params={validPostcodes} />
                {
                    updateErr?
                    <p style={{"color":"red"}}>Update failed, please refresh the page and try again</p>
                    :
                    null
                }
                <Link className="link" href="/delivery">See delivery postcodes available for fresh mushrooms here</Link>
                <FormComponent user={props.user} labelName={"Phone Number"} variable={props.dPhoneNumber} variableName={Object.keys(props.dPhoneNumber)[0]} setVariable={props.setDPhoneNumber} variableVal={props.dPhoneNumberVal} setVariableVal={props.setDPhoneNumberVal} inputType={"text"} required={true} />

                <div className={styles["form-element-wrapper"]+" add-vertical-margin"}>
                    <label htmlFor="billingDelivery">Billing same as delivery:</label>
                    <input  autoComplete="complete" id="billingDelivery" type="checkbox" checked={props.billingDelivery} onChange={(e) => props.setBillingDelivery(!props.billingDelivery)} />
                </div>
                {
                    !props.billingDelivery?
                    <>
                        <h2>Billing Address</h2>
                        <FormComponent user={props.user} labelName={"First Name"} variable={props.bFirstName} variableName={Object.keys( props.bFirstName )[0]} setVariable={props.setBFirstName} variableVal={props.bFirstNameVal} setVariableVal={props.setBFirstNameVal} inputType={"text"} required={true} />
                        <FormComponent user={props.user} labelName={"Surname"} variable={props.bSurname} variableName={Object.keys( props.bSurname)[0]} setVariable={props.setBSurname} variableVal={props.bSurnameVal} setVariableVal={props.setBSurnameVal} inputType={"text"} required={true} />
                        <FormComponent user={props.user} labelName={"Street name and number"} variable={props.bFirstLine} variableName={Object.keys(props.bFirstLine)[0]} setVariable={props.setBFirstLine} variableVal={props.bFirstLineVal} setVariableVal={props.setBFirstLineVal} inputType={"text"} required={true} />

                        <FormComponent user={props.user} labelName={"2nd Line of address"} variable={props.bSecondLine} variableName={Object.keys( props.bSecondLine)[0]} setVariable={props.setBSecondLine} inputType={"text"} required={false} />
                        <FormComponent user={props.user} labelName={"City"} variable={props.bCity} variableName={Object.keys( props.bCity)[0]} setVariable={props.setBCity} variableVal={props.bCityVal} setVariableVal={props.setBCityVal} inputType={"text"} required={true} />
                        <FormComponent user={props.user} labelName={"Postcode"} variable={props.bPostcode} variableName={Object.keys(props.bPostcode)[0]} setVariable={props.setBPostcode} variableVal={props.bPostcodeVal} setVariableVal={props.setBPostcodeVal} inputType={"text"} required={true} />
                        <FormComponent user={props.user} labelName={"Phone Number"} variable={props.bPhoneNumber} variableName={Object.keys(props.bPhoneNumber)[0]} setVariable={props.setBPhoneNumber} variableVal={props.bPhoneNumberVal} setVariableVal={props.setBPhoneNumberVal} inputType={"tel"} required={true} />

                    </>:
                null
                }
                

                    

                <button id="goShipping"  className="cta add-relative" type="submit" disabled={processing||!context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)} onClick={(e) => goShipping(e)}>Submit
                
                </button>

                
            {
                !context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)?
                <div className="checkout-stock-message">
                <p className="checkout-stock-lines">Please delete the unavailable items from your <Link className="link" href="/cart">cart</Link> to continue checking out.</p>
                <button className="cta-sec-btn"onClick={(e)=>handleUnavailableItems()}>DELETE</button>
                
                </div>
                :null
            }
            {
                context.state.cart.items.length<=0&&!props.checkoutSuccess?
                <div className="checkout-stock-message">
                <p className="checkout-stock-lines">You have no items in your basket, please select some products from our <Link className="link" href="/products">store</Link> to make a purchase.</p>
                </div>
                :null
            }
            </form>
            {props.checkoutError && <p className="form-error" style={{ color: "red" }}>{props.checkoutError}</p>}
        </div>
    )
}
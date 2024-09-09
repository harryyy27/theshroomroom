import { getSession } from "next-auth/react"
import { useEffect, useState, FormEvent, useContext } from "react"
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js'
import Link from 'next/link'
import discountLogic from '../utils/discountLogic'
import Dropdown from '../components/dropdown'
import styles from '../styles/Components/Form.module.css'
import { useRouter } from 'next/router'
import { getCsrfToken } from 'next-auth/react'
import { destroyCookie } from 'nookies'
import { CartContext } from '../context/cart';
import saleDates from "../utils/saleDates/saleDates"
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
interface UserSchema {
    id: string,
    name: String,
    username: any,
    email: String | undefined,
    password: string | undefined,
    cart: {
        items: Product[]
    },
    dAddress: {
        firstName: String,
        surname: String,
        firstLine: String,
        secondLine: String,
        city: String,
        postcode: String,
        phoneNumber:String
    },
    bAddress: {
        firstName: String,
        surname: String,
        firstLine: String,
        secondLine: String,
        city: String,
        postcode: String,
        phoneNumber:String
    },
    updates: Boolean,
}
export default function CheckoutForm(props: any) {

    const context = useContext(CartContext);
    const [subscription, setSubscription] = useState(false);
    const [subscriptionInterval, setSubscriptionInterval] = useState('monthly');
    const router = useRouter();
    
    const [updates, setUpdates] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);
    const [cardDetailsValid, setCardDetailsValid] = useState<boolean | null>(null);
    const [processing, setProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [validPostcodes,setValidPostcodes]=useState<any|null>(null);
    const [deliveryHub,setDeliveryHub]=useState('');
    const [deliveryHubVal,setDeliveryHubVal]=useState(false);

    const [local,setLocal]=useState(false);
    const [updateErr,setUpdateErr]=useState(false);
    const [localVal,setLocalVal]=useState(false);
    const [isSale,setIsSale]=useState(false)
    const [discountErr,setDiscountErr]=useState('')
    const [discountTotal,setDiscountTotal]=useState<number | null>(null)
    const [discountDescription,setDiscountDescription]=useState('')
    const stripe = useStripe();
    const setComponentLoading = props.setComponentLoading;
    var elements:any= useElements();
    async function handleCheckCode(){
        if(props.discountFailed){
            setDiscountErr("This discount code is no longer available. Continue to pay at full price")
            props.setCode('')

        }
        else {
            setDiscountTotal(discountLogic[props.code as string].newTotal(context.state.subTotal)+props.shippingCost)
            setDiscountDescription(discountLogic[props.code as string].description)
        }
        
    }
    useEffect(() => {
        const todayDate=Date.now()
        if(+new Date(saleDates.countdownDate)-todayDate<0 && +new Date(saleDates.saleEndDate)-todayDate>0){
            setIsSale(true)
        }
        async function initiate(){
            setSubscription(props.subscriptionId)
            if(props.code){
               await handleCheckCode()
    
            }
            if(props.user?.updates){
                setUpdates(props.user.updates)

            }
        }
        initiate()
        
    },[])
    const paymentElementHandler = (e: any) => {
        if (e.complete) {
            setCardDetailsValid(true)
        }
        else {
            setCardDetailsValid(false)
        }

    }
    const validate_form = async() => {
        try{
            if (props.dFirstNameVal && props.dSurnameVal && props.dFirstLineVal && props.dCityVal && props.dPostcodeVal && props.dPhoneNumberVal && (props.billingDelivery||(props.bFirstNameVal && props.bSurnameVal && props.bFirstLineVal && props.bCityVal && props.bPostcodeVal && props.bPhoneNumberVal)) && cardDetailsValid) {
                if (props.guestEmailAddressVal || props.user) {
                    return true
                }
                else {
                    setCheckoutError('Please either sign in or provide a valid email for guest checkout')
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
                
                setCheckoutError('Please fill in all required fields')
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
    
    const placeOrder = async (e: FormEvent) => {
        props.setComponentLoading(true)
        e.preventDefault()
        try {
            if(processing===true){
                return setErrorMessage("Already processing order")
            }
            setProcessing(true)
            let valid = await validate_form()
            let subValid = true;
            if (subscription && subscriptionInterval === '') {
                subValid = false
            }

            if (!valid) {
                throw new Error('Please enter form details correctly')
            }
            if (!subValid) {
                throw new Error('Please select a subscription interval');
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
            let body = {
                userId: userId,
                email: emailAddress?.trim(),
                guestCheckout: guestCheckout,
                dAddress: {
                    firstName: props.dFirstName.trim(),
                    surname: props.dSurname.trim(),
                    firstLine: props.dFirstLine.trim(),
                    secondLine: props.dSecondLine.trim(),
                    city: props.dCity.trim(),
                    postcode: props.dPostcode.trim(),
                    phoneNumber:props.dPhoneNumber.trim()
                },
                bAddress: {
                    firstName: props.billingDelivery?props.dFirstName.trim():props.bFirstName.trim(),
                    surname: props.billingDelivery?props.dSurname.trim():props.bSurname.trim(),
                    firstLine: props.billingDelivery?props.dFirstLine.trim():props.bFirstLine.trim(),
                    secondLine: props.billingDelivery?props.dSecondLine.trim():props.bSecondLine.trim(),
                    city: props.billingDelivery?props.dCity.trim():props.bCity.trim(),
                    postcode: props.billingDelivery?props.dPostcode.trim():props.bPostcode.trim(),
                    phoneNumber: props.billingDelivery?props.dPhoneNumber.trim():props.bPhoneNumber.trim(),
                },
                products: context.state.cart,
                shippingCost: Number(props.shippingCost),
                shippingMethod: props.shippingType,
                deliveryHub:props.deliveryHub,
                code:props.code,
                subtotal: props.code!==''||!isSale?context.state.subTotal:(Number(context.state.subTotal)*0.9).toFixed(2),
                total: props.code!==''||!isSale?Number(context.state.subTotal)+Number(props.shippingCost):(Number(context.state.subTotal)*0.9).toFixed(2)+Number(props.shippingCost),
                status: "INITIATED",
                error: 'None',
                paymentIntentId: props.paymentIntent.id,
                updates: updates,
                subscription: subscription
            } as any
            if(discountTotal!== null){
                body={...body,discountTotal:discountTotal,discountId:props.discountId}
            }
            const eventInitiated = await fetch('/api/order', {
                method: "POST",
                headers: {
                    "csrftoken": await getCsrfToken() as string
                },
                body: JSON.stringify(body)
            })
            const order = await eventInitiated.json()
            if (order.success === false) {
                if(order.transactionFailure===false){
                    await fetch('/api/products',{
                        method:"PUT",
                        headers:{
                            csrftoken: await getCsrfToken() as string
                        },
                        body: JSON.stringify({products: context.state.cart})
                    })
                }
                throw new Error("Order failed, no order received")
            }
            var { error}: any = await stripe?.confirmPayment({
                elements,
                redirect: "if_required"
            })
            if (error) {
                var errMsg = error.message
                await fetch('/api/order', {
                    method: "PUT",
                    headers: {
                        csrftoken: await getCsrfToken() as string
                    },
                    body: JSON.stringify({
                        paymentIntentId: props.paymentIntent.id,
                        status: 'ORDER_FAILED_STRIPE',
                        error: errMsg
                    })
                })
                await fetch('/api/products',{
                    method:"PUT",
                    headers:{
                        csrftoken: await getCsrfToken() as string
                    },
                    body: JSON.stringify({products: context.state.cart})
                })
                throw new Error(errMsg)
            }
            else {
                props.handlePhaseChange(666)
                destroyCookie({}, "checkoutDetails", {
                    path: '/checkout'
                })
                
                setProcessing(false)
                if (context && context.dispatch) {
                    setCheckoutSuccess(true)
                    setTimeout(()=>{
                        context.saveCart ? context.saveCart() : null
                        props.setComponentLoading(false)

                        router.push({
                            pathname:`/thank-you/[id]`,
                            query:{id:`order_id=${'SKU' + order.id}date${order.date}`}
                        })
                    },300)
                    
                    

                }
            }
        }
        catch (e: any) {
            setProcessing(false)
            setCheckoutError(e.message)
            props.setComponentLoading(false)
        }

    }
    return (
        <div className="static-container">
        {
            checkoutSuccess?<div id="success" style={{color:"green",position:"fixed",display:"block",width:"100vw",height:"400px",lineHeight:"400px",top:"100px",opacity:0.001}}><p>Success</p></div>:
            null
        }
        {
            discountErr?
            <p style={{"color":"red"}}>{discountErr}</p>
            :null
        }
            <h1 className="main-heading center">{props.subscriptionId!==''?"Subscription ":""}Checkout</h1>
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

{
                context.state.cart.items.length<=0&&!checkoutSuccess?
                <div className="checkout-stock-message">
                <p className="checkout-stock-lines">You have no items in your basket, please select some products from our <Link className="link" href="/products">store</Link> to make a purchase.</p>
                </div>
                :null
            }
            <form className={styles["form"]} action="POST" onSubmit={(e) => placeOrder(e)} autoComplete="complete">
                
                
                <h2>Card Details</h2>
                <PaymentElement onChange={(e) => paymentElementHandler(e)} />

                {
                    context.cartLoaded &&
                    <div style={{"marginTop":"1rem"}}>
                        <ul>
                                    {
                                        context.state.cart.items.map((el:any,idx:number)=><li key={idx}className={"product-list-element"}>{el.name} {el.size} x {el.quantity}</li>)
                                    }
                        </ul>
                        {
                            !props.user?
                            <div id="guestEmailAddress"></div>:
                            null
                        }
                        <p>Subtotal: £<span id="subTotal">{!isSale?context.state.subTotal.toFixed(2).toString():(Number(context.state.subTotal)*0.9).toFixed(2).toString()}</span></p>
                        <p>Shipping: £<span id="shipping">{Number(props.shippingCost).toFixed(2)}</span></p>
                        {
                            discountTotal?
                            <p>Discount applied: <span id="discount">{discountDescription}</span></p>:
                            null

                        }
                        {
                            props.shippingCost?
                        <p>Total: £<span id="total" style={{"textDecoration":discountTotal?"lineThrough":"none"}}>{(Number(discountTotal!==null?discountTotal:!isSale?context.state.subTotal:(Number(context.state.subTotal)*0.9).toFixed(2))+Number(props.shippingCost)).toFixed(2).toString()}</span></p>
                            :null
                        }

                    </div>
                }
                

                    
                {
                    !props.user?.updates?

                <div className={styles["form-element-wrapper"]+" add-vertical-margin"}>
                <label htmlFor="updates">Receive updates</label>
                <input  autoComplete="complete" id="updates" type="checkbox" value={String(updates)} onChange={(e) => setUpdates(e.target.checked)} />
            </div>
                :
                null
                }
                <button id="placeOrder"  className="cta add-relative" type="submit" disabled={processing||!context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)} onClick={(e) => placeOrder(e)}>Submit
                
                </button>

                {
            discountErr?
            <p style={{"color":"red"}}>{discountErr}</p>
            :null
        }
                
            {
                !context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)?
                <div className="checkout-stock-message">
                <p className="checkout-stock-lines">Please delete the unavailable items from your <Link className="link" href="/cart">cart</Link> to continue checking out.</p>
                <button className="cta-sec-btn"onClick={(e)=>handleUnavailableItems()}>DELETE</button>
                
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
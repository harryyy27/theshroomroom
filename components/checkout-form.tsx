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
    const [dFirstName, setDFirstName] = useState('');
    const [dFirstNameVal, setDFirstNameVal] = useState<boolean | null>(null);
    const [dSurname, setDSurname] = useState('');
    const [dSurnameVal, setDSurnameVal] = useState<boolean | null>(null);
    const [dFirstLine, setDFirstLine] = useState('');
    const [dFirstLineVal, setDFirstLineVal] = useState<boolean | null>(null);
    const [dSecondLine, setDSecondLine] = useState('');
    const [dCity, setDCity] = useState('');
    const [dCityVal, setDCityVal] = useState<boolean | null>(null);
    const [dPostcode, setDPostcode] = useState('');
    const [dPostcodeVal, setDPostcodeVal] = useState<boolean | null>(null);
    const [dPhoneNumber,setDPhoneNumber]=useState('');
    const [dPhoneNumberVal, setDPhoneNumberVal] = useState<boolean | null>(null);
    const [billingDelivery,setBillingDelivery]=useState<boolean | null>(false);
    const [bFirstName, setBFirstName] = useState('');
    const [bFirstNameVal, setBFirstNameVal] = useState<boolean | null>(null);
    const [bSurname, setBSurname] = useState('');
    const [bSurnameVal, setBSurnameVal] = useState<boolean | null>(null);
    const [bFirstLine, setBFirstLine] = useState('');
    const [bFirstLineVal, setBFirstLineVal] = useState<boolean | null>(null);
    const [bSecondLine, setBSecondLine] = useState('');
    const [bCity, setBCity] = useState('');
    const [bCityVal, setBCityVal] = useState<boolean | null>(null);
    const [bPostcode, setBPostcode] = useState('');
    const [bPostcodeVal, setBPostcodeVal] = useState<boolean | null>(null);
    const [bPhoneNumber,setBPhoneNumber]=useState('');
    const [bPhoneNumberVal, setBPhoneNumberVal] = useState<boolean | null>(null);
    const [guestEmailAddress, setGuestEmailAddress] = useState('');
    const [guestEmailAddressVal, setGuestEmailAddressVal] = useState<boolean | null>(null)
    const [updates, setUpdates] = useState(false);
    const [user, setUser] = useState<UserSchema | null>(null);
    const [checkoutError, setCheckoutError] = useState('');
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);
    const [cardDetailsValid, setCardDetailsValid] = useState<boolean | null>(null);
    const [processing, setProcessing] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const [validPostcodes,setValidPostcodes]=useState<any|null>(null)
    const [deliveryHub,setDeliveryHub]=useState('');
    const [deliveryHubVal,setDeliveryHubVal]=useState(false);

    const stripe = useStripe();
    const setComponentLoading = props.setComponentLoading;
    const elements: any = useElements();
    const postCodeValidate=(formPostcode:string,validPostcodesArr:any)=>{
        
        const keys = Object.keys(validPostcodesArr)
        let validPostcode=false
        let postcodeArea=''
        const containsFresh = !context.state.cart.items.every((el:any)=>el.fresh===false)
        keys.forEach((key:string)=>{
            if(!validPostcodesArr[key as string].every((el:string)=>!formPostcode.toLowerCase().trim().startsWith(el.toLowerCase()))){
                validPostcode=true
                postcodeArea=key
            }
        })
        if(containsFresh===false&&formPostcode.length>0){
            validPostcode=true
        }
        if(validPostcode&&postcodeArea!==''){
            setDeliveryHub(postcodeArea)
            setDeliveryHubVal(true)
            return true
        }
        else if(validPostcode){
            setDeliveryHub('')
            setDeliveryHubVal(true)
            return true
        }
        else {
            setDeliveryHub('')
            setDeliveryHubVal(false)
            return false
        }
        
    }
    useEffect(() => {
        console.log("SUBSCRIPTION ISSSSSSS "+props.subscriptionId)
        setComponentLoading(true)
        setValidPostcodes(postcodes)
        setSubscription(props.subscriptionId)
        const initiate = async () => {
            const session = await getSession()
            if (session?.user) {
                setUser(session.user as any)
            }
            
            if (session) {
                fetch(`/api/getUser/${session.user.email}`)
                    .then((res) => {
                        return res.json()
                    })
                    .then((res) => {
                        if (res.error) {
                            console.log(res.error)
                            throw new Error('Unable to load user details')
                        }
                        if (res.user.dAddress.firstName && res.user.dAddress.firstName.length > 0) {
                            setDFirstName(res.user.dAddress.firstName);
                            setDFirstNameVal(true)
                        }
                        if (res.user.dAddress?.surname && res.user.dAddress?.surname.length > 0) {
                            setDSurname(res.user.dAddress.surname);
                            setDSurnameVal(true)
                        }
                        if (res.user.dAddress.firstLine && res.user.dAddress.firstLine.length > 0) {
                            setDFirstLine(res.user.dAddress.firstLine);
                            setDFirstLineVal(true)
                        }
                        if (res.user.dAddress.secondLine) {
                            setDSecondLine(res.user.dAddress.secondLine);
                        }
                        if (res.user.dAddress.city && res.user.dAddress.city.length > 0) {
                            setDCity(res.user.dAddress.city);
                            setDCityVal(true)
                        }
                        if (res.user.dAddress.postcode && res.user.dAddress.postcode.length > 0) {
                            if(postCodeValidate(res.user.dAddress.postcode,postcodes)){
                                setDPostcodeVal(true)
                            }
                            else {
                                setDPostcodeVal(false)
                            }
                            
                            setDPostcode(res.user.dAddress.postcode);
                        }
                        if (res.user.dAddress.phoneNumber && res.user.dAddress.phoneNumber.length > 0) {
                            setDPhoneNumber(res.user.dAddress.phoneNumber);
                            setDPhoneNumberVal(true)
                        }
                        if (res.user.bAddress.firstName && res.user.bAddress.firstName.length > 0) {
                            setBFirstName(res.user.bAddress.firstName);
                            setBFirstNameVal(true)
                        }
                        if (res.user.bAddress.surname && res.user.bAddress.surname.length > 0) {
                            setBSurname(res.user.bAddress.surname);
                            setBSurnameVal(true)
                        }
                        if (res.user.bAddress.firstLine && res.user.bAddress.firstLine.length > 0) {
                            setBFirstLine(res.user.bAddress.firstLine);
                            setBFirstLineVal(true)
                        }
                        if (res.user.bAddress.secondLine) {
                            setBSecondLine(res.user.bAddress.secondLine);

                        }
                        if (res.user.bAddress.city && res.user.bAddress.city.length > 0) {
                            setBCity(res.user.bAddress.city);
                            setBCityVal(true)

                        }
                        if (res.user.bAddress.postcode && res.user.bAddress.postcode.length > 0) {
                            setBPostcode(res.user.bAddress.postcode);
                            setBPostcodeVal(true)
                        }
                        if (res.user.bAddress.phoneNumber && res.user.bAddress.phoneNumber.length > 0) {
                            setBPhoneNumber(res.user.bAddress.phoneNumber);
                            setBPhoneNumberVal(true)
                        }
                        setUpdates(res.user.updates)
                        setComponentLoading(false)
                    })
                    .catch((e: any) => {
                        console.log(e)
                        setErrorMessage('Unable to load user details.')

                        setComponentLoading(false)
                    })
            }
            setComponentLoading(false)


        }
        initiate()
    }

        , [setComponentLoading])
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
            if (dFirstNameVal && dSurnameVal && dFirstLineVal && dCityVal && dPostcodeVal && dPhoneNumberVal && (billingDelivery||(bFirstNameVal && bSurnameVal && bFirstLineVal && bCityVal && bPostcodeVal && bPhoneNumberVal)) && cardDetailsValid&&deliveryHubVal) {
                if (guestEmailAddressVal || user) {
                    return true
                }
                else {
                    setCheckoutError('Please either sign in or provide a valid email for guest checkout')
                    setFormPosition()
                    return false
                }
            }
            else {
                if (!dFirstNameVal) {
                    setDFirstNameVal(false)
                }
                if (!dSurnameVal) {
                    setDSurnameVal(false)
                }
                if (!dFirstLineVal) {
                    setDFirstLineVal(false)
                }
                if (!dCityVal) {
                    setDCityVal(false)
                }
                if (!dPostcodeVal) {
                    setDPostcodeVal(false)
                }
                if (!dPhoneNumberVal) {
                    setDPhoneNumberVal(false)
                }
    
                if (!bFirstNameVal) {
                    setBFirstNameVal(false)
                }
                if (!bSurnameVal) {
                    setBSurnameVal(false)
                }
                if (!bFirstLineVal) {
                    setBFirstLineVal(false)
                }
                if (!bCityVal) {
                    setBCityVal(false)
                }
                if (!bPostcodeVal) {
                    setBPostcodeVal(false)
                }
                if (!bPhoneNumberVal) {
                    setBPhoneNumberVal(false)
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
                    "csrfToken": await getCsrfToken() as string,
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
            if (guestEmailAddress) {
                var guestCheckout = true;
                emailAddress = guestEmailAddress;
            }
            else {
                var guestCheckout = false;
                emailAddress = user?.email
                userId = user?.id
            }
            const eventInitiated = await fetch('/api/order', {
                method: "POST",
                headers: {
                    "csrfToken": await getCsrfToken() as string
                },
                body: JSON.stringify({
                    userId: userId,
                    email: emailAddress?.trim(),
                    guestCheckout: guestCheckout,
                    dAddress: {
                        firstName: dFirstName.trim(),
                        surname: dSurname.trim(),
                        firstLine: dFirstLine.trim(),
                        secondLine: dSecondLine.trim(),
                        city: dCity.trim(),
                        postcode: dPostcode.trim(),
                        phoneNumber:dPhoneNumber.trim()
                    },
                    bAddress: {
                        firstName: billingDelivery?dFirstName.trim():bFirstName.trim(),
                        surname: billingDelivery?dSurname.trim():bSurname.trim(),
                        firstLine: billingDelivery?dFirstLine.trim():bFirstLine.trim(),
                        secondLine: billingDelivery?dSecondLine.trim():bSecondLine.trim(),
                        city: billingDelivery?dCity.trim():bCity.trim(),
                        postcode: billingDelivery?dPostcode.trim():bPostcode.trim(),
                        phoneNumber: billingDelivery?dPhoneNumber.trim():bPhoneNumber.trim(),
                    },
                    products: context.state.cart,
                    shippingCost: context.state.shipping,
                    shippingMethod: context.state.shippingMethod,
                    deliveryHub:deliveryHub,
                    subtotal: context.state.subTotal,
                    total: context.state.total,
                    status: "INITIATED",
                    error: 'None',
                    paymentIntentId: props.paymentIntent.id,
                    updates: updates,
                    subscription: subscription
                })
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
                destroyCookie({}, "checkoutDetails", {
                    path: '/checkout'
                })
                await fetch('/api/order', {
                    method: "PUT",
                    headers: {
                        csrftoken: await getCsrfToken() as string
                    },
                    body: JSON.stringify({
                        paymentIntentId: props.paymentIntent.id,
                        status: 'ORDER_PENDING'
                    })
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
                <input autoComplete="new-password" name="hidden" type="text" style={{ "display": "none" }} />
                {
                    context.cartLoaded && user === null &&
                    <>
                        <h2>Guest Checkout</h2>
                        <FormComponent user={user} labelName={"Email Address"} variable={guestEmailAddress} variableName={Object.keys({ guestEmailAddress })[0]} setVariable={setGuestEmailAddress} variableVal={guestEmailAddressVal} setVariableVal={setGuestEmailAddressVal} inputType={"email"} required={!props.user} alternative={'sign in'} />

                    </>

                }
                <h2>Delivery Address</h2>
                <FormComponent user={user} labelName={"First Name"} variable={dFirstName} variableName={Object.keys({ dFirstName })[0]} setVariable={setDFirstName} variableVal={dFirstNameVal} setVariableVal={setDFirstNameVal} inputType={"text"} required={true} />
                <FormComponent user={user} labelName={"Surname"} variable={dSurname} variableName={Object.keys({ dSurname })[0]} setVariable={setDSurname} variableVal={dSurnameVal} setVariableVal={setDSurnameVal} inputType={"text"} required={true} />
                <FormComponent user={user} labelName={"Street name and number"} variable={dFirstLine} variableName={Object.keys({ dFirstLine })[0]} setVariable={setDFirstLine} variableVal={dFirstLineVal} setVariableVal={setDFirstLineVal} inputType={"text"} required={true} />

                <FormComponent user={user} labelName={"2nd Line of address"} variable={dSecondLine} variableName={Object.keys({ dSecondLine })[0]} setVariable={setDSecondLine} inputType={"text"} required={false} />
                <FormComponent user={user} labelName={"City"} variable={dCity} setVariable={setDCity} variableName={Object.keys({ dCity })[0]} variableVal={dCityVal} setVariableVal={setDCityVal} inputType={"text"} required={true} />
                <FormComponent user={user} labelName={"Postcode"} variable={dPostcode} variableName={Object.keys({ dPostcode })[0]} setVariable={setDPostcode} variableVal={dPostcodeVal} setVariableVal={setDPostcodeVal} inputType={"text"} required={true} callback={postCodeValidate} params={validPostcodes} />
                <Link className="link" href="/delivery">See delivery postcodes available for fresh mushrooms here</Link>
                <FormComponent user={user} labelName={"Phone Number"} variable={dPhoneNumber} variableName={Object.keys({ dPhoneNumber })[0]} setVariable={setDPhoneNumber} variableVal={dPhoneNumberVal} setVariableVal={setDPhoneNumberVal} inputType={"text"} required={true} />

                <div className={styles["form-element-wrapper"]+" add-vertical-margin"}>
                    <label htmlFor="billingDelivery">Billing same as delivery:</label>
                    <input  autoComplete="complete" id="billingDelivery" type="checkbox" value={String(updates)} onChange={(e) => setBillingDelivery(!billingDelivery)} />
                </div>
                {
                    !billingDelivery?
                    <>
                        <h2>Billing Address</h2>
                        <FormComponent user={user} labelName={"First Name"} variable={bFirstName} variableName={Object.keys({ bFirstName })[0]} setVariable={setBFirstName} variableVal={bFirstNameVal} setVariableVal={setBFirstNameVal} inputType={"text"} required={true} />
                        <FormComponent user={user} labelName={"Surname"} variable={bSurname} variableName={Object.keys({ bSurname })[0]} setVariable={setBSurname} variableVal={bSurnameVal} setVariableVal={setBSurnameVal} inputType={"text"} required={true} />
                        <FormComponent user={user} labelName={"Street name and number"} variable={bFirstLine} variableName={Object.keys({ bFirstLine })[0]} setVariable={setBFirstLine} variableVal={bFirstLineVal} setVariableVal={setBFirstLineVal} inputType={"text"} required={true} />

                        <FormComponent user={user} labelName={"2nd Line of address"} variable={bSecondLine} variableName={Object.keys({ bSecondLine })[0]} setVariable={setBSecondLine} inputType={"text"} required={false} />
                        <FormComponent user={user} labelName={"City"} variable={bCity} variableName={Object.keys({ bCity })[0]} setVariable={setBCity} variableVal={bCityVal} setVariableVal={setBCityVal} inputType={"text"} required={true} />
                        <FormComponent user={user} labelName={"Postcode"} variable={bPostcode} variableName={Object.keys({ bPostcode })[0]} setVariable={setBPostcode} variableVal={bPostcodeVal} setVariableVal={setBPostcodeVal} inputType={"text"} required={true} />
                        <FormComponent user={user} labelName={"Phone Number"} variable={bPhoneNumber} variableName={Object.keys({ bPhoneNumber })[0]} setVariable={setBPhoneNumber} variableVal={bPhoneNumberVal} setVariableVal={setBPhoneNumberVal} inputType={"tel"} required={true} />

                    </>:
                null
                }
                
                <h2>Card Details</h2>
                <PaymentElement onChange={(e) => paymentElementHandler(e)} />

                {
                    context.cartLoaded &&
                    <div style={{"marginTop":"1rem"}}>
                        <ul>
                                    {
                                        context.state.cart.items.map((el:any,idx:number)=><li key={idx}className={"product-list-element"}>{el.fresh?"Fresh":"Dry"} {el.name} {el.size} x {el.quantity}</li>)
                                    }
                        </ul>
                        <p>Subtotal: £<span id="subTotal">{context.state.subTotal.toString()}</span></p>
                        <p>Shipping: £<span id="shipping">{context.state.shipping.toString()}</span></p>
                        <p>Total: £<span id="total">{context.state.total.toString()}</span></p>

                    </div>
                }
                

                    

                <div className={styles["form-element-wrapper"]+" add-vertical-margin"}>
                    <label htmlFor="updates">Receive updates</label>
                    <input  autoComplete="complete" id="updates" type="checkbox" value={String(updates)} onChange={(e) => setUpdates(e.target.checked)} />
                </div>
                <button id="placeOrder"  className="cta add-relative" type="submit" disabled={processing||!context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)} onClick={(e) => placeOrder(e)}>Submit
                
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
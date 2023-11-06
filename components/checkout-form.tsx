import { getSession } from "next-auth/react"
import { useEffect, useState,FormEvent,useContext } from "react"
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js'

import styles from '../styles/Components/Form.module.css'
import {useRouter} from 'next/router'
import {getCsrfToken} from 'next-auth/react'
import {destroyCookie} from 'nookies'
import {CartContext} from '../context/cart';
import FormComponent from './form-component';
export interface Product {
    _id: String,
    price: number,
    quantity: number,
    name: string
  }
interface UserSchema {
    id: string,
    name: String,
    username: any,
    email: String|undefined,
    password: string|undefined,
    cart: {
        items:Product[]
    },
    dAddress: {
        firstName: String,
        surname: String,
        firstLine: String,
        secondLine: String,
        city: String,
        postcode: String,
    },
    bAddress: {
        firstName: String,
        surname: String,
        firstLine: String,
        secondLine:String,
        city: String,
        postcode: String,
    },
    updates: Boolean,
}
export default function CheckoutForm(props:any){
    const context = useContext(CartContext);
    const router = useRouter();
    const [dFirstName,setDFirstName]=useState('');
    const [dFirstNameVal,setDFirstNameVal]=useState<boolean|null>(null);
    const [dSurname,setDSurname]=useState('');
    const [dSurnameVal,setDSurnameVal]=useState<boolean|null>(null);
    const [dFirstLine,setDFirstLine]=useState('');
    const [dFirstLineVal,setDFirstLineVal]=useState<boolean|null>(null);
    const [dSecondLine,setDSecondLine]=useState('');
    const [dCity,setDCity]=useState('');
    const [dCityVal,setDCityVal]=useState<boolean|null>(null);
    const [dPostcode,setDPostcode]=useState('');
    const [dPostcodeVal,setDPostcodeVal]=useState<boolean|null>(null);
    const [bFirstName,setBFirstName]=useState('');
    const [bFirstNameVal,setBFirstNameVal]=useState<boolean|null>(null);
    const [bSurname,setBSurname]=useState('');
    const [bSurnameVal,setBSurnameVal]=useState<boolean|null>(null);
    const [bFirstLine,setBFirstLine]=useState('');
    const [bFirstLineVal,setBFirstLineVal]=useState<boolean|null>(null);
    const [bSecondLine,setBSecondLine]=useState('');
    const [bCity,setBCity]=useState('');
    const [bCityVal,setBCityVal]=useState<boolean|null>(null);
    const [bPostcode,setBPostcode]=useState('');
    const [bPostcodeVal,setBPostcodeVal]=useState<boolean|null>(null);
    const [guestEmailAddress,setGuestEmailAddress]=useState('');
    const [guestEmailAddressVal,setGuestEmailAddressVal]=useState<boolean|null>(null)
    const [updates,setUpdates]=useState(false);
    const [user,setUser]=useState<UserSchema|null>(null);
    const [checkoutError, setCheckoutError]=useState('');
    const [checkoutSuccess,setCheckoutSuccess] = useState('');
    const [cardDetailsValid,setCardDetailsValid]=useState<boolean|null>(null);
    const [processing,setProcessing] = useState(false)
    const [errorMessage,setErrorMessage] = useState('');
    const stripe = useStripe();
    const elements:any=useElements();
    useEffect(()=>{
        const initiate = async()=>{
            const session = await getSession()
            if(session?.user){
                setUser(session.user as any)
            }
            if(session){
                fetch(`http://localhost:3000/api/getUser/${session.user.email}`)
                .then((res)=>{
                    return res.json()
                })
                .then((res)=>{
                    if(res.error){
                        throw new Error('Unable to load user details')
                    }
                    if(res.user.dAddress.firstName&&res.user.dAddress.firstName.length>0){
                        setDFirstName(res.user.dAddress.firstName);
                    }
                    if(res.user.dAddress?.surname&&res.user.dAddress?.surname>0){
                        setDSurname(res.user.dAddress.surname);
                    }
                    if(res.user.dAddress.firstLine&&res.user.dAddress.firstLine.length>0){
                        setDFirstLine(res.user.dAddress.firstLine);
                    }
                    if(res.user.dAddress.secondLine){
                        setDSecondLine(res.user.dAddress.secondLine);
                    }
                    if(res.user.dAddress.city&&res.user.dAddress.city.length>0){
                        setDCity(res.user.dAddress.city);
                    }
                    if(res.user.dAddress.postcode&&res.user.dAddress.postcode.length>0){
                        setDPostcode(res.user.dAddress.postcode);
                    }
                    if(res.user.bAddress.firstName&&res.user.bAddress.firstName>0){
                        setBFirstName(res.user.bAddress.firstName);
                    }
                    if(res.user.bAddress.surname&&res.user.bAddress.surname>0){
                        setBSurname(res.user.bAddress.surname);
                    }
                    if(res.user.bAddress.firstLine&&res.user.bAddress.firstLine.length>0){
                        setBFirstLine(res.user.bAddress.firstLine);
                    }
                    if(res.user.bAddress.secondLine){
                        setBSecondLine(res.user.bAddress.secondLine);

                    }
                    if(res.user.bAddress.city&&res.user.bAddress.city.length>0){
                        setBCity(res.user.bAddress.city);

                    }
                    if(res.user.bAddress.postcode&&res.user.bAddress.postcode>0){
                        setBPostcode(res.user.bAddress.postcode);
                    }
                        setUpdates(res.user.updates)
                })
                .catch((e)=>{
                    setErrorMessage('Unable to load user details.')
                    setTimeout(function(){
                        setErrorMessage('');
                    },2000)
                })
            }
            
            
        }
        initiate()
    }
    
,[])
    const paymentElementHandler=(e:any)=>{
        if(e.complete){
            setCardDetailsValid(true)
        }
        else {
            setCardDetailsValid(false)
        }

    }
    const validate_form=()=>{
        if(dFirstNameVal&&dSurnameVal&&dFirstLineVal&&dCityVal&&dPostcodeVal&&bFirstNameVal&&bSurnameVal&&bFirstLineVal&&bCityVal&&bPostcodeVal&&cardDetailsValid){
            if(guestEmailAddressVal||user){
                return true
            }
            else {
                setCheckoutError('Please either sign in or provide a valid email for guest checkout')
                setFormPosition()
                return false
            }
        }
        else {
            setCheckoutError('Please fill in all required fields')
            setFormPosition()
            return false
        }
        
    }
    const setFormPosition=()=>{
        const first_error = document.querySelector('.error-text, .Error')
        if(first_error){
            var rect = first_error.getBoundingClientRect()
            const x = rect.left +first_error.clientWidth
            const y = rect.top + first_error.clientHeight
            window.scrollTo(x,y)

        }
    }
    const placeOrder=async(e:FormEvent)=>{
        e.preventDefault()
        try {
            setProcessing(true)
            const valid = validate_form()
            if(!valid){
                throw new Error('Please enter form details correctly')
            }
            var emailAddress;
            var userId=null;
            if(guestEmailAddress){
                var guestCheckout=true;
                emailAddress=guestEmailAddress;
            }
            else {
                var guestCheckout=false;
                emailAddress=user?.email
                userId=user?.id
            }
            const eventInitiated = await fetch('/api/order',{
                method: "POST",
                headers: {
                    "csrfToken": await getCsrfToken() as string
                },
                body: JSON.stringify({
                    userId: userId,
                    email:emailAddress,
                    guestCheckout: guestCheckout,
                    dAddress: {
                        firstName: dFirstName,
                        surname: dSurname,
                        firstLine: dFirstLine,
                        secondLine: dSecondLine,
                        city: dCity,
                        postcode: dPostcode,
                    },
                    bAddress: {
                        firstName: bFirstName,
                        surname: bSurname,
                        firstLine: bFirstLine,
                        secondLine: bSecondLine,
                        city: bCity,
                        postcode: bPostcode,
                    },
                    products: context.state.cart,
                    shippingCost: context.state.shipping,
                    shippingMethod:context.state.shippingMethod,
                    subtotal:context.state.subTotal,
                    total:context.state.total,
                    status:"INITIATED",
                    error: 'None',
                    paymentIntentId:props.paymentIntent.id
                })
            })
            const reachedDatabase = await eventInitiated.json()
            if(reachedDatabase.success===false){
                throw new Error("Order failed, no order received")
            }
            const {error, paymentIntent: {status}}:any=await stripe?.confirmPayment({
                elements,
                confirmParams:{
                    return_url:`${window.location.origin}/api/stripe_webhook`
                },
                redirect:"if_required"
            })
            if(error){
                await fetch('/api/order',{
                    method: "PUT",
                    headers: {
                        csrftoken: await getCsrfToken() as string
                    },
                    body: JSON.stringify({
                        paymentIntentId:props.paymentIntent.id,
                        status:'ORDER_FAILED_STRIPE',
                        error: error
                    })
                })
                throw new Error('Order failed stripe issue')
            }
            if( status==='succeeded'){
                destroyCookie(null, "paymentIntentId")
                destroyCookie(null,  "Cart")
                await fetch('/api/order',{
                    method: "PUT",
                    headers: {
                        csrftoken:await getCsrfToken() as string
                    },
                    body: JSON.stringify({
                        paymentIntentId:props.paymentIntent.id,
                        status:'ORDER_PENDING'
                    })
                })
                if(context&&context.dispatch){
                    context.dispatch({
                        type:"UPDATE_CART",
                        payload:{
                            items:[]
                        }
                        })
                    setCheckoutSuccess('Payment Made')

                }
            }
        }
        catch(e:any){
            setProcessing(false)
            setCheckoutError(e.message)
        }

    }
    if (checkoutSuccess) return <p>{checkoutSuccess}</p>
    return (
        <div className="static-container">
        <h1 className="main-heading center">CHECK ME OUT</h1>
        {
            errorMessage!==''?
            <p>{errorMessage}</p>:
            null
        }
            <form className={styles["form"]}action="POST" onSubmit={(e)=>placeOrder(e)} autoComplete="fuck-off">
                <input autoComplete="new-password" name="hidden" type="text" style={{"display":"none"}}/>
                {
                    context.loaded&&user===null&&
                        <>
                        <h2>Guest Checkout</h2>
                            <FormComponent user={user} labelName={"Email Address"}variable={guestEmailAddress}variableName={Object.keys({guestEmailAddress})[0]}  setVariable={setGuestEmailAddress} variableVal={guestEmailAddressVal} setVariableVal={setGuestEmailAddressVal} inputType={"email"}required={!props.user}alternative={'sign in'}/>
                    
                        </>

                }
                <h2>Delivery Address</h2>
                <FormComponent user={user} labelName={"First Name"}variable={dFirstName} variableName={Object.keys({dFirstName})[0]} setVariable={setDFirstName} variableVal={dFirstNameVal} setVariableVal={setDFirstNameVal} inputType={"text"} required={true}/>
                <FormComponent user={user} labelName={"Surname"}variable={dSurname} variableName={Object.keys({dSurname})[0]} setVariable={setDSurname} variableVal={dSurnameVal} setVariableVal={setDSurnameVal} inputType={"text"} required={true}/>
                <FormComponent user={user} labelName={"Street name and number"}variable={dFirstLine} variableName={Object.keys({dFirstLine})[0]}  setVariable={setDFirstLine} variableVal={dFirstLineVal} setVariableVal={setDFirstLineVal} inputType={"text"} required={true}/>
                
                <FormComponent user={user} labelName={"2nd Line of address"}variable={dSecondLine} variableName={Object.keys({dSecondLine})[0]} setVariable={setDSecondLine} inputType={"text"} required={false}/>
                <FormComponent user={user} labelName={"City"}variable={dCity} setVariable={setDCity} variableName={Object.keys({dCity})[0]}variableVal={dCityVal} setVariableVal={setDCityVal}inputType={"text"} required={true}/>
                <FormComponent user={user} labelName={"Postcode"}variable={dPostcode} variableName={Object.keys({dPostcode})[0]}setVariable={setDPostcode} variableVal={dPostcodeVal} setVariableVal={setDPostcodeVal} inputType={"text"} required={true}/>
                
                <h2>Billing Address</h2>
                <FormComponent user={user} labelName={"First Name"}variable={bFirstName} variableName={Object.keys({bFirstName})[0]}setVariable={setBFirstName} variableVal={bFirstNameVal} setVariableVal={setBFirstNameVal} inputType={"text"} required={true}/>
                <FormComponent user={user} labelName={"Surname"}variable={bSurname} variableName={Object.keys({bSurname})[0]}setVariable={setBSurname} variableVal={bSurnameVal} setVariableVal={setBSurnameVal} inputType={"text"} required={true}/>
                <FormComponent user={user} labelName={"Street name and number"}variable={bFirstLine} variableName={Object.keys({bFirstLine})[0]}setVariable={setBFirstLine} variableVal={bFirstLineVal} setVariableVal={setBFirstLineVal} inputType={"text"} required={true}/>
                
                <FormComponent user={user} labelName={"2nd Line of address"}variable={bSecondLine} variableName={Object.keys({bSecondLine})[0]}setVariable={setBSecondLine} inputType={"text"} required={false}/>
                <FormComponent user={user} labelName={"City"}variable={bCity} variableName={Object.keys({bCity})[0]}setVariable={setBCity} variableVal={bCityVal} setVariableVal={setBCityVal}inputType={"text"} required={true}/>
                <FormComponent user={user} labelName={"Postcode"}variable={bPostcode}variableName={Object.keys({bPostcode})[0]} setVariable={setBPostcode} variableVal={bPostcodeVal} setVariableVal={setBPostcodeVal} inputType={"text"} required={true}/>
                <h2>Card Details</h2>
                <PaymentElement onChange={(e)=>paymentElementHandler(e)}/>
                <div className={styles["form-element-wrapper"]}>
                    <label className={styles["form-label"]} htmlFor="updates">Receive updates</label>
                    <input className={styles["form-element"]} autoComplete="fuck-off" id="updates" type="checkbox" value={String(updates)} onChange={(e)=>setUpdates(e.target.checked)}/>
                </div>
                
                {
                    context.loaded&&
                        <div>
                            <p>Subtotal: <>{context.state.subTotal}</></p>
                            <p>Shipping: <>{context.state.shipping}</></p>
                            <p>Total: <>{context.state.total}</></p>

                        </div>
                }
                <button id="placeOrder" className="cta" type="submit" disabled={processing} onClick={(e)=>placeOrder(e)}>Submit</button>
            </form>
            {checkoutError&& <p className="form-error"style={{color:"red"}}>{checkoutError}</p>}
            </div>
    )
}
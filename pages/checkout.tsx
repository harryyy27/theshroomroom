
import { loadStripe } from '@stripe/stripe-js';
import {Metadata} from '../utils/metadata/metadata';
import Head from 'next/head';
import {
    Elements
  } from "@stripe/react-stripe-js";
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import {parseCookies, setCookie,destroyCookie} from 'nookies'
import {useEffect,useState,useContext} from 'react'
import { standardShippingPostcodes } from '../utils/standardPostcodes/postcodes';
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );
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
// import {useEffect,useContext} from 'react';
import { CartContext } from '../context/cart';
import {usePathname} from 'next/navigation'
import CheckoutForm from '../components/checkout-form'
import ProgressBar from '../components/progress-bar'
import Address from '../components/checkout-address'
import Shipping from '../components/checkout-shipping'
import { Product } from '../utils/types'
import { NextApiRequest, NextApiResponse } from 'next';
import localPostcodes from '../utils/localPostcodes/postcodes'
export default function Checkout(props:any){
    const context = useContext(CartContext);
    const [phase,setPhase]=useState(1)
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
    const [errorMessage, setErrorMessage] = useState('');
    const [deliveryHub,setDeliveryHub]=useState('');
    const [deliveryHubVal,setDeliveryHubVal]=useState(false);
    const [shippingCost,setShippingCost]=useState<number | null>(null)
    const [shippingCostVal,setShippingCostVal]=useState(false)
    const [shippingType,setShippingType]=useState('');
    const [shippingTypeVal,setShippingTypeVal]=useState(false);
    const [billingDelivery,setBillingDelivery]=useState<boolean | null>(false);
    const [paymentIntent,setPaymentIntent]=useState('');
    const [subscription,setSubscription]=useState(false);
    const [subscriptionId,setSubscriptionId]=useState('');
    const [options,setOptions] = useState({
        clientSecret:''
    })
    const [code,setCode]=useState('');
    const [codeVal,setCodeVal]=useState<boolean | null>(null)
    const [local,setLocal]=useState(false);
    const [loaded,setLoaded]=useState(false);
    const [mounted,setMounted]=useState(false);
    const [discountFailed,setDiscountFailed]=useState(false)
    const [discountId,setDiscountId]=useState('')
    const pathname = usePathname()
    // const context = useContext(CartContext);

    

    const localPostcodeValidate=(formPostcode:string,validPostcodesArr:any)=>{
        const keys = Object.keys(validPostcodesArr)
        let validPostcode=false
        let postcodeArea=''
        // const containsFresh = !context.state.cart.items.every((el:any)=>el.fresh===false)
        keys.forEach((key:string)=>{
            if(!validPostcodesArr[key as string].every((el:string)=>{
                return !formPostcode.toLowerCase().trim().startsWith(el.toLowerCase())}
            )){
                validPostcode=true
                postcodeArea=key
            }
        })
        // if(containsFresh===false&&formPostcode.length>0){
        //     validPostcode=true
        // }
        if(formPostcode.length>0){
            validPostcode=true
        }
        if(validPostcode&&postcodeArea!==''){
                    setLocal(true)
                    return true
        }
        else if(validPostcode||!standardShippingPostcodes.every((el:any)=>!formPostcode.toLowerCase().trim().split(' ').join('').startsWith(el.toLowerCase()))){
            
                    setLocal(false)
                    return true
        }
        else {
            setLocal(false)
            return false
        }
    }
    async function handleGetPaymentIntent(){
        var subscription = window.location.href.split('checkout?').length>1;
            const res= await fetch(`/api/get-payment-intent?subscription=${subscription?true:false}&shippingCost=${shippingCost}&postcode=${dPostcode}${code!==''?`&code=${code}`:''}`)
            const resJson = await res.json()
        
        return resJson
    }
    

        useEffect(()=>{
            setLoaded(false)
            document?.querySelector('html')?.scroll(0,0)
            var subscription = window.location.href.split('checkout?')
            if(subscription.length>1){
                setSubscription(true)

            }
                
                
            async function initiate(){
                try{
                    props.setComponentLoading(true)
                    const res =await handleGetPaymentIntent()
                    if(res.props.refresh){
                        window.location.href=`/`
                    }
                    if(res.props.paymentIntent){
                        setOptions({clientSecret:res.props.paymentIntent.client_secret})
                        setPaymentIntent(res.props.paymentIntent)
                        setSubscriptionId(res.props.subscriptionId)
                        
                        if(res.props.discountFailed){
                            setDiscountFailed(res.props.discountFailed)
                        }
                    }
                    setLoaded(true)
                    props.setComponentLoading(false)
                
                }
                catch(e){
                    console.log(e)
                    props.setComponentLoading(false)
                }
                
            }
            
            if(props.refresh){
                window.location.href=`/`
            }
            if(mounted===false){

                if(props.user?.user){
                    setUser(props.user.user)
                    const userDAddress = props.user.user.dAddress
                        const userBAddress = props.user.user.bAddress
                        if (userDAddress.firstName && userDAddress.firstName.length > 0) {
                            setDFirstName(userDAddress.firstName);
                            setDFirstNameVal(true)
                        }
                        if (userDAddress?.surname && userDAddress?.surname.length > 0) {
                            setDSurname(userDAddress.surname);
                            setDSurnameVal(true)
                        }
                        if (userDAddress.firstLine && userDAddress.firstLine.length > 0) {
                            setDFirstLine(userDAddress.firstLine);
                            setDFirstLineVal(true)
                        }
                        if (userDAddress.secondLine) {
                            setDSecondLine(userDAddress.secondLine);
                        }
                        if (userDAddress.city && userDAddress.city.length > 0) {
                            setDCity(userDAddress.city);
                            setDCityVal(true)
                        }
                        if (userDAddress.postcode && userDAddress.postcode.length > 0) {
                            if(localPostcodeValidate(userDAddress.postcode,localPostcodes)){
                                console.log('local')
                                setDPostcodeVal(true)
                                setLocal(true)
                            }
                            else {
                                console.log('not local')
                                setDPostcodeVal(false)
                            }
                            
                            setDPostcode(userDAddress.postcode);
                        }
                        if (userDAddress.phoneNumber && userDAddress.phoneNumber.length > 0) {
                            setDPhoneNumber(userDAddress.phoneNumber);
                            setDPhoneNumberVal(true)
                        }
                        if (userBAddress.firstName && userBAddress.firstName.length > 0) {
                            setBFirstName(userBAddress.firstName);
                            setBFirstNameVal(true)
                        }
                        if (userBAddress.surname && userBAddress.surname.length > 0) {
                            setBSurname(userBAddress.surname);
                            setBSurnameVal(true)
                        }
                        if (userBAddress.firstLine && userBAddress.firstLine.length > 0) {
                            setBFirstLine(userBAddress.firstLine);
                            setBFirstLineVal(true)
                        }
                        if (userBAddress.secondLine) {
                            setBSecondLine(userBAddress.secondLine);
    
                        }
                        if (userBAddress.city && userBAddress.city.length > 0) {
                            setBCity(userBAddress.city);
                            setBCityVal(true)
    
                        }
                        if (userBAddress.postcode && userBAddress.postcode.length > 0) {
                            setBPostcode(userBAddress.postcode);
                            setBPostcodeVal(true)
                        }
                        if (userBAddress.phoneNumber && userBAddress.phoneNumber.length > 0) {
                            setBPhoneNumber(userBAddress.phoneNumber);
                            setBPhoneNumberVal(true)
                        }
                        if(Object.keys(userBAddress).length>0&&Object.keys(userDAddress).length>0&&Object.keys(userBAddress).every((el:any)=>userBAddress[el]===userDAddress[el])){
                            setBillingDelivery(true)
                        }
                        else{
                            setBillingDelivery(false)
                        }
                        setUpdates(props.user.user.updates)
                }
                setMounted(true)
            }
            if(phase===3){
                initiate()
            }

            
        },[phase])
    function handlePhaseChange(phaseNumber:number){
        setPhase(phaseNumber)
    }
    
    
   
    
    return(
            <>
                <Head>
                    <title>Mega Mushrooms - rare, healthy, London grown lion's mane mushrooms</title>
                    <meta name="description" content="Discover the Power of Lion's Mane Mushrooms! 🍄 Elevate your well-being with our premium Lion's Mane mushrooms - nature's brain booster and immunity enhancer. Handpicked for quality and potency, our organic Lion's Mane products are a natural path to mental clarity and vitality. Explore our range of fresh and dried Lion's Mane mushrooms today and experience the unmatched benefits of this extraordinary fungi. Your journey to optimal health starts here."/>
                    <meta property="og:title" content="Mega Mushrooms - buy our high quality lion's mane mushrooms here"/>
                    <meta property="og:description" content="Reap the rewards of adding this healthy, medicinal and delicious mushroom to your diet"/>
                </Head>
                <ProgressBar phase={phase} handlePhaseChange={handlePhaseChange}/>
                {
                    phase===1?
                    <Address 
                        dFirstName={dFirstName}
                        setDFirstName={setDFirstName}
                        dFirstNameVal={dFirstNameVal}
                        setDFirstNameVal={setDFirstNameVal}
                        dSurname={dSurname}
                        setDSurname={setDSurname}
                        dSurnameVal={dSurnameVal}
                        setDSurnameVal={setDSurnameVal}
                        dFirstLine={dFirstLine}
                        setDFirstLine={setDFirstLine}
                        dFirstLineVal={dFirstLineVal}
                        setDFirstLineVal={setDFirstLineVal}
                        dSecondLine={dSecondLine}
                        setDSecondLine={setDSecondLine}
                        dCity={dCity}
                        setDCity={setDCity}
                        dCityVal={dCityVal}
                        setDCityVal={setDCityVal}
                        dPostcode={dPostcode}
                        setDPostcode={setDPostcode}
                        dPostcodeVal={dPostcodeVal}
                        setDPostcodeVal={setDPostcodeVal}
                        dPhoneNumber={dPhoneNumber}
                        setDPhoneNumber={setDPhoneNumber}
                        dPhoneNumberVal={dPhoneNumberVal}
                        setDPhoneNumberVal={setDPhoneNumberVal}
                        bFirstName={bFirstName}
                        setBFirstName={setBFirstName}
                        bFirstNameVal={bFirstNameVal}
                        setBFirstNameVal={setBFirstNameVal}
                        bSurname={bSurname}
                        setBSurname={setBSurname}
                        bSurnameVal={bSurnameVal}
                        setBSurnameVal={setBSurnameVal}
                        bFirstLine={bFirstLine}
                        setBFirstLine={setBFirstLine}
                        bFirstLineVal={bFirstLineVal}
                        setBFirstLineVal={setBFirstLineVal}
                        bSecondLine={bSecondLine}
                        setBSecondLine={setBSecondLine}
                        bCity={bCity}
                        setBCity={setBCity}
                        bCityVal={bCityVal}
                        setBCityVal={setBCityVal}
                        bPostcode={bPostcode}
                        setBPostcode={setBPostcode}
                        bPostcodeVal={bPostcodeVal}
                        setBPostcodeVal={setBPostcodeVal}
                        bPhoneNumber={bPhoneNumber}
                        setBPhoneNumber={setBPhoneNumber}
                        bPhoneNumberVal={bPhoneNumberVal}
                        setBPhoneNumberVal={setBPhoneNumberVal}
                        billingDelivery={billingDelivery}
                        setBillingDelivery={setBillingDelivery}
                        guestEmailAddress={guestEmailAddress}
                        setGuestEmailAddress={setGuestEmailAddress}
                        guestEmailAddressVal={guestEmailAddressVal}
                        setGuestEmailAddressVal={setGuestEmailAddressVal}
                        updates={updates}
                        setUpdates={setUpdates}
                        user={user}
                        setUser={setUser}
                        checkoutError={checkoutError}
                        setCheckoutError={setCheckoutError}
                        checkoutSuccess={checkoutSuccess} 
                        setCheckoutSuccess={setCheckoutSuccess}
                        errorMessage={errorMessage}
                        setErrorMessage={setErrorMessage}
                        deliveryHub={deliveryHub}
                        setDeliveryHub={setDeliveryHub}
                        deliveryHubVal={deliveryHubVal}
                        setDeliveryHubVal={setDeliveryHubVal}
                        local={local}
                        setLocal={setLocal}
                        setComponentLoading={props.setComponentLoading}
                        handlePhaseChange={handlePhaseChange}
                        subscription={subscription}
                    />:
                    phase===2?
                    <Shipping
                        setComponentLoading={props.setComponentLoading}
                        dPostcode={dPostcode}
                        shippingCost={shippingCost}
                        setShippingCost={setShippingCost}
                        shippingCostVal={shippingCostVal}
                        setShippingCostVal={setShippingCostVal}
                        shippingType={shippingType}
                        setShippingType={setShippingType}
                        shippingTypeVal={shippingTypeVal}
                        setShippingTypeVal={setShippingTypeVal}
                        local={local}
                        subscription={subscription}
                        handlePhaseChange={handlePhaseChange}
                        code={code}
                        discountId={discountId}
                        setCode={setCode}
                        setDiscountId={setDiscountId}
                        user={user}

                    />:
                    phase===3&&
                    loaded&&paymentIntent?
                <Elements stripe={stripePromise} options={options} >
                    <CheckoutForm
                        dFirstName={dFirstName}
                        setDFirstName={setDFirstName}
                        dFirstNameVal={dFirstNameVal}
                        setDFirstNameVal={setDFirstNameVal}
                        dSurname={dSurname}
                        setDSurname={setDSurname}
                        dSurnameVal={dSurnameVal}
                        setDSurnameVal={setDSurnameVal}
                        dFirstLine={dFirstLine}
                        setDFirstLine={setDFirstLine}
                        dFirstLineVal={dFirstLineVal}
                        setDFirstLineVal={setDFirstLineVal}
                        dSecondLine={dSecondLine}
                        setDSecondLine={setDSecondLine}
                        dCity={dCity}
                        setDCity={setDCity}
                        dCityVal={dCityVal}
                        setDCityVal={setDCityVal}
                        dPostcode={dPostcode}
                        setDPostcode={setDPostcode}
                        dPostcodeVal={dPostcodeVal}
                        setDPostcodeVal={setDPostcodeVal}
                        dPhoneNumber={dPhoneNumber}
                        setDPhoneNumber={setDPhoneNumber}
                        dPhoneNumberVal={dPhoneNumberVal}
                        setDPhoneNumberVal={setDPhoneNumberVal}
                        bFirstName={bFirstName}
                        setBFirstName={setBFirstName}
                        bFirstNameVal={bFirstNameVal}
                        setBFirstNameVal={setBFirstNameVal}
                        bSurname={bSurname}
                        setBSurname={setBSurname}
                        bSurnameVal={bSurnameVal}
                        setBSurnameVal={setBSurnameVal}
                        bFirstLine={bFirstLine}
                        setBFirstLine={setBFirstLine}
                        bFirstLineVal={bFirstLineVal}
                        setBFirstLineVal={setBFirstLineVal}
                        bSecondLine={bSecondLine}
                        setBSecondLine={setBSecondLine}
                        bCity={bCity}
                        setBCity={setBCity}
                        bCityVal={bCityVal}
                        setBCityVal={setBCityVal}
                        bPostcode={bPostcode}
                        setBPostcode={setBPostcode}
                        bPostcodeVal={bPostcodeVal}
                        setBPostcodeVal={setBPostcodeVal}
                        bPhoneNumber={bPhoneNumber}
                        setBPhoneNumber={setBPhoneNumber}
                        bPhoneNumberVal={bPhoneNumberVal}
                        setBPhoneNumberVal={setBPhoneNumberVal}
                        guestEmailAddress={guestEmailAddress}
                        setGuestEmailAddress={setGuestEmailAddress}
                        guestEmailAddressVal={guestEmailAddressVal}
                        setGuestEmailAddressVal={setGuestEmailAddressVal}
                        billingDelivery={billingDelivery}
                        updates={updates}
                        setUpdates={setUpdates}
                        user={user}
                        setUser={setUser}
                        checkoutError={checkoutError}
                        setCheckoutError={setCheckoutError}
                        checkoutSuccess={checkoutSuccess} 
                        setCheckoutSuccess={setCheckoutSuccess}
                        errorMessage={errorMessage}
                        setErrorMessage={setErrorMessage}
                        deliveryHub={deliveryHub}
                        setDeliveryHub={setDeliveryHub}
                        deliveryHubVal={deliveryHubVal}
                        setDeliveryHubVal={setDeliveryHubVal}
                        local={local}
                        setLocal={setLocal}
                        shippingCost={shippingCost}
                        setShippingCost={setShippingCost}
                        shippingCostVal={shippingCostVal}
                        setShippingCostVal={setShippingCostVal}
                        shippingType={shippingType}
                        setShippingType={setShippingType}
                        shippingTypeVal={shippingTypeVal}
                        setShippingTypeVal={setShippingTypeVal}
                        paymentIntent={paymentIntent}  
                        setComponentLoading={props.setComponentLoading} 
                        subscriptionId={subscriptionId}
                        handlePhaseChange={handlePhaseChange}
                        code={code}
                        discountId={discountId}
                        discountFailed={discountFailed}/>
                </Elements>:null
                }
                
            </>
    )
}

export async function getServerSideProps(ctx:any){
    try {
        
        const {req,res}=ctx;
        
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{

        });
        const body = ctx.resolvedUrl
        const sesh = await getSession(ctx)
        const {Cart}= parseCookies({req},{
            path:"/"
        })
        let subscriptionCheckout = body?.split('subscription=').length===2
        let total;

        if(sesh&&sesh.user&&sesh.user.cart){
            total = sesh.user.cart.items.reduce((a:number,b:Product)=>{
                return a+b.price*b.quantity
            },0)

        }
        else if(Cart) {
            total = JSON.parse(Cart).items.reduce((a:number,b:Product)=>{
                return a+b.price*b.quantity
            },0)
        }
        if(!sesh&&!Cart){
            return {
                props:{
                    refresh:true
                },
                };
        }
        
        let paymentIntent;
        const {checkoutDetails} = parseCookies({req},{
            path:"/checkout"
        })
        if(checkoutDetails){

            var paymentIntentId=JSON.parse(checkoutDetails).paymentIntentId
            var subscriptionId=JSON.parse(checkoutDetails).subscriptionId

            paymentIntent=await stripe.paymentIntents.retrieve(paymentIntentId)
            if(
                !(paymentIntent.status==="canceled"||
                paymentIntent.status==="succeeded"||
                (subscriptionId===''&&subscriptionCheckout===true)||
                (subscriptionId!==''&&subscriptionCheckout===false))
            ){
                if(!(subscriptionId===''&&subscriptionCheckout===false)&&!(subscriptionId!==''&&subscriptionCheckout==true)){
                
                    return {
                        props:{
                            refresh:true
                        },
                    };
                    
                }
                    
            }
                
        }
        return {
            props:{
                user:sesh
            }
        }
                
                
    }
    catch(e:any){
        console.log(e)
        return {
            props:{
                refresh:true
            },
            };
    }
}
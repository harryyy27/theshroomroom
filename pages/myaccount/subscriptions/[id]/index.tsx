import { getCsrfToken, getSession } from "next-auth/react";
import {Session} from 'next-auth';
import {useRouter} from "next/router";
import { useEffect,useState,FormEvent } from "react";
import authenticate from '../../../../utils/authenticationRequired';
import Link from 'next/link';
import FormComponent from "../../../../components/form-component";
import Head from 'next/head'
import {Metadata} from '../../../../utils/metadata/metadata'
import postcodes from '../../../../utils/zedPostcodes/postcodes'
export default function Subscription({setComponentLoading}:any){
    const [cancelSubscriptionId,setCancelSubscriptionId]=useState('');
    const [cancelError, setCancelError]=useState<string|null>(null)
    const [error,setError]=useState<string|null>(null)
    const router = useRouter()
    const [subscriptionId,setSubscriptionId]=useState('');
    const [subscription,setSubscription]=useState<any>([]);
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
    const [emailAddress, setEmailAddress] = useState('');
    const [status,setStatus]=useState('');
    const [err,setErr]=useState('')
    const [amendSuccess,setAmendSuccess]=useState(false)
    const [validPostcodes,setValidPostcodes]=useState<any|null>(null)
    const [deliveryHub,setDeliveryHub]=useState('');
    const [deliveryHubVal,setDeliveryHubVal]=useState(false);
    async function getSubscriptions(sesh:Session){
        try{
            setComponentLoading(true)
            const subscription_id=window.location.href.split('/subscriptions/')[1]
            const subscriptionData = await fetch(`/api/subscriptions/?subscription_id=${subscription_id}`,{
                method:"GET"
            })
            const subscriptionDetails = await subscriptionData.json()
            const subscriptionArr = subscriptionDetails.subscriptions

            setSubscription(subscriptionArr)
            setComponentLoading(false)
            if(subscription){
                setSubscriptionId(subscriptionArr[0].subscriptionId)
                setEmailAddress(subscriptionArr[0].emailAddress)
                setStatus(subscriptionArr[0].status)
                if (subscriptionArr[0].dAddress.firstName && subscriptionArr[0].dAddress.firstName.length > 0) {
                    setDFirstName(subscriptionArr[0].dAddress.firstName);
                    setDFirstNameVal(true)
                }
                if (subscriptionArr[0].dAddress?.surname && subscriptionArr[0].dAddress?.surname.length > 0) {
                    setDSurname(subscriptionArr[0].dAddress.surname);
                    setDSurnameVal(true)
                }
                if (subscriptionArr[0].dAddress.firstLine && subscriptionArr[0].dAddress.firstLine.length > 0) {
                    setDFirstLine(subscriptionArr[0].dAddress.firstLine);
                    setDFirstLineVal(true)
                }
                if (subscriptionArr[0].dAddress.secondLine) {
                    setDSecondLine(subscriptionArr[0].dAddress.secondLine);
                }
                if (subscriptionArr[0].dAddress.city && subscriptionArr[0].dAddress.city.length > 0) {
                    setDCity(subscriptionArr[0].dAddress.city);
                    setDCityVal(true)
                }
                if (subscriptionArr[0].dAddress.postcode && subscriptionArr[0].dAddress.postcode.length > 0) {
                    setDPostcode(subscriptionArr[0].dAddress.postcode);
                    setDPostcodeVal(true)
                }

                if (subscriptionArr[0].dAddress.phoneNumber && subscriptionArr[0].dAddress.phoneNumber.length > 0) {
                    setDPhoneNumber(subscriptionArr[0].dAddress.phoneNumber);
                    setDPhoneNumberVal(true)
                }
                if (subscriptionArr[0].bAddress.firstName && subscriptionArr[0].bAddress.firstName.length > 0) {
                    setBFirstName(subscriptionArr[0].bAddress.firstName);
                    setBFirstNameVal(true)
                }
                if (subscriptionArr[0].bAddress.surname && subscriptionArr[0].bAddress.surname.length > 0) {
                    setBSurname(subscriptionArr[0].bAddress.surname);
                    setBSurnameVal(true)
                }
                if (subscriptionArr[0].bAddress.firstLine && subscriptionArr[0].bAddress.firstLine.length > 0) {
                    setBFirstLine(subscriptionArr[0].bAddress.firstLine);
                    setBFirstLineVal(true)
                }
                if (subscriptionArr[0].bAddress.secondLine) {
                    setBSecondLine(subscriptionArr[0].bAddress.secondLine);

                }
                if (subscriptionArr[0].bAddress.city && subscriptionArr[0].bAddress.city.length > 0) {
                    setBCity(subscriptionArr[0].bAddress.city);
                    setBCityVal(true)

                }
                if (subscriptionArr[0].bAddress.postcode && subscriptionArr[0].bAddress.postcode.length > 0) {
                    setBPostcode(subscriptionArr[0].bAddress.postcode);
                    setBPostcodeVal(true)
                }
                if (subscriptionArr[0].bAddress.phoneNumber && subscriptionArr[0].bAddress.phoneNumber.length > 0) {
                    setBPhoneNumber(subscriptionArr[0].bAddress.phoneNumber);
                    setBPhoneNumberVal(true)
                }
                if(subscriptionArr[0].deliveryHub&& subscriptionArr[0].deliveryHub.length>0){
                    setDeliveryHub(subscriptionArr[0].deliveryHub)
                    setDeliveryHubVal(true)
                }
            }

        }
        catch(e:any){
            await fetch('/api/clientSideError',{
                method:"POST",
                headers: {
                    "csrfToken": await getCsrfToken() as string,
                    "client-error": "true"
                },
                body:JSON.stringify({
                    error:e.message,
                    stack:e.stack
                })
            })
            setComponentLoading(false)
            setError(e)

        }

    }
    useEffect(()=>{
        
        const initiate=async()=>{
            try{
                const sesh = await getSession()
                setValidPostcodes(postcodes)
                if(!sesh){
                    throw new Error("You should be logged in to view this page")
                }
                await getSubscriptions(sesh)

            }
            catch(e:any){
                console.log(e)
                router.push("/")
            }
        }
        initiate()
    },[setComponentLoading])
    

            
        
    const validate_form = async() => {
        try{
            if (dFirstNameVal && dSurnameVal && dFirstLineVal && dCityVal && dPostcodeVal && dPhoneNumberVal&&bFirstNameVal && bSurnameVal && bFirstLineVal && bCityVal && bPostcodeVal && bPhoneNumberVal) {
                
                    return true
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
                    setBPhoneNumber
                }
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
    // async function amendSubscription(e:FormEvent) {
    //     try{
    //         e.preventDefault()
    //         const valid = await validate_form()
    //         if(valid){
    //             const csrftoken=await getCsrfToken()
    //             if(!csrftoken){
    //                 throw new Error("No csrfin here")
    //             }
    //             const res = await fetch(`/api/subscriptions`,{
    //                 method:"PUT",
    //                 headers:{
    //                     csrftoken:csrftoken
    //                 },
    //                 body:JSON.stringify(
    //                     {
    //                         amend:true,
    //                         subscriptionId:subscription[0].subscriptionId,
                           
    //                     dAddress: {
    //                         firstName: dFirstName,
    //                         surname: dSurname,
    //                         firstLine: dFirstLine,
    //                         secondLine: dSecondLine,
    //                         city: dCity,
    //                         postcode: dPostcode,
    //                         phoneNumber:dPhoneNumber
    //                     },
    //                     bAddress: {
    //                         firstName: bFirstName,
    //                         surname: bSurname,
    //                         firstLine: bFirstLine,
    //                         secondLine: bSecondLine,
    //                         city: bCity,
    //                         postcode: bPostcode,
    //                         phoneNumber:bPhoneNumber
    //                     },
    //                     deliveryHub:deliveryHub
    //                     }
    //                 )
    //             })
    //             const resJson=await res.json()
    //             if(resJson.success){
    //                 setAmendSuccess(true)
    
    //             }
    //             else{
    //                 throw new Error('request unsucessful')
    //             }
    
    //         }
    //         else{
    //             throw new Error('Form not valid');
    //         }
    //     }
    //     catch(e:any){
    //         console.log(e)
    //         setErr(e)
    //     }
        
        
    // }
    async function cancelSubscription(e:FormEvent,idx:number){
        try{
            setComponentLoading(true)
            e.preventDefault()
            const csrftoken=await getCsrfToken()
            if(!csrftoken){
                throw new Error("No csrfin here")
            }
            const res = await fetch('/api/subscriptions',{
                method:"DELETE",
                headers: {
                    csrftoken: csrftoken
                },
                body: JSON.stringify({
                    subscription_id: subscriptionId
                })
            })
            const json = await res.json()
            if(json.success){
                showCancelledModal(true,idx)
            }
            else {
                setCancelError('Cancel went wrong')
            }
            setComponentLoading(false)
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
            setComponentLoading(false)
            setCancelError(error)
        }

    }
    function showModal(open:boolean,id:string,idx:number){
        try{
            let modal = document.querySelectorAll(`.SUBSCRIPTION_ACTIVE${idx} .cancel-modal`)[0]
            if(open){
                modal?.classList.remove("hidden")
                
            }
            else {
                modal?.classList.add("hidden")
            }
            setCancelSubscriptionId(id)

        }
        catch(e:any){

            setError(e)
        }
    }
    function showCancelledModal(open:boolean,idx:number){
        try{
            let modal = document.querySelectorAll(`.SUBSCRIPTION_ACTIVE${idx} .cancelled-modal`)[0]
            let cancelbtn= document.querySelectorAll(`.SUBSCRIPTION_ACTIVE${idx} .cta`)[0]
            if(open){
                modal?.classList.remove("hidden")
                cancelbtn?.classList.add("hidden")
                
            }
            else {
                modal?.classList.add("hidden")
            }

        }
        catch(e:any){

            setError(e)
        }
    }
    const postCodeValidate=(formPostcode:string,validPostcodesArr:any)=>{
        
        const keys = Object.keys(validPostcodesArr)
        let validPostcode=false
        let postcodeArea=''
        keys.forEach((key:string)=>{
            if(!validPostcodesArr[key as string].every((el:string)=>!formPostcode.toLowerCase().trim().startsWith(el.toLowerCase()))){
                validPostcode=true
                postcodeArea=key
            }
        })
        if(formPostcode.length>0){
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
    return(
        <div className="static-container">

<Head>
            <title>{Metadata["general"]["title"]}</title>
                <meta name="description" content={Metadata["general"]["description"]}/>
                <meta property="og:title" content={Metadata["general"]["title"]}/>
                <meta property="og:description" content={Metadata["general"]["description"]}/>
            </Head>
        {/* {
        error?
            <p>{error}</p>:
            null    
        } */}
        {
            subscription.length?
            subscription.map((el:any,idx:number)=>{
                return(
                    <div key={idx}>
                        
                        <h1 className="main-heading center">Subscription ID: {el.subscriptionId}</h1>
                        <p>Subscription status: {el.status}</p>
                        <p>Date of purchase: {el.dateOfPurchase}</p>
                        <p>Renewal date: {el.dateRenewal}</p>
                        <ul>
                            {el.products.items.map((el_product:any,idxPr:number)=>{
                                return(
                                    <li key={idxPr}>
                                        <p><span>{el_product.name}</span><span> - £{el_product.price.toFixed(2)} {el_product.quantity>1?`x${el_product.quantity}`:''}</span></p>
                                    </li>
        
                                )
                            })}
                        </ul>
                        <p>Subtotal: £{el.subtotal.toFixed(2)}</p>
                        <p>Shipping cost: £{el.shippingCost.toFixed(2)}</p>
                        <p>Total: £{el.total.toFixed(2)}</p>
                        <div>
                        <h2>Delivery Address</h2>
                            <p>{dFirstName}</p>
                            <p>{dSurname}</p>
                            <p>{dFirstLine}</p>
                            <p>{dSecondLine}</p>
                            <p>{dCity}</p>
                            <p>{dPostcode}</p>
                            <h2>Billing Address</h2>
                            <p>{bFirstName}</p>
                            <p>{bSurname}</p>
                            <p>{bFirstLine}</p>
                            <p>{bSecondLine}</p>
                            <p>{bCity}</p>
                            <p>{bPostcode}</p>
                        </div>
                        {
                            el.status === "SUBSCRIPTION_ACTIVE"?
                        <div className={el.status+idx}>
                            <button className="cta left" onClick={(e)=>{
                                showModal(true,el._id,idx)
                            }}>Cancel</button>
                            <div className={`cancel-modal hidden`}>
                                <p>Are you sure you&apos;d like to cancel your subscription?</p>
                                <button className="cta-sec-btn" onClick={(e)=>{
                                    cancelSubscription(e,idx)
                                    showModal(false,'',idx)
                                }}>Yes</button>
                                <button className="cta-sec-btn" onClick={(e)=>{
                                    showModal(false,'',idx)
                                }}>No</button>
                                {
                                    cancelError?
                                    <p>{cancelError}</p>:null
                                }

                            </div> 
                            
                            <div className={'cancelled-modal hidden'}>
                                <p>Your subscription has been cancelled</p>
                                <button className="cta-sec-btn"onClick={(e)=>{
                                    showCancelledModal(false,idx)
                                    router.reload()
                                }}>ok</button>
                            </div>             
                        </div>
                        :
                        null

                        }

                    </div>
                )
            }):
            <p>This subscription does not exist</p>
        }

        </div>
    )
}
export async function getServerSideProps(ctx:any){

    return authenticate(ctx,({sesh}:any)=>{
        return {
            props: sesh
        }
    })
}
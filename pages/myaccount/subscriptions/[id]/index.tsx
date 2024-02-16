import { getCsrfToken, getSession } from "next-auth/react";
import {Session} from 'next-auth';
import {useRouter} from "next/router";
import { useEffect,useState,FormEvent } from "react";
import authenticate from '../../../../utils/authenticationRequired';
import Link from 'next/link';
import FormComponent from "../../../../components/form-component";
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
    useEffect(()=>{
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
        const initiate=async()=>{
            try{
                const sesh = await getSession()
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
    },[subscription,router,setComponentLoading])
    

            
        
    const validate_form = () => {
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
    async function amendSubscription(e:FormEvent) {
        try{
            e.preventDefault()
            const valid = validate_form()
            if(valid){
                const csrftoken=await getCsrfToken()
                if(!csrftoken){
                    throw new Error("No csrfin here")
                }
                const res = await fetch(`/api/subscriptions`,{
                    method:"PUT",
                    headers:{
                        csrftoken:csrftoken
                    },
                    body:JSON.stringify(
                        {
                            amend:true,
                            subscriptionId:subscription[0].subscriptionId,
                           
                        dAddress: {
                            firstName: dFirstName,
                            surname: dSurname,
                            firstLine: dFirstLine,
                            secondLine: dSecondLine,
                            city: dCity,
                            postcode: dPostcode,
                            phoneNumber:dPhoneNumber
                        },
                        bAddress: {
                            firstName: bFirstName,
                            surname: bSurname,
                            firstLine: bFirstLine,
                            secondLine: bSecondLine,
                            city: bCity,
                            postcode: bPostcode,
                            phoneNumber:bPhoneNumber
                        }, 
                        }
                    )
                })
                const resJson=await res.json()
                if(resJson.success){
                    setAmendSuccess(true)
    
                }
                else{
                    throw new Error('request unsucessful')
                }
    
            }
            else{
                throw new Error('Form not valid');
            }
        }
        catch(e:any){
            console.log(e)
            setErr(e)
        }
        
        
    }
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
    return(
        <div className="static-container">
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
                                        <p><span>{el_product.name}</span><span> - £{el_product.price}</span></p>
                                    </li>
        
                                )
                            })}
                        </ul>
                        <p>Subtotal: {el.subtotal}</p>
                        <p>Shipping cost: {el.shippingCost}</p>
                        <p>Total: {el.total}</p>
                        {
                        
                            el.status === "SUBSCRIPTION_ACTIVE"?
                            <form>
                        <h2>Delivery Address</h2>
                            <FormComponent labelName={"First Name"} variable={dFirstName} variableName={Object.keys({ dFirstName })[0]} setVariable={setDFirstName} variableVal={dFirstNameVal} setVariableVal={setDFirstNameVal} inputType={"text"} required={true} />
                            <FormComponent labelName={"Surname"} variable={dSurname} variableName={Object.keys({ dSurname })[0]} setVariable={setDSurname} variableVal={dSurnameVal} setVariableVal={setDSurnameVal} inputType={"text"} required={true} />
                            <FormComponent labelName={"Street name and number"} variable={dFirstLine} variableName={Object.keys({ dFirstLine })[0]} setVariable={setDFirstLine} variableVal={dFirstLineVal} setVariableVal={setDFirstLineVal} inputType={"text"} required={true} />

                            <FormComponent labelName={"2nd Line of address"} variable={dSecondLine} variableName={Object.keys({ dSecondLine })[0]} setVariable={setDSecondLine} inputType={"text"} required={false} />
                            <FormComponent labelName={"City"} variable={dCity} setVariable={setDCity} variableName={Object.keys({ dCity })[0]} variableVal={dCityVal} setVariableVal={setDCityVal} inputType={"text"} required={true} />
                            <FormComponent labelName={"Postcode"} variable={dPostcode} variableName={Object.keys({ dPostcode })[0]} setVariable={setDPostcode} variableVal={dPostcodeVal} setVariableVal={setDPostcodeVal} inputType={"text"} required={true} />
                            <FormComponent labelName={"Phone Number"} variable={dPhoneNumber} variableName={Object.keys({ dPhoneNumber })[0]} setVariable={setDPhoneNumber} variableVal={dPhoneNumberVal} setVariableVal={setDPhoneNumberVal} inputType={"text"} required={true} />

                            <h2>Billing Address</h2>
                            <FormComponent labelName={"First Name"} variable={bFirstName} variableName={Object.keys({ bFirstName })[0]} setVariable={setBFirstName} variableVal={bFirstNameVal} setVariableVal={setBFirstNameVal} inputType={"text"} required={true} />
                            <FormComponent labelName={"Surname"} variable={bSurname} variableName={Object.keys({ bSurname })[0]} setVariable={setBSurname} variableVal={bSurnameVal} setVariableVal={setBSurnameVal} inputType={"text"} required={true} />
                            <FormComponent labelName={"Street name and number"} variable={bFirstLine} variableName={Object.keys({ bFirstLine })[0]} setVariable={setBFirstLine} variableVal={bFirstLineVal} setVariableVal={setBFirstLineVal} inputType={"text"} required={true} />

                            <FormComponent labelName={"2nd Line of address"} variable={bSecondLine} variableName={Object.keys({ bSecondLine })[0]} setVariable={setBSecondLine} inputType={"text"} required={false} />
                            <FormComponent labelName={"City"} variable={bCity} variableName={Object.keys({ bCity })[0]} setVariable={setBCity} variableVal={bCityVal} setVariableVal={setBCityVal} inputType={"text"} required={true} />
                            <FormComponent labelName={"Postcode"} variable={bPostcode} variableName={Object.keys({ bPostcode })[0]} setVariable={setBPostcode} variableVal={bPostcodeVal} setVariableVal={setBPostcodeVal} inputType={"text"} required={true} />
                            <FormComponent labelName={"Phone Number"} variable={bPhoneNumber} variableName={Object.keys({ bPhoneNumber })[0]} setVariable={setBPhoneNumber} variableVal={bPhoneNumberVal} setVariableVal={setBPhoneNumberVal} inputType={"text"} required={true} />

                            <button type="submit" className="cta" onClick={(e)=>{amendSubscription(e)}}>Amend Subscription</button>
                            {
                                amendSuccess?
                                <p>Successfully amended</p>:
                                null
                            }
                        </form>:
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
                        
            }
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
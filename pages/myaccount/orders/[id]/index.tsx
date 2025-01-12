import { getCsrfToken, getSession } from "next-auth/react";
import {Session} from 'next-auth';
import {useRouter} from "next/router";
import { useEffect,useState,FormEvent } from "react";
import authenticate from '../../../../utils/authenticationRequired';
import Link from 'next/link';
import FormComponent from "../../../../components/form-component";
import Head from 'next/head'
import {Metadata } from '../../../../utils/metadata/metadata'
import postcodes from '../../../../utils/zedPostcodes/postcodes'
export default function MyAccountOrders({setComponentLoading}:any){
    const [cancelOrderId,setCancelOrderId]=useState('');
    const [cancelError, setCancelError]=useState<string|null>(null)
    const [error,setError]=useState<string|null>(null)
    const router = useRouter()
    const [orderNumber,setOrderNumber]=useState('');
    const [order,setOrder]=useState<any>([]);
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
    async function getOrders(sesh:Session){
        try{
            setComponentLoading(true)
            const order_id=window.location.href.split('/orders/')[1]
            const orderData = await fetch(`/api/order/?order_id=${order_id}`,{
                method:"GET"
            })
            const orderDetails = await orderData.json()
            const orderArr = orderDetails.orders

            setOrder(orderArr)
            setComponentLoading(false)
            if(order){

                setEmailAddress(orderArr[0].emailAddress)
                setStatus(orderArr[0].status)
                if (orderArr[0].dAddress.firstName && orderArr[0].dAddress.firstName.length > 0) {
                    setDFirstName(orderArr[0].dAddress.firstName);
                    setDFirstNameVal(true)
                }
                if (orderArr[0].dAddress?.surname && orderArr[0].dAddress?.surname.length > 0) {
                    setDSurname(orderArr[0].dAddress.surname);
                    setDSurnameVal(true)
                }
                if (orderArr[0].dAddress.firstLine && orderArr[0].dAddress.firstLine.length > 0) {
                    setDFirstLine(orderArr[0].dAddress.firstLine);
                    setDFirstLineVal(true)
                }
                if (orderArr[0].dAddress.secondLine) {
                    setDSecondLine(orderArr[0].dAddress.secondLine);
                }
                if (orderArr[0].dAddress.city && orderArr[0].dAddress.city.length > 0) {
                    setDCity(orderArr[0].dAddress.city);
                    setDCityVal(true)
                }
                if (orderArr[0].dAddress.postcode && orderArr[0].dAddress.postcode.length > 0) {
                    setDPostcode(orderArr[0].dAddress.postcode);
                    setDPostcodeVal(true)

                }
                if (orderArr[0].dAddress.phoneNumber && orderArr[0].dAddress.phoneNumber.length > 0) {
                    setDPhoneNumber(orderArr[0].dAddress.phoneNumber);
                    setDPhoneNumberVal(true)
                }
                if (orderArr[0].bAddress.firstName && orderArr[0].bAddress.firstName.length > 0) {
                    setBFirstName(orderArr[0].bAddress.firstName);
                    setBFirstNameVal(true)
                }
                if (orderArr[0].bAddress.surname && orderArr[0].bAddress.surname.length > 0) {
                    setBSurname(orderArr[0].bAddress.surname);
                    setBSurnameVal(true)
                }
                if (orderArr[0].bAddress.firstLine && orderArr[0].bAddress.firstLine.length > 0) {
                    setBFirstLine(orderArr[0].bAddress.firstLine);
                    setBFirstLineVal(true)
                }
                if (orderArr[0].bAddress.secondLine) {
                    setBSecondLine(orderArr[0].bAddress.secondLine);

                }
                if (orderArr[0].bAddress.city && orderArr[0].bAddress.city.length > 0) {
                    setBCity(orderArr[0].bAddress.city);
                    setBCityVal(true)

                }
                if (orderArr[0].bAddress.postcode && orderArr[0].bAddress.postcode.length > 0) {
                    setBPostcode(orderArr[0].bAddress.postcode);
                    setBPostcodeVal(true)
                }
                if (orderArr[0].bAddress.phoneNumber && orderArr[0].bAddress.phoneNumber.length > 0) {
                    setBPhoneNumber(orderArr[0].bAddress.phoneNumber);
                    setBPhoneNumberVal(true)
                }

                if(orderArr[0].deliveryHub&& orderArr[0].deliveryHub.length>0){
                    setDeliveryHub(orderArr[0].deliveryHub)
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
                await getOrders(sesh)

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
            if (dFirstNameVal && dSurnameVal && dFirstLineVal && dCityVal && dPostcodeVal && dPhoneNumberVal && bFirstNameVal && bSurnameVal && bFirstLineVal && bCityVal && bPostcodeVal && bPhoneNumberVal) {
                
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
                setBPhoneNumberVal(false)
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
    // async function amendOrder(e:FormEvent) {
    //     e.preventDefault()
    //     const valid = await validate_form()
    //     if(valid){
    //         const csrftoken=await getCsrfToken()
    //         if(!csrftoken){
    //             throw new Error("No csrfin here")
    //         }
    //         const res = await fetch(`/api/order`,{
    //             method:"PUT",
    //             headers:{
    //                 csrftoken:csrftoken
    //             },
    //             body:JSON.stringify(
    //                 {
    //                     paymentIntentId:order[0].paymentIntentId,
                       
    //                 dAddress: {
    //                     firstName: dFirstName,
    //                     surname: dSurname,
    //                     firstLine: dFirstLine,
    //                     secondLine: dSecondLine,
    //                     city: dCity,
    //                     postcode: dPostcode,
    //                     phoneNumber:dPhoneNumber

    //                 },
    //                 bAddress: {
    //                     firstName: bFirstName,
    //                     surname: bSurname,
    //                     firstLine: bFirstLine,
    //                     secondLine: bSecondLine,
    //                     city: bCity,
    //                     postcode: bPostcode,
    //                     phoneNumber:bPhoneNumber
    //                 },
    //                 deliveryHub:deliveryHub
    //                 }
    //             )
    //         })
    //         setAmendSuccess(true)
    //     }
    //     else{
    //         setErr('Form not valid');
    //     }
        
    // }
    async function cancelOrder(e:FormEvent,idx:number){
        try{
            setComponentLoading(true)
            e.preventDefault()
            const csrftoken=await getCsrfToken()
            if(!csrftoken){
                throw new Error("No csrfin here")
            }
            const res = await fetch('/api/order',{
                method:"DELETE",
                headers: {
                    csrftoken: csrftoken
                },
                body: JSON.stringify(order[0])
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
            let modal = document.querySelectorAll(`.ORDER_RECEIVED${idx} .cancel-modal`)[0]
            if(open){
                modal?.classList.remove("hidden")
                
            }
            else {
                modal?.classList.add("hidden")
            }
            setCancelOrderId(id)

        }
        catch(e:any){

            setError(e)
        }
    }
    function showCancelledModal(open:boolean,idx:number){
        try{
            let modal = document.querySelectorAll(`.ORDER_RECEIVED${idx} .cancelled-modal`)[0]
            let cancelbtn= document.querySelectorAll(`.ORDER_RECEIVED${idx} .cta`)[0]
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
            order.length?
            order.map((el:any,idx:number)=>{
                return(
                    <div key={idx}>
                        
                        <h1 className="main-heading center">Order ID: {el._id}</h1>
                        <p>Order status: {el.status}</p>
                        <p>Date of purchase: {el.dateOfPurchase}</p>
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
                        
                        {el.discountTotal?
                        <p>Discount total: {el.discountTotal}</p>
                        :
                        null
                    }
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
                            el.status === "ORDER_RECEIVED"?
                        <div className={el.status+idx}>
                            <button className="cta left" onClick={(e)=>{
                                showModal(true,el._id,idx)
                            }}>Cancel</button>
                            <div className={`cancel-modal hidden`}>
                                <p>Are you sure you&apos;d like to cancel this order?</p>
                                <button className="cta-sec-btn" onClick={(e)=>{
                                    cancelOrder(e,idx)
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
                                <p>Your order has been cancelled</p>
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
            <p>You do not currently have any orders. Would you like to <button style={{"display":"inline-block"}}className="cta"><Link href="/products">SHOP</Link></button></p>
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
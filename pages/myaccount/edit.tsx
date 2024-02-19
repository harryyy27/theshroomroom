import {useState, useEffect, FormEvent} from 'react';
import {getCsrfToken, getSession,signIn} from 'next-auth/react';
import authenticate from '../../utils/authenticationRequired';
import FormComponent from '../../components/form-component';
import styles from '../../styles/Components/Form.module.css'
import Head from 'next/head'
import {Metadata} from '../../utils/metadata/metadata'

export default function Edit({setComponentLoading}:any){
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
    const [dPhoneNumber,setDPhoneNumber]=useState('');
    const [dPhoneNumberVal, setDPhoneNumberVal] = useState<boolean | null>(null);
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
    const [bPhoneNumber,setBPhoneNumber]=useState('');
    const [bPhoneNumberVal, setBPhoneNumberVal] = useState<boolean | null>(null);
    const [updates,setUpdates]=useState(false);
    const [user,setUser]=useState({
        bAddress: {
            city:"",
            firstLine:"",
            firstName:"",
            postcode:"",
            phoneNumber:"",
            secondLine:"",
            surname:""
        },
        cart:{
            items:[]
        },
        dAddress:{
            surname:"",
            city:"",
            firstLine:"",
            firstName:"",
            postcode:"",
            phoneNumber:"",
            secondLine:"",
        },
        name:"",
        password:"",
        updates:false,
        username:""
    });
    const [errorMessage,setErrorMessage]=useState('');
    const [message,setMessage]=useState('');
    useEffect(()=>{
        const securePage=async()=>{
            setComponentLoading(true)||''
            const session = await getSession()
            if(!session){
                setComponentLoading(false)
                signIn()
            }
            else {
                fetch(`/api/getUser/${session.user.email}`)
                .then((res)=>{
                    return res.json()
                })
                .then((res)=>{
                        setUser(res.user)
                        if(res.user.dAddress.firstName){
                            setDFirstName(res.user.dAddress.firstName);
                            setDFirstNameVal(true)
                        }
                        if(res.user.dAddress.surname){
                            setDSurname(res.user.dAddress.surname);
                            setDSurnameVal(true)
                        }
                        if(res.user.dAddress.firstLine){
                            setDFirstLine(res.user.dAddress.firstLine);
                            setDFirstLineVal(true)
                        }
                        if(res.user.dAddress.city){
                            setDCity(res.user.dAddress.city);
                            setDCityVal(true)
                        }
                        if(res.user.dAddress.postcode){
                            setDPostcode(res.user.dAddress.postcode);
                            setDPostcodeVal(true)
                            
                        }
                        if(res.user.dAddress.phoneNumber){
                            setDPhoneNumber(res.user.dAddress.phoneNumber);
                            setDPhoneNumberVal(true)
                            
                        }
                        if(res.user.bAddress.firstName){
                            setBFirstName(res.user.bAddress.firstName);
                            setBFirstNameVal(true)
                            
                        }
                        if(res.user.bAddress.surname){
                            setBSurname(res.user.bAddress.surname);
                            setBSurnameVal(true)
                            
                        }
                        if(res.user.bAddress.firstLine){
                            
                            setBFirstLine(res.user.bAddress.firstLine);
                            setBFirstLineVal(true)
                        }
                        if(res.user.bAddress.city){
                            
                            setBCity(res.user.bAddress.city);
                            setBCityVal(true)
                        }
                        if(res.user.bAddress.postcode){
                            setBPostcode(res.user.bAddress.postcode);
                            setBPostcodeVal(true)
                        }
                        if(res.user.bAddress.phoneNumber){
                            setBPhoneNumber(res.user.bAddress.phoneNumber);
                            setBPhoneNumberVal(true)
                            
                        }
                        setDSecondLine(res.user.dAddress.secondLine);
                        setBSecondLine(res.user.bAddress.secondLine);
                        setUpdates(res.user.updates)
                })
                .catch((e)=>{
                    console.log(e)
                })
                setComponentLoading(false)
            }
        }
        securePage()
            

        

    },[setComponentLoading])
    const validate_form=()=>{
        if(dFirstNameVal&&dSurnameVal&&dFirstLineVal&&dCityVal&&dPostcodeVal&&dPhoneNumberVal&&bFirstNameVal&&bSurnameVal&&bFirstLineVal&&bCityVal&&bPostcodeVal&&bPhoneNumberVal){
            return true
        }
        else {
            setErrorMessage('Please fill in all required fields')
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
    async function editUser(e:FormEvent){
        try{
            setComponentLoading(true)
            const valid = validate_form()
            if(!valid){
                throw new Error('Please enter form details correctly')
            }
            e.preventDefault()
            const body = {
                ...user,
                dAddress:
                {
                    firstName:dFirstName,
                    surname: dSurname,
                    firstLine: dFirstLine,
                    secondLine:dSecondLine,
                    city:dCity,
                    postcode:dPostcode,
                    phoneNumber:dPhoneNumber
                },
                bAddress:
                {
                    firstName:bFirstName,
                    surname: bSurname,
                    firstLine: bFirstLine,
                    secondLine:bSecondLine,
                    city:bCity,
                    postcode:bPostcode,
                    phoneNumber:bPhoneNumber
                },
                updates:updates
            }
            // const requestHeaders: HeadersInit = new Headers();
            const csrftoken =await getCsrfToken()
            if(!csrftoken){
                throw new Error('Csrf token failure, no csrfin')
            }
            const res = await fetch(`/api/editUser`,{
                method:"POST",
                headers: {
                    csrftoken: csrftoken
                },
                body: JSON.stringify(body)
            })
            setMessage('Successfully updated profile')
            setTimeout(()=>{
                setMessage('')
            },1500)
            setComponentLoading(false)

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
            setErrorMessage(e.message)
            setComponentLoading(false)
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
            <h2>Edit details</h2>
            <form className={styles["form"]}action="">
                <h2>Delivery Address</h2>
                <FormComponent user={user} labelName={"First Name"} variableName={Object.keys({dFirstName})[0]}variable={dFirstName} setVariable={setDFirstName} variableVal={dFirstNameVal} setVariableVal={setDFirstNameVal} inputType={"text"} required={true}page={"Edit"}/>
                <FormComponent user={user} labelName={"Surname"}variable={dSurname} variableName={Object.keys({dSurname})[0]} setVariable={setDSurname} variableVal={dSurnameVal} setVariableVal={setDSurnameVal} inputType={"text"} required={true}page={"Edit"}/>
                <FormComponent user={user} labelName={"Street name and number"}variable={dFirstLine} variableName={Object.keys({dFirstLine})[0]} setVariable={setDFirstLine} variableVal={dFirstLineVal} setVariableVal={setDFirstLineVal} inputType={"text"} required={true}page={"Edit"}/>
                
                <FormComponent user={user} labelName={"2nd Line of address"}variable={dSecondLine} variableName={Object.keys({dSecondLine})[0]} setVariable={setDSecondLine} inputType={"text"} required={false}page={"Edit"}/>
                <FormComponent user={user} labelName={"City"}variable={dCity} variableName={Object.keys({dCity})[0]}setVariable={setDCity} variableVal={dCityVal} setVariableVal={setDCityVal}inputType={"text"} required={true}page={"Edit"}/>
                <FormComponent user={user} labelName={"Postcode"}variable={dPostcode} variableName={Object.keys({dPostcode})[0]}setVariable={setDPostcode} variableVal={dPostcodeVal} setVariableVal={setDPostcodeVal} inputType={"text"} required={true}page={"Edit"}/>
                <FormComponent user={user} labelName={"Phone Number"}variable={dPhoneNumber} variableName={Object.keys({dPhoneNumber})[0]}setVariable={setDPhoneNumber} variableVal={dPhoneNumberVal} setVariableVal={setDPhoneNumberVal} inputType={"text"} required={true}page={"Edit"}/>

                <h2>Billing Address</h2>
                <FormComponent user={user} labelName={"First Name"}variable={bFirstName} variableName={Object.keys({bFirstName})[0]}setVariable={setBFirstName} variableVal={bFirstNameVal} setVariableVal={setBFirstNameVal} inputType={"text"} required={true}page={"Edit"}/>
                <FormComponent user={user} labelName={"Surname"}variable={bSurname} variableName={Object.keys({bSurname})[0]}setVariable={setBSurname} variableVal={bSurnameVal} setVariableVal={setBSurnameVal} inputType={"text"} required={true}page={"Edit"}/>
                <FormComponent user={user} labelName={"Street name and number"}variable={bFirstLine} variableName={Object.keys({bFirstLine})[0]}setVariable={setBFirstLine} variableVal={bFirstLineVal} setVariableVal={setBFirstLineVal} inputType={"text"} required={true}page={"Edit"}/>
                
                <FormComponent user={user} labelName={"2nd Line of address"}variable={bSecondLine}variableName={Object.keys({bSecondLine})[0]} setVariable={setBSecondLine} inputType={"text"} required={false}page={"Edit"}/>
                <FormComponent user={user} labelName={"City"}variable={bCity} variableName={Object.keys({bCity})[0]}setVariable={setBCity} variableVal={bCityVal} setVariableVal={setBCityVal}inputType={"text"} required={true}page={"Edit"}/>
                <FormComponent user={user} labelName={"Postcode"}variable={bPostcode} variableName={Object.keys({bPostcode})[0]} setVariable={setBPostcode} variableVal={bPostcodeVal} setVariableVal={setBPostcodeVal} inputType={"text"} required={true}page={"Edit"}/>
                <FormComponent user={user} labelName={"Phone Number"}variable={bPhoneNumber} variableName={Object.keys({bPhoneNumber})[0]}setVariable={setBPhoneNumber} variableVal={bPhoneNumberVal} setVariableVal={setBPhoneNumberVal} inputType={"text"} required={true}page={"Edit"}/>

                <button type="submit" className="cta"onClick={(e)=>editUser(e)}>UPDATE</button>
            </form>
            {
                message?

            <p>{message}</p>:
            null
            }
            {
                errorMessage?

            <p>{errorMessage}</p>:
            null}
        
            
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
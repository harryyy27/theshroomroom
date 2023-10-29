import {useState, useEffect, FormEvent} from 'react';
import {getCsrfToken, getSession,signIn} from 'next-auth/react';
import LoadingIndicator from '../../components/loadingIndicator';
import authenticate from '../../utils/authenticationRequired';
import FormComponent from '../../components/form-component';
import styles from '../../styles/Components/Form.module.css'

export default function Edit(){
    const [loading, setLoading]=useState(true);
    const [dFirstName,setDFirstName]=useState('');
    const [dFirstNameVal,setDFirstNameVal]=useState<boolean|null>(null);
    const [dSurname,setDSurname]=useState('');
    const [dSurnameVal,setDSurnameVal]=useState<boolean|null>(null);
    const [dFirstLine,setDFirstLine]=useState('');
    const [dFirstLineVal,setDFirstLineVal]=useState<boolean|null>(null);
    const [dSecondLine,setDSecondLine]=useState('');
    const [dCity,setDCity]=useState('');
    const [dCityVal,setDCityVal]=useState<boolean|null>(null);
    const [dPostcode,setBPostcode]=useState('');
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
    const [bPostcode,setDPostcode]=useState('');
    const [bPostcodeVal,setBPostcodeVal]=useState<boolean|null>(null);
    const [updates,setUpdates]=useState(false);
    const [user,setUser]=useState({
        bAddress: {
            city:"",
            firstLine:"",
            firstName:"",
            postcode:"",
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
            const session = await getSession()
            if(!session){
                signIn()
            }
            else {
                fetch(`http://localhost:3000/api/getUser/${session.user.email}`)
                .then((res)=>{
                    return res.json()
                })
                .then((res)=>{
                        setUser(res.user)
                        setDFirstName(res.user.dAddress.surname);
                        setDSurname(res.user.dAddress.surname);
                        setDFirstLine(res.user.dAddress.firstLine);
                        setDSecondLine(res.user.dAddress.secondLine);
                        setDCity(res.user.dAddress.city);
                        setDPostcode(res.user.dAddress.postcode);
                        setBFirstName(res.user.bAddress.surname);
                        setBSurname(res.user.bAddress.surname);
                        setBFirstLine(res.user.bAddress.firstLine);
                        setBSecondLine(res.user.bAddress.secondLine);
                        setBCity(res.user.bAddress.city);
                        setBPostcode(res.user.bAddress.postcode);
                        setUpdates(res.user.updates)
                })
                setLoading(false)
            }
        }
        securePage()
            

        

    },[])
    const validate_form=()=>{
        if(dFirstNameVal&&dSurnameVal&&dFirstLineVal&&dCityVal&&dPostcodeVal&&bFirstNameVal&&bSurnameVal&&bFirstLineVal&&bCityVal&&bPostcodeVal){
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
            setLoading(true)
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
                    postcode:dPostcode
                },
                bAddress:
                {
                    firstName:bFirstName,
                    surname: bSurname,
                    firstLine: bFirstLine,
                    secondLine:bSecondLine,
                    city:bCity,
                    postcode:bPostcode
                },
                updates:updates
            }
            // const requestHeaders: HeadersInit = new Headers();
            const csrftoken =await getCsrfToken()
            if(!csrftoken){
                throw new Error('Csrf token failure, no csrfin')
            }
            const res = await fetch('http://localhost:3000/api/editUser',{
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
        }
    }

    return(
        <div className="static-container">
        {
            loading?
            <LoadingIndicator />
            :
            <>
            <h2>Edit details</h2>
            <form className={styles["form"]}action="">
                <h2>Delivery Address</h2>
                <FormComponent user={user} labelName={"First Name"} variableName={Object.keys({dFirstName})[0]}variable={dFirstName} setVariable={setDFirstName} variableVal={dFirstNameVal} setVariableVal={setDFirstNameVal} inputType={"text"} required={true}/>
                <FormComponent user={user} labelName={"Surname"}variable={dSurname} variableName={Object.keys({dSurname})[0]} setVariable={setDSurname} variableVal={dSurnameVal} setVariableVal={setDSurnameVal} inputType={"text"} required={true}/>
                <FormComponent user={user} labelName={"Street name and number"}variable={dFirstLine} variableName={Object.keys({dFirstLine})[0]} setVariable={setDFirstLine} variableVal={dFirstLineVal} setVariableVal={setDFirstLineVal} inputType={"text"} required={true}/>
                
                <FormComponent user={user} labelName={"2nd Line of address"}variable={dSecondLine} variableName={Object.keys({dSecondLine})[0]} setVariable={setDSecondLine} inputType={"text"} required={false}/>
                <FormComponent user={user} labelName={"City"}variable={dCity} variableName={Object.keys({dCity})[0]}setVariable={setDCity} variableVal={dCityVal} setVariableVal={setDCityVal}inputType={"text"} required={true}/>
                <FormComponent user={user} labelName={"Postcode"}variable={dPostcode} variableName={Object.keys({dPostcode})[0]}setVariable={setDPostcode} variableVal={dPostcodeVal} setVariableVal={setDPostcodeVal} inputType={"text"} required={true}/>
                <h2>Billing Address</h2>
                <FormComponent user={user} labelName={"First Name"}variable={bFirstName} variableName={Object.keys({bFirstName})[0]}setVariable={setBFirstName} variableVal={bFirstNameVal} setVariableVal={setBFirstNameVal} inputType={"text"} required={true}/>
                <FormComponent user={user} labelName={"Surname"}variable={bSurname} variableName={Object.keys({bSurname})[0]}setVariable={setBSurname} variableVal={bSurnameVal} setVariableVal={setBSurnameVal} inputType={"text"} required={true}/>
                <FormComponent user={user} labelName={"Street name and number"}variable={bFirstLine} variableName={Object.keys({bFirstLine})[0]}setVariable={setBFirstLine} variableVal={bFirstLineVal} setVariableVal={setBFirstLineVal} inputType={"text"} required={true}/>
                
                <FormComponent user={user} labelName={"2nd Line of address"}variable={bSecondLine}variableName={Object.keys({bSecondLine})[0]} setVariable={setBSecondLine} inputType={"text"} required={false}/>
                <FormComponent user={user} labelName={"City"}variable={bCity} variableName={Object.keys({bCity})[0]}setVariable={setBCity} variableVal={bCityVal} setVariableVal={setBCityVal}inputType={"text"} required={true}/>
                <FormComponent user={user} labelName={"Postcode"}variable={bPostcode} variableName={Object.keys({bPostcode})[0]} setVariable={setBPostcode} variableVal={bPostcodeVal} setVariableVal={setBPostcodeVal} inputType={"text"} required={true}/>
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
            null
            }
            </>
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
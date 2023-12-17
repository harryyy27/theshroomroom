import Head from 'next/head';
import {FormEvent} from 'react'
import {Metadata} from '../utils/metadata/metadata';
import {useState,useEffect} from 'react';
import Link from 'next/link'
import FormComponent from '../components/form-component';
import {getCsrfToken} from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
export default function Unsubscribe(){
    const [email,setEmail]=useState('')
    const [emailVal, setEmailVal]=useState(false)
    const [err,setErr]=useState('');
    const [msg,setMsg]=useState('');
    const [emailParamPresent,setEmailParamPresent]=useState(false);
    const [unsubscribed,setUnsubscribed]=useState(false);
    const searchParam = useSearchParams().get('email')

    useEffect(()=>{
        if(searchParam!==null){
            setEmailParamPresent(true)
            setEmail(searchParam)
            setEmailVal(true)
        }
        
    },[searchParam])
    async function handleUnsubscribe(event:FormEvent,email:string){
        event.preventDefault()
        try{
            if(emailVal){
                const success=await fetch('/api/editUser',{
                    method: "DELETE",
                    headers: {
                        csrftoken: await getCsrfToken() as string
                    },
                    
                    body: JSON.stringify({
                        email:email,
                        subscribe:false,
                        subscription:true
        
                    })
                })
                if(success){
                    setMsg('We are sorry to see you go')
                    setUnsubscribed(true)
                }
            }
            else {
                setErr('Please enter a valid email address')
            }
        }
        catch(e){
            setErr('Something has gone wrong. We are trying to resolve this as soon as possible. Sorry for any inconvenience this may have caused.')
        }
    }
    
    return(
        <div className="static-container">
            <Head>
                <title>{Metadata["unsubscribe"]["title"]}</title>
                <meta name="description" content={Metadata["unsubscribe"]["description"]}/>
                <meta property="og:title" content={Metadata["unsubscribe"]["title"]}/>
                <meta property="og:description" content={Metadata["unsubscribe"]["description"]}/>
            </Head>
            <h1 className="main-heading center">Unsubscribe</h1>
            {
                !unsubscribed?
                <>
            
            {
                emailParamPresent?
                null:                            
                <FormComponent labelName={"Email Address"}variable={email}variableName={Object.keys({email})[0]}  setVariable={setEmail} variableVal={emailVal} setVariableVal={setEmailVal} inputType={"email"}required={true}/>

            }
            <button className={"cta"}onClick={async(e)=>{
                    await handleUnsubscribe(e,email);
                }}>Unsubscribe</button>
                </>
                :
                <>
            
            {
                    err!==''?
                    <p>{err}</p>
                    :
                    null
                }
                {
                    msg!==''?
                    <h2 className="static-para center">{msg}</h2>
                    :
                    null
                }
                </>
            }
            <p className="link center"><Link href="/products">Shop for mushrooms</Link></p>
        </div>


    )
    
}
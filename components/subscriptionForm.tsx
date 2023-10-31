import React,{useState,useEffect} from 'react';
import {getCsrfToken,getSession} from 'next-auth/react'
import FormComponent from './form-component';
import styles from '../styles/Components/Form.module.css'
export default function Subscribe(){
    const [email,setEmail]=useState('');
    const [err,setErr]=useState('');
    const [user,setUser]=useState(false);
    const [updates,setUpdates]=useState(false);
    const [emailVal,setEmailVal]=useState<boolean|null>(null);
    useEffect(()=>{
        async function initiate(){
            const session = await getSession()
        
            if(session&&session?.user?.email!==""){
                setEmail(session.user.email);
                setUser(true);
                setUpdates(session.user.updates);
            }

        }
        initiate()
    },[])
    function validate(){
        if(email!==''){
            return true
        }
        else {
            false
        }
    }
    async function handleSubscribe(subscribe:boolean){
        try{
            if(validate()){
                await fetch('/api/editUser',{
                    method: "POST",
                    headers: {
                        csrftoken: await getCsrfToken() as string
                    },
                    
                    body: JSON.stringify({
                        user:user,
                        email:email,
                        subscription:true,
                        subscribe:subscribe,
        
                    })
                })
            }
            else {
                setErr('')
            }
        }
        catch(e){
            setErr('Something has gone wrong. We are trying to resolve this as soon as possible. Sorry for any inconvenience this may have caused.')
        }
        
        
    }
    return(
        <form className={styles["form"]}>
            <div className={styles["form-element-wrapper"]}>
                <h2>JOIN US</h2>
                <p>For information on all of our latest products</p>
                {
                    user&&updates?
                    <p>You are already subscribed</p>
                    :
                    null
                }
                <FormComponent user={user} labelName={"Email"}variable={email} variableName={Object.keys({email})[0]} setVariable={setEmail} variableVal={emailVal} setVariableVal={setEmailVal} inputType={"text"} required={true}/>
                
                {
                    err!==''?
                    <p>{err}</p>
                    :
                    null
                }

            </div>
            {
                    user&&updates?
                <button type="submit"className="cta" onClick={()=>handleSubscribe(false)}>Unsubscribe</button>:
                <button type="submit"className="cta" onClick={()=>handleSubscribe(true)}>Keep me updated</button>
            }
            
        </form>
    )
}
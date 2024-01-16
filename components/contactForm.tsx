import React,{useEffect,useState} from 'react';
import styles from '../styles/Components/Form.module.css';
import {getSession,getCsrfToken} from 'next-auth/react'
import FormComponent from './form-component';
export default function Contact(){
    const [email,setEmail]=useState('');
    const [emailVal,setEmailVal]=useState<boolean|null>(null)
    const [name,setName]=useState('');
    const [nameVal,setNameVal]=useState<boolean|null>(null)
    const [content,setContent]=useState('');
    const [contentVal,setContentVal]=useState<boolean|null>(null)
    const [err,setErr]=useState('');
    const [msg,setMsg]=useState('')
    const [user,setUser]=useState({})
    useEffect(()=>{
        async function initiate(){
            const session = await getSession()
        
            if(session&&session?.user?.email!==""){
                setEmail(session.user.email);
                setName(session.user.name);
                setUser(session.user)
            }

        }
        initiate()
    },[])
    function validate(){
        if(email===''|| name==='' || content===''){
            return false
        }
        else{
            return true
        }
    }
    async function handleSubmit(e:any){
        try{
            if(validate()){
                e.preventDefault()
                const resJson= await fetch('/api/contact',{
                    method:"POST",
                    headers: {
                        csrftoken: await getCsrfToken() as string
                    },
                    body:JSON.stringify({
                        email:email,
                        name:name,
                        textContent:content
                    })
                })
                const res = await resJson.json()
                if(res["success"]===false){
                    throw new Error('We are sorry but your email failed to send, we are working to resolve this')
                }
                else{
                    setMsg('Thank you for your message. We will respond as soon as possible!')
                }
            }
            else {
                throw new Error('Please fill the form in correctly')
            }
        }
        catch(e:any){
            setErr(e.toString())
        }
        
    }
    return(
        <form className={styles["form"]}>
            <FormComponent page={"Contact"} user={user} labelName={"First Name"}variable={name} variableName={Object.keys({name})[0]} setVariable={setName} variableVal={nameVal} setVariableVal={setNameVal} inputType={"text"} required={true}/>
            <FormComponent page={"Contact"} user={user} labelName={"Email"}variable={email} variableName={Object.keys({email})[0]} setVariable={setEmail} variableVal={emailVal} setVariableVal={setEmailVal} inputType={"text"} required={true}/>
            
            
            
            <div className={styles["form-element-wrapper"]}>
                    <label className={styles["form-label"]} htmlFor={"emailContent"}>Message:</label>
                        <textarea className={styles["form-element"]} autoComplete="fuck-off" required id={"emailContent"} value={content||''} 
                        onBlur={(e)=>{
                                if(e.target.checkValidity()){
                                    setContentVal(true)
                                }
                                else {
                                    setContentVal(false)
                                }
                            
                            

                        }}
                        onChange={(e)=>{
                            setContent(e.target.value)
                                if(e.target.checkValidity()){
                                    setContentVal(true)
                                }
                                else {
                                    setContentVal(false)
                                }

                            }
                        }/>
                    
                {
                    contentVal===false?
                    <p className={"error-text"}>{`Please enter valid message`}</p>
                    :
                    null

                }
                </div>
            <button className="cta" onClick={(e)=>{
                setErr('')
                handleSubmit(e)
            }}>Submit</button>
            {
                err?
                <p>{err}</p>:
                null
            }
            {
                msg?
                <p>{msg}</p>:
                null
            }
        </form>
    )
}
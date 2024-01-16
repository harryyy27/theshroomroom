import {useState,FormEvent} from 'react'
import {getCsrfToken} from 'next-auth/react'
import styles from '../../styles/Components/Form.module.css'

import Head from 'next/head';

import {Metadata} from '../../utils/metadata/metadata';

export default function ForgottenPassword({setComponentLoading}:any){
    const [email,setEmail]=useState('');
    const [validateEmail,setValidateEmail]=useState('');
    const [formSubmitted,setFormSubmitted]=useState(false);
    const handleForgotten=async(e:FormEvent)=>{
        try{
            setComponentLoading(true)
            e.preventDefault();
            if(email!==''){
                setValidateEmail('');
              
                const res = await fetch('/api/reset-password',{
                    method: "POST",
                    headers: {
                        csrftoken: await getCsrfToken() as string
                    },
                    body: JSON.stringify({
                        username:email
                    })
                })
                const response = await res.json()

                if(response.error){
                    setValidateEmail(response.error)
                }
                else {
                    setFormSubmitted(true)
                }
    
            }
            else {
                setValidateEmail('Enter an email to continue')
            }
            setComponentLoading(false)

        }
        catch(e:any){
            await fetch('/api/clientSideError',{
              method:"POST",
              headers: {
                  "csrftoken": await getCsrfToken() as string,
                  "client-error": "true"
              },
              body:JSON.stringify({
                  error:e.message,
                  stack:e.stack
              })
          })
          setComponentLoading(false)
            
        }
    }
    return(
        <>
            {
                !formSubmitted?
<div className="static-container">
            <h1>Forgotten Password</h1>
            <Head>
                <title>{Metadata["forgottenpassword"]["title"]}</title>
                <meta name="description" content={Metadata["forgottenpassword"]["description"]}/>
                <meta property="og:title" content={Metadata["forgottenpassword"]["title"]}/>
                <meta property="og:description" content={Metadata["forgottenpassword"]["description"]}/>
            </Head>
            <p>To reset your password, enter your email address and send</p>
            <form className={styles["form"]}>
                    <div className={styles["form-element-wrapper"]}>
                        <label className={styles["form-label"]} htmlFor="email">Username/Email</label>
                        <input className={styles["form-element"]} required id="email" name="email" value={email}type="email" placeholder="Type email address here"onChange={(e)=>setEmail(e.target.value)}/>
                    </div>
                    
                <p>{validateEmail}</p>
                <button  className="cta" onClick={(e)=>handleForgotten(e)}>Submit</button>
            </form>
        </div>:
        <p>A password reset link has been sent to the email address provided.</p>

            }
        </>
    )
}
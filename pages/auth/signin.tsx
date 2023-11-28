import {useState,FormEvent} from 'react';
import {signIn,getCsrfToken} from 'next-auth/react';
import Link from 'next/link'
import Head from 'next/head';
import {Metadata} from '../../utils/metadata/metadata'
import styles from '../../styles/Components/Form.module.css'
import FormComponent from '../../components/form-component';
export default function SignIn(){
    const [username,setUsername] =useState('');
    const [usernameVal,setUsernameVal] =useState<boolean|null>(null);
    const [password,setPassword]= useState('');
    const [passwordVal,setPasswordVal]= useState<boolean|null>(null);
    const [message,setMessage] =useState<string|null>(null);
    const [user,setUser]=useState('');
    const signInUser=async(e:FormEvent) => {
        try {
            e.preventDefault();
            let options = {redirect:false,username,password}
    
            const res= await signIn("credentials",options);
            setMessage(null);
            if(res?.error) {
                setMessage(res.error)
            }
            else{
                return window.location.href="/"
    
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
            setMessage('We\'re sorry something has gone wrong. Please try again later')
            
        }
    }
    return(
        <div className="static-container">
            <Head>
                <title>{Metadata["signup"]["title"]}</title>
                <meta name="description" content={Metadata["signup"]["description"]}/>
                <meta property="og:title" content={Metadata["signup"]["title"]}/>
                <meta property="og:description" content={Metadata["signup"]["description"]}/>
            </Head>
        <h1 className="main-heading center">Sign In</h1>
                    <form className={styles["form"]} method="POST">
                        <FormComponent user={user} labelName={"Username"}variable={username} variableName={Object.keys({username})[0]} setVariable={setUsername} variableVal={usernameVal} setVariableVal={setUsernameVal} inputType={"text"} required={true}/>
        
                        <FormComponent user={user} labelName={"Password"}variable={password} variableName={Object.keys({password})[0]} setVariable={setPassword} variableVal={passwordVal} setVariableVal={setPasswordVal} inputType={"password"} required={true}/>
                        
                        
                        <button className="cta" onClick={async(e)=>await signInUser(e)}type="submit">Sign In</button>
                        <Link className="link" href="/forgotten-password"><span>forgotten password?</span></Link>
                        
                    </form>
                    <p style={{color:"red"}}>{message}</p>
        </div>
    )
}

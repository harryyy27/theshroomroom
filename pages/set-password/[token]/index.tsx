import { getCsrfToken } from 'next-auth/react';
import {useRouter} from 'next/router';
import {useState,FormEvent,useEffect} from 'react';
import styles from '../../../styles/Components/Form.module.css'

export default function ResetPassword({setComponentLoading}:any){
    const [email,setEmail] = useState<string>('');
    const [validateEmail,setValidateEmail]=useState<boolean|null>(null);
    const [password,setPassword]=useState<string>('');
    const [validatePassword,setValidatePassword]=useState<boolean|null>(null)
    const [confirmPassword,setConfirmPassword]=useState<string>('');
    const [validateConfirmPassword,setValidateConfirmPassword]=useState<boolean|null>(null)
    const [passwordChanged,setPasswordChanged]=useState('');
    const [formError,setFormError]=useState('');
    const formValidated=()=>{
        const formInputs = document.querySelectorAll('.formInput')
        formInputs.forEach(el=>(el as HTMLElement).blur())
        if(validatePassword&&validateEmail&&validateConfirmPassword){
            return true;
        }
        return false;
    }
    const router = useRouter();
    const changePasswordHandler=async(e:FormEvent)=>{
        try{
            setComponentLoading(true)
            setFormError('')
            e.preventDefault()
            if(formValidated()){
                const token = router.query.token
                const res = await fetch('/api/change-password-forgotten',{
                    method: "PUT",
                    headers:{
                        csrftoken:await getCsrfToken() as string
                    },
                    body: JSON.stringify({
                        username:email,
                        passwordResetToken:token,
                        password:password
                    })
    
                })
                const resJson = await res.json()
                if(resJson.error){    
                    throw new Error(resJson.error)
                }
                else {
                    setPasswordChanged('Password successfully changed')
                }
            }
            else {
                setFormError('Please enter form details correctly')
            }
            setComponentLoading(false)

        }
        catch(e:any){
            console.log(e);
            setFormError(e.message);
            setComponentLoading(false)
        }
    }
    return(
        <div className="static-container">
        <h1 className="main-heading">Set your password</h1>
        <form>
            <div className={styles["form-element-wrapper"]}>
            <label className={styles["form-label"]}htmlFor="email">Email address:</label>
            <input className={styles["form-element"]} required type="email" name="email" id="email" value={email} placeholder="type email here" onChange={(e)=>setEmail(e.target.value)} onBlur={(e)=>e.target.checkValidity()?setValidateEmail(true):setValidateEmail(false)} />
            {validateEmail===false?<p>Enter a valid email</p>:null}
            </div>
            
            <div className={styles["form-element-wrapper"]}>
                <label className={styles["form-label"]}htmlFor="password">Password:</label>
                <input className={styles["form-element"]} required type="password" name="password" id="password" value={password} placeholder="enter password here" onChange={(e)=>setPassword(e.target.value)} onBlur={(e)=>e.target.value!==''?setValidatePassword(true):setValidatePassword(false)} />
                {validatePassword===false?<p>Enter a valid password</p>:null}
            </div>

            <div className={styles["form-element-wrapper"]}>
                <label className={styles["form-label"]} htmlFor="confirmPassword">Confirm Password:</label>

                <input className={styles["form-element"]} required type="password" name="confirmPassword" id="confirmPassword" value={confirmPassword} placeholder="confirm password here" onChange={(e)=>setConfirmPassword(e.target.value)} onBlur={(e)=>e.target.value&&e.target.value===password?setValidateConfirmPassword(true):setValidateConfirmPassword(false)} />
                {validateConfirmPassword===false?<p>Ensure your passwords are matching</p>:null}
            </div>
            <button className="cta" onClick={(e)=>changePasswordHandler(e)}>Update Password</button>
            
            <p>{passwordChanged}{formError}</p>
        </form>
        </div>
    )
}

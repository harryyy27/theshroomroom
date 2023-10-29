import { getCsrfToken,getSession } from 'next-auth/react';
import {useState,FormEvent,useEffect} from 'react';
import authenticate from '../../utils/authenticationRequired';
import FormComponent from '../../components/form-component';
import styles from '../../styles/Components/Form.module.css'
export default function ChangePassword(){
    const [currentPassword,setCurrentPassword] = useState<string>('');
    const [currentPasswordVal,setCurrentPasswordVal]=useState<boolean|undefined>(undefined);
    const [newPassword,setNewPassword]=useState<string>('');
    const [newPasswordVal,setNewPasswordVal]=useState<boolean|undefined>(undefined)
    const [confirmPassword,setConfirmPassword]=useState<string>('');
    const [confirmPasswordVal,setConfirmPasswordVal]=useState<boolean|undefined>(undefined)
    const [passwordChanged,setPasswordChanged]=useState('');
    const [user,setUser] = useState('');
    const [formError,setFormError]=useState('');
    const formValidated=()=>{
        const formInputs = document.querySelectorAll('.form-element')
        formInputs.forEach(el=>(el as HTMLElement).blur())
        if(currentPasswordVal&&newPasswordVal&&confirmPasswordVal){
            return true;
        }
        return false;
    }
    
    const changePasswordHandler=async(e:FormEvent)=>{
        try{
            setFormError('')
            e.preventDefault()
            if(formValidated()){
                const session = await getSession()
                const res = await fetch('/api/change-password',{
                    method: "PUT",
                    headers:{
                        csrftoken:await getCsrfToken() as string
                    },
                    body: JSON.stringify({
                        username:session?.user.email,
                        newPassword:newPassword,
                        currentPassword:currentPassword
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

        }
        catch(e:any){
            console.log(e);
            setFormError(e.message);
        }
    }
    return(
        <div className="static-container">
        <h1 className="main-heading center">Reset your password</h1>
            <form className={styles["form"]}>
                <FormComponent user={user} labelName={"Current Password"}variable={currentPassword} variableName={Object.keys({currentPassword})[0]} setVariable={setCurrentPassword} variableVal={currentPasswordVal} setVariableVal={setCurrentPasswordVal} inputType={"text"} required={true}/>
                
                <FormComponent user={user} labelName={"New Password"}variable={newPassword} variableName={Object.keys({newPassword})[0]} setVariable={setNewPassword} variableVal={newPasswordVal} setVariableVal={setNewPasswordVal} inputType={"text"} required={true}/>

                <FormComponent user={user} labelName={"Confirm Password"}variable={confirmPassword} variableName={Object.keys({confirmPassword})[0]} setVariable={setConfirmPassword} variableVal={confirmPasswordVal} setVariableVal={setConfirmPasswordVal} inputType={"text"} required={true}/>

                

                <button className="cta"onClick={(e)=>changePasswordHandler(e)}>Change Password</button>
                
                <p id="message">{passwordChanged}{formError}</p>
            </form>
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
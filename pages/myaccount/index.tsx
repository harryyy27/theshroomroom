import {FormEvent,useState} from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { signOut,useSession } from 'next-auth/react';


export default function myAccount(){
    const {data:session,status} = useSession()
    const [sure,updateSure]=useState(false);
    const [deleted,updateDeleted]=useState("");
    const deleteAccount=async(e:FormEvent)=>{
        const res = await fetch('api/deleteaccount/',{
            method:"DELETE",
            body:JSON.stringify({
                email:session.user.email
            })
        })
        console.log(res)
        if(res.error){
            updateDeleted("Sorry we were unable to delete your account, please try again later.")
        }
        else {
            updateDeleted("Your account was successfully deleted.")
        }
        signOut({
            callbackUrl: `${window.location.origin}`
          })
    }
    return(
        <>
            <h1>My account</h1>
            <Link href="/myaccount/edit" >Edit Details</Link>
            <button onClick={(e)=>{
                updateSure(true)
            }}>Delete account</button>
            {
                sure?
                <div>
                    <p>Are you sure you wish to delete your account?</p>
                    <button onClick={(e)=>deleteAccount(e)}>Yes</button>
                    <button onClick={(e)=>updateSure(false)}>No</button>
                </div>:
                null
            }
            {
                deleted!==""?
                <>
                <p>{deleted}</p>
                </>:
                null
            }
        </>
    )
}
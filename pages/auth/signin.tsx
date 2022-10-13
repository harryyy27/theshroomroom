import {signIn,getCsrfToken} from "next-auth/react";
import {useState,FormEvent, useContext} from 'react';
import {CartContext} from '../../context/cart'
import {getSession} from 'next-auth/react';
import Router from 'next/router';
export default function SignIn(){
    const [username,setUsername] =useState('');
    const [password,setPassword]= useState('');
    const [message,setMessage] =useState(null);
    const signInUser=async(e:FormEvent) => {
        try {
            e.preventDefault();
    
            let options = {redirect:false,username,password}
    
            const res= await signIn("credentials",options);
            setMessage(null);
            if(res?.error) {
                console.log('YEEEEEEEEEEEEEEE')
                setMessage(res.error)
            }
            else{
                return window.location.href="/"
    
            }

        }
        catch(e){
            console.log(e)
        }
    }
    return(
        <>
                    <form method="post">
                        <label htmlFor="username">Username</label>
                        <input id="username" type="email" placeholder="Enter email here" value={username} onChange={e =>setUsername(e.target.value)}/>
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" placeholder="Enter password here" value={password} onChange={e=>setPassword(e.target.value)}/>
                        <button onClick={(e)=>signInUser(e)}type="submit">Sign In</button>

                    </form>
                    <p style={{color:"red"}}>{message}</p>
                    </>
    )
}
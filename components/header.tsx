import Link from 'next/link'
import {signIn, signOut,useSession,getSession} from "next-auth/react";
import {useContext, useEffect} from 'react';
import {CartContext} from '../context/cart'


export default function Header(){
    const {data:session,status} = useSession()
    const context = useContext(CartContext)
    return(
        <header>
            <nav>
                {
                    session?
                    <p>Hi {session.user.name}</p>
                    :
                    null
                }
                <Link href='/'><h1>HOME</h1></Link>
                
                <ul>
                    <li><Link href='/shop'>Shop</Link></li>
                    <li><Link href='/about'>About</Link></li>
                    <li><Link href='/delivery'>Delivery</Link></li>
                    <li><Link href='/returns'>Returns</Link></li>
                </ul>
                {
                    (!session&& status!=="loading")?
                    <a onClick={e=>signIn()} >Sign In</a>
                    :
                    <>
                    <Link href="/api/auth/signout"><a onClick={e=>{
                        e.preventDefault()
                        signOut()
                    }}>Sign Out</a></Link>
                    <Link href="/myaccount"><a>My Account</a></Link>
                    </>
                }
                <Link href="auth/signup"><a>Sign Up</a></Link>
                <Link href="/cart"><a>You have {context.cart.items.length} items in basket</a></Link>
                 
            </nav>
        </header>
    )
}
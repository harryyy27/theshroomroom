import Link from 'next/link'
import Image from 'next/image'
import {signIn, signOut,useSession,getSession} from "next-auth/react";
import {useRouter} from 'next/router';
import {useContext,useState,useEffect} from 'react';
import {CartContext} from '../context/cart'
import styles from '../styles/Components/Header.module.css'
import BreadCrumbs from './breadcrumbs'
export default function Header(){
    const {data:session,status} = useSession()
    const [mobileMenuOpen,setMobileMenuOpen]=useState(false);
    const [itemsNotAvailable, setItemsNotAvailable] = useState(false);
    const context = useContext(CartContext)
    const [width,setWidth]=useState(0);

    const router = useRouter();
    function menuOpen(){
            if(document.body.classList.contains("fixed-mobile")){
                document.body.classList.remove("fixed-mobile")
            }
            else {
                document.body.classList.add("fixed-mobile")

            }

            setMobileMenuOpen(!mobileMenuOpen);
    }
    useEffect(()=>{
        setWidth(window.innerWidth)
    },[context])
    return (
        <header id="header" className={styles.header}>
            <nav className={styles["nav"]}>
                <div className={styles["title-bar"]}>
                    
                    <div className={styles["title-bar-element"]}>
                        <Link className={styles["title-bar-logo"]}href='/'>
                            <Image className={styles["logo"]}alt="logo" width={40} height={40}src="/logo_small.jpg"/>
                            <h1 className={styles.title}>Mega Mushrooms</h1>
                        </Link>
                        
                    </div>
                    <div className={styles["title-bar-element"]+" " +styles["sign-in-up"]} aria-hidden={width<1025?true:false}>

                        <div className={styles["acc-stuff"]}>
                            {
                                session?
                                            <span id="welcomeMessage"className={styles["welcomeMessage"]}>Hi {session.user?session.user.name:null}</span>
                                        :
                                        null
                            }
                            {
                                (!session&& status!=="loading")?
                                <>
                                    <span id="signIn"className={router.pathname.includes("signin")?styles["acc-link"]+ " "+styles["active-link"]:styles["acc-link"]} onClick={e=>signIn()} >Sign In</span>
                                    <Link href="/auth/signup" passHref replace><span className={router.pathname.includes("signup")?styles["acc-link"]+ " "+styles["active-link"]:styles["acc-link"]}>Sign Up</span></Link>
                                </>
                                :
                                <>
                                    <Link href="/api/auth/signout" passHref replace><span  id="signOut"className={styles["acc-link"]} onClick={e=>{
                                        e.preventDefault()
                                        signOut()
                                    }}>Sign Out</span></Link>
                                    <Link id="myAccount"href="/myaccount" passHref replace><span className={router.pathname.includes("myaccount")?styles["acc-link"]+ " "+styles["active-link"]:styles["acc-link"]}>My Account</span></Link>
                                </>
                            }
                            <Link className={router.pathname.includes("cart")?styles["acc-link"]+ " "+styles["active-link"]:styles["acc-link"]} href="/cart" passHref replace><span id="cart" className={context.state.totalQuantity?styles["cart-glow"]+" "+styles["cart-writing"]:styles["cart-writing"]}><Image id="cartIcon"  className={styles["shopping-cart-icon"]}src={'/shopping_cart_icon.jpg'} alt="shopping cart icon" width="25" height="25" /><span className={styles["shopping-cart-quantity"]}>{`${context.state.totalQuantity}`}</span></span></Link>
                        </div>
                    </div>
                    
                    {
                        !context.state.cart.items.every((el:any)=>el.stockAvailable >= el.quantity)?
                        <div className={styles["header-stock-message"]}>
                        <p className={styles["header-stock-lines"]}>Items in your cart are no longer in stock. Delete items?</p>
                        <button className={styles["header-delete-stock-btn"]} onClick={(e)=>{
                            context.state.cart.items.forEach((el)=>{
                                if(el.stockAvailable<el.quantity&&context.saveCart){
                                    context.saveCart({
                                        ...el,
                                        quantity:0

                                    })
                                }
                            })
                            console.log('oi twat')
                            console.log(document.querySelector(`.${styles["header-stock-message"]}`))
                            document.querySelector(`.${styles["header-stock-message"]}`)?.classList.add("hidden")
                        }}>Delete</button>
                        </div>
                        :
                        null
                    }
                </div>
                <ul className={`${styles["nav-list"]} ${mobileMenuOpen?"":styles["mobile-menu-visibility"]}`}>
                        <div className={styles["title-bar-element"]+' '+styles["sign-in-up-desktop"]}aria-hidden={width>1025?true:false}>
                            {
                                (!session&& status!=="loading")?
                                <div className={styles["acc-stuff"]}>
                                    <span id="signIn"className={router.pathname.includes("signin")?styles["acc-link"]+ " "+styles["active-link"]:styles["acc-link"]} onClick={e=>{
                                        signIn()
                                        menuOpen()
                                        }} >Sign In</span>
                                    <Link className={router.pathname.includes("signup")?styles["acc-link"]+ " "+styles["active-link"]:styles["acc-link"]}href="/auth/signup" passHref replace onClick={()=>menuOpen()}><span className={styles["toolbar-element"]}>Sign Up</span></Link>
                                </div>
                                :
                                <div className={styles["acc-stuff"]}>
                                    <Link href="/api/auth/signout" passHref replace><span id="signOut"className={styles["acc-link"]} onClick={e=>{
                                        e.preventDefault()
                                        signOut()
                                        menuOpen()
                                    }}>Sign Out</span></Link>
                                    <Link id="myAccountMobile"href="/myaccount" passHref replace onClick={(()=>{menuOpen()})}><span className={router.pathname.includes("myaccount")?styles["acc-link"]+ " "+styles["active-link"]:styles["acc-link"]}>My Account</span></Link>
                                </div>
                            }
                        </div>
                    {/* <li className={styles["nav-element"]+" "+ styles["hello"] +" hidden-desktop"}>Hello{session?` ${session.user.name}`:null}</li> */}
                    <li className={router.pathname.includes("products")?styles["nav-element"]+" "+styles["first-child"]+" "+styles["active-link-pri"]:styles["nav-element"]+" "+styles["first-child"]}><Link className={styles["nav-link"]} href="/products" onClick={()=>{
                        menuOpen()
                    }}>Shop</Link></li>
                    {/* <li className={styles["nav-element"]}>
                        <span className={styles["nav-heading"]} onClick={(e)=>{
                            const target = e.target as Element;
                            toggleDisplay(target)}}>Products</span>
                        <ul className={styles['sub-menu'] +' hidden-mobile'}>
                            <li onClick={(e)=>menuOpen()} className={styles["sub-menu-element"]}><Link href='/products/all' passHref replace><span>All products</span></Link></li>
                            <li onClick={(e)=>menuOpen()} className={styles["sub-menu-element"]}><Link href="/products/mushrooms"passHref replace><span>Mushrooms</span></Link></li>
                            <li onClick={(e)=>menuOpen()} className={styles["sub-menu-element"]}><Link href="/products/equipment" passHref replace><span>Equipment</span></Link></li>
                            <li onClick={(e)=>menuOpen()} className={styles["sub-menu-element"]}><Link href="/products/mycological-supplies" passHref replace><span>Mycological supplies</span></Link></li>
                        </ul>
                    </li> */}
                    <li className={router.pathname.includes("wholesale")?styles["nav-element"]+" "+styles["active-link-pri"]:styles["nav-element"]}><Link className={styles["nav-link"]} href="/wholesale" onClick={()=>menuOpen()}><span>Wholesale</span></Link></li>
                    <li className={router.pathname.includes("about")?styles["nav-element"]+" "+styles["active-link-pri"]:styles["nav-element"]}><Link className={styles["nav-link"]} href="/about"onClick={()=>menuOpen()}><span>About us</span></Link></li>
                    <li className={router.pathname.includes("what-we-grow")?styles["nav-element"]+" "+styles["active-link-pri"]:styles["nav-element"]}><Link className={styles["nav-link"]} href="/what-we-grow"onClick={()=>menuOpen()}><span>What we grow</span></Link></li>
                    <li className={router.pathname.includes("contact-us")?styles["nav-element"]+" "+styles["active-link-pri"]:styles["nav-element"]}><Link className={styles["nav-link"]} href="/contact-us"onClick={()=>menuOpen()}><span>Contact us</span></Link></li>

                    {/* <li className={styles["nav-element"]}>
                        <span className={styles["nav-heading"]} onClick={(e)=>{
                            const target = e.target as Element;
                            toggleDisplay(target)}}>Mushrooms</span>
                        <ul className={styles['sub-menu'] +' hidden-mobile'}>
                            <li onClick={(e)=>menuOpen()} className={styles["sub-menu-element"]}><Link href="/what-we-grow" passHref replace><span>What we grow</span></Link></li>
                            <li onClick={(e)=>menuOpen()} className={styles["sub-menu-element"]}><Link href="/special-requests" passHref replace><span>Special requests</span></Link></li>
                            <li onClick={(e)=>menuOpen()} className={styles["sub-menu-element"]}><Link href="/recipes" passHref replace><span>Recipes</span></Link></li>
                        <li onClick={(e)=>menuOpen()} className={styles["sub-menu-element"]}><Link href="/share-your-recipes" passHref replace><span>Share your recipes</span></Link></li>
                        </ul>
                    </li> */}
                    {/*<li className={styles["nav-element"]}>
                        <span className={styles["nav-heading"]} onClick={(e)=>{
                            const target = e.target as Element;
                            toggleDisplay(target)}}>More</span>
                        <ul className={styles['sub-menu'] +' hidden-mobile'}>
                            <li onClick={(e)=>menuOpen()} className={styles["sub-menu-element"]}><Link href="/nfts" passHref replace><span>NFTs</span></Link></li>
                            <li onClick={(e)=>menuOpen()} className={styles["sub-menu-element"]}><Link href="/cultivation" passHref replace><span>Cultivation method</span></Link></li>
                            <li onClick={(e)=>menuOpen()} className={styles["sub-menu-element"]}><Link href="/identification" passHref replace><span>Identify wild mushrooms</span></Link></li>
                        </ul>
                        </li>*/}
                    {/* <li className={styles['nav-element']}>
                        <span className={styles["nav-heading"]} onClick={(e)=>{
                            const target = e.target as Element;
                            toggleDisplay(target)}}>About</span>
                        <ul className={styles['sub-menu'] +' hidden-mobile'}>
                            <li onClick={(e)=>menuOpen()} className={styles["sub-menu-element"]}><Link href="/about" passHref replace><span>The Shroom Room</span></Link></li>
                        </ul>
                    </li> */}
                </ul>
                <BreadCrumbs homeElement={'Home'} separator={' > '}/>
            </nav>
        {
            process.env.NODE_ENV !== "production"?
            <h1 style={{
            "margin":0,
            "textAlign": "center",
            "position": "absolute",
            "transform":"translate(-50%,-50%)",
            "left":"50%",
            "top":"50%",
            "display":"block",
            "opacity":"0.5",
            "color":"var(--ter2)"

        }}>THIS IS A TEST SITE</h1>:
            <></>
        }
        <span className={styles["title-bar-element"]+ " " + styles["hidden-mobile"]+ " " + styles["cart-container"]} aria-hidden={width>1024?true:false}>
                <Link href="/cart" passHref replace><span id="cart" className={context.state.totalQuantity?styles["cart-glow"]+" "+styles["cart-writing"]:styles["cart-writing"]}><Image id="cartIcon"  className={styles["shopping-cart-icon"]}src={'/shopping_cart_icon.jpg'} alt="shopping cart icon" width="50" height="50" /><span className={styles["shopping-cart-quantity"]}>{`${context.state.totalQuantity}`}</span></span></Link>
        </span>
            <div id="burgerMenu"
                onClick={(e)=>{
                    menuOpen()
                }}
                className={styles["burger-menu-container"]}
                aria-label="Open the navigation menu"
                aria-expanded="false"
                role="button">
                <span className={mobileMenuOpen?styles["burger-menu-element"]+" "+styles["burger-open"]:styles["burger-menu-element"]} aria-hidden="true"></span>
            </div>
            
            
        </header>
    )
}

import { loadStripe } from '@stripe/stripe-js';
import {Metadata} from '../utils/metadata/metadata';
import Head from 'next/head';
import {
    Elements
  } from "@stripe/react-stripe-js";
import Stripe from "stripe";
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );
// import {useEffect,useContext} from 'react';
import {parseCookies, setCookie,destroyCookie} from 'nookies'
import CheckoutForm from '../components/checkout-form'
import { getSession, getCsrfToken } from 'next-auth/react';
import { Product } from '../utils/types'
import { v4 as uuidv4 } from 'uuid';

export default function Checkout({paymentIntent,setComponentLoading}:any){
    
    // const context = useContext(CartContext);
    // useEffect(()=>{

    // },[])
    const options = {
        clientSecret: paymentIntent.client_secret
    }
   
    
    return(
            <>
                <Head>
                    <title>Mega Mushrooms - rare, healthy, London grown lion's mane mushrooms</title>
                    <meta name="description" content="Discover the Power of Lion's Mane Mushrooms! 🍄 Elevate your well-being with our premium Lion's Mane mushrooms - nature's brain booster and immunity enhancer. Handpicked for quality and potency, our organic Lion's Mane products are a natural path to mental clarity and vitality. Explore our range of fresh and dried Lion's Mane mushrooms today and experience the unmatched benefits of this extraordinary fungi. Your journey to optimal health starts here."/>
                    <meta property="og:title" content="Mega Mushrooms - buy our high quality lion's mane mushrooms here"/>
                    <meta property="og:description" content="Reap the rewards of adding this healthy, medicinal and delicious mushroom to your diet"/>
                </Head>
                <Elements stripe={stripePromise} options={options} >
                    <CheckoutForm paymentIntent={paymentIntent}  setComponentLoading={setComponentLoading}/>
                </Elements>
            </>
    )
}

export const getServerSideProps =  async(ctx:any) => {
    const {req,res} = ctx;
    try {
        const secret_key = process.env.STRIPE_SECRET_KEY as string;
        var stripe = new Stripe(secret_key,{
            apiVersion:"2022-08-01",
            maxNetworkRetries:3
        })
        const sesh = await getSession(ctx)
        const {Cart}= parseCookies(ctx,{
            path:"/"
        })
        let total;
        if(sesh&&sesh.user&&sesh.user.cart){
            total = sesh.user.cart.items.reduce((a:number,b:Product)=>{
                return a+b.price
            },0)

        }
        else if(Cart) {
            total = JSON.parse(Cart).items.reduce((a:number,b:Product)=>{
                return a+b.price
            },0)
        }
        if(!sesh&&!Cart){
            return {
                redirect: {
                  permanent: false,
                  destination: "/",
                },
                props:{},
              };
        }
        console.log('yoyoyoyoy')
        let paymentIntent;
        const {paymentIntentId} = parseCookies(ctx)
        if(paymentIntentId){
            paymentIntent=await stripe.paymentIntents.retrieve(paymentIntentId)
            console.log(paymentIntent.status)
            if(paymentIntent.status==="canceled"||paymentIntent.status==="succeeded"){
                console.log('yee')
                destroyCookie(ctx,"paymentIntentId")
            }
            console.log(paymentIntent.status)
            if(paymentIntent.amount!==total*100){
                paymentIntent=await stripe.paymentIntents.update(paymentIntentId,{
                    amount:total*100+500
                })

            }
            return {
                props: {
                    paymentIntent:paymentIntent
                }
            }
        }
        else {

        }
        console.log('where am i?')
        const idempotencyKey = uuidv4();
        paymentIntent = await stripe.paymentIntents.create({
            amount: total*100+500,
            currency: 'gbp',
            automatic_payment_methods: {
                enabled: true,
              },
            
        },{
            idempotencyKey:idempotencyKey
        })
        setCookie(ctx,'paymentIntentId',paymentIntent.id,{
            path:'/checkout'
        })
        return {
            props: {
                paymentIntent:paymentIntent,
            }
        }
    }
    catch(e:any){
        console.log(e)
        return {
            redirect: {
              permanent: false,
              destination: "/",
            },
            props:{},
          };
    }
    
}
import connect from '../../utils/connection';
import {NextApiRequest,NextApiResponse} from 'next'
import {getSession} from 'next-auth/react';
import postcodes from '../../utils/localPostcodes/postcodes'
import discountLogic from '../../utils/discountLogic'
import {parseCookies, setCookie,destroyCookie} from 'nookies'
import { Product } from '../../utils/types'
import { Discounts } from '../../utils/schema';
import saleDates from '../../utils/saleDates/saleDates';
import { v4 as uuidv4 } from 'uuid';
async function getPaymentIntentSubscription(sesh:any,stripe:any,Cart:any,shippingCost:number,ctx:any,start:any){
    var stripeCustomerId= sesh?.user.stripeCustomerId||undefined;
    const secret_key = process.env.STRIPE_SECRET_KEY as string;
    var standardShippingPriceId = process.env.STRIPE_SHIPPING_ID;
    let items;
    if(sesh&&sesh.user&&sesh.user.cart){
        
        items = sesh.user.cart.items.map(async(el:any)=>{
            return {
                price_data:{
                    product: el.stripeId,
                    currency:"GBP",
                    recurring:{
                        interval: "month",
                        interval_count:1,
                    },
                    unit_amount:Math.round(el.price*100)
                },
                quantity:el.quantity
            }
        })

    }
    else if(Cart) {
        items = await JSON.parse(Cart).items.map(async(el:any)=>{
            return {
                price_data:{
                    product: el.stripeId,
                    currency:"GBP",
                    recurring:{
                        interval: "month",
                        interval_count:1,
                    },
                    unit_amount:Math.round(el.price*100)
                },
                quantity:el.quantity
            }
        })
    }

    if(!sesh&&!Cart){
        return {
            props:{
                refresh:true
            },
        };
    }
    if(sesh.user.dAddress&&sesh.user.dAddress.postcode){
        const validPostcodesArr= postcodes;
        const keys = Object.keys(validPostcodesArr)
        let postcodeArea='';
        keys.forEach((key:string)=>{
            if(!validPostcodesArr[key as keyof typeof validPostcodesArr].every((el:string)=>{
                return !sesh.user.dAddress.postcode.toLowerCase().trim().startsWith(el.toLowerCase())}
            )){
                postcodeArea=key
            }
            
        })
        if(postcodeArea===''){
            items.push({
                price_data:{
                    product: standardShippingPriceId,
                    currency:"GBP",
                    recurring:{
                        interval: "month",
                        interval_count:1,
                    },
                    unit_amount:shippingCost*100
                },
                quantity:1,
            })
        }
    }
    else {
        items.push({
            price_data:{
                product: standardShippingPriceId,
                currency:"GBP",
                recurring:{
                    interval: "month",
                    interval_count:1,
                },
                unit_amount:shippingCost*100
            },
            quantity:1,
        })
    }
    

    items= await Promise.all(items) as any

    var checkoutSession = await stripe.subscriptions.create({
        customer: sesh?.user.stripeCustomerId as string,
        items: items,
        payment_behavior:"default_incomplete",
        payment_settings:{
            payment_method_types:["card"],
            save_default_payment_method:"on_subscription"
        },
        expand:["latest_invoice.payment_intent"]
    })
    var subscription_id=checkoutSession.id;
    var latestInvoice = checkoutSession.latest_invoice as any
    setCookie(ctx,'checkoutDetails',JSON.stringify({paymentIntentId:latestInvoice.payment_intent.id as string,subscriptionId:subscription_id}),{
        path:'/checkout'
    })

    return {
        props: {
            paymentIntent:latestInvoice.payment_intent,
            subscriptionId:subscription_id
        }
    }
}
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        if(req.method!=="GET"){
            var e= new Error('only get allowed');
            console.log(e)
            return res.status(500).json({success:false,error:e.toString()})
        }
        
                var start = Date.now()
                
                const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    
                });
                await connect()
                const body = req.url
                const sesh = await getSession({req})
                const {Cart}= parseCookies({req},{
                    path:"/"
                })
                let subscriptionCheckout = (body as string)?.split('subscription=')[1].split('&')[0]==="true"?true:false
                
                var codeName=''
                var shippingCost;
                var discount;
                var postcode;
                console.log(body)
                if(subscriptionCheckout===false&&body?.split('&code').length==2&&sesh&&sesh.user){
                    codeName = body?.split('&code=')[1]
                    shippingCost=Number(body?.split('shippingCost=')[1].split('&')[0])
                    discount = await Discounts().findOne({codeName:codeName})
                    postcode=body?.split('&postcode=')[1].split('&')[0]
                }
                else{

                    shippingCost = Number(body?.split('shippingCost=')[1].split('&')[0])
                }
                console.log(shippingCost)
                let total;
                if(sesh&&sesh.user&&sesh.user.cart){
                    console.log('user')
                    console.log(sesh.user.cart)
                    total = Number(sesh.user.cart.items.reduce((a:number,b:Product)=>{
                        return a+b.price*b.quantity
                    },0).toFixed(2))
        
                }
                else if(Cart) {
                    console.log('cart')
                    total = Number(JSON.parse(Cart).items.reduce((a:number,b:Product)=>{
                        return a+b.price*b.quantity
                    },0).toFixed(2))
                }
                else {
                    return res.status(200).json({
                        props:{
                            refresh:true
                        },
                        });
                }
                var discountFailed=false;
                const todayDate=Date.now()
                if(discount?.codesAvailable>=1){
                    total=Number(discountLogic[codeName as string].newTotal(total, {dPostcode:postcode}).toFixed(2))
                }
                else if(+new Date(saleDates.countdownDate)-todayDate<0 && +new Date(saleDates.saleEndDate)-todayDate>0){
                    total*=0.9
                    total=Number(total.toFixed(2))
                    discountFailed=true
                }
                else{
                    discountFailed=true
                }
                console.log(total)
                if(!sesh&&!Cart){
                    return res.status(200).json({
                        props:{
                            refresh:true
                        },
                        });
                }
                let paymentIntent;
                const {checkoutDetails} = parseCookies({req},{
                    path:"/checkout"
                })
                if(checkoutDetails){
                    var paymentIntentId=JSON.parse(checkoutDetails).paymentIntentId
                    var subscriptionId=JSON.parse(checkoutDetails).subscriptionId
        
                    paymentIntent=await stripe.paymentIntents.retrieve(paymentIntentId)
                    if(
                        paymentIntent.status==="canceled"||
                        paymentIntent.status==="succeeded"||
                        (subscriptionId===''&&subscriptionCheckout===true)||
                        (subscriptionId!==''&&subscriptionCheckout===false)
                        )
                    {
                            destroyCookie({res},"checkoutDetails")
                            if(subscriptionId!==''){
                                await stripe.subscriptions.del(
                                    subscriptionId
                                )
                            }
                    }
                    else{
                        if(subscriptionId===''&&subscriptionCheckout===false){
                            
                            if(paymentIntent.amount!==((total*100)+shippingCost*100)){
                                paymentIntent=await stripe.paymentIntents.update(paymentIntentId,{
                                    amount:total*100+shippingCost*100
                                })
                            }
                                return res.status(200).json({
                                    props: {
                                        paymentIntent:paymentIntent,
                                        subscriptionId:'',
                                        discountFailed:discountFailed
                                    }
                                })
                            
                        }
                        else if (subscriptionId!==''&&subscriptionCheckout==true) {
                            if(paymentIntent.amount!==(total*100+shippingCost*100)){
                                destroyCookie({res},"checkoutDetails")
                                await stripe.subscriptions.del(
                                    subscriptionId
                                )
                            }
                            else {
                                return res.status(200).json({
                                    props: {
                                        paymentIntent:paymentIntent,
                                        subscriptionId:subscriptionId
                                    }
                                })
                            }
        
                        }
                        else {
                            return res.status(200).json({
                            
                                props:{
                                    refresh:true
                                },
                            });
                        }
                    }
                        
                }
                    if(!subscriptionCheckout){
                        const idempotencyKey = uuidv4();
                        paymentIntent = await stripe.paymentIntents.create({
                            amount: total*100+shippingCost*100,
                            currency: 'gbp',
                            automatic_payment_methods: {
                                enabled: true,
                              },
                            
                        },{
                            idempotencyKey:idempotencyKey
                        })
                        setCookie({res},'checkoutDetails',JSON.stringify({paymentIntentId:paymentIntent.id,subscriptionId:''}),{
                            path:'/checkout'
                        })
                        return res.status(200).json({
                            props: {
                                paymentIntent:paymentIntent,
                                subscriptionId:'',
                                discountFailed:discountFailed
                            }
                        })
                    }
                    else{
                        var props = await getPaymentIntentSubscription(sesh,stripe,Cart,shippingCost,{req,res},start)
                        return res.status(200).json(props)
                }
                
            }
            catch(e:any){
                console.log(e)
                return res.status(500).json({
                    props:{
                        refresh:true
                    },
                  });
            }
            
        

}
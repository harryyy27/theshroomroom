import connect from '../../utils/connection';
import {Order, User,Subscription,Product} from '../../utils/schema';
import {NextApiRequest,NextApiResponse} from 'next'
import {getCsrfToken} from 'next-auth/react';
import {errorHandler} from '../../utils/emailHandlers'
import {authOptions} from './auth/[...nextauth]'
import mongoose from 'mongoose'



export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        await connect()
        if(req.method!=="PUT"){
            var e= new Error('only put allowed');
            return res.status(500).json({success:false,error:e.toString()})
        }
        else{
            if(!req.headers.csrftoken){
                var e=new Error('No csrf header found.')
                return res.status(500).json({success:false,error:e.toString()})
            }
            const csrftoken = await getCsrfToken({req:{headers:req.headers}})
            if(req.headers.csrftoken!==csrftoken){
                var e= new Error('CSRF authentication failed.')
                return res.status(500).json({success:false,error:e.toString()})
            }
        }
        const body = JSON.parse(req.body)

        if(req.method==='PUT'){

            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    
            });
                    if(body.subscriptionId!=='') {
                        let items=body.cart.items.map((el:any)=>{
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
                        if(body.shippingCost!==0){
                            items.push({
                                price_data:{
                                    product: process.env.STRIPE_SHIPPING_ID,
                                    currency:"GBP",
                                    recurring:{
                                        interval: "month",
                                        interval_count:1,
                                    },
                                    unit_amount:body.shippingCost*100
                                },
                                quantity:1,
                            })
                        }
                    const subscription = await stripe.subscriptions.update(
                        body.subscriptionId,
                        {
                        
                        items: items,
                        
                    })
                    }

                    else if(body.paymentIntentId!==''){
                        const paymentIntent = await stripe.paymentIntents.update(
                            body.paymentIntentId,
                            {
                                amount:body.cart.items.reduce((acc:number,el:any)=>acc+=el.price,0)*100+body.shippingCost*100
                            }
                          );
                    }
                    else {
                        res.status(500).json({success:false,err:"No paymentIntent or subscriptionId"})
                    }
                    
                      res.status(200).json({success:true})
                    
        }
    }
    catch(e:any){
        console.log(e)
        res.status(500).json({success:false,error:e.toString()})
    }

}
import {NextApiRequest,NextApiResponse} from 'next'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    
});
import {buffer } from '../../utils/stripe_webhook'
import connect from "../../utils/connection" 
import {logger} from '../../utils/logger'

import {Order,Subscription} from '../../utils/schema';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        logger.info('wait')
        await connect()
        if(req.method==="POST"){
            if(!req.headers["stripe-signature"]){
                throw new Error('No stripe signature')
            }
            var rawBody =  await buffer(req);
            const payload = rawBody.toString('utf8');
            var signature= req.headers['stripe-signature']

            const event = stripe.webhooks.constructEvent(payload,signature,endpointSecret)
            var success;
            switch (event.type){
                case "payment_intent.succeeded":
                    console.log("payment_intent.succeeded")
                    console.log(JSON.parse(payload).data.object)
                    var body={

                            paymentIntentId: JSON.parse(payload).data.object.id,
                            status:"ORDER_RECEIVED",
                    }
                        
                    var order = await Order().findOneAndUpdate({paymentIntentId:body.paymentIntentId},{...body})
                    

                    if(order){
                        success=true
                    }
                    else {
                        throw new Error(`No paymentIntentId available for this particular number. Payment intent ID: ${body.paymentIntentId}`)
                    }
                    
                break;
                case "payment_intent.failed":
                    console.log("payment_intent.failed")
                    console.log(JSON.parse(payload).data.object)
                    var body= {
                        paymentIntentId: JSON.parse(payload).data.object.id,
                        status:"ORDER_FAILED",
                    }
                    var order = await Order().findOneAndUpdate({paymentIntentId:body.paymentIntentId},{...body})
                    

                    if(order){
                        success=true
                    }
                    else {
                        throw new Error(`No paymentIntentId available for this particular number. Payment intent ID: ${body.paymentIntentId}`)
                    }
                break;
                
                case "payment_intent.canceled":
                    console.log("payment_intent.canceled")
                    console.log(JSON.parse(payload).data.object)
                    var body= {
                            paymentIntentId: JSON.parse(payload).data.object.id,
                            status:"ORDER_CANCELLED"
                        }

                    var orderExists = await Order().findOne({paymentIntentId:body.paymentIntentId})
                    if(orderExists&&orderExists.status!=="ORDER_DISPATCHED"&&orderExists.status!=="ORDER_DELIVERED"){
                        var order = await Order().findOneAndUpdate({paymentIntentId:body.paymentIntentId},{...body})
                        if(order){
                            success=true
                        }
                        else {
                            throw new Error(`No paymentIntentId available for this particular number. Payment intent ID: ${body.paymentIntentId}`)
                        }
                        
                    }
                    else {
                        success=true
                    }
                    
                    

                        
                break;
                case "customer.subscription.created":
                    console.log("customer.subscription.created")
                    console.log(JSON.parse(payload).data.object)
                    var body={
                        stripeCustomerId:JSON.parse(payload).data.object.customer,
                        isActive:true,
                        subscriptionId: JSON.parse(payload).data.object.id,
                        status:"SUBSCRIPTION_ACTIVE"
                    }

                    var subscription = await Subscription().findOneAndUpdate({subscriptionId:body.subscriptionId},{...body})

                    if(subscription){
                        success=true
                    }
                    else {
                        throw new Error(`No paymentIntentId available for this particular number. Payment intent ID: ${body.paymentIntentId}`)
                    }
                break;
                case "customer.subscription.updated":
                    console.log("customer.subscription.updated")
                    console.log(JSON.parse(payload).data.object)
                    var body={
                        stripeCustomerId:JSON.parse(payload).data.object.customer,
                        isActive:true,
                        subscriptionId: JSON.parse(payload).data.object.id,
                        status:"SUBSCRIPTION_CANCELLED"
                    }
                    if(JSON.parse(payload).data.object.canceled_at!==null){
                        var subscription = await Subscription().findOneAndUpdate({subscriptionId:body.subscriptionId},{status:body.status})
                    }
                    if(subscription){
                        success=true
                    }
                    else {
                        throw new Error(`Subscription cancellation failed for subscription: ${body.subscriptionId}`)
                    }
                break;
                case "customer.subscription.deleted":
                    console.log(JSON.parse(payload).data.object.id)

                    var body={
                        stripeCustomerId:JSON.parse(payload).data.object.customer,
                        isActive:false,
                        subscriptionId: JSON.parse(payload).data.object.id,
                    }
                    var subscription = await Subscription().findOneAndUpdate({subscriptionId:body.subscriptionId},{status:"SUBSCRIPTION_CANCELLED"})
                    
                    if(subscription){
                        success=true
                    }
                    else {
                        throw new Error(`No paymentIntentId available for this particular number. Payment intent ID: ${body.paymentIntentId}`)
                    }
                    break;
                default:
                    success=true

            
                

            }

            if(success===true){
                res.status(200).end()
            }
            else {
                throw new Error(`Payment update failed: ${event.type}`)
            }
        }
        else {
            throw new Error('Only post requests should be sent to this route.')
        }

    }
    catch(e:any){
        logger.info(e)
        logger.error(e)

        res.status(500).json({success:false,error:e.message})
    }
}

export const config = {
    api: {
      bodyParser: false,
    },
  }
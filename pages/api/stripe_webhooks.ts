import {NextApiRequest,NextApiResponse} from 'next'

import {buffer } from '../../utils/stripe_webhook'
import connect from "../../utils/connection" 
import {errorHandler,subscriptionHandler,orderHandler,disputeHandler,refundHandler,invoiceFailHandler,payoutHandler} from '../../utils/emailHandlers'
import {Order,Subscription,User,Dispute} from '../../utils/schema';



export default async function handler(req:NextApiRequest,res:NextApiResponse){
    
    try{
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    
        });
        var payload:string|undefined;
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        await connect()
        if(req.method==="POST"){
            if(!req.headers["stripe-signature"]){
                throw new Error('No stripe signature')
            }
            var rawBody =  await buffer(req);
            payload = rawBody.toString('utf8');
            var signature= req.headers['stripe-signature'];

            const event = stripe.webhooks.constructEvent(payload,signature,endpointSecret)
            var success;
            var body:any|undefined;
            var subBody:any|undefined;
            var websiteName=process.env.WEBSITE_NAME
            var companyEmail=process.env.COMPANY_EMAIL
            switch (event.type){
                case "payment_intent.succeeded":
                    console.log("payment_intent.succeeded")
                    if(JSON.parse(payload).data.object.description==="Subscription update"){
                        var sub_body={
                            paymentIntentId: JSON.parse(payload).data.object.id,
                            status:"ORDER_RECEIVED",
                            invoiceId:JSON.parse(payload).data.object.invoice

                        }
                        var order = await Order().findOneAndUpdate({invoiceId:sub_body.invoiceId},{...sub_body})
                        
                        var subscription = await Subscription().findOneAndUpdate({subscriptionId:order.subscriptionId},{dateLastPaid:Date.now()})
                        await subscriptionHandler(subscription,websiteName,companyEmail,true)
                    }
                    else if(JSON.parse(payload).data.object.description==="Subscription creation"){
                        var sub_body={
                            paymentIntentId: JSON.parse(payload).data.object.id,
                            status:"ORDER_RECEIVED",
                            invoiceId:JSON.parse(payload).data.object.invoice

                        }
                        var order = await Order().findOneAndUpdate({invoiceId:sub_body.invoiceId},{...sub_body})
                        var subscription = await Subscription().findOneAndUpdate({subscriptionId:order.subscriptionId},{dateLastPaid:Date.now(),status:"SUBSCRIPTION_ACTIVE"})
                        await subscriptionHandler(subscription,websiteName,companyEmail,false)
                    }
                    else {
                        body={

                            paymentIntentId: JSON.parse(payload).data.object.id,
                            status:"ORDER_RECEIVED",
                        }
                        var order = await Order().findOneAndUpdate({paymentIntentId:body.paymentIntentId},{...body})

                    }
                    if(order){
                        success=true
                        var trustPilotEmail=process.env.TRUST_PILOT_EMAIL
                        await orderHandler(order,websiteName,companyEmail,trustPilotEmail)
                    }
                    else {
                        throw new Error(`No paymentIntentId available for this particular number. Payment intent ID: ${body.paymentIntentId}`)
                    }
                    
                    
                    break;
                case "payment_intent.failed":
                    console.log("payment_intent.failed")
                    body= {
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
                    body= {
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
                    success=true
                    break;
                case "customer.subscription.updated":
                    console.log("customer.subscription.updated")
                    let subscription_renewal:boolean|null|undefined;
                    if(JSON.parse(payload).data.object.canceled_at!==null){    
                        subBody={
                            stripeCustomerId:JSON.parse(payload).data.object.customer,
                            isActive:true,
                            subscriptionId: JSON.parse(payload).data.object.id,
                            status:"SUBSCRIPTION_CANCELLED"
                        }
                        var date = Date.now()
                        
                        var subscription = await Subscription().findOneAndUpdate({subscriptionId:subBody.subscriptionId},{status:subBody.status,dateCancelled:date})
                        
                        if(subscription){
                            var user = await User().findOneAndUpdate({stripeCustomerId:subBody.stripeCustomerId},{$pull:{ subscriptions:{subscriptionId:subBody.subscriptionId}}})

                        }
                        success=true
                    
                    }
                    else{
                        await User().findOneAndUpdate({currentSubscription:JSON.parse(payload).data.object.id})
                        const newDate=new Date(JSON.parse(payload).data.object.current_period_end*1000)
                        await Subscription().findOneAndUpdate({subscriptionId:JSON.parse(payload).data.object.id},{dateRenewal:newDate})
                        subscription_renewal=true;
                        success=true
                        
                    }
                    break;
                case "customer.subscription.deleted":
                    console.log("customer.subscription.deleted")

                    subBody={
                        stripeCustomerId:JSON.parse(payload).data.object.customer,
                        isActive:false,
                        subscriptionId: JSON.parse(payload).data.object.id,
                        status:"SUBSCRIPTION_CANCELLED"
                    }
                    var subscription = await Subscription().findOneAndUpdate({subscriptionId:subBody.subscriptionId},{status:subBody.status})
                    var user = await User().findOneAndUpdate({stripeCustomerId:subBody.stripeCustomerId},{$pull:{ subscriptions:{subscriptionId:subBody.subscriptionId}}})

                    
                    if(subscription){
                        success=true
                    }
                    else {
                        throw new Error(`Could not cancel subscription. Subscription Id: ${subBody.subscriptionId}`)
                    }
                    break;
                case "invoice.finalized":
                    console.log("invoice.finalized")
                    var object = JSON.parse(payload).data.object
                    if(!(object.billing_reason==="subscription_create")){
                        var sub = object.subscription
                    var subscription = await stripe.subscriptions.retrieve(
                        sub
                    )
                    var renewalDate=new Date(subscription.current_period_end*1000)
                    var updateSubscription = await Subscription().findOneAndUpdate({subscriptionId:sub},{dateRenewal:renewalDate})
                    if(updateSubscription){

                        success=true
                    }
                    else {
                        success=false
                    }
                    }
                    else{
                        success=true
                    }
                    
                    break;
                case "invoice.finalization_failed":
                    console.log("invoice.finaliazation_failed")
                    var object = JSON.parse(payload).data.object
                    var attemptCount=object.attemptCount
                    var order = await Order().findOneAndUpdate({paymentIntentId:object.payment_intent},{status:"PAYMENT_NOT_RECEIVED"})
                    await invoiceFailHandler(attemptCount,order.email,true,websiteName,companyEmail)
                    success=true;
                    break;
                case "invoice.payment_failed":
                    console.log("invoice.payment.failed")
                    
                    var object = JSON.parse(payload).data.object
                    if(object.billing_reason!=="subscription_create"){
                        var attemptCount=object.attemptCount
                        var order = await Order().findOneAndUpdate({paymentIntentId:object.payment_intent},{status:"PAYMENT_NOT_RECEIVED"})
                        await invoiceFailHandler(attemptCount,order.email,false,websiteName,companyEmail)
                        success=false
                    }
                    
                    // await Order().findOneAndUpdate({paymentIntentId:JSON.parse(payload).data.object.payment_intent},{...body})
                    success=true
                    break;
                case "invoice.payment_succeeded":
                    
                    console.log("invoice.payment.succeeded")
                    success=true;
                    break;
                case "invoice.created":
                    
                    console.log("invoice created")
                    if(JSON.parse(payload).data.object.status==="draft"&&JSON.parse(payload).data.object.billing_reason==="subscription_cycle"){
                        var sub_fields={
                            stripeCustomerId:JSON.parse(payload).data.object.customer,
                            isActive:true,
                            paymentIntentId:"DRAFT",
                            subscriptionId: JSON.parse(payload).data.object.subscription,
                            invoiceId: JSON.parse(payload).data.object.id,
                            status:"SUBSCRIPTION_RENEWED"
                        }

                            var subscription = await Subscription().findOne({subscriptionId:sub_fields.subscriptionId}).lean();
                            if(subscription){
                                delete subscription._id
                                var order = new (Order())({...subscription});
                                var date = Date.now();
                                order.dateOfPurchase= date;
                                order.paymentIntentId=sub_fields.paymentIntentId
                                order.invoiceId=sub_fields.invoiceId
                                order.subscriptionId=sub_fields.subscriptionId
                                order.status="ORDER_PENDING";
                                await order.save()
                                success=true
                            }
                            else{
                                success=false
                                throw new Error("subscription does not exist?")
                            }

                    }
                    else {
                        success=true

                    }

                    break;
                    
                case "charge.dispute.created":
                    var object = JSON.parse(payload).data.object
                    var date = Date.now()
                    var dispute = new (Dispute())({reason:object.reason,paymentIntentId:object.payment_intent,disputeId:object.id, status:"OPEN",dateReceived:date,dateUpdated:date});
                    await dispute.save()
                    await disputeHandler(object,"created",websiteName,companyEmail)
                    
                    success=true
                    break;
                case "charge.dispute.updated":
                    var object = JSON.parse(payload).data.object
                    await Dispute().findOneAndUpdate({disputeID:object.id},{status:object.status,dateUpdated:Date.now()})
                    await disputeHandler(object,"updated",websiteName,companyEmail)
                    success=true
                    break;
                case "charge.dispute.closed":
                    var object = JSON.parse(payload).data.object

                    await Dispute().findOneAndUpdate({disputeID:object.id},{status:"CLOSED",dateUpdated:Date.now()})
                    await disputeHandler(object,"closed",websiteName,companyEmail)
                    success=true
                    break;
                case "payout.paid":
                    var object = JSON.parse(payload).data.object
                    await payoutHandler(true,object,companyEmail)
                    success=true
                case "payout.failed":
                    var object = JSON.parse(payload).data.object
                    await payoutHandler(false,object,companyEmail)
                    success=true
                    break;
                case "charge.refunded":
                    var object = JSON.parse(payload).data.object
                    await Order().findOneAndUpdate({paymentIntentId:object.payment_intent},{status:"ORDER_REFUNDED"})
                    success=true
                    break;
                case "charge.refund.updated":
                    
                    var object = JSON.parse(payload).data.object
                    if(object.status==="failed"){
                        await refundHandler(object,companyEmail)


                    }
                    success=true
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
        
        console.error(e)
        await errorHandler(JSON.stringify(req.headers),payload,req.method as string,e.toString(),false)
        return res.status(500).json({success:false,error:e.toString()})
    }
}

export const config = {
    api: {
      bodyParser: false,
    },
  }
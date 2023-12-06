import {NextApiRequest,NextApiResponse} from 'next'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    
});
import {buffer } from '../../utils/stripe_webhook'
import connect from "../../utils/connection" 
import {errorHandler,subscriptionHandler,orderHandler,disputeHandler,refundHandler,invoiceFailHandler,payoutHandler} from '../../utils/emailHandlers'
import {Order,Subscription,User,Dispute} from '../../utils/schema';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        await connect()
        if(req.method==="POST"){
            if(!req.headers["stripe-signature"]){
                throw new Error('No stripe signature')
            }
            var rawBody =  await buffer(req);
            var payload = rawBody.toString('utf8');
            var signature= req.headers['stripe-signature']

            const event = stripe.webhooks.constructEvent(payload,signature,endpointSecret)
            var success;
            var body:any|undefined;
            var subBody:any|undefined;
            switch (event.type){
                case "payment_intent.succeeded":
                    console.log("payment_intent.succeeded")
                    console.log(JSON.parse(payload).data.object)
                    if(JSON.parse(payload).data.object.description==="Subscription update"){
                        var sub_body={
                            paymentIntentId: JSON.parse(payload).data.object.id,
                            status:"ORDER_RECEIVED",
                            invoiceId:JSON.parse(payload).data.object.invoice

                        }
                        var order = await Order().findOneAndUpdate({invoiceId:sub_body.invoiceId},{...sub_body})
                        console.log(order)
                        var subscription = await Subscription().findOneAndUpdate({subscriptionId:order.subscriptionId},{dateLastPaid:Date.now()})
                        console.log(subscription)
                    }
                    else {
                        body={

                            paymentIntentId: JSON.parse(payload).data.object.id,
                            status:"ORDER_RECEIVED",
                        }
                        console.log("BODY",body)
                        var order = await Order().findOneAndUpdate({paymentIntentId:body.paymentIntentId},{...body})

                    }
                    console.log(order)
                    console.log("ORDEEEEEEEEEEER")
                    if(order){
                        success=true
                        await orderHandler(order)
                    }
                    else {
                        throw new Error(`No paymentIntentId available for this particular number. Payment intent ID: ${body.paymentIntentId}`)
                    }
                    
                    

                    
                    // console.log(JSON.parse(payload).data.object)
                    
                    
                break;
                case "payment_intent.failed":
                    console.log("payment_intent.failed")
                    // console.log(JSON.parse(payload).data.object)
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
                    // console.log(JSON.parse(payload).data.object)
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
                    // console.log(JSON.parse(payload).data.object)
                    subBody={
                        stripeCustomerId:JSON.parse(payload).data.object.customer,
                        isActive:true,
                        subscriptionId: JSON.parse(payload).data.object.id,
                        status:"SUBSCRIPTION_ACTIVE"
                    }
                    console.log(subBody)
                    var subscription = await Subscription().findOneAndUpdate({subscriptionId:subBody.subscriptionId},{...subBody})
                    
                    var user = await User().findOneAndUpdate({stripeCustomerId:subBody.stripeCustomerId},{$push:{subscriptions:{subscriptionId:subBody.subscriptionId}}})
                    

                    if(subscription){
                        success=true
                        await subscriptionHandler(subscription)
                    }
                    else {
                        throw new Error(`Subscription update failed Subscription ID: ${subBody.subscriptionId}`)
                    }
                break;
                case "customer.subscription.updated":
                    console.log("customer.subscription.updated")
                    // console.log(JSON.parse(payload).data.object)
                    // console.log(JSON.parse(payload).data.object.payment_intent)
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
                        
                        var user = await User().findOneAndUpdate({stripeCustomerId:subBody.stripeCustomerId},{$pull:{ subscriptions:{subscriptionId:subBody.subscriptionId}}})
                        
                    
                    }
                    else{
                        await User().findOneAndUpdate({currentSubscription:JSON.parse(payload).data.object})
                        subscription_renewal=true;
                    }
                    if(subscription||subscription_renewal){
                        success=true
                    }
                    else {
                        throw new Error(`Subscription cancellation failed for subscription id: ${subBody.subscriptionId}`)
                    }
                break;
                case "customer.subscription.deleted":
                    console.log("customer.subscription.deleted")
                    console.log(JSON.parse(payload).data.object.id)

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
                case "invoice.finalization_failed":
                    var object = JSON.parse(payload).data.object
                    var attemptCount=object.attemptCount
                    var order = await Order().findOneAndUpdate({paymentIntentId:object.payment_intent},{status:"PAYMENT_NOT_RECEIVED"})
                    await invoiceFailHandler(attemptCount,order.email,true)
                    success=true;
                    break;
                case "invoice.payment_failed":
                    console.log("invoice.payment.failed")
                    var object = JSON.parse(payload).data.object
                    var attemptCount=object.attemptCount
                    var order = await Order().findOneAndUpdate({paymentIntentId:object.payment_intent},{status:"PAYMENT_NOT_RECEIVED"})
                    await invoiceFailHandler(attemptCount,order.email,false)
                    // await Order().findOneAndUpdate({paymentIntentId:JSON.parse(payload).data.object.payment_intent},{...body})
                    success=true
                    break;
                case "invoice.created":
                    
                    console.log("invoice created")
                    console.log(JSON.parse(payload).data.object)
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
                            console.log(subscription)
                            if(subscription){
                                delete subscription._id
                                console.log({...subscription})
                                var order = new (Order())({...subscription});
                                console.log(order)
                                var date = Date.now();
                                order.dateOfPurchase= date;
                                order.paymentIntentId=sub_fields.paymentIntentId
                                order.invoiceId=sub_fields.invoiceId
                                order.subscriptionId=sub_fields.subscriptionId
                                order.status="ORDER_PENDING";
                                console.log(order)
                                order.save()
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

                    var dispute = new (Dispute())({reason:object.reason,paymentIntentId:object.payment_intent,disputeId:object.id, status:"OPEN"});
                    dispute.save()
                    await disputeHandler(object,"created")
                    
                    success=true
                    break;
                case "charge.dispute.updated":
                    var object = JSON.parse(payload).data.object
                    await Dispute().findOneAndUpdate({disputeID:object.id},{status:object.status})
                    await disputeHandler(object,"updated")
                    success=true
                    break;
                case "charge.dispute.closed":

                    await Dispute().findOneAndUpdate({disputeID:object.id},{status:"CLOSED"})
                    await disputeHandler(object,"closed")
                    success=true
                    break;
                case "payout.paid":
                    var object = JSON.parse(payload).data.object
                    await payoutHandler(true,object)
                    success=true
                case "payout.failed":
                    var object = JSON.parse(payload).data.object
                    await payoutHandler(false,object)
                    success=true
                case "charge.refunded":
                    var object = JSON.parse(payload).data.object
                    await Order().findOneAndUpdate({paymentIntentId:object.payment_intent},{status:"ORDER_REFUNDED"})
                    success=true
                case "charge.refund.updated":
                    
                    var object = JSON.parse(payload).data.object
                    if(object.status==="failed"){
                        console.log(object)
                        await refundHandler(object)


                    }
                    success=true
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
        // await errorHandler(JSON.stringify(req.headers),payload,req.method as string,e.toString(),false)
        return res.status(500).json({success:false,error:e.toString()})
    }
}

export const config = {
    api: {
      bodyParser: false,
    },
  }
import connect from '../../utils/connection';
import {Order, User,Subscription} from '../../utils/schema';
import {NextApiRequest,NextApiResponse} from 'next'
import {getCsrfToken} from 'next-auth/react';
import {errorHandler} from '../../utils/emailHandlers'
import {getServerSession} from 'next-auth'
import {authOptions} from './auth/[...nextauth]'
import {Query} from 'mongoose'


async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        await connect()

        if(req.method!=='GET'){
            if(!req.headers.csrftoken){
                throw new Error('No csrf header found.')
            }
            const csrftoken = await getCsrfToken({req:{headers:req.headers}})
            console.log(csrftoken)
            console.log(req.headers.csrftoken)
            if(req.headers.csrftoken!==csrftoken){
                throw new Error('CSRF authentication failed.')
            }
        }
        if(req.method==='POST'){
            var body = JSON.parse(req.body);
            var checkOrderExists = await Order().findOne({paymentIntentId:body.paymentIntentId})
            if(checkOrderExists){
                var order = checkOrderExists
            }
            else{
                var order = new (Order())(body);
            }
                
            var date = Date.now();
            order.dateOfPurchase= date;
            if(body.subscription){
                var session = await getServerSession(req,res,authOptions);
                if(!session?.user){
                    throw new Error('You need to be signed in to subscribe.')
                }
                var stripeCustomerId= session.user.stripeCustomerId||undefined
                console.log('yer')
                var subscriptionObj = {...body}
                var standardShippingPriceId = "prod_P32r7gtFljcJHc";
                console.log('yeeeeeee')
                if(order.subscriptionId){
                    var subValidated= await Subscription().findOneAndUpdate({subscriptionId:order.subscriptionId},{dateOfPurchase:date,dateLastPaid:date})
                }
                else {
                    var subscriptionNew = new (Subscription())(
                        {
                            ...subscriptionObj,
                            status:"SUBSCRIPTION_INITIATED",
                            subscriptionId:'PENDING',
                            interval:body.subscription,
                            stripeCustomerId:session?.user.stripeCustomerId
                        })
                    subscriptionNew.dateOfPurchase=date
                    subscriptionNew.dateLastPaid=date
                    var subValidated=await subscriptionNew.save()
                }
                
                var items = subscriptionObj.products.items.map((el:any)=>{
                    return {
                        price_data:{
                            product: "prod_MbjrXeSU0a3Ii0",
                            currency:"GBP",
                            recurring:{
                                interval: body.subscription==="weekly"?"week":"month",
                                interval_count:1,
                            },
                            unit_amount:Math.round(el.price*100)
                        },
                        quantity:el.quantity
                    }
                })
                items.push({
                    price_data:{
                        product: standardShippingPriceId,
                        currency:"GBP",
                        recurring:{
                            interval: body.subscription==="weekly"?"week":"month",
                            interval_count:1,
                        },
                        unit_amount:500
                    },
                    quantity:1,
                })
                const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    
                });
                var checkoutSession = await stripe.subscriptions.create({
                    customer: session.user.stripeCustomerId,
                    items: items,
                    payment_behavior:"default_incomplete",
                    payment_settings:{
                        payment_method_types:["card"],
                        save_default_payment_method:"on_subscription"
                    },
                    expand:["latest_invoice.payment_intent"]
                })
                var subscription_id=checkoutSession.id;
                const subscription=await Subscription().findOneAndUpdate({_id:subValidated._id},{status:"SUBSCRIPTION_CREATED",subscriptionId:subscription_id,stripeCustomerId:stripeCustomerId,interval:items[0].subscription==="weekly"?"week":"month"})
                order.subscriptionId=subscription_id
                order.stripeCustomerId=stripeCustomerId
                console.log(subscription)
            }
            console.log(order)
            var validated=order.save()
            if(validated){
                console.log('yoooo')
                return res.status(200).json(
                    {
                        success:true, 
                        date:order.dateOfPurchase, 
                        id:order._id,
                        subscription_id:subscription_id?subscription_id:null,
                        stripeCustomerId:order.stripeCustomerId?order.stripeCustomerId:null,
                        client_secret:checkoutSession?checkoutSession.latest_invoice.payment_intent.client_secret:null
                    })
            }
            else {
                throw new Error('Missing fields')

            }
        }
        else if(req.method==='GET'){
            if(req.url?.split('id=').length===1){
                throw new Error('No id provided')
            }
            const id = req.url?.split('id=')[1];
            const orders= await Order().find({userId:id}).exec()
            return res.status(200).json({orders:orders})

        }
        else if(req.method==='PUT'){
            var body=JSON.parse(req.body);
            if(req.body.cancel){
                order = await Order().findOneAndUpdate({paymentIntentId:body.paymentIntentId,status:{$nin:["ORDER_DISPATCHED","ORDER_DELIVERED"]}},{...body.order})
            }
            else {
                
                order = await Order().findOneAndUpdate({paymentIntentId:body.paymentIntentId},{...body})
            }

            if(order){
                return res.status(200).json({success:true})
            }
            else {
                throw new Error(`No paymentIntentId available for this particular number. Payment intent ID: ${body.paymentIntentId}`)
            }
        }
        else if(req.method==='DELETE'){
            var body=JSON.parse(req.body);
            console.log(body)
            order = await Order().findOneAndUpdate({_id:body._id},{status:"REFUND_PENDING"})
            if(order){

                const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    
                });
                const paymentIntent = await stripe.refunds.create({
                    payment_intent: order.paymentIntentId,
                });
              if(paymentIntent){
                return res.status(200).json({success:true})
              }
                
            }

            else {
                throw new Error(`No paymentIntentId available for this particular number. Payment intent ID: ${body.paymentIntentId}`)
            }
        }

    }
    catch(e:any){
        
        console.error(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.toString(),false)
        return res.status(500).json({success:false,error:e.toString()})
    }

}
export default handler
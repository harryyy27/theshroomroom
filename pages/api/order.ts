import connect from '../../utils/connection';
import {Order, User,Subscription} from '../../utils/schema';
import {NextApiRequest,NextApiResponse} from 'next'
import {getCsrfToken} from 'next-auth/react';
import errorHandler from '../../utils/errorHandler'
import {getServerSession} from 'next-auth'
import {authOptions} from './auth/[...nextauth]'


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
            var order = new (Order())(body);
            var date = Date.now();
            order.dateOfPurchase= date;
            if(body.subscription){
                var session = await getServerSession(req,res,authOptions);
                if(!session?.user){
                    throw new Error('You need to be signed in to subscribe.')
                }
                var stripeCustomerId= session.user.stripeCustomerId
                console.log('yer')
                var subscriptionObj = {...body}
                var standardShippingPriceId = "prod_P32r7gtFljcJHc";
                console.log('yeeeeeee')
                var subscriptionDetails = new (Subscription())(
                    {
                        ...subscriptionObj,
                        status:"SUBSCRIPTION_INITIATED",
                        subscriptionId:'PENDING',
                        interval:body.subscription,
                        stripeCustomerId:session?.user.stripeCustomerId
                    })
                subscriptionDetails.dateOfPurchase=date
                var subValidated=await subscriptionDetails.save()
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
            var validated=order.save()
            if(validated){
                console.log('yoooo')
                return res.status(200).json(
                    {
                        success:true, 
                        date:order.dateOfPurchase, 
                        id:order._id,
                        subscription_id:subscription_id?subscription_id:null,
                        stripeCustomerId:stripeCustomerId?stripeCustomerId:null,
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
            order = await Order().findOneAndUpdate({_id:body._id,status:!"ORDER_DISPATCHED"},{status:"REFUND_PENDING"})
            if(order){
                return res.status(200).json({success:true})
            }

            else {
                throw new Error(`No paymentIntentId available for this particular number. Payment intent ID: ${body.paymentIntentId}`)
            }
        }

    }
    catch(e:any){
        console.log(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.error,e.stack,false)

        res.status(500).json({success:false,error:e.message})
    }

}
export default handler
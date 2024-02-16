import connect from '../../utils/connection';
import {Order, User,Subscription,Product} from '../../utils/schema';
import {NextApiRequest,NextApiResponse} from 'next'
import {getCsrfToken} from 'next-auth/react';
import {errorHandler} from '../../utils/emailHandlers'
import {getServerSession} from 'next-auth'
import {authOptions} from './auth/[...nextauth]'
import mongoose from 'mongoose'


async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        await connect()

        if(req.method!=='GET'){
            if(!req.headers.csrftoken){
                throw new Error('No csrf header found.')
            }
            const csrftoken = await getCsrfToken({req:{headers:req.headers}})
            if(req.headers.csrftoken!==csrftoken){
                throw new Error('CSRF authentication failed.')
            }
        }
        if(req.method==='POST'){
            var dbSession:mongoose.ClientSession|null=null;
            try{
                dbSession = await mongoose.startSession();
                var body = JSON.parse(req.body);
                await dbSession?.withTransaction(async()=>{
                for(var i =0;i<body.products.items.length;i++){
                    let prod=await Product().findOneAndUpdate({stripe_product_id:body.products.items[i].stripeProductId,stock_available:{$gte:body.products.items[i].quantity}},{$inc:{stock_available:-body.products.items[i].quantity}}).session(dbSession)
                    if(!prod){
                        await dbSession?.abortTransaction()
                        const prodfail = await Product().findOne({stripe_product_id:body.products.items[i].stripeProductId})
                        if(prodfail.stock_available===0){
                            var error= new Error(`Product: ${body.products.items[i].fresh?"fresh":"dry"} ${body.products.items[i].name} ${body.products.items[i].size} is no longer available.`)
                        }
                        else {
                            var error = new Error(`Product: ${body.products.items[i].fresh?"fresh":"dry"} ${body.products.items[i].name} ${body.products.items[i].size} is out of stock in these quantities.`)
                        }
                        
                        error.cause="transaction"
                        throw(error)
                    }
                }
                return true
                })
            }
            catch(e:any){
                e.cause="transaction"
                throw(e)
            }
            finally{
                if(dbSession!==null){
                    await dbSession?.endSession()

                }
            }
                
            
                
                

            
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
                    var stripeCustomerId= session?.user.stripeCustomerId||undefined
                    var subscriptionObj = {...body}
                    var standardShippingPriceId = "prod_P32r7gtFljcJHc";
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
                        customer: session?.user.stripeCustomerId,
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
                }
                var validated= await order.save()
                if(validated){
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
            if(req.url?.includes('user_id=')){
                const id = req.url?.split('user_id=')[1];
                var orders= await Order().find({userId:id}).exec()
            }
            else if (req.url?.includes('order_id=')){
                const id = req.url?.split('order_id=')[1];
                var orders= await Order().find({_id:id}).exec()

            }
            else {
                throw new Error('No id provided')
            }
            
            return res.status(200).json({orders:orders})

        }
        else if(req.method==='PUT'){
            var body=JSON.parse(req.body);
            if(req.body.cancel){
                var order = await Order().findOneAndUpdate({paymentIntentId:body.paymentIntentId,status:{$in:["ORDER_RECEIVED"]}},{...body.order})
            }
            else {
                if(body.paymentIntentId){
                    var order = await Order().findOneAndUpdate({paymentIntentId:body.paymentIntentId},{...body})
                }
                
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
            var order = await Order().findOneAndUpdate({_id:body._id,status:{$in:["ORDER_RECEIVED"]}},{status:"REFUND_PENDING"})
            if(order){

                const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    
                });
                const paymentIntent = await stripe.refunds.create({
                    payment_intent: order.paymentIntentId,
                });

                for(var i=0;i<order.products.items.length; i++){
                    await Product().findOneAndUpdate({stripe_product_id:order.products.items[i].stripeProductId},{$inc:{stock_available:order.products.items[i].quantity}})
                }
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
        return res.status(500).json({success:false,error:e.toString(),transactionFailure:e.cause==="transaction"?true:false})
    }

}
export default handler
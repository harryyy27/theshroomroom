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
                var e=new Error('No csrf header found.')
                return res.status(500).json({success:false,error:e.toString()})
            }
            const csrftoken = await getCsrfToken({req:{headers:req.headers}})
            if(req.headers.csrftoken!==csrftoken){
                var e= new Error('CSRF authentication failed.')
                return res.status(500).json({success:false,error:e.toString()})
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
                return res.status(500).json({success:false,error:e.toString()})
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
                if(body.subscription!==''){
                    var session = await getServerSession(req,res,authOptions);
                    if(!session?.user){
                        const error= new Error('You need to be signed in to subscribe.')
                        return res.status(500).json({success:false,error:error.toString()})
                    }
                    var stripeCustomerId= session?.user.stripeCustomerId||undefined
                    var subscriptionObj = {...body}
                    if(order.subscriptionId){
                        var subValidated= await Subscription().findOneAndUpdate({subscriptionId:order.subscriptionId},{dateOfPurchase:date,dateLastPaid:date})
                    }
                    else {
                        var subscriptionNew = new (Subscription())(
                            {
                                ...subscriptionObj,
                                status:"SUBSCRIPTION_CREATED",
                                subscriptionId:body.subscription,
                                interval:"monthly",
                                stripeCustomerId:session?.user.stripeCustomerId
                            })
                        subscriptionNew.dateOfPurchase=date
                        subscriptionNew.dateLastPaid=date
                        var subValidated=await subscriptionNew.save()
                    }
                    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    
                    });
                    const paymentIntent = await stripe.paymentIntents.retrieve(
                        body.paymentIntentId
                      );
                    
                    order.subscriptionId=body.subscription
                    order.stripeCustomerId=stripeCustomerId
                    order.invoiceId=paymentIntent.invoice
                }
                var validated= await order.save()
                if(validated){
                    return res.status(200).json(
                        {
                            success:true, 
                            date:order.dateOfPurchase, 
                            id:order._id,
                            subscription_id:body.subscription?body.subscription:null,
                            stripeCustomerId:order.stripeCustomerId?order.stripeCustomerId:null
                        })
                }
                else {
                    const error= new Error('Missing fields')
                    return res.status(500).json({success:false,error:error.toString()})

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
                const error= new Error('No id provided')
                return res.status(500).json({success:false,error:error.toString()})
            }
            
            return res.status(200).json({orders:orders})

        }
        else if(req.method==='PUT'){
            var body=JSON.parse(req.body);
            if(body.cancel){
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
                const e = new Error(`No paymentIntentId available for this particular number. Payment intent ID: ${body.paymentIntentId}`)
                return res.status(500).json({success:false,error:e.toString()})
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
                const e = new Error(`No paymentIntentId available for this particular number. Payment intent ID: ${body.paymentIntentId}`)
                return res.status(500).json({success:false,error:e.toString()})
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
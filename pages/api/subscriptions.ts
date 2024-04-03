import connect from '../../utils/connection';
import {Order, User,Subscription} from '../../utils/schema';
import {NextApiRequest,NextApiResponse} from 'next'
import {getCsrfToken} from 'next-auth/react';
import {errorHandler} from '../../utils/emailHandlers'

async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        await connect()
        if(req.method!=='GET'){
            if(!req.headers.csrftoken){
                var e= new Error('No csrf header found.')
                return res.status(500).json({success:false,error:e.toString()})
            }
            const csrftoken = await getCsrfToken({req:{headers:req.headers}})
            if(req.headers.csrftoken!==csrftoken){
                var e= new Error('CSRF authentication failed.')
                return res.status(500).json({success:false,error:e.toString()})
            }
        }
        
        if(req.method==='GET'){
            if(req.url?.includes('user_id=')){
                const id = req.url?.split('user_id=')[1];
                const subscriptions= await Subscription().find({userId:id,status:["SUBSCRIPTION_ACTIVE","SUBSCRIPTION_CANCELLED"]}).exec()
                return res.status(200).json({subscriptions:subscriptions})
            }
            else if(req.url?.includes('subscription_id=')){
                const id = req.url?.split('subscription_id=')[1];
                const subscriptions= await Subscription().find({_id:id}).exec()
                return res.status(200).json({subscriptions:subscriptions})
            }
            else {
                var e= new Error('No id provided')
                return res.status(500).json({success:false,error:e.toString()})

            }
            

        }
        else if(req.method==='PUT'){
            var body=JSON.parse(req.body);
            if(body.cancel){
                var subscription = await Subscription().findOneAndUpdate({subscriptionId:body.subscriptionId,status:{$in:["SUBSCRIPTION_ACTIVE"]}},{status:"SUBSCRIPTION_CANCELLED"})
            }
            else if (body.resume){
                var subscription = await Subscription().findOneAndUpdate({subscriptionId:body.subscriptionId,status:{$in:["SUBSCRIPTION_PAUSED"]}},{status:"SUBSCRIPTION_ACTIVE"})
            }
            else if (body.pause){
                var subscription = await Subscription().findOneAndUpdate({subscriptionId:body.subscriptionId,status:{$in:["SUBSCRIPTION_ACTIVE"]}},{status:"SUBSCRIPTION_PAUSED"})
            }
            else if (body.amend){

                var subscription= await Subscription().findOneAndUpdate({subscriptionId:body.subscriptionId,status:{$in:["SUBSCRIPTION_ACTIVE"]}},{dAddress:body.dAddress,bAddress:body.bAddress,deliveryHub:body.deliveryHub})
                
            }

            if(subscription){
                return res.status(200).json({success:true})
            }
            else {
                
                var e=new Error(`Subscription update unsuccessfull: Subscription ID ${body.subscriptionId}`)
                return res.status(500).json({success:false,error:e.toString()})
            }
        }
        else if(req.method==='DELETE'){
            var body=JSON.parse(req.body);
            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    
            });     
            const deletedSubscription = await stripe.subscriptions.cancel(body.subscription_id);

            if(deletedSubscription){
                return res.status(200).json({success:true})
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
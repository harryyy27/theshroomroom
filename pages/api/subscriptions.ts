import connect from '../../utils/connection';
import {Order, User,Subscription} from '../../utils/schema';
import {NextApiRequest,NextApiResponse} from 'next'
import {getCsrfToken} from 'next-auth/react';
import errorHandler from '../../utils/errorHandler'

async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        throw Error('yes')
        await connect()
        console.log('yeeeeh?')
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
        
        if(req.method==='GET'){
            if(req.url?.split('id=').length===1){
                throw new Error('No id provided')
            }
            const id = req.url?.split('id=')[1];
            const subscriptions= await Subscription().find({userId:id,status:["SUBSCRIPTION_ACTIVE","SUBSCRIPTION_CANCELLED"]}).exec()
            return res.status(200).json({subscriptions:subscriptions})

        }
        else if(req.method==='PUT'){
            var body=JSON.parse(req.body);
            if(req.body.cancel){
                var subscription = await Subscription().findOneAndUpdate({subscriptionId:body.subscriptionId,status:{$nin:["SUBSCRIPTION_ACTIVE"]}},{status:"SUBSCRIPTION_CANCELLED"})
            }
            else if (req.body.resume){
                var subscription = await Subscription().findOneAndUpdate({subscriptionId:body.subscriptionId,status:{$nin:["SUBSCRIPTION_PAUSED"]}},{status:"SUBSCRIPTION_ACTIVE"})
            }
            else if (req.body.pause){
                var subscription = await Subscription().findOneAndUpdate({subscriptionId:body.subscriptionId,status:{$nin:["SUBSCRIPTION_ACTIVE"]}},{status:"SUBSCRIPTION_PAUSED"})
            }

            if(subscription){
                return res.status(200).json({success:true})
            }
            else {
                throw new Error(`No paymentIntentId available for this particular number. Payment intent ID: ${body.paymentIntentId}`)
            }
        }
        else if(req.method==='DELETE'){
            console.log('innnn?')
            var body=JSON.parse(req.body);
            console.log(body)
            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    
            });            
            const deletedSubscription = await stripe.subscriptions.del(
                body.subscription_id
            );

            if(deletedSubscription){
                return res.status(200).json({success:true})
                
            }
        }

    }
    catch(e:any){
        const error = new Error('eeeeee') as any
        console.log(error.stackmessage)
        // const eeee=Object.getPrototypeOf(error)
        var errorMsg;
        var errorStk;
        const err2 =new Error(`${Object.getOwnPropertyNames(error).join('')}`) as any
        console.log(err2.stackmessage)
        if(e.message){
            errorMsg=e.message
        }
        else {
            errorMsg = ''
        }
        if(e.stack){
            errorStk=e.stack
        }
        else {
            errorStk='Not available'
        }
        if(errorMsg &&errorStk){
            await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.error,e.stack,false)
        }
        

        return res.status(500).json({success:false,error:e.message})
    }

}
export default handler
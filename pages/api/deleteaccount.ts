import connect from '../../utils/connection';
import {User,Subscription} from '../../utils/schema';
import {NextApiRequest,NextApiResponse} from 'next';
import {getCsrfToken} from 'next-auth/react';
import {deleteAccountHandler, errorHandler} from '../../utils/emailHandlers'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        console.log('yoyoyoyo')
        if(req.method!=="DELETE"){
            throw new Error('Not delete request.')
        }
        console.log('errr')
        if(!req.headers.csrftoken){
            throw new Error('No csrf header found.')
        }
        console.log('yepyepypeyp')
        const csrfClient=req.headers.csrftoken;
        const csrfServer = await getCsrfToken({req:{headers:req.headers}});
        if(csrfClient !== csrfServer){
            throw new Error('CSRF authentication failed.')
        }
        console.log('errrrrrrrr')
        const email = JSON.parse(req.body)
        const emailStr=email.email
        await connect()
        const user = await User().findOne({username:emailStr})
        const subscriptions = user.subscriptions 
        if(user&&user.subscriptions.length>1){
            for(var i=0;i<subscriptions.length;i++){
                const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    
                });            
                await stripe.subscriptions.del(
                    subscriptions[i].subscriptionId
                );
                await Subscription().findOneAndUpdate({subscriptionId:subscriptions[i].subscriptionId},{status:"SUBSCRIPTION_CANCELLED"})
            }
                
        
                
            
        }
        
        const deleted = await User().deleteOne({username:emailStr})
        await deleteAccountHandler(emailStr,process.env.WEBSITE_NAME)
        return res.status(200).json({message:"Successfully deleted account"})

    }
    catch(e:any){
        
        console.error(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.toString(),false)
        return res.status(500).json({success:false,error:e.toString()})
    }



    
}
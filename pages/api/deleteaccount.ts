import connect from '../../utils/connection';
import {User,Subscription} from '../../utils/schema';
import {NextApiRequest,NextApiResponse} from 'next';
import {getCsrfToken} from 'next-auth/react';
import {deleteAccountHandler, errorHandler} from '../../utils/emailHandlers'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        if(req.method!=="DELETE"){
            var e= new Error('Not delete request.')
            return res.status(500).json({success:false,error:e.toString()})
        }
        if(!req.headers.csrftoken){
            var e =new Error('No csrf header found.')
            return res.status(500).json({success:false,error:e.toString()})
            
        }
        const csrfClient=req.headers.csrftoken;
        const csrfServer = await getCsrfToken({req:{headers:req.headers}});
        if(csrfClient !== csrfServer){
            var e= new Error('CSRF authentication failed.')
            return res.status(500).json({success:false,error:e.toString()})
        }
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
        const companyEmail = process.env.COMPANY_EMAIL
        const deleted = await User().deleteOne({username:emailStr})
        await deleteAccountHandler(emailStr,process.env.WEBSITE_NAME,companyEmail)
        return res.status(200).json({message:"Successfully deleted account"})

    }
    catch(e:any){
        
        console.error(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.toString(),false)
        return res.status(500).json({success:false,error:e.toString()})
    }



    
}
import bcrypt from 'bcrypt';
import {User,ReceiveUpdates,Order,Discounts} from '../../utils/schema'
import connect from '../../utils/connection'
import type { NextApiRequest, NextApiResponse } from 'next';
import {getCsrfToken} from 'next-auth/react';
import {errorHandler,registerHandler} from '../../utils/emailHandlers';
import { registerString } from '../../utils/emailContent';
import saleDates from '../../utils/saleDates/saleDates';
export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    try{
        if(req.method==='POST'){
            if(!req.headers.csrftoken){
                var e = new Error('No csrf header found.')
                return res.status(500).json({success:false,error:e.toString()})
            }
            const csrftoken = await getCsrfToken({req:{headers:req.headers}})
            if(req.headers.csrftoken!==csrftoken){
                var e = new Error('CSRF authentication failed.')
                return res.status(500).json({success:false,error:e.toString()})
            }
            await connect()
            const body = JSON.parse(req.body);
            let user = await User().findOne({username:body.username})
            if (user){
                var e= new Error("User already exists")
                return res.status(500).json({success:false,error:e.toString()})
            }

            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    
            });
            const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
            const customer_id=await stripe.customers.create({
                email:body.username,
                name:body.name
            })
            body["stripeCustomerId"]=customer_id["id"]
            user = new (User() as any)(body);
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password,salt)
            user.subscriptions=[]
            const companyEmail=process.env.COMPANY_EMAIL
            await user.save()
            await ReceiveUpdates().findOneAndDelete({email:body.username})
            const nowDate = Date.now()
            if((+saleDates.countdownDate-nowDate<0)&&+saleDates.saleEndDate-nowDate>0){
                if(body.updates){
                    await registerHandler(body.username,user,process.env.WEBSITE_NAME,companyEmail,true)
                }
                else {

                    await registerHandler(body.username,user,process.env.WEBSITE_NAME,companyEmail,false)
                }
                
            }
            else {
                await registerHandler(body.username,user,process.env.WEBSITE_NAME,companyEmail,null)
            }
            
            return res.status(200).json({message: 'Registered successfully'})

        }
        else {
            var e= new Error('Only post requests for this route');
            return res.status(500).json({success:false,error:e.toString()})
        }

    }
    catch(e:any){
        
        console.error(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.toString(),false)
        return res.status(500).json({success:false,error:e.toString()})
    }

}
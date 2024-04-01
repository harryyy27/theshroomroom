import bcrypt from 'bcrypt';
import {User} from '../../utils/schema'
import connect from '../../utils/connection'
import type { NextApiRequest, NextApiResponse } from 'next';
import {getCsrfToken} from 'next-auth/react';
import {errorHandler,registerHandler} from '../../utils/emailHandlers';
import { registerString } from '../../utils/emailContent';
export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    try{
        if(req.method==='POST'){
            if(!req.headers.csrftoken){
                throw new Error('No csrf header found.')
            }
            const csrftoken = await getCsrfToken({req:{headers:req.headers}})
            if(req.headers.csrftoken!==csrftoken){
                throw new Error('CSRF authentication failed.')
            }
            await connect()
            const body = JSON.parse(req.body);
            let user = await User().findOne({username:body.username})
            if (user){
                throw new Error("User already exists")
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
            await registerHandler(body.username,user,process.env.WEBSITE_URL,companyEmail)
            res.status(200).json({message: 'Registered successfully'})

        }
        else {
            throw new Error('Only post requests for this route');
        }

    }
    catch(e:any){
        
        console.error(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.toString(),false)
        return res.status(500).json({success:false,error:e.toString()})
    }

}
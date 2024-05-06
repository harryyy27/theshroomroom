
import {User} from '../../utils/schema';
import {ReceiveUpdates} from '../../utils/schema';
import connect from '../../utils/connection';
import type { NextApiRequest, NextApiResponse } from 'next';
import {getCsrfToken} from 'next-auth/react';
import {errorHandler,receiveUpdatesHandler} from '../../utils/emailHandlers';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    
    try{
        if(req.method!=="PUT"&&req.method!=="POST"){
            var e= new Error('Not put request.')
            return res.status(500).json({success:false,error:e.toString()})
        }
        if(req.method==="POST"&&!req.headers.csrftoken){
            var e= new Error('No csrf header found.')
            return res.status(500).json({success:false,error:e.toString()})
        }
        const csrftoken = await getCsrfToken({req:{headers:req.headers}})
        if(req.headers.csrftoken!==csrftoken){
            var e= new Error('CSRF authentication failed.')
            return res.status(500).json({success:false,error:e.toString()})
        }
        await connect()

        const body = JSON.parse(req.body);
        const companyEmail=process.env.COMPANY_EMAIL
        if(body.subscription){
            if(body.user){
                    const user =await User().findOne({username:body.email})
                    if(!user){
                        const error= new Error('This user was not found')
                        return res.status(500).json({success:false,error:error.toString()})
                    }
                    await User().findOneAndUpdate({username:body.email},{updates:body.subscribe})
                    await receiveUpdatesHandler(body.email,true,process.env.WEBSITE_NAME,companyEmail)
            }
            else {
                let userExists = await User().findOne({username:body.email})
                if(userExists){
                    var error= new Error('A user with this email already exists, log in to subscribe')
                    return res.status(500).json({success:false,error:'A user with this email already exists, log in to subscribe'})
                }
                const existsSubscribe = await ReceiveUpdates().findOne({email:body.email})
                if(existsSubscribe){
                    var error= new Error('A user with this email is already subscribed')
                    return res.status(500).json({success:false,error:'A user with this email is already subscribed'})
                }
                var subscription = new (ReceiveUpdates() as any)(body);
                await subscription.save()

                await receiveUpdatesHandler(body.email,false,process.env.WEBSITE_NAME,companyEmail)
            }
        }
        else{
            const messageToClient=await User().findOneAndUpdate({username:body.username},{...body})
            if(!messageToClient){
                const error= new Error('Computer says no')
                return res.status(500).json({success:false,error:error.toString()})
            }


        }
        return res.status(200).json({success:true})
        

    }
    catch(e:any){
        console.error(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.toString(),false)
        return res.status(500).json({success:false,error:e.toString()})
    }
}
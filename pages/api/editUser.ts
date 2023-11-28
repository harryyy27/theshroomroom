
import {User} from '../../utils/schema'
import {Subscription} from '../../utils/schema'
import connect from '../../utils/connection'
import type { NextApiRequest, NextApiResponse } from 'next';
import {getCsrfToken} from 'next-auth/react';
import errorHandler from '../../utils/errorHandler'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    
    try{
        if(req.method!=="PUT"&&req.method!=="POST"){
            throw new Error('Not put request.')
        }
        if(req.method==="POST"&&!req.headers.csrftoken){
            throw new Error('No csrf header found.')
        }
        const csrftoken = await getCsrfToken({req:{headers:req.headers}})
        if(req.headers.csrftoken!==csrftoken){
            throw new Error('CSRF authentication failed.')
        }
        await connect()

        const body = JSON.parse(req.body);
        if(body.subscription){
            if(body.user){
                    const user =await User().findOne({username:body.email})
                    const use = await User().findOneAndUpdate({username:body.email},{updates:body.subscribe})
            }
            else {
                let userExists = await User().findOne({username:body.email})
                if(userExists){
                    var error= new Error('A user with this email already exists, log in to subscribe')
                    error.cause="user_error"
                    throw error;
                }
                const existsSubscribe = await Subscription().findOne({email:body.email})
                if(existsSubscribe){
                    var error= new Error('A user with this email is already subscribed')
                    error.cause="user_error"
                    throw error
                }
                var subscription = new (Subscription() as any)(body);
                subscription.save()
            }
        }
        else{
            console.log('yeeeeeeee')
            console.log('uhhhhhhh')
            console.log(body.cart.items)
            const messageToClient=await User().findOneAndUpdate({username:body.username},{...body})
            console.log(messageToClient.cart.items)
            let userExists = await User().findOne({username:body.username})
            console.log(userExists.cart.items)


        }
        return res.status(200).json({message:"User successfully updated"})
        

    }
    catch(e:any){
        if(e.cause){
            res.status(500).json({error:e.message})

        }
        else{
            await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.errorMessage,e.stack,false)
            res.status(500).json({error:"Something has gone wrong and we are working to fix this. Sorry for any inconvenience caused."})
        }
        

    }
}
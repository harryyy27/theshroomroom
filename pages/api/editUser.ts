
import {User} from '../../utils/schema'
import connect from '../../utils/connection'
import type { NextApiRequest, NextApiResponse } from 'next';
import {getCsrfToken} from 'next-auth/react';
import errorHandler from '../../utils/errorHandler'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        if(req.method!=="PUT"){
            throw new Error('Not put request.')
        }
        if(!req.headers.csrftoken){
            throw new Error('No csrf header found.')
        }
        const csrftoken = await getCsrfToken({req})
        if(req.headers.csrftoken!==csrftoken){
            throw new Error('CSRF authentication failed.')
        }
        await connect()
        const body = JSON.parse(req.body);
        const messageToClient=await User().findOneAndUpdate({username:body.username},{...body})
        res.status(200).json({message:"User successfully updated"})

    }
    catch(e:any){
        console.log(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.error,e.stack,false)

        res.status(500).json({error:e.message})
    }
}
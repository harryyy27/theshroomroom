import {User,PasswordResetToken} from '../../utils/schema'
import connect from '../../utils/connection'
import type { NextApiRequest, NextApiResponse } from 'next';
import {getCsrfToken} from 'next-auth/react';
import {errorHandler} from '../../utils/emailHandlers';
import bcrypt from 'bcrypt';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        if(req.method!=="PUT"){
            var e=new Error('Not post request.')
            return res.status(500).json({success:false,error:e.toString()})
        }
        if(!req.headers.csrftoken){
            var e= new Error('No csrf header found.')
            return res.status(500).json({success:false,error:e.toString()})
        }
        const csrftoken = await getCsrfToken({req:{headers:req.headers}})
        if(req.headers.csrftoken!==csrftoken){
            var e = new Error('CSRF authentication failed.')
            return res.status(500).json({success:false,error:e.toString()})
        }
        
        
        await connect()
        const body = JSON.parse(req.body);
        const messageToClient=await User().findOne({username:body.username})
        if(messageToClient){
            const token= await PasswordResetToken().findOneAndDelete({passwordResetToken:body.passwordResetToken,userId:messageToClient._id})
            if(!token){
                res.status(403).json({message:"Unauthorised attempt to change password"})
            }
            else {
                const salt = await bcrypt.genSalt(10);
                const newPassword = await bcrypt.hash(body.password,salt)
                await User().findOneAndUpdate({
                    username:body.username
                },{
                    password: newPassword
                })
                res.status(200).json({message:"Password changed."})
            }
        }
        else {
            res.status(400).json({error:"User does not exist."})
        }

    }
    catch(e:any){
        
        console.error(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.toString(),false)
        return res.status(500).json({success:false,error:e.toString()})
    }
}
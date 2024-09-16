import connect from '../../utils/connection';
import {Product,Discounts} from '../../utils/schema';
import {NextApiRequest,NextApiResponse} from 'next'
import {getCsrfToken} from 'next-auth/react';
import {errorHandler} from '../../utils/emailHandlers'
import {getServerSession} from 'next-auth'
import {authOptions} from './auth/[...nextauth]'
import mongoose from 'mongoose'



async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        await connect()

        if(req.method!=='GET'){
            if(!req.headers.csrftoken){
                var e=new Error('No csrf header found.')
                return res.status(500).json({success:false,error:e.toString()})
            }
            const csrftoken = await getCsrfToken({req:{headers:req.headers}})
            if(req.headers.csrftoken!==csrftoken){
                var e= new Error('CSRF authentication failed.')
                return res.status(500).json({success:false,error:e.toString()})
            }
        }
        if(req.method==="GET"){
            if(req.url?.includes('?id=')){
                const id =req.url.split('id=')[1].split('&postcode=')[0]
                const postcode=req.url.split('postcode=')[1].split('&email=')[0]
                const email=req.url.split('email=')[1]
                const discount = await Discounts().findOne({_id:id})
                const {codesAvailable,expiryDate,startDate}=discount
                if(codesAvailable<=0){
                    return res.status(202).json({success:false,error:"No codes available"})
                }
                else if(+new Date(startDate as Date)-Date.now()>0){
                    return res.status(202).json({success:false,error:"This code has not yet started"})
                }
                else if(+new Date(expiryDate as Date)-Date.now()<0){
                    return res.status(202).json({success:false,error:"This code is no longer available"})
                }
                else {
                    return res.status(200).json({success:true})
                }
            }
            else if(req.url?.includes('?codeName')){
                const codeName=req.url.split('?codeName=')[1].split('&postcode=')[0]
                const postcode=req.url.split('postcode=')[1].split('&email=')[0]
                const email=req.url.split('email=')[1].replace('%40','@')
                const discount = await Discounts().findOne({codeName:codeName})
                const discounts = await Discounts().find({})
                if(!discount){
                    return res.status(400).json({success:false, error:"Code not found"})
                }
                if(!discount.users.every((el:any)=>{
                    return el.email.trim()!==email.trim()
                })){
                    return res.status(202).json({success:false,error:"Code already claimed."})
                }
                const {codesAvailable,expiryDate,startDate,_id}=discount
                if(codesAvailable<=0){
                    return res.status(202).json({success:false,error:"No codes available"})
                }
                else if(+new Date(startDate as Date)-Date.now()>0){
                    return res.status(202).json({success:false,error:"This code has not yet started"})
                }
                else if(+new Date(expiryDate as Date)-Date.now()<0){
                    return res.status(202).json({success:false,error:"This code is no longer available"})
                }
                else {
                    return res.status(200).json({success:true,discountId:_id})
                }
            }
            else{
                const discounts = await Discounts().find({})
                return res.status(500).json({success:false})

            }
        }
        else if(req.method==="PUT"){
            const body = JSON.parse(req.body)
            await Discounts().findOneAndUpdate({_id:body.discountId},{$inc:{codes_available:1},$pull:{users:{email:body.email}}})
            return res.status(200).json({success:true})
        }
        
        else {
            return res.status(404).json({success:false,error:"Unknown method"})
        }

    }
    catch(e:any){
        console.error(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.toString(),false)
        return res.status(500).json({success:false,error:e.toString(),transactionFailure:e.cause==="transaction"?true:false})
    }

}
export default handler
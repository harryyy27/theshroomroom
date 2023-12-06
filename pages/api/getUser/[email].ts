import {User} from '../../../utils/schema'
import connect from '../../../utils/connection'
import type { NextApiRequest, NextApiResponse } from 'next';
import {errorHandler} from '../../../utils/emailHandlers';
export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    try{
        if(req.method!=="GET"){
            throw new Error('Not GET request.')
        }
        if(!req.url){
            throw new Error('No req url.')
        }
        if(req.url.split('/').length<=3){
            throw new Error('Url split error.')
        }
        await connect()
        const email = req.url.split('/')[3]
        let user = await User().findOne({username:email})
        res.status(200).json({user})
    
        

    }
    catch(e:any){
        
        console.error(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.toString(),false)
        return res.status(500).json({success:false,error:e.toString()})
    }
}
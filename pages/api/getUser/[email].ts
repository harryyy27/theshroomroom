import {User} from '../../../utils/schema'
import connect from '../../../utils/connection'
import type { NextApiRequest, NextApiResponse } from 'next';
import errorHandler from '../../../utils/errorHandler';
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
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.error,e.stack,false)
        res.status(500).json({error:e.message})
    }
}
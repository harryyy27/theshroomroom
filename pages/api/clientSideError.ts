import {errorHandler} from '../../utils/emailHandlers'
import {NextApiRequest,NextApiResponse} from 'next'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,JSON.parse(req.body).toString(),true)
        res.status(200).json({
            success:true
        })
    }
    catch(e:any){
        
        console.error(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.toString(),false)
        return res.status(500).json({success:false,error:e.toString()})
    }
}
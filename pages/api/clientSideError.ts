import errorHandler from '../../utils/errorHandler'
import {NextApiRequest,NextApiResponse} from 'next'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    console.log('OI')
    try{
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,JSON.parse(req.body).error,JSON.parse(req.body).stack,true)
        res.status(200).json({
            success:true
        })
    }
    catch(e:any){
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.error,e.stack,false)
        res.status(500).json({
            success:false
        })
    }
}
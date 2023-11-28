import connect from '../../utils/connection';
import {User} from '../../utils/schema';
import {NextApiRequest,NextApiResponse} from 'next';
import {getCsrfToken} from 'next-auth/react';
import errorHandler from '../../utils/errorHandler'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        console.log('yoyoyoyo')
        if(req.method!=="DELETE"){
            throw new Error('Not delete request.')
        }
        console.log('errr')
        if(!req.headers.csrftoken){
            throw new Error('No csrf header found.')
        }
        console.log('yepyepypeyp')
        const csrfClient=req.headers.csrftoken;
        const csrfServer = await getCsrfToken({req:{headers:req.headers}});
        if(csrfClient !== csrfServer){
            throw new Error('CSRF authentication failed.')
        }
        console.log('errrrrrrrr')
        const email = JSON.parse(req.body)
        const emailStr=email.email
        await connect()
        const deleted = await User().deleteOne({username:emailStr})
        return res.status(200).json({message:"Successfully deleted account"})

    }
    catch(e:any){
        console.log(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.message,e.stack,false)

        res.status(500).json({error:e.message})
    }



    
}
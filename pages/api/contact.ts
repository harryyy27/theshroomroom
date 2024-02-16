import {errorHandler} from '../../utils/emailHandlers'
import {NextApiRequest,NextApiResponse} from 'next'
import { getCsrfToken } from 'next-auth/react'
import { sendEmail } from '../../utils/nodemailer'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        if(req.method==='POST'){
            if(!req.headers.csrftoken){
                throw new Error('No csrf header found.')
            }
            const csrftoken = await getCsrfToken({req:{headers:req.headers}})
            if(req.headers.csrftoken!==csrftoken){
                throw new Error('CSRF authentication failed.')
            }
            
            const body = JSON.parse(req.body);

            await sendEmail({
                        subject: `Email from ${body.name}`,
                        text:body.textContent,
                        to:process.env.COMPANY_EMAIL,
                        from:body.email
            })
            res.status(200).json({success: true})
        }
        else {
            throw new Error('Only post requests for this route');
        }
    }
    catch(e:any){
        
        console.error(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.toString(),false)
        return res.status(500).json({success:false,error:e.toString()})
    }
}
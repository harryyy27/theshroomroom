import connect from '../../utils/connection';
import {User} from '../../utils/schema';
import {NextApiRequest,NextApiResponse} from 'next';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        const email = JSON.parse(req.body)
        const emailStr=email.email
        console.log(emailStr)
        await connect()
        const deleted = await User.deleteOne({username:emailStr})
        console.log(deleted)
        res.json({message:"Successfully deleted account"})

    }
    catch(e){
        res.json({error:"Could not delete account"})
    }



    
}
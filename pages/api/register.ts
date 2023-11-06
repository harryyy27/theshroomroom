import bcrypt from 'bcrypt';
import {User} from '../../utils/schema'
import connect from '../../utils/connection'
import type { NextApiRequest, NextApiResponse } from 'next';
import {getCsrfToken} from 'next-auth/react';
import errorHandler from '../../utils/errorHandler'
export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    try{
        if(req.method==='POST'){
            if(!req.headers.csrftoken){
                throw new Error('No csrf header found.')
            }
            console.log('here');
            const csrftoken = await getCsrfToken({req:{headers:req.headers}})
            console.log('there');
            if(req.headers.csrftoken!==csrftoken){
                throw new Error('CSRF authentication failed.')
            }
            console.log('everywhere')
            await connect()
            console.log('yo')
            const body = JSON.parse(req.body);
            console.log('when')
            let user = await User().findOne({username:body.username})
            console.log('are')
            if (user){
                throw new Error("User already exists")
            }
            console.log('you')
            user = new (User() as any)(body);
            console.log('going')
            const salt = await bcrypt.genSalt(10);
            console.log('to');
            user.password = await bcrypt.hash(user.password,salt)
            console.log('break');
            await user.save()
            console.log('yeeeee')
            res.status(200).json({message: 'Registered successfully'})

        }
        else {
            throw new Error('Only post requests for this route');
        }

    }
    catch(e:any){
        console.log(e.message)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.error,e.stack,false)

        res.status(500).json({error:e.message})
    }

}
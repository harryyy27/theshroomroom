import bcrypt from 'bcrypt';
import {User} from '../../utils/schema'
import connect from '../../utils/connection'
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    await connect()
    const body = JSON.parse(req.body);
    console.log(body)
    let user = await User.findOne({username:body.username})
    console.log(user)
    if (user){
        res.status(200).json({message:"This email is already register"})
        return
    }
    user = new User(body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt)
    await user.save()
    res.status(200).json({message: 'Registered successfully'})

}
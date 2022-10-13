
import {User} from '../../utils/schema'
import connect from '../../utils/connection'
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    await connect()
    const body = JSON.parse(req.body);
    console.log(body.cart.items)
    const messageToClient=await User.findOneAndUpdate({username:body.username},{...body})
    console.log(messageToClient)
    res.status(200).json({message:"User successfully updated"})
}
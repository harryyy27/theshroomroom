import {User} from '../../../utils/schema'
import connect from '../../../utils/connection'
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    await connect()
    const email = req.url.split('=')[1]
    console.log(email)
    let user = await User.findOne({username:email})
    res.status(200).json({user})
}
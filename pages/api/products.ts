import type { NextApiRequest, NextApiResponse } from 'next';
import {ResponseFuncs} from '../../utils/types';
import connect from '../../utils/connection'
import {Product} from '../../utils/schema'
type Data = {
    name: string;
    description: string;
    price: number;
}

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
    const catcher = (error: Error) => res.status(400).json({ error })

    const handleCase: ResponseFuncs = {
        // RESPONSE FOR GET REQUESTS
        GET: async (req: NextApiRequest, res: NextApiResponse) => {
          // connect to database
          await connect()
          res.json(await Product.find({}).catch(catcher))
        }
      }
    
      // Check if there is a response for the particular method, if so invoke it, if not response with an error
      const response = handleCase[method]
      console.log('oi')
      if (response){
        response(req,res)
        // return response(req, res)
      } 
      else res.status(400).json({ error: "No Response for This Request" })


}
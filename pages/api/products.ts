import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/connection'
import {Product} from '../../utils/schema';
import {errorHandler} from '../../utils/emailHandlers';
import {getCsrfToken} from 'next-auth/react'
type Data = {
    name: string;
    description: string;
    price: number;
}

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  try{
    if(req.method==='GET'){
    await connect()
    var response;
    if(RegExp('product=').test(req.url as string)===true){
      const product =req.url?.split('product=')[1].replaceAll('%27','\'').replaceAll('%20',' ')
      response = await Product().find({name:product})
    }
    else if(RegExp('type=').test(req.url as string)===true){
      response = await Product().find({"product_type":req.url?.split('type=')[1]},{})
    }
    else if(RegExp('stripe_product_id=').test(req.url as string)===true){
      response = await Product().findOne({"stripe_product_id":req.url?.split('stripe_product_id=')[1]},{})

    }
    else {
      response = await Product().find({})

    }
    
    if(!response){
      throw new Error('No products found.')
    }
    else {
      res.status(200).json(response)
    }
  }
  else if(req.method==='PUT'){
    if(!req.headers.csrftoken){
      throw new Error('No csrf header found.')
    }
    const csrftoken = await getCsrfToken({req:{headers:req.headers}})
    if(req.headers.csrftoken!==csrftoken){
        throw new Error('CSRF authentication failed.')
    }
    var body = JSON.parse(req.body);
    for(var i=0;i<body.products.items.length; i++){
      await Product().findOneAndUpdate({stripe_product_id:body.products.items[i].stripeProductId},{$inc:{stock_available:body.products.items[i].quantity}})
    }
    return res.status(200).json({success:true})
  }
  else {
    throw Error('Unhandled method')
  }

  }
  catch(e:any){
    
    console.error(e)
    await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.toString(),false)
    return res.status(500).json({success:false,error:e.toString()})

  }
}
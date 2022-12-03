import connect from '../../utils/connection';
import {Order, User} from '../../utils/schema';
import {NextApiRequest,NextApiResponse} from 'next'
import {getCsrfToken} from 'next-auth/react';
import errorHandler from '../../utils/errorHandler'

async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        await connect()
        console.log(req.method)
        if(req.method!=='GET'){
            if(!req.headers.csrftoken){
                throw new Error('No csrf header found.')
            }
            const csrftoken = await getCsrfToken({req})
            if(req.headers.csrftoken!==csrftoken){
                throw new Error('CSRF authentication failed.')
            }
        }
        if(req.method==='POST'){
            var body = JSON.parse(req.body);
            var order = new (Order())(body)
            order.dateOfPurchase= Date.now();
            var validated = await order.save()
            console.log('FEELING VALIDATEDDDD',validated)
            if(validated){
                console.log()
                return res.status(200).json({success:true})
            }
            else {
                throw new Error('Missing fields')

            }
        }
        else if(req.method==='GET'){
            if(req.url?.split('id=').length===1){
                throw new Error('No id provided')
            }
            const id = req.url?.split('id=')[1];
            const orders= await Order().find({userId:id}).exec()
            console.log("IDDD",id)
            console.log("ORDERRRRR",orders)
            return res.status(200).json({orders:orders})

        }
        else if(req.method==='PUT'){
            var body=JSON.parse(req.body);
            if(req.body.cancel){
                order = await Order().findOneAndUpdate({paymentIntentId:body.paymentIntentId,status:{$nin:["ORDER_DISPATCHED","ORDER_DELIVERED"]}},{...body.order})
            }
            else {
                
                order = await Order().findOneAndUpdate({paymentIntentId:body.paymentIntentId},{...body})
            }

            console.log(order)
            if(order){
                return res.status(200).json({success:true})
            }
            else {
                throw new Error(`No paymentIntentId available for this particular number. Payment intent ID: ${body.paymentIntentId}`)
            }
        }
        else if(req.method==='DELETE'){
            var body=JSON.parse(req.body);
            order = await Order().findOneAndUpdate({_id:body._id,status:!"ORDER_DISPATCHED"},{status:"REFUND_PENDING"})
            if(order){
                return res.status(200).json({success:true})
            }

            else {
                throw new Error(`No paymentIntentId available for this particular number. Payment intent ID: ${body.paymentIntentId}`)
            }
        }

    }
    catch(e:any){
        console.log(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.error,e.stack,false)

        res.status(500).json({success:false,error:e.message})
    }

}
export default handler
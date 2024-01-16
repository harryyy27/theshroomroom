import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import connect from "../../../utils/connection";
import {User,Product} from "../../../utils/schema";
import signInUser from "../../../utils/nextAuthUtils";
import {UserSchema} from '../../../utils/types'
import {Session} from 'next-auth';
import {errorHandler} from '../../../utils/emailHandlers';
export async function findUser(credentials:Record<string,string>|undefined):Promise<{user?:UserSchema,error?:string,password?:string}|undefined>{
    try{
        if(!credentials){
            throw new Error('Credentials not provided.')
        }
        if(!credentials.username){
            throw new Error('No username provided.')
        }
        if(!credentials.password){
            throw new Error('No password provided.')
        }
        const username= credentials?.username;
        const password = credentials?.password;
        const user = await User().findOne({username:username})
        if(user){
            return {user,password}
        }
        else {
            
            throw new Error("You haven't registered yet.")
        }

    }
    catch(e:any){
        return {
            error: e.toString()
        }
    }
}
export async function setupSession(session: Session){
    try{

        if(session&&session.user){
            await connect()
            var email=session.user.email
            var data = await User().findOne({username:email}).lean()
            session.user.name=data.name
            let stock_level_change=false;
            let newCart={
                items:[] as any
            }
            for(var i =0;i<data.cart.items.length;i++){
                let product = await Product().findOne({stripe_product_id:data.cart.items[i].stripeProductId})
                if(data.cart.items[i].stockAvailable!==product['stock_available']){
                    var newObj={...data.cart.items[i],stockAvailable:product['stock_available']}
                    stock_level_change=true
                    newCart.items.push(newObj)
                }
                else {
                    newCart.items.push({...data.cart.items[i]})
                }
            }
            if(stock_level_change){
                await User().findOneAndUpdate({username:email},{cart:newCart})
            }
            session.user.cart= newCart;
            session.user.id=data._id
            session.user.dAddress=data.dAddress
            session.user.bAddress=data.bAddress
            session.user.updates=data.updates
            session.user.stripeCustomerId=data.stripeCustomerId
            session.user.isActive=data.isActive
            session.user.subscriptions=data.subscriptions
        }

    }
    catch(e:any){
        console.error(e)

        await errorHandler('setupSession - next auth callbacks',JSON.stringify(session),'whatever session is',e.toString(),false)
        session.user.cart = {
            items:[]
        }

    }
    
    return session

}

export async function getUser(creds:{user?:UserSchema,error?:any,password?:string}|undefined){
    try{
        if(creds?.error){
            throw new Error(creds.error)
        }
        if(creds?.user&&creds?.password){
            var {user,password}=creds;
        }
        else {
            throw new Error('Creds wrong')
        }
        if(password&&user.password){
            const confirmedUser= await signInUser(user.password,password)
            if(confirmedUser){
                return {
                    email:user.username
                }
            }
            else {
                throw new Error("Sign in failed.")
            }

        }
        else {
            throw new Error("No password detected.")
        }
        

    }
    catch(e:any){
        return {
            error:e.toString()
        }
    }
}
export const authOptions={
    providers: [
        CredentialsProvider({
            name: "Credentials",
            authorize: async(credentials, req)=>{
                    await connect();
                    const creds = await findUser(credentials)
                    if(creds?.error){
                        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,creds.error,false)
                        throw new Error(creds.error)
                    }
                    const user = await (getUser(creds) as any)
                    if(user.error){
                        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,user.error,false)
                        throw new Error(user.error)
                    }
                    else {
                        return user
                    }

            },
            credentials: {
                username:{
                    label: "Username",
                    type: "text",
                    placeholder: "Enter username or email here"
                },
                password: {
                    label: "Password",
                    type: "password"
                }

            }
            

        })
        // GoogleProvider({
        //     clientId:
        //     clientSecret:
        // })
    ],
    pages:{
        signIn:"/auth/signin"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({session,user,token}:any){
            const sesh = await setupSession(session)
            return sesh
        }
    }
    
}
export default NextAuth(authOptions)


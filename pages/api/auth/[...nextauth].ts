import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import connect from "../../../utils/connection";
import {User} from "../../../utils/schema";
import signInUser from "../../../utils/nextAuthUtils";
import {UserSchema} from '../../../utils/types'
import {Session} from 'next-auth';
import ErrorHandler from '../../../utils/errorHandler';
export async function findUser(credentials:Record<string,string>|undefined):Promise<{user?:UserSchema,error?:any,stack?:any,password?:string}|undefined>{
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
            error:e.message,
            stack:e.stack
        }
    }
}
export async function setupSession(session: Session){
    try{
        if(session&&session.user){
            var email=session.user.email
            var data = await User().findOne({username:email})
            session.user.name=data.name
            session.user.cart= data.cart
            session.user.id=data._id
            session.user.dAddress=data.dAddress
            session.user.bAddress=data.bAddress
        }

    }
    catch(e:any){
        await ErrorHandler('next-auth-callback-headers',JSON.stringify(session),'GET',e.error,e.stack,false)


        session.user.cart = {
            items:[]
        }

    }
    
    return session

}

export async function getUser(creds:{user?:UserSchema,error?:any,stack?:any,password?:string}|undefined){
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
            error:e.message,
            stack:e.stack
        }
    }
}
export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            authorize: async(credentials, req)=>{
                    await connect();
                    console.log(credentials)
                    const creds = await findUser(credentials)
                    
                    const user = await (getUser(creds) as any)
                    if(user.error){
                        await ErrorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,user.error,user.stack,false)
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
        async session({session,user,token}){
            const sesh = await setupSession(session)
            return sesh
        }
    }
    
})


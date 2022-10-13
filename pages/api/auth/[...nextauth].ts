import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import connect from "../../../utils/connection";
import {User} from "../../../utils/schema";
import {Credentials} from "../../../utils/types"
import bcrypt from 'bcrypt';
export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials, req){
                await connect();
                const username= credentials.username;
                const password = credentials.password;
                const user = await User.findOne({username})
                console.log(user)
                console.log('yo')
                if(!user){
                    throw new Error("You haven't registered yet")
                }
                else {

                    const confirmedUser= await signInUser({user,password})
                    return confirmedUser
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
            console.log("session",session)
            console.log("user",user)
            console.log("token",token)
            if(session){
                var email=session.user.email
                var data = await User.findOne({email})
                session.user.cart= data.cart
            }
            else {
                session.user.cart = []
            }
            console.log(session)
            
            return session
        }
    }
    
})

const signInUser = async({user,password})=> {
    if(!password){
        throw new Error("Please enter password")
    }
    const isMatch = await bcrypt.compare(password,user.password)
    console.log('YO')
    if(!isMatch){
        throw new Error("Password incorrect")
    }
    user.email= user.username
    return user
}
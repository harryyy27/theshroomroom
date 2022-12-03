import {getSession} from 'next-auth/react'

export default async function authenticate(ctx:any,cb:any){
    const sesh = await getSession(ctx)
    if(!sesh){
        return {
            redirect: {
                destination:"/auth/signin",
                permanenet: false
            }
        }
    }
    return cb({sesh})
    
}
import {Errors} from './schema';
import {sendEmail} from './nodemailer';
import connect from './connection';

export default async function ErrorHandler(headers:string,body:string,method:string,message:string,stack:string,client:boolean){
    await connect()
    const error =  new (Errors() as any)({
        reqHeaders: headers,
        reqBody: body,
        reqMethod: method,
        errorMessage:message,
        callStack: stack,
        timestamp: Date.now()

    })
    console.log(error)
    // error.save()
    // sendEmail({
    //     subject: client?"Client Side Error":"Server Side Error",
    //     text:"New error mate",
    //     to:"theshroomroomdev@gmail.com",
    //     from: "ServerSideError@theshroomroomdev.com"
    // })

}
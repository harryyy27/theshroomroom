import {Errors} from './schema';
// import {Order,Subscription} from './types'
import {sendEmail} from './nodemailer';
import connect from './connection';
import {orderString,receiveUpdateString,subscriptionString,deleteAccountString,registerString,disputeString,invoiceFinalizationFailString,invoiceFailString} from './emailContent'

function template(content:string){
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Mega Mushrooms Order Confirmation</title>
    </head>
    <body style="background-color:#fff; text-align:center;">
    
      <!-- Header -->
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;" width="700">
        <tbody>
          <tr>
            <td colspan="3" style="height:20px;background-color:#eee;"></td>
          </tr>
          <tr>
            <td colspan="3" valign="bottom" style="text-align:center; padding:12px  0;">
              <a href="${process.env.WEBSITE_NAME}" style="display:block;width:260px;margin:0 auto;">
                <img src="${process.env.WEBSITE_NAME + "/_next/image?url=%2Flogo_small.jpg&w=48&q=75"}" alt="Mega Mushrooms Logo" border="0" style="float:left;" width="260" height="auto"><span style="font-size:18px">Mega Mushrooms</span>
              </a>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">&nbsp;</td>
            <td style="padding:10px 0 15px;">
              <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; text-align:left;" width="400">
                <tbody>
                  <tr>
                    <td valign="bottom" style="text-align:center; padding:0;">
                      <p><a href="${process.env.WEBSITE_NAME+"/products"}" style="color:#000;text-decoration: none;">Shop</a></p>
                    </td>
                    <td valign="bottom" style="text-align:center; padding:0;">
                        <p><a href="${process.env.WEBSITE_NAME}/auth/signin" style="color:#000;text-decoration: none;">My Account</a></p>
                    </td>
                    <td valign="bottom" style="text-align:center; padding:0;">
                        <p><a href="${process.env.WEBSITE_NAME}"style="color:#000;text-decoration: none;">Mega Mushrooms</a></p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td style="width:150px;">&nbsp;</td>
          </tr>
        </tbody>
      </table>
      <!-- End Header -->
    
    ${content}
      
    
      <!-- Footer -->
      <table cellspacing="0" cellpadding="0" style="border-collapse:collapse; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; margin-bottom:100px; text-align:left;width:700px;">
        <tbody>
          <tr>
            <td style="color:#000; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; padding:15px 30px 0;width:640px;">
              <p>Once again thank you for your interest in Mega Mushrooms and we look forward to you visiting our site soon. Kind regards,</p>
              <p style="margin:30px 0 0;"><a href="${process.env.WEBSITE_NAME}" style="color:#000; text-decoration:none;">Mega Mushrooms</a></p>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- End Footer -->
    
    </body>
    </html>`
}
export async function errorHandler(headers:string,body:string|undefined,method:string,message:string,client:boolean){
    await connect()
    const error =  new (Errors() as any)({
        reqHeaders: headers,
        reqBody: body,
        reqMethod: method,
        errorMessage:message,
        timestamp: Date.now()
    })
    // console.log(error)
    error.save()
    try{
        sendEmail({
            subject: client?"Client Side Error":"Server Side Error",
            text:"New error mate",
            to:"theshroomroomdev@gmail.com",
            from: "ServerSideError@theshroomroomdev.com"
        })

    }
    catch(e){
        console.log(e)
    }

}
export async function receiveUpdatesHandler(email:string,user:boolean){
    try{
        const content =receiveUpdateString(user,email)

        sendEmail({
            subject: "Thank you for subscribing to Mega Mushrooms!",
            html:template(content),
            to:`${email}`,
            from: `${process.env.COMPANY_EMAIL}`
        })

    }
    catch(e){
        console.log(e)
    }
    console.log('yepppp')

}
export async function orderHandler(order:any){
    try{
        const content = orderString(order)
        sendEmail({
            subject: `Mega Mushrooms - order`,
            html:template(content),
            to:`${order.email}`,
            from: `${process.env.COMPANY_EMAIL}`
        })

    }
    catch(e){
        console.log(e)
    }
    console.log('yepppp')

}
export async function subscriptionHandler(subscription:any){
    try{
        const content = subscriptionString(subscription);
        sendEmail({
            subject: `Subscription confirmation`,
            html:template(content),
            to:`${subscription.email}`,
            from: `${process.env.COMPANY_EMAIL}`
        })

    }
    catch(e){
        console.log(e)
    }
    console.log('yepppp')

}
export async function registerHandler(email:string,user:any){
    try{
        const content = registerString(user,email)
        sendEmail({
            subject: `Welcome to Mega Mushrooms`,
            html:template(content),
            to:email,
            from: `${process.env.COMPANY_EMAIL}`
        })

    }
    catch(e){
        console.log(e)
    }
    console.log('yepppp')

}
export async function deleteAccountHandler(email:string){
    try{
        const content = deleteAccountString();
        sendEmail({
            subject: "We are sorry to see you go",
            html: template(content),
            to: email,
            from: `${process.env.COMPANY_EMAIL}`
        })

    }
    catch(e){
        console.log(e)
    }
    console.log('yepppp')

}
export async function disputeHandler(object:any,status:string){
  try{
      const content = disputeString(object,status);
      sendEmail({
          subject: "New Dispute",
          html: template(content),
          to: `${process.env.COMPANY_EMAIL}`,
          from: `${process.env.COMPANY_EMAIL}`,
      })

  }
  catch(e){
      console.log(e)
  }
  console.log('yepppp')

}
export async function invoiceFailHandler(attemptCount:number,email:string,finalizationFailure:boolean){
  try{
    const content = invoiceFailString();
    sendEmail({
        subject: "Your subscription payment has failed",
        html: template(content),
        to: email,
        from: `${process.env.COMPANY_EMAIL}`
    })

}
catch(e){
    console.log(e)
}

}
export async function refundHandler(object:any){
  sendEmail({
      subject: `Refund status`,
      html: `<h1>refund status</h1>
        <p>refund status: ${object.status}</p>
        <p>refund id: ${object.id}</p>
      `,
      to: `${process.env.COMPANY_EMAIL}`,
      from: `${process.env.COMPANY_EMAIL}`,
  })

}
export async function payoutHandler(paid:boolean,obj:any){
  sendEmail({
      subject: `${paid?"Payout paid":"Payout failed"}`,
      html: `<h1>${paid?"PAYOUT PAID":"PAYOUT FAILED"} - ${obj.id}</h1>`,
      to: `${process.env.COMPANY_EMAIL}`,
      from: `${process.env.COMPANY_EMAIL}`,
  })
  
}

//payment_intent failed for some reason
//invoice for subscription failure
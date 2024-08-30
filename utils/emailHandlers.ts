import {Errors} from './schema';
// import {Order,Subscription} from './types'
import {sendEmail} from './nodemailer';
import {imageMap} from '../utils/imageMap/imageMap';
import connect from './connection';
import {orderString,receiveUpdateString,subscriptionString,deleteAccountString,registerString,disputeString,invoiceFinalizationFailString,invoiceFailString} from './emailContent'
import saleDates from './saleDates/saleDates';
function template(content:string,websiteName:string|undefined){
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
          <tr style="white-space:nowrap;width:700px;display:block;">
            <td style="display:inline-block;width:200px; height:1rem"></td>
            <td colspan="1" valign="center" style="text-align:center; padding:12px  0;display:inline-block;width:50px;margin-left:auto;position:relative;right:-10px">
              <a href="${websiteName}" style="display:block;margin-left:auto;position:relative;right:-80px;">
                <img src="${websiteName+'/_next/image?url=%2Flogo_small.jpg&w=48&q=75'}" />
              </a>
            </td>
            <td colspan="1" valign="center" style="text-align:center; display:inline-block;padding:12px  0;">
              <a href="${websiteName}" style="text-decoration:none !important;text-decoration:none;display:block;width:250px;margin:0 auto;color:#943201">
                <h1 style="font-size:24px">Mega Mushrooms</h1>
              </a>
            </td>
            <td style="display:inline-block;height:1rem;width:200px"></td>
          </tr>
          <tr style="white-space:nowrap;width:700px;display:block;">
            <td style="width:150px;">&nbsp;</td>
            <td style="padding:10px 0 15px;">
              <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; text-align:left;" width="400">
                <tbody>
                  <tr>
                    <td valign="bottom" style="text-align:center; padding:0;width:133px;">
                      <p><a href="${websiteName+"/products"}" style="color:#943201";text-decoration: none;">Shop</a></p>
                    </td>
                    <td valign="bottom" style="text-align:center; padding:0;width:133px;">
                        <p><a href="${websiteName}/auth/signin" style="color:#943201";text-decoration: none;">My Account</a></p>
                    </td>
                    <td valign="bottom" style="text-align:center; padding:0;width:133px;">
                        <p><a href="${websiteName}"style="color:#943201";text-decoration: none;">Mega Mushrooms</a></p>
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
      <table cellspacing="0" cellpadding="0" style="border-collapse:collapse; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; margin-bottom:100px; text-align:left;width:700px;color:#343434;">
        <tbody>
          <tr>
            <td style="color:#343434; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; padding:15px 30px 0;width:640px;">
              <p>Once again thank you for your interest in Mega Mushrooms and we look forward to you visiting our site soon. Kind regards,</p>
              <p style="margin:30px 0 0;"><a href="${websiteName}" style="; text-decoration:none;color#943201;">Mega Mushrooms</a></p>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- End Footer -->
    
    </body>
    </html>`
}
function discountCodeHtmlTemplate(discountCode:string) {
  return `

    <table cellspacing="0" cellpadding="0" style="border-collapse:collapse; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; margin-bottom:100px; text-align:left;width:700px;color:#343434;">
        <tbody>
          <tr>

            <td style="width:150px;">&nbsp;</td>
          </tr>
          <tr>
            <td style="color:#343434; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; padding:15px 30px 0;width:640px;">
              <p>Thank you for joining our mailing list!</p>
              <p>Your discount code is ${discountCode}</p>
              <p>Happy spending!</p>
            </td>
          </tr>
          <tr>

            <td style="width:150px;">&nbsp;</td>
          </tr>
        </tbody>
      </table>
  `
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
    await error.save()
    // try{
    //     sendEmail({
    //         subject: client?"Client Side Error":"Server Side Error",
    //         text:"New error mate",
    //         to:"theshroomroomdev@gmail.com",
    //         from: "ServerSideError@theshroomroomdev.com"
    //     })

    // }
    // catch(e){
    //     console.log(e)
    // }

}

export async function receiveUpdatesHandler(email:string,user:boolean,websiteName:string|undefined,companyEmail:string|undefined){
    try{
      // await connect()
      // const discount = await Discounts().findOne({_id:})
      // const todayDate = Date.now()
      // let discountCodeHtml = ''
      // if(+saleDates.countdownDate - +todayDate<0 && +saleDates.saleEndDate-todayDate>0){
      //   discountCodeHtml+=discountCodeHtmlTemplate()
      // }
        const content =receiveUpdateString(user,email)
        await sendEmail({
            subject: "Thank you for subscribing to Mega Mushrooms!",
            html:template(content,websiteName),
            to:`${email}`,
            from: `${companyEmail}`,
            // attachments:[
            //   {
            //     filename:'logo_small.jpg',
            //     path:process.cwd()+'/public/logo_small.jpg',
            //     cid:'logo',
            //   }
            // ]
        })

    }
    catch(e){
        console.log(e)
    }

}
export async function orderHandler(order:any,websiteName:string|undefined,companyEmail:string|undefined,trustPilotEmail:string|undefined){
    try{
        const content = orderString(order)
        // const imageAttach = [
        //   {
        //     filename:'logo_small.jpg',
        //     path:process.cwd()+'/public/logo_small.jpg',
        //     cid:'logo',
        //   }]
        
        await sendEmail({
            subject: `Mega Mushrooms - order`,
            html:template(content,websiteName),
            to:`${order.email}`,
            from: `${companyEmail}`,
            // bcc: `${trustPilotEmail}`
        })

    }
    catch(e){
        console.log(e)
    }

}
export async function subscriptionHandler(subscription:any,websiteName:string|undefined,companyEmail:string|undefined,renewal:boolean){
    try{
        const content = subscriptionString(subscription,renewal);
        
        await sendEmail({
            subject: `Subscription confirmation`,
            html:template(content,websiteName),
            to:`${subscription.email}`,
            from: `${companyEmail}`,
            // attachments:imageAttach
        })

    }
    catch(e){
        console.log(e)
    }

}
export async function registerHandler(email:string,user:any,websiteName:string|undefined,companyEmail:string|undefined){
    try{
        const content = registerString(user,email)
        await sendEmail({
            subject: `Welcome to Mega Mushrooms`,
            html:template(content,websiteName),
            to:email,
            from: `${companyEmail}`,
        })

    }
    catch(e){
        console.log(e)
    }

}
export async function deleteAccountHandler(email:string,websiteName:string|undefined,companyEmail:string|undefined){
    try{
        const content = deleteAccountString();
        await sendEmail({
            subject: "We are sorry to see you go",
            html: template(content,websiteName),
            to: email,
            from: `${companyEmail}`,
        })

    }
    catch(e){
        console.log(e)
    }

}
export async function disputeHandler(object:any,status:string,websiteName:string|undefined,companyEmail:string|undefined){
  try{
      const content = disputeString(object,status);
      await sendEmail({
          subject: "New Dispute",
          html: template(content,websiteName),
          to: `${companyEmail}`,
          from: `${companyEmail}`,
      })

  }
  catch(e){
      console.log(e)
  }

}
export async function invoiceFailHandler(attemptCount:number,email:string,finalizationFailure:boolean,websiteName:string|undefined,companyEmail:string|undefined){
  try{
    const content = invoiceFailString();
    await sendEmail({
        subject: "Your subscription payment has failed",
        html: template(content,websiteName),
        to: email,
        from: `${companyEmail}`,
    })

}
catch(e){
    console.log(e)
}

}
export async function refundHandler(object:any,companyEmail:string|undefined){
  await sendEmail({
      subject: `Refund status`,
      html: `<h1>refund status</h1>
        <p>refund status: ${object.status}</p>
        <p>refund id: ${object.id}</p>
      `,
      to: `${companyEmail}`,
      from: `${companyEmail}`,
  })

}
export async function payoutHandler(paid:boolean,obj:any,companyEmail:string|undefined){
  await sendEmail({
      subject: `${paid?"Payout paid":"Payout failed"}`,
      html: `<h1>${paid?"PAYOUT PAID":"PAYOUT FAILED"} - ${obj.id}</h1>`,
      to: `${companyEmail}`,
      from: `${companyEmail}`,
  })
  
}

//payment_intent failed for some reason
//invoice for subscription failure
import {Product} from './types'
import {imageMap} from './imageMap/imageMap'
export function orderString(order:any){
    return `
        <!-- Content -->
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; text-align:left; border-width: 1px; border-color:#ddd; border-style:solid;color:#343434;" width="700">
          <tbody>
            <tr>
              <td style="padding:30px;width:640px;background-color:#FFF;color:#343434; font-size:36px; font-weight:normal;">Order Confirmation</td>
            </tr>
            <tr>
            <tr>
              <td style="padding:15px 30px;width:640px;background-color:#FFF;">
                <p>Dear ${order.bAddress.firstName + " " + order.bAddress.surname} </p>
                <p style="margin:0;">Thank you for placing an order with Mega Mushrooms.</p>
                <p style="margin:0;">Your order number is ${order._id}, placed ${order.dateOfPurchase}.</p>
                <p style="margin:0;">Your order details are below.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:15px 30px;width:640px;background-color:#FFF;">
      
      
                  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; text-align:left;" width="640">
                    <tbody>
                      <tr>
                        <td style="width:640px;background-color:#FFF;">
                          <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;" width="640">
                            <tbody>
                              <tr>
                                <td style="width:640px; border-bottom:1px solid #ddd;"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="width:640px;color:#343434;"; font-size:24px; font-weight:normal;">Your order will be delivered to:</td>
                      </tr>
                    </tbody>
                  </table>
      
                  <table cellspacing="0" cellpadding="0" style="border-collapse:collapse; font-size:14px; text-align:left;color:#343434;" width="640">
                    <tbody>
                        <td style="background-color:#FFF;font-size:14px">
                          <p>
                          <br>
                            ${order.dAddress.firstName+' '+ order.dAddress.surname},<br>
                            ${order.dAddress.firstLine},<br>
                            ${order.dAddress.secondLine?order.dAddress.secondLine+',<br/>':''}
                            ${order.dAddress.city},<br>
                            ${order.dAddress.postcode},<br>
                            ${order.dAddress.phoneNumber},<br>
                            United Kingdom
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
      
                <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; text-align:left;" width="640">
                  <tbody>
                    <tr>
                      <td style="width:640px;background-color:#FFF;">
                        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;" width="640">
                          <tbody>
                            <tr>
                              <td style="width:640px; border-bottom:1px solid #ddd;"></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="width:640px;color:#343434;"; font-size:24px; font-weight:normal;">You ordered:</td>
                    </tr>
                  </tbody>
                </table>
      
                
      
                <table border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; color:#343434;  font-size:14px; text-align:left;" width="640">
                  <!-- start items loop -->
                  <thead>
                    <tr>
                      <th scope="col" style="width:65px;"></th>
                      <th scope="col" style="color:#343434; font-size:14px; text-align:left;">Item</th>
                      <th scope="col" style="width:40px; color:#343434; font-size:14px; text-align:center;">Qty</th>
                      <th scope="col" style="width:100px; color:#343434; font-size:14px; text-align:right;">Price</th>
                      <th scope="col" style="width:100px; color:#343434; font-size:14px; text-align:right;">Status</th>
                    </tr>
                  </thead>
                  <tbody style="color:#343434;">
                    <!--  Start of order items list-->
                    ${
                        order.products.items.map(({_id,name,quantity,price,fresh,size,stripeProductId,stripeId}:Product,idx:number)=>{
                            return`
                                    <tr>
                                    <td class="image" style="text-align:left; padding:20px 10px 20px 0; vertical-align:top;">
                                    </td>
                                    <td style="text-align:left; padding:20px 10px; vertical-align:top;">
                                    <a style="color:#943201;"href="${process.env.WEBSITE_NAME}/products/${name.replace(/[\s]/gi,'-')}">${fresh?"Fresh ":"Dry "}${name}${` ${size}`}</a>
                                        <!-- Variants -->
                                    </td>
                                    <td style="text-align:center; padding:20px 10px; vertical-align:top;color:#343434;">${quantity}</td>
                                    <td style="text-align:right; padding:20px 10px; vertical-align:top;color:#343434;">£${price*quantity}</td>
                                    </tr>
                                    `
                    })}
                    <!--  End of order items list -->
                    <tr>
                      <td colspan="2" style="padding:7px 10px 7px 20px;"><strong>Subtotal</strong></td>
                      <td></td>
                      <td style="padding:7px 10px 7px 20px; text-align:right;"><strong>£${order.products.items.reduce((acc:number,el:any)=>acc+el.price,0)}</strong></td>
                    </tr>
                  </tbody>
                  <!-- end items loop -->
                </table>
      
                <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; text-align:left;color:#343434;" width="640">
                  <tbody>
                    <tr>
                      <td style="width:640px;background-color:#FFF;">
                        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;" width="640">
                          <tbody>
                            <tr>
                              <td style="width:640px; border-bottom:1px solid #ddd;"></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="width:640px; font-size:24px; font-weight:normal;">Order Summary</td>
                    </tr>
                  </tbody>
                </table>
      
                <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; color:#343434;  font-size:14px; text-align:left;" width="700">
                  <!-- start totals -->
                  <tbody>
                    <tr>
                      <th style="width:320px;text-align:left; font-weight:normal; padding:15px 0;background-color:#fff;">Subtotal</th>
                      <td style="width:320px;padding:15px 0; text-align:right;background-color:#fff;">£${order.products.items.reduce((acc:number,el:any)=>acc+el.price,0)}</td>
                    </tr>
                    <tr>
                      <th style="width:320px;text-align:left; font-weight:normal; padding:15px 0;background-color:#fff;">Delivery:</th>
                      <td style="width:320px;padding:15px 0;text-align:right;background-color:#fff;">£${order.shippingCost}</td>
                    </tr>
                    <tr>
                      <th style="width:320px; color:#343434; text-align:left; font-weight:bold;  padding:15px 0;">Total</th>
                      <td style="width:320px; color:#343434; padding:15px 0; text-align:right; font-weight:bold;">£${order.shippingCost+order.products.items.reduce((acc:number,el:any)=>acc+el.price,0)}</td>
                    </tr>
                  </tbody>
                  <!-- end totals -->
                </table>
      
              </td>
            </tr>
          </tbody>
        </table>
        <!-- End Content -->`
}
export function receiveUpdateString(user:any,email:string){
    return `
    <!-- Content -->
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; text-align:left; border-width: 1px; border-color:#ddd; border-style:solid;color:#343434;" width="700">
      <tbody>
        <tr>
          <td style="padding:30px;width:640px;background-color:#FFF;color:#343434; font-size:36px; font-weight:normal;">Welcome to Mega Mushrooms!</td>
        </tr>
        <tr>
        <tr>
          <td style="padding:15px 30px;width:640px;background-color:#FFF;">
            <p>We are pleased you have chosen to join our mailing list.</p>
            <p style="margin:0;">We will update you in the event that any new products, offers or site updates you should be made aware of.</p>
            <p style="margin:0;">In the mean time, you are welcome to browse our current range of <a style="color:#943201;"href=\"${process.env.WEBSITE_NAME}/products\">products</a></p>
            
            <p style="margin:0;">No longer wish to receive emails from Mega Mushrooms?</p><p><a style="color:#943201;" href="${process.env.WEBSITE_NAME}/${user?"edit":`unsubscribe?email=${email}`}">Unsubscribe</a></p>
          </td>
        </tr>
    </tbody>
    </table>`
}
export function subscriptionString(subscription:any){
    return `
        <!-- Content -->
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; text-align:left; border-width: 1px; border-color:#ddd; border-style:solid;color:#343434;" width="700">
          <tbody>
            <tr>
              <td style="padding:30px;width:640px;background-color:#FFF;color:#343434; font-size:36px; font-weight:normal;">Subscription Confirmation</td>
            </tr>
            <tr>
            <tr>
              <td style="padding:15px 30px;width:640px;background-color:#FFF;">
                <p>Dear ${subscription.bAddress.firstName + " " + subscription.bAddress.surname} </p>
                <p style="margin:0;">Thank you for placing starting a ${subscription.interval}ly subscription with Mega Mushrooms.</p>
                <p style="margin:0;">Your subscription id is ${subscription.subscriptionId}, placed ${subscription.dateOfPurchase}.</p>
                
                <p style="margin:0;">Your order details are below.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:15px 30px;width:640px;background-color:#FFF;">
      
      
                  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; text-align:left;" width="640">
                    <tbody>
                      <tr>
                        <td style="width:640px;background-color:#FFF;">
                          <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;" width="640">
                            <tbody>
                              <tr>
                                <td style="width:640px; border-bottom:1px solid #ddd;"></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="width:640px; font-size:24px; font-weight:normal;">Your order will be delivered to:</td>
                      </tr>
                    </tbody>
                  </table>
      
                  <table cellspacing="0" cellpadding="0" style="border-collapse:collapse; font-size:14px; text-align:left;color:#343434;" width="640">
                    <tbody>
                        <td style="background-color:#FFF;font-size:14px">
                          <p>
                          <br>
                            ${subscription.dAddress.firstName+' '+ subscription.dAddress.surname},<br>
                            ${subscription.dAddress.firstLine},<br>
                            ${subscription.dAddress.secondLine?subscription.dAddress.secondLine:''},<br>
                            ${subscription.dAddress.city},<br>
                            ${subscription.dAddress.postcode},<br>
                            ${subscription.dAddress.phoneNumber},<br>
                            United Kingdom
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
      
                <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; text-align:left;color:#343434;" width="640">
                  <tbody>
                    <tr>
                      <td style="width:640px;background-color:#FFF;">
                        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;" width="640">
                          <tbody>
                            <tr>
                              <td style="width:640px; border-bottom:1px solid #ddd;"></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
      
                
      
                <table border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; color:#343434;  font-size:14px; text-align:left;" width="640">
                  <!-- start items loop -->
                  <thead>
                    <tr>
                      <th scope="col" style="width:65px;"></th>
                      <th scope="col" style="font-size:14px; text-align:left;">Item</th>
                      <th scope="col" style="width:40px; font-size:14px; text-align:center;">Qty</th>
                      <th scope="col" style="width:100px; font-size:14px; text-align:right;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!--  Start of order items list-->
                    ${
                        subscription.products.items.map(({_id,name,quantity,price,fresh,size,stripeProductId,stripeId}:Product,idx:number)=>{
                            return`
                                    <tr>
                                    <td style="text-align:left; padding:20px 10px; vertical-align:top;">
                                    ${fresh?"Fresh ":"Dry "}${name}${` ${size}`}
                                        <!-- Variants -->
                                    </td>
                                    <td style="text-align:center; padding:20px 10px; vertical-align:top;">${quantity}</td>
                                    <td style="text-align:right; padding:20px 10px; vertical-align:top;">£${price*quantity}</td>
                                    </tr>
                                    `
                    })}
                    <!--  End of order items list -->
                    <tr>
                      <td colspan="2" style="padding:7px 10px 7px 20px;"><strong>Subtotal</strong></td>
                      <td></td>
                      <td style="padding:7px 10px 7px 20px; text-align:right;"><strong>£${subscription.products.items.reduce((acc:number,el:any)=>acc+el.price,0)}</strong></td>
                    </tr>
                  </tbody>
                  <!-- end items loop -->
                </table>
      
                <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; text-align:left;color:#343434;" width="640">
                  <tbody>
                    <tr>
                      <td style="width:640px;background-color:#FFF;">
                        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;" width="640">
                          <tbody>
                            <tr>
                              <td style="width:640px; border-bottom:1px solid #ddd;"></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="width:640px; font-size:24px; font-weight:normal;">Subscription Summary</td>
                    </tr>
                  </tbody>
                </table>
      
                <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; color:#343434;  font-size:14px; text-align:left;" width="700">
                  <!-- start totals -->
                  <tbody>
                    <tr>
                      <th style="width:320px;text-align:left; font-weight:normal; padding:15px 0;background-color:#fff;">Subtotal</th>
                      <td style="width:320px;padding:15px 0; text-align:right;background-color:#fff;">£${subscription.products.items.reduce((acc:number,el:any)=>acc+el.price,0)}</td>
                    </tr>
                    <tr>
                      <th style="width:320px;text-align:left; font-weight:normal; padding:15px 0;background-color:#fff;">Delivery:</th>
                      <td style="width:320px;padding:15px 0;text-align:right;background-color:#fff;">£${subscription.shippingCost}</td>
                    </tr>
                    <tr>
                      <th style="width:320px; text-align:left; font-weight:bold;  padding:15px 0;">Total</th>
                      <td style="width:320px; padding:15px 0; text-align:right; font-weight:bold;">£${subscription.shippingCost+subscription.products.items.reduce((acc:number,el:any)=>acc+el.price,0)}</td>
                    </tr>
                  </tbody>
                  <!-- end totals -->
                </table>
      
              </td>
            </tr>
          </tbody>
        </table>
        <!-- End Content -->`
}
export function deleteAccountString(){
    return `
    <!-- Content -->
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; text-align:left; border-width: 1px; border-color:#ddd; border-style:solid;color:#343434;" width="700">
      <tbody>
        <tr>
          <td style="padding:30px;width:640px;background-color:#FFF; font-size:36px; font-weight:normal;">We are sorry to see you go :(!</td>
        </tr>
        <tr>
        <tr>
          <td style="padding:15px 30px;width:640px;background-color:#FFF;">
            <p>We are sad to see that you have chosen to delete your account.</p>
            <p style="margin:0;">We have automatically discontinued any subscriptions you may or may not have had but any orders that have already been dispatched will still be on their way to you.</p>
            <p style="margin:0;">Despite the fact you no longer have an account with us, you are still welcome to purchase from or browse our current range of <a style="color:#943201;" href=\"${process.env.WEBSITE_NAME}/products\">products</a>.</p>
            
          </td>
        </tr>
    </tbody>
    </table>`
}

export function registerString(user:any,email:string){
    return `
    <!-- Content -->
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; text-align:left; border-width: 1px; border-color:#ddd; border-style:solid;color:#343434;" width="700">
      <tbody>
        <tr>
          <td style="padding:30px;width:640px;background-color:#FFF; font-size:36px; font-weight:normal;">Welcome to Mega Mushrooms ${user.name}!</td>
        </tr>
        <tr>
        <tr>
          <td style="padding:15px 30px;width:640px;background-color:#FFF;">
            <p>We are pleased you have chosen to register an account with us at this important time in our development as we garner a community of fungi fanatics.</p>
            <p style="margin:0;">Keep an eye on our site for any new products, offers or site updates you should be made aware of.</p>
            <p style="margin:0;">In the mean time, you are welcome to browse our current range of <a style="color:#943201;" href=\"${process.env.WEBSITE_NAME}/products\">products</a></p>
            
            <p style="margin:0;">${!user.updates?"Wish to receive updates of new products or services?":"No longer wish to receive updates of new products or servces?"} <a style="color:#943201;" href="${process.env.WEBSITE_NAME}/edit">${!user.updates?"Subscribe":"Unsubscribe"}</a></p>
          </td>
        </tr>
    </tbody>
    </table>`
}

export function disputeString(object:any,status:string){
    return `
      <h1>New dispute </h1>
      <p>${object.reason}</p>
      <p>disputeId: ${object.id}</p>
      <p>status: ${status}</p>
    `
}
export function invoiceFailString(){
  return `
    <h1>Subscription renewal failure </h1>
    <p>Your subscription has failed to renew. Upon a subscription payment failure, we will automatically attempt to extract the funds 4x before we cancel your subscription</p>
    <p>Please ensure all issues with your account have been resolved before the next attempt.</p>
    <p>Thanks,</p>
  `
}
export function invoiceFinalizationFailString(){
  return `
    <h1>Subscription renewal failure </h1>
    <p>Your subscription has failed to renew. Upon a subscription payment failure, we will automatically attempt to extract the funds 4x before we cancel your subscription</p>
    <p>Please ensure all issues with your account have been resolved before the next attempt.</p>
    <p>Thanks,</p>
  `
}
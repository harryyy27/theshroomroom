const nodemailer = require('nodemailer');
const {google}=require('googleapis');
const OAuth2 = google.auth.OAuth2;

interface attachmentOptions {
  filename:string,
  path: string,
  cid: string
}
interface mailOptions {
    subject: string,
    text?: string|undefined,
    to: string|undefined,
    from: string|undefined,
    html?:string|undefined,
    attachments?:attachmentOptions[]|undefined,
    bcc?:string|undefined

}
const createTransporter = async () => {

    const oauth2Client = new OAuth2(
        process.env.GOOGLEAPI_OAUTH_CLIENT_ID,
        process.env.GOOGLEAPI_OAUTH_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );
    oauth2Client.setCredentials({
        refresh_token: process.env.OAUTH_REFRESH_TOKEN
    });
    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err:any, token:string) => {
          if (err) {
            reject("Failed to create access token :(");
          }
          resolve(token);
        });
      });
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.COMPANY_EMAIL,
          accessToken,
          clientId: process.env.GOOGLEAPI_OAUTH_CLIENT_ID,
          clientSecret: process.env.GOOGLEAPI_OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
      });
      return transporter;

};
const sendEmail = async (emailOptions:mailOptions)=>{
    let emailTransporter = await createTransporter();
    const res = await emailTransporter.sendMail(emailOptions)
}

export {sendEmail}
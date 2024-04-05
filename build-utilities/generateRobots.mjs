import * as fs from 'fs';
import * as path from 'path';
function generateRobotTxt(){
    var robotText=""
    if(process.env.WEBSITE_NAME!=="https://megamushrooms.uk"){

        robotText=`
        User-agent: *

        Disallow: /auth/*
        Disallow:/cart
        Disallow:/myaccount/*
        Disallow:/checkout*
        Disallow:/thank-you/*
        Disallow:*.jpg
        Disallow:*.png
        Disallow:*.webp
        Disallow:*.jpeg
        Sitemap:${process.env.WEBSITE_NAME}/sitemap.xml
        `
    }
    else{
        robotText=`
        User-agent: *
        Disallow: /
        `
    }
    fs.writeFileSync(path.resolve('./public/robots.txt'),robotText)
}

generateRobotTxt()

import { GetServerSideProps } from "next";
export default function Sitemap(){
    return null;
}

export const getServerSideProps=async(ctx:any)=>{
    ctx.res.setHeader('Content-Type','text/xml')
    const xml = await generateSiteMap(ctx);
    ctx.res.write(xml)
    ctx.res.end()
    return {
        props: {
        
        }
    }
}

async function generateSiteMap(ctx:any): Promise<string>{
    const {req,res}=ctx;
    const data= await fetch(`http://${req.headers.host}/api/products/`);
    var product_pages = await data.json();
    var product_pages_arr=Array.from(new Set(product_pages.map((el:any)=>{
        return el.name
    })))


    // const productPages =await 
    return `<?xml version="1.0" encoding="UTF-8">
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${process.env.WEBSITE_NAME}</loc></url>
    <url><loc>${process.env.WEBSITE_NAME}/about</loc></url>
    <url><loc>${process.env.WEBSITE_NAME}/delivery</loc></url>
    <url><loc>${process.env.WEBSITE_NAME}/wholesale</loc></url>
    <url><loc>${process.env.WEBSITE_NAME}/products</loc></url>
    <url><loc>${process.env.WEBSITE_NAME}/what-we-grow</loc></url>
    <url><loc>${process.env.WEBSITE_NAME}/returns</loc></url>
    <url><loc>${process.env.WEBSITE_NAME}/contact-us</loc></url>
    <url><loc>${process.env.WEBSITE_NAME}/products</loc></url>
    ${product_pages_arr.filter((el:any)=>el!=="Shipping").map((el:any)=>{
        var productName=el.replace(/[\s]/gi,'-').replace(/['\'']/gi,'&apos;');
        return `<url>

                    <loc>${process.env.WEBSITE_NAME}/products/${productName}</loc>
                    
                </url>`;
    }).join('')}
    </urlset>
    </xml>`
}
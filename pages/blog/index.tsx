import {Metadata} from '../../utils/metadata/metadata';
import {blogObject,BlogType} from "../../utils/blog/blogObject"
import BlogElement from '../../components/blogElement';
import {useState,useEffect}from 'react'
import Head from 'next/head';
export default function Blog(){
    const [blogArray,setBlogArray]=useState<BlogType[]|[]>([])
    useEffect(()=>{
        setBlogArray(blogObject)
    },[])
    function filterByCategory (category:string|null){
        if(category!==null){
            var newArray=blogObject.filter((el)=>el.type==category)
            setBlogArray(newArray)
        }
        else {
            setBlogArray(blogObject)
        }
    }
    return(
        <div className="static-container">
            <Head>
                <title>{Metadata["blog"]["title"]}</title>
                <meta name="description" content={Metadata["blog"]["description"]}/>
                <meta property="og:title" content={Metadata["blog"]["title"]}/>
                <meta property="og:description" content={Metadata["blog"]["description"]}/>
            </Head>
            <h1 className="main-heading">Blog</h1>
            <div>

            </div>
            {
                blogArray.length===0?
                <p>No blog entries yet... but stay tuned!</p>:
                    blogArray.map((el:any,idx:number)=>{
                    return(
                            <BlogElement key={idx} title={el.title} description={el.description} imagePath={el.imagePath} pageLink={el.pageLink}/>
                    )
                })
            
            
            }
        </div>
    )
}
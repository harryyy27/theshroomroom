import {Metadata} from '../../utils/metadata/metadata';
import {blogObject} from "../../utils/blog/blogObject"
import Head from 'next/head';
export default function Blog(){
    return(
        <div className="static-container">
            <Head>
                <title>{Metadata["blog"]["title"]}</title>
                <meta name="description" content={Metadata["blog"]["description"]}/>
                <meta property="og:title" content={Metadata["blog"]["title"]}/>
                <meta property="og:description" content={Metadata["blog"]["description"]}/>
            </Head>
            <h1 className="main-heading">Blog</h1>

            {
                blogObject.length===0?
                <p>No blog entries yet... but stay tuned!</p>:
                blogObject.map((el:any)=>{
                    return(
                        <section>
                            <div>blogObject</div>
                        </section>
                    )
                })
            }
        </div>
    )
}
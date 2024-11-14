import Image from 'next/image'
import Link from 'next/link'
const BlogElement=(props:any)=>{
    return(
        <Link href={props.pageLink}>
            <div>
                <h2>{props.title}</h2>
                <Image width={400}height={400} alt={props.title} src={props.imagePath}/>
                <p>{props.description}</p>
            </div>
        </Link>
    )
}
export default BlogElement;
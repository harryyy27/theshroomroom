import Image from 'next/image';

export default function Banner(props:any){
  
    return(
    <div className={"bannerContainer"}>
        <Image layout="responsive" className={"image"} width={props.width} height={props.height} src={props.src+'.'+props.fileType}blurDataURL={props.src+'Blur'+'.'+props.fileType} alt={props.alt} placeholder="blur" />
    </div>
    )
}
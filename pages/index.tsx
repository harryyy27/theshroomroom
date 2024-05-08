import type { NextPage } from 'next';
import Hero from '../components/home_page/hero'
import Faq from '../components/home_page/faq';
// import Testimonials from '../components/home_page/testimonials';
import Benefits from '../components/home_page/benefits';
import Wholesale from '../components/home_page/wholesale';
import Contact from '../components/home_page/contact';
// import Carousel from '../components/carousel';
// import {CarouselHomeNewArrivals} from '../utils/carouselConfig/home.module'

import Head from 'next/head';
import {Metadata}from '../utils/metadata/metadata';
const Home: NextPage = (props:any) => {
  // useEffect(()=>{
  //   const initiateSession=async()=>{
  //     const session = await getSession()
  //   }
  //   initiateSession()
  
  // })
  return (
    
    <>  
      <Head>
        <title>{Metadata["home"]["title"]}</title>
        <meta name="description" content={Metadata["home"]["description"]}/>
        <meta property="og:title" content={Metadata["home"]["title"]}/>
        <meta property="og:description" content={Metadata["home"]["description"]}/>
        <link rel="canonical" href={`${props.website_name}/`} />
        <script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>

      </Head>
      <Hero />
      <Wholesale />
      <Benefits />
      <Faq />
      <Contact/>
    </>
  )
}
export async function getServerSideProps({req,res}:any){
  const url = process.env.WEBSITE_NAME
  return {
    props:{
      website_name:url
    }
  }
}
export default Home

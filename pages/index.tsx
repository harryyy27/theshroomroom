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
const Home: NextPage = () => {
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
        <link rel="canonical" href={`${process.env.WEBSITE_NAME}/`} />

      </Head>
      <Hero />
      <Wholesale />
      <Benefits />
      <Faq />
      <Contact/>
    </>
  )
}

export default Home

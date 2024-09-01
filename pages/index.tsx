import type { NextPage } from 'next';
import Hero from '../components/home_page/hero'
import Faq from '../components/home_page/faq';
// import Testimonials from '../components/home_page/testimonials';
import Benefits from '../components/home_page/benefits';
import Wholesale from '../components/home_page/wholesale';
import Contact from '../components/home_page/contact';
import Sale from '../components/home_page/sale'
// import Carousel from '../components/carousel';
// import {CarouselHomeNewArrivals} from '../utils/carouselConfig/home.module'
import {useState,useEffect} from 'react'
import Head from 'next/head';
import {Metadata}from '../utils/metadata/metadata';
const Home: NextPage = (props:any) => {

  useEffect(()=>{
    const url = window.location.href
    if(url.split('#')[1]==="join-mailing-list"){
      document.getElementById('subscriptionForm')?.scrollIntoView()
    }
  },[])
  return (
    
    <>  
      <Head>
        <title>{Metadata["home"]["title"]}</title>
        <meta name="description" content={Metadata["home"]["description"]}/>
        <meta property="og:title" content={Metadata["home"]["title"]}/>
        <meta property="og:description" content={Metadata["home"]["description"]}/>
        <meta property="og:image" content={`${props.websiteName}/_next/image?url=%2Fhome%2Fhero.jpg&w=1920&q=75`}></meta>
        <meta name="twitter:title" content={Metadata["home"]["title"]}/>
        <meta name="twitter:description" content={Metadata["home"]["description"]}/>
        <meta name="twitter:card" content={`${props.websiteName}/_next/image?url=%2Fhome%2Fhero.jpg&w=1920&q=75`}></meta>
        
        <link rel="canonical" href={`${props.websiteName}/`} />
        <meta name="p:domain_verify" content="51c93de7c80c745653c50923d39b8b79"/>
        <script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>

      </Head>
      <Sale />
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
      websiteName:url
    }
  }
}
export default Home

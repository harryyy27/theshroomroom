import Link from 'next/link'
import homeStyles from '../../styles/Pages/Home.module.css'
import {useEffect,useState} from 'react'
import Timer from '../timer'
import saleDates from '../../utils/saleDates/saleDates'
export default function Sale (props:any){
    const [preSale,setPreSale]=useState<boolean | null>(null)
    const [countdownDate,setCountdownDate]=useState<Date|null>(null)
    const [endSaleDate,setEndSaleDate]=useState<Date|null>(null)
    useEffect(()=>{
        setCountdownDate(saleDates.countdownDate)
        setEndSaleDate(saleDates.saleEndDate)
        if(Date.now()- +saleDates.countdownDate<0){
            setPreSale(true)
        }
        else if(Date.now()- +saleDates.saleEndDate<0){
            setPreSale(false)
        }
    },[])
    return(
        <section>

                <div >{
                        preSale!==null? preSale?
                        <>
                    <h1 className={homeStyles['sales-title']}>OPENING COUNTDOWN...</h1>
                    <Timer countdownDate={countdownDate}/>
                    <button id="heroCta" className="cta"><Link id="heroCtaLink" href="/products">BUY NOW</Link></button>
                    </>
                        :
                        <>
                        <h1 className={homeStyles['sales-title']}>WE ARE OPEN FOR BUSINESS!</h1>
                    <h2 className={homeStyles['sales-h2']}><Link className="link" href="/auth/signup">Sign up</Link> and join our mailing list for 25% off your first order</h2> 
                    <h2 className={homeStyles['sales-h2']}>10% off all products for a limited time only</h2>
                    
                        <Timer countdownDate={endSaleDate}/>
                        <button id="heroCta" className="cta sale-cta"><Link id="heroCtaLink" href="/products">BUY NOW</Link></button>
                        </>:
                        null
                }
                </div>
            </section>
    )
}
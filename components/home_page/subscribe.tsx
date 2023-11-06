import React from 'react';
import homeStyles from '../../styles/Pages/Home.module.css'
import SubscriptionForm from '../subscriptionForm'
export default function Subscribe(){
    return(
        <section className={homeStyles["banner-container"]}>
            <div className={homeStyles["contact-wrapper"]}>
            <h1 className={homeStyles["home-section-heading"]}>Subscribe</h1>
            <p className="sub-heading">We are a recent start up with plans for rapid expansion. A myriad of new products will be hitting our shelves soon. If you wish to be notified of new releases please subscribe below.</p>
            <SubscriptionForm />
            </div>
        </section>
    )
}
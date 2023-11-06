import homeStyles from '../../styles/Pages/Home.module.css'
import ContactForm from '../../components/contactForm'
export default function Contact(){
    return(
        
        <section className={homeStyles["banner-container"]}>
            <div className={homeStyles["contact-wrapper"]}>
            <h1 className={homeStyles["home-section-heading"]}>Contact us</h1>
            <h2 className="sub-heading">For any further questions</h2>
            <ContactForm />
            </div>
        </section>
    )
}
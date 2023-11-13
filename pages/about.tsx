import {Metadata} from '../utils/metadata/metadata';
import Head from 'next/head';
export default function Mushrooms(){
    return(
        <div className="static-container">
            <Head>
                <title>{Metadata["about"]["title"]}</title>
                <meta name="description" content={Metadata["about"]["description"]}/>
                <meta property="og:title" content={Metadata["about"]["title"]}/>
                <meta property="og:description" content={Metadata["about"]["description"]}/>
            </Head>
            <h1 className="main-heading">Welcome to Mega Mushrooms: Cultivating Nature's Finest Fungi</h1>
            <section>
                <p>Mega Mushrooms are a small, London based start up with a passion for all things fungi. We've seen many of the wonderful applications of fungi at work over the years, such as the yeasts used to brew alcohol and the penicillin used to cure bacterial infections and felt that it was time to explore the fungal kingdom further; by first bringing all the culinary delights it has to offer to your dinner plates.</p>

                <p>We've refined our growing process over many iterations in order to offer you delicious and medicinally potent lion's mane mushrooms at the best possible prices.</p>
            </section>
            <section>
                <h2>Our Vision: Redefining Nutrition, Enriching Communities, and Unveiling the Fungal Frontier</h2>

                <p>At Mega Mushrooms, we envision a future where mushrooms aren't just a culinary delight but an essential part of a healthy and balanced diet but our vision extends far beyond lion's mane cultivation.</p>
                <ul>
                    <li>
                        <h3>Revolutionizing Diets:</h3>

                        <p>With an increasingly large body of evidence backing the nutritional and medical benefits of these mushrooms; we envision a future in which our our diets will be loaded with mushrooms (much akin to the 5 a day principle for vegetables). Meals should not only be delicious but also nourishing and our mushrooms can contribute to improved cognitive function, immune systems, and overall well-being.</p>
                    </li>
                    <li>
                        <h3>Growth:</h3>
                        <p>We want to give you everything the fungal kingdom has to offer. As we grow as a business we will continue to cultivate new mushrooms, work with mycelium and find new applications. We have a number of cultures in cold storage, waiting to be grown for your benefit including enoki, reishi, turkey tail, king stropharia, cordyceps and chaga.</p>
                    </li>
                    <li>
                        <h3>Equality:</h3>
                        <p>At Mega Mushrooms, we believe in equality. Everyone at Mega Mushrooms contributes to the value of the company and as such every individual who contributes will be rewarded equally and own an equal share of the company.</p>
                    </li>
                    <li>
                        <h3>Knowledge:</h3>
                        <p>Mycology is a treasure trove of knowledge just waiting to be discovered. It is very much a frontier science partly as the scientific community have not given it the attention it deserves. Our team is dedicated to learning everything there is to know about these remarkable organisms. We experiment, learn from scientific literature and share our knowledge to inspire a new generation of mycologists.</p>
                    </li>
                </ul>
            </section>
            <section>
                <h2>Our Commitment to Sustainability</h2>

                <p>At Mega Mushrooms, sustainability is at the heart of what we do. We are continuously pushing to reduce our waste and improve our operation in terms of both efficiency and energy usage.</p>
                <ul>
                    <li>
                        <h3>Eco-Friendly Cultivation:</h3> 
                        <p>We employ eco-friendly cultivation methods that minimize our environmental footprint. From compostable substrates to biodegradable packaging, we ensure our cultivation processes are as gentle on the Earth as they are bountiful. We have additional measures lined up to reduce our environmental impact further e.g utilising the waste products from other local businesses.</p>
                    </li>
                    <li>
                        <h3>Waste Reduction:</h3> 
                        <p>We're passionate about waste reduction and ultimately aim to be a zero waste operation. Our current packaging materials are carefully chosen to be reusable, recyclable or biodegradable. We are now in the process of reducing this waste further by moving away from the traditional filter patch bags in favour of more economic and reusable silicone boxes.</p>
                    </li>
                </ul>
            </section>
        </div>
    )
}
interface Meta {
    title:string,
    description:string
}
interface WholeMeta {
    [path:string]:Meta
}
const Metadata:WholeMeta = {
    home:{
        title:"Mycotanical Garden - Home of Premium Lion's Mane Mushrooms",
        description:"Explore the power of Lion's Mane mushrooms at Mycotanical Garden. Discover premium, sustainably cultivated Lion's Mane known for enhancing cognition and overall well-being. Shop now for nature's finest treasures."
    },
    plp:{
        title:"Mycotanical Garden - Premium Mushrooms",
        description:"Explore the magic of lion's mane mushrooms at Mycotanical Garden. Our premium lion's mane strains are expertly cultivated for optimal flavor and health benefits. Stay tuned for a diverse range of exotic mushrooms that will soon be hitting our shelves. In the mean time, explore the culinary sensations offered by our lions mane mushrooms."
    },
    pdp:{
        title:"Mycotanical Garden - Premium Lions Mane Mushrooms - \"smart mushrooms\" ",
        description: "Discover nature's brain booster: premium lion's mane mushrooms 🍄 Elevate your cognitive wellbeing with our organic lion's mane mushrooms, meticulously grown and carefully harvested for optimum potency. Packed with natural brain-boosting compounds, our lion's mane mushrooms are an excellent choice for mental clarity and focus. Experience the power of this extraordinary fungi - your path to enhanced cognition starts here. Experiment with our top-quality lion's mane mushrooms and embark on a journey of increased cognitive prowess."
    },
    about:{
        title:"Mycotanical garden - cultivating nature's medical marvels",
        description: "Get to know the heart and soul of Mycotanical Garden. Learn about our mission to redefine nutrition, enrich communities, and explore the diverse applications of fungi. Join us on our mycological journey."
    },
    contact:{
        title:"Mycotanical garden - contact us",
        description:"Contact us if you wish to drop us a line"
    },
    delivery:{
        title:"Mycotanical garden - delivery policy",
        description:"Our delivery service is catered to deliver mushrooms straight to your door and simultaneously keep them completely fresh for your consumption."
    },
    privacy:{
        title:"Mycotanical garden - privacy policy",
        description:"Here at the mycotanical garden your data is our first and foremost concern and as such we take the following measures to ensure it's kept safe."
    },
    cookies:{
        title:"Mycotanical garden - cookies policy",
        description:"Here at the mycotanical garden your data is our first and foremost concern and as such we take the following measures to ensure it's kept safe."
    },
    returns:{
        title:"Mycotanical garden - return policy",
        description:"Our return policy and justifications."
    },
    signin:{
        title:"Mycotanical garden - sign in",
        description:"Sign in to the Mycotanical Garden and browse our collection of mushrooms!"
    },
    signup:{
        title:"Mycotanical garden - sign up",
        description:"Sign up to the Mycotanical Garden to hear about all sales, offers and new products first!"
    },
    whatwegrow:{
        title:"Mycotanical Garden - Rare, Healthy, London grown Lion's Mane Mushrooms",
        description:"What are lion's mane mushrooms and how can you benefit from them? As it happens, there are plenty of reasons to add these super shrooms to your diet."
    },
    wholesale:{
        title:"Mycotanical Garden- Buy wholesale lion's mane.",
        description:"Purchase wholesale lion's mane to supply your restaurants with copious amounts of our gourmet medicinal mushrooms."
    },
    forgottenpassword:{
        title:"Mycotanical Garden - forgotten password",
        description:"Regain access to your account"
    }


}

export {Metadata}
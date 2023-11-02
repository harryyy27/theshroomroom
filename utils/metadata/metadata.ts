interface Meta {
    title:string,
    description:string
}
interface WholeMeta {
    [path:string]:Meta
}
const Metadata:WholeMeta = {
    home:{
        title:"Mega Mushrooms - Home of Premium Lion's Mane Mushrooms",
        description:"Explore the power of Lion's Mane mushrooms at Mega Mushrooms. Discover premium, sustainably cultivated Lion's Mane known for enhancing cognition and overall well-being. Shop now for nature's finest treasures."
    },
    plp:{
        title:"Mega Mushrooms - Premium Mushrooms",
        description:"Explore the magic of lion's mane mushrooms at Mega Mushrooms. Our premium lion's mane strains are expertly cultivated for optimal flavor and health benefits. Stay tuned for a diverse range of exotic mushrooms that will soon be hitting our shelves. In the mean time, explore the culinary sensations offered by our lions mane mushrooms."
    },
    pdp:{
        title:"Mega Mushrooms - Premium Lions Mane Mushrooms - \"smart mushrooms\" ",
        description: "Discover nature's brain booster: premium lion's mane mushrooms 🍄 Elevate your cognitive wellbeing with our organic lion's mane mushrooms, meticulously grown and carefully harvested for optimum potency. Packed with natural brain-boosting compounds, our lion's mane mushrooms are an excellent choice for mental clarity and focus. Experience the power of this extraordinary fungi - your path to enhanced cognition starts here. Experiment with our top-quality lion's mane mushrooms and embark on a journey of increased cognitive prowess."
    },
    about:{
        title:"Mega Mushrooms - cultivating nature's medical marvels",
        description: "Get to know the heart and soul of Mega Mushrooms. Learn about our mission to redefine nutrition, enrich communities, and explore the diverse applications of fungi. Join us on our mycological journey."
    },
    contact:{
        title:"Mega Mushrooms - contact us",
        description:"Contact us if you wish to drop us a line"
    },
    delivery:{
        title:"Mega Mushrooms - delivery policy",
        description:"Our delivery service is catered to deliver mushrooms straight to your door and simultaneously keep them completely fresh for your consumption."
    },
    privacy:{
        title:"Mega Mushrooms - privacy policy",
        description:"Here at the Mega Mushrooms your data is our first and foremost concern and as such we take the following measures to ensure it's kept safe."
    },
    cookies:{
        title:"Mega Mushrooms - cookies policy",
        description:"Here at the Mega Mushrooms your data is our first and foremost concern and as such we take the following measures to ensure it's kept safe."
    },
    returns:{
        title:"Mega Mushrooms - return policy",
        description:"Our return policy and justifications."
    },
    signin:{
        title:"Mega Mushrooms - sign in",
        description:"Sign in to the Mega Mushrooms and browse our collection of mushrooms!"
    },
    signup:{
        title:"Mega Mushrooms - sign up",
        description:"Sign up to the Mega Mushrooms to hear about all sales, offers and new products first!"
    },
    whatwegrow:{
        title:"Mega Mushrooms - Rare, Healthy, London grown Lion's Mane Mushrooms",
        description:"What are lion's mane mushrooms and how can you benefit from them? As it happens, there are plenty of reasons to add these super shrooms to your diet."
    },
    wholesale:{
        title:"Mega Mushrooms- Buy wholesale lion's mane.",
        description:"Purchase wholesale lion's mane to supply your restaurants with copious amounts of our gourmet medicinal mushrooms."
    },
    forgottenpassword:{
        title:"Mega Mushrooms - forgotten password",
        description:"Regain access to your account"
    }


}

export {Metadata}
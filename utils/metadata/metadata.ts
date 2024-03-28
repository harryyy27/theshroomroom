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
        description:"Explore the power of lion's mane mushrooms at Mega Mushrooms. Discover premium, sustainably cultivated Lion's Mane known for enhancing cognition and overall well-being."
    },
    plp:{
        title:"Mega Mushrooms - Premium Mushrooms",
        description:"Explore the magic of lion's mane mushrooms at Mega Mushrooms. Our premium lion's mane strains are expertly cultivated for optimal flavor and health benefits. Stay tuned for the diverse range of exotic mushrooms that will soon be hitting our shelves."
    },
    pdp:{
        title:"Mega Mushrooms - Premium Lions Mane Mushrooms - \"smart mushrooms\" ",
        description: "Discover nature's brain booster: premium lion's mane mushrooms 🍄. Packed with natural brain-boosting compounds, our lion's mane mushrooms are an excellent choice for mental clarity and focus. Experience the power of this extraordinary fungi - your path to enhanced cognition starts here."
    },
    about:{
        title:"Mega Mushrooms - cultivating nature's medical marvels",
        description: "Get to know Mega Mushrooms and what we stand for. Learn about our mission to redefine nutrition, embrace sustainability and explore the diverse applications of fungi."
    },
    contact:{
        title:"Mega Mushrooms - contact us",
        description:"Contact us if you wish to drop us a line"
    },
    delivery:{
        title:"Mega Mushrooms - delivery policy",
        description:"The Mega Mushrooms delivery service is optimised to deliver lion's mane mushrooms straight to your door whilst keeping them fresh for your consumption."
    },
    privacy:{
        title:"Mega Mushrooms - privacy policy",
        description:"Here at Mega Mushrooms your data is our first and foremost concern and as such we take the following measures to ensure it's kept safe."
    },
    cookies:{
        title:"Mega Mushrooms - cookies policy",
        description:"Here at Mega Mushrooms we use cookies to ensure the site functions optimally."
    },
    returns:{
        title:"Mega Mushrooms - return policy",
        description:"Mega Mushrooms return policy and justifications."
    },
    signin:{
        title:"Mega Mushrooms - sign in",
        description:"Sign in to Mega Mushrooms and browse our collections!"
    },
    signup:{
        title:"Mega Mushrooms - sign up",
        description:"Sign up to Mega Mushrooms to hear about all sales, offers and new products first!"
    },
    whatwegrow:{
        title:"Mega Mushrooms - Rare, Healthy, London grown Lion's Mane Mushrooms",
        description:"What are lion's mane mushrooms and how can you benefit from them? As it happens, there are plenty of reasons to add these super shrooms to your diet."
    },
    wholesale:{
        title:"Mega Mushrooms- Buy wholesale lion's mane.",
        description:"Purchase wholesale lion's mane to keep your stores well supplied."
    },
    forgottenpassword:{
        title:"Mega Mushrooms - forgotten password",
        description:"Regain access to your account"
    },
    thankyou:{
        title: "Mega Mushrooms - thank you",
        description: "Thank you for your purchasing our lion's mane mushrooms.",
    },
    unsubscribe:{
        title: "Mega Mushrooms - unsubscribe",
        description: "We're sorry to see you go.",
    },
    general: {
        title:"Mega Mushrooms - cultivators of lion's mane mushrooms",
        description:"Venders of premium lions mane mushrooms 🍄"
    }


}

export {Metadata}
interface Meta {
    title:string,
    description:string
}
interface WholeMeta {
    [path:string]:Meta
}
const Metadata:WholeMeta = {
    home:{
        title:"Mega Mushrooms - Home of UK Grown Lion's Mane Mushrooms",
        description:"We are a small mushroom farm based in South East London and a producer of lion's mane mushrooms. Buy now!"
    },
    plp:{
        title:"Mega Mushrooms - Premium Mushrooms",
        description:"Explore the magic of lion's mane mushrooms at Mega Mushrooms. Considered a nootropic by some, lion's mane is known for enhancing brain health and reducing oxidative stress in the body. Stay tuned for the diverse range of exotic mushrooms that will soon be hitting our shelves."
    },
    about:{
        title:"Mega Mushrooms - cultivating nature's medical marvels",
        description: "Get to know Mega Mushrooms and what we stand for. Learn about our mission to redefine nutrition, embrace sustainability and explore the diverse applications of fungi."
    },
    contact:{
        title:"Mega Mushrooms - contact us",
        description:"Message here if you wish to drop us a line"
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
        description:"View cookies here."
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
        description:"Buy UK grown lion's mane mushrooms to keep your stores well supplied."
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
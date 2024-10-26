const config:{[key:string]:{question:string,answer:string | string[] }[]} = {
    lions_mane:[
   { 
    question:"Additional information",
    answer:["Do not use lion's mane if you are pregnant", "If you are using blood thinning medication, please consult a health care professional before using lion's mane","If you are showing signs of an allergic reaction, seek medical help immediately.","Please consult a qualified health care professional before giving lion's mane to children."] 
},
{
    question: "Delivery information",
    answer: "Fresh mushrooms will be delivered in 1-2 working days (1 day after harvest). Dried will be delivered in 2-4 working days."
},
{
    question:"Storage information",
    answer: "Fresh mushrooms should be kept refrigerated. Dried should be kept in a cool, dark place with the package sealed."
}

]}
export default config;
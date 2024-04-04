export default async function getShipping(){
    const productDetailsJson = await fetch(`/api/products?product=${"Shipping"}`)
    const productDetails = await productDetailsJson.json()
    return productDetails.price
}
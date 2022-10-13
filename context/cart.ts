import {createContext, useEffect,useState} from 'react';
interface ProductInterface{
    _id: String,
    quantity: Number,
    name: String,
    price: Number,
    image: String
}
interface ContextInterface {
    cart:{ items:ProductInterface[]},
    subTotal: Number,
    total: Number,
    shipping: Number,
    loaded: Boolean,
    saveCart?: ()=>void,
}
const defaultState={
    cart: {
        items:[]
    },
}
const CartContext = createContext<ContextInterface>(defaultState);




export {CartContext};
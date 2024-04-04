import {createContext,Dispatch,SetStateAction} from 'react';
import {Product} from '../utils/types';

interface ContextInterface {
    state: {
        cart:{ items:Product[]},
        subTotal: Number,
        total: Number,
        shipping: Number,
        shippingMethod:String,
        totalQuantity:Number,

    },
    cartLoaded: Boolean,
    dispatch: Dispatch<{
        type: String,
        payload: { items:Product[]}
        shipping:number|undefined
    }>|undefined,
    setCartLoaded:Dispatch<SetStateAction<boolean>>|undefined,
    saveCart?: (product?:Product)=>Promise<void>|undefined,
}
const defaultState={
    state: {
        cart: {
            items:[]
        },
        subTotal:0,
        total:0,
        shipping:0,
        shippingMethod:"Standard",
        totalQuantity:0,
    },
    dispatch:undefined,
    cartLoaded: false,
    setCartLoaded:undefined,
    saveCart:undefined
}
const CartContext = createContext<ContextInterface>(defaultState);


export {CartContext};
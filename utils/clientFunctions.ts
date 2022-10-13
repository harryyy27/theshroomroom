import {FormEvent} from 'react';

export async function addToBasket(e:FormEvent,id:String):Promise<void>{
    e.preventDefault();
    const res = await fetch('/api/editUser')
}
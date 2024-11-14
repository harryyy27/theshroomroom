import { StringMatcher } from "cypress/types/net-stubbing"

export interface BlogType {
    type:string,
    title:string,
    description:string,
    imagePath:string,
    pageLink:string
}

export const blogObject:BlogType[]|[]=[
    {
        type:"recipe",
        title:"Lion's Mane Tuna Pesto Bowl",
        description:"Easy lunch time recipe to quench the lunch time pangs and add a little focus to your day",
        imagePath:"/recipes/pesto",
        pageLink:"/blog/recipes/tuna-pesto-bowl"
    }
    
]
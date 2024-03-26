interface ProductImage {
    name: string,
    alt: string,
    path:string,
    fileType: string,
    link: string,
    width: number,
    height: number
}
export const imageMap: {[mushroom:string]:ProductImage} = {
    'Lion\'s Mane':{
        name: 'Lions Mane',
        alt:'lions mane mushroom',
        path:'/products/mushrooms/lions_mane',
        fileType:'png',
        link: '/products/lions_mane',
        width:3500,
        height:2500
    },
    'Ground Lion\'s Mane':{
        name: "Ground Lions Mane",
        alt:'ground lions mane mushroom',
        path:'/products/mushrooms/ground_lions_mane',
        fileType:'png',
        link:'/products/ground_lions_mane',
        width:3200,
        height:3200
    },
    'Turkey Tail':{
        name: 'Turkey Tail',
        alt:'turkey tail mushroom',
        path:'/products/mushrooms/turkey_tail',
        fileType:'jpeg',
        link: '/products/turkey_tail',
        width: 2513,
        height:1885
    },
    'Reishi':{
        name: 'Reishi',
        alt:'reshi mushroom',
        path:'/products/mushrooms/reishi',
        fileType:'jpg',
        link: '/products/turkey_tail',
        width:1296,
        height:728
    }
}
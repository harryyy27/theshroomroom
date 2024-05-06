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
    'Fresh Lion\'s Mane':{
        name: 'Fresh Lions Mane',
        alt:'fresh lions mane mushroom',
        path:'/products/mushrooms/lions_mane_fresh',
        fileType:'png',
        link: '/products/fresh_lions_mane',
        width:2500,
        height:2500
    },
    'Dried Lion\'s Mane':{
        name: 'Dried Lions Mane',
        alt:'dried lions mane mushroom',
        path:'/products/mushrooms/lions_mane_dry',
        fileType:'png',
        link: '/products/dried_lions_mane',
        width:2500,
        height:2500
    },
    'Dried Ground Lion\'s Mane':{
        name: "Dried Ground Lions Mane",
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
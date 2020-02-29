const express = require('express');
const {ApolloServer}=require('apollo-server-express');
let aboutMessage = "Product Inventory API v1.0";
const productDB = [
    {
        id:1,category: 'Shirts', name: 'Blue Shirt', price: 34.00, image:'https://vanheusen.partnerbrands.com/en/flex-regular-wrinkle-free-button-up-dress-shirt-20F6194?camp=PPC_PLA_Brand&gclid=CjwKCAiAy9jyBRA6EiwAeclQhGezscRCHA75G8pHj2ELSXM_-hKOW_3lXs_5NgqNSI-XVfo61yJkSxoCA70QAvD_BwE&gclsrc=aw.ds'
    },
    {
        id: 2,category: 'Accessories', name: 'Gold Earring', price: 64.00, image:'https://www.etsy.com/listing/453173668/14k-gold-mini-hoop-earrings-14k-solid?gpla=1&gao=1&'
    },
    {
        id: 3,category: 'Jackets', name: 'Sweatshirt', price: 7.98, image:'https://www.bulkapparel.com/fleece/hanes-p170-ecosmart-hooded-sweatshirt?gclid=CjwKCAiAy9jyBRA6EiwAeclQhDITTH_V5CVCRRF2IEKhrzUtmJtLPbghYO3hux6zuBv38kPfS9V7HxoCdtcQAvD_BwE'
    }
];
const fs = require('fs');
const app = express();
const resolvers={
    Query:{
        about: () => aboutMessage,
        productList,
    },
    Mutation:{
        setAboutMessage,
        addProduct,
    },
};

function setAboutMessage(_,{ message }){
    return aboutMessage = message;
}

function productList(){
    return productDB;
}

function addProduct(_,{product}){
    product.id = productDB.length + 1;
    productDB.push(product);
    return product;
}

const server = new ApolloServer({
    typeDefs:fs.readFileSync('./server/schema.graphql','utf-8'),
    resolvers,
});

app.use(express.static('public'));

server.applyMiddleware({app, path:'/graphql'});

app.listen(3000, function(){
    console.log('App started on port 3000');
});

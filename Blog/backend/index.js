import {ApolloServer,gql} from 'apollo-server'
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core'
import typeDefs from "./Schema.js";
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import { JWT_SECRET, MONGO_URI } from './config.js';
mongoose.connect(MONGO_URI,{
  useNewUrlParser:true,
  useUnifiedTopology:true  
})
mongoose.connection.on("connected",()=>{
    console.log("connected to mongodb")
})
mongoose.connection.on("error",(err)=>{
    console.log(err)
})

import "./Models/User.js"
import "./Models/Quotes.js"
import resolvers from "./resolver.js"
const server= new ApolloServer({ 
    typeDefs, 
    resolvers,
    context:({req})=>{
        const { authorization } = req.headers;
        console.log(authorization)
        if(authorization){
         const {userId} = jwt.verify(authorization,JWT_SECRET)
         return {userId}
        }
    },
    plugins:[
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
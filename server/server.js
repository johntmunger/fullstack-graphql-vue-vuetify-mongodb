const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken');

// import typeDefs and resolvers
const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require("./resolvers");


// import environment vars and mongoose models
require('dotenv').config({ path: "variables.env" });
const User = require("./models/User.js");
const Post = require("./models/Post.js");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("DB Connected!"))
.catch(err => console.error(err));

// verify the JWT token passed from client
const getUser = async token => {
    if(token) {
        try {
            return await jwt.verify(token, process.env.SECRET);
        } catch (err) {
            throw new AuthenticationError(
                'Your session has ended. Please sign in again.'
            );
        }
    }
}

// create apollo/gql server using typeDefs, resolvers, and the context object
const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: error => ({ 
        name: error.name, 
        message: error.message 
    }),
    context: async ({ req }) => {
        const token = req.headers['authorization'];
        return { User, Post, currentUser: await getUser(token) };
    }
});

// connect to MLab database 
server.listen(4002).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});

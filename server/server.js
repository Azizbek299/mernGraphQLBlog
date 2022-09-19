const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const http = require("http");

const { PubSub } = require("graphql-subscriptions");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(`MongoDB connected`);
  })
  .catch((err) => {
    console.error(err);
  });

async function startApolloServer() {
  const app = express();

  const httpServer = http.createServer(app);

  const pubsub = new PubSub();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    context: ({ req }) => ({ req, pubsub }),
  });

  await server.start();

  const corsOptions = {
    origin: true,
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
    optionSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  server.applyMiddleware({
    app,
    path: "/",
  });

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

  console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);

  return { server, app };
}

startApolloServer();

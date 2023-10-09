import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { json } from 'body-parser';
import cors from "cors";

import {User} from "./user";

async function initialiseServer() {
  const app = express();
  app.use(cors());
  const graphqlServer = new ApolloServer({
    typeDefs: `
    ${User.types}
        type Query{
            ${User.queries}
        }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries
      }
    },
  });
  await graphqlServer.start();
  app.use("/graphql",json(), expressMiddleware(graphqlServer));
  return app;
}

export default initialiseServer;

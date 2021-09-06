import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';

import { typeDefs } from 'src/schema/definition';
import { ReasonDS } from 'src/datasource/reason';
import { resolvers } from 'src/resolver';
import { TransactionDS } from 'src/datasource/transaction';

const dbClient = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      reasonDs: new ReasonDS({ dbClient }),
      transactionDs: new TransactionDS({ dbClient }),
    };
  },
});

server.listen().then(() => {
  console.log(`
    Server is running!
    Listening on port 4000
  `);
});

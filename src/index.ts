import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { constraintDirective, constraintDirectiveTypeDefs } from 'graphql-constraint-directive';
import { typeDefs } from 'src/schema/definition';
import { ReasonDS } from 'src/datasource/reason';
import { resolvers } from 'src/resolver';
import { TransactionDS } from 'src/datasource/transaction';
import { dbClient } from 'src/db';

const schema = makeExecutableSchema({
  typeDefs: [constraintDirectiveTypeDefs, typeDefs],
  resolvers,
});

const server = new ApolloServer({
  schema: constraintDirective()(schema),
  dataSources: () => {
    return {
      reasonDs: new ReasonDS({ dbClient }),
      transactionDs: new TransactionDS({ dbClient }),
    };
  },
});

const PORT = process.env.PORT || 3000
server.listen(PORT).then(() => {
  console.log(`
    Server is running!
    Listening on port ${PORT}
  `);
});

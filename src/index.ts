import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';

import { typeDefs } from '@schema/definition';
import { ReasonDS } from '@datasource/reason';
import { resolvers } from '@resolver';
import { dbClient } from '@db';
import { TransactionDS } from '@datasource/transaction';
import { DailySpendDS } from '@datasource/dailySpend';
import { TokenDS } from '@datasource/token';
import { GmailSmtp } from '@datasource/smtp';

const port = process.env.LEDGER_PORT || 3333;
const key = process.env.LEDGER_KEY || 'dev.key';
const cert = process.env.LEDGER_CERT || 'dev.crt';
const isProduction = process.env.NODE_ENV === 'production';
const user = process.env.GMAIL_USER || '';
const pass = process.env.GMAIL_PASS || '';
const baseUrl = isProduction ? 'http://localhost:3000/token' : 'http://localhost:3000/token';

let allowEmails: string[] | null = null;

if (!process.env.LEDGER_LOGIN?.length) allowEmails = [];
else if (process.env.LEDGER_LOGIN !== '*') {
  allowEmails = process.env.LEDGER_LOGIN.split(',');
}

(async function startServer() {
  const app = express();

  let httpServer;

  if (isProduction) {
    httpServer = https.createServer(
      {
        key: fs.readFileSync(key),
        cert: fs.readFileSync(cert),
      },
      app
    );
  } else {
    httpServer = http.createServer(app);
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    dataSources: () => ({
      reasonDs: new ReasonDS(dbClient),
      transactionDs: new TransactionDS(dbClient),
      dailySpendDs: new DailySpendDS(dbClient),
      tokenDs: new TokenDS(dbClient, allowEmails),
      smtpDs: new GmailSmtp(user, pass, baseUrl),
    }),
    context: { allowEmails },
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(
    `🚀 Server ready at http${isProduction ? 's' : ''}://localhost:${port}${server.graphqlPath}`
  );
})();

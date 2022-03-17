import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import LruCache from 'lru-cache';

import { typeDefs } from '@schema/definition';
import { ReasonDS } from '@datasource/reason';
import { resolvers } from '@resolver';
import { dbClient } from '@db';
import { TransactionDS } from '@datasource/transaction';
import { DailySpendDS } from '@datasource/dailySpend';
import { TokenDS } from '@datasource/token';
import { GmailSmtp } from '@datasource/smtp';
import Config from './config';

async function initTokenCache(tokenDs: TokenDS) {
  const tokens = await tokenDs.getRevokeTokens();
  const cache = new LruCache<string, boolean>({ max: tokens.length });

  tokens.forEach((t) => void cache.set(t.token, true));

  return cache;
}

(async function startServer() {
  const isProduction = Config.get('environment') === 'production';
  const app = express();

  const tokenDs = new TokenDS(dbClient);
  const revokedTokensCache = await initTokenCache(tokenDs);

  async function hasBeenRevoked(token: string) {
    if (!revokedTokensCache.has(token)) {
      const tokenRecord = await tokenDs.getRecordByToken({ token });

      if (tokenRecord?.revokedAt) {
        revokedTokensCache.set(token, true);
        return true;
      }
      return false;
    }
    return true;
  }

  let httpServer;

  if (isProduction) {
    httpServer = https.createServer(
      {
        key: fs.readFileSync(Config.get('ssl_certificates')?.key as string),
        cert: fs.readFileSync(Config.get('ssl_certificates')?.cert as string),
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
      tokenDs,
      reasonDs: new ReasonDS(dbClient),
      transactionDs: new TransactionDS(dbClient),
      dailySpendDs: new DailySpendDS(dbClient),
      smtpDs: new GmailSmtp(
        Config.get('smtp_credentials'),
        Config.get('signin_email_template'),
        Config.get('frontend_base_url')
      ),
    }),

    context: async ({ req }) => {
      const token = (req.headers.authorization || '').replace('Bearer ', '');

      let tokenPayload: JwtPayload | null = null;

      try {
        if (!(await hasBeenRevoked(token))) {
          tokenPayload = token
            ? (jwt.verify(token, Config.get('signin_jwt_secret')) as JwtPayload)
            : null;
        }
      } catch (e) {
        console.error(e);
      }

      return { token, tokenPayload, appConfig: Config };
    },
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: Config.get('app_port') }, resolve)
  );

  console.log(
    `🚀 Server ready at http${isProduction ? 's' : ''}://localhost:${Config.get('app_port')}${
      server.graphqlPath
    }`
  );
})();

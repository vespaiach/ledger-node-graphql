import { PrismaClient } from '@prisma/client';

let dbClient: PrismaClient;
if (process.env.NODE_ENV === 'development') {
  dbClient = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
  });

  // @ts-ignore: Unreachable code error
  dbClient.$on('query', (e) => {
    // @ts-ignore: Unreachable code error
    console.log('Query: ' + e.query);
    // @ts-ignore: Unreachable code error
    console.log('Duration: ' + e.duration + 'ms');
  });
} else {
  dbClient = new PrismaClient();
}

export { dbClient };

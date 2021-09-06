import { DataSource } from 'apollo-datasource';

import { PrismaClient } from '@prisma/client';

import { TransactionModel } from 'src/schema/types';

export class TransactionDS extends DataSource {
  private dbClient: PrismaClient;

  constructor({ dbClient }: { dbClient: PrismaClient }) {
    super();
    this.dbClient = dbClient;
  }

  public async getTransactionsByReasonId(reasonId: number): Promise<TransactionModel[]> {
    return await this.dbClient.transaction.findMany({
      orderBy: [
        {
          updatedAt: 'desc',
        },
      ],
      where: {
        reasonId,
      },
      select: {
        id: true,
        amount: true,
        date: true,
        description: true,
        updatedAt: true,
      },
    });
  }

  public async getTransactionsByDate(date: Date): Promise<TransactionModel[]> {
    const startDay = new Date(date.getTime());
    const endDay = new Date(date.getTime());

    startDay.setHours(0);
    startDay.setMinutes(0);
    startDay.setSeconds(0);

    endDay.setHours(23);
    endDay.setMinutes(59);
    endDay.setSeconds(59);

    return await this.dbClient.transaction.findMany({
      orderBy: [
        {
          updatedAt: 'desc',
        },
      ],
      where: {
        date: {
          gte: startDay,
          lte: endDay,
        },
      },
      select: {
        id: true,
        amount: true,
        date: true,
        description: true,
        updatedAt: true,
      },
    });
  }
}

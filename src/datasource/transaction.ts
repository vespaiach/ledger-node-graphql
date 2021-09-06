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
        reasonId: true,
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

    return this.getTransactionsByDates(startDay, endDay);
  }

  public getTransactionsByYear(year: number): Promise<TransactionModel[]> {
    const fromDate = new Date(year, 0, 1, 0, 0, 0);
    const toDate = new Date(year, 11, 31, 23, 59, 59);

    return this.getTransactionsByDates(fromDate, toDate);
  }

  public getTransactionsByMonth(year: number, month: number): Promise<TransactionModel[]> {
    const fromDate = new Date(year, month, 1, 0, 0, 0);
    const toDate = new Date(fromDate.getTime());
    toDate.setMonth(fromDate.getMonth() + 1);
    toDate.setDate(1);
    toDate.setHours(23);
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    return this.getTransactionsByDates(fromDate, toDate);
  }

  public async getTransactionsByDates(fromDate: Date, toDate: Date): Promise<TransactionModel[]> {
    return await this.dbClient.transaction.findMany({
      orderBy: [
        {
          updatedAt: 'desc',
        },
      ],
      where: {
        date: {
          gte: fromDate,
          lte: toDate,
        },
      },
      select: {
        id: true,
        amount: true,
        date: true,
        description: true,
        updatedAt: true,
        reasonId: true,
      },
    });
  }
}

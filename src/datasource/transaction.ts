import { DataSource } from 'apollo-datasource';

import { PrismaClient, Prisma } from '@prisma/client';

import { TransactionModel } from 'src/schema/types';
import { Maybe } from 'graphql/jsutils/Maybe';

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

  public async getTransactionsByDates(
    fromDate: Maybe<Date>,
    toDate: Maybe<Date>
  ): Promise<TransactionModel[]> {
    const date: { [key in string]: Date } = {};

    if (fromDate) {
      date.gte = fromDate;
    }
    if (toDate) {
      date.lte = toDate;
    }

    const query: Prisma.SelectSubset<
      Prisma.TransactionFindManyArgs,
      Prisma.TransactionFindManyArgs
    > = {
      orderBy: [
        {
          updatedAt: 'desc',
        },
      ],
      select: {
        id: true,
        amount: true,
        date: true,
        description: true,
        updatedAt: true,
        reasonId: true,
      },
    };

    if (fromDate || toDate) {
      query.where = { date };
    }

    return await this.dbClient.transaction.findMany(query);
  }

  public getTransactionsByAmount(
    fromAmount: Maybe<number>,
    toAmount: Maybe<number>
  ): Promise<TransactionModel[]> {
    const amount: { [key in string]: number } = {};

    if (fromAmount !== null && fromAmount !== undefined) {
      amount.gte = fromAmount;
    }
    if (toAmount !== null && toAmount !== undefined) {
      amount.lte = toAmount;
    }

    const query: Prisma.SelectSubset<
      Prisma.TransactionFindManyArgs,
      Prisma.TransactionFindManyArgs
    > = {
      orderBy: [
        {
          updatedAt: 'desc',
        },
      ],
      select: {
        id: true,
        amount: true,
        date: true,
        description: true,
        updatedAt: true,
        reasonId: true,
      },
    };

    if (Object.keys(amount).length) {
      query.where = { amount };
    }

    return this.dbClient.transaction.findMany(query);
  }

  public addTransaction(
    date: Date,
    amount: number,
    reasonId: number,
    description?: string | null
  ): Promise<TransactionModel> {
    return this.dbClient.transaction.create({
      data: {
        date,
        amount,
        reasonId,
        description,
        updatedAt: new Date(),
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

  public updateTransaction(
    id: number,
    {
      date,
      amount,
      reasonId,
      description,
    }: {
      date: Maybe<Date>;
      amount: Maybe<number>;
      reasonId: Maybe<number>;
      description: Maybe<string>;
    }
  ): Promise<TransactionModel> {
    const data: { [key in string]: Date | number | string | null } = {};
    if (date) {
      data.date = date;
    }
    if (amount !== null && amount !== undefined) {
      data.amount = amount;
    }
    if (reasonId) {
      data.reasonId = reasonId;
    }
    if (description !== undefined) {
      data.description = description;
    }
    data.updatedAt = new Date();

    return this.dbClient.transaction.update({
      data,
      where: {
        id,
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

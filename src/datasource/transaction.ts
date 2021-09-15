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

  public getTransactions(
    fromDate: Maybe<Date>,
    toDate: Maybe<Date>,
    fromAmount: Maybe<number>,
    toAmount: Maybe<number>,
    reason: Maybe<number>,
    sortBy: { date?: 'desc' | 'asc'; amount?: 'desc' | 'asc' },
    offset: number,
    limit: number
  ): Promise<TransactionModel[]> {
    const where: Prisma.TransactionWhereInput = {};
    let orderBy: Prisma.Enumerable<Prisma.TransactionOrderByWithRelationInput> = {};

    if (fromDate) {
      where.date = <Prisma.DateTimeFilter>(where.date || {});
      where.date.gte = fromDate;
    }
    if (toDate) {
      where.date = <Prisma.DateTimeFilter>(where.date || {});
      where.date.lte = toDate;
    }

    if (fromAmount) {
      where.amount = <Prisma.DecimalFilter>(where.amount || {});
      where.amount.gte = fromAmount;
    }
    if (toAmount) {
      where.amount = <Prisma.DecimalFilter>(where.amount || {});
      where.amount.lte = toAmount;
    }

    if (reason) {
      where.reasonId = reason;
    }

    if (sortBy) {
      orderBy = [sortBy];
    }

    const query: Prisma.SelectSubset<
      Prisma.TransactionFindManyArgs,
      Prisma.TransactionFindManyArgs
    > = {
      skip: offset,
      take: limit,
      where,
      orderBy,
      select: {
        id: true,
        amount: true,
        date: true,
        description: true,
        updatedAt: true,
        reasonId: true,
      },
    };

    return this.dbClient.transaction.findMany(query);
  }

  public countTransactions(
    fromDate: Maybe<Date>,
    toDate: Maybe<Date>,
    fromAmount: Maybe<number>,
    toAmount: Maybe<number>,
    reason: Maybe<number>
  ): Promise<number> {
    const where: Prisma.TransactionWhereInput = {};

    if (fromDate) {
      where.date = <Prisma.DateTimeFilter>(where.date || {});
      where.date.gte = fromDate;
    }
    if (toDate) {
      where.date = <Prisma.DateTimeFilter>(where.date || {});
      where.date.lte = toDate;
    }

    if (fromAmount) {
      where.amount = <Prisma.DecimalFilter>(where.amount || {});
      where.amount.gte = fromAmount;
    }
    if (toAmount) {
      where.amount = <Prisma.DecimalFilter>(where.amount || {});
      where.amount.lte = toAmount;
    }

    if (reason) {
      where.reasonId = reason;
    }

    return this.dbClient.transaction.count({ where });
  }

  public getTransaction(id: number): Promise<TransactionModel | null> {
    return this.dbClient.transaction.findUnique({
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

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
    offset: number,
    limit: number
  ): Promise<TransactionModel[]> {
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

    const query: Prisma.SelectSubset<
      Prisma.TransactionFindManyArgs,
      Prisma.TransactionFindManyArgs
    > = {
      skip: offset,
      take: limit,
      where,
      orderBy: {
        date: 'desc',
      },
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

  public async getMonthGroups(
    fromDate: Maybe<Date>,
    toDate: Maybe<Date>,
    fromAmount: Maybe<number>,
    toAmount: Maybe<number>,
    reason: Maybe<number>
  ): Promise<{ month: Date; count: number }[]> {
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

    const result = await this.dbClient.transaction.groupBy({
      by: ['month'],
      where,
      _count: {
        id: true,
      },
      orderBy: {
        month: 'desc',
      },
    });

    return result
      .filter((r) => !!r.month)
      .map((r) => ({ month: r.month as Date, count: r._count.id }));
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
        month: true,
      },
    });
  }

  public deleteTransaction(id: number): Promise<TransactionModel> {
    return this.dbClient.transaction.delete({ where: { id } });
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
        month: new Date(
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01T00:00:00.000Z`
        ),
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
        month: true,
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
    const data: Prisma.TransactionUpdateInput = {};
    if (date) {
      data.date = date;
      data.month = new Date(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01T00:00:00.000Z`
      );
    }
    if (amount !== null && amount !== undefined) {
      data.amount = amount;
    }
    if (reasonId) {
      data.reason = {
        connect: {
          id: reasonId,
        },
      };
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
        month: true,
      },
    });
  }
}

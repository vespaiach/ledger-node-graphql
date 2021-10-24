import { DataSource } from 'apollo-datasource';
import { PrismaClient, Prisma } from '@prisma/client';

import { TransactionModel } from 'src/schema/types';
import { Maybe } from 'graphql/jsutils/Maybe';
import { GroupBy } from 'src/schema/types.generated';

export class TransactionDS extends DataSource {
  private dbClient: PrismaClient;

  constructor({ dbClient }: { dbClient: PrismaClient }) {
    super();
    this.dbClient = dbClient;
  }

  public getTransactions(startIndex: number, stopIndex: number): Promise<TransactionModel[]> {
    return this.dbClient.transaction.findMany({
      where: {
        id: {
          gte: startIndex,
          lte: stopIndex,
        },
      },
    });
  }

  public async updateTransactionFilter(
    dateFrom: Maybe<Date>,
    dateTo: Maybe<Date>,
    amountFrom: Maybe<number>,
    amountTo: Maybe<number>,
    groupBy?: GroupBy
  ): Promise<{ orders: number[]; groups: GroupRow[] }> {
    const where: Prisma.TransactionWhereInput = {};

    if (dateFrom) {
      where.date = <Prisma.DateTimeFilter>(where.date || {});
      where.date.gte = dateFrom;
    }
    if (dateTo) {
      where.date = <Prisma.DateTimeFilter>(where.date || {});
      where.date.lte = dateTo;
    }

    if (amountFrom) {
      where.amount = <Prisma.DecimalFilter>(where.amount || {});
      where.amount.gte = amountFrom;
    }
    if (amountTo) {
      where.amount = <Prisma.DecimalFilter>(where.amount || {});
      where.amount.lte = amountTo;
    }

    if (groupBy === GroupBy.Month) {
      const monthGroups = await this.dbClient.transaction.groupBy({
        by: ['month'],
        where,
        _count: {
          id: true,
        },
        _sum: {
          amount: true,
        },
        orderBy: {
          month: 'desc',
        },
      });

      const ids = await this.dbClient.transaction.findMany({
        where,
        select: { id: true },
        orderBy: {
          date: 'desc',
        },
      });

      const groups: GroupRow[] = [];
      let offset = 0;
      monthGroups.forEach((m) => {
        const item = { month: m.month, offset, amount: m._sum.amount?.e || 0 };
        offset += m._count.id;
        groups.push(item);
      });

      return {
        orders: ids.map((it) => it.id),
        groups,
      };
    } else {
      const reasonGroups = await this.dbClient.transaction.groupBy({
        by: ['reasonId'],
        where,
        _count: {
          id: true,
        },
        _sum: {
          amount: true,
        },
        orderBy: {
          reasonId: 'asc',
        },
      });

      const ids = await this.dbClient.transaction.findMany({
        where,
        select: { id: true },
        orderBy: {
          reasonId: 'asc',
        },
      });

      const groups: GroupRow[] = [];
      let offset = 0;
      reasonGroups.forEach((m) => {
        const item = { reason: m.reasonId, offset, amount: m._sum.amount?.e || 0 };
        offset += m._count.id;
        groups.push(item);
      });

      return {
        orders: ids.map((it) => it.id),
        groups,
      };
    }
  }

  public getTransactionByIds(ids: number[]): Promise<TransactionModel[]> {
    return this.dbClient.transaction.findMany({
      where: {
        id: {
          in: ids,
        },
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

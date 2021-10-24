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
    reason: Maybe<number>,
    groupBy?: GroupBy
  ): Promise<{ totalRecords: number; groups: GroupRow[] }> {
    const whereStr: string[] = [];
    const where: Prisma.TransactionWhereInput = {};

    if (dateFrom) {
      whereStr.push(`date >= ${dateFrom.toISOString()}`);

      where.date = <Prisma.DateTimeFilter>(where.date || {});
      where.date.gte = dateFrom;
    }
    if (dateTo) {
      whereStr.push(`date <= ${dateTo.toISOString()}`);

      where.date = <Prisma.DateTimeFilter>(where.date || {});
      where.date.lte = dateTo;
    }

    if (amountFrom) {
      whereStr.push(`amount >= ${amountFrom}`);

      where.amount = <Prisma.DecimalFilter>(where.amount || {});
      where.amount.gte = amountFrom;
    }
    if (amountTo) {
      whereStr.push(`amount <= ${amountTo}`);

      where.amount = <Prisma.DecimalFilter>(where.amount || {});
      where.amount.lte = amountTo;
    }

    if (reason) {
      whereStr.push(`reason_id = ${reason}`);

      where.reasonId = reason;
    }

    await this.dbClient.filterInput.deleteMany();

    const filterObj = await this.dbClient.filterInput.create({
      data: {
        dateFrom,
        dateTo,
        amountFrom,
        amountTo,
        reasonId: reason,
        groupBy,
      },
    });

    await this.dbClient.$executeRaw`ALTER SEQUENCE transactions_id_seq RESTART`;

    let totalRecords = 0;
    const groups: GroupRow[] = [];

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

      monthGroups
        .filter((r) => !!r.month)
        .forEach(async (m) => {
          const groupBy = {
            month: m.month?.toISOString(),
            offset: totalRecords,
            amount: m._sum.amount?.e || 0,
          };
          groups.push({
            month: m.month,
            offset: totalRecords,
            amount: m._sum.amount?.e || 0,
          });
          try {
            if (whereStr.length > 0) {
              totalRecords += (await this.dbClient
                .$executeRaw`
                INSERT INTO filter_results(filter_input_id, group_by, transaction_id) VALUES (${filterObj.id}, ${JSON.stringify(groupBy)}, null);
                INSERT INTO filter_results(filter_input_id, group_by, transaction_id) SELECT ${
                filterObj.id
              }, null, id FROM transactions WHERE ${whereStr.join(' AND ')};`) as number;
            } else {
              totalRecords += (await this.dbClient
                .$executeRaw`INSERT INTO filter_results(filter_input_id, group_by, transaction_id) SELECT ${filterObj.id}, null, id FROM transactions;`) as number;
            }
          } catch (e) {
            console.error(e);
          }
        });
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

      reasonGroups.forEach(async (r, i) => {
        const groupBy = { reason: r, totalRecords: r._count.id, totalAmount: r._sum.amount };
        totalRecords += (await this.dbClient.$executeRaw`
            INSERT INTO filter_result(filter_input_id, group_by, transaction_id)
            VALUES (${filterObj.id}, ${totalRecords + i + 1}, ${JSON.stringify(groupBy)}, null);
            INSERT INTO filter_result(filter_input_id, group_by, transaction_id)
            SELECT ${filterObj.id}, null, id FROM transaction
            ${whereStr.length > 0 ? ` WHERE ${whereStr.join(' AND ')}` : ''};`) as number;
      });
    }

    return { totalRecords, groups };
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

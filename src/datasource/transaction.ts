import { DataSource } from 'apollo-datasource';
import { PrismaClient } from '@prisma/client';

import { TransactionModel } from '@schema/types';
import {
  MutationCreateTransactionArgs,
  MutationDeleteTransactionArgs,
  MutationUpdateTransactionArgs,
  QueryGetTransactionsArgs,
  TransactionType,
} from '@schema/types.generated';

export class TransactionDS extends DataSource {
  private dbClient: PrismaClient;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
  }

  public getTransactions(args: QueryGetTransactionsArgs): Promise<TransactionModel[]> {
    const take = args.take ?? 50;
    return this.dbClient.transaction.findMany({
      take,
      skip: 1,
      cursor: args.lastCursor
        ? {
            id: args.lastCursor,
          }
        : undefined,
      where: {
        date:
          args.fromDate || args.toDate
            ? {
                gte: args.fromDate ? args.fromDate : undefined,
                lte: args.toDate ? args.toDate : undefined,
              }
            : undefined,

        amount:
          args.fromAmount || args.toAmount
            ? {
                gte:
                  args.transactionType === TransactionType.Income
                    ? 0
                    : args.fromAmount
                    ? args.fromAmount
                    : undefined,
                lte:
                  args.transactionType === TransactionType.Income
                    ? 0
                    : args.toAmount
                    ? args.toAmount
                    : undefined,
              }
            : undefined,

        reasonId: args.reasonId ? args.reasonId : undefined,
      },
    });
  }

  public createTransaction(args: MutationCreateTransactionArgs): Promise<TransactionModel> {
    return this.dbClient.transaction.create({
      include: { reason: true },
      data: {
        date: args.date,
        amount: args.amount,
        reasonId: args.reasonId,
        note: args.note,
        updatedAt: new Date(),
      },
    });
  }

  public updateTransaction(args: MutationUpdateTransactionArgs): Promise<TransactionModel> {
    return this.dbClient.transaction.update({
      include: { reason: true },
      data: {
        date: args.date ? args.date : undefined,
        amount: args.amount ? args.amount : undefined,
        reasonId: args.reasonId ? args.reasonId : undefined,
        note: args.note ? args.note : undefined,
        updatedAt: new Date(),
      },
      where: {
        id: args.id,
      },
    });
  }

  public async deleteTransaction(args: MutationDeleteTransactionArgs): Promise<void> {
    await this.dbClient.transaction.delete({
      where: {
        id: args.id,
      },
    });
  }
}

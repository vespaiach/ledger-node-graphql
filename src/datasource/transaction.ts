import { DataSource } from 'apollo-datasource';
import { PrismaClient } from '@prisma/client';

import { ReasonModel, TransactionModel } from '@schema/types';
import {
  MutationCreateTransactionArgs,
  MutationDeleteTransactionArgs,
  MutationUpdateTransactionArgs,
  QueryGetTransactionArgs,
  QueryGetTransactionsArgs,
} from '@schema/types.generated';
import { ReasonDS } from './reason';

export class TransactionDS extends DataSource {
  private dbClient: PrismaClient;
  private reasonDS: ReasonDS;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
    this.reasonDS = new ReasonDS(this.dbClient);
  }

  public async getTransactions(
    args: QueryGetTransactionsArgs,
    userId: number
  ): Promise<TransactionModel[]> {
    const take = args.take ?? 50;
    const skip = args.skip ?? 0;

    const gteAmount = args.fromAmount || undefined;
    const lteAmount = args.toAmount || undefined;

    let reasons: Record<string, unknown> | undefined = undefined;
    if (args.reasons && args.reasons.length) {
      const reasonsList: ReasonModel[] = [];

      args.reasons.forEach(async (t) => {
        const r = await this.reasonDS.getReasonByText(t);
        if (r) {
          reasonsList.push(r);
        }
      });

      if (reasonsList && reasonsList.length) {
        reasons = {
          id: { in: reasonsList.map((r) => r.id) },
        };
      }
    }

    const result = await this.dbClient.transaction.findMany({
      orderBy: {
        date: 'desc',
      },
      take,
      skip,
      where: {
        userId,

        date:
          args.fromDate || args.toDate
            ? {
                gte: args.fromDate ? args.fromDate : undefined,
                lte: args.toDate ? args.toDate : undefined,
              }
            : undefined,

        amount:
          gteAmount || lteAmount
            ? {
                gte: gteAmount,
                lte: lteAmount,
              }
            : undefined,

        reasons,
      },
    });

    return result as TransactionModel[];
  }

  public getTransaction(
    args: QueryGetTransactionArgs,
    userId: number
  ): Promise<TransactionModel | null> {
    return this.dbClient.transaction.findFirst({
      where: { id: args.id, userId },
    });
  }

  /**
   * Refer to this for more information about explicit many-to-many relationship
   * https://www.prisma.io/docs/concepts/components/prisma-schema/relations/many-to-many-relations
   */
  public async createTransaction(
    args: MutationCreateTransactionArgs,
    userId: number
  ): Promise<TransactionModel> {
    const reasons = await this.reasonDS.getOrCreateReasons(args.reasons);

    return this.dbClient.transaction.create({
      include: { reasons: true },
      data: {
        date: args.date,
        amount: args.amount,
        note: args.note,
        updatedAt: new Date(),
        reasons: {
          create: reasons.map((r) => ({ reason: { connect: { id: r.id } } })),
        },
        userId,
      },
    });
  }

  public async updateTransaction(
    args: MutationUpdateTransactionArgs,
    userId: number
  ): Promise<TransactionModel | null> {
    const tran = await this.dbClient.transaction.findFirst({
      include: { reasons: true },
      where: { id: args.id, userId },
    });

    if (!tran) return null;

    let reasonsObj: ReasonModel[] | undefined = undefined;
    if (args.reasons && args.reasons.length) {
      reasonsObj = await this.reasonDS.getOrCreateReasons(args.reasons);
    }

    // To update transactions-reasons table, we delete the whole old relationships
    // and re-create new ones.
    return this.dbClient.transaction.update({
      include: { reasons: true },
      data: {
        date: args.date ? args.date : undefined,
        amount: args.amount ? args.amount : undefined,
        note: args.note ? args.note : undefined,
        updatedAt: new Date(),
        reasons: reasonsObj
          ? {
              delete: tran.reasons.map((r) => ({ reasonId_transactionId: r })),
              create: reasonsObj?.map((r) => ({ reason: { connect: { id: r.id } } })),
            }
          : undefined,
      },
      where: {
        id: args.id,
      },
    });
  }

  public async deleteTransaction(
    args: MutationDeleteTransactionArgs,
    userId: number
  ): Promise<void> {
    const tran = await this.dbClient.transaction.findFirst({
      include: { reasons: true },
      where: { id: args.id, userId },
    });

    if (!tran) return;

    await this.dbClient.transaction.delete({
      where: {
        id: args.id,
      },
    });
  }
}

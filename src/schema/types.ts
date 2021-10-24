import { PrismaClient, Reason, Transaction } from '@prisma/client';
import { ReasonDS } from 'src/datasource/reason';
import { TransactionDS } from 'src/datasource/transaction';

export interface CustomContext {
  prisma: PrismaClient;
  dataSources: {
    reasonDs: ReasonDS;
    transactionDs: TransactionDS;
  };
}

export type ReasonModel = Reason;
export type TransactionModel = Transaction;

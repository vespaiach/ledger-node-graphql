import { PrismaClient, Reason, Transaction, DailySpend } from '@prisma/client';
import { ReasonDS } from 'src/datasource/reason';
import { TransactionDS } from 'src/datasource/transaction';
import { DailySpendDS } from 'src/datasource/dailySpend';

export interface CustomContext {
  prisma: PrismaClient;
  dataSources: {
    reasonDs: ReasonDS;
    transactionDs: TransactionDS;
    dailySpendDs: DailySpendDS;
  };
}

export type ReasonModel = Reason;
export type TransactionModel = Transaction;
export type DailyBalanceModel = DailySpend;

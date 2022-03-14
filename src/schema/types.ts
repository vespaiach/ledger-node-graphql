import { PrismaClient, Reason, Transaction, DailySpend, Token } from '@prisma/client';
import { ReasonDS } from 'src/datasource/reason';
import { TransactionDS } from 'src/datasource/transaction';
import { DailySpendDS } from 'src/datasource/dailySpend';
import { TokenDS } from '@datasource/token';
import { GmailSmtp } from '@datasource/smtp';

export interface CustomContext {
  prisma: PrismaClient;
  dataSources: {
    reasonDs: ReasonDS;
    transactionDs: TransactionDS;
    dailySpendDs: DailySpendDS;
    tokenDs: TokenDS;
    smtpDs: GmailSmtp;
  };
}

export type ReasonModel = Reason;
export type TransactionModel = Transaction;
export type DailyBalanceModel = DailySpend;
export type TokenModel = Token;

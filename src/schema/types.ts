import { Reason, Transaction, DailySpend, Token } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

import { ReasonDS } from 'src/datasource/reason';
import { TransactionDS } from 'src/datasource/transaction';
import { DailySpendDS } from 'src/datasource/dailySpend';
import { TokenDS } from '@datasource/token';
import { GmailSmtp } from '@datasource/smtp';
import Config from 'src/config';

export interface CacheValue {
  key: string;
  email: string;
  createdAt: Date;
  revokedAt: Date;
}

export interface CustomContext {
  appConfig: typeof Config;
  tokenPayload: JwtPayload | null;
  token: string;
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

import { Reason, Transaction, User } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

import { ReasonDS } from 'src/datasource/reason';
import { TransactionDS } from 'src/datasource/transaction';
import { UserDS } from '@datasource/user';
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
    userDs: UserDS;
  };
}

export type ReasonModel = Reason;
export type UserModel = User;
export type TransactionModel = Transaction;

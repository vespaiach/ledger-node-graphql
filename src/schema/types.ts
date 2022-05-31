import { JwtPayload } from 'jsonwebtoken';

import { ReasonDS } from 'src/datasource/reason';
import { TransactionDS } from 'src/datasource/transaction';
import { UserDS } from '@datasource/user';
import { TokenDS } from '@datasource/token';
import Config from 'src/config';
import { Resolver, Resolvers, ResolversTypes, TransactionResolvers } from './types.generated';

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
    tokenDs: TokenDS;
  };
}

export interface ReasonModel {
  id: number;
  text: string;
  updatedAt: Date;
  createdAt: Date;
}
export interface UserModel {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  updatedAt: Date;
  createdAt: Date;
}
export interface TransctionModel {
  id: number;
  amount: number;
  date: Date;
  note: string | null;
  updatedAt: Date;
  createdAt: Date;
  userId: number;
}

export type RevisedResolvers<ContextType = CustomContext> = Omit<Resolvers, 'Transaction'> & {
  Transaction?: Omit<TransactionResolvers<ContextType>, 'reasons'> & {
    reasons?: Resolver<
      Array<ResolversTypes['Reason']>,
      TransctionModel & {
        reasons: {
          reasonId: number;
          transactionId: number;
          updatedAt: Date;
        }[];
      },
      ContextType
    >;
  };
};

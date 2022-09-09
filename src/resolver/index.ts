import { ApolloError } from 'apollo-server-errors';
import {
  VoidResolver,
  DateTimeResolver,
  NonEmptyStringResolver,
  EmailAddressResolver,
  BigIntResolver
} from 'graphql-scalars';

import { hashPassword, comparePassword, issueToken } from '@util/hashing';
import { Resolvers } from '@schema/types.generated';
import { authorize } from '@util/authorize';

class LedgerResolvers {
  constructor() { }

  DateTime = DateTimeResolver;
  Void = VoidResolver;
  NonEmptyString = NonEmptyStringResolver;
  EmailAddress = EmailAddressResolver;
  BigInt = BigIntResolver;

  @authorize
  private getReasons(_, __, context) {
    const { reasonDs } = context.dataSources;
    return reasonDs.getReasons();
  }

  @authorize
  private getTransaction(_, args, context, userId) {

    const { transactionDs } = context.dataSources;
    return transactionDs.getTransaction(args, userId);
  }

  @authorize
  private async getTransactions(_, args, context, userId) {
    const { transactionDs } = context.dataSources;
    const take = args.take ?? 50;
    const skip = args.skip ?? 0;

    return {
      ...(await transactionDs.getTransactions({ ...args, skip, take }, userId)),
      take,
      skip,
    };
  }

  @authorize
  private async reasons(trans, _, context) {
    const { reasonDs } = context.dataSources;

    return reasonDs.getReasonsByTransactionId({ transactionId: trans.id });
  }

  @authorize
  private async createTransaction(_, args, context, userId) {
    const { transactionDs } = context.dataSources;

    return transactionDs.createTransaction(args, userId);
  }

  @authorize
  private async updateTransaction(_, args, context, userId) {
    const { transactionDs } = context.dataSources;

    return transactionDs.updateTransaction(args, userId);
  }

  @authorize
  private async deleteTransaction(_, args, context, userId) {
    const { transactionDs } = context.dataSources;

    await transactionDs.deleteTransaction(args, userId);

    return true;
  }

  private async createUser(_, args, context) {
    const { userDs } = context.dataSources;

    return await userDs.create({ ...args, password: hashPassword(args.password) });
  }

  @authorize
  private async updateUser(_, args, context, userId) {
    const { userDs } = context.dataSources;

    const password = args.password ? hashPassword(args.password) : undefined;

    return await userDs.update({ ...args, password, id: userId });
  }

  private async signin(_, { username, password }, context) {
    const { appConfig } = context;
    const { userDs } = context.dataSources;

    const user = await userDs.getUserByUsername({ username });
    if (user && (await comparePassword(password, user.password)) && user.isActive) {
      return issueToken({ user, appConfig });
    }

    throw new ApolloError(`Username or password was not correct!`);
  }

  @authorize
  private async signout(_, __, context) {
    const { tokenDs } = context.dataSources;

    await tokenDs.revoke({ token: context.token, exp: new Date((context.tokenPayload.exp as number) * 1000) });
  }

  get Query() {
    return {
      getReasons: this.getReasons,
      getTransaction: this.getTransaction,
      getTransactions: this.getTransactions
    }
  }

  get Mutation() {
    return {
      signin: this.signin,
      signout: this.signout,
      updateUser: this.updateUser,
      createUser: this.createUser,
      deleteTransaction: this.deleteTransaction,
      updateTransaction: this.updateTransaction,
      createTransaction: this.createTransaction,
    }
  }

  get Transaction() {
    /**
     * n+1
     * Prisma will batch queries with dataloader. Refer to this link:
     * https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance
     */
    return {
      reasons: this.reasons
    }
  }
}

export const resolvers: Resolvers = new LedgerResolvers()
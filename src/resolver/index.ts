import { ApolloError, AuthenticationError } from 'apollo-server-errors';
import {
  VoidResolver,
  DateTimeResolver,
  NonEmptyStringResolver,
  EmailAddressResolver,
} from 'graphql-scalars';

import { CustomContext } from '@schema/types';
import { hashPassword, comparePassword, issueToken } from '@util/hashing';
import { Resolvers } from '@schema/types.generated';

function throwIfNotSignedIn(context: CustomContext): { exp: Date; token: string; userId: number } {
  const { tokenPayload, token } = context;

  if (!tokenPayload) throw new AuthenticationError('sign-in to continue');

  return {
    userId: parseInt(context.tokenPayload?.aud as string),
    token,
    exp: new Date((tokenPayload.exp as number) * 1000),
  };
}

export const resolvers: Resolvers = {
  DateTime: DateTimeResolver,
  Void: VoidResolver,
  NonEmptyString: NonEmptyStringResolver,
  EmailAddress: EmailAddressResolver,

  Query: {
    getReasons: (_, __, context) => {
      throwIfNotSignedIn(context);

      const { reasonDs } = context.dataSources;
      return reasonDs.getReasons();
    },

    getTransaction: (_, args, context) => {
      const { userId } = throwIfNotSignedIn(context);

      const { transactionDs } = context.dataSources;
      return transactionDs.getTransaction(args, userId);
    },

    getTransactions: async (_, args, context) => {
      const { userId } = throwIfNotSignedIn(context);

      const { transactionDs } = context.dataSources;
      const take = args.take ?? 50;
      const skip = args.skip ?? 0;

      return {
        ...(await transactionDs.getTransactions({ ...args, skip, take }, userId)),
        take,
        skip,
      };
    },
  },

  Transaction: {
    /**
     * n+1
     * Prisma will batch queries with dataloader. Refer to this link:
     * https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance
     */
    reasons: async (trans, _, context) => {
      throwIfNotSignedIn(context);

      const { reasonDs } = context.dataSources;

      return reasonDs.getReasonsByTransactionId({ transactionId: trans.id });
    },
  },

  Mutation: {
    createTransaction: async (_, args, context) => {
      const { userId } = throwIfNotSignedIn(context);
      const { transactionDs } = context.dataSources;

      return transactionDs.createTransaction(args, userId);
    },

    updateTransaction: async (_, args, context) => {
      const { userId } = throwIfNotSignedIn(context);
      const { transactionDs } = context.dataSources;

      return transactionDs.updateTransaction(args, userId);
    },

    deleteTransaction: async (_, args, context) => {
      const { userId } = throwIfNotSignedIn(context);

      const { transactionDs } = context.dataSources;

      await transactionDs.deleteTransaction(args, userId);

      return true;
    },

    createUser: async (_, args, context) => {
      const { userDs } = context.dataSources;

      return await userDs.create({ ...args, password: hashPassword(args.password) });
    },

    updateUser: async (_, args, context) => {
      const { userId } = throwIfNotSignedIn(context);
      const { userDs } = context.dataSources;

      const password = args.password ? hashPassword(args.password) : undefined;

      return await userDs.update({ ...args, password, id: userId });
    },

    signin: async (_, { username, password }, context) => {
      const { appConfig } = context;
      const { userDs } = context.dataSources;

      const user = await userDs.getUserByUsername({ username });
      if (user && (await comparePassword(password, user.password)) && user.isActive) {
        return issueToken({ user, appConfig });
      }

      throw new ApolloError(`Username or password was not correct!`);
    },

    signout: async (_, __, context) => {
      const { token, exp } = throwIfNotSignedIn(context);
      const { tokenDs } = context.dataSources;

      await tokenDs.revoke({ token, exp });
    },
  },
};

import { ApolloError, AuthenticationError } from 'apollo-server-errors';
import jwt from 'jsonwebtoken';

import { Resolvers } from '@schema/types.generated';
import { CustomContext, UserModel } from '@schema/types';
import { Config } from 'src/config';
import { comparePassword, hashPassword } from 'src/util/hash';

function throwIfNotSignedIn(context: CustomContext): { exp: Date; token: string; userId: number } {
  const { tokenPayload, token } = context;

  if (!tokenPayload) throw new AuthenticationError('sign-in to continue');

  return {
    userId: parseInt(context.tokenPayload?.aud as string),
    token,
    exp: new Date((tokenPayload.exp as number) * 1000),
  };
}

function issueToken({ user, appConfig }: { user: UserModel; appConfig: Config }): string {
  const expiresIn =
    Math.round(Date.now() / 1000) + appConfig.get('signin_token_available_time') * 60;

  const token = jwt.sign(
    { email: user.email, exp: expiresIn, aud: String(user.id) },
    appConfig.get('signin_jwt_secret'),
    {
      algorithm: appConfig.get('signin_jwt_algorithm'),
    }
  );

  return token;
}

export const resolvers: Resolvers = {
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

    getTransactions: (_, args, context) => {
      const { userId } = throwIfNotSignedIn(context);

      const { transactionDs } = context.dataSources;
      return transactionDs.getTransactions(args, userId);
    },
  },

  Transaction: {
    /**
     * Prisma will resolve the n+1 problem. Don't need DataLoader lib.
     */
    reasons: async (trans, _, context) => {
      throwIfNotSignedIn(context);

      const { reasonDs } = context.dataSources;
      const reasons = await reasonDs.getReasonsByTransactionId({ transactionId: trans.id });

      return reasons;
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

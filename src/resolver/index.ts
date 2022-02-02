import { ApolloError, UserInputError } from 'apollo-server-errors';

import { Resolvers } from '@schema/types.generated';

export const resolvers: Resolvers = {
  Query: {
    getReasons: (_, __, context) => {
      const { reasonDs } = context.dataSources;
      return reasonDs.getReasons();
    },

    getTransactions: (_, args, context) => {
      const { transactionDs } = context.dataSources;
      return transactionDs.getTransactions(args);
    },
  },

  Transaction: {
    /**
     * Prisma will resolve the n+1 problem. Don't need DataLoader lib.
     */
    reason: async (trans, _, context) => {
      const { reasonDs } = context.dataSources;
      const reason = await reasonDs.getReasonById(trans.reasonId);

      if (!reason) {
        throw new ApolloError(`Reason with ID = ${trans.reasonId} doesn't exist.`);
      }

      return reason;
    },
  },

  Mutation: {
    createTransaction: async (_, args, context) => {
      const { reasonDs, transactionDs } = context.dataSources;

      const reason = await reasonDs.getReasonById(args.reasonId);

      if (!reason) throw new UserInputError(`Reason with id = ${args.reasonId} doesn't exist.`);

      return transactionDs.createTransaction(args);
    },

    updateTransaction: async (_, args, context) => {
      const { reasonDs, transactionDs } = context.dataSources;

      const reason = args.reasonId ? await reasonDs.getReasonById(args.reasonId) : undefined;

      if (reason === null) {
        throw new UserInputError(`Reason with id = ${args.reasonId} doesn't exist.`);
      }

      return transactionDs.updateTransaction(args);
    },

    deleteTransaction: async (_, args, context) => {
      const { transactionDs } = context.dataSources;

      await transactionDs.deleteTransaction(args);

      return true;
    },

    createReason: (_, args, context) => {
      const { reasonDs } = context.dataSources;

      return reasonDs.createReason(args);
    },

    updateReason: (_, args, context) => {
      const { reasonDs } = context.dataSources;

      return reasonDs.updateReason(args);
    },
  },
};

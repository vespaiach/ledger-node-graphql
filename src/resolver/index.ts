import { UserInputError } from 'apollo-server-errors';
import { Resolvers } from 'src/schema/types.generated';

export const resolvers: Resolvers = {
  Query: {
    reasons: (_, __, context) => {
      const { reasonDs } = context.dataSources;
      return reasonDs.getReasons();
    },

    transactionsByReason: (_, args, context) => {
      const { reasonId } = args;
      const { transactionDs } = context.dataSources;
      return transactionDs.getTransactionsByReasonId(reasonId);
    },

    transactionsByDate: (_, args, context) => {
      const dateFrom = args.input?.dateFrom ? new Date(args.input.dateFrom) : null;
      const dateTo = args.input?.dateTo ? new Date(args.input.dateTo) : null;
      const { transactionDs } = context.dataSources;

      if (dateFrom && dateTo && dateFrom > dateTo) {
        throw new UserInputError('Date from must be less than date to');
      }

      return transactionDs.getTransactionsByDates(dateFrom, dateTo);
    },

    transactionsByAmount: (_, args, context) => {
      const amountFrom = args.input?.amountFrom ?? null ;
      const amountTo = args.input?.amountTo ?? null;
      const { transactionDs } = context.dataSources;

      if (amountFrom && amountTo && amountFrom > amountTo) {
        throw new UserInputError('Amount from must be less than amount to');
      }

      return transactionDs.getTransactionsByAmount(amountFrom, amountTo);
    },
  },

  Transaction: {
    /**
     * Prisma will resolve the n+1 problem. Don't need DataLoader lib.
     */
    reason: (trans, _, context) => {
      const { reasonDs } = context.dataSources;
      return reasonDs.getReasonById(trans.reasonId);
    },
  },
};

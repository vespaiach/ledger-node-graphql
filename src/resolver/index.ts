import { Resolvers } from 'src/schema/types.generated';

export const resolvers: Resolvers = {
  Query: {
    reasons(_, __, context) {
      const { reasonDs } = context.dataSources;
      return reasonDs.getReasons();
    },

    transactionsByReason(_, args, context) {
      const { reasonId } = args;
      const { transactionDs } = context.dataSources;
      return transactionDs.getTransactionsByReasonId(reasonId);
    },

    transactionsByExactDate(_, args, context) {
      const { date } = args;
      const { transactionDs } = context.dataSources;
      return transactionDs.getTransactionsByDate(date);
    },
  },
};

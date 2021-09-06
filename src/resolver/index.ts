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

    transactionsByExactDate: (_, args, context) => {
      const { date } = args;
      const { transactionDs } = context.dataSources;
      return transactionDs.getTransactionsByDate(date);
    },

    transactionsByDates: (_, args, context) => {
      const { fromDate, toDate } = args;
      const { transactionDs } = context.dataSources;
      return transactionDs.getTransactionsByDates(fromDate, toDate);
    },

    transactionsByMonth: (_, args, context) => {
      const { year, month } = args;
      const { transactionDs } = context.dataSources;
      return transactionDs.getTransactionsByMonth(year, month);
    },

    transactionsByYear: (_, args, context) => {
      const { year } = args;
      const { transactionDs } = context.dataSources;
      return transactionDs.getTransactionsByYear(year);
    },
  },

  Transaction: {
    reason: (trans, _, context) => {
      const { reasonDs } = context.dataSources;
      return reasonDs.getReasonById(trans.reasonId);
    },
  },
};

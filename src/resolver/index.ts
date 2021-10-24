import { Reason } from '.prisma/client';
import { UserInputError } from 'apollo-server-errors';

import { ReasonDS } from 'src/datasource/reason';
import { ReasonModel } from 'src/schema/types';
import { Resolvers } from 'src/schema/types.generated';

async function lookupReason(reason: string, reasonDs: ReasonDS): Promise<ReasonModel> {
  const santizedReason = reason.toLowerCase();
  let reasonInfo = await reasonDs.getReasonByText(santizedReason);
  if (!reasonInfo) {
    reasonInfo = await reasonDs.addReason(santizedReason);
  }
  return reasonInfo;
}

function validateAndSanitize(args) {
  const dateFrom = args.input?.dateFrom ? new Date(args.input.dateFrom) : null;
  const dateTo = args.input?.dateTo ? new Date(args.input.dateTo) : null;
  const amountFrom = args.input?.amountFrom;
  const amountTo = args.input?.amountTo;
  const reason = args.input?.reason;

  if (dateFrom && dateTo && dateFrom > dateTo) {
    throw new UserInputError('Date from must be less than date to');
  }
  if (amountFrom && amountTo && amountFrom > amountTo) {
    throw new UserInputError('Amount from must be less than amount to');
  }

  return { dateFrom, dateTo, amountFrom, amountTo, reason, groupBy: args.input?.groupBy };
}

export const resolvers: Resolvers = {
  Query: {
    reasons: (_, __, context) => {
      const { reasonDs } = context.dataSources;
      return reasonDs.getReasons();
    },

    transactions: async (_, args, context) => {
      const { startIndex, stopIndex } = args;
      const { transactionDs } = context.dataSources;

      return await transactionDs.getTransactions(startIndex, stopIndex);
    },

    transactionById: (_, args, context) => {
      const { id } = args;
      const { transactionDs } = context.dataSources;
      return transactionDs.getTransaction(id);
    },
  },

  Mutation: {
    mutateTransaction: async (_, args, context) => {
      const { id, date, amount, description, reason } = args.input;
      const { reasonDs, transactionDs } = context.dataSources;

      if (!id) {
        if (!date) {
          throw new UserInputError('date is missing');
        }
        if (amount === null || amount === undefined) {
          throw new UserInputError('amount is missing');
        }
        if (!reason) {
          throw new UserInputError('reason is missing');
        }

        const reasonInfo = await lookupReason(reason, reasonDs);
        return await transactionDs.addTransaction(
          new Date(date),
          amount,
          reasonInfo.id,
          description
        );
      } else {
        let reasonId: number | null = null;
        if (reason) {
          const reasonInfo = await lookupReason(reason, reasonDs);
          reasonId = reasonInfo.id;
        }

        return await transactionDs.updateTransaction(id, {
          date: date ? new Date(date) : null,
          amount,
          description,
          reasonId,
        });
      }
    },

    deleteTransaction: async (_, args, context) => {
      const { id } = args;
      const { transactionDs } = context.dataSources;

      const deleted = await transactionDs.deleteTransaction(id);
      return Boolean(deleted.id);
    },

    filterTransaction: async (_, args, context) => {
      const { dateFrom, dateTo, amountFrom, amountTo, reason, groupBy } = validateAndSanitize(args);
      const { transactionDs } = context.dataSources;
      return {
        ...(await transactionDs.updateTransactionFilter(
          dateFrom,
          dateTo,
          amountFrom,
          amountTo,
          reason,
          groupBy
        )),
        groupBy,
      };
    },
  },

  Transaction: {
    /**
     * Prisma will resolve the n+1 problem. Don't need DataLoader lib.
     */
    reason: (trans, _, context) => {
      const { reasonDs } = context.dataSources;
      return reasonDs.getReasonById(trans.reasonId) as Promise<Reason>;
    },
  },
};

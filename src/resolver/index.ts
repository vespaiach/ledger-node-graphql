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
      const amountFrom = args.input?.amountFrom ?? null;
      const amountTo = args.input?.amountTo ?? null;
      const { transactionDs } = context.dataSources;

      if (amountFrom && amountTo && amountFrom > amountTo) {
        throw new UserInputError('Amount from must be less than amount to');
      }

      return transactionDs.getTransactionsByAmount(amountFrom, amountTo);
    },

    transactionsById: (_, args, context) => {
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

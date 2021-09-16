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

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 100;

function validateAndSanitize(args) {
  const dateFrom = args.input?.dateFrom ? new Date(args.input.dateFrom) : null;
  const dateTo = args.input?.dateTo ? new Date(args.input.dateTo) : null;
  const amountFrom = args.input?.amountFrom;
  const amountTo = args.input?.amountTo;
  const reason = args.input?.reason;
  const offset = args.input?.offset ?? DEFAULT_OFFSET;
  const limit = args.input?.limit ?? DEFAULT_LIMIT;

  if (dateFrom && dateTo && dateFrom > dateTo) {
    throw new UserInputError('Date from must be less than date to');
  }
  if (amountFrom && amountTo && amountFrom > amountTo) {
    throw new UserInputError('Amount from must be less than amount to');
  }

  return { dateFrom, dateTo, amountFrom, amountTo, reason, offset, limit };
}

export const resolvers: Resolvers = {
  Query: {
    reasons: (_, __, context) => {
      const { reasonDs } = context.dataSources;
      return reasonDs.getReasons();
    },

    transactions: (_, args, context) => {
      const { dateFrom, dateTo, amountFrom, amountTo, reason, offset, limit } =
        validateAndSanitize(args);
      const { transactionDs } = context.dataSources;

      return transactionDs.getTransactions(
        dateFrom,
        dateTo,
        amountFrom,
        amountTo,
        reason,
        offset,
        limit
      );
    },

    transactionById: (_, args, context) => {
      const { id } = args;
      const { transactionDs } = context.dataSources;
      return transactionDs.getTransaction(id);
    },

    totalPages: async (_, args, context) => {
      const { dateFrom, dateTo, amountFrom, amountTo, reason, limit } = validateAndSanitize(args);
      const { transactionDs } = context.dataSources;

      const total = await transactionDs.countTransactions(
        dateFrom,
        dateTo,
        amountFrom,
        amountTo,
        reason
      );

      return {
        totalPages: Math.floor(total / limit) + (total % limit === 0 ? 0 : 1),
        totalRecords: total,
      };
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

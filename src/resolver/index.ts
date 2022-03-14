import { ApolloError } from 'apollo-server-errors';
import { v4 as uuidv4 } from 'uuid';
import * as emailValidator from 'email-validator';

import { Resolvers } from '@schema/types.generated';

export const resolvers: Resolvers = {
  Query: {
    getReasons: (_, __, context) => {
      const { reasonDs } = context.dataSources;
      return reasonDs.getReasons();
    },

    getTransaction: (_, args, context) => {
      const { transactionDs } = context.dataSources;
      return transactionDs.getTransaction(args);
    },

    getTransactions: (_, args, context) => {
      const { transactionDs } = context.dataSources;
      return transactionDs.getTransactions(args);
    },

    getDailyBalance: (_, __, context) => {
      const { dailySpendDs } = context.dataSources;
      return dailySpendDs.read();
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

      const createdReason = await reasonDs.getReasonByText(args.reasonText);

      if (createdReason) {
        return transactionDs.createTransaction({ ...args, reasonId: createdReason.id });
      }

      const reason = await reasonDs.createReason({ text: args.reasonText }, [
        { amount: args.amount, date: args.date, note: args.note },
      ]);

      if (!reason.transactions?.[0]) {
        throw new ApolloError("Couldn't create transaction");
      }

      return reason.transactions[0];
    },

    updateTransaction: async (_, args, context) => {
      const { reasonDs, transactionDs } = context.dataSources;

      let reasonId: number | undefined = undefined;
      if (args.reasonText) {
        let reason = await reasonDs.getReasonByText(args.reasonText);

        if (!reason) {
          reason = await reasonDs.createReason({ text: args.reasonText });
        }

        reasonId = reason.id;
      }

      return transactionDs.updateTransaction({ ...args, reasonId });
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

    signin: async (_, { email }, context) => {
      if (!emailValidator.validate(email)) return 'invalid email address';

      const { allowEmails } = context;
      const { tokenDs, smtpDs } = context.dataSources;

      /**
       * Check if email address is allowed to sign in.
       * Config in: LEDGER_LOGIN
       */
      if (allowEmails?.length && !allowEmails.includes(email))
        return "the email address isn't allowed to sign in";

      /**
       * Stop users from spamming emails too much.
       */
      const lastSeen = new Date();
      lastSeen.setMinutes(-2);
      const record = await tokenDs.getLatestActiveRecord({ email, lastSeen });
      if (record !== null)
        return 'an instruction email has been sent to the email address, please follow that email to sign in.';

      const key = uuidv4();

      await Promise.all([tokenDs.create({ key, email }), smtpDs.send(email, key)]);

      return 'sent';
    },
  },
};

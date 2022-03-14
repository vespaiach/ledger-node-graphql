import { DataSource } from 'apollo-datasource';
import { PrismaClient } from '@prisma/client';

import { ReasonModel, TransactionModel } from '@schema/types';
import {
  MutationCreateReasonArgs,
  MutationCreateTransactionArgs,
  MutationDeleteReasonArgs,
  MutationUpdateReasonArgs,
} from '@schema/types.generated';

export type Token = {
  token: string;
  key: string;
  createdAt: Date;
  revoke: boolean;
  revokedAt: Date | null;
};

export class TokenDS extends DataSource {
  dbClient: PrismaClient;
  allowEmails: null | string[];

  constructor(dbClient: PrismaClient, allowEmails: null | string[] = null) {
    super();
    this.dbClient = dbClient;
    this.allowEmails = allowEmails;
  }

  public allow(email: string): boolean {
    if (this.allowEmails === null) return true;

    return this.allowEmails.includes(email);
  }

  public async checkSendingInterval(email: string): boolean {
    const record = await this.dbClient.token.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        email,
        token: null,
      },
      select: { createdAt: true },
    });
  }

  public async create(args: { key: string }): Promise<void> {
    await this.dbClient.token.create({
      data: {
        key: args.key,
        createdAt: new Date(),
      },
    });
  }

  public async update(args: { revoke?: boolean; key: string; token?: string }): Promise<void> {
    await this.dbClient.token.update({
      where: {
        key: args.key,
      },
      data: {
        token: args.token ? args.token : undefined,
        revoke: typeof args.revoke === 'boolean' ? args.revoke : undefined,
        revokedAt: typeof args.revoke === 'boolean' ? new Date() : undefined,
      },
    });
  }

  public async getRevokeTokens(): Promise<string[]> {
    return (
      await this.dbClient.token.findMany({
        where: {
          revoke: true,
          NOT: [{ token: null }],
        },
        select: {
          token: true,
        },
      })
    ).map((t) => t.token) as string[];
  }

  /**
   * Prisma return null if it can't find the record.
   */
  public getReasonById(id: number): Promise<ReasonModel | null> {
    return this.dbClient.reason.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        text: true,
        updatedAt: true,
      },
    });
  }

  public getReasonByText(text: string): Promise<ReasonModel | null> {
    return this.dbClient.reason.findUnique({
      where: {
        text,
      },
      select: {
        id: true,
        text: true,
        updatedAt: true,
      },
    });
  }

  public createReason(
    args: MutationCreateReasonArgs,
    transactions?: Omit<MutationCreateTransactionArgs, 'reasonText'>[]
  ): Promise<ReasonModel & { transactions?: TransactionModel[] }> {
    return this.dbClient.reason.create({
      include: { transactions: true },
      data: {
        text: args.text,
        updatedAt: new Date(),
        transactions: transactions?.length
          ? {
              create: transactions,
            }
          : undefined,
      },
    });
  }

  public updateReason(args: MutationUpdateReasonArgs): Promise<ReasonModel> {
    return this.dbClient.reason.update({
      include: {
        transactions: true,
      },
      data: {
        text: args.text ? args.text : undefined,
        updatedAt: new Date(),
      },
      where: {
        id: args.id,
      },
    });
  }

  public async deleteReason(args: MutationDeleteReasonArgs): Promise<void> {
    await this.dbClient.reason.delete({
      where: {
        id: args.id,
      },
    });
  }
}

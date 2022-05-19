import { DataSource } from 'apollo-datasource';
import { PrismaClient } from '@prisma/client';

import { ReasonModel } from '@schema/types';

/**
 * To prevent querying reason multiple times, we'll store whole reason list in memory for fast accessing.
 * If there is a reason record that is not in the memory list, give it a change to re-fetch whole memory list
 * before returning undefined.
 */
export class ReasonDS extends DataSource {
  dbClient: PrismaClient;
  cache: Record<string, ReasonModel>;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
    this.cache = {};
  }

  public async _get(text: string): Promise<ReasonModel | undefined> {
    if (this.cache[text]) return this.cache[text];

    this.cache = Object.fromEntries((await this.getReasons()).map((r) => [r.text, r]));

    return this.cache[text];
  }

  public getReasons(): Promise<ReasonModel[]> {
    return this.dbClient.reason.findMany({
      orderBy: [
        {
          text: 'asc',
        },
      ],
      select: {
        id: true,
        text: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  }

  public getReasonsByTransactionId({
    transactionId,
  }: {
    transactionId: number;
  }): Promise<ReasonModel[]> {
    return this.dbClient.reason.findMany({
      orderBy: [
        {
          text: 'asc',
        },
      ],
      select: {
        id: true,
        text: true,
        updatedAt: true,
        createdAt: true,
      },
      where: {
        transactions: {
          some: {
            transactionId,
          },
        },
      },
    });
  }

  public async getReasonById(id: number): Promise<ReasonModel | null> {
    return this.dbClient.reason.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        text: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  }

  public getReasonByText(text: string): Promise<ReasonModel | undefined> {
    return this._get(text);
  }

  public async getOrCreateReasons(texts: string[]): Promise<ReasonModel[]> {
    const newReasonTexts = texts.filter((r) => !this._get(r));
    const dt = new Date();

    this.dbClient.reason.createMany({
      data: newReasonTexts.map((t) => ({ text: t, createdAt: dt, updatedAt: dt })),
    });

    return texts.map((t) => this._get(t) as unknown) as ReasonModel[];
  }
}
